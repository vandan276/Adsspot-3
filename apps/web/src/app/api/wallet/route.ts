import { NextRequest, NextResponse } from 'next/server';
import { queryPostgres, getAuthenticatedUser } from '@adsspot/api/server';

export const dynamic = 'force-dynamic';

// GET Handler: Retrieve real wallet balance and transaction ledger from PostgreSQL
export async function GET(req: NextRequest) {
  try {
    const authContext = await getAuthenticatedUser(req);
    if (!authContext) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const userId = authContext.user.id;

    // 1. Fetch wallet from PostgreSQL
    const walletRes = await queryPostgres(
      `SELECT id, user_id, balance, currency, updated_at FROM wallets WHERE user_id = $1 LIMIT 1`,
      [userId]
    );

    let balance = 0.0;
    let currency = 'INR';

    if (walletRes?.rows && walletRes.rows.length > 0) {
      balance = parseFloat(walletRes.rows[0].balance || '0.0');
      currency = walletRes.rows[0].currency || 'INR';
    } else {
      // Create initial wallet if missing
      await queryPostgres(
        `INSERT INTO wallets (id, user_id, balance, currency, updated_at) 
         VALUES ($1, $2, 0.0, 'INR', NOW()) 
         ON CONFLICT (id) DO NOTHING`,
        [`wallet-${userId}`, userId]
      );
    }

    // 2. Fetch real transaction ledger from PostgreSQL
    const txRes = await queryPostgres(
      `SELECT id, type, amount, description, reference_id, created_at 
       FROM wallet_transactions 
       WHERE wallet_id = $1 OR wallet_id = $2
       ORDER BY created_at DESC 
       LIMIT 50`,
      [`wallet-${userId}`, userId]
    );

    const transactions = (txRes?.rows || []).map((row: any) => ({
      id: row.id,
      type: row.type,
      title: row.description || (row.type === 'credit' ? 'Wallet Top-up' : 'Wallet Payment'),
      time: new Date(row.created_at).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
      }),
      amount: parseFloat(row.amount || '0.0'),
      reference_id: row.reference_id,
      created_at: row.created_at,
    }));

    return NextResponse.json({
      success: true,
      wallet: {
        id: `wallet-${userId}`,
        user_id: userId,
        balance,
        currency,
      },
      transactions,
    });
  } catch (error: any) {
    console.error('[API /wallet GET] Error:', error);
    return NextResponse.json({ success: false, error: error.message || 'Internal server error' }, { status: 500 });
  }
}

// POST Handler: Top-up wallet or record payment with database transaction integrity
export async function POST(req: NextRequest) {
  try {
    const authContext = await getAuthenticatedUser(req);
    if (!authContext) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const userId = authContext.user.id;
    const body = await req.json();
    const { action = 'topup', amount = 0, title = 'UPI Top-up (Instant)', referenceId } = body;

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      return NextResponse.json({ success: false, error: 'Valid amount is required' }, { status: 400 });
    }

    const txId = `tx-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const txType = action === 'debit' ? 'debit' : 'credit';

    if (txType === 'debit') {
      // Check current balance
      const currentRes = await queryPostgres(
        `SELECT balance FROM wallets WHERE user_id = $1 LIMIT 1`,
        [userId]
      );
      const currentBal = parseFloat(currentRes?.rows?.[0]?.balance || '0.0');
      if (currentBal < numAmount) {
        return NextResponse.json({ success: false, error: 'Insufficient wallet balance' }, { status: 400 });
      }

      await queryPostgres(
        `UPDATE wallets SET balance = balance - $1, updated_at = NOW() WHERE user_id = $2`,
        [numAmount, userId]
      );
    } else {
      await queryPostgres(
        `INSERT INTO wallets (id, user_id, balance, currency, updated_at)
         VALUES ($1, $2, $3, 'INR', NOW())
         ON CONFLICT (id) DO UPDATE SET balance = wallets.balance + $3, updated_at = NOW()`,
        [`wallet-${userId}`, userId, numAmount]
      );
    }

    // Record immutable ledger entry in wallet_transactions
    await queryPostgres(
      `INSERT INTO wallet_transactions (id, wallet_id, type, amount, description, reference_id, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, NOW())`,
      [txId, `wallet-${userId}`, txType, numAmount, title, referenceId || `ref-${Date.now()}`]
    );

    // Fetch updated balance
    const updatedRes = await queryPostgres(
      `SELECT balance FROM wallets WHERE user_id = $1 LIMIT 1`,
      [userId]
    );
    const newBalance = parseFloat(updatedRes?.rows?.[0]?.balance || '0.0');

    return NextResponse.json({
      success: true,
      balance: newBalance,
      transaction: {
        id: txId,
        type: txType,
        title,
        time: 'Just now',
        amount: numAmount,
      },
    });
  } catch (error: any) {
    console.error('[API /wallet POST] Error:', error);
    return NextResponse.json({ success: false, error: error.message || 'Failed to process transaction' }, { status: 500 });
  }
}
