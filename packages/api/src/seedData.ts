/**
 * Adsspot Core Master Reference & Seed Data
 * Pure clean reference without fake mock datasets.
 */

import {
  Category,
  City,
  Region,
  PincodeTerritory,
  Plan,
  Business,
  Post,
  Story,
  Lead,
  Visit,
  Attendance,
  Target,
  Announcement,
  AuditLog,
  Review,
  LoginDemoPersona,
  User,
  StaffProfile,
} from '@adsspot/types';

// ==========================================
// 1. Categories Reference
// ==========================================
export const SEED_CATEGORIES: Category[] = [
  { id: 'cat-1', name: 'Food & Dining', slug: 'food-dining', icon: 'Utensils', sort_order: 1 },
  { id: 'cat-2', name: 'Shopping & Retail', slug: 'shopping-retail', icon: 'ShoppingBag', sort_order: 2 },
  { id: 'cat-3', name: 'Services & Repairs', slug: 'services-repairs', icon: 'Wrench', sort_order: 3 },
  { id: 'cat-4', name: 'Health & Wellness', slug: 'health-wellness', icon: 'HeartPulse', sort_order: 4 },
  { id: 'cat-5', name: 'Events & Entertainment', slug: 'events-entertainment', icon: 'Sparkles', sort_order: 5 },
  { id: 'cat-6', name: 'Fashion & Apparel', slug: 'fashion-apparel', icon: 'Shirt', sort_order: 6 },
  { id: 'cat-7', name: 'Jewellery & Gold', slug: 'jewellery-gold', icon: 'Gem', sort_order: 7 },
  { id: 'cat-8', name: 'Fitness & Gym', slug: 'fitness-gym', icon: 'Dumbbell', sort_order: 8 },
  { id: 'cat-9', name: 'Beauty & Salon', slug: 'beauty-salon', icon: 'Scissors', sort_order: 9 },
  { id: 'cat-10', name: 'Real Estate & Properties', slug: 'real-estate', icon: 'Home', sort_order: 10 },
  { id: 'cat-11', name: 'Education & Coaching', slug: 'education-coaching', icon: 'GraduationCap', sort_order: 11 },
  { id: 'cat-12', name: 'Automobile & Rentals', slug: 'automobile-rentals', icon: 'Car', sort_order: 12 },
  { id: 'cat-doc', name: 'Doctors & Clinics', slug: 'doctors-clinics', icon: 'Stethoscope', sort_order: 13 },
  { id: 'cat-travel', name: 'Tours & Travel', slug: 'tours-travel', icon: 'Compass', sort_order: 14 },
];

// ==========================================
// 2. Cities & Geographic Territories
// ==========================================
export const SEED_CITIES: City[] = [
  { id: 'city-vad', name: 'Vadodara', state: 'Gujarat', zo_user_id: 'usr-admin-1', created_at: '2026-01-01T00:00:00Z' },
  { id: 'city-mum', name: 'Mumbai', state: 'Maharashtra', zo_user_id: 'usr-admin-1', created_at: '2026-01-01T00:00:00Z' },
  { id: 'city-ahmd', name: 'Ahmedabad', state: 'Gujarat', zo_user_id: 'usr-admin-1', created_at: '2026-01-01T00:00:00Z' },
  { id: 'city-surat', name: 'Surat', state: 'Gujarat', zo_user_id: 'usr-admin-1', created_at: '2026-01-01T00:00:00Z' },
  { id: 'city-pune', name: 'Pune', state: 'Maharashtra', zo_user_id: 'usr-admin-1', created_at: '2026-01-01T00:00:00Z' },
  { id: 'city-blr', name: 'Bengaluru', state: 'Karnataka', zo_user_id: 'usr-admin-1', created_at: '2026-01-01T00:00:00Z' },
  { id: 'city-del', name: 'Delhi NCR', state: 'Delhi', zo_user_id: 'usr-admin-1', created_at: '2026-01-01T00:00:00Z' },
];

export const SEED_REGIONS: Region[] = [
  { id: 'reg-vad-alkapuri', city_id: 'city-vad', name: 'Alkapuri & Old Padra', ro_user_id: 'usr-admin-1', created_at: '2026-01-01T00:00:00Z' },
  { id: 'reg-vad-raopura', city_id: 'city-vad', name: 'Raopura & Mandvi', ro_user_id: 'usr-admin-1', created_at: '2026-01-01T00:00:00Z' },
  { id: 'reg-vad-sayajigunj', city_id: 'city-vad', name: 'Sayajigunj & Fatehgunj', ro_user_id: 'usr-admin-1', created_at: '2026-01-01T00:00:00Z' },
  { id: 'reg-mum-south', city_id: 'city-mum', name: 'South Mumbai', ro_user_id: 'usr-admin-1', created_at: '2026-01-01T00:00:00Z' },
  { id: 'reg-mum-west', city_id: 'city-mum', name: 'Western Suburbs', ro_user_id: 'usr-admin-1', created_at: '2026-01-01T00:00:00Z' },
];

export const SEED_PINCODES: PincodeTerritory[] = [
  { pincode: '390001', region_id: 'reg-vad-raopura', city_id: 'city-vad', assigned_sm_id: 'usr-admin-1', updated_at: '2026-01-01T00:00:00Z' },
  { pincode: '390005', region_id: 'reg-vad-sayajigunj', city_id: 'city-vad', assigned_sm_id: 'usr-admin-1', updated_at: '2026-01-01T00:00:00Z' },
  { pincode: '390007', region_id: 'reg-vad-alkapuri', city_id: 'city-vad', assigned_sm_id: 'usr-admin-1', updated_at: '2026-01-01T00:00:00Z' },
  { pincode: '400001', region_id: 'reg-mum-south', city_id: 'city-mum', assigned_sm_id: 'usr-admin-1', updated_at: '2026-01-01T00:00:00Z' },
];

// ==========================================
// 3. Official System Users
// ==========================================
export const DEMO_PERSONAS: LoginDemoPersona[] = [
  {
    id: 'usr-admin-1',
    name: 'Adsspot Admin',
    email: 'admin@adsspot.in',
    phone: '+919999999999',
    role: 'super_admin',
    description: 'Global system administration, content moderation & analytics',
    avatar_url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
  },
];

export const SEED_USERS: User[] = [
  {
    id: 'usr-admin-1',
    phone: '+919999999999',
    email: 'admin@adsspot.in',
    full_name: 'Adsspot Admin',
    avatar_url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    role: 'super_admin',
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
  },
];

export const SEED_STAFF_PROFILES: StaffProfile[] = [
  {
    id: 'staff-admin-1',
    user_id: 'usr-admin-1',
    role: 'super_admin',
    reports_to: null,
    city_id: null,
    region_id: null,
    target_monthly: 0,
    status: 'active',
    created_at: '2026-01-01T00:00:00Z',
  },
];

// ==========================================
// 4. Plans & Subscriptions
// ==========================================
export const SEED_PLANS: Plan[] = [
  {
    id: 'plan-basic',
    name: 'Basic',
    tier: 'basic',
    price_monthly: 999,
    price_yearly: 9999,
    features: ['Hyperlocal Listing', 'Digital Visiting Card (/card/[slug])', 'Festival Banners (auto-branded)'],
  },
  {
    id: 'plan-premium',
    name: 'Premium',
    tier: 'premium',
    price_monthly: 2499,
    price_yearly: 24999,
    features: ['All Basic features', '2 Custom Banners per week', 'Green "Trusted" verified badge', 'Priority Search Ranking'],
  },
  {
    id: 'plan-elite',
    name: 'Elite',
    tier: 'elite',
    price_monthly: 4999,
    price_yearly: 49999,
    features: ['All Premium features', 'Daily Custom Banners', 'Full Business Microsite (/b/[slug])', 'Elite Stories privileges (1/day)', 'Dedicated Support'],
  },
];

// ==========================================
// 5. Clean Live Tables (No Mock Seed Data)
// ==========================================
export const SEED_BUSINESSES: Business[] = [];
export const SEED_POSTS: Post[] = [];
export const SEED_STORIES: Story[] = [];
export const SEED_LEADS: Lead[] = [];
export const SEED_VISITS: Visit[] = [];
export const SEED_ATTENDANCE: Attendance[] = [];
export const SEED_TARGETS: Target[] = [];
export const SEED_ANNOUNCEMENTS: Announcement[] = [];
export const SEED_AUDIT_LOGS: AuditLog[] = [];
export const SEED_REVIEWS: Review[] = [];
