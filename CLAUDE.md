# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**WindowForLife** — лендинг-сайт компании по продаже и установке пластиковых и алюминиевых окон в Ступино (Московская область). Основная цель — генерация лидов через форму заявки. Заявки отправляются в Telegram через бот. База данных отсутствует.

## Commands

### Development
```bash
npm install                     # Install all workspace dependencies
npm run dev:frontend            # Frontend on localhost:5173 (with /api proxy to :3001)
npm run dev:backend             # Backend on localhost:3001 with hot reload
```

### Build (порядок важен: shared → frontend → backend)
```bash
npm run build                   # Full build of all packages in correct order
npm run build:shared            # packages/shared → packages/shared/dist/
npm run build:frontend          # frontend → frontend/dist/
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
Three npm workspaces: `packages/shared`, `frontend`, `backend`.

### packages/shared
Single source of truth for validation. Contains Zod schemas (`order.schema.ts`) and derived TypeScript types. Both frontend and backend import from `@shared` alias. **Always update the schema here** — never duplicate validation logic.

Key schema: `orderSchema` (frontend, includes `consent`) and `orderInputSchema` (backend, omits `consent`).

### Backend (Express + TypeScript)
- Entry: `backend/src/server.ts` → `app.ts`
- Single API endpoint: `POST /api/orders` — validates body with Zod, sends Telegram notification, returns 200/500
- Rate limiting: 5 requests per 15 min per IP (`middleware/rateLimiter.ts`)
- Environment validation on startup via Zod in `config/env.ts` — required: `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`
- `services/calculator.ts` is a stub (returns `null` for price) — not yet implemented

### Frontend (React + Vite + Tailwind)
- SPA, all sections in `App.tsx`, sections in `src/components/sections/`
- Form submission: `hooks/useSubmitOrder.ts` (React Query mutation) → `lib/api.ts`
- Phone input uses `react-input-mask` with format `+7 (___) ___-__-__`
- Maps: `react-yandex-maps` in `Contacts.tsx`
- All business data (products, reviews, FAQ, steps, gallery) lives in `src/data/` — edit there for content changes
- Yandex Metrika: initialized in `main.tsx`, goals tracked in `lib/analytics.ts`

### Environment Variables
Backend reads from root `.env` via `dotenv`. Frontend uses Vite's `import.meta.env` (only `VITE_` prefix). Copy `.env.example` to `.env` before running locally.

Key vars: `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID` (backend secrets); `VITE_YANDEX_MAPS_API_KEY`, `VITE_COMPANY_PHONE`, `VITE_MAP_LATITUDE/LONGITUDE` (frontend public).

### Vite Path Aliases
- `@` → `frontend/src`
- `@shared` → `packages/shared/src`

### Deployment
Nginx proxies `/api/` to `localhost:3001`, serves frontend static files from `frontend/dist/`. Config in `nginx/windowforlife.conf`. PM2 config in `backend/ecosystem.config.js`.
