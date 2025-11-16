import { registerAs } from '@nestjs/config';
import * as path from 'path';

import { Environment } from '../types/global.types';

function parseLogLevel(level: string | undefined): string[] {
  if (!level) return ['log', 'error', 'warn', 'debug', 'verbose'];
  if (level === 'none') return [];
  return level.split(',');
}

export default registerAs('app', () => ({
  port: Number(process.env.PORT),
  baseUrl: process.env.BASE_URL,
  loggerLevel: parseLogLevel(process.env.APP_LOGGER_LEVEL),
  env: process.env.NODE_ENV as Environment,
  // eslint-disable-next-line global-require,@typescript-eslint/no-var-requires
  version: require(path.join(process.cwd(), 'package.json')).version,
  platformUrl: process.env.PLATFORM_URL,
  senderEmail: process.env.SENDER_EMAIL,
  allowedOrigins: (process.env.ALLOWED_ORIGINS || '')
    .split(',')
    .map((v) => v.trim())
    .filter(Boolean),
}));
