-- ============================================================================
-- ADSSPOT — PRODUCTION POSTGRESQL + POSTGIS DATABASE SCHEMA (AMAZON AURORA)
-- ============================================================================

-- Enable PostGIS Extension for Hyperlocal Spatial Radius Queries
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(64) PRIMARY KEY,
    phone VARCHAR(20) UNIQUE NOT NULL,
    full_name VARCHAR(128) NOT NULL,
    avatar_url TEXT,
    role VARCHAR(32) NOT NULL DEFAULT 'consumer',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Staff Profiles (SM, RO, ZO, Super Admin)
CREATE TABLE IF NOT EXISTS staff_profiles (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(32) NOT NULL,
    reports_to VARCHAR(64) REFERENCES users(id),
    city_id VARCHAR(64),
    region_id VARCHAR(64),
    target_monthly NUMERIC(12, 2) DEFAULT 0,
    status VARCHAR(32) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Cities
CREATE TABLE IF NOT EXISTS cities (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(128) NOT NULL,
    state VARCHAR(128) NOT NULL,
    zo_user_id VARCHAR(64) REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Regions (Sub-Zones managed by RO)
CREATE TABLE IF NOT EXISTS regions (
    id VARCHAR(64) PRIMARY KEY,
    city_id VARCHAR(64) REFERENCES cities(id) ON DELETE CASCADE,
    name VARCHAR(128) NOT NULL,
    ro_user_id VARCHAR(64) REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Pincode Territories (Assigned to Field Sales Managers)
CREATE TABLE IF NOT EXISTS pincode_territories (
    pincode VARCHAR(10) PRIMARY KEY,
    region_id VARCHAR(64) REFERENCES regions(id),
    city_id VARCHAR(64) REFERENCES cities(id),
    assigned_sm_id VARCHAR(64) REFERENCES users(id),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Categories
CREATE TABLE IF NOT EXISTS categories (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(128) NOT NULL,
    slug VARCHAR(128) UNIQUE NOT NULL,
    icon VARCHAR(64),
    sort_order INT DEFAULT 0
);

-- 7. Businesses (Hyperlocal Listings with PostGIS Coordinates)
CREATE TABLE IF NOT EXISTS businesses (
    id VARCHAR(64) PRIMARY KEY,
    owner_id VARCHAR(64) REFERENCES users(id) ON DELETE CASCADE,
    category_id VARCHAR(64) REFERENCES categories(id),
    name VARCHAR(256) NOT NULL,
    slug VARCHAR(256) UNIQUE NOT NULL,
    description TEXT,
    address TEXT NOT NULL,
    pincode VARCHAR(10) NOT NULL,
    lat NUMERIC(10, 7) NOT NULL,
    lng NUMERIC(10, 7) NOT NULL,
    location GEOGRAPHY(Point, 4326),
    phone VARCHAR(20) NOT NULL,
    whatsapp VARCHAR(20),
    logo_url TEXT,
    cover_url TEXT,
    email VARCHAR(256),
    website VARCHAR(512),
    instagram VARCHAR(128),
    upi_id VARCHAR(128),
    opening_hours VARCHAR(256),
    trusted BOOLEAN DEFAULT FALSE,
    tier VARCHAR(32) NOT NULL DEFAULT 'basic', -- basic, premium, elite
    status VARCHAR(32) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Spatial GIST index for sub-millisecond radius searches
CREATE INDEX IF NOT EXISTS idx_businesses_location ON businesses USING GIST(location);
CREATE INDEX IF NOT EXISTS idx_businesses_pincode ON businesses(pincode);
CREATE INDEX IF NOT EXISTS idx_businesses_tier ON businesses(tier);

-- Trigger to automatically populate PostGIS geography column on insert/update
CREATE OR REPLACE FUNCTION update_business_location()
RETURNS TRIGGER AS $$
BEGIN
    NEW.location := ST_SetSRID(ST_MakePoint(NEW.lng, NEW.lat), 4326);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_business_location ON businesses;
CREATE TRIGGER trg_business_location
BEFORE INSERT OR UPDATE ON businesses
FOR EACH ROW EXECUTE FUNCTION update_business_location();

-- 8. Plans & Subscriptions
CREATE TABLE IF NOT EXISTS plans (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(128) NOT NULL,
    tier VARCHAR(32) NOT NULL,
    price_monthly NUMERIC(10, 2) NOT NULL,
    price_yearly NUMERIC(10, 2) NOT NULL,
    features JSONB NOT NULL DEFAULT '[]'::jsonb
);

CREATE TABLE IF NOT EXISTS subscriptions (
    id VARCHAR(64) PRIMARY KEY,
    business_id VARCHAR(64) REFERENCES businesses(id) ON DELETE CASCADE,
    plan_id VARCHAR(64) REFERENCES plans(id),
    status VARCHAR(32) DEFAULT 'active',
    current_period_start TIMESTAMP WITH TIME ZONE NOT NULL,
    current_period_end TIMESTAMP WITH TIME ZONE NOT NULL,
    razorpay_subscription_id VARCHAR(128)
);

-- 9. Feed Posts
CREATE TABLE IF NOT EXISTS posts (
    id VARCHAR(64) PRIMARY KEY,
    business_id VARCHAR(64) REFERENCES businesses(id) ON DELETE CASCADE,
    caption TEXT NOT NULL,
    image_urls TEXT[] NOT NULL DEFAULT '{}',
    likes_count INT DEFAULT 0,
    comments_count INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at DESC);

-- 10. Stories (Strict Constraint: Elite Tier only, max 1 active per 24 hours per business)
CREATE TABLE IF NOT EXISTS stories (
    id VARCHAR(64) PRIMARY KEY,
    business_id VARCHAR(64) REFERENCES businesses(id) ON DELETE CASCADE,
    media_url TEXT NOT NULL,
    tag VARCHAR(64),
    coupon_code VARCHAR(64),
    caption TEXT,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_stories_expires_at ON stories(expires_at DESC);

-- 11. Comments & Likes
CREATE TABLE IF NOT EXISTS comments (
    id VARCHAR(64) PRIMARY KEY,
    post_id VARCHAR(64) REFERENCES posts(id) ON DELETE CASCADE,
    user_id VARCHAR(64) REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS likes (
    user_id VARCHAR(64) REFERENCES users(id) ON DELETE CASCADE,
    post_id VARCHAR(64) REFERENCES posts(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (user_id, post_id)
);

-- 12. Reviews & Follows
CREATE TABLE IF NOT EXISTS reviews (
    id VARCHAR(64) PRIMARY KEY,
    business_id VARCHAR(64) REFERENCES businesses(id) ON DELETE CASCADE,
    user_id VARCHAR(64) REFERENCES users(id) ON DELETE CASCADE,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    reply TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS follows (
    user_id VARCHAR(64) REFERENCES users(id) ON DELETE CASCADE,
    business_id VARCHAR(64) REFERENCES businesses(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (user_id, business_id)
);

-- 13. Wallets & Transactions (ACID Compliance)
CREATE TABLE IF NOT EXISTS wallets (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    balance NUMERIC(12, 2) NOT NULL DEFAULT 0.00 CHECK (balance >= 0),
    currency VARCHAR(10) DEFAULT 'INR',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS wallet_transactions (
    id VARCHAR(64) PRIMARY KEY,
    wallet_id VARCHAR(64) REFERENCES wallets(id) ON DELETE CASCADE,
    type VARCHAR(32) NOT NULL, -- credit, debit
    amount NUMERIC(12, 2) NOT NULL,
    description TEXT NOT NULL,
    reference_id VARCHAR(128),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 14. Sales Leads & Field Visits
CREATE TABLE IF NOT EXISTS leads (
    id VARCHAR(64) PRIMARY KEY,
    sm_user_id VARCHAR(64) REFERENCES users(id),
    business_name VARCHAR(256) NOT NULL,
    owner_name VARCHAR(128) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    pincode VARCHAR(10) NOT NULL,
    status VARCHAR(32) DEFAULT 'new', -- new, visited, interested, converted
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS visits (
    id VARCHAR(64) PRIMARY KEY,
    sm_user_id VARCHAR(64) REFERENCES users(id),
    lead_id VARCHAR(64) REFERENCES leads(id) ON DELETE CASCADE,
    notes TEXT,
    lat NUMERIC(10, 7) NOT NULL,
    lng NUMERIC(10, 7) NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 15. Audit Logs (Immutable Security Log)
CREATE TABLE IF NOT EXISTS audit_logs (
    id VARCHAR(64) PRIMARY KEY,
    actor_id VARCHAR(64) REFERENCES users(id),
    action VARCHAR(128) NOT NULL,
    entity_type VARCHAR(64) NOT NULL,
    entity_id VARCHAR(64) NOT NULL,
    meta JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at DESC);
