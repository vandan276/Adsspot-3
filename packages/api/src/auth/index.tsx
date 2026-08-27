'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthUser, UserRole, LoginDemoPersona, StaffProfile, Business } from '@adsspot/types';
import {
  DEMO_PERSONAS,
  SEED_USERS,
  SEED_STAFF_PROFILES,
  SEED_BUSINESSES,
} from '../seedData';

export interface AddEmployeeInput {
  name: string;
  email: string;
  password?: string;
  phone: string;
  role: 'sm' | 'ro' | 'zo' | 'super_admin';
  employee_code?: string;
  joining_date?: string;
  salary_monthly?: number;
  target_monthly?: number;

  // Specific for SM (Sales Manager):
  pincodes?: string;
  area_name?: string;
  city_id?: string;
  region_id?: string;
  reports_to?: string;
  daily_visit_target?: number;
  commission_rate?: number;
  gps_tracking_enabled?: boolean;

  // Specific for RO (Regional Officer):
  cluster_name?: string;
  ro_city?: string;
  ro_zo_id?: string;
  override_incentive?: number;
  travel_allowance?: number;

  // Specific for ZO (Zone Officer):
  zone_state?: string;
  metro_hq?: string;
  zone_target?: number;
  zone_budget?: number;

  // Banking & Emergency:
  emergency_name?: string;
  emergency_phone?: string;
  bank_account?: string;
  ifsc?: string;
  upi_id?: string;
  pan_aadhaar?: string;

  avatar_url?: string;
}

interface AddMerchantInput {
  business_name: string;
  owner_name: string;
  phone: string;
  category_id: string;
  address: string;
  pincode: string;
  tier: 'basic' | 'premium' | 'elite';
  trusted?: boolean;
  lat?: number;
  lng?: number;
}

interface AuthContextType {
  user: AuthUser | null;
  role: UserRole;
  isAuthenticated: boolean;
  isLoading: boolean;
  loginWithEmail: (email: string, password?: string, phone?: string) => Promise<{ success: boolean; user?: AuthUser; error?: string }>;
  signupWithEmail: (name: string, email: string, password?: string, phone?: string, role?: UserRole) => Promise<{ success: boolean; user?: AuthUser; error?: string }>;
  loginWithPhone: (phone: string) => Promise<{ success: boolean; message: string }>;
  verifyOtp: (phone: string, otp: string) => Promise<{ success: boolean; user?: AuthUser; error?: string }>;
  switchPersona: (personaId: string) => void;
  addEmployee: (input: AddEmployeeInput) => AuthUser;
  addMerchant: (input: AddMerchantInput) => { user: AuthUser; business: Business };
  logout: () => void;
  personas: LoginDemoPersona[];
  staffList: StaffProfile[];
  merchantList: Business[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = 'adsspot_auth_user_id';
const CUSTOM_USERS_KEY = 'adsspot_custom_users';
const CUSTOM_STAFF_KEY = 'adsspot_custom_staff';
const CUSTOM_MERCHANTS_KEY = 'adsspot_custom_merchants';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [personas, setPersonas] = useState<LoginDemoPersona[]>(DEMO_PERSONAS);
  const [staffList, setStaffList] = useState<StaffProfile[]>(SEED_STAFF_PROFILES);
  const [merchantList, setMerchantList] = useState<Business[]>(SEED_BUSINESSES);

  // Helper to construct fully hydrated AuthUser with per-user wallet
  const buildAuthUser = (userId: string): AuthUser | null => {
    const baseUser =
      personas.find((p) => p.id === userId) ||
      SEED_USERS.find((u) => u.id === userId);

    if (!baseUser) return null;

    const staffProfile = staffList.find((s) => s.user_id === userId) || null;
    const businessProfile = merchantList.find((b) => b.owner_id === userId) || null;

    // Retrieve per-user custom wallet balance or initialize based on role (new user = 0.00)
    let userBalance = 0.0;
    if (typeof window !== 'undefined') {
      const storedWallet = localStorage.getItem(`adsspot_wallet_${userId}`);
      if (storedWallet !== null) {
        userBalance = parseFloat(storedWallet);
      } else {
        userBalance = 0.0;
        localStorage.setItem(`adsspot_wallet_${userId}`, userBalance.toString());
      }
    }

    const isSuperAdmin = userId === 'usr-admin-1' || baseUser.role === 'super_admin';
    const computedName = isSuperAdmin ? 'Adsspot Admin' : ((baseUser as any).name || (baseUser as any).full_name || 'User');

    return {
      id: baseUser.id,
      phone: baseUser.phone,
      full_name: computedName,
      avatar_url: baseUser.avatar_url,
      role: baseUser.role,
      created_at: (baseUser as any).created_at || new Date().toISOString(),
      updated_at: new Date().toISOString(),
      staff_profile: staffProfile,
      business_profile: businessProfile,
      wallet: {
        id: `wallet-${userId}`,
        user_id: userId,
        balance: userBalance,
        currency: 'INR',
        updated_at: new Date().toISOString(),
      },
    };
  };

  // Load user and real database profile on mount
  useEffect(() => {
    async function initAuth() {
      try {
        if (typeof window !== 'undefined') {
          // 0. Clean legacy mock personas from localStorage
          const savedUsers = localStorage.getItem(CUSTOM_USERS_KEY);
          if (savedUsers) {
            try {
              const parsed = JSON.parse(savedUsers);
              if (Array.isArray(parsed)) {
                const sanitized = parsed
                  .filter((p: any) => !p.id.startsWith('usr-consumer') && !p.id.startsWith('usr-merch') && !p.id.startsWith('usr-sm') && !p.id.startsWith('usr-ro') && !p.id.startsWith('usr-zo'))
                  .map((p: any) => p.id === 'usr-admin-1' ? { ...p, name: 'Adsspot Admin', email: 'admin@adsspot.in' } : p);
                
                if (!sanitized.find((p: any) => p.id === 'usr-admin-1')) {
                  sanitized.unshift(DEMO_PERSONAS[0]);
                }
                setPersonas(sanitized);
                localStorage.setItem(CUSTOM_USERS_KEY, JSON.stringify(sanitized));
              }
            } catch {}
          } else {
            setPersonas(DEMO_PERSONAS);
            localStorage.setItem(CUSTOM_USERS_KEY, JSON.stringify(DEMO_PERSONAS));
          }

          // Fetch live staff from PostgreSQL database
          try {
            const staffRes = await fetch('/api/staff');
            if (staffRes.ok) {
              const staffData = await staffRes.json();
              if (staffData.success && Array.isArray(staffData.staff)) {
                setStaffList(staffData.staff);
                localStorage.setItem(CUSTOM_STAFF_KEY, JSON.stringify(staffData.staff));

                const staffPersonas = staffData.staff.map((s: any) => ({
                  id: s.user_id,
                  name: s.user?.full_name || `Staff ${s.id.slice(-4)}`,
                  email: s.user?.email || '',
                  phone: s.user?.phone || '',
                  role: s.role,
                  description: `${s.role.toUpperCase()} • ${s.region_id || s.city_id || 'Territory'}`,
                  avatar_url: s.user?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
                }));
                setPersonas((prev) => {
                  const existingAdmin = prev.find((p) => p.id === 'usr-admin-1');
                  return [existingAdmin || DEMO_PERSONAS[0], ...staffPersonas];
                });
              }
            }
          } catch (e) {
            console.warn('Failed to load staff from API:', e);
          }

          // Fetch live merchants from PostgreSQL database
          try {
            const merchRes = await fetch('/api/merchants');
            if (merchRes.ok) {
              const merchData = await merchRes.json();
              if (merchData.success && Array.isArray(merchData.merchants)) {
                setMerchantList(merchData.merchants);
                localStorage.setItem(CUSTOM_MERCHANTS_KEY, JSON.stringify(merchData.merchants));
              }
            }
          } catch (e) {
            console.warn('Failed to load merchants from API:', e);
          }

          const savedUserId = localStorage.getItem(AUTH_STORAGE_KEY);
          if (savedUserId) {
            // 1. Fetch real user & merchant business profile from AWS Aurora DB
            try {
              const res = await fetch(`/api/user/me?userId=${encodeURIComponent(savedUserId)}`);
              if (res.ok) {
                const data = await res.json();
                if (data.success && data.user) {
                  const fetchedUser = {
                    ...data.user,
                    full_name: (data.user.role === 'super_admin' || data.user.id === 'usr-admin-1') ? 'Adsspot Admin' : data.user.full_name,
                  };
                  setUser(fetchedUser);
                  setIsLoading(false);
                  return;
                }
              }
            } catch (apiErr) {
              console.warn('[AuthProvider] Direct DB fetch fallback to local storage:', apiErr);
            }

            // Fallback to local persona if offline or DB syncing
            const fullUser = buildAuthUser(savedUserId);
            if (fullUser) {
              setUser(fullUser);
            } else {
              setUser(null);
            }
          } else {
            setUser(null);
          }
        }
      } catch {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    }

    initAuth();
  }, []);

  const loginWithPhone = async (phone: string): Promise<{ success: boolean; message: string }> => {
    return { success: true, message: `OTP sent to ${phone}. (Use test OTP: 123456)` };
  };

  const verifyOtp = async (
    phone: string,
    otp: string
  ): Promise<{ success: boolean; user?: AuthUser; error?: string }> => {
    if (otp !== '123456' && otp.length !== 6) {
      return { success: false, error: 'Invalid OTP code. Please enter 123456 for instant verification.' };
    }

    try {
      // 1. Sync with AWS Aurora PostgreSQL Database via API
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, otp }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success && data.user) {
          const dbUser: AuthUser = data.user;
          setUser(dbUser);
          if (typeof window !== 'undefined') {
            localStorage.setItem(AUTH_STORAGE_KEY, dbUser.id);
            localStorage.setItem(`adsspot_wallet_${dbUser.id}`, (dbUser.wallet?.balance || 0).toString());
          }
          return { success: true, user: dbUser };
        }
      }
    } catch (e) {
      console.warn('[AuthProvider] Failed to reach /api/auth/verify-otp, falling back to local session:', e);
    }

    // Fallback: Check if user already exists in persona list
    let matchedPersona = personas.find((p) => p.phone === phone || p.phone.replace(/[^0-9]/g, '') === phone.replace(/[^0-9]/g, ''));

    if (!matchedPersona) {
      const newUserId = `usr-real-${Date.now()}`;
      matchedPersona = {
        id: newUserId,
        name: `User ${phone.slice(-4)}`,
        phone: phone.startsWith('+91') ? phone : `+91${phone}`,
        role: 'consumer',
        description: 'Real registered consumer',
        avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${phone}`,
      };

      const updated = [matchedPersona, ...personas];
      setPersonas(updated);
      if (typeof window !== 'undefined') {
        localStorage.setItem(CUSTOM_USERS_KEY, JSON.stringify(updated));
      }
    }

    const fullUser = buildAuthUser(matchedPersona.id);
    if (fullUser) {
      setUser(fullUser);
      if (typeof window !== 'undefined') {
        localStorage.setItem(AUTH_STORAGE_KEY, fullUser.id);
      }
      return { success: true, user: fullUser };
    }

    return { success: false, error: 'Authentication failed.' };
  };

  const loginWithEmail = async (
    email: string,
    password?: string,
    phone?: string
  ): Promise<{ success: boolean; user?: AuthUser; error?: string }> => {
    try {
      const cleanEmail = email.trim().toLowerCase();
      // 1. Check PostgreSQL backend via /api/auth/email
      const res = await fetch('/api/auth/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'login', email: cleanEmail, password, phone }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success && data.user) {
          const authUser: AuthUser = {
            id: data.user.id,
            email: data.user.email || cleanEmail,
            phone: data.user.phone || phone || '+919876543210',
            full_name: data.user.full_name || 'User',
            avatar_url: data.user.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(cleanEmail)}`,
            role: data.user.role || 'consumer',
            created_at: data.user.created_at || new Date().toISOString(),
            updated_at: new Date().toISOString(),
            staff_profile: data.user.staff_profile || null,
            business_profile: data.user.business_profile || null,
            wallet: {
              id: `wallet-${data.user.id}`,
              user_id: data.user.id,
              balance: 1000.0,
              currency: 'INR',
              updated_at: new Date().toISOString(),
            },
          };

          setUser(authUser);
          if (typeof window !== 'undefined') {
            localStorage.setItem(AUTH_STORAGE_KEY, authUser.id);
          }
          return { success: true, user: authUser };
        }
      }

      // Fallback matching persona
      const matched = personas.find(
        (p) => p.email?.toLowerCase() === cleanEmail || cleanEmail.startsWith(p.role)
      );
      if (matched) {
        switchPersona(matched.id);
        const u = buildAuthUser(matched.id);
        return { success: true, user: u || undefined };
      }

      return { success: false, error: 'User not found. Please sign up.' };
    } catch (e: any) {
      return { success: false, error: e?.message || 'Login failed.' };
    }
  };

  const signupWithEmail = async (
    name: string,
    email: string,
    password?: string,
    phone?: string,
    role: UserRole = 'consumer'
  ): Promise<{ success: boolean; user?: AuthUser; error?: string }> => {
    try {
      const cleanEmail = email.trim().toLowerCase();
      const res = await fetch('/api/auth/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'signup',
          name,
          email: cleanEmail,
          password,
          phone,
          role,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success && data.user) {
          const authUser: AuthUser = {
            id: data.user.id,
            email: data.user.email || cleanEmail,
            phone: data.user.phone || phone || '+919876543210',
            full_name: data.user.full_name || name,
            avatar_url: data.user.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(cleanEmail)}`,
            role: data.user.role || role,
            created_at: data.user.created_at || new Date().toISOString(),
            updated_at: new Date().toISOString(),
            staff_profile: null,
            business_profile: null,
            wallet: {
              id: `wallet-${data.user.id}`,
              user_id: data.user.id,
              balance: 0.0,
              currency: 'INR',
              updated_at: new Date().toISOString(),
            },
          };

          const newPersona: LoginDemoPersona = {
            id: authUser.id,
            name: authUser.full_name,
            email: authUser.email,
            phone: authUser.phone,
            role: authUser.role,
            description: `Registered ${authUser.role}`,
            avatar_url: authUser.avatar_url!,
          };

          const updated = [newPersona, ...personas];
          setPersonas(updated);
          setUser(authUser);
          if (typeof window !== 'undefined') {
            localStorage.setItem(CUSTOM_USERS_KEY, JSON.stringify(updated));
            localStorage.setItem(AUTH_STORAGE_KEY, authUser.id);
          }

          return { success: true, user: authUser };
        }
      }

      return { success: false, error: 'Signup failed. Please try again.' };
    } catch (e: any) {
      return { success: false, error: e?.message || 'Signup failed.' };
    }
  };

  const addEmployee = (input: AddEmployeeInput): AuthUser => {
    const newUserId = `usr-staff-${Date.now()}`;
    const cleanPhone = (input.phone || '').trim();
    const formattedPhone = cleanPhone ? (cleanPhone.startsWith('+91') ? cleanPhone : `+91${cleanPhone}`) : '+910000000000';
    const cleanEmail = (input.email || `${input.name.toLowerCase().replace(/[^a-z0-9]/g, '')}@adsspot.in`).trim().toLowerCase();

    const newPersona: LoginDemoPersona = {
      id: newUserId,
      name: input.name,
      email: cleanEmail,
      phone: formattedPhone,
      role: input.role,
      description: `${input.role.toUpperCase()} • ${input.city_id || input.ro_city || 'Territory'} • ${input.pincodes || input.area_name || input.cluster_name || ''}`,
      avatar_url:
        input.avatar_url ||
        `https://images.unsplash.com/photo-${1534528741775 + Math.floor(Math.random() * 1000)}?w=150&auto=format&fit=crop&q=80`,
    };

    const newStaffProfile: StaffProfile = {
      id: `staff-${Date.now()}`,
      user_id: newUserId,
      role: input.role,
      reports_to: input.reports_to || (input.role === 'sm' ? 'staff-ro-1' : input.role === 'ro' ? 'staff-zo-1' : null),
      city_id: input.city_id || input.ro_city || 'city-mum',
      region_id: input.region_id || input.area_name || input.cluster_name || 'reg-south',
      target_monthly: input.target_monthly || input.zone_target || 250000,
      status: 'active',
      created_at: new Date().toISOString(),
    };

    const updatedPersonas = [newPersona, ...personas];
    const updatedStaff = [newStaffProfile, ...staffList];

    setPersonas(updatedPersonas);
    setStaffList(updatedStaff);

    if (typeof window !== 'undefined') {
      localStorage.setItem(CUSTOM_USERS_KEY, JSON.stringify(updatedPersonas));
      localStorage.setItem(CUSTOM_STAFF_KEY, JSON.stringify(updatedStaff));
    }

    // Persist to PostgreSQL database asynchronously
    fetch('/api/staff', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: input.name,
        email: cleanEmail,
        password: input.password || 'adsspot123',
        phone: formattedPhone,
        role: input.role,
        city_id: input.city_id || input.ro_city || 'city-mum',
        region_id: input.region_id || input.area_name || input.cluster_name || 'reg-south',
        reports_to: input.reports_to || null,
        target_monthly: input.target_monthly || input.zone_target || 250000,
      }),
    }).catch((err) => console.warn('Failed to persist staff to DB:', err));

    const createdAuthUser: AuthUser = {
      id: newUserId,
      phone: formattedPhone,
      full_name: input.name,
      avatar_url: newPersona.avatar_url,
      role: input.role,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      staff_profile: newStaffProfile,
      business_profile: null,
      wallet: {
        id: `wallet-${newUserId}`,
        user_id: newUserId,
        balance: 0.0,
        currency: 'INR',
        updated_at: new Date().toISOString(),
      },
    };

    return createdAuthUser;
  };

  const addMerchant = (input: AddMerchantInput): { user: AuthUser; business: Business } => {
    const newOwnerId = `usr-merch-${Date.now()}`;
    const slug = input.business_name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
    const formattedPhone = input.phone.startsWith('+91') ? input.phone : `+91${input.phone}`;

    const newPersona: LoginDemoPersona = {
      id: newOwnerId,
      name: `${input.owner_name} (${input.business_name})`,
      phone: formattedPhone,
      role: 'merchant',
      tier: input.tier,
      description: `${input.tier.toUpperCase()} Merchant • ${input.address}`,
      avatar_url: `https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150`,
    };

    const newBusiness: Business = {
      id: `biz-${Date.now()}`,
      owner_id: newOwnerId,
      category_id: input.category_id,
      name: input.business_name,
      slug,
      description: `Verified authentic local shop on Adsspot in ${input.pincode}.`,
      address: input.address,
      pincode: input.pincode,
      lat: input.lat || 18.935 + (Math.random() * 0.02 - 0.01),
      lng: input.lng || 72.832 + (Math.random() * 0.02 - 0.01),
      phone: formattedPhone,
      whatsapp: formattedPhone,
      logo_url: `https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=200&auto=format&fit=crop&q=80`,
      cover_url: `https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&auto=format&fit=crop&q=80`,
      trusted: !!input.trusted,
      status: 'active',
      tier: input.tier,
      created_at: new Date().toISOString(),
      stats: {
        views_count: 100,
        likes_count: 24,
        followers_count: 12,
        reviews_count: 5,
        avg_rating: 5.0,
      },
    };

    const updatedPersonas = [newPersona, ...personas];
    const updatedMerchants = [newBusiness, ...merchantList];

    setPersonas(updatedPersonas);
    setMerchantList(updatedMerchants);

    if (typeof window !== 'undefined') {
      localStorage.setItem(CUSTOM_USERS_KEY, JSON.stringify(updatedPersonas));
      localStorage.setItem(CUSTOM_MERCHANTS_KEY, JSON.stringify(updatedMerchants));
    }

    const createdAuthUser: AuthUser = {
      id: newOwnerId,
      phone: formattedPhone,
      full_name: input.owner_name,
      avatar_url: newPersona.avatar_url,
      role: 'merchant',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      staff_profile: null,
      business_profile: newBusiness,
      wallet: {
        id: `wallet-${newOwnerId}`,
        user_id: newOwnerId,
        balance: 10000.0,
        currency: 'INR',
        updated_at: new Date().toISOString(),
      },
    };

    return { user: createdAuthUser, business: newBusiness };
  };

  const switchPersona = (personaId: string) => {
    const fullUser = buildAuthUser(personaId);
    if (fullUser) {
      setUser(fullUser);
      if (typeof window !== 'undefined') {
        localStorage.setItem(AUTH_STORAGE_KEY, fullUser.id);
      }
    }
  };

  const logout = () => {
    setUser(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || 'consumer',
        isAuthenticated: !!user,
        isLoading,
        loginWithEmail,
        signupWithEmail,
        loginWithPhone,
        verifyOtp,
        switchPersona,
        addEmployee,
        addMerchant,
        logout,
        personas,
        staffList,
        merchantList,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
