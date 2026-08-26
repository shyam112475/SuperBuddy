# CompanionHub API Reference

Base URL: `http://localhost:4000/api` (dev) — set via `PUBLIC_API_URL`.

## Conventions

**Response envelope** — every endpoint returns one of these two shapes:

```json
// Success
{ "success": true, "message": "...", "data": { ... } }

// Error
{ "success": false, "message": "...", "errors": [...], "statusCode": 400 }
```

**Auth** — protected routes require `Authorization: Bearer <accessToken>`. The
access token is short-lived (15 min default); refresh it via `POST
/auth/refresh`, which reads the httpOnly `refreshToken` cookie (never sent in
the body or a header).

**Pagination** — list endpoints accept `page` (default 1) and `limit`
(default varies, capped per-endpoint) and return:

```json
{ "items": [...], "pagination": { "page": 1, "limit": 20, "total": 57, "totalPages": 3 } }
```

**Rate limits** — a global limiter (300 req/min) applies to all routes except
`/sos`, which is never throttled. Login/register/forgot-password are
additionally limited to 10 attempts per 15 minutes. Report and review
submission are limited to 30/min.

---

## Health

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/health` | none | Liveness check |

## Auth (`/auth`)

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/auth/register` | none | Create account (role always defaults to `USER`) |
| POST | `/auth/login` | none | Returns access token + sets refresh cookie |
| POST | `/auth/refresh` | refresh cookie | Rotates the refresh token, returns a new access token |
| POST | `/auth/logout` | refresh cookie | Revokes the current refresh token |
| POST | `/auth/forgot-password` | none | Always returns success (no user enumeration) |
| POST | `/auth/reset-password` | reset token | Also revokes all existing sessions |
| GET | `/auth/me` | required | Current session's user |

## Users (`/users`)

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/users/me` | required | Full own-profile view |
| PUT | `/users/me` | required | Update name/phone/gender/DOB/emergency contact |
| DELETE | `/users/me` | required | Soft-delete (deactivate) own account |
| POST | `/users/me/profile-image` | required | Multipart upload, `image` field, ≤5MB, JPEG/PNG/WebP |
| PATCH | `/users/me/password` | required | Requires current password; revokes all sessions on success |

## Partners (`/partners`)

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/partners/categories` | none | Active service-category allowlist |
| GET | `/partners` | none | Discovery search — `page, limit, city, gender, serviceCategory, dayOfWeek, search` |
| GET | `/partners/:id` | optional | Public detail. Non-owner sees 404 unless verified |
| GET | `/partners/:id/reviews` | none | Paginated reviews for a partner |
| GET | `/partners/profile` | required | Own partner profile |
| POST | `/partners/profile` | required | Create profile — promotes caller's role to `PARTNER` |
| PUT | `/partners/profile` | PARTNER | Update headline/bio/city/area/accepting-bookings |
| POST | `/partners/profile/services` | PARTNER | Add an offering (category must be from the allowlist) |
| DELETE | `/partners/profile/services/:offeringId` | PARTNER | Remove an offering |
| PUT | `/partners/profile/availability` | PARTNER | Replace the full weekly schedule |

## Bookings (`/bookings`)

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/bookings` | required | Create a booking request |
| GET | `/bookings` | required | List own — `as=customer\|partner, status, page, limit` |
| GET | `/bookings/:id` | required | Detail (participant only) |
| PATCH | `/bookings/:id/accept` | PARTNER (owner) | `PENDING → ACCEPTED` |
| PATCH | `/bookings/:id/reject` | PARTNER (owner) | `PENDING → REJECTED`, body: `{ reason? }` |
| PATCH | `/bookings/:id/cancel` | participant | `PENDING/ACCEPTED → CANCELLED`, body: `{ reason? }` |
| PATCH | `/bookings/:id/complete` | PARTNER (owner) | `ACCEPTED → COMPLETED` |

State machine: `PENDING → {ACCEPTED, REJECTED, CANCELLED(customer only)}`,
`ACCEPTED → {COMPLETED, CANCELLED(either party)}`. No other transitions exist.

## Payments (`/payments`)

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/payments/create-order` | required | Body: `{ bookingId }`. Booking must be `ACCEPTED` |
| POST | `/payments/verify` | required | Body: `{ razorpayOrderId, razorpayPaymentId, razorpaySignature }` |
| GET | `/payments/history` | required | Own payment history |
| GET | `/payments/:id` | required | Own payment detail |

Server-side HMAC signature verification is the only source of truth for a
successful payment — the frontend's "success" callback is never trusted.

## Chat (`/chat`)

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/chat/:bookingId/messages` | participant | Paginated history, oldest-first |
| POST | `/chat/:bookingId/messages` | participant | Send a message |
| PATCH | `/chat/:bookingId/read` | participant | Mark the other party's messages read |

**Socket.IO** (same origin, JWT via `auth.token` in the handshake):
`message:send` / `message:receive`, `message:read`, `user:online` /
`user:offline`, `typing:start` / `typing:stop`.

## Notifications (`/notifications`)

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/notifications` | required | `page, limit, unreadOnly` |
| PATCH | `/notifications/:id/read` | required | Mark one read |
| PATCH | `/notifications/read-all` | required | Mark all read |

Live delivery via the `notification:new` socket event when connected.

## SOS (`/sos`)

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/sos` | required | Body: `{ bookingId?, latitude, longitude, description? }` |
| GET | `/sos/:id` | alerter, other booking participant, or admin | Location is never visible to anyone else |
| PATCH | `/sos/:id/resolve` | alerter or admin | Body: `{ status: RESOLVED\|FALSE_ALARM, note? }` |

Never rate-limited. Notifies all admins and, if the alert is tied to a
booking, the other participant.

## Reports (`/reports`)

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/reports` | required | Body: `{ reportedUserId, bookingId?, reason, description }` |
| GET | `/reports/mine` | required | Reports the caller has filed |

The reported user is never notified (avoids enabling retaliation). Admin
review happens under `/admin/reports`.

## Blocks (`/blocks`)

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/blocks` | required | Body: `{ blockedUserId }` |
| DELETE | `/blocks/:blockedUserId` | required | Unblock |
| GET | `/blocks` | required | Own block list |

A block prevents new bookings and new chat messages in either direction;
existing chat history remains visible.

## Reviews (`/reviews`)

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/reviews` | required | Body: `{ bookingId, rating (1-5), comment? }` |

Only the customer on a `COMPLETED` booking may review it, once. Updates the
partner's cached `averageRating`/`reviewCount` atomically.

## Admin (`/admin`) — every route requires `role: ADMIN`

| Method | Path | Description |
|---|---|---|
| GET | `/admin/dashboard` | Platform-wide stats |
| GET | `/admin/users` | `page, limit, search, role, verificationStatus, isActive` |
| GET | `/admin/partners` | `page, limit, verificationStatus, city` (includes contact info) |
| PATCH | `/admin/partners/:id/verify` | Body: `{ status: VERIFIED\|REJECTED, note? }` |
| GET | `/admin/bookings` | `page, limit, status` |
| GET | `/admin/payments` | `page, limit, status` |
| GET | `/admin/sos` | `page, limit, status` |
| GET | `/admin/reports` | `page, limit, status` |
| PATCH | `/admin/reports/:id/status` | Body: `{ status: UNDER_REVIEW\|RESOLVED\|DISMISSED, note? }` |

There is no in-app way to promote a user to `ADMIN` — see the README's
"Creating your first admin account" section.

---

## Error codes you'll actually see

| Status | Meaning |
|---|---|
| 400 | Validation failed, or a business rule was violated (e.g. booking not `ACCEPTED` yet) |
| 401 | Missing/invalid/expired access token |
| 403 | Authenticated, but wrong role (e.g. non-admin hitting `/admin/*`) |
| 404 | Not found — **also used instead of 403** where returning 403 would confirm a resource's existence to someone with no relationship to it (e.g. viewing someone else's booking) |
| 409 | Conflict — duplicate email/phone, double-booking a review, already-paid booking |
| 429 | Rate limited |
| 500 | Unexpected server error (never includes a stack trace outside development) |
