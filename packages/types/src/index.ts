/**
 * Adsspot Core Type Definitions
 * Shared across packages, web app, mobile app, and backend functions
 */

// ==========================================
// 1. Roles, Tiers & Enums
// ==========================================

export type UserRole = 'consumer' | 'merchant' | 'sm' | 'ro' | 'zo' | 'super_admin';

export type StaffRole = 'sm' | 'ro' | 'zo' | 'super_admin';

export type MembershipTier = 'basic' | 'premium' | 'elite';

export type BusinessStatus = 'pending' | 'active' | 'suspended' | 'rejected';

export type LeadStatus = 'new' | 'visited' | 'interested' | 'converted';

export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'used';

export type TransactionType = 'credit' | 'debit';

export type BannerTier = 'basic' | 'festival' | 'weekly' | 'daily';

export type PhotoStatus = 'pending' | 'approved' | 'rejected';

export type TargetStatus = 'in_progress' | 'achieved' | 'missed';

export type CommissionStatus = 'pending' | 'approved' | 'paid';

export type ApprovalStatus = 'pending' | 'approved' | 'rejected';

export type AnnouncementTarget = 'all' | 'sm' | 'ro' | 'zo';

// ==========================================
// 2. Data Models (Postgres 34 Tables)
// ==========================================

export interface User {
  id: string;
  phone: string;
  email?: string;
  full_name: string;
  avatar_url?: string | null;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface StaffProfile {
  id: string;
  user_id: string;
  role: StaffRole;
  reports_to?: string | null;
  city_id?: string | null;
  region_id?: string | null;
  target_monthly: number;
  status: 'active' | 'inactive';
  created_at: string;
  // Joined fields
  user?: User;
  city?: City;
  region?: Region;
  manager?: StaffProfile;
}

export interface City {
  id: string;
  name: string;
  state: string;
  zo_user_id?: string | null;
  created_at: string;
  // Joined fields
  zo_user?: User;
  regions?: Region[];
}

export interface Region {
  id: string;
  city_id: string;
  name: string;
  ro_user_id?: string | null;
  created_at: string;
  // Joined fields
  city?: City;
  ro_user?: User;
  territories?: PincodeTerritory[];
}

export interface PincodeTerritory {
  pincode: string;
  region_id: string;
  city_id: string;
  assigned_sm_id?: string | null;
  updated_at: string;
  // Joined fields
  region?: Region;
  city?: City;
  assigned_sm?: StaffProfile;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  sort_order: number;
}

export interface Business {
  id: string;
  owner_id: string;
  category_id: string;
  name: string;
  slug: string;
  description: string;
  address: string;
  pincode: string;
  lat: number;
  lng: number;
  phone: string;
  whatsapp: string;
  logo_url?: string | null;
  cover_url?: string | null;
  trusted: boolean;
  status: BusinessStatus;
  tier: MembershipTier;
  created_at: string;
  // Joined fields
  owner?: User;
  category?: Category;
  subscription?: Subscription;
  digital_card?: DigitalCard;
  microsite?: Microsite;
  stats?: {
    views_count: number;
    likes_count: number;
    followers_count: number;
    reviews_count: number;
    avg_rating: number;
  };
}

export interface Plan {
  id: string;
  name: string;
  tier: MembershipTier;
  price_monthly: number;
  price_yearly: number;
  features: string[];
}

export interface Subscription {
  id: string;
  business_id: string;
  plan_id: string;
  status: 'active' | 'past_due' | 'canceled' | 'trialing';
  current_period_start: string;
  current_period_end: string;
  razorpay_subscription_id?: string | null;
  // Joined fields
  plan?: Plan;
}

export interface Post {
  id: string;
  business_id: string;
  caption: string;
  image_urls: string[];
  likes_count: number;
  comments_count: number;
  created_at: string;
  // Joined fields
  business?: Business;
  comments?: Comment[];
  is_liked_by_me?: boolean;
}

export interface Story {
  id: string;
  business_id: string;
  media_url: string;
  expires_at: string;
  created_at: string;
  // Joined fields
  business?: Business;
}

export interface Comment {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  created_at: string;
  // Joined fields
  user?: User;
}

export interface Like {
  user_id: string;
  post_id: string;
  created_at: string;
}

export interface CustomerPhoto {
  id: string;
  post_id: string;
  business_id: string;
  user_id: string;
  image_url: string;
  status: PhotoStatus;
  created_at: string;
  // Joined fields
  user?: User;
}

export interface Review {
  id: string;
  business_id: string;
  user_id: string;
  rating: number; // 1 to 5
  comment: string;
  reply?: string | null;
  created_at: string;
  updated_at: string;
  // Joined fields
  user?: User;
}

export interface Follow {
  user_id: string;
  business_id: string;
  created_at: string;
}

export interface BannerPlaceholderBox {
  x: number;
  y: number;
  width: number;
  height: number;
  font_size?: number;
  text_color?: string;
}

export interface BannerTemplate {
  id: string;
  title: string;
  tier: BannerTier;
  category_id?: string | null;
  template_image_url: string;
  placeholder_box: BannerPlaceholderBox;
  created_at: string;
  // Joined fields
  category?: Category;
}

export interface GeneratedBanner {
  id: string;
  business_id: string;
  template_id: string;
  output_image_url: string;
  generated_at: string;
  // Joined fields
  template?: BannerTemplate;
}

export interface DigitalCardTheme {
  primary_color: string;
  background_style: 'gradient' | 'minimal' | 'spot_ring';
  social_links: {
    instagram?: string;
    facebook?: string;
    website?: string;
    google_maps?: string;
  };
}

export interface DigitalCard {
  id: string;
  business_id: string;
  theme_config: DigitalCardTheme;
  click_counts: {
    call: number;
    whatsapp: number;
    directions: number;
    save_contact: number;
    share: number;
  };
  updated_at: string;
}

export interface Microsite {
  id: string;
  business_id: string;
  custom_domain?: string | null;
  hero_title: string;
  about_text: string;
  gallery_urls: string[];
  hours: Record<string, string>; // e.g. { "mon": "9:00 AM - 9:00 PM" }
  updated_at: string;
}

export interface Wallet {
  id: string;
  user_id: string;
  balance: number;
  currency: string;
  updated_at: string;
}

export interface WalletTransaction {
  id: string;
  wallet_id: string;
  type: TransactionType;
  amount: number;
  description: string;
  reference_id?: string | null;
  created_at: string;
}

export interface LinkedBankAccount {
  id: string;
  user_id: string;
  bank_name: string;
  account_number_masked: string; // e.g. "••••••••4589"
  ifsc: string;
  is_primary: boolean;
  created_at: string;
}

export interface TicketEvent {
  id: string;
  business_id: string;
  title: string;
  date: string;
  venue: string;
  price: number;
  available_qty: number;
  created_at: string;
  // Joined fields
  business?: Business;
}

export interface Booking {
  id: string;
  event_id: string;
  user_id: string;
  qty: number;
  total_amount: number;
  qr_code_token: string;
  status: BookingStatus;
  created_at: string;
  // Joined fields
  event?: TicketEvent;
  user?: User;
}

export interface Lead {
  id: string;
  sm_user_id: string;
  business_name: string;
  owner_name: string;
  phone: string;
  pincode: string;
  status: LeadStatus;
  created_at: string;
  updated_at: string;
  // Joined fields
  sm_user?: User;
  visits?: Visit[];
}

export interface Visit {
  id: string;
  sm_user_id: string;
  lead_id: string;
  notes: string;
  lat: number;
  lng: number;
  timestamp: string;
  // Joined fields
  lead?: Lead;
}

export interface Target {
  id: string;
  staff_id: string;
  month: string; // "YYYY-MM"
  target_amount: number;
  achieved_amount: number;
  status: TargetStatus;
}

export interface Commission {
  id: string;
  sm_user_id: string;
  business_id: string;
  amount: number;
  status: CommissionStatus;
  payout_date?: string | null;
  // Joined fields
  business?: Business;
}

export interface Attendance {
  id: string;
  sm_user_id: string;
  check_in_time: string;
  check_out_time?: string | null;
  lat: number;
  lng: number;
  selfie_url?: string | null;
}

export interface Announcement {
  id: string;
  author_id: string;
  target_role: AnnouncementTarget;
  title: string;
  message: string;
  created_at: string;
  // Joined fields
  author?: User;
}

export interface Approval {
  id: string;
  entity_type: 'business' | 'customer_photo' | 'payout' | 'banner';
  entity_id: string;
  requested_by: string;
  approved_by?: string | null;
  status: ApprovalStatus;
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  body: string;
  link?: string | null;
  is_read: boolean;
  created_at: string;
}

export interface AuditLog {
  id: string;
  actor_id: string;
  action: string;
  entity_type: string;
  entity_id: string;
  meta: Record<string, unknown>;
  created_at: string;
  // Joined fields
  actor?: User;
}

// ==========================================
// 3. Auth, RBAC & Session Types
// ==========================================

export type DashboardType = 'admin' | 'merchant' | 'sm' | 'ro' | 'zo' | 'employee' | 'user';

export interface Permission {
  id: string;
  key: string;
  name: string;
  description?: string | null;
  module: string;
  created_at: string;
}

export interface Role {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  dashboard_type: DashboardType;
  is_system_role: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  permissions?: string[];
  user_count?: number;
}

export interface RolePermission {
  role_id: string;
  permission_id: string;
}

export interface MediaRecord {
  id: string;
  owner_id?: string | null;
  merchant_id?: string | null;
  file_name: string;
  storage_key: string;
  file_url: string;
  mime_type: string;
  file_size: number;
  visibility: 'public' | 'private';
  status: 'active' | 'archived';
  created_at: string;
  updated_at: string;
}

export interface AuthUser extends User {
  role_id?: string | null;
  dashboard_type?: DashboardType;
  permissions?: string[];
  staff_profile?: StaffProfile | null;
  business_profile?: Business | null;
  wallet?: Wallet | null;
}

export interface AuthSession {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginDemoPersona {
  id: string;
  name: string;
  email?: string;
  phone: string;
  role: UserRole;
  tier?: MembershipTier;
  description: string;
  avatar_url: string;
}
