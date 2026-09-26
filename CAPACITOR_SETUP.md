# SuperBuddy — Capacitor Android setup

This repository now keeps the existing React web frontend and Express backend intact while adding a Capacitor path for Android. The old React Native `mobile/` project is intentionally not included in this package.

## 1. Install frontend dependencies

From `frontend/`:

```bash
npm install
```

Use `npm install` (not `npm ci`) once after adding the Capacitor dependencies so `package-lock.json` can be regenerated for your machine.

## 2. Build the web app

```bash
npm run build
```

## 3. Create the Android project

```bash
npm run cap:add:android
```

This creates `frontend/android/` locally.

## 4. Sync web assets and Capacitor plugins

```bash
npm run cap:sync
```

## 5. Open Android Studio

```bash
npm run cap:open:android
```

## API configuration

For an Android emulator, use:

```env
VITE_API_URL=http://10.0.2.2:4000/api
```

For a physical Android phone, use the computer's LAN IP:

```env
VITE_API_URL=http://192.168.x.x:4000/api
```

For production, use the HTTPS Render API URL.

The backend now accepts the Capacitor WebView origins (`http://localhost` and `capacitor://localhost`) in addition to `FRONTEND_URL`, and Socket.IO uses the same allowlist.

## Authentication note

The backend already returns a rotated `refreshToken` in the login/register/refresh response for mobile clients. The frontend now persists that token and sends it explicitly to `/auth/refresh`, while the normal browser cookie flow remains supported.
