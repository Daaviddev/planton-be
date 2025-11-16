import { registerAs } from '@nestjs/config';

export default registerAs('jwt', () => ({
  secret:
    process.env.JWT_SECRET ||
    'hyper_dyper_jwt_secret_57de048c4cf1bb6af56b32c9ba586063fed9af4c25545fb3c13b0e681a057627',
  expiresIn: process.env.JWT_ACCESS_EXPIRES || '30m',
  refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES || '30d',
}));
