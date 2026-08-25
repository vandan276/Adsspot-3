'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth, SEED_AUDIT_LOGS, SEED_CATEGORIES } from '@adsspot/api';

import { Card, Avatar, Button, RoleBadge, TierBadge, TrustedBadge } from '@adsspot/ui';
import {
  Crown,
  Users,
  Store,
  DollarSign,
  ShieldCheck,
  FileCheck,
  Layers,
  Activity,
  ArrowUpRight,
  Sliders,
  CheckCircle,
  Plus,
  Search,
  UserPlus,
  X,
} from 'lucide-react';

export default function AdminDashboardPage() {
  const { staffList, merchantList, addEmployee, addMerchant, personas, switchPersona } = useAuth();
  const [activeTab, setActiveTab] = useState<
    'overview' | 'tree' | 'merchants' | 'revenue' | 'moderation' | 'cms' | 'permissions'
  >('overview');

  const [merchantTierFilter, setMerchantTierFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modals
  const [showAddStaffModal, setShowAddStaffModal] = useState(false);
  const [showAddMerchantModal, setShowAddMerchantModal] = useState(false);

  // Add Staff Form State
  const [staffForm, setStaffForm] = useState<{
    name: string;
    phone: string;
    role: 'sm' | 'ro' | 'zo' | 'super_admin';
    city_id: string;
    region_id: string;
    pincode: string;
    target_monthly: number;
  }>({
    name: '',
    phone: '',
    role: 'sm',
    city_id: 'city-mum',
    region_id: 'reg-mum-south',
    pincode: '400001',
    target_monthly: 250000,
  });

  // Add Merchant Form State
  const [merchantForm, setMerchantForm] = useState<{
    business_name: string;
    owner_name: string;
    phone: string;
    category_id: string;
    address: string;
    pincode: string;
    tier: 'basic' | 'premium' | 'elite';
    trusted: boolean;
  }>({
    business_name: '',
    owner_name: '',
    phone: '',
    category_id: 'cat-1',
    address: '',
    pincode: '400001',
    tier: 'premium',
    trusted: true,
  });

  const [moderationQueue, setModerationQueue] = useState([
    {
      id: 'mod-1',
      business: 'Royal Heritage Jewellers',
      author: 'Aarav Sharma',
      type: 'Customer Photo',
      title: 'Bridal Set Unboxing in store',
      image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=600',
      time: '12 mins ago',
      status: 'pending',
    },
    {
      id: 'mod-2',
      business: 'Mehta Authentic Mithai',
      author: 'Pooja Nair',
      type: 'Store Review Post',
      title: 'Fresh Kesar Jalebis with Rabdi review',
      image: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=600',
      time: '34 mins ago',
      status: 'pending',
    },
  ]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleCreateEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!staffForm.name || !staffForm.phone) {
      alert('Please provide staff name and phone number.');
      return;
    }
    const created = addEmployee(staffForm);
    setShowAddStaffModal(false);
    setStaffForm({
      name: '',
      phone: '',
      role: 'sm',
      city_id: 'city-mum',
      region_id: 'reg-mum-south',
      pincode: '400001',
      target_monthly: 250000,
    });
    showToast(`Staff member ${created.full_name} (${created.role.toUpperCase()}) registered successfully!`);
  };

  const handleCreateMerchant = (e: React.FormEvent) => {
    e.preventDefault();
    if (!merchantForm.business_name || !merchantForm.owner_name || !merchantForm.phone) {
      alert('Please fill out all merchant details.');
      return;
    }
    const { business } = addMerchant(merchantForm);
    setShowAddMerchantModal(false);
    setMerchantForm({
      business_name: '',
      owner_name: '',
      phone: '',
      category_id: 'cat-1',
      address: '',
      pincode: '400001',
      tier: 'premium',
      trusted: true,
    });
    showToast(`Merchant ${business.name} added with Digital Visiting Card (/card/${business.slug})!`);
  };

  const filteredMerchants = merchantList.filter((b) => {
    const matchTier = merchantTierFilter === 'all' || b.tier === merchantTierFilter;
    const matchSearch =
      searchQuery === '' ||
      b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.address.toLowerCase().includes(searchQuery.toLowerCase());
    return matchTier && matchSearch;
  });

  const handleApprove = (id: string) => {
    setModerationQueue((prev) => prev.filter((item) => item.id !== id));
    showToast('Content approved and published to live consumer feed!');
  };

  return (
    <div className="flex-1 bg-[#F4F6FB] min-h-[calc(100vh-100px)] flex relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 bg-[#17181C] text-white text-xs font-bold px-4 py-2.5 rounded-full shadow-2xl flex items-center gap-2 border border-neutral-700 animate-fade-in">
          <CheckCircle className="w-4 h-4 text-[#35AB4E]" />
          {toastMessage}
        </div>
      )}

      {/* 1. ADD EMPLOYEE MODAL */}
      {showAddStaffModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-[#E3E8EF] max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-[#E3E8EF] mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#4787F2] text-white flex items-center justify-center font-bold">
                  <UserPlus className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-black text-[#17181C]">Onboard New Real Employee</h3>
                  <p className="text-xs text-[#687182]">Add Sales Manager, Regional Officer or Zone Officer</p>
                </div>
              </div>
              <button onClick={() => setShowAddStaffModal(false)} className="text-neutral-400 hover:text-neutral-700 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateEmployee} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#17181C] uppercase tracking-wider mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rohit Sharma"
                  value={staffForm.name}
                  onChange={(e) => setStaffForm({ ...staffForm, name: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#E3E8EF] text-xs font-medium outline-none focus:border-[#4787F2]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#17181C] uppercase tracking-wider mb-1">
                  Mobile Phone (OTP Login Number)
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+91 98201 12345"
                  value={staffForm.phone}
                  onChange={(e) => setStaffForm({ ...staffForm, phone: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#E3E8EF] text-xs font-medium outline-none focus:border-[#4787F2]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#17181C] uppercase tracking-wider mb-1">
                    Role
                  </label>
                  <select
                    value={staffForm.role}
                    onChange={(e) => setStaffForm({ ...staffForm, role: e.target.value as any })}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#E3E8EF] text-xs font-bold outline-none focus:border-[#4787F2]"
                  >
                    <option value="sm">SM (Sales Manager)</option>
                    <option value="ro">RO (Regional Officer)</option>
                    <option value="zo">ZO (Zone Officer)</option>
                    <option value="super_admin">Super Admin</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#17181C] uppercase tracking-wider mb-1">
                    Monthly Target (₹)
                  </label>
                  <input
                    type="number"
                    value={staffForm.target_monthly}
                    onChange={(e) => setStaffForm({ ...staffForm, target_monthly: Number(e.target.value) })}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#E3E8EF] text-xs font-medium outline-none focus:border-[#4787F2]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#17181C] uppercase tracking-wider mb-1">
                    Assigned Region / City
                  </label>
                  <input
                    type="text"
                    placeholder="Mumbai South"
                    value={staffForm.region_id}
                    onChange={(e) => setStaffForm({ ...staffForm, region_id: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#E3E8EF] text-xs font-medium outline-none focus:border-[#4787F2]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#17181C] uppercase tracking-wider mb-1">
                    Territory Pincode
                  </label>
                  <input
                    type="text"
                    placeholder="400001"
                    value={staffForm.pincode}
                    onChange={(e) => setStaffForm({ ...staffForm, pincode: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#E3E8EF] text-xs font-medium outline-none focus:border-[#4787F2]"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-[#E3E8EF] flex justify-end gap-2">
                <Button type="button" variant="outline" size="sm" onClick={() => setShowAddStaffModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm">
                  Register Employee
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. ADD MERCHANT MODAL */}
      {showAddMerchantModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-[#E3E8EF] max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-[#E3E8EF] mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#35AB4E] text-white flex items-center justify-center font-bold">
                  <Store className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-black text-[#17181C]">Onboard New Merchant / Shop</h3>
                  <p className="text-xs text-[#687182]">Creates business account, digital card &amp; tier subscription</p>
                </div>
              </div>
              <button onClick={() => setShowAddMerchantModal(false)} className="text-neutral-400 hover:text-neutral-700 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateMerchant} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#17181C] uppercase tracking-wider mb-1">
                  Business / Store Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Bombay Gold Emporium"
                  value={merchantForm.business_name}
                  onChange={(e) => setMerchantForm({ ...merchantForm, business_name: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#E3E8EF] text-xs font-medium outline-none focus:border-[#4787F2]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#17181C] uppercase tracking-wider mb-1">
                    Owner Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Anand Joshi"
                    value={merchantForm.owner_name}
                    onChange={(e) => setMerchantForm({ ...merchantForm, owner_name: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#E3E8EF] text-xs font-medium outline-none focus:border-[#4787F2]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#17181C] uppercase tracking-wider mb-1">
                    Phone / WhatsApp
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={merchantForm.phone}
                    onChange={(e) => setMerchantForm({ ...merchantForm, phone: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#E3E8EF] text-xs font-medium outline-none focus:border-[#4787F2]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#17181C] uppercase tracking-wider mb-1">
                    Category
                  </label>
                  <select
                    value={merchantForm.category_id}
                    onChange={(e) => setMerchantForm({ ...merchantForm, category_id: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#E3E8EF] text-xs font-bold outline-none focus:border-[#4787F2]"
                  >
                    {SEED_CATEGORIES.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#17181C] uppercase tracking-wider mb-1">
                    Membership Tier
                  </label>
                  <select
                    value={merchantForm.tier}
                    onChange={(e) => setMerchantForm({ ...merchantForm, tier: e.target.value as any })}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#E3E8EF] text-xs font-bold outline-none focus:border-[#4787F2]"
                  >
                    <option value="basic">Basic (₹999/mo)</option>
                    <option value="premium">Premium (₹2,499/mo)</option>
                    <option value="elite">Elite (₹4,999/mo)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#17181C] uppercase tracking-wider mb-1">
                  Full Store Address
                </label>
                <input
                  type="text"
                  required
                  placeholder="Shop 4, Flora Fountain, Fort"
                  value={merchantForm.address}
                  onChange={(e) => setMerchantForm({ ...merchantForm, address: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#E3E8EF] text-xs font-medium outline-none focus:border-[#4787F2]"
                />
              </div>

              <div className="pt-3 border-t border-[#E3E8EF] flex justify-end gap-2">
                <Button type="button" variant="outline" size="sm" onClick={() => setShowAddMerchantModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm">
                  Onboard Merchant
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Fixed Left Sidebar */}
      <aside className="w-64 bg-white border-r border-[#E3E8EF] p-5 hidden lg:flex flex-col justify-between flex-shrink-0">
        <div className="space-y-6">
          <div className="flex items-center gap-2.5 px-2">
            <div className="w-8 h-8 rounded-xl bg-[#981837] text-white flex items-center justify-center font-bold">
              <Crown className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-black text-[#981837] uppercase tracking-wider">Super Admin</span>
              <p className="text-xs font-bold text-[#17181C]">Global Operations</p>
            </div>
          </div>

          <nav className="space-y-1 text-xs font-semibold text-[#4A5260]">
            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-colors ${
                activeTab === 'overview' ? 'bg-[#EDF4FF] text-[#4787F2] font-bold' : 'hover:bg-[#F4F6FB]'
              }`}
            >
              <Activity className="w-4 h-4" /> Global Overview
            </button>
            <button
              onClick={() => setActiveTab('tree')}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-colors ${
                activeTab === 'tree' ? 'bg-[#EDF4FF] text-[#4787F2] font-bold' : 'hover:bg-[#F4F6FB]'
              }`}
            >
              <Users className="w-4 h-4" /> Staff Hierarchy ({staffList.length})
            </button>
            <button
              onClick={() => setActiveTab('merchants')}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-colors ${
                activeTab === 'merchants' ? 'bg-[#EDF4FF] text-[#4787F2] font-bold' : 'hover:bg-[#F4F6FB]'
              }`}
            >
              <Store className="w-4 h-4" /> All Merchants ({merchantList.length})
            </button>
            <button
              onClick={() => setActiveTab('revenue')}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-colors ${
                activeTab === 'revenue' ? 'bg-[#EDF4FF] text-[#4787F2] font-bold' : 'hover:bg-[#F4F6FB]'
              }`}
            >
              <DollarSign className="w-4 h-4" /> Memberships &amp; Revenue
            </button>
            <button
              onClick={() => setActiveTab('moderation')}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-colors ${
                activeTab === 'moderation' ? 'bg-[#EDF4FF] text-[#4787F2] font-bold' : 'hover:bg-[#F4F6FB]'
              }`}
            >
              <FileCheck className="w-4 h-4" /> Content Moderation ({moderationQueue.length})
            </button>
            <button
              onClick={() => setActiveTab('cms')}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-colors ${
                activeTab === 'cms' ? 'bg-[#EDF4FF] text-[#4787F2] font-bold' : 'hover:bg-[#F4F6FB]'
              }`}
            >
              <Layers className="w-4 h-4" /> Banner Template CMS
            </button>
            <button
              onClick={() => setActiveTab('permissions')}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-colors ${
                activeTab === 'permissions' ? 'bg-[#EDF4FF] text-[#4787F2] font-bold' : 'hover:bg-[#F4F6FB]'
              }`}
            >
              <Sliders className="w-4 h-4" /> Roles &amp; Permissions
            </button>
          </nav>
        </div>

        {/* Action Buttons in Sidebar */}
        <div className="pt-4 border-t border-[#E3E8EF] space-y-2">
          <Button
            variant="primary"
            size="sm"
            className="w-full font-bold"
            leftIcon={<UserPlus className="w-4 h-4" />}
            onClick={() => setShowAddStaffModal(true)}
          >
            + Add Employee
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="w-full font-bold"
            leftIcon={<Store className="w-4 h-4" />}
            onClick={() => setShowAddMerchantModal(true)}
          >
            + Add Merchant
          </Button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 max-w-7xl mx-auto space-y-6">
        {/* Top Header with Quick Action Buttons */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-[#17181C]">Executive Control Center</h1>
            <p className="text-xs text-[#687182]">Pan-India Hyperlocal Operations • Live Audit &amp; Staff Hierarchy</p>
          </div>

          <div className="flex gap-2">
            <Button
              variant="primary"
              size="sm"
              leftIcon={<UserPlus className="w-4 h-4" />}
              onClick={() => setShowAddStaffModal(true)}
            >
              + Add Employee
            </Button>
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Store className="w-4 h-4" />}
              onClick={() => setShowAddMerchantModal(true)}
            >
              + Add Merchant
            </Button>
          </div>
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <>
            {/* Global KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card padding="md">
                <span className="text-xs text-[#687182] font-semibold">Total Verified Merchants</span>
                <div className="text-2xl font-black text-[#17181C] mt-1">{merchantList.length}</div>
                <span className="text-[11px] font-bold text-[#35AB4E] flex items-center gap-1 mt-1">
                  <ArrowUpRight className="w-3 h-3" /> +14 this week
                </span>
              </Card>

              <Card padding="md">
                <span className="text-xs text-[#687182] font-semibold">Active Field Staff</span>
                <div className="text-2xl font-black text-[#17181C] mt-1">{staffList.length}</div>
                <span className="text-[11px] font-bold text-[#4787F2] flex items-center gap-1 mt-1">
                  <ShieldCheck className="w-3 h-3" /> 100% Verified Attendance
                </span>
              </Card>

              <Card padding="md">
                <span className="text-xs text-[#687182] font-semibold">Monthly Platform Revenue</span>
                <div className="text-2xl font-black text-[#17181C] mt-1">₹4,84,500</div>
                <span className="text-[11px] font-bold text-[#35AB4E] flex items-center gap-1 mt-1">
                  <ArrowUpRight className="w-3 h-3" /> +28.4% vs last month
                </span>
              </Card>

              <Card padding="md">
                <span className="text-xs text-[#687182] font-semibold">Pending Moderation</span>
                <div className="text-2xl font-black text-[#981837] mt-1">{moderationQueue.length}</div>
                <span className="text-[11px] font-bold text-[#981837] flex items-center gap-1 mt-1">
                  <Activity className="w-3 h-3" /> Requires review
                </span>
              </Card>
            </div>

            {/* Live System Audit Logs */}
            <Card padding="lg">
              <div className="flex items-center justify-between pb-4 border-b border-[#E3E8EF] mb-4">
                <div>
                  <h2 className="text-base font-bold text-[#17181C]">Immutable System Audit Trail</h2>
                  <p className="text-xs text-[#687182]">Real-time tamper-proof logging across staff, merchant &amp; admin events</p>
                </div>
                <span className="text-xs font-bold px-3 py-1 bg-[#EBF9EE] text-[#1B6A2D] rounded-full">
                  PostgreSQL RLS Active
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-[#E3E8EF] text-[#687182] font-bold">
                      <th className="pb-3">Timestamp</th>
                      <th className="pb-3">Actor</th>
                      <th className="pb-3">Action</th>
                      <th className="pb-3">Entity</th>
                      <th className="pb-3">Metadata</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E3E8EF]">
                    {SEED_AUDIT_LOGS.map((log) => (
                      <tr key={log.id} className="hover:bg-[#F4F6FB]/50">
                        <td className="py-3 font-mono text-[#687182]">
                          {new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </td>
                        <td className="py-3 font-bold text-[#17181C]">{log.actor_id}</td>
                        <td className="py-3">
                          <span className="px-2 py-0.5 rounded-full bg-[#EDF4FF] text-[#4787F2] font-bold">
                            {log.action}
                          </span>
                        </td>
                        <td className="py-3 font-semibold text-[#17181C] capitalize">{log.entity_type}</td>
                        <td className="py-3 font-mono text-[#687182] max-w-xs truncate">
                          {JSON.stringify(log.meta)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </>
        )}

        {/* TAB 2: STAFF HIERARCHY TREE */}
        {activeTab === 'tree' && (
          <Card padding="lg" className="space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-[#E3E8EF]">
              <div>
                <h2 className="text-base font-bold text-[#17181C]">Pan-India Field Staff Architecture</h2>
                <p className="text-xs text-[#687182]">Super Admin → Zone Officers (Cities) → Regional Officers → Sales Managers (Pincodes)</p>
              </div>
              <Button variant="primary" size="sm" leftIcon={<UserPlus className="w-4 h-4" />} onClick={() => setShowAddStaffModal(true)}>
                + Add Employee
              </Button>
            </div>

            {/* Live Staff Roster Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {staffList.map((st) => {
                const p = personas.find((item) => item.id === st.user_id);
                const name = p?.name || `Staff ${st.id.slice(-4)}`;
                const phone = p?.phone || '+91 98765 43210';
                return (
                  <div key={st.id} className="p-4 rounded-2xl bg-white border border-[#E3E8EF] shadow-sm space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <Avatar src={p?.avatar_url} name={name} size="sm" />
                        <div>
                          <h4 className="text-xs font-bold text-[#17181C]">{name}</h4>
                          <span className="text-[10px] text-[#687182]">{phone}</span>
                        </div>
                      </div>
                      <RoleBadge role={st.role} size="sm" />
                    </div>

                    <div className="pt-2 border-t border-[#F4F6FB] flex items-center justify-between text-[11px]">
                      <span className="text-[#687182]">Target: ₹{st.target_monthly?.toLocaleString()}</span>
                      <span className="text-[#35AB4E] font-bold">Active</span>
                    </div>

                    <button
                      onClick={() => {
                        if (p) switchPersona(p.id);
                        showToast(`Switched active context to ${name} (${st.role.toUpperCase()})`);
                      }}
                      className="w-full py-1.5 rounded-xl bg-[#EDF4FF] hover:bg-[#D9E8FF] text-[11px] font-bold text-[#4787F2] transition-colors"
                    >
                      Login as Persona →
                    </button>
                  </div>
                );
              })}
            </div>
          </Card>
        )}

        {/* TAB 3: ALL MERCHANTS */}
        {activeTab === 'merchants' && (
          <Card padding="lg" className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#E3E8EF]">
              <div>
                <h2 className="text-base font-bold text-[#17181C]">Registered Hyperlocal Merchants ({merchantList.length})</h2>
                <p className="text-xs text-[#687182]">Filter by tier, manage digital cards and microsites</p>
              </div>

              <div className="flex items-center gap-2">
                <Button variant="primary" size="sm" leftIcon={<Store className="w-4 h-4" />} onClick={() => setShowAddMerchantModal(true)}>
                  + Add Merchant
                </Button>
              </div>
            </div>

            {/* Filter bar */}
            <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
              <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
                {['all', 'elite', 'premium', 'basic'].map((tier) => (
                  <button
                    key={tier}
                    onClick={() => setMerchantTierFilter(tier)}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase transition-colors ${
                      merchantTierFilter === tier
                        ? 'bg-[#4787F2] text-white shadow-sm'
                        : 'bg-white text-[#4A5260] border border-[#E3E8EF] hover:bg-neutral-50'
                    }`}
                  >
                    {tier}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2 bg-[#F4F6FB] px-3 py-2 rounded-xl border border-[#E3E8EF] w-full sm:w-64">
                <Search className="w-4 h-4 text-[#687182]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search merchant name or address..."
                  className="bg-transparent outline-none text-xs w-full text-[#17181C]"
                />
              </div>
            </div>

            {/* Merchants List */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#E3E8EF] text-[#687182] font-bold">
                    <th className="pb-3">Business</th>
                    <th className="pb-3">Tier</th>
                    <th className="pb-3">Address &amp; Pincode</th>
                    <th className="pb-3">Phone</th>
                    <th className="pb-3">Rating</th>
                    <th className="pb-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E3E8EF]">
                  {filteredMerchants.map((biz) => (
                    <tr key={biz.id} className="hover:bg-[#F4F6FB]/50">
                      <td className="py-3">
                        <div className="flex items-center gap-3">
                          <Avatar src={biz.logo_url} name={biz.name} size="sm" isElite={biz.tier === 'elite'} />
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-[#17181C]">{biz.name}</span>
                              {biz.trusted && <TrustedBadge size="sm" />}
                            </div>
                            <span className="text-[10px] text-[#687182]">Slug: /card/{biz.slug}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3">
                        <TierBadge tier={biz.tier} size="sm" />
                      </td>
                      <td className="py-3 text-[#4A5260]">
                        {biz.address} ({biz.pincode})
                      </td>
                      <td className="py-3 font-mono text-[#687182]">{biz.phone}</td>
                      <td className="py-3 font-bold text-[#35AB4E]">★ {biz.stats?.avg_rating || 4.9}</td>
                      <td className="py-3 text-right space-x-2">
                        <Link href={`/card/${biz.slug}`} target="_blank">
                          <Button variant="outline" size="sm">
                            Card
                          </Button>
                        </Link>
                        {biz.tier === 'elite' && (
                          <Link href={`/b/${biz.slug}`} target="_blank">
                            <Button variant="primary" size="sm">
                              Microsite
                            </Button>
                          </Link>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {/* TAB 4: REVENUE & MEMBERSHIPS */}
        {activeTab === 'revenue' && (
          <Card padding="lg" className="space-y-4">
            <div className="flex items-center justify-between pb-4 border-b border-[#E3E8EF]">
              <div>
                <h2 className="text-base font-bold text-[#17181C]">Tier Subscriptions &amp; Billing Matrix</h2>
                <p className="text-xs text-[#687182]">Live Razorpay recurring subscriptions breakdown</p>
              </div>
              <span className="text-xs font-bold text-[#35AB4E] bg-emerald-50 px-3 py-1 rounded-full">
                Auto-Renew Enabled
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-5 rounded-2xl bg-white border border-[#E3E8EF] shadow-sm">
                <TierBadge tier="basic" size="md" />
                <div className="text-2xl font-black text-[#17181C] mt-2">₹999 <span className="text-xs font-normal text-[#687182]">/mo</span></div>
                <p className="text-xs text-[#687182] mt-1">Visiting card + festival auto-banners</p>
                <div className="mt-4 pt-3 border-t border-[#E3E8EF] text-xs font-bold text-[#17181C]">
                  42 Active Merchants (₹41,958/mo)
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-[#35AB4E] shadow-sm relative">
                <div className="absolute top-3 right-3 text-[10px] font-extrabold bg-[#EBF9EE] text-[#1B6A2D] px-2 py-0.5 rounded-full">
                  Most Popular
                </div>
                <TierBadge tier="premium" size="md" />
                <div className="text-2xl font-black text-[#17181C] mt-2">₹2,499 <span className="text-xs font-normal text-[#687182]">/mo</span></div>
                <p className="text-xs text-[#687182] mt-1">2 weekly banners + Green "Trusted" badge</p>
                <div className="mt-4 pt-3 border-t border-[#E3E8EF] text-xs font-bold text-[#17181C]">
                  86 Active Merchants (₹2,14,914/mo)
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-[#981837] shadow-sm relative">
                <div className="absolute top-3 right-3 text-[10px] font-extrabold bg-red-50 text-[#981837] px-2 py-0.5 rounded-full">
                  Highest ARPU
                </div>
                <TierBadge tier="elite" size="md" />
                <div className="text-2xl font-black text-[#17181C] mt-2">₹4,999 <span className="text-xs font-normal text-[#687182]">/mo</span></div>
                <p className="text-xs text-[#687182] mt-1">Daily banners + microsite + 24h stories</p>
                <div className="mt-4 pt-3 border-t border-[#E3E8EF] text-xs font-bold text-[#17181C]">
                  45 Active Merchants (₹2,24,955/mo)
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* TAB 5: CONTENT MODERATION QUEUE */}
        {activeTab === 'moderation' && (
          <Card padding="lg" className="space-y-4">
            <div className="flex items-center justify-between pb-4 border-b border-[#E3E8EF]">
              <div>
                <h2 className="text-base font-bold text-[#17181C]">Merchant &amp; Customer Media Moderation</h2>
                <p className="text-xs text-[#687182]">Review and approve customer photos and reviews before public feed release</p>
              </div>
              <span className="text-xs font-bold text-[#4787F2] bg-[#EDF4FF] px-3 py-1 rounded-full">
                {moderationQueue.length} Pending
              </span>
            </div>

            {moderationQueue.length === 0 ? (
              <div className="p-8 text-center bg-[#F4F6FB] rounded-2xl space-y-2">
                <CheckCircle className="w-8 h-8 text-[#35AB4E] mx-auto" />
                <p className="text-sm font-bold text-[#17181C]">All Media Approved!</p>
                <p className="text-xs text-[#687182]">No pending customer photos or reviews in queue.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {moderationQueue.map((item) => (
                  <div key={item.id} className="p-4 rounded-2xl border border-[#E3E8EF] flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <img src={item.image} alt={item.title} className="w-16 h-16 rounded-xl object-cover" />
                      <div>
                        <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-[#EDF4FF] text-[#4787F2]">
                          {item.type}
                        </span>
                        <h4 className="text-xs font-bold text-[#17181C] mt-1">{item.title}</h4>
                        <p className="text-[11px] text-[#687182]">
                          By {item.author} for {item.business} • {item.time}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleApprove(item.id)}>
                        Reject
                      </Button>
                      <Button variant="primary" size="sm" onClick={() => handleApprove(item.id)}>
                        Approve &amp; Publish
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        )}

        {/* TAB 6: CMS TEMPLATES */}
        {activeTab === 'cms' && (
          <Card padding="lg" className="space-y-4">
            <div className="flex items-center justify-between pb-4 border-b border-[#E3E8EF]">
              <div>
                <h2 className="text-base font-bold text-[#17181C]">Festival &amp; Weekly Banner Template Catalog</h2>
                <p className="text-xs text-[#687182]">Upload canvas templates dynamically stamped with merchant logo + name</p>
              </div>
              <Button variant="primary" size="sm" leftIcon={<Plus className="w-4 h-4" />}>
                Upload New Template
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl border border-[#E3E8EF] space-y-2">
                <img
                  src="https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600"
                  alt="Festival Template"
                  className="w-full h-36 rounded-xl object-cover"
                />
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#17181C]">Diwali Mega Offer 2026</span>
                  <TierBadge tier="basic" size="sm" />
                </div>
                <p className="text-[10px] text-[#687182]">Category: All • Auto-stamping enabled</p>
              </div>

              <div className="p-4 rounded-2xl border border-[#E3E8EF] space-y-2">
                <img
                  src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=600"
                  alt="Jewellery Template"
                  className="w-full h-36 rounded-xl object-cover"
                />
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#17181C]">Ganesh Chaturthi Special</span>
                  <TierBadge tier="premium" size="sm" />
                </div>
                <p className="text-[10px] text-[#687182]">Category: Jewellery &amp; Sweets</p>
              </div>

              <div className="p-4 rounded-2xl border border-[#E3E8EF] space-y-2">
                <img
                  src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600"
                  alt="Elite Template"
                  className="w-full h-36 rounded-xl object-cover"
                />
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#17181C]">Royal Luxury Showcase</span>
                  <TierBadge tier="elite" size="sm" />
                </div>
                <p className="text-[10px] text-[#687182]">Category: Gold &amp; Solitaires</p>
              </div>
            </div>
          </Card>
        )}

        {/* TAB 7: PERMISSIONS MATRIX */}
        {activeTab === 'permissions' && (
          <Card padding="lg" className="space-y-4">
            <div className="flex items-center justify-between pb-4 border-b border-[#E3E8EF]">
              <div>
                <h2 className="text-base font-bold text-[#17181C]">Role-Based Access Control (RBAC) Matrix</h2>
                <p className="text-xs text-[#687182]">Enforced strictly at Supabase PostgreSQL Row Level Security layer</p>
              </div>
              <span className="text-xs font-bold text-[#35AB4E] bg-emerald-50 px-3 py-1 rounded-full">
                RLS Enforced
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#E3E8EF] text-[#687182] font-bold">
                    <th className="pb-3">Resource / Table</th>
                    <th className="pb-3">Consumer</th>
                    <th className="pb-3">Merchant</th>
                    <th className="pb-3">SM (Sales)</th>
                    <th className="pb-3">RO (Regional)</th>
                    <th className="pb-3">ZO (Zone)</th>
                    <th className="pb-3">Super Admin</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E3E8EF] text-[11px]">
                  <tr>
                    <td className="py-2.5 font-mono font-bold text-[#17181C]">businesses</td>
                    <td className="py-2.5 text-[#35AB4E]">Read-Only</td>
                    <td className="py-2.5 text-[#4787F2]">Own Shop</td>
                    <td className="py-2.5 text-[#4787F2]">Assigned Pincodes</td>
                    <td className="py-2.5 text-[#4787F2]">Region Shops</td>
                    <td className="py-2.5 text-[#4787F2]">City Shops</td>
                    <td className="py-2.5 text-[#981837] font-bold">Full CRUD</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 font-mono font-bold text-[#17181C]">stories</td>
                    <td className="py-2.5 text-[#35AB4E]">Read-Only</td>
                    <td className="py-2.5 text-[#981837] font-bold">Elite Only (1/day)</td>
                    <td className="py-2.5 text-neutral-400">None</td>
                    <td className="py-2.5 text-neutral-400">None</td>
                    <td className="py-2.5 text-neutral-400">None</td>
                    <td className="py-2.5 text-[#981837] font-bold">Full CRUD</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 font-mono font-bold text-[#17181C]">staff_profiles</td>
                    <td className="py-2.5 text-neutral-400">None</td>
                    <td className="py-2.5 text-neutral-400">None</td>
                    <td className="py-2.5 text-[#4787F2]">Own Profile</td>
                    <td className="py-2.5 text-[#4787F2]">Assigned SMs</td>
                    <td className="py-2.5 text-[#4787F2]">City ROs &amp; SMs</td>
                    <td className="py-2.5 text-[#981837] font-bold">Full CRUD</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 font-mono font-bold text-[#17181C]">audit_logs</td>
                    <td className="py-2.5 text-neutral-400">None</td>
                    <td className="py-2.5 text-neutral-400">None</td>
                    <td className="py-2.5 text-neutral-400">None</td>
                    <td className="py-2.5 text-[#4787F2]">Region Logs</td>
                    <td className="py-2.5 text-[#4787F2]">City Logs</td>
                    <td className="py-2.5 text-[#981837] font-bold">Read-Only Global</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </main>
    </div>
  );
}
