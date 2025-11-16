/**
 * Main Application Module
 * Configures all modules, database, authentication, and middleware
 */

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from '../user/user.module';
import appConfig from '@config/app.config';
import swaggerConfig from '@config/swagger.config';
import { validateEnv } from '@config/env.validation';
import { ProtectedController } from './protected.controller';
import { AppController } from './app.controller';
import { GardensModule } from '../gardens/gardens.module';
import { PlotsModule } from '../plots/plots.module';
import { ActivitiesModule } from '../activities/activities.module';
import { ProducersModule } from '../producers/producers.module';
import { DeliveryAddressesModule } from '../delivery-addresses/delivery-addresses.module';
import { VegetablesModule } from '../vegetables/vegetables.module';
import { GardenTemplatesModule } from '../garden-templates/garden-templates.module';
import { ChatMessagesModule } from '../chat-messages/chat-messages.module';
import { ChatSessionsModule } from '@modules/chat-sessions/chat-sessions.module';
// import { AuthModule } from '../auth/auth.module';

@Module({
  controllers: [ProtectedController, AppController],
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [`.env.${process.env.NODE_ENV || 'development'}`],
      load: [appConfig, swaggerConfig],
      validate: validateEnv,
    }),

    // Feature modules
    // AuthModule,
    UserModule,
    GardensModule,
    PlotsModule,
    ActivitiesModule,
    ProducersModule,
    DeliveryAddressesModule,
    VegetablesModule,
    GardenTemplatesModule,
    ChatMessagesModule,
    ChatSessionsModule,
  ],
  providers: [],
})
export class AppModule {}
