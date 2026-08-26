'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@adsspot/api';
import { Button, Avatar, Logo } from '@adsspot/ui';
import { LayoutDashboard, LogIn, LogOut, Globe, Check, ChevronDown } from 'lucide-react';

const LANGUAGES = [
  { code: 'en', label: 'English', native: 'English', short: 'EN' },
  { code: 'hi', label: 'Hindi', native: 'हिन्दी', short: 'हि' },
  { code: 'mr', label: 'Marathi', native: 'मराठी', short: 'म' },
  { code: 'gu', label: 'Gujarati', native: 'ગુજરાતી', short: 'ગુ' },
  { code: 'ta', label: 'Tamil', native: 'தமிழ்', short: 'த' },
  { code: 'te', label: 'Telugu', native: 'తెలుగు', short: 'తె' },
  { code: 'kn', label: 'Kannada', native: 'ಕನ್ನಡ', short: 'ಕ' },
  { code: 'bn', label: 'Bengali', native: 'বাংলা', short: 'বা' },
];

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [selectedLang, setSelectedLang] = useState('en');
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isStoryOpen, setIsStoryOpen] = useState(false);

  React.useEffect(() => {
    const handleStoryChange = (e: CustomEvent<{ active: boolean }>) => {
      setIsStoryOpen(Boolean(e.detail?.active));
    };
    window.addEventListener('adsspot_story_active' as any, handleStoryChange);
    return () => window.removeEventListener('adsspot_story_active' as any, handleStoryChange);
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2000);
  };

  const handleSelectLanguage = (lang: (typeof LANGUAGES)[0]) => {
    setSelectedLang(lang.code);
    setShowLangMenu(false);
    showToast(`Language set to ${lang.native} (${lang.label})`);
  };

  const currentLang = LANGUAGES.find((l) => l.code === selectedLang) ?? LANGUAGES[0]!;

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
        return '/profile';
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
        return 'Profile';
    }
  };

  return (
    <header
      className={`bg-white border-b border-[#E3E8EF] sticky top-0 z-40 shadow-xs backdrop-blur-md bg-white/95 w-full transition-transform duration-300 ${
        isStoryOpen ? '-translate-y-full pointer-events-none' : 'translate-y-0'
      }`}
    >
      {/* Language Toast */}
      {toastMessage && (
        <div className="fixed top-16 left-1/2 transform -translate-x-1/2 z-50 bg-[#17181C] text-white text-xs font-bold px-3.5 py-1.5 rounded-full shadow-2xl flex items-center gap-1.5 border border-neutral-700 animate-fade-in whitespace-nowrap">
          <Globe className="w-3.5 h-3.5 text-[#4787F2]" />
          {toastMessage}
        </div>
      )}

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between gap-2">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <Logo size={44} withText={true} />
        </Link>

        {/* Public Navigation (Desktop) */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-[#4A5260]">
          <Link href="/feed" className="hover:text-[#4787F2] transition-colors flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#35AB4E] animate-ping" />
            Live Feed
          </Link>
          <Link href="/explore" className="hover:text-[#4787F2] transition-colors">
            Explore Stores
          </Link>
          <Link href="/wallet" className="hover:text-[#4787F2] transition-colors">
            UPI Wallet
          </Link>
          <Link href="/#pricing" className="hover:text-[#4787F2] transition-colors">
            Pricing &amp; Tiers
          </Link>
          <Link href="/#roles" className="hover:text-[#4787F2] transition-colors">
            Roles &amp; Portals
          </Link>
        </nav>

        {/* Action Controls & Language Button */}
        <div className="flex items-center gap-2 shrink-0">
          {/* 🌐 LANGUAGE SWITCHER */}
          <div className="relative">
            <button
              onClick={() => setShowLangMenu(!showLangMenu)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 sm:px-3 sm:py-1.5 rounded-full border border-[#E3E8EF] hover:border-[#4787F2] bg-[#F4F6FB] hover:bg-white text-xs font-bold text-[#17181C] transition-all shadow-2xs active:scale-95 shrink-0"
            >
              <Globe className="w-3.5 h-3.5 text-[#4787F2]" />
              <span className="hidden sm:inline">{currentLang.native}</span>
              <span className="sm:hidden text-[11px]">{currentLang.short}</span>
              <ChevronDown className="w-3 h-3 text-[#687182]" />
            </button>

            {/* Dropdown Menu */}
            {showLangMenu && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowLangMenu(false)}
                />
                <div className="absolute right-0 mt-2 w-44 sm:w-48 bg-white rounded-2xl shadow-2xl border border-[#E3E8EF] py-2 z-50 animate-slide-up">
                  <div className="px-3 py-1 text-[10px] font-black uppercase text-[#687182] border-b border-[#F4F6FB] mb-1">
                    Language / भाषा
                  </div>
                  <div className="max-h-60 overflow-y-auto no-scrollbar">
                    {LANGUAGES.map((lang) => {
                      const isSelected = selectedLang === lang.code;
                      return (
                        <button
                          key={lang.code}
                          onClick={() => handleSelectLanguage(lang)}
                          className={`w-full px-3 py-2 text-left text-xs flex items-center justify-between transition-colors ${
                            isSelected
                              ? 'bg-[#EDF4FF] text-[#4787F2] font-bold'
                              : 'text-[#17181C] hover:bg-[#F4F6FB]'
                          }`}
                        >
                          <div>
                            <span className="font-bold block">{lang.native}</span>
                            <span className="text-[10px] text-[#687182]">{lang.label}</span>
                          </div>
                          {isSelected && <Check className="w-3.5 h-3.5 text-[#4787F2]" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* User Profile Avatar Link */}
          {isAuthenticated && user ? (
            <div className="flex items-center gap-2 shrink-0">
              {user.role !== 'consumer' && (
                <Link href={getPortalLink()} className="hidden sm:block">
                  <Button variant="primary" size="sm" leftIcon={<LayoutDashboard className="w-3.5 h-3.5" />}>
                    {getPortalLabel()}
                  </Button>
                </Link>
              )}

              <Link
                href={user.role === 'consumer' ? '/profile' : getPortalLink()}
                className="flex items-center gap-2 group shrink-0"
                title="My Profile"
              >
                <Avatar
                  src={user.avatar_url}
                  name={user.full_name}
                  size="sm"
                  isElite={user.business_profile?.tier === 'elite'}
                />
                <div className="hidden lg:flex flex-col">
                  <span className="text-xs font-bold text-[#17181C] group-hover:text-[#4787F2] transition-colors leading-none truncate max-w-[100px]">
                    {user.full_name}
                  </span>
                  <span className="text-[10px] text-[#687182] capitalize">{user.role}</span>
                </div>
              </Link>

              {/* Logout Button (Desktop & Mobile) */}
              <button
                onClick={logout}
                title="Logout"
                className="flex items-center justify-center text-neutral-400 hover:text-red-500 hover:bg-red-50 p-1.5 rounded-full transition-colors shrink-0"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Link href="/login" className="shrink-0">
              <Button variant="primary" size="sm" className="text-xs py-1.5 px-3" leftIcon={<LogIn className="w-3.5 h-3.5" />}>
                Login
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};
