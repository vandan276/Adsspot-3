'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@adsspot/api';
import { Button, Card, Avatar, TrustedBadge, TierBadge, RoleBadge } from '@adsspot/ui';
import {
  Sparkles,
  ShieldCheck,
  Crown,
  Check,
  Globe,
  ArrowRight,
  Users,
  Award,
  Zap,
} from 'lucide-react';

export default function HomePage() {
  const { user, switchPersona, personas } = useAuth();

  return (
    <div className="flex-1 flex flex-col pb-20">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-20 px-4 sm:px-6 lg:px-8 border-b border-[#E3E8EF] bg-gradient-to-b from-white via-[#F4F6FB] to-[#F4F6FB]">
        {/* Background Conic Ambient Glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-[#4787F2]/15 via-[#F2B604]/10 to-[#981837]/10 blur-[100px] rounded-full pointer-events-none -z-0" />

        <div className="max-w-6xl mx-auto text-center relative z-10">
          {/* Top Pill Announcement */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#E3E8EF] shadow-sm mb-6 animate-pulse">
            <span className="w-2 h-2 rounded-full bg-[#35AB4E]" />
            <span className="text-xs font-bold text-[#17181C]">Hyperlocal India Platform</span>
            <span className="text-neutral-300">|</span>
            <span className="text-xs font-semibold text-[#4787F2]">Monorepo Scaffold M0 Live</span>
          </div>

          {/* Main Hero Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-[#17181C] tracking-tight leading-[1.08] max-w-4xl mx-auto mb-6">
            Hyperlocal Business Discovery &amp;{' '}
            <span className="bg-gradient-to-r from-[#4787F2] via-[#35AB4E] to-[#981837] bg-clip-text text-transparent">
              Growth Engine
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-[#4A5260] max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
            One unified platform connecting consumers, local merchants, field sales managers, and regional officers across mobile and web.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link href="/login">
              <Button variant="primary" size="lg" rightIcon={<ArrowRight className="w-4 h-4" />}>
                Launch Role Portals
              </Button>
            </Link>
            <a href="#demo-personas">
              <Button variant="secondary" size="lg" leftIcon={<Users className="w-4 h-4" />}>
                Switch Test Personas
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* 2. DESIGN SYSTEM & TOKENS SHOWCASE (M0 Verification) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20 w-full mb-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card padding="md" hoverable className="border-l-4 border-l-[#4787F2]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#EDF4FF] text-[#4787F2] flex items-center justify-center font-bold">
                <Globe className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-[#687182] uppercase">Brand Primary</span>
                <p className="text-sm font-bold text-[#17181C]">Spot Blue #4787F2</p>
              </div>
            </div>
          </Card>

          <Card padding="md" hoverable className="border-l-4 border-l-[#F2B604]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#FFF8E6] text-[#A06E00] flex items-center justify-center font-bold">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-[#687182] uppercase">Festivals &amp; Upsells</span>
                <p className="text-sm font-bold text-[#17181C]">Festival Yellow #F2B604</p>
              </div>
            </div>
          </Card>

          <Card padding="md" hoverable className="border-l-4 border-l-[#35AB4E]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#EBF9EE] text-[#35AB4E] flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-[#687182] uppercase">Trust &amp; Verified</span>
                <p className="text-sm font-bold text-[#17181C]">Trust Green #35AB4E</p>
              </div>
            </div>
          </Card>

          <Card padding="md" hoverable className="border-l-4 border-l-[#981837]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#FBECEF] text-[#981837] flex items-center justify-center font-bold">
                <Crown className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-[#687182] uppercase">Elite &amp; Live Events</span>
                <p className="text-sm font-bold text-[#17181C]">Deep Crimson #981837</p>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* 3. SIGNATURE SPOT RING & AVATAR SPECIFICATION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20 w-full">
        <div className="bg-white rounded-2xl border border-[#E3E8EF] p-8 shadow-card">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-[#E3E8EF]">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EDF4FF] text-[#4787F2] text-xs font-bold mb-2">
                <Zap className="w-3.5 h-3.5" /> Design System Tokens
              </div>
              <h2 className="text-2xl font-bold text-[#17181C]">Signature Conic "Spot Ring" &amp; 12px Rounded Square Avatars</h2>
              <p className="text-sm text-[#687182] mt-1">
                Strict adherence to repository standards: avatars are rounded squares (12px), never circles. Conic gradient applied to Elite businesses and live stories.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-6 pt-8 items-center justify-items-center">
            <div className="flex flex-col items-center gap-2">
              <Avatar
                src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80"
                size="lg"
                hasStoryRing={false}
              />
              <span className="text-xs font-bold text-[#17181C]">Consumer</span>
              <span className="text-[10px] text-[#687182]">12px Rounded Sq</span>
            </div>

            <div className="flex flex-col items-center gap-2">
              <Avatar
                src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=200&auto=format&fit=crop&q=80"
                size="lg"
                hasStoryRing={false}
              />
              <span className="text-xs font-bold text-[#17181C]">Basic Merchant</span>
              <TierBadge tier="basic" size="sm" />
            </div>

            <div className="flex flex-col items-center gap-2">
              <Avatar
                src="https://images.unsplash.com/photo-1599785209707-a456fc1337bb?w=200&auto=format&fit=crop&q=80"
                size="lg"
                hasStoryRing={false}
              />
              <span className="text-xs font-bold text-[#17181C]">Premium Merchant</span>
              <TrustedBadge size="sm" />
            </div>

            <div className="flex flex-col items-center gap-2">
              <Avatar
                src="https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=200&auto=format&fit=crop&q=80"
                size="lg"
                isElite={true}
                hasStoryRing={true}
              />
              <span className="text-xs font-bold text-[#17181C]">Elite (Spot Ring)</span>
              <TierBadge tier="elite" size="sm" />
            </div>

            <div className="flex flex-col items-center gap-2">
              <Avatar
                src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80"
                size="lg"
              />
              <span className="text-xs font-bold text-[#17181C]">Sales Manager</span>
              <RoleBadge role="sm" size="sm" />
            </div>

            <div className="flex flex-col items-center gap-2">
              <Avatar
                src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80"
                size="lg"
              />
              <span className="text-xs font-bold text-[#17181C]">Super Admin</span>
              <RoleBadge role="super_admin" size="sm" />
            </div>
          </div>
        </div>
      </section>

      {/* 4. FAST PERSONA SELECTOR */}
      <section id="demo-personas" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20 w-full scroll-mt-24">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF8E6] text-[#A06E00] text-xs font-bold mb-3">
            <Users className="w-3.5 h-3.5" /> Instant Test Personas
          </div>
          <h2 className="text-3xl font-extrabold text-[#17181C] tracking-tight">
            Switch Between All 6 Platform Roles in 1-Click
          </h2>
          <p className="text-base text-[#687182] mt-2">
            Test any permission tier or role immediately without manual credential entry.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {personas.map((p) => {
            const isCurrent = user?.id === p.id;
            return (
              <Card
                key={p.id}
                padding="md"
                hoverable
                className={`cursor-pointer transition-all ${
                  isCurrent ? 'ring-2 ring-[#4787F2] shadow-md bg-[#F4F8FF]' : 'hover:border-[#4787F2]/40'
                }`}
                onClick={() => switchPersona(p.id)}
              >
                <div className="flex items-center gap-3 mb-3">
                  <Avatar src={p.avatar_url} name={p.name} size="md" isElite={p.tier === 'elite'} />
                  <div className="overflow-hidden">
                    <div className="flex items-center gap-1.5">
                      <RoleBadge role={p.role} size="sm" />
                      {p.tier && <TierBadge tier={p.tier} size="sm" />}
                    </div>
                    <h3 className="text-sm font-bold text-[#17181C] truncate mt-1">{p.name}</h3>
                  </div>
                </div>
                <p className="text-xs text-[#687182] line-clamp-2 mb-4 leading-relaxed">{p.description}</p>
                <div className="pt-2 border-t border-[#E3E8EF] flex items-center justify-between">
                  <span className="text-[11px] font-mono text-[#687182]">{p.phone}</span>
                  {isCurrent ? (
                    <span className="text-xs font-bold text-[#4787F2] flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> Active
                    </span>
                  ) : (
                    <span className="text-xs font-semibold text-[#4787F2]">Switch &rarr;</span>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      </section>

      {/* 5. MEMBERSHIP TIERS MATRIX */}
      <section id="pricing" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20 w-full scroll-mt-24">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EDF4FF] text-[#4787F2] text-xs font-bold mb-3">
            <Award className="w-3.5 h-3.5" /> Business Monetization
          </div>
          <h2 className="text-3xl font-extrabold text-[#17181C] tracking-tight">
            Transparent Membership Tiers
          </h2>
          <p className="text-base text-[#687182] mt-2">
            Tier-based access rules enforced at the database trigger and server layer.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {/* Basic Tier */}
          <Card padding="lg" className="flex flex-col justify-between border-t-4 border-t-[#687182]">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-lg font-bold text-[#17181C]">Basic</span>
                <TierBadge tier="basic" />
              </div>
              <div className="mb-6">
                <span className="text-3xl font-black text-[#17181C]">₹999</span>
                <span className="text-sm text-[#687182]"> / month</span>
              </div>
              <p className="text-xs text-[#687182] mb-6">
                Ideal for neighborhood retailers and micro-shops entering digital discovery.
              </p>
              <ul className="space-y-3 mb-8 text-xs text-[#4A5260]">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#35AB4E]" /> Hyperlocal listing on map &amp; feed
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#35AB4E]" /> Digital visiting card (/card/[slug])
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#35AB4E]" /> Auto-branded Festival Banners
                </li>
                <li className="flex items-center gap-2 text-[#9AA4B2] line-through">
                  Custom weekly/daily banners
                </li>
                <li className="flex items-center gap-2 text-[#9AA4B2] line-through">
                  Green Trusted badge
                </li>
                <li className="flex items-center gap-2 text-[#9AA4B2] line-through">
                  Stories privileges &amp; Microsite
                </li>
              </ul>
            </div>
            <Button variant="secondary" size="md" className="w-full">
              Select Basic
            </Button>
          </Card>

          {/* Premium Tier */}
          <Card padding="lg" className="flex flex-col justify-between border-2 border-[#F2B604] shadow-cardHover relative bg-white">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#F2B604] text-[#17181C] text-[11px] font-black uppercase tracking-wider px-3 py-0.5 rounded-full shadow-sm">
              Most Popular
            </div>
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-lg font-bold text-[#17181C]">Premium</span>
                <TierBadge tier="premium" />
              </div>
              <div className="mb-6">
                <span className="text-3xl font-black text-[#17181C]">₹2,499</span>
                <span className="text-sm text-[#687182]"> / month</span>
              </div>
              <p className="text-xs text-[#687182] mb-6">
                For established outlets seeking verified credibility and consistent marketing.
              </p>
              <ul className="space-y-3 mb-8 text-xs text-[#4A5260]">
                <li className="flex items-center gap-2 font-semibold">
                  <Check className="w-4 h-4 text-[#35AB4E]" /> Everything in Basic included
                </li>
                <li className="flex items-center gap-2 font-semibold">
                  <Check className="w-4 h-4 text-[#35AB4E]" /> 2 Custom Banners every week
                </li>
                <li className="flex items-center gap-2 font-semibold text-[#1B6A2D]">
                  <Check className="w-4 h-4 text-[#35AB4E]" /> Green "Trusted" verified badge
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#35AB4E]" /> Priority search rank in pincode
                </li>
                <li className="flex items-center gap-2 text-[#9AA4B2] line-through">
                  Daily banners &amp; Microsite
                </li>
                <li className="flex items-center gap-2 text-[#9AA4B2] line-through">
                  Story publishing privileges
                </li>
              </ul>
            </div>
            <Button variant="festival" size="md" className="w-full font-bold">
              Upgrade to Premium
            </Button>
          </Card>

          {/* Elite Tier */}
          <Card padding="lg" className="flex flex-col justify-between border-t-4 border-t-[#981837] relative bg-gradient-to-b from-white to-[#FBECEF]/30">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-lg font-bold text-[#17181C]">Elite</span>
                <TierBadge tier="elite" />
              </div>
              <div className="mb-6">
                <span className="text-3xl font-black text-[#17181C]">₹4,999</span>
                <span className="text-sm text-[#687182]"> / month</span>
              </div>
              <p className="text-xs text-[#687182] mb-6">
                The ultimate brand presence for flagship local stores, jewellers and premium brands.
              </p>
              <ul className="space-y-3 mb-8 text-xs text-[#4A5260]">
                <li className="flex items-center gap-2 font-semibold">
                  <Check className="w-4 h-4 text-[#35AB4E]" /> Everything in Premium included
                </li>
                <li className="flex items-center gap-2 font-semibold text-[#981837]">
                  <Check className="w-4 h-4 text-[#981837]" /> Daily Custom Banners
                </li>
                <li className="flex items-center gap-2 font-semibold text-[#981837]">
                  <Check className="w-4 h-4 text-[#981837]" /> Dedicated Microsite (/b/[slug])
                </li>
                <li className="flex items-center gap-2 font-bold text-[#4787F2]">
                  <Check className="w-4 h-4 text-[#4787F2]" /> Elite-only Stories (max 1/day)
                </li>
                <li className="flex items-center gap-2 font-semibold">
                  <Check className="w-4 h-4 text-[#35AB4E]" /> Conic Spot Ring profile border
                </li>
                <li className="flex items-center gap-2 font-semibold">
                  <Check className="w-4 h-4 text-[#35AB4E]" /> Top category spotlight placement
                </li>
              </ul>
            </div>
            <Button variant="crimson" size="md" className="w-full">
              Get Elite Tier
            </Button>
          </Card>
        </div>
      </section>

      {/* 6. MONOREPO HEALTHCHECK STATUS (Milestone 0 Acceptance) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="bg-[#17181C] text-white rounded-2xl p-8 shadow-card">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-neutral-800">
            <div>
              <span className="text-xs font-bold text-[#4787F2] uppercase tracking-wider">Acceptance Gate</span>
              <h2 className="text-xl font-bold text-white mt-0.5">Milestone 0 Monorepo &amp; Package Architecture</h2>
            </div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/20">
              <Check className="w-3.5 h-3.5" /> All Packages Linked
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-6">
            <div className="bg-neutral-900/80 p-4 rounded-xl border border-neutral-800">
              <span className="text-[11px] text-neutral-400 font-mono">packages/types</span>
              <p className="text-sm font-bold text-white mt-1">34 Data Models</p>
              <span className="text-[10px] text-emerald-400 font-medium">Strict TypeScript</span>
            </div>

            <div className="bg-neutral-900/80 p-4 rounded-xl border border-neutral-800">
              <span className="text-[11px] text-neutral-400 font-mono">packages/ui</span>
              <p className="text-sm font-bold text-white mt-1">Tokens &amp; Primitives</p>
              <span className="text-[10px] text-emerald-400 font-medium">Spot Ring, 12px Avatar, 16px Card</span>
            </div>

            <div className="bg-neutral-900/80 p-4 rounded-xl border border-neutral-800">
              <span className="text-[11px] text-neutral-400 font-mono">packages/api</span>
              <p className="text-sm font-bold text-white mt-1">Auth &amp; Seed Store</p>
              <span className="text-[10px] text-emerald-400 font-medium">Supabase + Offline Store</span>
            </div>

            <div className="bg-neutral-900/80 p-4 rounded-xl border border-neutral-800">
              <span className="text-[11px] text-neutral-400 font-mono">apps/web &amp; mobile</span>
              <p className="text-sm font-bold text-white mt-1">Next.js + Expo Web</p>
              <span className="text-[10px] text-emerald-400 font-medium">Unified Account System</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
