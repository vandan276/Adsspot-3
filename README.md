# Adsspot — Hyperlocal Business Discovery & Growth Platform

Adsspot is a hyperlocal business discovery and marketing platform for India, uniting consumers, local merchants, field sales managers (SM), regional officers (RO), zone officers (ZO), and super admins across a web portal and mobile app sharing a unified backend, design system, and account model.

## Monorepo Structure

```
adsspot/
├── apps/
│   ├── web/           # Next.js 14 App Router (Landing, Merchant, SM, RO, ZO, Super Admin panels)
│   └── mobile/        # Expo (React Native) SDK 51 with web-compatible mode
├── packages/
│   ├── types/         # Strict TypeScript definitions for all 34 database entities & roles
│   ├── ui/            # Unified design tokens, Spot Ring gradient, 12px avatars, pill buttons, cards
│   ├── api/           # Typed Supabase client, offline fallback store, auth provider, seeds
│   ├── config-typescript/  # Shared tsconfig base, nextjs, and react-native presets
│   └── config-eslint/      # Standard ESLint configuration
├── supabase/          # PostgreSQL migrations, RLS security policies, and seed scripts
└── turbo.json         # Turborepo task pipeline configuration
```

## Quick Start

### 1. Install Dependencies
```bash
pnpm install
```

### 2. Run Applications Locally
```bash
# Run Next.js Web App (http://localhost:3000)
pnpm dev:web

# Run Expo Mobile in Web Mode (http://localhost:8081)
pnpm dev:mobile

# Run both concurrently
pnpm dev
```

### 3. Verification & Quality Gates
```bash
# Strict TypeScript check across all packages and apps
pnpm typecheck

# Lint check
pnpm lint

# Production build
pnpm build
```

## Design System Tokens
- **Spot Blue**: `#4787F2` (Primary brand & action color)
- **Festival Yellow**: `#F2B604` (Highlights, promotions & tier upsells)
- **Trust Green**: `#35AB4E` (Trusted badge, success indicators, verified tags)
- **Deep Crimson**: `#981837` (Live events, festival accents, urgent alerts)
- **Ink**: `#17181C` (High-contrast typography)
- **Background Base**: `#F4F6FB` (Soft canvas backdrop)
- **Card Background**: `#FFFFFF` (16px border-radius, subtle elevation)
- **Signature "Spot Ring"**: Conic gradient (`#4787F2` → `#35AB4E` → `#F2B604` → `#981837`)
- **Avatars**: Rounded squares (`12px` border-radius), **never circles**
- **Buttons**: Pill-shaped (`border-radius: 9999px`)
