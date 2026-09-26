import 'dotenv/config';
import { z } from 'zod';

/**
 * Centralized, validated environment configuration.
 * The app refuses to start if required variables are missing/invalid,
 * so misconfiguration fails fast instead of surfacing as a runtime bug later.
 */
const envSchema = z
  .object({
    NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
    PORT: z.coerce.number().int().positive().default(4000),
    FRONTEND_URL: z.string().url().default('http://localhost:5173'),
    PUBLIC_API_URL: z.string().url().default('http://localhost:4000/api'),
    DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),

    // Required as of Phase 2 (Authentication).
    JWT_ACCESS_SECRET: z.string().min(16, 'JWT_ACCESS_SECRET must be at least 16 characters'),
    JWT_REFRESH_SECRET: z.string().min(16, 'JWT_REFRESH_SECRET must be at least 16 characters'),
    JWT_ACCESS_EXPIRES_IN: z.string().default('15m'),
    JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),
    // Days form of the refresh expiry, used for DB expiresAt calculation.
    JWT_REFRESH_EXPIRES_IN_DAYS: z.coerce.number().int().positive().default(7),

    RAZORPAY_KEY_ID: z.string().optional(),
    RAZORPAY_KEY_SECRET: z.string().optional(),
    REDIS_URL: z.string().optional(),
    FIREBASE_PROJECT_ID: z.string().optional(),
    FIREBASE_CLIENT_EMAIL: z.string().optional(),
    FIREBASE_PRIVATE_KEY: z.string().optional(),
    CLOUDINARY_CLOUD_NAME: z.string().optional(),
    CLOUDINARY_API_KEY: z.string().optional(),
    CLOUDINARY_API_SECRET: z.string().optional(),
    SEED_ADMIN_EMAIL: z.string().optional(),
    SEED_ADMIN_PASSWORD: z.string().optional(),
  })
  // The placeholder values shipped in .env.example are fine for local dev —
  // this only fires in production, catching the specific mistake of
  // deploying with those placeholders copied verbatim instead of real
  // generated secrets.
  .superRefine((data, ctx) => {
    if (data.NODE_ENV !== 'production') return;

    const placeholderSecrets = new Set([
      'change_me_to_a_long_random_string',
      'change_me_to_a_different_long_random_string',
      'dev_only_access_secret_change_me_1234567890',
      'dev_only_refresh_secret_change_me_0987654321',
    ]);

    if (placeholderSecrets.has(data.JWT_ACCESS_SECRET)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['JWT_ACCESS_SECRET'],
        message: 'JWT_ACCESS_SECRET is still a placeholder value — generate a real secret before deploying to production',
      });
    }
    if (placeholderSecrets.has(data.JWT_REFRESH_SECRET)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['JWT_REFRESH_SECRET'],
        message: 'JWT_REFRESH_SECRET is still a placeholder value — generate a real secret before deploying to production',
      });
    }
    if (data.JWT_ACCESS_SECRET === data.JWT_REFRESH_SECRET) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['JWT_REFRESH_SECRET'],
        message: 'JWT_ACCESS_SECRET and JWT_REFRESH_SECRET must be different values',
      });
    }
  });

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  // eslint-disable-next-line no-console
  console.error('❌ Invalid environment configuration:', parsed.error.flatten().fieldErrors);
  process.exit(1);
}

export const env = parsed.data;
export const isProduction = env.NODE_ENV === 'production';
