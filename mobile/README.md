# CompanionHub Mobile

React Native app (Expo, TypeScript, Expo Router) for iOS and Android,
talking to the same backend as the web app. See [`DESIGN.md`](DESIGN.md)
for the visual design system.

## Getting Started

```bash
cp .env.example .env
# edit .env — see the comments inside for the right API URL for your setup
# (simulator vs emulator vs physical device all need different values)
npm install
npx expo start
```

Scan the QR code with Expo Go, or press `i` / `a` to launch a simulator/emulator.

## Architecture notes

- **Routing**: file-based via Expo Router. `(auth)` and `(app)` are route
  groups — `(app)/_layout.tsx` redirects to `(auth)/login` if there's no
  session, `(auth)/_layout.tsx` redirects the other way if there is one.
- **Auth**: the access token lives in memory only (`services/tokenStore.ts`).
  The refresh token is persisted in the OS-encrypted keystore via
  `expo-secure-store` (`services/secureStorage.ts`) and sent explicitly in
  the request body on `/auth/refresh` — **not** via cookie. React Native's
  networking stack doesn't reliably persist httpOnly cookies across app
  restarts the way a browser does, so the backend was given a small,
  backward-compatible addition (`backend/src/controllers/auth.controller.ts`)
  to accept the refresh token either via cookie (web) or request body
  (mobile). See `backend/docs/API.md` for the exact contract.
- **State**: Zustand for session state (`store/authStore.ts`), TanStack
  Query for all server state — same pattern as the web app.
- **Design system**: `src/components/ui/` — see `DESIGN.md`.

## Roadmap

```
M-PHASE 1  ✅ Foundation & Project Setup
M-PHASE 2  ✅ Authentication
M-PHASE 3  ⬜ User Profile
M-PHASE 4  ⬜ Partner Discovery & Profiles
M-PHASE 5  ⬜ Booking System
M-PHASE 6  ⬜ Payments
M-PHASE 7  ⬜ Chat & Notifications
M-PHASE 8  ⬜ SOS & Safety
M-PHASE 9  ⬜ Reviews & Ratings
```

Admin dashboard stays web-only — not a mobile use case.

## Known limitations (Phase 2)

- App icon/splash are still Expo's placeholder graphics (same note as Phase 1).
- Password-reset emails link to the **web** reset page by default — the
  backend's email template isn't yet aware of the mobile app's
  `companionhub://` deep link scheme. `(auth)/reset-password.tsx` works
  correctly if opened with a `?token=` param (e.g. once the email template
  is updated, or for manual testing), it just isn't reachable from the
  email link yet. Wiring that up means editing the backend's email
  template to detect mobile vs web and isn't something this phase touches.
- Not runnable end-to-end in this sandbox — verified via `npx tsc --noEmit`
  (zero errors) and a full `npx expo export` production bundle for both
  platforms (both succeed).
