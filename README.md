# CompanionHub

A platform for discovering and booking verified companions for **non-sexual**
activities and social occasions (hiking, travel, event plus-ones, elderly
companionship, and similar).

## Stack

- **Backend:** Node.js, Express, TypeScript, PostgreSQL, Prisma, Socket.IO, Zod
- **Frontend:** React, TypeScript, Vite, TanStack Query, Zustand, Tailwind CSS

## Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL running locally (or a connection string to a hosted instance)

### Backend

```bash
cd backend
cp .env.example .env
# edit .env — set DATABASE_URL to your Postgres instance
# optionally set SEED_ADMIN_EMAIL / SEED_ADMIN_PASSWORD to get a first admin
npm install
npx prisma generate
npx prisma migrate dev --name add_admin
npx prisma db seed
npm run dev
```

API runs at `http://localhost:4000`. Health check: `GET /api/health`.

### Frontend

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

App runs at `http://localhost:5173`.

## Project Structure

See the architecture plan for the full backend/frontend layout. Roughly:

```
backend/src/{config,controllers,services,repositories,routes,middleware,validators,types,utils,constants,sockets}
frontend/src/{components,layouts,pages,features,hooks,services,store,types,utils,routes}
```

## Roadmap

Built in phases — see the master plan. **All 11 phases complete.**

```
PHASE 1  ✅ Foundation & Project Setup
PHASE 2  ✅ Authentication & Authorization
PHASE 3  ✅ User Profiles
PHASE 4  ✅ Partner Profiles & Discovery
PHASE 5  ✅ Booking System
PHASE 6  ✅ Payment System
PHASE 7  ✅ Real-Time Chat & Notifications
PHASE 8  ✅ SOS & Safety
PHASE 9  ✅ Reviews & Ratings
PHASE 10 ✅ Admin Dashboard & Management
PHASE 11 ✅ Production Hardening & Optimization
```

## API documentation

See [`backend/docs/API.md`](backend/docs/API.md) for the complete endpoint
reference, response envelope, auth model, and error-code guide.

## Testing

```bash
cd backend
npm test              # unit tests — pure logic, no database required
npm run test:integration  # full HTTP + DB flow — requires a live Postgres, see the file header
```

Unit tests cover the booking state machine (every allowed/disallowed
transition), the payment HMAC signature scheme (including tamper attempts),
and booking request validation. Integration tests exercise auth, authorization,
and the booking/payment flow end-to-end — see `tests/integration/api.test.ts`
for setup instructions.

## Caching

Redis-backed caching (partner detail views, the service-category allowlist)
falls back to an in-memory dev provider automatically when `REDIS_URL` is
unset — same pattern as the storage/payment/push provider abstractions.
Not suitable for a multi-instance production deployment without setting
`REDIS_URL`.

## Creating your first admin account

Admins are never self-registerable through the public API. To get a first
admin account in development, set `SEED_ADMIN_EMAIL` and `SEED_ADMIN_PASSWORD`
in `backend/.env`, then run `npx prisma db seed`. In production, promote an
existing verified account by updating its `role` directly, or build that
workflow out further as part of Phase 11 hardening.

## Testing payments without Razorpay

Leave `RAZORPAY_KEY_ID`/`RAZORPAY_KEY_SECRET` unset and the backend automatically
uses a dev-only mock payment provider. When you call `POST /api/payments/create-order`,
check the backend logs for a sample `paymentId` and `signature` for that order — paste
them into the "Verify (dev)" panel that appears on the booking's Pay button (or POST
them directly to `/api/payments/verify`) to simulate a completed payment end-to-end,
including genuine HMAC signature verification.
