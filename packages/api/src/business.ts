import { getSupabaseClient } from './supabaseClient';
import { SEED_BUSINESSES } from './seedData';
import { Business } from '@adsspot/types';

const LOCAL_BIZ_KEY = 'adsspot_registered_businesses';

/**
 * Get all registered businesses (Cloud + Local + Seeds)
 */
export async function getAllBusinesses(): Promise<Business[]> {
  let cloudBusinesses: Business[] = [];
  try {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase.from('businesses').select('*');
    if (!error && data && data.length > 0) {
      cloudBusinesses = data as Business[];
    }
  } catch (err) {
    // Cloud query fallback
  }

  // Load locally saved businesses
  let localBusinesses: Business[] = [];
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem(LOCAL_BIZ_KEY);
    if (stored) {
      try {
        localBusinesses = JSON.parse(stored);
      } catch {}
    }
  }

  // Merge seed businesses with local and cloud businesses uniquely by slug
  const merged: Business[] = [...localBusinesses, ...cloudBusinesses, ...SEED_BUSINESSES];
  const uniqueMap = new Map<string, Business>();

  merged.forEach((biz) => {
    if (!uniqueMap.has(biz.slug)) {
      uniqueMap.set(biz.slug, biz);
    }
  });

  return Array.from(uniqueMap.values());
}

/**
 * Create a new Business Listing (Cloud Supabase + Local Cache)
 */
export async function createBusinessListing(bizInput: Partial<Business>): Promise<Business> {
  const slug = bizInput.slug || (bizInput.name ? bizInput.name.toLowerCase().replace(/[^a-z0-9]/g, '-') : `shop-${Date.now()}`);
  
  const newBusiness: Business = {
    id: `biz-${Date.now()}`,
    owner_id: bizInput.owner_id || 'usr-merchant-1',
    category_id: bizInput.category_id || 'cat-1',
    name: bizInput.name || 'My New Business',
    slug,
    description: bizInput.description || 'Hyperlocal store listed on Adsspot.',
    address: bizInput.address || 'Vadodara, Gujarat',
    pincode: bizInput.pincode || '390007',
    lat: bizInput.lat || 22.3072,
    lng: bizInput.lng || 73.1812,
    phone: bizInput.phone || '+919876543210',
    whatsapp: bizInput.whatsapp || bizInput.phone || '+919876543210',
    logo_url: bizInput.logo_url || 'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?w=200&auto=format&fit=crop&q=80',
    cover_url: bizInput.cover_url || 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1000&auto=format&fit=crop&q=80',
    trusted: true,
    status: 'active',
    tier: bizInput.tier || 'elite',
    created_at: new Date().toISOString(),
    stats: {
      views_count: 120,
      likes_count: 15,
      followers_count: 45,
      reviews_count: 4,
      avg_rating: 4.8,
    },
  };

  // 1. Persist to localStorage
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem(LOCAL_BIZ_KEY);
      let list: Business[] = stored ? JSON.parse(stored) : [];
      list = [newBusiness, ...list.filter((b) => b.slug !== slug)];
      localStorage.setItem(LOCAL_BIZ_KEY, JSON.stringify(list));
    } catch {}
  }

  // 2. Persist to Supabase Cloud
  try {
    const supabase = getSupabaseClient();
    const { error } = await supabase.from('businesses').insert([newBusiness]);
    if (error) {
      console.warn('Supabase insert business warning:', error.message);
    }
  } catch (err) {
    console.warn('Fallback business creation to local storage:', err);
  }

  return newBusiness;
}

/**
 * Get single business by slug
 */
export async function getBusinessBySlug(slug: string): Promise<Business | null> {
  const all = await getAllBusinesses();
  return all.find((b) => b.slug === slug) || null;
}
