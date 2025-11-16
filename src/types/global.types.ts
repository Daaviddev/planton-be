import { type LogLevel } from '@nestjs/common';

export enum Environment {
  Development = 'development',
  Staging = 'staging',
  Production = 'production',
  Test = 'test',
}

export interface AppConfig {
  port: number;
  baseUrl: string;
  loggerLevel: LogLevel[];
  env: Environment;
  version: string;
  platformUrl: string;
  senderEmail: string;
  allowedOrigins: string[];
}

export interface EnvironmentVariables {
  app: AppConfig;
  swagger: {
    password: string;
  };
  jwt: {
    secret: string;
    expiresIn: string;
    refreshExpiresIn: string;
  };
  auth: {
    emailLoginEnabled: boolean;
  };
  NODE_ENV: Environment;
}
