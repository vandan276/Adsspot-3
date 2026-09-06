const http = require('http');

function postRequest(path, body, cookie = '') {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(body);
    const req = http.request(
      {
        hostname: 'localhost',
        port: 3000,
        path,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(data),
          Cookie: cookie,
        },
      },
      (res) => {
        let responseBody = '';
        res.on('data', (chunk) => (responseBody += chunk));
        res.on('end', () => {
          let parsed;
          try {
            parsed = JSON.parse(responseBody);
          } catch (e) {
            parsed = responseBody;
          }
          resolve({
            status: res.statusCode,
            headers: res.headers,
            data: parsed,
            cookies: res.headers['set-cookie'],
          });
        });
      }
    );
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

function getRequest(path, cookie = '') {
  return new Promise((resolve, reject) => {
    const req = http.request(
      {
        hostname: 'localhost',
        port: 3000,
        path,
        method: 'GET',
        headers: {
          Cookie: cookie,
        },
      },
      (res) => {
        let responseBody = '';
        res.on('data', (chunk) => (responseBody += chunk));
        res.on('end', () => {
          let parsed;
          try {
            parsed = JSON.parse(responseBody);
          } catch (e) {
            parsed = responseBody;
          }
          resolve({
            status: res.statusCode,
            headers: res.headers,
            data: parsed,
          });
        });
      }
    );
    req.on('error', reject);
    req.end();
  });
}

async function runTests() {
  console.log('====================================================');
  console.log('🧪 VERIFYING MERCHANT MEMBERSHIP & PAYMENT FLOW');
  console.log('====================================================\n');

  let passed = 0;
  let total = 0;

  function assert(condition, message) {
    total++;
    if (condition) {
      console.log(`  ✅ [PASS] ${message}`);
      passed++;
    } else {
      console.error(`  ❌ [FAIL] ${message}`);
    }
  }

  try {
    const testEmail = `store_${Date.now()}@testmerchant.in`;
    const testPassword = 'Password@123';
    const testName = 'Shree Krishna Sweets';
    const testPhone = `+9198${Math.floor(10000000 + Math.random() * 90000000)}`;

    console.log(`1. Signing up user as Merchant (${testEmail})...`);
    const signupRes = await postRequest('/api/auth/email', {
      action: 'signup',
      email: testEmail,
      password: testPassword,
      name: testName,
      phone: testPhone,
      role: 'merchant',
    });

    assert(signupRes.status === 200 && signupRes.data.success, 'Merchant user created successfully');
    assert(signupRes.cookies && signupRes.cookies.length > 0, 'HttpOnly session cookie returned');

    const sessionCookie = signupRes.cookies ? signupRes.cookies[0].split(';')[0] : '';
    console.log(`   Session cookie acquired: ${sessionCookie.substring(0, 30)}...`);

    console.log('\n2. Verifying user state before payment at /api/user/me...');
    const meBeforePayment = await getRequest('/api/user/me', sessionCookie);
    assert(meBeforePayment.status === 200 && meBeforePayment.data.success && meBeforePayment.data.user, 'User is authenticated');
    assert(
      !meBeforePayment.data.user.business_profile,
      'Merchant has NO active paid business profile before checkout'
    );

    console.log('\n3. Executing Razorpay Membership Payment for PREMIUM Tier (₹2,499)...');
    const paymentId = `pay_rzp_test_${Date.now()}`;
    const subscribeRes = await postRequest(
      '/api/merchants/subscribe',
      {
        tier: 'premium',
        billingCycle: 'monthly',
        bizName: 'Shree Krishna Sweets & Farsan',
        ownerName: testName,
        phone: testPhone,
        categoryId: 'cat-1',
        address: 'MG Road, Ghatkopar East, Mumbai',
        pincode: '400077',
        paymentMethod: 'UPI',
        paymentId: paymentId,
        amount: 2499,
      },
      sessionCookie
    );

    assert(subscribeRes.status === 200 && subscribeRes.data.success, 'Subscription and payment recorded successfully');
    assert(subscribeRes.data.business && subscribeRes.data.business.tier === 'premium', 'Business created with PREMIUM tier');
    assert(subscribeRes.data.business.trusted === true, 'Premium tier granted green "Trusted" badge');
    assert(subscribeRes.data.subscription && subscribeRes.data.subscription.status === 'active', 'Subscription marked active');
    assert(subscribeRes.data.subscription.plan_id === 'plan-premium', 'Subscription mapped to plan-premium');

    console.log('\n4. Verifying user state after payment at /api/user/me...');
    const meAfterPayment = await getRequest('/api/user/me', sessionCookie);
    console.log('   meAfterPayment status:', meAfterPayment.status);
    console.log('   meAfterPayment body:', JSON.stringify(meAfterPayment.data, null, 2));

    assert(meAfterPayment.status === 200 && meAfterPayment.data && meAfterPayment.data.user, 'User authenticated');
    assert(meAfterPayment.data?.user?.business_profile !== null, 'User now HAS active business profile');
    assert(meAfterPayment.data?.user?.business_profile?.tier === 'premium', 'Active tier is verified as PREMIUM');
    assert(meAfterPayment.data?.user?.business_profile?.name === 'Shree Krishna Sweets & Farsan', 'Business name persisted correctly');

    console.log('\n5. Testing self-serve upgrade from PREMIUM to ELITE (₹4,999)...');
    const upgradePayId = `pay_rzp_upgrade_${Date.now()}`;
    const upgradeRes = await postRequest(
      '/api/merchants/subscribe',
      {
        tier: 'elite',
        billingCycle: 'monthly',
        bizName: 'Shree Krishna Sweets & Farsan',
        ownerName: testName,
        phone: testPhone,
        categoryId: 'cat-1',
        address: 'MG Road, Ghatkopar East, Mumbai',
        pincode: '400077',
        paymentMethod: 'CARD',
        paymentId: upgradePayId,
        amount: 4999,
      },
      sessionCookie
    );

    console.log('   upgradeRes status:', upgradeRes.status);
    console.log('   upgradeRes body:', JSON.stringify(upgradeRes.data, null, 2));

    assert(upgradeRes.status === 200 && upgradeRes.data && upgradeRes.data.success, 'Upgrade to Elite tier processed successfully');
    assert(upgradeRes.data?.business?.tier === 'elite', 'Business updated to ELITE tier');

    const meAfterUpgrade = await getRequest('/api/user/me', sessionCookie);
    assert(meAfterUpgrade.data.user.business_profile.tier === 'elite', 'User state reflects ELITE tier');

    console.log('\n====================================================');
    console.log(`🏁 TEST RESULTS: ${passed}/${total} assertions passed (${Math.round((passed / total) * 100)}%)`);
    console.log('====================================================\n');
  } catch (err) {
    console.error('Fatal test error:', err);
  }
}

runTests();
