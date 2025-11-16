import { registerAs } from '@nestjs/config';

export default registerAs('auth', () => ({
  emailLoginEnabled:
    (process.env.AUTH_EMAIL_ENABLED ?? 'false').toLowerCase() === 'true',
}));
