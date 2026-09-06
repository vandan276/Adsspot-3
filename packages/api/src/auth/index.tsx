'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { AuthUser, UserRole, DashboardType, StaffProfile, Business, Role } from '@adsspot/types';

export interface AddEmployeeInput {
  name: string;
  email: string;
  password?: string;
  phone: string;
  role: 'sm' | 'ro' | 'zo' | 'super_admin' | string;
  role_id?: string;
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

export interface AddMerchantInput {
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
  logo_url?: string;
  cover_url?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  role: UserRole;
  dashboardType: DashboardType;
  permissions: string[];
  hasPermission: (key: string) => boolean;
  isAuthenticated: boolean;
  isLoading: boolean;
  loginWithEmail: (
    email: string,
    password?: string,
    phone?: string
  ) => Promise<{ success: boolean; user?: AuthUser; error?: string; destination?: string }>;
  signupWithEmail: (
    name: string,
    email: string,
    password?: string,
    phone?: string,
    role?: UserRole
  ) => Promise<{ success: boolean; user?: AuthUser; error?: string; destination?: string }>;
  loginWithPhone: (phone: string) => Promise<{ success: boolean; message: string }>;
  verifyOtp: (
    phone: string,
    otp: string
  ) => Promise<{ success: boolean; user?: AuthUser; error?: string; destination?: string }>;
  addEmployee: (input: AddEmployeeInput) => Promise<AuthUser>;
  addMerchant: (input: AddMerchantInput) => Promise<{ user: AuthUser; business: Business }>;
  logout: () => Promise<void>;
  refreshAuth: () => Promise<void>;
  staffList: StaffProfile[];
  merchantList: Business[];
  rolesList: Role[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [permissions, setPermissions] = useState<string[]>([]);
  const [staffList, setStaffList] = useState<StaffProfile[]>([]);
  const [merchantList, setMerchantList] = useState<Business[]>([]);
  const [rolesList, setRolesList] = useState<Role[]>([]);

  // 1. Initial server-side session authentication check
  const refreshAuth = useCallback(async () => {
    try {
      // Check current session from /api/user/me
      const storedToken = typeof window !== 'undefined' ? localStorage.getItem('adsspot_session_token') : null;
      const headers: Record<string, string> = { 'Cache-Control': 'no-cache' };
      if (storedToken) {
        headers['x-session-token'] = storedToken;
        headers['authorization'] = `Bearer ${storedToken}`;
      }

      const res = await fetch('/api/user/me', { headers });

      if (res.ok) {
        const data = await res.json();
        if (data.success && data.user) {
          const authUser: AuthUser = data.user;
          setUser(authUser);
          setPermissions(data.permissions || authUser.permissions || []);
        } else {
          setUser(null);
          setPermissions([]);
          if (typeof window !== 'undefined') {
            try {
              localStorage.removeItem('adsspot_session_token');
              localStorage.removeItem('adsspot_auth_user');
            } catch {}
          }
        }
      } else {
        setUser(null);
        setPermissions([]);
        if (typeof window !== 'undefined') {
          try {
            localStorage.removeItem('adsspot_session_token');
            localStorage.removeItem('adsspot_auth_user');
          } catch {}
        }
      }

      // Load merchants from PostgreSQL
      try {
        const merchRes = await fetch('/api/merchants');
        if (merchRes.ok) {
          const merchData = await merchRes.json();
          if (merchData.success && Array.isArray(merchData.merchants)) {
            setMerchantList(merchData.merchants);
          }
        }
      } catch {}

      // Load staff from PostgreSQL
      try {
        const staffRes = await fetch('/api/staff');
        if (staffRes.ok) {
          const staffData = await staffRes.json();
          if (staffData.success && Array.isArray(staffData.staff)) {
            setStaffList(staffData.staff);
          }
        }
      } catch {}

      // Load roles from PostgreSQL
      try {
        const rolesRes = await fetch('/api/roles');
        if (rolesRes.ok) {
          const rolesData = await rolesRes.json();
          if (rolesData.success && Array.isArray(rolesData.roles)) {
            setRolesList(rolesData.roles);
          }
        }
      } catch {}
    } catch (err) {
      console.warn('[AuthProvider] Failed to initialize session from server:', err);
      setUser(null);
      setPermissions([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshAuth();
  }, [refreshAuth]);

  // Permission checker
  const hasPermission = useCallback(
    (key: string): boolean => {
      if (!user) return false;
      if (user.role === 'super_admin' || user.role_id === 'role-super-admin') return true;
      return permissions.includes(key);
    },
    [user, permissions]
  );

  // Helper to determine destination URL
  const getDestination = (role: string, dashboardType?: string): string => {
    if (dashboardType === 'admin' || role === 'super_admin') return '/admin';
    if (dashboardType === 'merchant' || role === 'merchant') return '/merchant';
    if (dashboardType === 'sm' || role === 'sm') return '/sm';
    if (dashboardType === 'ro' || role === 'ro') return '/ro';
    if (dashboardType === 'zo' || role === 'zo') return '/zo';
    if (dashboardType === 'employee') return '/sm';
    return '/feed';
  };

  // Login with Email & Password
  const loginWithEmail = async (
    email: string,
    password?: string,
    phone?: string
  ): Promise<{ success: boolean; user?: AuthUser; error?: string; destination?: string }> => {
    try {
      const cleanEmail = email.trim().toLowerCase();
      const res = await fetch('/api/auth/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'login', email: cleanEmail, password, phone }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        return { success: false, error: data.error || 'Authentication failed. Please check your credentials.' };
      }

      const authUser: AuthUser = data.user;
      setUser(authUser);
      setPermissions(authUser.permissions || []);
      
      if (data.sessionToken && typeof window !== 'undefined') {
        try {
          localStorage.setItem('adsspot_session_token', data.sessionToken);
          localStorage.setItem('adsspot_auth_user', JSON.stringify(authUser));
          document.cookie = `adsspot_session=${encodeURIComponent(data.sessionToken)}; Path=/; Max-Age=2592000; SameSite=Lax`;
        } catch {}
      }

      const destination = data.destination || getDestination(authUser.role, authUser.dashboard_type);
      return { success: true, user: authUser, destination };
    } catch (e: any) {
      return { success: false, error: e?.message || 'Login failed.' };
    }
  };

  // Signup with Email
  const signupWithEmail = async (
    name: string,
    email: string,
    password?: string,
    phone?: string,
    role: UserRole = 'consumer'
  ): Promise<{ success: boolean; user?: AuthUser; error?: string; destination?: string }> => {
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

      const data = await res.json();
      if (!res.ok || !data.success) {
        return { success: false, error: data.error || 'Signup failed.' };
      }

      const authUser: AuthUser = data.user;
      setUser(authUser);
      setPermissions(authUser.permissions || []);
      const destination = getDestination(authUser.role, authUser.dashboard_type);

      return { success: true, user: authUser, destination };
    } catch (e: any) {
      return { success: false, error: e?.message || 'Signup failed.' };
    }
  };

  // Login with Phone
  const loginWithPhone = async (phone: string): Promise<{ success: boolean; message: string }> => {
    return { success: true, message: `OTP sent to ${phone}. (Use test OTP: 123456)` };
  };

  // Verify OTP
  const verifyOtp = async (
    phone: string,
    otp: string
  ): Promise<{ success: boolean; user?: AuthUser; error?: string; destination?: string }> => {
    if (otp !== '123456' && otp.length !== 6) {
      return { success: false, error: 'Invalid OTP code. Please enter 123456 for instant verification.' };
    }

    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, otp }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        return { success: false, error: data.error || 'OTP verification failed.' };
      }

      const authUser: AuthUser = data.user;
      setUser(authUser);
      setPermissions(authUser.permissions || []);
      const destination = data.destination || getDestination(authUser.role, authUser.dashboard_type);

      return { success: true, user: authUser, destination };
    } catch (e: any) {
      return { success: false, error: e?.message || 'Verification failed.' };
    }
  };

  // Add Employee (Admin only)
  const addEmployee = async (input: AddEmployeeInput): Promise<AuthUser> => {
    const cleanPhone = (input.phone || '').trim().replace(/\s+/g, '');
    const formattedPhone = cleanPhone ? (cleanPhone.startsWith('+91') ? cleanPhone : `+91${cleanPhone}`) : `+91${Math.floor(1000000000 + Math.random() * 9000000000)}`;
    const cleanEmail = (input.email || `${input.name.toLowerCase().replace(/[^a-z0-9]/g, '')}@adsspot.in`).trim().toLowerCase();

    const res = await fetch('/api/staff', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: input.name,
        email: cleanEmail,
        password: input.password || undefined,
        phone: formattedPhone,
        role: input.role,
        role_id: input.role_id,
        city_id: input.city_id || input.ro_city || 'Vadodara',
        region_id: input.region_id || input.area_name || input.cluster_name || 'Central Gujarat',
        reports_to: input.reports_to || null,
        target_monthly: input.target_monthly || input.zone_target || 250000,
      }),
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error || 'Failed to onboard staff member in database');
    }

    const createdStaff: StaffProfile = data.staff_profile;
    setStaffList((prev) => [createdStaff, ...prev.filter((s) => s.user_id !== data.user.id)]);

    const createdAuthUser: AuthUser = {
      id: data.user.id,
      phone: formattedPhone,
      email: cleanEmail,
      full_name: input.name,
      avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(cleanEmail)}`,
      role: (input.role as UserRole) || 'sm',
      role_id: input.role_id || `role-${input.role}`,
      dashboard_type: (input.role as DashboardType) || 'sm',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      staff_profile: createdStaff,
      business_profile: null,
      wallet: {
        id: `wallet-${data.user.id}`,
        user_id: data.user.id,
        balance: 0.0,
        currency: 'INR',
        updated_at: new Date().toISOString(),
      },
    };

    return createdAuthUser;
  };

  // Add Merchant with Real PostgreSQL Database Persistence
  const addMerchant = async (input: AddMerchantInput): Promise<{ user: AuthUser; business: Business }> => {
    const formattedPhone = input.phone.startsWith('+91') ? input.phone : `+91${input.phone}`;

    const res = await fetch('/api/merchants/onboard', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        bizName: input.business_name,
        ownerName: input.owner_name,
        phone: formattedPhone,
        categoryId: input.category_id,
        address: input.address,
        pincode: input.pincode,
        tier: input.tier,
        trusted: input.trusted,
        lat: input.lat,
        lng: input.lng,
      }),
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error || 'Failed to persist merchant in database.');
    }

    const newBusiness: Business = data.business;
    const merchantUser: AuthUser = data.user;

    setMerchantList((prev) => [newBusiness, ...prev.filter((b) => b.id !== newBusiness.id)]);

    return { user: merchantUser, business: newBusiness };
  };

  // Logout
  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch {}
    setUser(null);
    setPermissions([]);
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem('adsspot_session_token');
        localStorage.removeItem('adsspot_auth_user');
        document.cookie = 'adsspot_session=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
      } catch {}
      window.location.href = '/login';
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || 'consumer',
        dashboardType: user?.dashboard_type || (user?.role === 'super_admin' ? 'admin' : user?.role === 'merchant' ? 'merchant' : user?.role === 'sm' ? 'sm' : user?.role === 'ro' ? 'ro' : user?.role === 'zo' ? 'zo' : 'user'),
        permissions,
        hasPermission,
        isAuthenticated: !!user,
        isLoading,
        loginWithEmail,
        signupWithEmail,
        loginWithPhone,
        verifyOtp,
        addEmployee,
        addMerchant,
        logout,
        refreshAuth,
        staffList,
        merchantList,
        rolesList,
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
