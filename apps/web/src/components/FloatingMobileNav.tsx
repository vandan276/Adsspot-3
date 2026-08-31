'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@adsspot/api';
import { AdsspotLogoMark } from '@adsspot/ui';
import { Newspaper, Handshake, Bookmark, User, Store, Crown, Shield, MapPin } from 'lucide-react';

const FloatingMobileNavContent: React.FC = () => {
  const pathname = usePathname();
  const { user } = useAuth();
  const [isStoryOpen, setIsStoryOpen] = React.useState(false);

  React.useEffect(() => {
    const handleStoryChange = (e: CustomEvent<{ active: boolean }>) => {
      setIsStoryOpen(Boolean(e.detail?.active));
    };
    window.addEventListener('adsspot_story_active' as any, handleStoryChange);
    return () => window.removeEventListener('adsspot_story_active' as any, handleStoryChange);
  }, []);

  const isFeed = pathname === '/feed' || pathname === '/';
  const isPartner = pathname === '/partner' || pathname === '/wallet';
  const isBusiness = pathname === '/explore' || pathname === '/categories';
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
    if (!user) return <User className="w-5 h-5 stroke-[2]" />;
    switch (user.role) {
      case 'merchant':
        return <Store className="w-5 h-5 stroke-[2]" />;
      case 'super_admin':
        return <Crown className="w-5 h-5 stroke-[2]" />;
      case 'sm':
        return <MapPin className="w-5 h-5 stroke-[2]" />;
      case 'ro':
      case 'zo':
        return <Shield className="w-5 h-5 stroke-[2]" />;
      default:
        return <User className="w-5 h-5 stroke-[2]" />;
    }
  };

  return (
    <div
      className={`fixed bottom-4 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none md:hidden transition-all duration-300 ${isStoryOpen ? 'opacity-0 translate-y-16 pointer-events-none' : 'opacity-100 translate-y-0'
        }`}
    >
      <nav className="pointer-events-auto bg-white/95 dark:bg-[#121620]/95 backdrop-blur-xl border border-[#E3E8EF] dark:border-white/10 shadow-[0_12px_36px_rgba(23,24,28,0.14)] dark:shadow-[0_12px_36px_rgba(0,0,0,0.6)] rounded-full px-3 py-2 w-full max-w-[390px] grid grid-cols-5 items-center">
        {/* 1. Feed (formerly Home) */}
        <Link
          href="/feed"
          className={`flex flex-col items-center justify-center py-1 transition-all group ${isFeed ? 'text-[#4787F2]' : 'text-[#687182] dark:text-neutral-400 hover:text-[#17181C] dark:hover:text-white'
            }`}
        >
          <Newspaper className={`w-5 h-5 transition-transform group-hover:scale-110 ${isFeed ? 'stroke-[2.5]' : 'stroke-[2]'}`} />
          <span className={`text-[11px] font-bold mt-1 tracking-tight ${isFeed ? 'text-[#4787F2]' : 'text-[#687182] dark:text-neutral-400'}`}>
            Feed
          </span>
        </Link>

        {/* 2. Partner (formerly Wallet + Referral Hub) */}
        <Link
          href="/partner"
          className={`flex flex-col items-center justify-center py-1 transition-all group ${isPartner ? 'text-[#4787F2]' : 'text-[#687182] dark:text-neutral-400 hover:text-[#17181C] dark:hover:text-white'
            }`}
        >
          <Handshake className={`w-5 h-5 transition-transform group-hover:scale-110 ${isPartner ? 'stroke-[2.5]' : 'stroke-[2]'}`} />
          <span className={`text-[11px] font-bold mt-1 tracking-tight ${isPartner ? 'text-[#4787F2]' : 'text-[#687182] dark:text-neutral-400'}`}>
            Partner
          </span>
        </Link>

        {/* 3. Center Business Button (formerly Explore) */}
        <Link
          href="/explore"
          className="relative -top-5 flex flex-col items-center justify-center group focus:outline-none"
        >
          <div
            className={`w-14 h-14 rounded-full flex items-center justify-center transform transition-all group-hover:scale-110 group-active:scale-95 shadow-[0_8px_24px_rgba(71,135,242,0.35)] p-[2.5px] ${isBusiness
                ? 'ring-4 ring-[#4787F2]/30 shadow-[0_0_28px_rgba(71,135,242,0.65)]'
                : 'hover:shadow-[0_8px_28px_rgba(71,135,242,0.45)]'
              }`}
            style={{
              background: 'conic-gradient(from 0deg, #4787F2, #35AB4E, #F2B604, #981837, #4787F2)',
            }}
          >
            <div className="w-full h-full rounded-full bg-white dark:bg-[#121620] flex items-center justify-center">
              <AdsspotLogoMark size={32} />
            </div>
          </div>
          <span
            className={`text-[11px] mt-1 font-black tracking-tight flex items-center gap-0.5 ${isBusiness ? 'text-[#4787F2]' : 'text-[#17181C] dark:text-neutral-200'
              }`}
          >
            Business
          </span>
        </Link>

        {/* 4. Saved */}
        <Link
          href="/saved"
          className={`flex flex-col items-center justify-center py-1 transition-all group ${isSaved ? 'text-[#4787F2]' : 'text-[#687182] dark:text-neutral-400 hover:text-[#17181C] dark:hover:text-white'
            }`}
        >
          <Bookmark className={`w-5 h-5 transition-transform group-hover:scale-110 ${isSaved ? 'stroke-[2.5]' : 'stroke-[2]'}`} />
          <span className={`text-[11px] font-bold mt-1 tracking-tight ${isSaved ? 'text-[#4787F2]' : 'text-[#687182] dark:text-neutral-400'}`}>
            Saved
          </span>
        </Link>

        {/* 5. Role Portal / Profile */}
        <Link
          href={getProfileLink()}
          className={`flex flex-col items-center justify-center py-1 transition-all group ${isProfile ? 'text-[#4787F2]' : 'text-[#687182] dark:text-neutral-400 hover:text-[#17181C] dark:hover:text-white'
            }`}
        >
          <div className={`transition-transform group-hover:scale-110 ${isProfile ? 'text-[#4787F2]' : 'text-[#687182] dark:text-neutral-400'}`}>
            {getProfileIcon()}
          </div>
          <span className={`text-[11px] font-bold mt-1 tracking-tight ${isProfile ? 'text-[#4787F2]' : 'text-[#687182] dark:text-neutral-400'}`}>
            {getProfileLabel()}
          </span>
        </Link>
      </nav>
    </div>
  );
};

export const FloatingMobileNav: React.FC = () => {
  return (
    <React.Suspense fallback={null}>
      <FloatingMobileNavContent />
    </React.Suspense>
  );
};
