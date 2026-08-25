'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthUser, UserRole, LoginDemoPersona, StaffProfile, Business } from '@adsspot/types';
import {
  DEMO_PERSONAS,
  SEED_USERS,
  SEED_STAFF_PROFILES,
  SEED_BUSINESSES,
} from '../seedData';

interface AddEmployeeInput {
  name: string;
  phone: string;
  role: 'sm' | 'ro' | 'zo' | 'super_admin';
  city_id?: string;
  region_id?: string;
  pincode?: string;
  target_monthly?: number;
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

  // Helper to construct fully hydrated AuthUser
  const buildAuthUser = (userId: string): AuthUser | null => {
    const baseUser =
      personas.find((p) => p.id === userId) ||
      SEED_USERS.find((u) => u.id === userId);

    if (!baseUser) return null;

    const staffProfile = staffList.find((s) => s.user_id === userId) || null;
    const businessProfile = merchantList.find((b) => b.owner_id === userId) || null;

    return {
      id: baseUser.id,
      phone: baseUser.phone,
      full_name: (baseUser as any).name || (baseUser as any).full_name || 'User',

      avatar_url: baseUser.avatar_url,
      role: baseUser.role,
      created_at: (baseUser as any).created_at || new Date().toISOString(),
      updated_at: new Date().toISOString(),
      staff_profile: staffProfile,
      business_profile: businessProfile,
      wallet: {
        id: `wallet-${userId}`,
        user_id: userId,
        balance: 1540.0,
        currency: 'INR',
        updated_at: new Date().toISOString(),
      },
    };
  };

  // Load custom stored staff and merchants on mount
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        const storedPersonas = localStorage.getItem(CUSTOM_USERS_KEY);
        const storedStaff = localStorage.getItem(CUSTOM_STAFF_KEY);
        const storedMerchants = localStorage.getItem(CUSTOM_MERCHANTS_KEY);

        if (storedPersonas) {
          const parsed = JSON.parse(storedPersonas);
          setPersonas(parsed);
        }
        if (storedStaff) {
          const parsed = JSON.parse(storedStaff);
          setStaffList(parsed);
        }
        if (storedMerchants) {
          const parsed = JSON.parse(storedMerchants);
          setMerchantList(parsed);
        }

        const savedUserId = localStorage.getItem(AUTH_STORAGE_KEY);
        if (savedUserId) {
          const found = buildAuthUser(savedUserId);
          if (found) {
            setUser(found);
          } else {
            setUser(buildAuthUser('usr-consumer-1'));
          }
        } else {
          setUser(buildAuthUser('usr-consumer-1'));
        }
      }
    } catch {
      setUser(buildAuthUser('usr-consumer-1'));
    } finally {
      setIsLoading(false);
    }
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

    // Check if user already exists
    let matchedPersona = personas.find((p) => p.phone === phone || p.phone.replace(/[^0-9]/g, '') === phone.replace(/[^0-9]/g, ''));

    // If new real user, dynamically register them as a Consumer
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

  const addEmployee = (input: AddEmployeeInput): AuthUser => {
    const newUserId = `usr-staff-${Date.now()}`;
    const formattedPhone = input.phone.startsWith('+91') ? input.phone : `+91${input.phone}`;

    const newPersona: LoginDemoPersona = {
      id: newUserId,
      name: input.name,
      phone: formattedPhone,
      role: input.role,
      description: `${input.role.toUpperCase()} • ${input.city_id || 'Mumbai'} • ${input.pincode || '400001'}`,
      avatar_url:
        input.avatar_url ||
        `https://images.unsplash.com/photo-${1534528741775 + Math.floor(Math.random() * 1000)}?w=150&auto=format&fit=crop&q=80`,
    };

    const newStaffProfile: StaffProfile = {
      id: `staff-${Date.now()}`,
      user_id: newUserId,
      role: input.role,
      reports_to: input.role === 'sm' ? 'staff-ro-1' : input.role === 'ro' ? 'staff-zo-1' : null,
      city_id: input.city_id || 'city-mum',
      region_id: input.region_id || 'reg-mum-south',
      target_monthly: input.target_monthly || 250000,
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
        balance: 5000.0,
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
