import { registerAs } from '@nestjs/config';
import * as path from 'path';

import { Environment } from '../types/global.types';

function parseLogLevel(level: string | undefined): string[] {
  if (!level) {
    return ['log', 'error', 'warn', 'debug', 'verbose'];
  }

  if (level === 'none') {
    return [];
  }

  return level.split(',');
}

function getPlatformUrl(env: string): string {
  switch (env) {
    case Environment.Production:
      return 'https://app.hyper-gateway.app';
    case Environment.Staging:
      return 'https://app.staging.hyper-gateway.app';
    case Environment.Development:
    default:
      return 'http://localhost:5173';
  }
}

function getSenderEmail(env: string): string {
  return env === Environment.Development || env === Environment.Staging
    ? 'no-reply@staging.hyper-gateway.app'
    : 'no-reply@hyper-gateway.app';
}

export default registerAs('app', () => ({
  port: process.env.PORT || 3001,
  baseUrl: process.env.BASE_URL || '0.0.0.0',
  loggerLevel: parseLogLevel(
    process.env.APP_LOGGER_LEVEL || 'log,error,warn,debug,verbose',
  ),
  env: process.env.NODE_ENV || Environment.Development,
  // eslint-disable-next-line global-require,@typescript-eslint/no-var-requires
  version: require(path.join(process.cwd(), 'package.json')).version,
  platformUrl: process.env.PLATFORM_URL || getPlatformUrl(process.env.NODE_ENV),
  senderEmail: process.env.SENDER_EMAIL || getSenderEmail(process.env.NODE_ENV),
}));
