'use client';

import React, { useState } from 'react';
import { Card, Avatar, Button, RoleBadge } from '@adsspot/ui';
import {
  Building2,
  Users,
  Target as TargetIcon,
  PieChart,
  Megaphone,
} from 'lucide-react';


export default function ZODashboardPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'regions' | 'targets' | 'announcements'>('overview');
  const [announcementText, setAnnouncementText] = useState('');
  const [announcements, setAnnouncements] = useState([
    {
      id: 'ann-1',
      title: 'Diwali Incentive Accelerator 2026',
      message: 'All SMs hitting >100% Elite target by 30th Oct receive extra ₹15,000 festival payout.',
      date: '24 Aug 2026',
    },
  ]);

  const handlePostAnnouncement = () => {
    if (!announcementText.trim()) return;
    setAnnouncements([
      {
        id: `ann-${Date.now()}`,
        title: 'Zone Announcement',
        message: announcementText,
        date: 'Today',
      },
      ...announcements,
    ]);
    setAnnouncementText('');
  };

  return (
    <div className="flex-1 bg-[#F4F6FB] min-h-[calc(100vh-100px)] flex">
      {/* Left Sidebar */}
      <aside className="w-64 bg-white border-r border-[#E3E8EF] p-5 hidden lg:flex flex-col justify-between flex-shrink-0">
        <div className="space-y-6">
          <div className="flex items-center gap-2.5 px-2">
            <div className="w-8 h-8 rounded-xl bg-[#981837] text-white flex items-center justify-center font-bold">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-black text-[#981837] uppercase tracking-wider">Zone Officer</span>
              <p className="text-xs font-bold text-[#17181C]">Mumbai City Command</p>
            </div>
          </div>

          <nav className="space-y-1 text-xs font-semibold text-[#4A5260]">
            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-colors ${
                activeTab === 'overview' ? 'bg-[#EDF4FF] text-[#4787F2] font-bold' : 'hover:bg-[#F4F6FB]'
              }`}
            >
              <PieChart className="w-4 h-4" /> City Overview
            </button>
            <button
              onClick={() => setActiveTab('regions')}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-colors ${
                activeTab === 'regions' ? 'bg-[#EDF4FF] text-[#4787F2] font-bold' : 'hover:bg-[#F4F6FB]'
              }`}
            >
              <Users className="w-4 h-4" /> Regions &amp; Appointed ROs
            </button>
            <button
              onClick={() => setActiveTab('targets')}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-colors ${
                activeTab === 'targets' ? 'bg-[#EDF4FF] text-[#4787F2] font-bold' : 'hover:bg-[#F4F6FB]'
              }`}
            >
              <TargetIcon className="w-4 h-4" /> Monthly City Targets
            </button>
            <button
              onClick={() => setActiveTab('announcements')}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-colors ${
                activeTab === 'announcements' ? 'bg-[#EDF4FF] text-[#4787F2] font-bold' : 'hover:bg-[#F4F6FB]'
              }`}
            >
              <Megaphone className="w-4 h-4" /> Broadcast Announcements
            </button>
          </nav>
        </div>

        <div className="pt-4 border-t border-[#E3E8EF] text-[11px] text-[#687182]">
          <p className="font-bold text-[#17181C]">Devendra Patel (ZO)</p>
          <p>City Target: ₹50,00,000</p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 lg:p-8 space-y-8 max-w-7xl overflow-x-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-[#17181C]">
                {activeTab === 'overview' && 'Mumbai City Zone Command'}
                {activeTab === 'regions' && 'Regions & Regional Officers (ROs)'}
                {activeTab === 'targets' && 'Monthly Target Breakdown'}
                {activeTab === 'announcements' && 'Field Broadcast Announcements'}
              </h1>
              <RoleBadge role="zo" size="sm" />
            </div>
            <p className="text-xs text-[#687182] mt-0.5">City Zone: Mumbai • 3 Regions • 18 SMs • Target: ₹50.00 Lakhs</p>
          </div>
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Card padding="md" className="border-l-4 border-l-[#981837]">
                <span className="text-xs font-bold text-[#687182] uppercase">City Monthly Revenue</span>
                <p className="text-2xl font-black text-[#17181C] mt-2">₹41.20 Lakhs</p>
                <span className="text-[11px] text-[#35AB4E] font-semibold mt-1 block">82.4% of City Target</span>
              </Card>

              <Card padding="md" className="border-l-4 border-l-[#4787F2]">
                <span className="text-xs font-bold text-[#687182] uppercase">Regions Active</span>
                <p className="text-2xl font-black text-[#17181C] mt-2">3 Regions</p>
                <span className="text-[11px] text-[#687182] mt-1 block">South, West, Central Mumbai</span>
              </Card>

              <Card padding="md" className="border-l-4 border-l-[#F2B604]">
                <span className="text-xs font-bold text-[#687182] uppercase">Total City Outlets</span>
                <p className="text-2xl font-black text-[#17181C] mt-2">1,240</p>
                <span className="text-[11px] text-[#35AB4E] font-semibold mt-1 block">+42 onboarded this week</span>
              </Card>
            </div>

            {/* Region breakdown */}
            <Card padding="lg">
              <h2 className="text-base font-bold text-[#17181C] mb-4 pb-3 border-b border-[#E3E8EF]">
                Regional Performance Split
              </h2>
              <div className="space-y-3">
                <div className="p-4 bg-[#F4F6FB] rounded-xl border border-[#E3E8EF] flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-sm text-[#17181C]">Mumbai South Region (RO Sunita Rao)</h3>
                    <p className="text-xs text-[#687182]">6 SMs • Fort, Colaba, Nariman Point</p>
                  </div>
                  <span className="text-xs font-bold text-[#35AB4E]">₹12.45L / ₹15.00L (83%)</span>
                </div>
                <div className="p-4 bg-[#F4F6FB] rounded-xl border border-[#E3E8EF] flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-sm text-[#17181C]">Mumbai West Region (RO Rajesh Mehta)</h3>
                    <p className="text-xs text-[#687182]">7 SMs • Bandra, Andheri, Juhu</p>
                  </div>
                  <span className="text-xs font-bold text-[#35AB4E]">₹18.20L / ₹20.00L (91%)</span>
                </div>
                <div className="p-4 bg-[#F4F6FB] rounded-xl border border-[#E3E8EF] flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-sm text-[#17181C]">Mumbai Central Region (RO Ananya Deshmukh)</h3>
                    <p className="text-xs text-[#687182]">5 SMs • Dadar, Lower Parel, Worli</p>
                  </div>
                  <span className="text-xs font-bold text-[#4787F2]">₹10.55L / ₹15.00L (70%)</span>
                </div>
              </div>
            </Card>
          </>
        )}

        {/* TAB 2: REGIONS */}
        {activeTab === 'regions' && (
          <Card padding="lg">
            <h2 className="text-base font-bold text-[#17181C] mb-4 pb-3 border-b border-[#E3E8EF]">
              Appointed Regional Officers (ROs)
            </h2>
            <div className="space-y-3">
              <div className="p-4 bg-white rounded-xl border border-[#E3E8EF] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150" name="Sunita Rao" size="md" />
                  <div>
                    <span className="text-sm font-bold text-[#17181C]">Sunita Rao</span>
                    <p className="text-xs text-[#687182]">RO Mumbai South (Appointed 1 Jan 2026)</p>
                  </div>
                </div>
                <RoleBadge role="ro" size="sm" />
              </div>
            </div>
          </Card>
        )}

        {/* TAB 3: TARGETS */}
        {activeTab === 'targets' && (
          <Card padding="lg">
            <h2 className="text-base font-bold text-[#17181C] mb-4 pb-3 border-b border-[#E3E8EF]">
              City Target Configuration
            </h2>
            <div className="p-4 bg-[#F4F6FB] rounded-xl border border-[#E3E8EF]">
              <span className="text-xs font-bold text-[#687182]">Total Monthly Target</span>
              <p className="text-3xl font-black text-[#17181C] mt-1">₹50,00,000</p>
              <p className="text-xs text-[#35AB4E] font-bold mt-2">Achieved to date: ₹41,20,000 (82.4%)</p>
            </div>
          </Card>
        )}

        {/* TAB 4: ANNOUNCEMENTS */}
        {activeTab === 'announcements' && (
          <Card padding="lg">
            <h2 className="text-base font-bold text-[#17181C] mb-4 pb-3 border-b border-[#E3E8EF]">
              Broadcast Announcement to All ROs &amp; SMs
            </h2>
            <div className="space-y-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Type broadcast message to entire city field force..."
                  value={announcementText}
                  onChange={(e) => setAnnouncementText(e.target.value)}
                  className="flex-1 bg-white border border-[#E3E8EF] rounded-xl px-4 py-2 text-xs outline-none focus:border-[#4787F2]"
                />
                <Button variant="primary" size="sm" onClick={handlePostAnnouncement}>
                  Broadcast Now
                </Button>
              </div>

              <div className="space-y-3 pt-4 border-t border-[#E3E8EF]">
                {announcements.map((ann) => (
                  <div key={ann.id} className="p-4 bg-[#FEF6E7] rounded-xl border border-amber-200">
                    <span className="text-xs font-extrabold text-amber-900">{ann.title}</span>
                    <p className="text-xs text-[#17181C] mt-1 font-medium">{ann.message}</p>
                    <span className="text-[10px] text-[#687182] mt-2 block">{ann.date}</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        )}
      </main>
    </div>
  );
}
