'use client';

import React, { useState } from 'react';
import { useAuth, SEED_LEADS } from '@adsspot/api';
import { Card, Avatar, Button, RoleBadge } from '@adsspot/ui';
import {
  MapPin,
  Clock,
  Phone,
  Plus,
  Target as TargetIcon,
  TrendingUp,
  Building2,
  CheckCircle,
  UserCheck,
} from 'lucide-react';


export default function SMSalesPortalPage() {
  const { user } = useAuth();
  const [checkedIn, setCheckedIn] = useState(true);
  const [activeTab, setActiveTab] = useState<'territory' | 'attendance' | 'target' | 'leads' | 'commissions'>('territory');
  const [leads, setLeads] = useState(SEED_LEADS);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showOnboardModal, setShowOnboardModal] = useState(false);

  // New Merchant Form State
  const [newBizName, setNewBizName] = useState('');
  const [newOwnerName, setNewOwnerName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newCategory, setNewCategory] = useState('Food & Dining');
  const [newTier, setNewTier] = useState<'basic' | 'premium' | 'elite'>('elite');
  const [newAddress, setNewAddress] = useState('Fort, Mumbai 400001');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleCreateBusiness = () => {
    if (!newBizName || !newOwnerName || !newPhone) {
      alert('Please fill out Business Name, Owner Name, and Phone Number.');
      return;
    }

    const newLead = {
      id: `lead-custom-${Date.now()}`,
      sm_user_id: user?.id || 'usr-sm-1',
      business_name: newBizName,
      owner_name: newOwnerName,
      phone: newPhone,
      pincode: '400001',
      status: 'converted' as const,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    setLeads((prev) => [newLead, ...prev]);
    setShowOnboardModal(false);
    setNewBizName('');
    setNewOwnerName('');
    setNewPhone('');
    showToast(`🎉 "${newBizName}" successfully onboarded to ${newTier.toUpperCase()} tier!`);
  };

  const handleConvertLead = (id: string, name: string) => {
    setLeads((prev) =>
      prev.map((l) => (l.id === id ? { ...l, status: 'converted' as const } : l))
    );
    showToast(`Lead "${name}" onboarded & marked as Converted!`);
  };


  return (
    <div className="flex-1 bg-[#F4F6FB] min-h-[calc(100vh-100px)] flex relative">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-20 right-8 z-50 bg-[#17181C] text-white text-xs font-bold px-4 py-2.5 rounded-full shadow-2xl flex items-center gap-2 border border-neutral-700">
          <CheckCircle className="w-4 h-4 text-[#35AB4E]" />
          {toastMessage}
        </div>
      )}

      {/* Left Sidebar */}
      <aside className="w-64 bg-white border-r border-[#E3E8EF] p-5 hidden lg:flex flex-col justify-between flex-shrink-0">
        <div className="space-y-6">
          <div className="flex items-center gap-3 px-2">
            <Avatar src={user?.avatar_url} name={user?.full_name} size="md" />
            <div className="overflow-hidden">
              <span className="text-xs font-black text-[#1D53B8] uppercase tracking-wider">Field SM Portal</span>
              <p className="text-xs font-bold text-[#17181C] truncate">{user?.full_name}</p>
            </div>
          </div>

          <nav className="space-y-1 text-xs font-semibold text-[#4A5260]">
            <button
              onClick={() => setActiveTab('territory')}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-colors ${
                activeTab === 'territory' ? 'bg-[#EDF4FF] text-[#4787F2] font-bold' : 'hover:bg-[#F4F6FB]'
              }`}
            >
              <MapPin className="w-4 h-4" /> Assigned Territory
            </button>
            <button
              onClick={() => setActiveTab('attendance')}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-colors ${
                activeTab === 'attendance' ? 'bg-[#EDF4FF] text-[#4787F2] font-bold' : 'hover:bg-[#F4F6FB]'
              }`}
            >
              <Clock className="w-4 h-4" /> Attendance &amp; GPS ({checkedIn ? 'Checked In' : 'Off Duty'})
            </button>
            <button
              onClick={() => setActiveTab('target')}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-colors ${
                activeTab === 'target' ? 'bg-[#EDF4FF] text-[#4787F2] font-bold' : 'hover:bg-[#F4F6FB]'
              }`}
            >
              <TargetIcon className="w-4 h-4" /> Target Ring (75%)
            </button>
            <button
              onClick={() => setActiveTab('leads')}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-colors ${
                activeTab === 'leads' ? 'bg-[#EDF4FF] text-[#4787F2] font-bold' : 'hover:bg-[#F4F6FB]'
              }`}
            >
              <Building2 className="w-4 h-4" /> Lead Pipeline ({leads.length})
            </button>
            <button
              onClick={() => setActiveTab('commissions')}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-colors ${
                activeTab === 'commissions' ? 'bg-[#EDF4FF] text-[#4787F2] font-bold' : 'hover:bg-[#F4F6FB]'
              }`}
            >
              <TrendingUp className="w-4 h-4" /> Commissions &amp; Payouts
            </button>
          </nav>
        </div>

        <div className="pt-4 border-t border-[#E3E8EF] text-xs">
          <p className="font-bold text-[#17181C]">Territory: Fort (400001)</p>
          <p className="text-[#687182]">Reports to: Sunita Rao (RO)</p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 lg:p-8 space-y-8 max-w-7xl overflow-x-hidden">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-[#17181C]">
                {activeTab === 'territory' && 'Pincode Territory (400001)'}
                {activeTab === 'attendance' && 'Daily Attendance & GPS Check-In'}
                {activeTab === 'target' && 'Monthly Target & Performance Ring'}
                {activeTab === 'leads' && 'Field Lead Pipeline & Onboarding'}
                {activeTab === 'commissions' && 'Sales Manager Commissions & Disbursals'}
              </h1>
              <RoleBadge role="sm" size="sm" />
            </div>
            <p className="text-xs text-[#687182] mt-0.5">Assigned Pincode: 400001 (Fort, Mumbai) • Target: 10 Elite Onboardings</p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant={checkedIn ? 'outline' : 'primary'}
              size="sm"
              leftIcon={<Clock className="w-3.5 h-3.5" />}
              onClick={() => {
                setCheckedIn(!checkedIn);
                showToast(checkedIn ? 'Checked Out for the day' : 'GPS Check-In Verified at 18.9322, 72.8344');
              }}
            >
              {checkedIn ? 'Check Out (18.93°N, 72.83°E)' : 'Check In With GPS'}
            </Button>
            <Button
              variant="primary"
              size="sm"
              leftIcon={<Plus className="w-3.5 h-3.5" />}
              onClick={() => {
                setActiveTab('leads');
                showToast('New lead onboarding modal opened');
              }}
            >
              New Merchant Lead
            </Button>
          </div>
        </div>

        {/* TAB 1: TERRITORY & OVERVIEW */}
        {activeTab === 'territory' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card padding="md">
              <span className="text-xs font-bold text-[#687182] uppercase">Monthly Target</span>
              <p className="text-2xl font-black text-[#17181C] mt-2">₹1,50,000</p>
              <span className="text-xs font-bold text-[#35AB4E] mt-1 block">75% Achieved (₹1.12L)</span>
            </Card>
            <Card padding="md">
              <span className="text-xs font-bold text-[#687182] uppercase">Visits Logged Today</span>
              <p className="text-2xl font-black text-[#17181C] mt-2">6 Visits</p>
              <span className="text-xs text-[#687182] mt-1 block">GPS location tagged</span>
            </Card>
            <Card padding="md">
              <span className="text-xs font-bold text-[#687182] uppercase">Pipeline Leads</span>
              <p className="text-2xl font-black text-[#17181C] mt-2">{leads.length} Leads</p>
              <span className="text-xs font-bold text-[#4787F2] mt-1 block">3 Ready for closing</span>
            </Card>
            <Card padding="md">
              <span className="text-xs font-bold text-[#687182] uppercase">Est. Commission</span>
              <p className="text-2xl font-black text-[#17181C] mt-2">₹22,400</p>
              <span className="text-xs text-[#687182] mt-1 block">Paid on 1st of month</span>
            </Card>
          </div>
        )}

        {/* TAB 2: ATTENDANCE */}
        {activeTab === 'attendance' && (
          <Card padding="lg">
            <h2 className="text-base font-bold text-[#17181C] mb-2">GPS Geo-Fenced Attendance Log</h2>
            <p className="text-xs text-[#687182] mb-6">Attendance is verified against assigned pincode polygon boundary</p>
            <div className="space-y-3">
              <div className="p-4 bg-[#EBF9EE] rounded-xl border border-emerald-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <UserCheck className="w-5 h-5 text-[#1B6A2D]" />
                  <div>
                    <p className="text-xs font-bold text-[#1B6A2D]">Today: Checked In at 9:15 AM</p>
                    <p className="text-[11px] text-[#687182]">Lat: 18.9322° N, Long: 72.8344° E (Fort Pincode Center)</p>
                  </div>
                </div>
                <span className="text-xs font-bold bg-[#35AB4E] text-white px-2.5 py-1 rounded-full">
                  Verified On-Duty
                </span>
              </div>
            </div>
          </Card>
        )}

        {/* TAB 3: TARGET RING */}
        {activeTab === 'target' && (
          <Card padding="lg">
            <h2 className="text-base font-bold text-[#17181C] mb-2">Target &amp; Performance Ring</h2>
            <p className="text-xs text-[#687182] mb-6">Target: 10 Elite / 20 Premium merchants per month</p>
            <div className="p-6 bg-[#F4F6FB] rounded-2xl border border-[#E3E8EF] flex items-center justify-between">
              <div>
                <p className="text-3xl font-black text-[#17181C]">75%</p>
                <p className="text-xs font-bold text-[#35AB4E]">8 Elite Subscriptions Closed</p>
                <p className="text-[11px] text-[#687182] mt-1">2 more to unlock ₹10,000 monthly bonus accelerator</p>
              </div>
              <div className="w-24 h-24 rounded-full border-8 border-[#4787F2] border-t-amber-400 border-r-[#35AB4E] flex items-center justify-center font-black text-sm text-[#17181C]">
                8 / 10
              </div>
            </div>
          </Card>
        )}

        {/* TAB 4: LEADS PIPELINE */}
        {activeTab === 'leads' && (
          <Card padding="lg">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#E3E8EF] mb-4 gap-3">
              <div>
                <h2 className="text-base font-bold text-[#17181C]">Lead Pipeline in Fort</h2>
                <p className="text-xs text-[#687182]">Log visits, collect merchant details, and collect OTP payment</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#4787F2] bg-[#EDF4FF] px-2.5 py-1 rounded-full">{leads.length} Leads</span>
                <Button
                  variant="primary"
                  size="sm"
                  leftIcon={<Plus className="w-3.5 h-3.5" />}
                  onClick={() => setShowOnboardModal(true)}
                >
                  + Onboard New Merchant
                </Button>
              </div>
            </div>

            {/* Onboard Merchant Modal */}
            {showOnboardModal && (
              <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
                <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-[#E3E8EF] space-y-4 animate-scale-in">
                  <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-[#EDF4FF] text-[#4787F2] flex items-center justify-center font-bold">
                        <Building2 className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="text-sm font-black text-[#17181C]">In-Person Merchant Onboarding</h3>
                        <p className="text-[10px] text-[#687182]">Territory: Fort (400001)</p>
                      </div>
                    </div>
                    <button onClick={() => setShowOnboardModal(false)} className="text-neutral-400 hover:text-neutral-700">
                      ✕
                    </button>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-bold text-[#17181C] block mb-1">Business / Shop Name *</label>
                      <input
                        type="text"
                        value={newBizName}
                        onChange={(e) => setNewBizName(e.target.value)}
                        placeholder="e.g. Royal Sweets &amp; Dry Fruits"
                        className="w-full px-3 py-2 rounded-xl border border-[#E3E8EF] text-xs outline-none focus:border-[#4787F2]"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2.5">
                      <div>
                        <label className="text-xs font-bold text-[#17181C] block mb-1">Owner Full Name *</label>
                        <input
                          type="text"
                          value={newOwnerName}
                          onChange={(e) => setNewOwnerName(e.target.value)}
                          placeholder="e.g. Rajesh Mehta"
                          className="w-full px-3 py-2 rounded-xl border border-[#E3E8EF] text-xs outline-none focus:border-[#4787F2]"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-[#17181C] block mb-1">Mobile / WhatsApp *</label>
                        <input
                          type="tel"
                          value={newPhone}
                          onChange={(e) => setNewPhone(e.target.value)}
                          placeholder="+919876543210"
                          className="w-full px-3 py-2 rounded-xl border border-[#E3E8EF] text-xs outline-none focus:border-[#4787F2]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2.5">
                      <div>
                        <label className="text-xs font-bold text-[#17181C] block mb-1">Category</label>
                        <select
                          value={newCategory}
                          onChange={(e) => setNewCategory(e.target.value)}
                          className="w-full px-2.5 py-2 rounded-xl border border-[#E3E8EF] text-xs bg-white outline-none"
                        >
                          <option value="Food & Dining">Food &amp; Dining</option>
                          <option value="Fashion & Apparel">Fashion &amp; Apparel</option>
                          <option value="Jewellery & Luxury">Jewellery &amp; Luxury</option>
                          <option value="Daily Groceries">Daily Groceries</option>
                          <option value="Health & Pharmacy">Health &amp; Pharmacy</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-xs font-bold text-[#17181C] block mb-1">Membership Tier</label>
                        <select
                          value={newTier}
                          onChange={(e) => setNewTier(e.target.value as any)}
                          className="w-full px-2.5 py-2 rounded-xl border border-[#E3E8EF] text-xs bg-white outline-none font-bold text-[#4787F2]"
                        >
                          <option value="elite">Elite (₹1,499/mo) - Top Comm</option>
                          <option value="premium">Premium (₹499/mo)</option>
                          <option value="basic">Basic (Free Listing)</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-[#17181C] block mb-1">Shop Address</label>
                      <input
                        type="text"
                        value={newAddress}
                        onChange={(e) => setNewAddress(e.target.value)}
                        placeholder="Shop No, Street, Landmark"
                        className="w-full px-3 py-2 rounded-xl border border-[#E3E8EF] text-xs outline-none"
                      />
                    </div>
                  </div>

                  <div className="pt-2 border-t border-neutral-100 flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1" onClick={() => setShowOnboardModal(false)}>
                      Cancel
                    </Button>
                    <Button variant="primary" size="sm" className="flex-1 font-bold" onClick={handleCreateBusiness}>
                      Verify OTP &amp; Complete Onboarding
                    </Button>
                  </div>
                </div>
              </div>
            )}


            <div className="space-y-3">
              {leads.map((lead) => (
                <div key={lead.id} className="p-4 rounded-xl bg-white border border-[#E3E8EF] flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-[#17181C]">{lead.business_name}</span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          lead.status === 'converted'
                            ? 'bg-[#EBF9EE] text-[#1B6A2D]'
                            : lead.status === 'interested'
                              ? 'bg-[#EDF4FF] text-[#1D53B8]'
                              : 'bg-neutral-100 text-neutral-600'
                        }`}
                      >
                        {lead.status.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-xs text-[#687182] mt-0.5">Owner: {lead.owner_name} • Phone: {lead.phone}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <a
                      href={`tel:${lead.phone}`}
                      className="px-3 py-1.5 rounded-full bg-[#F4F6FB] hover:bg-[#EDF4FF] text-[#4787F2] font-bold text-xs flex items-center gap-1"
                    >
                      <Phone className="w-3.5 h-3.5" /> Call
                    </a>
                    {lead.status !== 'converted' && (
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleConvertLead(lead.id, lead.business_name)}
                      >
                        Collect Payment &amp; Onboard
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* TAB 5: COMMISSIONS */}
        {activeTab === 'commissions' && (
          <Card padding="lg">
            <h2 className="text-base font-bold text-[#17181C] mb-2">Commission Ledger &amp; Bank Disbursals</h2>
            <p className="text-xs text-[#687182] mb-6">Earn 20% on every Elite onboarding and 15% on renewals</p>
            <div className="space-y-3">
              <div className="p-4 bg-[#F4F6FB] rounded-xl flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-[#17181C]">Royal Heritage Jewellers (Elite ₹49,999)</p>
                  <p className="text-[11px] text-[#687182]">Onboarded 18 Aug 2026</p>
                </div>
                <span className="text-sm font-black text-[#35AB4E]">+ ₹9,999.00</span>
              </div>
              <div className="p-4 bg-[#F4F6FB] rounded-xl flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-[#17181C]">Mehta Authentic Mithai (Premium ₹14,999)</p>
                  <p className="text-[11px] text-[#687182]">Onboarded 21 Aug 2026</p>
                </div>
                <span className="text-sm font-black text-[#35AB4E]">+ ₹2,249.00</span>
              </div>
            </div>
          </Card>
        )}
      </main>
    </div>
  );
}
