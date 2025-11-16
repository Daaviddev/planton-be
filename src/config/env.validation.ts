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
  SWAGGER_PASSWORD: z.string().default('admin'),

  // Database
  DATABASE_URL: z.string().url().nonempty(),
  DIRECT_URL: z.string().url().optional(),

  // JWT
  JWT_SECRET: z.string().min(32).optional(), // required in prod (checked below)
  JWT_ACCESS_EXPIRES: z.string().default('30m'),
  JWT_REFRESH_EXPIRES: z.string().default('30d'),
});

export type RawEnv = z.infer<typeof envSchema>;

/**
 * Used inside ConfigModule.forRoot({ validate })
 */
export function validateEnv(config: Record<string, unknown>) {
  const parsed = envSchema.safeParse(config);

  if (!parsed.success) {
    // Throwing will abort Nest boot with a readable error
    console.error(
      '❌ Invalid environment variables:',
      parsed.error.flatten().fieldErrors,
    );
    throw new Error('Invalid environment variables');
  }

  const env = parsed.data;

  // Extra production hardening
  if (env.NODE_ENV === 'production' && !env.JWT_SECRET) {
    throw new Error('JWT_SECRET is required in production');
  }

  return env;
}
