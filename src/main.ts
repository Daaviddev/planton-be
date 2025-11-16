import 'reflect-metadata';

/**
 * Hyper-Dyper Gateway Backend
 *
 * Main entry point for the NestJS API server
 * Handles authentication, profiles, and order management
 */
import { AccessExceptionFilter } from '@filters/access-exception.filter';
import { AllExceptionsFilter } from '@filters/all-exception.filter';
import { BadRequestExceptionFilter } from '@filters/bad-request-exception.filter';
import { NotFoundExceptionFilter } from '@filters/not-found-exception.filter';
import { ThrottlerExceptionsFilter } from '@filters/throttler-exception.filter';
import { ValidationExceptionFilter } from '@filters/validation-exception.filter';
import validationExceptionFactory from '@filters/validation-exception-factory';
import { TransformInterceptor } from '@interceptors/transform.interceptor';
import {
  type INestApplication,
  Logger,
  RequestMethod,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import {
  DocumentBuilder,
  type OpenAPIObject,
  SwaggerModule,
} from '@nestjs/swagger';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import basicAuth from 'express-basic-auth';
import helmet from 'helmet';
import { API_PREFIX, API_VERSION, DOCS_PATH } from './constants/api.constants';

import { AppModule } from './modules/app/app.module';
import { Environment, type EnvironmentVariables } from './types/global.types';

async function bootstrap() {
  // Bootstrap info: use appConfig for environment values
  let isDev = false;

  const app: INestApplication = await NestFactory.create(AppModule, {
    rawBody: true,
  });

  const configService: ConfigService<EnvironmentVariables, true> =
    app.get(ConfigService);
  const appConfig = configService.get('app', { infer: true });
  const swaggerConfig = configService.get('swagger');
  isDev = appConfig.env === Environment.Development;

  // Security middleware
  app.use(
    helmet({
      crossOriginEmbedderPolicy: false,
      contentSecurityPolicy: {
        directives: {
          imgSrc: [
            `'self'`,
            'data:',
            'apollo-server-landing-page.cdn.apollographql.com',
          ],
          scriptSrc: [`'self'`, `https: 'unsafe-inline'`],
          manifestSrc: [
            `'self'`,
            'apollo-server-landing-page.cdn.apollographql.com',
          ],
          frameSrc: [`'self'`, 'sandbox.embed.apollographql.com'],
        },
      },
    }),
  );

  // CORS configuration
  const corsOptions = isDev
    ? {
        credentials: true,
        origin: true, // Allow all origins in development
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        allowedHeaders: [
          'Content-Type',
          'Authorization',
          'Accept',
          'Origin',
          'X-Requested-With',
        ],
      }
    : {
        credentials: true,
        origin: (
          origin: string,
          callback: (err: Error | null, allow?: boolean) => void,
        ) => {
          // Handle requests with no origin
          if (!origin) return callback(null, false);

          const allowedOrigins = appConfig.allowedOrigins || [];
          const allowedPatterns = allowedOrigins.map((patternStr) => {
            try {
              return new RegExp(patternStr);
            } catch {
              // If not a valid regex, escape the string for exact match
              return new RegExp(
                `^${patternStr.replace(/[.*+?^${}()|[\\]\\]/g, '\\$&')}$`,
                'i',
              );
            }
          });

          const isAllowed = allowedPatterns.some((pattern) =>
            pattern.test(origin),
          );
          callback(
            isAllowed ? null : new Error('Not allowed by CORS'),
            isAllowed,
          );
        },
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        allowedHeaders: [
          'Content-Type',
          'Authorization',
          'Accept',
          'Origin',
          'X-Requested-With',
        ],
      };

  Logger.log(`Environment: ${appConfig.env}`);
  Logger.log(`isDev: ${isDev}`);

  if (isDev) {
    Logger.log('Enabling CORS for development (all origins allowed)');
  } else {
    Logger.log('Enabling CORS for production with restricted origins');
  }
  app.enableCors(corsOptions);

  app.use(cookieParser());

  // Compression
  app.use(compression());

  // ---- Global API prefix (/api) ----
  app.setGlobalPrefix(API_PREFIX, {
    exclude: [{ path: '/', method: RequestMethod.GET }],
  });

  // ---- URI versioning => /api/v1 ----
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: API_VERSION,
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      skipMissingProperties: false,
      exceptionFactory: validationExceptionFactory,
    }),
  );

  // Logger configuration
  app.useLogger(appConfig.loggerLevel);

  // Swagger API Documentation with Basic Auth
  app.use(
    [`/${DOCS_PATH}`],
    basicAuth({
      challenge: true,
      users: {
        admin: swaggerConfig.password,
      },
    }),
  );

  const swaggerOptions: Omit<OpenAPIObject, 'paths'> = new DocumentBuilder()
    .setTitle('Api v1')
    .setDescription('Planton Backend')
    .setVersion('1.0')
    .addBearerAuth({ in: 'header', type: 'http' })
    .addTag('auth', 'Authentication endpoints')
    .addTag('profile', 'User profile management')
    .addTag('orders', 'Trading order management')
    .addTag('chat-sessions', 'Chat sessions management')
    .build();

  const document: OpenAPIObject = SwaggerModule.createDocument(
    app,
    swaggerOptions,
  );

  SwaggerModule.setup(DOCS_PATH, app, document, {
    swaggerOptions: {
      // If set to true, it persists authorization data,
      // and it would not be lost on browser close/refresh
      persistAuthorization: true,
    },
  });

  app.useGlobalInterceptors(new TransformInterceptor());

  // Global exception filters
  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(
    new AllExceptionsFilter(),
    new AccessExceptionFilter(httpAdapter),
    new NotFoundExceptionFilter(),
    new BadRequestExceptionFilter(),
    new ValidationExceptionFilter(),
    new ThrottlerExceptionsFilter(),
  );

  // Start server
  await app.listen(appConfig.port, appConfig.baseUrl);

  return {
    port: appConfig.port,
    env: appConfig.env,
    baseUrl: appConfig.baseUrl,
  };
}

bootstrap().then((appConfig) => {
  Logger.log(
    `🚀 PlantOn Backend running on port ${appConfig.baseUrl}:${appConfig.port}`,
  );
  Logger.log(
    `📖 API Docs: http://${appConfig.baseUrl}:${appConfig.port}/${DOCS_PATH}`,
  );
});
