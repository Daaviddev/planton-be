import { registerAs } from '@nestjs/config';

export default registerAs('swagger', () => {
  // Username for Swagger basic auth; default to 'admin' for local/dev convenience
  const username = process.env.SWAGGER_USERNAME || 'admin';
  // Password should be provided via env; no default in production
  const password = process.env.SWAGGER_PASSWORD;
  if (
    process.env.NODE_ENV === 'production' &&
    (typeof password !== 'string' || password.length === 0)
  ) {
    throw new Error(
      'SWAGGER_PASSWORD environment variable must be set in production.'
    );
  }
  return {
    username,
    password,
  };
});
