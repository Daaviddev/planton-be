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
}

export interface EnvironmentVariables {
  app: AppConfig;
  swagger: {
    password: string;
  };
  NODE_ENV: Environment;
}
