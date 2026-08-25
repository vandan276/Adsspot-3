'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@adsspot/api';
import { AdsspotLogoMark } from '@adsspot/ui';
import { Home, Wallet, Bookmark, User, Store, Crown, Shield, MapPin } from 'lucide-react';

export const FloatingMobileNav: React.FC = () => {
  const pathname = usePathname();
  const { user } = useAuth();

  const isHome = pathname === '/feed' || pathname === '/';
  const isWallet = pathname === '/wallet';
  const isExplore = pathname === '/explore';
  const isSaved = pathname === '/saved';
  const isProfile =
    pathname === '/profile' ||
    pathname === '/login' ||
    pathname.startsWith('/admin') ||
    pathname.startsWith('/merchant') ||
    pathname.startsWith('/sm') ||
    pathname.startsWith('/ro') ||
    pathname.startsWith('/zo');

  const getProfileLink = () => {
    if (!user) return '/profile';
    switch (user.role) {
      case 'merchant':
        return '/merchant';
      case 'super_admin':
        return '/admin';
      case 'sm':
        return '/sm';
      case 'ro':
        return '/ro';
      case 'zo':
        return '/zo';
      default:
        return '/profile';
    }
  };

  const getProfileLabel = () => {
    if (!user) return 'Profile';
    switch (user.role) {
      case 'merchant':
        return 'Studio';
      case 'super_admin':
        return 'Admin';
      case 'sm':
        return 'Field';
      case 'ro':
        return 'RO';
      case 'zo':
        return 'ZO';
      default:
        return 'Profile';
    }
  };

  const getProfileIcon = () => {
    if (!user) return <User className="w-4 h-4 stroke-[1.8]" />;
    switch (user.role) {
      case 'merchant':
        return <Store className="w-4 h-4 stroke-[1.8]" />;
      case 'super_admin':
        return <Crown className="w-4 h-4 stroke-[1.8]" />;
      case 'sm':
        return <MapPin className="w-4 h-4 stroke-[1.8]" />;
      case 'ro':
      case 'zo':
        return <Shield className="w-4 h-4 stroke-[1.8]" />;
      default:
        return <User className="w-4 h-4 stroke-[1.8]" />;
    }
  };

  return (
    <div className="fixed bottom-4 left-0 right-0 z-40 flex justify-center px-4 pointer-events-none md:hidden">
      <nav className="pointer-events-auto bg-white/95 backdrop-blur-md border border-[#E3E8EF] shadow-xl rounded-full px-2 py-1 w-full max-w-[310px] grid grid-cols-5 items-center">
        {/* 1. Home */}
        <Link
          href="/feed"
          className={`flex flex-col items-center justify-center py-0.5 transition-all group ${
            isHome ? 'text-[#4787F2]' : 'text-[#687182] hover:text-[#17181C]'
          }`}
        >
          <Home className={`w-4 h-4 transition-transform group-hover:scale-105 ${isHome ? 'stroke-[2.2]' : 'stroke-[1.8]'}`} />
          <span className={`text-[9px] mt-0.5 ${isHome ? 'font-black text-[#4787F2]' : 'font-medium'}`}>
            Home
          </span>
        </Link>

        {/* 2. Wallet */}
        <Link
          href="/wallet"
          className={`flex flex-col items-center justify-center py-0.5 transition-all group ${
            isWallet ? 'text-[#4787F2]' : 'text-[#687182] hover:text-[#17181C]'
          }`}
        >
          <Wallet className={`w-4 h-4 transition-transform group-hover:scale-105 ${isWallet ? 'stroke-[2.2]' : 'stroke-[1.8]'}`} />
          <span className={`text-[9px] mt-0.5 ${isWallet ? 'font-black text-[#4787F2]' : 'font-medium'}`}>
            Wallet
          </span>
        </Link>

        {/* 3. Center Explore Button (Bigger, Elevated & Glowing with Spot Ring) */}
        <Link
          href="/explore"
          className="relative -top-3.5 flex flex-col items-center justify-center group focus:outline-none"
        >
          <div
            className={`w-11 h-11 rounded-full bg-white flex items-center justify-center transform transition-all group-hover:scale-110 group-active:scale-95 shadow-[0_4px_16px_rgba(71,135,242,0.4)] ${
              isExplore
                ? 'ring-3 ring-[#4787F2] shadow-[0_0_20px_rgba(71,135,242,0.6)] animate-pulse'
                : 'ring-2 ring-[#4787F2]/60 hover:ring-[#4787F2]'
            }`}
          >
            <AdsspotLogoMark size={24} />
          </div>
          <span
            className={`text-[9px] mt-0.5 tracking-tight flex items-center gap-0.5 ${
              isExplore ? 'font-black text-[#4787F2]' : 'font-bold text-[#17181C]'
            }`}
          >
            Explore
          </span>
        </Link>


        {/* 4. Saved */}
        <Link
          href="/saved"
          className={`flex flex-col items-center justify-center py-0.5 transition-all group ${
            isSaved ? 'text-[#4787F2]' : 'text-[#687182] hover:text-[#17181C]'
          }`}
        >
          <Bookmark className={`w-4 h-4 transition-transform group-hover:scale-105 ${isSaved ? 'stroke-[2.2]' : 'stroke-[1.8]'}`} />
          <span className={`text-[9px] mt-0.5 ${isSaved ? 'font-black text-[#4787F2]' : 'font-medium'}`}>
            Saved
          </span>
        </Link>

        {/* 5. Role Portal / Profile */}
        <Link
          href={getProfileLink()}
          className={`flex flex-col items-center justify-center py-0.5 transition-all group ${
            isProfile ? 'text-[#4787F2]' : 'text-[#687182] hover:text-[#17181C]'
          }`}
        >
          <div className="transition-transform group-hover:scale-105">
            {getProfileIcon()}
          </div>
          <span className={`text-[9px] mt-0.5 ${isProfile ? 'font-black text-[#4787F2]' : 'font-medium'}`}>
            {getProfileLabel()}
          </span>
        </Link>
      </nav>
    </div>
  );
};
