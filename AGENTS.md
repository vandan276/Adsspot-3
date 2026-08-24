# Adsspot — Repository Standards & Milestone Rules

## 1. Product Overview
Adsspot is a hyperlocal business discovery and marketing platform for India, with a mobile app and a website sharing one backend, one account system, and one design system.

### User Roles & Surfaces
- **Consumer**: Mobile App (Nearby feed, Stories, Explore map + category sheet, Wallet, Profile, Rate/Review/Follow).
- **Merchant**: Mobile App + Web (`/merchant`) (KPIs, Posts/Stories per tier, Banner Library, Digital Card `/card/[slug]`, Elite Microsite `/b/[slug]`, Reviews, Self-serve membership upgrade).
- **SM (Sales Manager)**: Mobile App + Web (`/sm`) (Assigned pincode territory, Attendance check-in, Daily target ring, Lead pipeline, Visit logs with GPS, In-person merchant onboarding with payment & owner OTP, Commissions).
- **RO (Regional Officer)**: Web (`/ro`) (Micro-detail of all assigned SMs: check-ins, visits, pipeline, conversions, target %, timeline, pincode assignment, coverage map, leaderboard).
- **ZO (Zone Officer)**: Web (`/zo`) (City-wide drill-down across ROs and SMs, city KPIs, tier-split donut, appoint ROs, set targets, broadcast announcements).
- **Super Admin**: Web (`/admin`) (Global KPIs, users, merchants, staff hierarchy tree with per-person audit logs, memberships & revenue, content moderation, banner template CMS, wallet & ticket oversight, roles & permissions, system audit logs).
- **Public**: Web (`/`) (Marketing landing page with pricing, tier comparisons, and mobile app download links).

### Membership Tiers
- **Basic**: Platform listing + digital visiting card (`/card/[slug]`) + festival banners only.
- **Premium**: Basic + 2 custom banners per week + green "Trusted" badge.
- **Elite**: Premium + daily banners + business microsite (`/b/[slug]`). Stories are **Elite-only**, strictly capped at **max ONE story per business per 24-hour day**.

---

## 2. Tech Stack & Architecture
- **Monorepo**: pnpm workspaces + Turborepo. TypeScript `strict` mode in all packages and apps.
- **apps/web**: Next.js 14+ (App Router), Tailwind CSS / Vanilla CSS design tokens, Lucide icons, `@vis.gl/react-google-maps`.
- **apps/mobile**: Expo (React Native) SDK 51+ with React Navigation / Expo Router, web-compatible mode for instant browser verification and testing.
- **packages/ui**: Shared design tokens, color constants, Spot ring definitions, typography, button variants, and cross-platform UI primitives.
- **packages/types**: Full TypeScript data definitions for DB schemas, API requests/responses, role permissions, and tier features.
- **packages/api**: Shared typed Supabase client, query helpers, RLS role helpers, and mock/fallback handlers for local standalone testing.
- **Backend**: Supabase (PostgreSQL with Row Level Security, Phone-OTP Auth, Storage buckets, Realtime channels).
- **Payments**: Razorpay SDK / API integration for subscriptions, top-ups, and SM merchant onboarding collections.
- **Banner Engine**: Server-side image composition (sharp/canvas) dynamically stamping business logo + name onto tier templates.

---

## 3. Design System & Visual Tokens
- **Spot Blue**: `#4787F2` (Primary brand & action color)
- **Festival Yellow**: `#F2B604` (Highlights, promotions & tier upsells)
- **Trust Green**: `#35AB4E` (Trusted badge, success indicators, verified tags)
- **Deep Crimson**: `#981837` (Live events, festival accents, urgent alerts)
- **Ink**: `#17181C` (High-contrast typography)
- **Background Base**: `#F4F6FB` (Soft canvas backdrop)
- **Card Background**: `#FFFFFF` with `16px` border-radius and subtle elevation shadow
- **Signature "Spot Ring"**: Conic gradient (`#4787F2` → `#35AB4E` → `#F2B604` → `#981837`) applied to story avatars, selected map pins, Elite business cards, and the Trusted badge outline.
- **Avatars**: Rounded squares (`12px` border-radius), **never circles**.
- **Typography**: `Plus Jakarta Sans` (ExtraBold) for headings, `Inter` for body & labels.
- **Buttons**: Pill-shaped (`border-radius: 9999px`) with micro-interactions.
- **Mobile Nav**: Floating bottom navigation bar with a raised center **● Explore** action (`Home`, `Wallet`, `● Explore`, `Saved`, `Profile`).
- **Web Navigation**: Fixed left-side navigation rail/sidebar tailored per role.

---

## 4. PostgreSQL Data Model & Schema Rules
Tables:
1. `users` (id, phone, full_name, avatar_url, role, created_at, updated_at)
2. `staff_profiles` (id, user_id, role [sm|ro|zo|super_admin], reports_to, city_id, region_id, target_monthly, status, created_at)
3. `cities` (id, name, state, zo_user_id, created_at)
4. `regions` (id, city_id, name, ro_user_id, created_at)
5. `pincode_territories` (pincode, region_id, city_id, assigned_sm_id, updated_at)
6. `categories` (id, name, slug, icon, sort_order)
7. `businesses` (id, owner_id, category_id, name, slug, description, address, pincode, lat, lng, phone, whatsapp, logo_url, cover_url, trusted, status, tier [basic|premium|elite], created_at)
8. `plans` (id, name, tier [basic|premium|elite], price_monthly, price_yearly, features)
9. `subscriptions` (id, business_id, plan_id, status, current_period_start, current_period_end, razorpay_subscription_id)
10. `posts` (id, business_id, caption, image_urls, likes_count, comments_count, created_at)
11. `stories` (id, business_id, media_url, expires_at, created_at) — *Server-side constraint: Elite tier only, max 1 active story per 24 hours per business*.
12. `comments` (id, post_id, user_id, content, created_at)
13. `likes` (user_id, post_id, created_at)
14. `customer_photos` (id, post_id, business_id, user_id, image_url, status [pending|approved], created_at)
15. `reviews` (id, business_id, user_id, rating, comment, reply, created_at, updated_at)
16. `follows` (user_id, business_id, created_at)
17. `banner_templates` (id, title, tier [basic|festival|weekly|daily], category_id, template_image_url, placeholder_box, created_at)
18. `generated_banners` (id, business_id, template_id, output_image_url, generated_at)
19. `digital_cards` (id, business_id, theme_config, click_counts, updated_at)
20. `microsites` (id, business_id, custom_domain, hero_title, about_text, gallery_urls, hours, updated_at)
21. `wallets` (id, user_id, balance, currency, updated_at)
22. `wallet_transactions` (id, wallet_id, type [credit|debit], amount, description, reference_id, created_at)
23. `linked_bank_accounts` (id, user_id, bank_name, account_number_masked, ifsc, is_primary, created_at)
24. `ticket_events` (id, business_id, title, date, venue, price, available_qty, created_at)
25. `bookings` (id, event_id, user_id, qty, total_amount, qr_code_token, status, created_at)
26. `leads` (id, sm_user_id, business_name, owner_name, phone, pincode, status [new|visited|interested|converted], created_at, updated_at)
27. `visits` (id, sm_user_id, lead_id, notes, lat, lng, timestamp)
28. `targets` (id, staff_id, month, target_amount, achieved_amount, status)
29. `commissions` (id, sm_user_id, business_id, amount, status, payout_date)
30. `attendance` (id, sm_user_id, check_in_time, check_out_time, lat, lng, selfie_url)
31. `announcements` (id, author_id, target_role [all|sm|ro|zo], title, message, created_at)
32. `approvals` (id, entity_type, entity_id, requested_by, approved_by, status, created_at)
33. `notifications` (id, user_id, title, body, link, is_read, created_at)
34. `audit_logs` (id, actor_id, action, entity_type, entity_id, meta, created_at) — *Immutable audit log written on every staff and merchant action*.

---

## 5. Milestone Cadence & Rules
1. **Strict 1 Milestone per Task**: Never implement multiple milestones in a single task.
2. **Planning First**: Produce implementation plan and wait for review before writing code.
3. **Real Queries & State**: Implement authentic Supabase queries, typed responses, and robust error handling.
4. **Browser Self-Verification**: For every milestone, spin up Next.js (`apps/web`) and Expo Web (`apps/mobile`), navigate through screens, take screenshots, and attach a `walkthrough.md` artifact.
5. **Quality Gates**: Lint and strict TypeScript check must pass before completing any milestone.
6. **Milestone Git Commit Convention**: `M<n>: <summary>` (e.g. `M0: Scaffold monorepo and packages`, `M1: Auth & role shells`).
