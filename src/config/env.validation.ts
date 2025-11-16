import { z } from 'zod';

export const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'staging', 'production', 'test'])
    .default('development'),

  // Server
  PORT: z.coerce.number().int().positive().default(3001),
  BASE_URL: z.string().default('0.0.0.0'),
  APP_LOGGER_LEVEL: z.string().default('log,error,warn,debug,verbose'),

  // Swagger
  SWAGGER_USERNAME: z.string().min(1).optional().default('admin'),
  SWAGGER_PASSWORD: z.string().min(4).optional(), // required in production, optional in dev

  // Database
  DATABASE_URL: z.string().url().nonempty(),
  DIRECT_URL: z.string().url().optional(),

  // JWT
  JWT_SECRET: z.string().min(32), // required in all environments (must be at least 32 chars)
  JWT_ACCESS_EXPIRES: z.string().default('30m'),
  JWT_REFRESH_EXPIRES: z.string().default('30d'),

  // App-level
  PLATFORM_URL: z.string().url().nonempty(),
  SENDER_EMAIL: z.string().email().nonempty(),
  AUTH_EMAIL_ENABLED: z
    .preprocess((val) => {
      if (typeof val === 'string') return val.toLowerCase() === 'true';
      return !!val;
    }, z.boolean())
    .default(false),
  // comma-separated list of allowed cors origins (literal scheme://host[:port])
  ALLOWED_ORIGINS: z
    .string()
    .default('')
    .transform((s) =>
      s
        .split(',')
        .map((v) => v.trim())
        .filter(Boolean),
    ),
});

export type RawEnv = z.infer<typeof envSchema>;

/**
 * Used inside ConfigModule.forRoot({ validate })
 */
export function validateEnv(config: Record<string, unknown>) {
  const parsed = envSchema.safeParse(config);

  if (!parsed.success) {
    // Structured error output for clearer diagnostics
    const fieldErrors = parsed.error.flatten().fieldErrors;
    const formatted = Object.entries(fieldErrors).reduce((acc, [k, v]) => {
      acc[k] = v;
      return acc;
    }, {} as Record<string, any>);

    const pretty = JSON.stringify(formatted, null, 2);
    // Throwing will abort Nest boot; include structured details in console & error message
    console.error('❌ Invalid environment variables:', pretty);
    const summary = Object.entries(fieldErrors)
      .map(([k, v]) => `${k}: ${v?.join(', ')}`)
      .join('; ');
    const err = new Error(`Invalid environment variables: ${summary}`);
    // include a structured details property so callers (tests or CI) can inspect
    (err as any).details = fieldErrors;
    throw err;
  }

  const env = parsed.data;

  // EXTRA hardening checks
  if (env.NODE_ENV === 'production') {
    if (!env.JWT_SECRET || env.JWT_SECRET.length < 32) {
      throw new Error(
        'JWT_SECRET is required and must be >= 32 chars in production',
      );
    }
    if (!env.ALLOWED_ORIGINS || env.ALLOWED_ORIGINS.length === 0) {
      throw new Error(
        'ALLOWED_ORIGINS is required in production and must be a comma separated list of allowed origins',
      );
    }
  }

  return env;
}
