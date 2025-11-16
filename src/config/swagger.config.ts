import { registerAs } from '@nestjs/config';

export default registerAs('swagger', () => ({
  // Username for Swagger basic auth; default to 'admin' for local/dev convenience
  username: process.env.SWAGGER_USERNAME || 'admin',
  // Password should be provided via env; no default in production
  password: process.env.SWAGGER_PASSWORD,
}));
