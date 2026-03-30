# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**WindowForLife** — лендинг-сайт компании по продаже и установке пластиковых и алюминиевых окон в Ступино (Московская область). Основная цель — генерация лидов через форму заявки. Заявки отправляются в Telegram через бот. База данных отсутствует. Полная спецификация: `WindowForLife_Spec_v2.md`.

**Требования:** Node.js >= 20, npm >= 9. Тестов и линтера в проекте нет.

## Commands

### Development
```bash
npm install                     # Install all workspace dependencies
npm run dev:frontend            # Frontend on localhost:5173 (with /api proxy to :3001)
npm run dev:backend             # Backend on localhost:3001 with hot reload (ts-node-dev)
```

### Build (порядок важен: shared → frontend → backend)
```bash
npm run build                   # Full build of all packages in correct order
npm run build:shared            # packages/shared → packages/shared/dist/
npm run build:frontend          # frontend → frontend/dist/ (runs tsc + vite build)
npm run build:backend           # backend → backend/dist/server.js
```

### Type Checking
```bash
npm run typecheck --workspace=frontend
npm run typecheck --workspace=backend
```

### Production
```bash
cd backend && npm run start     # Run compiled backend
pm2 start ecosystem.config.js  # Production with PM2 (from backend/)
```

## Architecture

### Monorepo Structure
Three npm workspaces: `packages/shared`, `frontend`, `backend`. Backend is CommonJS, frontend is ESM. Shared package uses dual exports (CommonJS + ESM) via `exports` field in package.json.

### packages/shared
Single source of truth for validation. Contains Zod schemas (`order.schema.ts`) and derived TypeScript types. Both frontend and backend import from `@shared` alias. **Always update the schema here** — never duplicate validation logic.

Key schemas: `orderSchema` (frontend, includes `consent`) and `orderInputSchema` (backend, omits `consent` via `.omit()`). Validation includes phone regex `+7 (___) ___-__-__`, name regex (cyrillic + latin), window dimensions (300–5000 × 300–3000 mm), sash count (1–6).

### Backend (Express + TypeScript, CommonJS)
- Entry: `backend/src/server.ts` → `app.ts`
- Single API endpoint: `POST /api/orders` — validates body with Zod, sends Telegram notification, returns 200/500
- Rate limiting: 5 requests per 15 min per IP (`middleware/rateLimiter.ts`); requires `trust proxy` for correct IP behind Nginx
- Environment validation on startup via Zod in `config/env.ts` — required: `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`
- Telegram service (`services/telegram.ts`): 10-second timeout via `Promise.race`, HTML message formatting, Moscow timezone
- Graceful shutdown: 10-second timeout on SIGTERM/SIGINT before force kill
- `services/calculator.ts` is a stub (returns `null` for price) — not yet implemented
- Path aliases: dev uses `tsconfig-paths/register`, build uses `tsconfig.build.json` (strips paths/baseUrl so tsc resolves to relative imports)
- `.env` loading: tries `cwd/.env` first, then `cwd/../.env` (works from both monorepo root and backend/)

### Frontend (React + Vite + Tailwind, ESM)
- SPA, all 11 sections in `App.tsx`, no client-side routing — smooth scroll anchors only
- Form flow: `hooks/useSubmitOrder.ts` (React Query mutation) → `lib/api.ts` → `POST /api/orders`. Frontend validates with `orderSchema` (includes consent), sends only `orderInputSchema`-compatible data
- Phone input uses `react-input-mask` with format `+7 (___) ___-__-__`
- Maps: `react-yandex-maps` in `Contacts.tsx`
- All business data (products, reviews, FAQ, steps, gallery) lives in `src/data/` — edit there for content changes
- Yandex Metrika: initialized in `main.tsx`, goals tracked in `lib/analytics.ts` (order_form_opened, order_submitted, phone_clicked, cta_hero_click)
- SEO: `index.html` contains JSON-LD structured data (Organization, HomeAndConstructionBusiness, FAQPage, ItemList), OG/Twitter meta tags, hero image preload
- UI libs: `framer-motion` (animations), `swiper` (carousels), `yet-another-react-lightbox` (gallery), `lucide-react` (icons)
- Tailwind theme: custom colors (primary blue, accent cyan, surface), fonts (Outfit headings, Inter body), animations (fade-in, slide-up, count-up)
- Vite build splits chunks: react, framer-motion, swiper, react-query

### Environment Variables
Backend reads from root `.env` via `dotenv`. Frontend uses Vite's `import.meta.env` (only `VITE_` prefix). Copy `.env.example` to `.env` before running locally.

Key vars: `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID` (backend secrets); `VITE_YANDEX_MAPS_API_KEY`, `VITE_COMPANY_PHONE`, `VITE_MAP_LATITUDE/LONGITUDE` (frontend public).

### Path Aliases
- `@` → `frontend/src` (Vite config)
- `@shared` → `packages/shared/src` (Vite config + frontend tsconfig)
- Backend: `@shared/*` and `@windowforlife/shared` → `packages/shared/src` (tsconfig paths + `tsconfig-paths`)

### Deployment
Nginx proxies `/api/` to `localhost:3001`, serves frontend static files from `frontend/dist/`. Config in `nginx/windowforlife.conf` (includes CSP headers whitelisting mc.yandex.ru for Metrika and api-maps.yandex.ru for maps, HSTS preload, caching with immutable for hashed assets). PM2 config in `backend/ecosystem.config.js` (single instance, 300M memory limit).
