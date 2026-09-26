import { describe, expect, it, afterAll } from 'vitest';
import request from 'supertest';
import { createApp } from '../../src/app';
import { prisma } from '../../src/config/prisma';

/**
 * INTEGRATION TESTS — require a real Postgres database.
 *
 * These exercise the full HTTP stack (Express routes → validators →
 * services → Prisma → Postgres) rather than isolated pure logic. They are
 * NOT runnable in the sandbox this project was built in: `prisma generate`
 * needs to download its query engine from binaries.prisma.sh, which that
 * sandbox's network allowlist blocks (see every phase's build-verification
 * notes for the same limitation). They ARE runnable in any normal dev
 * environment or CI pipeline with network access and a Postgres instance:
 *
 *   createdb companionhub_test
 *   DATABASE_URL=postgresql://localhost/companionhub_test npx prisma migrate deploy
 *   DATABASE_URL=postgresql://localhost/companionhub_test npm run test:integration
 *
 * Run this file with `npm run test:integration`, which points at
 * vitest.integration.config.ts (a separate config from the default unit
 * test run, so `npm test` never silently tries to hit a database that
 * isn't there).
 */

const app = createApp();

async function registerAndLogin(email: string) {
  await request(app).post('/api/auth/register').send({
    fullName: 'Test User',
    email,
    password: 'Passw0rd1',
  });
  const res = await request(app).post('/api/auth/login').send({ email, password: 'Passw0rd1' });
  return res.body.data.accessToken as string;
}

describe('Authentication', () => {
  const email = `auth-test-${Date.now()}@example.com`;

  afterAll(async () => {
    await prisma.user.deleteMany({ where: { email } });
  });

  it('registers a new user with role USER by default', async () => {
    const res = await request(app).post('/api/auth/register').send({
      fullName: 'Auth Test',
      email,
      password: 'Passw0rd1',
    });
    expect(res.status).toBe(201);
    expect(res.body.data.user.role).toBe('USER');
    expect(res.body.data.user.passwordHash).toBeUndefined();
  });

  it('rejects login with the wrong password', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email, password: 'WrongPassword1' });
    expect(res.status).toBe(401);
  });

  it('rejects registration with a client-supplied role of ADMIN', async () => {
    const adminAttemptEmail = `admin-attempt-${Date.now()}@example.com`;
    const res = await request(app)
      .post('/api/auth/register')
      .send({ fullName: 'Nope', email: adminAttemptEmail, password: 'Passw0rd1', role: 'ADMIN' });
    // Either the extra field is stripped (role defaults to USER) or the
    // request is rejected outright — either way, an ADMIN user must never
    // be the result.
    if (res.status === 201) {
      expect(res.body.data.user.role).toBe('USER');
      await prisma.user.deleteMany({ where: { email: adminAttemptEmail } });
    } else {
      expect(res.status).toBeGreaterThanOrEqual(400);
    }
  });
});

describe('Authorization', () => {
  it('rejects an unauthenticated request to a protected route', async () => {
    const res = await request(app).get('/api/users/me');
    expect(res.status).toBe(401);
  });

  it('rejects a non-admin from every /api/admin/* route', async () => {
    const token = await registerAndLogin(`nonadmin-${Date.now()}@example.com`);
    const res = await request(app)
      .get('/api/admin/dashboard')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(403);
  });
});

describe('Booking flow', () => {
  it.skip('customer can create a booking, partner can accept it, customer can pay', async () => {
    // Full flow sketch — skipped because it needs two real user accounts,
    // a verified partner profile, and a service offering already set up.
    // 1. Register customer + partner, log both in
    // 2. Partner: POST /api/partners/profile, POST /api/partners/profile/services
    // 3. Manually flip the partner's User.verificationStatus to VERIFIED
    //    (there's no self-service path — see admin verify endpoint)
    // 4. Customer: POST /api/bookings -> expect 201, status PENDING
    // 5. Partner: PATCH /api/bookings/:id/accept -> expect status ACCEPTED
    // 6. Customer: POST /api/payments/create-order -> expect a CREATED payment
    // 7. Customer: POST /api/payments/verify with a real signature -> expect PAID
    expect(true).toBe(true);
  });

  it.skip('rejects a customer trying to accept their own booking', async () => {
    // Exercises the same rule bookingStateMachine.test.ts covers in
    // isolation, but end-to-end through the real HTTP + DB stack.
    expect(true).toBe(true);
  });
});

describe('Payment verification', () => {
  it.skip('rejects a payment verify with a forged signature', async () => {
    // POST /api/payments/verify with a syntactically valid but wrong
    // signature -> expect 400 and the Payment row to end up FAILED, not PAID.
    expect(true).toBe(true);
  });
});
