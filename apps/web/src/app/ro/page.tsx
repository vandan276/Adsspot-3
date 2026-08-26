'use client';

import React, { useState } from 'react';
import { Card, Avatar, RoleBadge } from '@adsspot/ui';
import {
  Shield,
  Users,
  MapPin,
  Target as TargetIcon,
  TrendingUp,
} from 'lucide-react';


export default function RODashboardPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'sms' | 'coverage' | 'leaderboard'>('overview');

  const smList = [
    {
      id: 'sm-1',
      name: 'Karan Verma',
      pincodes: '400001, 400020 (Fort & Nariman Pt)',
      checkin: '09:15 AM (GPS Verified)',
      targetPct: 84,
      visits: 8,
      conversions: 3,
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    },
    {
      id: 'sm-2',
      name: 'Rohit Sharma',
      pincodes: '400005 (Colaba)',
      checkin: '09:30 AM (GPS Verified)',
      targetPct: 78,
      visits: 6,
      conversions: 2,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
    },
    {
      id: 'sm-3',
      name: 'Sneha Kulkarni',
      pincodes: '400002 (Kalbadevi)',
      checkin: '09:05 AM (GPS Verified)',
      targetPct: 92,
      visits: 10,
      conversions: 4,
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
    },
  ];

  return (
    <div className="flex-1 bg-[#F4F6FB] min-h-[calc(100vh-100px)] flex">
      {/* Left Sidebar */}
      <aside className="w-64 bg-white border-r border-[#E3E8EF] p-5 hidden lg:flex flex-col justify-between flex-shrink-0">
        <div className="space-y-6">
          <div className="flex items-center gap-2.5 px-2">
            <div className="w-8 h-8 rounded-xl bg-[#35AB4E] text-white flex items-center justify-center font-bold">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-black text-[#1B6A2D] uppercase tracking-wider">Regional Officer</span>
              <p className="text-xs font-bold text-[#17181C]">Mumbai South</p>
            </div>
          </div>

          <nav className="space-y-1 text-xs font-semibold text-[#4A5260]">
            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-colors ${
                activeTab === 'overview' ? 'bg-[#EDF4FF] text-[#4787F2] font-bold' : 'hover:bg-[#F4F6FB]'
              }`}
            >
              <TargetIcon className="w-4 h-4" /> Regional Overview
            </button>
            <button
              onClick={() => setActiveTab('sms')}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-colors ${
                activeTab === 'sms' ? 'bg-[#EDF4FF] text-[#4787F2] font-bold' : 'hover:bg-[#F4F6FB]'
              }`}
            >
              <Users className="w-4 h-4" /> Assigned SM Team (6)
            </button>
            <button
              onClick={() => setActiveTab('coverage')}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-colors ${
                activeTab === 'coverage' ? 'bg-[#EDF4FF] text-[#4787F2] font-bold' : 'hover:bg-[#F4F6FB]'
              }`}
            >
              <MapPin className="w-4 h-4" /> Pincode Coverage Map
            </button>
            <button
              onClick={() => setActiveTab('leaderboard')}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-colors ${
                activeTab === 'leaderboard' ? 'bg-[#EDF4FF] text-[#4787F2] font-bold' : 'hover:bg-[#F4F6FB]'
              }`}
            >
              <TrendingUp className="w-4 h-4" /> SM Leaderboard
            </button>
          </nav>
        </div>

        <div className="pt-4 border-t border-[#E3E8EF] text-[11px] text-[#687182]">
          <p className="font-bold text-[#17181C]">Sunita Rao (RO)</p>
          <p>Region Target: ₹15,00,000</p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 lg:p-8 space-y-8 max-w-7xl overflow-x-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-[#17181C]">
                {activeTab === 'overview' && 'Regional Officer (RO) Command'}
                {activeTab === 'sms' && 'Assigned Sales Managers (SM Micro-Detail)'}
                {activeTab === 'coverage' && 'Territory Pincode Coverage & Density'}
                {activeTab === 'leaderboard' && 'Field SM Conversion Leaderboard'}
              </h1>
              <RoleBadge role="ro" size="sm" />
            </div>
            <p className="text-xs text-[#687182] mt-0.5">Region: Mumbai South • 6 Assigned SMs • 4 Pincode Territories</p>
          </div>
        </div>

        {/* TAB 1: OVERVIEW WITH MULTI-LAYER TARGET RINGS (Feature M) */}
        {activeTab === 'overview' && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Card padding="md" className="border-l-4 border-l-[#35AB4E]">
                <span className="text-xs font-bold text-[#687182] uppercase">Region Target %</span>
                <p className="text-2xl font-black text-[#17181C] mt-2">83.0%</p>
                <span className="text-[11px] text-[#35AB4E] font-semibold mt-1 block">₹12.45L / ₹15.00L monthly</span>
              </Card>

              <Card padding="md" className="border-l-4 border-l-[#4787F2]">
                <span className="text-xs font-bold text-[#687182] uppercase">Active SMs Checked-In</span>
                <p className="text-2xl font-black text-[#17181C] mt-2">6 / 6</p>
                <span className="text-[11px] text-[#35AB4E] font-semibold mt-1 block">100% On-field presence</span>
              </Card>

              <Card padding="md" className="border-l-4 border-l-[#F2B604]">
                <span className="text-xs font-bold text-[#687182] uppercase">Total Merchant Conversions</span>
                <p className="text-2xl font-black text-[#17181C] mt-2">48 Stores</p>
                <span className="text-[11px] text-[#4787F2] font-semibold mt-1 block">32 Elite • 16 Premium</span>
              </Card>
            </div>

            {/* Apple Fitness-Style Multi-Layer Target Performance Rings (Feature M) */}
            <Card padding="lg" className="space-y-4 bg-gradient-to-br from-white to-[#F4F6FB] border border-[#E3E8EF] shadow-sm">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-[#E3E8EF] pb-3">
                <div>
                  <h3 className="text-base font-black text-[#17181C] flex items-center gap-2">
                    🎯 Multi-Layer Regional Target Rings
                  </h3>
                  <p className="text-xs text-[#687182]">Real-time tracking of Field Visits, Merchant Closings, and Monthly GMV</p>
                </div>
                <span className="text-xs font-black px-3 py-1 bg-[#EBF9EE] text-[#35AB4E] rounded-full">
                  ⚡ 83% Overall Region Pace
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                {/* Ring 1: Revenue Target */}
                <div className="p-4 bg-white rounded-2xl border border-[#E3E8EF] text-center space-y-2 shadow-2xs">
                  <div className="w-20 h-20 rounded-full border-8 border-[#4787F2] border-r-[#4787F2]/20 flex items-center justify-center font-black text-sm text-[#17181C] mx-auto shadow-inner">
                    83%
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-[#17181C]">Revenue Volume</h4>
                    <p className="text-[10px] text-[#687182]">₹12.45L / ₹15.00L</p>
                  </div>
                </div>

                {/* Ring 2: Elite Merchant Onboardings */}
                <div className="p-4 bg-white rounded-2xl border border-[#E3E8EF] text-center space-y-2 shadow-2xs">
                  <div className="w-20 h-20 rounded-full border-8 border-[#35AB4E] border-b-[#35AB4E]/20 flex items-center justify-center font-black text-sm text-[#17181C] mx-auto shadow-inner">
                    92%
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-[#17181C]">Elite Subscriptions</h4>
                    <p className="text-[10px] text-[#687182]">32 / 35 Target</p>
                  </div>
                </div>

                {/* Ring 3: Daily Field Visits */}
                <div className="p-4 bg-white rounded-2xl border border-[#E3E8EF] text-center space-y-2 shadow-2xs">
                  <div className="w-20 h-20 rounded-full border-8 border-[#F2B604] border-l-[#F2B604]/20 flex items-center justify-center font-black text-sm text-[#17181C] mx-auto shadow-inner">
                    78%
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-[#17181C]">GPS Field Visits</h4>
                    <p className="text-[10px] text-[#687182]">47 / 60 Today</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* SM Micro Detail Grid */}
            <div className="space-y-4">
              <h2 className="text-base font-bold text-[#17181C]">Assigned SM Micro-Detail &amp; Conversions</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {smList.map((sm) => (
                  <Card key={sm.id} padding="md" className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Avatar src={sm.avatar} name={sm.name} size="md" />
                      <div>
                        <h4 className="text-xs font-bold text-[#17181C]">{sm.name}</h4>
                        <p className="text-[11px] text-[#687182]">{sm.pincodes}</p>
                      </div>
                    </div>

                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between">
                        <span className="text-[#687182]">GPS Status:</span>
                        <span className="font-bold text-[#35AB4E]">{sm.checkin}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#687182]">Target Achievement:</span>
                        <span className="font-black text-[#4787F2]">{sm.targetPct}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#687182]">Today&apos;s Visits / Closings:</span>
                        <span className="font-bold text-[#17181C]">{sm.visits} visits • {sm.conversions} closed</span>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </>
        )}

        {/* TAB 2: SMS MICRO-DETAIL */}
        {activeTab === 'sms' && (
          <Card padding="lg">
            <h2 className="text-base font-bold text-[#17181C] mb-4 pb-3 border-b border-[#E3E8EF]">
              Field Team Performance &amp; Activity
            </h2>
            <div className="space-y-4">
              {smList.map((sm) => (
                <div key={sm.id} className="p-5 bg-white rounded-2xl border border-[#E3E8EF] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <Avatar src={sm.avatar} name={sm.name} size="lg" />
                    <div>
                      <h3 className="font-bold text-sm text-[#17181C]">{sm.name}</h3>
                      <p className="text-xs text-[#687182]">{sm.pincodes}</p>
                      <p className="text-[11px] text-[#35AB4E] font-semibold mt-1">✓ {sm.checkin}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 text-xs">
                    <div>
                      <span className="text-[#687182] block text-[10px] uppercase">Visits Today</span>
                      <span className="font-black text-sm text-[#17181C]">{sm.visits} Visits</span>
                    </div>
                    <div>
                      <span className="text-[#687182] block text-[10px] uppercase">Conversions</span>
                      <span className="font-black text-sm text-[#35AB4E]">{sm.conversions} Elite</span>
                    </div>
                    <div>
                      <span className="text-[#687182] block text-[10px] uppercase">Monthly Target</span>
                      <span className="font-black text-sm text-[#4787F2]">{sm.targetPct}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* TAB 3: COVERAGE MAP */}
        {activeTab === 'coverage' && (
          <Card padding="lg">
            <h2 className="text-base font-bold text-[#17181C] mb-2">Assigned Pincode Territories</h2>
            <p className="text-xs text-[#687182] mb-6">Pincode assignment matrix for Mumbai South region</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-[#EDF4FF] rounded-xl border border-[#4787F2]/20">
                <span className="text-xs font-bold text-[#1D53B8]">PINCODE 400001 (Fort)</span>
                <p className="text-sm font-bold text-[#17181C] mt-1">Assigned SM: Karan Verma</p>
                <p className="text-xs text-[#687182]">24 Active Merchants • 8 Leads Pending</p>
              </div>
              <div className="p-4 bg-[#EDF4FF] rounded-xl border border-[#4787F2]/20">
                <span className="text-xs font-bold text-[#1D53B8]">PINCODE 400005 (Colaba)</span>
                <p className="text-sm font-bold text-[#17181C] mt-1">Assigned SM: Rohit Sharma</p>
                <p className="text-xs text-[#687182]">18 Active Merchants • 5 Leads Pending</p>
              </div>
            </div>
          </Card>
        )}

        {/* TAB 4: LEADERBOARD */}
        {activeTab === 'leaderboard' && (
          <Card padding="lg">
            <h2 className="text-base font-bold text-[#17181C] mb-4 pb-3 border-b border-[#E3E8EF]">
              Monthly Conversion Leaderboard
            </h2>
            <div className="space-y-3">
              <div className="p-4 bg-[#FEF6E7] rounded-xl border border-amber-200 flex items-center justify-between">
                <span className="font-bold text-xs text-amber-900">🥇 1st Place: Sneha Kulkarni (92% Target • ₹1,38,000)</span>
                <span className="text-xs font-black text-amber-900">₹15,000 Bonus Qualified</span>
              </div>
              <div className="p-4 bg-[#F4F6FB] rounded-xl border border-[#E3E8EF] flex items-center justify-between">
                <span className="font-bold text-xs text-[#17181C]">🥈 2nd Place: Karan Verma (84% Target • ₹1,26,000)</span>
                <span className="text-xs font-bold text-[#4787F2]">On Track</span>
              </div>
            </div>
          </Card>
        )}
      </main>
    </div>
  );
}
