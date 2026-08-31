'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useAuth, SEED_AUDIT_LOGS, SEED_CATEGORIES } from '@adsspot/api';
import { Role, Permission, DashboardType } from '@adsspot/types';

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
  Edit3,
  Trash2,
  Key,
  Lock,
} from 'lucide-react';

export default function AdminDashboardPage() {
  const { user, isLoading, staffList, merchantList, addEmployee, addMerchant, refreshAuth } = useAuth();
  const [activeTab, setActiveTab] = useState<
    'overview' | 'tree' | 'merchants' | 'revenue' | 'moderation' | 'cms' | 'permissions'
  >('overview');

  const [merchantTierFilter, setMerchantTierFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Dynamic Roles & Permissions State
  const [dbRoles, setDbRoles] = useState<Role[]>([]);
  const [allPermissions, setAllPermissions] = useState<Permission[]>([]);
  const [permissionModules, setPermissionModules] = useState<Record<string, Permission[]>>({});
  const [showCreateRoleModal, setShowCreateRoleModal] = useState(false);
  const [showEditRoleModal, setShowEditRoleModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [roleSearchFilter, setRoleSearchFilter] = useState('');
  const [roleForm, setRoleForm] = useState({
    name: '',
    slug: '',
    description: '',
    dashboard_type: 'employee' as DashboardType,
    permissions: [] as string[],
  });

  // Modals
  const [showAddStaffModal, setShowAddStaffModal] = useState(false);
  const [showAddMerchantModal, setShowAddMerchantModal] = useState(false);

  // Add Staff Form State with comprehensive role-specific fields
  const [staffForm, setStaffForm] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    role: 'sm' as 'sm' | 'ro' | 'zo' | 'super_admin',
    employee_code: '',
    joining_date: new Date().toISOString().split('T')[0],
    salary_monthly: 25000,
    target_monthly: 150000,
    // SM Specific:
    pincodes: '390007, 390001, 390020',
    area_name: 'Alkapuri & Sayajigunj',
    city_id: 'Vadodara',
    region_id: 'Central Gujarat Region',
    reports_to: '',
    daily_visit_target: 8,
    commission_rate: 15,
    gps_tracking_enabled: true,
    // RO Specific:
    cluster_name: 'Vadodara & Anand Regional Cluster',
    ro_city: 'Vadodara',
    ro_zo_id: '',
    override_incentive: 3.0,
    travel_allowance: 10000,
    // ZO Specific:
    zone_state: 'Gujarat State Zone',
    metro_hq: 'Vadodara / Ahmedabad HQ',
    zone_target: 5000000,
    zone_budget: 500000,
    // Banking & KYC:
    emergency_name: '',
    emergency_phone: '',
    bank_account: '',
    ifsc: '',
    upi_id: '',
    pan_aadhaar: '',
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

  const [liveMerchants, setLiveMerchants] = useState<any[]>(merchantList);

  const refreshMerchants = () => {
    fetch('/api/merchants')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.merchants && Array.isArray(data.merchants)) {
          setLiveMerchants(data.merchants);
        }
      })
      .catch(() => { });
  };

  React.useEffect(() => {
    refreshMerchants();
  }, [merchantList]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleCreateEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!staffForm.name || !staffForm.email) {
      alert('Please provide staff full name and official email address.');
      return;
    }
    const created = await addEmployee(staffForm);
    setShowAddStaffModal(false);
    setStaffForm({
      name: '',
      email: '',
      password: '',
      phone: '',
      role: 'sm',
      employee_code: '',
      joining_date: new Date().toISOString().split('T')[0],
      salary_monthly: 25000,
      target_monthly: 150000,
      pincodes: '390007, 390001, 390020',
      area_name: 'Alkapuri & Sayajigunj',
      city_id: 'Vadodara',
      region_id: 'Central Gujarat Region',
      reports_to: '',
      daily_visit_target: 8,
      commission_rate: 15,
      gps_tracking_enabled: true,
      cluster_name: 'Vadodara & Anand Regional Cluster',
      ro_city: 'Vadodara',
      ro_zo_id: '',
      override_incentive: 3.0,
      travel_allowance: 10000,
      zone_state: 'Gujarat State Zone',
      metro_hq: 'Vadodara / Ahmedabad HQ',
      zone_target: 5000000,
      zone_budget: 500000,
      emergency_name: '',
      emergency_phone: '',
      bank_account: '',
      ifsc: '',
      upi_id: '',
      pan_aadhaar: '',
    });
    showToast(`Staff member ${created.full_name} (${created.role.toUpperCase()}) onboarded! Login credentials active.`);
  };

  const handleCreateMerchant = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!merchantForm.business_name || !merchantForm.owner_name || !merchantForm.phone) {
      alert('Please fill out all merchant details.');
      return;
    }
    try {
      const { business } = await addMerchant(merchantForm);
      refreshMerchants();
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
    } catch (e: any) {
      alert('Error creating merchant: ' + (e?.message || 'Failed'));
    }
  };

  const filteredMerchants = liveMerchants.filter((b) => {
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

  const loadRolesAndPermissions = useCallback(async () => {
    try {
      const [rRes, pRes] = await Promise.all([
        fetch('/api/roles'),
        fetch('/api/permissions'),
      ]);
      if (rRes.ok) {
        const rData = await rRes.json();
        if (rData.success && Array.isArray(rData.roles)) {
          setDbRoles(rData.roles);
        }
      }
      if (pRes.ok) {
        const pData = await pRes.json();
        if (pData.success) {
          setAllPermissions(pData.permissions || []);
          setPermissionModules(pData.grouped || {});
        }
      }
    } catch (e) {
      console.warn('Failed to load roles and permissions:', e);
    }
  }, []);

  useEffect(() => {
    loadRolesAndPermissions();
  }, [loadRolesAndPermissions]);

  const handleOpenCreateRole = () => {
    setRoleForm({
      name: '',
      slug: '',
      description: '',
      dashboard_type: 'employee',
      permissions: ['merchants.view', 'posts.view', 'media.view'],
    });
    setShowCreateRoleModal(true);
  };

  const handleCreateRole = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!roleForm.name.trim()) {
      alert('Please provide a role name');
      return;
    }
    try {
      const res = await fetch('/api/roles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(roleForm),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        alert(data.error || 'Failed to create role');
        return;
      }
      showToast(`✓ Role "${data.role.name}" created and saved to database!`);
      setShowCreateRoleModal(false);
      loadRolesAndPermissions();
      refreshAuth();
    } catch (err: any) {
      alert('Error creating role: ' + err.message);
    }
  };

  const handleOpenEditRole = (role: Role) => {
    setSelectedRole(role);
    setRoleForm({
      name: role.name,
      slug: role.slug,
      description: role.description || '',
      dashboard_type: role.dashboard_type || 'employee',
      permissions: role.permissions || [],
    });
    setShowEditRoleModal(true);
  };

  const handleUpdateRole = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRole) return;
    try {
      const res = await fetch(`/api/roles/${selectedRole.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(roleForm),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        alert(data.error || 'Failed to update role');
        return;
      }
      showToast(`✓ Role "${selectedRole.name}" updated successfully!`);
      setShowEditRoleModal(false);
      loadRolesAndPermissions();
      refreshAuth();
    } catch (err: any) {
      alert('Error updating role: ' + err.message);
    }
  };

  const handleDeleteRole = async (role: Role) => {
    if (role.is_system_role) {
      alert('System roles are permanent and cannot be deleted.');
      return;
    }
    if (!confirm(`Are you sure you want to delete role "${role.name}"? Users assigned to this role will be reverted to Consumer.`)) {
      return;
    }
    try {
      const res = await fetch(`/api/roles/${role.id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok || !data.success) {
        alert(data.error || 'Failed to delete role');
        return;
      }
      showToast(`✓ Role "${role.name}" deleted from database.`);
      loadRolesAndPermissions();
      refreshAuth();
    } catch (err: any) {
      alert('Error deleting role: ' + err.message);
    }
  };

  const handleToggleRoleActive = async (role: Role) => {
    if (role.is_system_role) return;
    try {
      const res = await fetch(`/api/roles/${role.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_active: !role.is_active }),
      });
      if (res.ok) {
        showToast(`Role ${role.name} status updated.`);
        loadRolesAndPermissions();
      }
    } catch { }
  };

  // Route Guard: Ensure user is Super Admin
  if (!isLoading && (!user || (user.role !== 'super_admin' && user.dashboard_type !== 'admin'))) {
    return (
      <div className="flex-1 bg-[#F4F6FB] min-h-[calc(100vh-100px)] flex items-center justify-center p-6">
        <Card padding="lg" className="max-w-md w-full text-center space-y-4 shadow-xl border border-red-200">
          <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto text-2xl font-black">
            <Lock className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-black text-[#17181C]">Access Denied</h2>
          <p className="text-xs text-[#687182]">
            You do not have Super Admin permissions to access the Administration Control Center.
          </p>
          <div className="pt-2">
            <Link href={user ? (user.dashboard_type === 'merchant' ? '/merchant' : user.dashboard_type === 'sm' ? '/sm' : user.dashboard_type === 'ro' ? '/ro' : user.dashboard_type === 'zo' ? '/zo' : '/feed') : '/login'}>
              <Button variant="primary" size="md" className="w-full">
                {user ? 'Return to Your Dashboard' : 'Sign In as Administrator'}
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

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
          <div className="bg-white dark:bg-[#141824] rounded-3xl p-6 max-w-2xl w-full shadow-2xl border border-[#E3E8EF] dark:border-white/15 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-[#E3E8EF] dark:border-white/10 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-[#4787F2] text-white flex items-center justify-center font-bold shadow-md">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-[#17181C] dark:text-white">Onboard New Employee</h3>
                  <p className="text-xs text-[#687182] dark:text-neutral-400">Configure credentials, role-specific territory, targets &amp; compensation</p>
                </div>
              </div>
              <button onClick={() => setShowAddStaffModal(false)} className="text-neutral-400 hover:text-neutral-700 dark:hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateEmployee} className="space-y-5">
              {/* Role Selection Segmented Bar */}
              <div>
                <label className="block text-[11px] font-black text-[#17181C] dark:text-neutral-200 uppercase tracking-wider mb-2">
                  Select Employee Designation &amp; Tier
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(dbRoles.length > 0
                    ? dbRoles.filter((r) => r.slug !== 'consumer')
                    : [
                      { id: 'role-sm', slug: 'sm', name: 'SM (Sales Manager)', description: 'Field merchant visits & pincode leads', dashboard_type: 'sm' },
                      { id: 'role-ro', slug: 'ro', name: 'RO (Regional Officer)', description: 'Cluster oversight & SM team manager', dashboard_type: 'ro' },
                      { id: 'role-zo', slug: 'zo', name: 'ZO (Zone Officer)', description: 'City/State zone & metro target head', dashboard_type: 'zo' },
                      { id: 'role-super-admin', slug: 'super_admin', name: 'Super Admin', description: 'Global platform operations & finance', dashboard_type: 'admin' },
                    ]
                  ).map((r) => {
                    const isSelected = staffForm.role === r.slug || (staffForm as any).role_id === r.id;
                    const color =
                      r.dashboard_type === 'admin'
                        ? 'border-[#981837] bg-[#FDF0F3] text-[#981837]'
                        : r.dashboard_type === 'zo'
                          ? 'border-[#F2B604] bg-[#FEF9E6] text-[#B45309]'
                          : r.dashboard_type === 'ro'
                            ? 'border-[#35AB4E] bg-[#EBF9EE] text-[#35AB4E]'
                            : 'border-[#4787F2] bg-[#EDF4FF] text-[#4787F2]';

                    return (
                      <button
                        type="button"
                        key={r.id}
                        onClick={() =>
                          setStaffForm({
                            ...staffForm,
                            role: r.slug as any,
                            ...((r.id ? { role_id: r.id } : {}) as any),
                          })
                        }
                        className={`p-2.5 rounded-2xl border text-left transition-all flex flex-col justify-between ${isSelected
                            ? `${color} font-bold shadow-xs ring-2 ring-offset-1 ring-[#4787F2]`
                            : 'border-[#E3E8EF] dark:border-white/10 hover:bg-neutral-50 dark:hover:bg-white/5 text-neutral-600 dark:text-neutral-300'
                          }`}
                      >
                        <span className="text-xs font-black block leading-tight">{r.name}</span>
                        <span className="text-[9px] opacity-80 mt-1 block leading-tight truncate">
                          {r.description || `${r.dashboard_type.toUpperCase()} Dashboard`}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 1. Account Credentials & Login Details */}
              <div className="p-4 rounded-2xl bg-[#F4F6FB] dark:bg-white/5 border border-[#E3E8EF] dark:border-white/10 space-y-3">
                <div className="flex items-center gap-1.5 text-xs font-black text-[#17181C] dark:text-white">
                  <span>🔑</span>
                  <span>1. Account Credentials &amp; Identity</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-[#17181C] dark:text-neutral-300 uppercase tracking-wider mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Nikunj Patel"
                      value={staffForm.name}
                      onChange={(e) => setStaffForm({ ...staffForm, name: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-white dark:bg-[#1A2130] border border-[#E3E8EF] dark:border-white/15 text-xs font-semibold text-[#17181C] dark:text-white outline-none focus:border-[#4787F2]"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-[#17181C] dark:text-neutral-300 uppercase tracking-wider mb-1">
                      Official Login Email ID *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. nikunj.patel@adsspot.in"
                      value={staffForm.email}
                      onChange={(e) => setStaffForm({ ...staffForm, email: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-white dark:bg-[#1A2130] border border-[#E3E8EF] dark:border-white/15 text-xs font-semibold text-[#17181C] dark:text-white outline-none focus:border-[#4787F2]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-[#17181C] dark:text-neutral-300 uppercase tracking-wider mb-1">
                      Login Password
                    </label>
                    <input
                      type="text"
                      placeholder="Default: adsspot123"
                      value={staffForm.password}
                      onChange={(e) => setStaffForm({ ...staffForm, password: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-white dark:bg-[#1A2130] border border-[#E3E8EF] dark:border-white/15 text-xs font-semibold text-[#17181C] dark:text-white outline-none focus:border-[#4787F2]"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-[#17181C] dark:text-neutral-300 uppercase tracking-wider mb-1">
                      Mobile / WhatsApp Phone *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98201 12345"
                      value={staffForm.phone}
                      onChange={(e) => setStaffForm({ ...staffForm, phone: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-white dark:bg-[#1A2130] border border-[#E3E8EF] dark:border-white/15 text-xs font-semibold text-[#17181C] dark:text-white outline-none focus:border-[#4787F2]"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-[#17181C] dark:text-neutral-300 uppercase tracking-wider mb-1">
                      Employee Code / Staff ID
                    </label>
                    <input
                      type="text"
                      placeholder={`ADS-${staffForm.role.toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`}
                      value={staffForm.employee_code}
                      onChange={(e) => setStaffForm({ ...staffForm, employee_code: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-white dark:bg-[#1A2130] border border-[#E3E8EF] dark:border-white/15 text-xs font-semibold text-[#17181C] dark:text-white outline-none focus:border-[#4787F2]"
                    />
                  </div>
                </div>
              </div>

              {/* 2. ROLE-SPECIFIC DYNAMIC PARAMETERS */}
              <div className="p-4 rounded-2xl bg-[#FFFBF0] dark:bg-[#2A1E10] border border-[#FDE68A] dark:border-amber-900/50 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-black text-[#B45309] dark:text-amber-300">
                    <span>📍</span>
                    <span>2. Role Territory &amp; Quota Configuration ({staffForm.role.toUpperCase()})</span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900 text-[#B45309] dark:text-amber-200">
                    Customized for {staffForm.role.toUpperCase()}
                  </span>
                </div>

                {/* IF SM (Sales Manager - Field Executive) */}
                {staffForm.role === 'sm' && (
                  <div className="space-y-3 animate-fade-in">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold text-[#17181C] dark:text-neutral-300 uppercase tracking-wider mb-1">
                          Assigned Territory Pincodes (Comma-separated)
                        </label>
                        <input
                          type="text"
                          placeholder="390007, 390001, 390020"
                          value={staffForm.pincodes}
                          onChange={(e) => setStaffForm({ ...staffForm, pincodes: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-white dark:bg-[#1A2130] border border-[#E3E8EF] dark:border-white/15 text-xs font-semibold outline-none focus:border-[#4787F2]"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-[#17181C] dark:text-neutral-300 uppercase tracking-wider mb-1">
                          Market / Neighborhood Ward Name
                        </label>
                        <input
                          type="text"
                          placeholder="Alkapuri, Sayajigunj & Akota"
                          value={staffForm.area_name}
                          onChange={(e) => setStaffForm({ ...staffForm, area_name: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-white dark:bg-[#1A2130] border border-[#E3E8EF] dark:border-white/15 text-xs font-semibold outline-none focus:border-[#4787F2]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold text-[#17181C] dark:text-neutral-300 uppercase tracking-wider mb-1">
                          Monthly Revenue Target (₹)
                        </label>
                        <input
                          type="number"
                          value={staffForm.target_monthly}
                          onChange={(e) => setStaffForm({ ...staffForm, target_monthly: Number(e.target.value) })}
                          className="w-full px-3 py-2 rounded-xl bg-white dark:bg-[#1A2130] border border-[#E3E8EF] dark:border-white/15 text-xs font-semibold outline-none focus:border-[#4787F2]"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-[#17181C] dark:text-neutral-300 uppercase tracking-wider mb-1">
                          Daily Merchant Visit Target
                        </label>
                        <input
                          type="number"
                          value={staffForm.daily_visit_target}
                          onChange={(e) => setStaffForm({ ...staffForm, daily_visit_target: Number(e.target.value) })}
                          className="w-full px-3 py-2 rounded-xl bg-white dark:bg-[#1A2130] border border-[#E3E8EF] dark:border-white/15 text-xs font-semibold outline-none focus:border-[#4787F2]"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-[#17181C] dark:text-neutral-300 uppercase tracking-wider mb-1">
                          Onboarding Commission (%)
                        </label>
                        <input
                          type="number"
                          value={staffForm.commission_rate}
                          onChange={(e) => setStaffForm({ ...staffForm, commission_rate: Number(e.target.value) })}
                          className="w-full px-3 py-2 rounded-xl bg-white dark:bg-[#1A2130] border border-[#E3E8EF] dark:border-white/15 text-xs font-semibold outline-none focus:border-[#4787F2]"
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <input
                        type="checkbox"
                        id="gps_req"
                        checked={staffForm.gps_tracking_enabled}
                        onChange={(e) => setStaffForm({ ...staffForm, gps_tracking_enabled: e.target.checked })}
                        className="rounded border-neutral-300 text-[#4787F2] focus:ring-[#4787F2]"
                      />
                      <label htmlFor="gps_req" className="text-xs font-bold text-neutral-700 dark:text-neutral-300 cursor-pointer">
                        Mandatory Daily GPS Check-in &amp; Selfie Attendance for Sales Manager
                      </label>
                    </div>
                  </div>
                )}

                {/* IF RO (Regional Officer - Cluster Head) */}
                {staffForm.role === 'ro' && (
                  <div className="space-y-3 animate-fade-in">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold text-[#17181C] dark:text-neutral-300 uppercase tracking-wider mb-1">
                          Regional Cluster / Zone Name
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Vadodara & Central Gujarat Cluster"
                          value={staffForm.cluster_name}
                          onChange={(e) => setStaffForm({ ...staffForm, cluster_name: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-white dark:bg-[#1A2130] border border-[#E3E8EF] dark:border-white/15 text-xs font-semibold outline-none focus:border-[#4787F2]"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-[#17181C] dark:text-neutral-300 uppercase tracking-wider mb-1">
                          Headquarters City
                        </label>
                        <input
                          type="text"
                          placeholder="Vadodara"
                          value={staffForm.ro_city}
                          onChange={(e) => setStaffForm({ ...staffForm, ro_city: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-white dark:bg-[#1A2130] border border-[#E3E8EF] dark:border-white/15 text-xs font-semibold outline-none focus:border-[#4787F2]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold text-[#17181C] dark:text-neutral-300 uppercase tracking-wider mb-1">
                          Monthly Regional Target (₹)
                        </label>
                        <input
                          type="number"
                          value={staffForm.target_monthly}
                          onChange={(e) => setStaffForm({ ...staffForm, target_monthly: Number(e.target.value) })}
                          className="w-full px-3 py-2 rounded-xl bg-white dark:bg-[#1A2130] border border-[#E3E8EF] dark:border-white/15 text-xs font-semibold outline-none focus:border-[#4787F2]"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-[#17181C] dark:text-neutral-300 uppercase tracking-wider mb-1">
                          Team Override Commission (%)
                        </label>
                        <input
                          type="number"
                          step="0.1"
                          value={staffForm.override_incentive}
                          onChange={(e) => setStaffForm({ ...staffForm, override_incentive: Number(e.target.value) })}
                          className="w-full px-3 py-2 rounded-xl bg-white dark:bg-[#1A2130] border border-[#E3E8EF] dark:border-white/15 text-xs font-semibold outline-none focus:border-[#4787F2]"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-[#17181C] dark:text-neutral-300 uppercase tracking-wider mb-1">
                          Monthly Travel Allowance (₹)
                        </label>
                        <input
                          type="number"
                          value={staffForm.travel_allowance}
                          onChange={(e) => setStaffForm({ ...staffForm, travel_allowance: Number(e.target.value) })}
                          className="w-full px-3 py-2 rounded-xl bg-white dark:bg-[#1A2130] border border-[#E3E8EF] dark:border-white/15 text-xs font-semibold outline-none focus:border-[#4787F2]"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* IF ZO (Zone Officer - State / Metro Hub) */}
                {staffForm.role === 'zo' && (
                  <div className="space-y-3 animate-fade-in">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold text-[#17181C] dark:text-neutral-300 uppercase tracking-wider mb-1">
                          Assigned Zone / State Jurisdiction
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Gujarat State Zone"
                          value={staffForm.zone_state}
                          onChange={(e) => setStaffForm({ ...staffForm, zone_state: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-white dark:bg-[#1A2130] border border-[#E3E8EF] dark:border-white/15 text-xs font-semibold outline-none focus:border-[#4787F2]"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-[#17181C] dark:text-neutral-300 uppercase tracking-wider mb-1">
                          Metro Headquarters Hub
                        </label>
                        <input
                          type="text"
                          placeholder="Vadodara / Ahmedabad HQ"
                          value={staffForm.metro_hq}
                          onChange={(e) => setStaffForm({ ...staffForm, metro_hq: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-white dark:bg-[#1A2130] border border-[#E3E8EF] dark:border-white/15 text-xs font-semibold outline-none focus:border-[#4787F2]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold text-[#17181C] dark:text-neutral-300 uppercase tracking-wider mb-1">
                          Zone Monthly Revenue Target (₹)
                        </label>
                        <input
                          type="number"
                          value={staffForm.zone_target}
                          onChange={(e) => setStaffForm({ ...staffForm, zone_target: Number(e.target.value) })}
                          className="w-full px-3 py-2 rounded-xl bg-white dark:bg-[#1A2130] border border-[#E3E8EF] dark:border-white/15 text-xs font-semibold outline-none focus:border-[#4787F2]"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-[#17181C] dark:text-neutral-300 uppercase tracking-wider mb-1">
                          Zone Discretionary Marketing Budget (₹)
                        </label>
                        <input
                          type="number"
                          value={staffForm.zone_budget}
                          onChange={(e) => setStaffForm({ ...staffForm, zone_budget: Number(e.target.value) })}
                          className="w-full px-3 py-2 rounded-xl bg-white dark:bg-[#1A2130] border border-[#E3E8EF] dark:border-white/15 text-xs font-semibold outline-none focus:border-[#4787F2]"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* IF Super Admin */}
                {staffForm.role === 'super_admin' && (
                  <div className="p-3 bg-white dark:bg-[#1A2130] rounded-xl text-xs text-[#981837] dark:text-rose-400 font-semibold space-y-1">
                    <p>👑 Super Admin profile has unrestricted pan-India administrative access over all Staff, Billing, Moderation, and CMS subsystems.</p>
                  </div>
                )}
              </div>

              {/* 3. Compensation, Banking & Emergency Contact */}
              <div className="p-4 rounded-2xl bg-[#F4F6FB] dark:bg-white/5 border border-[#E3E8EF] dark:border-white/10 space-y-3">
                <div className="flex items-center gap-1.5 text-xs font-black text-[#17181C] dark:text-white">
                  <span>💳</span>
                  <span>3. Compensation, Banking &amp; Emergency</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-[#17181C] dark:text-neutral-300 uppercase tracking-wider mb-1">
                      Monthly Base Salary (₹)
                    </label>
                    <input
                      type="number"
                      value={staffForm.salary_monthly}
                      onChange={(e) => setStaffForm({ ...staffForm, salary_monthly: Number(e.target.value) })}
                      className="w-full px-3 py-2 rounded-xl bg-white dark:bg-[#1A2130] border border-[#E3E8EF] dark:border-white/15 text-xs font-semibold outline-none focus:border-[#4787F2]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-[#17181C] dark:text-neutral-300 uppercase tracking-wider mb-1">
                      Bank Account Number
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 5010049281928"
                      value={staffForm.bank_account}
                      onChange={(e) => setStaffForm({ ...staffForm, bank_account: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-white dark:bg-[#1A2130] border border-[#E3E8EF] dark:border-white/15 text-xs font-semibold outline-none focus:border-[#4787F2]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-[#17181C] dark:text-neutral-300 uppercase tracking-wider mb-1">
                      Bank IFSC Code
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. HDFC0001234"
                      value={staffForm.ifsc}
                      onChange={(e) => setStaffForm({ ...staffForm, ifsc: e.target.value.toUpperCase() })}
                      className="w-full px-3 py-2 rounded-xl bg-white dark:bg-[#1A2130] border border-[#E3E8EF] dark:border-white/15 text-xs font-semibold outline-none focus:border-[#4787F2]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-[#17181C] dark:text-neutral-300 uppercase tracking-wider mb-1">
                      Payout UPI ID
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. name@okhdfcbank"
                      value={staffForm.upi_id}
                      onChange={(e) => setStaffForm({ ...staffForm, upi_id: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-white dark:bg-[#1A2130] border border-[#E3E8EF] dark:border-white/15 text-xs font-semibold outline-none focus:border-[#4787F2]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-[#17181C] dark:text-neutral-300 uppercase tracking-wider mb-1">
                      Emergency Contact Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Ramesh Patel (Father)"
                      value={staffForm.emergency_name}
                      onChange={(e) => setStaffForm({ ...staffForm, emergency_name: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-white dark:bg-[#1A2130] border border-[#E3E8EF] dark:border-white/15 text-xs font-semibold outline-none focus:border-[#4787F2]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-[#17181C] dark:text-neutral-300 uppercase tracking-wider mb-1">
                      Emergency Phone
                    </label>
                    <input
                      type="tel"
                      placeholder="+91 98980 98980"
                      value={staffForm.emergency_phone}
                      onChange={(e) => setStaffForm({ ...staffForm, emergency_phone: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-white dark:bg-[#1A2130] border border-[#E3E8EF] dark:border-white/15 text-xs font-semibold outline-none focus:border-[#4787F2]"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-[#E3E8EF] dark:border-white/10 flex items-center justify-end gap-2">
                <Button type="button" variant="outline" size="sm" onClick={() => setShowAddStaffModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm">
                  Register &amp; Activate Employee
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
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-colors ${activeTab === 'overview' ? 'bg-[#EDF4FF] text-[#4787F2] font-bold' : 'hover:bg-[#F4F6FB]'
                }`}
            >
              <Activity className="w-4 h-4" /> Global Overview
            </button>
            <button
              onClick={() => setActiveTab('tree')}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-colors ${activeTab === 'tree' ? 'bg-[#EDF4FF] text-[#4787F2] font-bold' : 'hover:bg-[#F4F6FB]'
                }`}
            >
              <Users className="w-4 h-4" /> Staff Hierarchy ({staffList.length})
            </button>
            <button
              onClick={() => setActiveTab('merchants')}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-colors ${activeTab === 'merchants' ? 'bg-[#EDF4FF] text-[#4787F2] font-bold' : 'hover:bg-[#F4F6FB]'
                }`}
            >
              <Store className="w-4 h-4" /> All Merchants ({liveMerchants.length})
            </button>
            <button
              onClick={() => setActiveTab('revenue')}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-colors ${activeTab === 'revenue' ? 'bg-[#EDF4FF] text-[#4787F2] font-bold' : 'hover:bg-[#F4F6FB]'
                }`}
            >
              <DollarSign className="w-4 h-4" /> Memberships &amp; Revenue
            </button>
            <button
              onClick={() => setActiveTab('moderation')}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-colors ${activeTab === 'moderation' ? 'bg-[#EDF4FF] text-[#4787F2] font-bold' : 'hover:bg-[#F4F6FB]'
                }`}
            >
              <FileCheck className="w-4 h-4" /> Content Moderation ({moderationQueue.length})
            </button>
            <button
              onClick={() => setActiveTab('cms')}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-colors ${activeTab === 'cms' ? 'bg-[#EDF4FF] text-[#4787F2] font-bold' : 'hover:bg-[#F4F6FB]'
                }`}
            >
              <Layers className="w-4 h-4" /> Banner Template CMS
            </button>
            <button
              onClick={() => setActiveTab('permissions')}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-colors ${activeTab === 'permissions' ? 'bg-[#EDF4FF] text-[#4787F2] font-bold' : 'hover:bg-[#F4F6FB]'
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
                <div className="text-2xl font-black text-[#17181C] mt-1">{liveMerchants.length}</div>
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
                const name = (st as any).user?.full_name || (st as any).name || `Staff ${st.id.slice(-4)}`;
                const phone = (st as any).user?.phone || (st as any).phone || '+91 98765 43210';
                const avatar = (st as any).user?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(st.user_id)}`;
                const email = (st as any).user?.email || (st as any).email || '';
                return (
                  <div key={st.id} className="p-4 rounded-2xl bg-white border border-[#E3E8EF] shadow-sm space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <Avatar src={avatar} name={name} size="sm" />
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

                    <div className="text-[10px] font-mono text-[#687182] truncate">
                      {email || `User ID: ${st.user_id}`}
                    </div>
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
                <h2 className="text-base font-bold text-[#17181C]">Registered Hyperlocal Merchants ({liveMerchants.length})</h2>
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
                    className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase transition-colors ${merchantTierFilter === tier
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

        {/* TAB 7: DYNAMIC ROLES & PERMISSION MANAGEMENT (RBAC) */}
        {activeTab === 'permissions' && (
          <div className="space-y-6">
            {/* Header with Actions */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-[#E3E8EF] shadow-xs">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-black text-[#17181C]">Dynamic Roles &amp; Permissions (RBAC)</h2>
                  <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-[#EBF9EE] text-[#35AB4E]">
                    PostgreSQL Enforced
                  </span>
                </div>
                <p className="text-xs text-[#687182] mt-0.5">
                  Create custom designations (e.g. Sales Executive, Support Lead, Accountant), assign module permissions, and choose target dashboards.
                </p>
              </div>

              <Button
                variant="primary"
                size="md"
                className="bg-[#4787F2] hover:bg-[#3972D4] text-xs font-bold shrink-0"
                onClick={handleOpenCreateRole}
                leftIcon={<Plus className="w-4 h-4" />}
              >
                + Create Dynamic Role
              </Button>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <Card padding="md" className="space-y-1">
                <span className="text-[10px] font-black uppercase tracking-wider text-[#687182]">Total Roles</span>
                <p className="text-2xl font-black text-[#17181C]">{dbRoles.length || 7}</p>
                <span className="text-[10px] text-[#35AB4E] font-semibold">● Database Synced</span>
              </Card>
              <Card padding="md" className="space-y-1">
                <span className="text-[10px] font-black uppercase tracking-wider text-[#687182]">System Roles</span>
                <p className="text-2xl font-black text-[#4787F2]">
                  {dbRoles.filter((r) => r.is_system_role).length || 6}
                </p>
                <span className="text-[10px] text-[#687182]">Permanent platform roles</span>
              </Card>
              <Card padding="md" className="space-y-1">
                <span className="text-[10px] font-black uppercase tracking-wider text-[#687182]">Custom Roles</span>
                <p className="text-2xl font-black text-[#A06E00]">
                  {dbRoles.filter((r) => !r.is_system_role).length}
                </p>
                <span className="text-[10px] text-[#A06E00] font-semibold">User-defined</span>
              </Card>
              <Card padding="md" className="space-y-1">
                <span className="text-[10px] font-black uppercase tracking-wider text-[#687182]">Available Permissions</span>
                <p className="text-2xl font-black text-[#981837]">{allPermissions.length || 31}</p>
                <span className="text-[10px] text-[#687182]">Across 9 functional modules</span>
              </Card>
            </div>

            {/* Role Cards List */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-black text-[#17181C] uppercase tracking-wider">
                  Configured Roles ({dbRoles.length})
                </h3>
                <div className="relative w-64">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                  <input
                    type="text"
                    value={roleSearchFilter}
                    onChange={(e) => setRoleSearchFilter(e.target.value)}
                    placeholder="Search roles or slugs..."
                    className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-[#E3E8EF] text-xs outline-none focus:border-[#4787F2]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {dbRoles
                  .filter(
                    (r) =>
                      !roleSearchFilter ||
                      r.name.toLowerCase().includes(roleSearchFilter.toLowerCase()) ||
                      r.slug.toLowerCase().includes(roleSearchFilter.toLowerCase())
                  )
                  .map((role) => {
                    const dashboardBadgeColor =
                      role.dashboard_type === 'admin'
                        ? 'bg-purple-100 text-purple-800'
                        : role.dashboard_type === 'merchant'
                          ? 'bg-amber-100 text-amber-800'
                          : role.dashboard_type === 'sm'
                            ? 'bg-blue-100 text-blue-800'
                            : role.dashboard_type === 'ro'
                              ? 'bg-emerald-100 text-emerald-800'
                              : role.dashboard_type === 'zo'
                                ? 'bg-rose-100 text-rose-800'
                                : 'bg-slate-100 text-slate-800';

                    return (
                      <Card
                        key={role.id}
                        padding="lg"
                        className="space-y-4 border border-[#E3E8EF] hover:shadow-md transition-all flex flex-col justify-between"
                      >
                        <div className="space-y-3">
                          {/* Role Header */}
                          <div className="flex items-start justify-between gap-2">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <h4 className="text-sm font-black text-[#17181C]">{role.name}</h4>
                                <span
                                  className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full ${role.is_system_role
                                      ? 'bg-neutral-100 text-neutral-600'
                                      : 'bg-indigo-100 text-indigo-700'
                                    }`}
                                >
                                  {role.is_system_role ? 'System Role' : 'Custom Role'}
                                </span>
                              </div>
                              <p className="text-[11px] font-mono text-[#687182]">slug: {role.slug}</p>
                            </div>

                            <div className="flex items-center gap-1.5">
                              {!role.is_system_role && (
                                <button
                                  type="button"
                                  onClick={() => handleToggleRoleActive(role)}
                                  className={`text-[9px] font-bold px-2 py-0.5 rounded-full transition-colors ${role.is_active !== false
                                      ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                                      : 'bg-neutral-100 text-neutral-500 hover:bg-neutral-200'
                                    }`}
                                >
                                  {role.is_active !== false ? '● Active' : '○ Inactive'}
                                </button>
                              )}
                              <span
                                className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full ${dashboardBadgeColor}`}
                              >
                                {role.dashboard_type.toUpperCase()} PANEL
                              </span>
                            </div>
                          </div>

                          <p className="text-xs text-[#687182] line-clamp-2">
                            {role.description || 'Custom role configured for Adsspot workspace team members.'}
                          </p>

                          {/* Permissions summary */}
                          <div className="pt-2 border-t border-[#F4F6FB] space-y-1.5">
                            <div className="flex items-center justify-between text-[11px]">
                              <span className="font-bold text-[#17181C] flex items-center gap-1">
                                <Key className="w-3 h-3 text-[#4787F2]" /> Assigned Permissions
                              </span>
                              <span className="text-[#687182] font-semibold">
                                {role.permissions?.length || 0} granted
                              </span>
                            </div>

                            <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto no-scrollbar pt-1">
                              {(role.permissions || []).map((permKey) => (
                                <span
                                  key={permKey}
                                  className="text-[9px] font-mono bg-[#EDF4FF] text-[#4787F2] px-2 py-0.5 rounded-md font-semibold"
                                >
                                  {permKey}
                                </span>
                              ))}
                              {(!role.permissions || role.permissions.length === 0) && (
                                <span className="text-[10px] text-neutral-400 italic">No permissions assigned</span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Actions footer */}
                        <div className="flex items-center justify-between pt-3 border-t border-[#F4F6FB]">
                          <span className="text-[11px] text-[#687182] font-semibold">
                            👥 {role.user_count || 0} active users
                          </span>

                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-xs py-1"
                              onClick={() => handleOpenEditRole(role)}
                              leftIcon={<Edit3 className="w-3.5 h-3.5" />}
                            >
                              Edit Permissions
                            </Button>

                            {!role.is_system_role && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-xs py-1 text-red-600 hover:bg-red-50 border-red-200"
                                onClick={() => handleDeleteRole(role)}
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </Button>
                            )}
                          </div>
                        </div>
                      </Card>
                    );
                  })}
              </div>
            </div>
          </div>
        )}

        {/* MODAL 1: CREATE DYNAMIC ROLE */}
        {showCreateRoleModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 max-w-2xl w-full shadow-2xl border border-[#E3E8EF] max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-4 border-b border-[#E3E8EF] mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-[#4787F2] text-white flex items-center justify-center font-bold shadow-md">
                    <Key className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-[#17181C]">Create New Dynamic Role</h3>
                    <p className="text-xs text-[#687182]">
                      Configure role identity, default dashboard panel, and granular module permissions
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowCreateRoleModal(false)}
                  className="text-neutral-400 hover:text-neutral-700 p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateRole} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-[#17181C] block mb-1">
                      Role Display Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={roleForm.name}
                      onChange={(e) => {
                        const name = e.target.value;
                        const slug = name.toLowerCase().replace(/[^a-z0-9]/g, '_').replace(/_+/g, '_');
                        setRoleForm((prev) => ({ ...prev, name, slug }));
                      }}
                      placeholder="e.g. Sales Executive, Accountant, Content Lead"
                      className="w-full p-2.5 rounded-xl border border-[#E3E8EF] text-xs font-semibold outline-none focus:border-[#4787F2]"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-[#17181C] block mb-1">
                      Unique Role Slug *
                    </label>
                    <input
                      type="text"
                      required
                      value={roleForm.slug}
                      onChange={(e) => setRoleForm({ ...roleForm, slug: e.target.value })}
                      placeholder="e.g. sales_executive"
                      className="w-full p-2.5 rounded-xl border border-[#E3E8EF] text-xs font-mono text-[#4787F2] outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-[#17181C] block mb-1">
                      Dashboard Type (Panel) *
                    </label>
                    <select
                      value={roleForm.dashboard_type}
                      onChange={(e) =>
                        setRoleForm({ ...roleForm, dashboard_type: e.target.value as DashboardType })
                      }
                      className="w-full p-2.5 rounded-xl border border-[#E3E8EF] text-xs font-bold text-[#17181C] bg-white outline-none focus:border-[#4787F2]"
                    >
                      <option value="admin">Admin Control Center (/admin)</option>
                      <option value="merchant">Merchant Studio (/merchant)</option>
                      <option value="sm">Sales Manager Portal (/sm)</option>
                      <option value="ro">Regional Officer Portal (/ro)</option>
                      <option value="zo">Zone Officer Portal (/zo)</option>
                      <option value="employee">General Employee Panel (/sm)</option>
                      <option value="user">Consumer / Customer Feed (/feed)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-[#17181C] block mb-1">Role Description</label>
                    <input
                      type="text"
                      value={roleForm.description}
                      onChange={(e) => setRoleForm({ ...roleForm, description: e.target.value })}
                      placeholder="Brief summary of duties and responsibilities"
                      className="w-full p-2.5 rounded-xl border border-[#E3E8EF] text-xs outline-none focus:border-[#4787F2]"
                    />
                  </div>
                </div>

                {/* Permissions Module Checkboxes */}
                <div className="space-y-3 pt-2 border-t border-[#E3E8EF]">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-black text-[#17181C] uppercase tracking-wider">
                      Module Permissions Checklist ({roleForm.permissions.length} selected)
                    </label>
                    <div className="flex items-center gap-2 text-[10px]">
                      <button
                        type="button"
                        onClick={() =>
                          setRoleForm({
                            ...roleForm,
                            permissions: allPermissions.map((p) => p.key),
                          })
                        }
                        className="text-[#4787F2] font-bold hover:underline"
                      >
                        Select All
                      </button>
                      <span className="text-neutral-300">|</span>
                      <button
                        type="button"
                        onClick={() => setRoleForm({ ...roleForm, permissions: [] })}
                        className="text-neutral-500 font-bold hover:underline"
                      >
                        Clear All
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3 max-h-64 overflow-y-auto p-3 bg-[#F4F6FB] rounded-2xl border border-[#E3E8EF]">
                    {Object.entries(permissionModules).map(([moduleName, perms]) => {
                      const allSelectedInModule = perms.every((p) =>
                        roleForm.permissions.includes(p.key)
                      );

                      return (
                        <div key={moduleName} className="bg-white p-3 rounded-xl border border-[#E3E8EF] space-y-2">
                          <div className="flex items-center justify-between pb-1 border-b border-[#F4F6FB]">
                            <span className="text-[11px] font-black uppercase text-[#17181C]">
                              {moduleName} Module
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                const moduleKeys = perms.map((p) => p.key);
                                if (allSelectedInModule) {
                                  setRoleForm({
                                    ...roleForm,
                                    permissions: roleForm.permissions.filter(
                                      (k) => !moduleKeys.includes(k)
                                    ),
                                  });
                                } else {
                                  const combined = Array.from(
                                    new Set([...roleForm.permissions, ...moduleKeys])
                                  );
                                  setRoleForm({ ...roleForm, permissions: combined });
                                }
                              }}
                              className="text-[10px] font-bold text-[#4787F2]"
                            >
                              {allSelectedInModule ? 'Deselect Module' : 'Select Module'}
                            </button>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {perms.map((perm) => {
                              const isChecked = roleForm.permissions.includes(perm.key);
                              return (
                                <label
                                  key={perm.key}
                                  className={`flex items-start gap-2 p-2 rounded-lg border text-[11px] cursor-pointer transition-all ${isChecked
                                      ? 'bg-[#EDF4FF] border-[#4787F2] text-[#4787F2] font-semibold'
                                      : 'bg-white border-[#E3E8EF] text-[#687182] hover:border-neutral-300'
                                    }`}
                                >
                                  <input
                                    type="checkbox"
                                    checked={isChecked}
                                    onChange={(e) => {
                                      if (e.target.checked) {
                                        setRoleForm({
                                          ...roleForm,
                                          permissions: [...roleForm.permissions, perm.key],
                                        });
                                      } else {
                                        setRoleForm({
                                          ...roleForm,
                                          permissions: roleForm.permissions.filter(
                                            (k) => k !== perm.key
                                          ),
                                        });
                                      }
                                    }}
                                    className="mt-0.5 rounded text-[#4787F2]"
                                  />
                                  <div>
                                    <p className="font-bold text-[#17181C]">{perm.name}</p>
                                    <p className="text-[10px] text-[#687182]">{perm.description}</p>
                                  </div>
                                </label>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-4 border-t border-[#E3E8EF] flex items-center justify-end gap-2">
                  <Button
                    variant="outline"
                    size="md"
                    type="button"
                    onClick={() => setShowCreateRoleModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    size="md"
                    type="submit"
                    className="bg-[#4787F2] hover:bg-[#3972D4] font-bold"
                  >
                    Create &amp; Persist Role to Database
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL 2: EDIT ROLE & PERMISSIONS */}
        {showEditRoleModal && selectedRole && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 max-w-2xl w-full shadow-2xl border border-[#E3E8EF] max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-4 border-b border-[#E3E8EF] mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-[#35AB4E] text-white flex items-center justify-center font-bold shadow-md">
                    <Edit3 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-[#17181C]">
                      Edit Role: {selectedRole.name}
                    </h3>
                    <p className="text-xs text-[#687182]">
                      Update role configuration, assigned dashboard, and permissions
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowEditRoleModal(false)}
                  className="text-neutral-400 hover:text-neutral-700 p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleUpdateRole} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-[#17181C] block mb-1">
                      Role Display Name
                    </label>
                    <input
                      type="text"
                      required
                      value={roleForm.name}
                      onChange={(e) => setRoleForm({ ...roleForm, name: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-[#E3E8EF] text-xs font-semibold outline-none focus:border-[#4787F2]"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-[#17181C] block mb-1">
                      Target Dashboard Panel
                    </label>
                    <select
                      value={roleForm.dashboard_type}
                      onChange={(e) =>
                        setRoleForm({ ...roleForm, dashboard_type: e.target.value as DashboardType })
                      }
                      className="w-full p-2.5 rounded-xl border border-[#E3E8EF] text-xs font-bold text-[#17181C] bg-white outline-none focus:border-[#4787F2]"
                    >
                      <option value="admin">Admin Control Center (/admin)</option>
                      <option value="merchant">Merchant Studio (/merchant)</option>
                      <option value="sm">Sales Manager Portal (/sm)</option>
                      <option value="ro">Regional Officer Portal (/ro)</option>
                      <option value="zo">Zone Officer Portal (/zo)</option>
                      <option value="employee">General Employee Panel (/sm)</option>
                      <option value="user">Consumer / Customer Feed (/feed)</option>
                    </select>
                  </div>
                </div>

                {/* Permissions Module Checkboxes */}
                <div className="space-y-3 pt-2 border-t border-[#E3E8EF]">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-black text-[#17181C] uppercase tracking-wider">
                      Module Permissions ({roleForm.permissions.length} active)
                    </label>
                    <div className="flex items-center gap-2 text-[10px]">
                      <button
                        type="button"
                        onClick={() =>
                          setRoleForm({
                            ...roleForm,
                            permissions: allPermissions.map((p) => p.key),
                          })
                        }
                        className="text-[#4787F2] font-bold hover:underline"
                      >
                        Select All
                      </button>
                      <span className="text-neutral-300">|</span>
                      <button
                        type="button"
                        onClick={() => setRoleForm({ ...roleForm, permissions: [] })}
                        className="text-neutral-500 font-bold hover:underline"
                      >
                        Clear All
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3 max-h-64 overflow-y-auto p-3 bg-[#F4F6FB] rounded-2xl border border-[#E3E8EF]">
                    {Object.entries(permissionModules).map(([moduleName, perms]) => (
                      <div key={moduleName} className="bg-white p-3 rounded-xl border border-[#E3E8EF] space-y-2">
                        <span className="text-[11px] font-black uppercase text-[#17181C] block pb-1 border-b border-[#F4F6FB]">
                          {moduleName} Module
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {perms.map((perm) => {
                            const isChecked = roleForm.permissions.includes(perm.key);
                            return (
                              <label
                                key={perm.key}
                                className={`flex items-start gap-2 p-2 rounded-lg border text-[11px] cursor-pointer transition-all ${isChecked
                                    ? 'bg-[#EDF4FF] border-[#4787F2] text-[#4787F2] font-semibold'
                                    : 'bg-white border-[#E3E8EF] text-[#687182] hover:border-neutral-300'
                                  }`}
                              >
                                <input
                                  type="checkbox"
                                  checked={isChecked}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      setRoleForm({
                                        ...roleForm,
                                        permissions: [...roleForm.permissions, perm.key],
                                      });
                                    } else {
                                      setRoleForm({
                                        ...roleForm,
                                        permissions: roleForm.permissions.filter(
                                          (k) => k !== perm.key
                                        ),
                                      });
                                    }
                                  }}
                                  className="mt-0.5 rounded text-[#4787F2]"
                                />
                                <div>
                                  <p className="font-bold text-[#17181C]">{perm.name}</p>
                                  <p className="text-[10px] text-[#687182]">{perm.description}</p>
                                </div>
                              </label>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-[#E3E8EF] flex items-center justify-end gap-2">
                  <Button
                    variant="outline"
                    size="md"
                    type="button"
                    onClick={() => setShowEditRoleModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    size="md"
                    type="submit"
                    className="bg-[#35AB4E] hover:bg-[#2e9644] font-bold"
                  >
                    Update Role &amp; Permissions in Database
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
