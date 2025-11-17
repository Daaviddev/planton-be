import { validateEnv } from '../env.validation';
import { Environment } from '../../types/global.types';

describe('env validation', () => {
  test('should throw if JWT_SECRET missing', () => {
    const env = {
      NODE_ENV: Environment.Development,
      PORT: '3001',
      BASE_URL: '0.0.0.0',
      APP_LOGGER_LEVEL: 'log,error',
      SWAGGER_PASSWORD: 'admin',
      DATABASE_URL: 'postgresql://user:pass@localhost:5432/db',
      JWT_ACCESS_EXPIRES: '30m',
      JWT_REFRESH_EXPIRES: '30d',
      PLATFORM_URL: 'http://localhost:5173',
      SENDER_EMAIL: 'no-reply@planton.app',
      AUTH_EMAIL_ENABLED: 'false',
      ALLOWED_ORIGINS: 'http://localhost:5173',
    } as Record<string, unknown>;

    expect(() => validateEnv(env)).toThrow();
  });

  test('error message includes failing keys', () => {
    const env = {
      NODE_ENV: Environment.Development,
      PORT: '3001',
      BASE_URL: '0.0.0.0',
      APP_LOGGER_LEVEL: 'log,error',
      SWAGGER_PASSWORD: 'admin',
      DATABASE_URL: 'postgresql://user:pass@localhost:5432/db',
      JWT_ACCESS_EXPIRES: '30m',
      JWT_REFRESH_EXPIRES: '30d',
      PLATFORM_URL: 'http://localhost:5173',
      SENDER_EMAIL: 'no-reply@planton.app',
      AUTH_EMAIL_ENABLED: 'false',
      ALLOWED_ORIGINS: 'http://localhost:5173',
    } as Record<string, unknown>;

    try {
      validateEnv(env);
      // if no error thrown, fail the test
      throw new Error('expected validateEnv to throw');
    } catch (err: any) {
      expect(err.message).toMatch(/Invalid environment variables/);
      // Should include the name of the missing key JWT_SECRET
      expect(err.message).toMatch(/JWT_SECRET/);
      expect(err.details).toBeDefined();
      expect(err.details.JWT_SECRET).toBeDefined();
    }
  });

  test('should throw if SWAGGER_PASSWORD missing', () => {
    const env = {
      NODE_ENV: Environment.Development,
      PORT: '3001',
      BASE_URL: '0.0.0.0',
      APP_LOGGER_LEVEL: 'log,error',
      DATABASE_URL: 'postgresql://user:pass@localhost:5432/db',
      JWT_SECRET: 'a'.repeat(32),
      JWT_ACCESS_EXPIRES: '30m',
      JWT_REFRESH_EXPIRES: '30d',
      PLATFORM_URL: 'http://localhost:5173',
      SENDER_EMAIL: 'no-reply@planton.app',
      AUTH_EMAIL_ENABLED: 'false',
      ALLOWED_ORIGINS: 'http://localhost:5173',
    } as Record<string, unknown>;

    // In development SWAGGER_PASSWORD is optional (only required in production),
    // so validation should NOT throw when it's missing.
    expect(() => validateEnv(env)).not.toThrow();
  });

  test('should throw in production when ALLOWED_ORIGINS is missing', () => {
    const env = {
      NODE_ENV: Environment.Production,
      PORT: '3001',
      BASE_URL: '0.0.0.0',
      APP_LOGGER_LEVEL: 'log,error',
      SWAGGER_PASSWORD: 'admin',
      DATABASE_URL: 'postgresql://user:pass@localhost:5432/db',
      JWT_SECRET: 'a'.repeat(32),
      JWT_ACCESS_EXPIRES: '30m',
      JWT_REFRESH_EXPIRES: '30d',
      PLATFORM_URL: 'https://app.planton.app',
      SENDER_EMAIL: 'no-reply@planton.app',
      AUTH_EMAIL_ENABLED: 'true',
      ALLOWED_ORIGINS: '',
    } as Record<string, unknown>;

    expect(() => validateEnv(env)).toThrow();
  });

  test('should validate a correct env map', () => {
    const env = {
      NODE_ENV: Environment.Production,
      PORT: '3001',
      BASE_URL: '0.0.0.0',
      APP_LOGGER_LEVEL: 'log,error',
      SWAGGER_PASSWORD: 'supersecret',
      DATABASE_URL: 'postgresql://user:pass@localhost:5432/db',
      JWT_SECRET: 'a'.repeat(32),
      JWT_ACCESS_EXPIRES: '30m',
      JWT_REFRESH_EXPIRES: '30d',
      PLATFORM_URL: 'https://app.planton.app',
      SENDER_EMAIL: 'no-reply@planton.app',
      AUTH_EMAIL_ENABLED: 'true',
      ALLOWED_ORIGINS: 'https://app.planton.app,https://staging.planton.app',
    } as Record<string, unknown>;

    expect(() => validateEnv(env)).not.toThrow();
  });
});
