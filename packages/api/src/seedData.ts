import {
  User,
  StaffProfile,
  City,
  Region,
  PincodeTerritory,
  Category,
  Business,
  Plan,
  Post,
  Story,
  Lead,
  Visit,
  Target,
  Attendance,
  Announcement,
  AuditLog,
  Review,
  LoginDemoPersona,
} from '@adsspot/types';


// ==========================================
// 1. Categories
// ==========================================
export const SEED_CATEGORIES: Category[] = [
  { id: 'cat-1', name: 'Food & Dining', slug: 'food-dining', icon: 'UtensilsCrossed', sort_order: 1 },
  { id: 'cat-2', name: 'Fashion & Apparel', slug: 'fashion-apparel', icon: 'Shirt', sort_order: 2 },
  { id: 'cat-3', name: 'Electronics & Gadgets', slug: 'electronics', icon: 'Smartphone', sort_order: 3 },
  { id: 'cat-4', name: 'Healthcare & Wellness', slug: 'healthcare', icon: 'HeartPulse', sort_order: 4 },
  { id: 'cat-5', name: 'Beauty & Salon', slug: 'beauty-salon', icon: 'Sparkles', sort_order: 5 },
  { id: 'cat-6', name: 'Fitness & Gym', slug: 'fitness-gym', icon: 'Dumbbell', sort_order: 6 },
  { id: 'cat-7', name: 'Jewellery & Gold', slug: 'jewellery', icon: 'Gem', sort_order: 7 },
  { id: 'cat-8', name: 'Automobile & Care', slug: 'automobile', icon: 'Car', sort_order: 8 },
];

// ==========================================
// 2. Geographic Hierarchy (Cities, Regions, Pincodes)
// ==========================================
export const SEED_CITIES: City[] = [
  { id: 'city-vad', name: 'Vadodara', state: 'Gujarat', zo_user_id: 'usr-zo-1', created_at: '2026-01-01T00:00:00Z' },
  { id: 'city-mum', name: 'Mumbai', state: 'Maharashtra', zo_user_id: 'usr-zo-1', created_at: '2026-01-01T00:00:00Z' },
  { id: 'city-ahm', name: 'Ahmedabad', state: 'Gujarat', zo_user_id: null, created_at: '2026-01-01T00:00:00Z' },
  { id: 'city-del', name: 'Delhi NCR', state: 'Delhi', zo_user_id: null, created_at: '2026-01-01T00:00:00Z' },
  { id: 'city-blr', name: 'Bengaluru', state: 'Karnataka', zo_user_id: null, created_at: '2026-01-01T00:00:00Z' },
];

export const SEED_REGIONS: Region[] = [
  { id: 'reg-vad-alkapuri', city_id: 'city-vad', name: 'Alkapuri & Old Padra', ro_user_id: 'usr-ro-1', created_at: '2026-01-01T00:00:00Z' },
  { id: 'reg-vad-mandvi', city_id: 'city-vad', name: 'Mandvi & Raopura', ro_user_id: 'usr-ro-1', created_at: '2026-01-01T00:00:00Z' },
  { id: 'reg-mum-south', city_id: 'city-mum', name: 'Mumbai South', ro_user_id: 'usr-ro-1', created_at: '2026-01-01T00:00:00Z' },
  { id: 'reg-mum-west', city_id: 'city-mum', name: 'Mumbai Western Suburbs', ro_user_id: null, created_at: '2026-01-01T00:00:00Z' },
  { id: 'reg-mum-central', city_id: 'city-mum', name: 'Mumbai Central Suburbs', ro_user_id: null, created_at: '2026-01-01T00:00:00Z' },
];

export const SEED_PINCODES: PincodeTerritory[] = [
  { pincode: '390007', region_id: 'reg-vad-alkapuri', city_id: 'city-vad', assigned_sm_id: 'usr-sm-1', updated_at: '2026-01-01T00:00:00Z' },
  { pincode: '390001', region_id: 'reg-vad-mandvi', city_id: 'city-vad', assigned_sm_id: 'usr-sm-1', updated_at: '2026-01-01T00:00:00Z' },
  { pincode: '390020', region_id: 'reg-vad-alkapuri', city_id: 'city-vad', assigned_sm_id: 'usr-sm-1', updated_at: '2026-01-01T00:00:00Z' },
  { pincode: '400001', region_id: 'reg-mum-south', city_id: 'city-mum', assigned_sm_id: 'usr-sm-1', updated_at: '2026-01-01T00:00:00Z' },
  { pincode: '400020', region_id: 'reg-mum-south', city_id: 'city-mum', assigned_sm_id: 'usr-sm-1', updated_at: '2026-01-01T00:00:00Z' },
  { pincode: '400050', region_id: 'reg-mum-west', city_id: 'city-mum', assigned_sm_id: null, updated_at: '2026-01-01T00:00:00Z' },
  { pincode: '400053', region_id: 'reg-mum-west', city_id: 'city-mum', assigned_sm_id: null, updated_at: '2026-01-01T00:00:00Z' },
];

// ==========================================
// 3. Demo Persona Accounts & Users
// ==========================================
export const DEMO_PERSONAS: LoginDemoPersona[] = [
  {
    id: 'usr-consumer-1',
    name: 'Aarav Sharma',
    phone: '+919876543210',
    role: 'consumer',
    description: 'Hyperlocal shopper discovering nearby offers and events',
    avatar_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'usr-merch-elite',
    name: 'Rajesh Singhania (Royal Jewellers)',
    phone: '+919876543213',
    role: 'merchant',
    tier: 'elite',
    description: 'Elite Business Owner with daily banners, story privileges & microsite',
    avatar_url: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'usr-merch-prem',
    name: 'Priya Mehta (Mehta Sweets)',
    phone: '+919876543212',
    role: 'merchant',
    tier: 'premium',
    description: 'Premium Business Owner with 2 weekly custom banners & Trusted badge',
    avatar_url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'usr-merch-basic',
    name: 'Vikram Joshi (Joshi Kirana)',
    phone: '+919876543211',
    role: 'merchant',
    tier: 'basic',
    description: 'Basic Business Owner with digital card & festival banners',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'usr-sm-1',
    name: 'Karan Verma (Field SM)',
    phone: '+919876543214',
    role: 'sm',
    description: 'Sales Manager assigned to Fort (400001) & Nariman Point (400020)',
    avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'usr-ro-1',
    name: 'Sunita Rao (RO South Mumbai)',
    phone: '+919876543215',
    role: 'ro',
    description: 'Regional Officer supervising 6 SMs across South Mumbai territory',
    avatar_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'usr-zo-1',
    name: 'Devendra Patel (ZO Mumbai)',
    phone: '+919876543216',
    role: 'zo',
    description: 'Zone Officer commanding Mumbai city operations & targets',
    avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'usr-admin-1',
    name: 'Vikramaditya (Super Admin)',
    phone: '+919876543217',
    role: 'super_admin',
    description: 'Global system administration, moderation, revenue & audit logs',
    avatar_url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
  },
];

export const SEED_USERS: User[] = DEMO_PERSONAS.map((p) => ({
  id: p.id,
  phone: p.phone,
  full_name: p.name,
  avatar_url: p.avatar_url,
  role: p.role,
  created_at: '2026-01-01T00:00:00Z',
  updated_at: '2026-01-01T00:00:00Z',
}));

export const SEED_STAFF_PROFILES: StaffProfile[] = [
  {
    id: 'staff-sm-1',
    user_id: 'usr-sm-1',
    role: 'sm',
    reports_to: 'staff-ro-1',
    city_id: 'city-mum',
    region_id: 'reg-mum-south',
    target_monthly: 250000,
    status: 'active',
    created_at: '2026-01-01T00:00:00Z',
  },
  {
    id: 'staff-ro-1',
    user_id: 'usr-ro-1',
    role: 'ro',
    reports_to: 'staff-zo-1',
    city_id: 'city-mum',
    region_id: 'reg-mum-south',
    target_monthly: 1500000,
    status: 'active',
    created_at: '2026-01-01T00:00:00Z',
  },
  {
    id: 'staff-zo-1',
    user_id: 'usr-zo-1',
    role: 'zo',
    reports_to: null,
    city_id: 'city-mum',
    region_id: null,
    target_monthly: 5000000,
    status: 'active',
    created_at: '2026-01-01T00:00:00Z',
  },
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
// 5. Businesses across Tiers (Vadodara & Mumbai)
// ==========================================
export const SEED_BUSINESSES: Business[] = [
  // Vadodara Famous Landmarks & Businesses
  {
    id: 'biz-vad-1',
    owner_id: 'usr-merch-elite',
    category_id: 'cat-1',
    name: 'Mandap — Authentic Gujarati Dining',
    slug: 'mandap-gujarati-thali',
    description: 'Iconic heritage royal Gujarati Thali since 1974, known for authentic seasonal delicacies, Rasawala Khaman, and Puran Poli in royal Baroda style.',
    address: 'Express Hotel, RC Dutt Road, Alkapuri',
    pincode: '390007',
    lat: 22.3106,
    lng: 73.1678,
    phone: '+912652330720',
    whatsapp: '+919876543213',
    logo_url: 'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?w=200&auto=format&fit=crop&q=80',
    cover_url: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&auto=format&fit=crop&q=80',
    trusted: true,
    status: 'active',
    tier: 'elite',
    created_at: '2026-01-10T00:00:00Z',
    stats: {
      views_count: 28450,
      likes_count: 5620,
      followers_count: 3410,
      reviews_count: 245,
      avg_rating: 4.9,
    },
  },
  {
    id: 'biz-vad-2',
    owner_id: 'usr-merch-prem',
    category_id: 'cat-1',
    name: 'Jagdish Farshan & Sweets',
    slug: 'jagdish-farshan-vadodara',
    description: 'World-famous Vadodara special Bhakarwadi, Sev Usal mix, Lilo Chevdo, and pure Ghee Mohan Thal serving patrons since 1938.',
    address: 'Jubilee Baug Road, Raopura / Alkapuri Branch',
    pincode: '390001',
    lat: 22.3008,
    lng: 73.2043,
    phone: '+912652410188',
    whatsapp: '+919876543212',
    logo_url: 'https://images.unsplash.com/photo-1599785209707-a456fc1337bb?w=200&auto=format&fit=crop&q=80',
    cover_url: 'https://images.unsplash.com/photo-1505253758473-96b7015fcd40?w=800&auto=format&fit=crop&q=80',
    trusted: true,
    status: 'active',
    tier: 'premium',
    created_at: '2026-01-12T00:00:00Z',
    stats: {
      views_count: 19800,
      likes_count: 3980,
      followers_count: 2150,
      reviews_count: 188,
      avg_rating: 4.8,
    },
  },
  {
    id: 'biz-vad-3',
    owner_id: 'usr-merch-elite',
    category_id: 'cat-7',
    name: 'C.H. Jewellers',
    slug: 'ch-jewellers-alkapuri',
    description: 'Gujarat premier jewellery destination featuring Solitaire Polki, 916 BIS Hallmark Diamond Bridal Masterpieces & Antique Temple Jewellery.',
    address: 'CH House, Near Alkapuri Society, Alkapuri',
    pincode: '390007',
    lat: 22.3128,
    lng: 73.1695,
    phone: '+912652300000',
    whatsapp: '+919876543214',
    logo_url: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=200&auto=format&fit=crop&q=80',
    cover_url: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&auto=format&fit=crop&q=80',
    trusted: true,
    status: 'active',
    tier: 'elite',
    created_at: '2026-01-14T00:00:00Z',
    stats: {
      views_count: 32100,
      likes_count: 6720,
      followers_count: 4890,
      reviews_count: 310,
      avg_rating: 4.95,
    },
  },
  {
    id: 'biz-vad-4',
    owner_id: 'usr-merch-prem',
    category_id: 'cat-1',
    name: 'Canara Coffee House',
    slug: 'canara-coffee-house',
    description: 'Vadodara beloved vintage South Indian filter coffee & crisp hot Masala Dosa center since 1956 near Sayajigunj.',
    address: 'Near Dairy Den Circle, Sayajigunj',
    pincode: '390005',
    lat: 22.3082,
    lng: 73.1891,
    phone: '+912652794455',
    whatsapp: '+919876543215',
    logo_url: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=200&auto=format&fit=crop&q=80',
    cover_url: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&auto=format&fit=crop&q=80',
    trusted: true,
    status: 'active',
    tier: 'premium',
    created_at: '2026-01-18T00:00:00Z',
    stats: {
      views_count: 15400,
      likes_count: 2890,
      followers_count: 1420,
      reviews_count: 142,
      avg_rating: 4.7,
    },
  },
  {
    id: 'biz-vad-5',
    owner_id: 'usr-merch-basic',
    category_id: 'cat-1',
    name: 'Mahakali Sev Usal & Snacks',
    slug: 'mahakali-sev-usal',
    description: 'The legendary fiery Tari & Sev Usal of Vadodara, served hot with butter pav and spicy spring onions since decades.',
    address: 'Kirti Stambh, Salatwada Road',
    pincode: '390001',
    lat: 22.3025,
    lng: 73.2081,
    phone: '+919825123456',
    whatsapp: '+919825123456',
    logo_url: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=200&auto=format&fit=crop&q=80',
    cover_url: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop&q=80',
    trusted: false,
    status: 'active',
    tier: 'basic',
    created_at: '2026-02-01T00:00:00Z',
    stats: {
      views_count: 9420,
      likes_count: 1680,
      followers_count: 850,
      reviews_count: 94,
      avg_rating: 4.6,
    },
  },
  // Mumbai Businesses
  {
    id: 'biz-elite-1',
    owner_id: 'usr-merch-elite',
    category_id: 'cat-7',
    name: 'Royal Heritage Jewellers',
    slug: 'royal-heritage-jewellers',
    description: 'Certified 916 Hallmark Gold, Solitaire Diamonds and Royal Antique Bridal Kundan Jewellery since 1984.',
    address: '142, Zaveri Bazaar, Kalbadevi',
    pincode: '400002',
    lat: 18.9482,
    lng: 72.8315,
    phone: '+919876543213',
    whatsapp: '+919876543213',
    logo_url: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=200&auto=format&fit=crop&q=80',
    cover_url: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&auto=format&fit=crop&q=80',
    trusted: true,
    status: 'active',
    tier: 'elite',
    created_at: '2026-01-15T00:00:00Z',
    stats: {
      views_count: 14280,
      likes_count: 3420,
      followers_count: 1890,
      reviews_count: 128,
      avg_rating: 4.9,
    },
  },
  {
    id: 'biz-prem-1',
    owner_id: 'usr-merch-prem',
    category_id: 'cat-1',
    name: 'Mehta Authentic Mithai & Farsan',
    slug: 'mehta-sweets',
    description: 'Pure Desi Ghee traditional Gujarati & Rajasthani sweets, Kaju Katli, Motichoor Laddoos and hot crispy Jalebis.',
    address: '24, Flora Fountain, Fort',
    pincode: '400001',
    lat: 18.9322,
    lng: 72.8338,
    phone: '+919876543212',
    whatsapp: '+919876543212',
    logo_url: 'https://images.unsplash.com/photo-1599785209707-a456fc1337bb?w=200&auto=format&fit=crop&q=80',
    cover_url: 'https://images.unsplash.com/photo-1505253758473-96b7015fcd40?w=800&auto=format&fit=crop&q=80',
    trusted: true,
    status: 'active',
    tier: 'premium',
    created_at: '2026-01-20T00:00:00Z',
    stats: {
      views_count: 8940,
      likes_count: 1820,
      followers_count: 940,
      reviews_count: 84,
      avg_rating: 4.8,
    },
  },
  {
    id: 'biz-basic-1',
    owner_id: 'usr-merch-basic',
    category_id: 'cat-1',
    name: 'Joshi Kirana & Gourmet Provisions',
    slug: 'joshi-kirana',
    description: 'Premium organic grocery, exotic spices, dry fruits and daily kitchen essentials delivered in 30 minutes.',
    address: '8, Colaba Causeway, Near Regal Cinema',
    pincode: '400001',
    lat: 18.9220,
    lng: 72.8319,
    phone: '+919876543211',
    whatsapp: '+919876543211',
    logo_url: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=200&auto=format&fit=crop&q=80',
    cover_url: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=800&auto=format&fit=crop&q=80',
    trusted: false,
    status: 'active',
    tier: 'basic',
    created_at: '2026-02-01T00:00:00Z',
    stats: {
      views_count: 3210,
      likes_count: 420,
      followers_count: 180,
      reviews_count: 22,
      avg_rating: 4.5,
    },
  },
];

// ==========================================
// 6. Posts & Stories (Stories strictly Elite only)
// ==========================================
export const SEED_STORIES: Story[] = [
  {
    id: 'story-vad-1',
    business_id: 'biz-vad-1',
    media_url: 'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?w=800&auto=format&fit=crop&q=80',
    expires_at: new Date(Date.now() + 22 * 3600 * 1000).toISOString(),
    created_at: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
  },
  {
    id: 'story-vad-3',
    business_id: 'biz-vad-3',
    media_url: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&auto=format&fit=crop&q=80',
    expires_at: new Date(Date.now() + 16 * 3600 * 1000).toISOString(),
    created_at: new Date(Date.now() - 8 * 3600 * 1000).toISOString(),
  },
  {
    id: 'story-1',
    business_id: 'biz-elite-1',
    media_url: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&auto=format&fit=crop&q=80',
    expires_at: new Date(Date.now() + 18 * 3600 * 1000).toISOString(),
    created_at: new Date(Date.now() - 6 * 3600 * 1000).toISOString(),
  },
];

export const SEED_POSTS: Post[] = [
  {
    id: 'post-vad-1',
    business_id: 'biz-vad-1',
    caption: '👑 Experience the Royal Heritage of Vadodara with our authentic Grand Gujarati Thali at Mandap, Express Hotel Alkapuri. Featuring steaming hot Puran Poli, Kaju Karela, and fresh Aamras! 🥘✨',
    image_urls: [
      'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&auto=format&fit=crop&q=80',
    ],
    likes_count: 894,
    comments_count: 62,
    created_at: '2026-08-25T07:30:00Z',
  },
  {
    id: 'post-vad-2',
    business_id: 'biz-vad-2',
    caption: '🍬 Fresh Batch Alert! World-famous Vadodara special Crispy Bhakarwadi and pure Desi Ghee Mohan Thal freshly prepared today at Jagdish Farshan. Walk in or tap to order via WhatsApp! 🛍️',
    image_urls: [
      'https://images.unsplash.com/photo-1599785209707-a456fc1337bb?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1505253758473-96b7015fcd40?w=800&auto=format&fit=crop&q=80',
    ],
    likes_count: 642,
    comments_count: 45,
    created_at: '2026-08-25T06:15:00Z',
  },
  {
    id: 'post-vad-3',
    business_id: 'biz-vad-3',
    caption: '💎 Exclusive Solitaire Bridal Preview at C.H. Jewellers Alkapuri. Handcrafted 22KT antique Temple Gold jewellery inspired by the royal Gaekwads of Baroda. 👑✨',
    image_urls: [
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&auto=format&fit=crop&q=80',
    ],
    likes_count: 1250,
    comments_count: 88,
    created_at: '2026-08-24T14:20:00Z',
  },
  {
    id: 'post-1',
    business_id: 'biz-elite-1',
    caption: '✨ Unveiling our Imperial Bridal Choker Set in 22KT Hallmarked Gold adorned with uncut Zambian Emeralds. Visit our Zaveri Bazaar flagship boutique today for bespoke bridal consultations! 💎✨',
    image_urls: [
      'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&auto=format&fit=crop&q=80',
    ],
    likes_count: 482,
    comments_count: 36,
    created_at: '2026-08-23T10:30:00Z',
  },
  {
    id: 'post-2',
    business_id: 'biz-prem-1',
    caption: '🎉 Special Festival Offer: Freshly fried piping hot Kesar Jalebis with Rabdi and creamy Malai Peda! 100% Pure Ghee guaranteed. Walk in or tap WhatsApp to order for your family! 🍬',
    image_urls: [
      'https://images.unsplash.com/photo-1505253758473-96b7015fcd40?w=800&auto=format&fit=crop&q=80',
    ],
    likes_count: 219,
    comments_count: 14,
    created_at: '2026-08-24T08:15:00Z',
  },
];

// ==========================================
// 7. Field Sales Data (Leads, Visits, Targets, Attendance)
// ==========================================
export const SEED_LEADS: Lead[] = [
  {
    id: 'lead-1',
    sm_user_id: 'usr-sm-1',
    business_name: 'Bombay Optical Co.',
    owner_name: 'Sunil Merchant',
    phone: '+919820123456',
    pincode: '400001',
    status: 'interested',
    created_at: '2026-08-20T11:00:00Z',
    updated_at: '2026-08-23T16:00:00Z',
  },
  {
    id: 'lead-2',
    sm_user_id: 'usr-sm-1',
    business_name: 'Cafe Madras Delight',
    owner_name: 'Ramanathan Iyer',
    phone: '+919820234567',
    pincode: '400001',
    status: 'converted',
    created_at: '2026-08-18T10:00:00Z',
    updated_at: '2026-08-22T14:30:00Z',
  },
  {
    id: 'lead-3',
    sm_user_id: 'usr-sm-1',
    business_name: 'Metro Footwear Studio',
    owner_name: 'Nitin Shah',
    phone: '+919820345678',
    pincode: '400020',
    status: 'visited',
    created_at: '2026-08-22T09:30:00Z',
    updated_at: '2026-08-24T12:00:00Z',
  },
];

export const SEED_VISITS: Visit[] = [
  {
    id: 'visit-1',
    sm_user_id: 'usr-sm-1',
    lead_id: 'lead-1',
    notes: 'Met owner Sunil. Showed demo of Elite microsite & digital visiting card. Highly interested in Festival banner pack.',
    lat: 18.9320,
    lng: 72.8340,
    timestamp: '2026-08-23T16:00:00Z',
  },
  {
    id: 'visit-2',
    sm_user_id: 'usr-sm-1',
    lead_id: 'lead-3',
    notes: 'Initial pitch to shop manager. Scheduled meeting with owner Nitin on Tuesday 3 PM.',
    lat: 18.9280,
    lng: 72.8290,
    timestamp: '2026-08-24T12:00:00Z',
  },
];

export const SEED_ATTENDANCE: Attendance[] = [
  {
    id: 'att-1',
    sm_user_id: 'usr-sm-1',
    check_in_time: '2026-08-24T09:15:00Z',
    check_out_time: null,
    lat: 18.9325,
    lng: 72.8342,
    selfie_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
  },
];

export const SEED_TARGETS: Target[] = [
  {
    id: 'tgt-sm-1',
    staff_id: 'staff-sm-1',
    month: '2026-08',
    target_amount: 250000,
    achieved_amount: 187500, // 75%
    status: 'in_progress',
  },
  {
    id: 'tgt-ro-1',
    staff_id: 'staff-ro-1',
    month: '2026-08',
    target_amount: 1500000,
    achieved_amount: 1245000, // 83%
    status: 'in_progress',
  },
  {
    id: 'tgt-zo-1',
    staff_id: 'staff-zo-1',
    month: '2026-08',
    target_amount: 5000000,
    achieved_amount: 4120000, // 82.4%
    status: 'in_progress',
  },
];

export const SEED_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'ann-1',
    author_id: 'usr-zo-1',
    target_role: 'all',
    title: '🚀 Q3 Sprint: Double Commission on Elite Onboardings!',
    message: 'All SMs and ROs: For the next 14 days leading to Ganesh Chaturthi, all Elite onboarding closures earn an additional 5% spot bonus commission! Keep up the great field execution.',
    created_at: '2026-08-20T09:00:00Z',
  },
];

export const SEED_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'audit-1',
    actor_id: 'usr-sm-1',
    action: 'LEAD_STATUS_UPDATE',
    entity_type: 'lead',
    entity_id: 'lead-2',
    meta: { old_status: 'visited', new_status: 'converted', plan: 'plan-premium', amount: 2499 },
    created_at: '2026-08-22T14:30:00Z',
  },
  {
    id: 'audit-2',
    actor_id: 'usr-sm-1',
    action: 'FIELD_ATTENDANCE_CHECKIN',
    entity_type: 'attendance',
    entity_id: 'att-1',
    meta: { lat: 18.9325, lng: 72.8342, pincode: '400001' },
    created_at: '2026-08-24T09:15:00Z',
  },
  {
    id: 'audit-3',
    actor_id: 'usr-merch-elite',
    action: 'POST_PUBLISHED',
    entity_type: 'post',
    entity_id: 'post-1',
    meta: { tier: 'elite', images_count: 2 },
    created_at: '2026-08-23T10:30:00Z',
  },
];

export const SEED_REVIEWS: Review[] = [

  {
    id: 'rev-1',
    business_id: 'biz-1',
    user_id: 'Rohan Deshmukh',
    rating: 5,
    comment: 'Exceptional 22KT bridal collection. Handcrafted Zambian emerald choker was breathtaking!',
    reply: 'Thank you Rohan! It was an honor designing the bespoke bridal set for your family.',
    created_at: '2026-08-21T16:20:00Z',
    updated_at: '2026-08-21T18:00:00Z',
  },
  {
    id: 'rev-2',
    business_id: 'biz-2',
    user_id: 'Ananya Sharma',
    rating: 5,
    comment: 'Best Kesar Jalebis in Mumbai. Freshly prepared in pure desi ghee!',
    reply: null,
    created_at: '2026-08-23T11:45:00Z',
    updated_at: '2026-08-23T11:45:00Z',
  },
  {
    id: 'rev-3',
    business_id: 'biz-3',
    user_id: 'Kavita Patel',
    rating: 5,
    comment: 'Super fast delivery and authentic organic groceries. The WhatsApp ordering is seamless.',
    reply: 'Thank you Kavita ji! We always deliver fresh to Fort residents in under 30 mins.',
    created_at: '2026-08-22T09:10:00Z',
    updated_at: '2026-08-22T10:00:00Z',
  },
];

