'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@adsspot/api';
import { Button, Avatar } from '@adsspot/ui';
import { LayoutDashboard, LogIn, LogOut } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();

  const getPortalLink = () => {
    if (!user) return '/login';
    switch (user.role) {
      case 'super_admin':
        return '/admin';
      case 'zo':
        return '/zo';
      case 'ro':
        return '/ro';
      case 'sm':
        return '/sm';
      case 'merchant':
        return '/merchant';
      default:
        return '/';
    }
  };

  const getPortalLabel = () => {
    if (!user) return 'Login';
    switch (user.role) {
      case 'super_admin':
        return 'Admin Panel';
      case 'zo':
        return 'ZO City Panel';
      case 'ro':
        return 'RO Region Panel';
      case 'sm':
        return 'SM Field Portal';
      case 'merchant':
        return 'Merchant Studio';
      default:
        return 'Explore Feed';
    }
  };

  return (
    <header className="bg-white border-b border-[#E3E8EF] sticky top-[33px] z-40 shadow-sm backdrop-blur-md bg-white/95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo & Tagline */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center p-0.5" style={{ background: 'conic-gradient(from 0deg, #4787F2, #35AB4E, #F2B604, #981837, #4787F2)' }}>
            <div className="w-full h-full bg-[#17181C] rounded-[10px] flex items-center justify-center font-black text-white text-lg tracking-tighter group-hover:bg-[#4787F2] transition-colors">
              A<span className="text-[#F2B604]">.</span>
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-extrabold text-[#17181C] tracking-tight leading-none">
              Ads<span className="text-[#4787F2]">spot</span>
            </span>
            <span className="text-[10px] font-semibold text-[#687182] uppercase tracking-wider mt-0.5">
              Hyperlocal Discovery
            </span>
          </div>
        </Link>

        {/* Public Navigation */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-[#4A5260]">
          <Link href="/" className="hover:text-[#4787F2] transition-colors">
            Discover
          </Link>
          <Link href="/#pricing" className="hover:text-[#4787F2] transition-colors">
            Pricing & Tiers
          </Link>
          <Link href="/#mobile-app" className="hover:text-[#4787F2] transition-colors">
            Mobile App
          </Link>
          <Link href="/#roles" className="hover:text-[#4787F2] transition-colors">
            Hierarchy Roles
          </Link>
        </nav>

        {/* User / Action Buttons */}
        <div className="flex items-center gap-3">
          {isAuthenticated && user ? (
            <div className="flex items-center gap-3">
              <Link href={getPortalLink()}>
                <Button variant="primary" size="sm" leftIcon={<LayoutDashboard className="w-3.5 h-3.5" />}>
                  {getPortalLabel()}
                </Button>
              </Link>

              <div className="flex items-center gap-2 pl-2 border-l border-neutral-200">
                <Avatar
                  src={user.avatar_url}
                  name={user.full_name}
                  size="sm"
                  isElite={user.business_profile?.tier === 'elite'}
                />
                <div className="hidden lg:flex flex-col">
                  <span className="text-xs font-bold text-[#17181C] leading-none">{user.full_name}</span>
                  <span className="text-[10px] text-[#687182] capitalize">{user.role}</span>
                </div>
                <button
                  onClick={logout}
                  title="Logout"
                  className="text-neutral-400 hover:text-red-500 p-1 rounded-full transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <Link href="/login">
              <Button variant="primary" size="sm" leftIcon={<LogIn className="w-3.5 h-3.5" />}>
                Phone OTP Login
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};
