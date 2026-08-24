'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthUser, UserRole, LoginDemoPersona } from '@adsspot/types';
import {
  DEMO_PERSONAS,
  SEED_USERS,
  SEED_STAFF_PROFILES,
  SEED_BUSINESSES,
} from '../seedData';

interface AuthContextType {
  user: AuthUser | null;
  role: UserRole;
  isAuthenticated: boolean;
  isLoading: boolean;
  loginWithPhone: (phone: string) => Promise<{ success: boolean; message: string }>;
  verifyOtp: (phone: string, otp: string) => Promise<{ success: boolean; user?: AuthUser; error?: string }>;
  switchPersona: (personaId: string) => void;
  logout: () => void;
  personas: LoginDemoPersona[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = 'adsspot_auth_user_id';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Helper to construct fully hydrated AuthUser from seed/db
  const buildAuthUser = (userId: string): AuthUser | null => {
    const baseUser = SEED_USERS.find((u) => u.id === userId);
    if (!baseUser) return null;

    const staffProfile = SEED_STAFF_PROFILES.find((s) => s.user_id === userId) || null;
    const businessProfile = SEED_BUSINESSES.find((b) => b.owner_id === userId) || null;

    return {
      ...baseUser,
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

  useEffect(() => {
    try {
      const savedUserId = typeof window !== 'undefined' ? localStorage.getItem(AUTH_STORAGE_KEY) : null;
      if (savedUserId) {
        const found = buildAuthUser(savedUserId);
        if (found) {
          setUser(found);
        } else {
          // Default to Consumer persona
          setUser(buildAuthUser('usr-consumer-1'));
        }
      } else {
        // Default initial session to Aarav Sharma (Consumer)
        setUser(buildAuthUser('usr-consumer-1'));
      }
    } catch {
      setUser(buildAuthUser('usr-consumer-1'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loginWithPhone = async (phone: string): Promise<{ success: boolean; message: string }> => {
    // Standard mock OTP generation
    return { success: true, message: `OTP sent to ${phone}. (Use test OTP: 123456)` };
  };

  const verifyOtp = async (
    phone: string,
    otp: string
  ): Promise<{ success: boolean; user?: AuthUser; error?: string }> => {
    if (otp !== '123456' && otp.length !== 6) {
      return { success: false, error: 'Invalid OTP code. Please enter 123456 for testing.' };
    }

    const matchedPersona = DEMO_PERSONAS.find((p) => p.phone === phone) || DEMO_PERSONAS[0];
    if (!matchedPersona) {
      return { success: false, error: 'No user found with this phone number.' };
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
        logout,
        personas: DEMO_PERSONAS,
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
