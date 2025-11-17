import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserRepository } from './user.repository';
import { PrismaModule } from '../../services/prisma.module';
import { ProducersModule } from '../producers/producers.module';
import { USERS_REPOSITORY } from '../../domain/contracts';

@Module({
  imports: [PrismaModule, ProducersModule],
  controllers: [UserController],
  exports: [UserService, USERS_REPOSITORY],
  providers: [
    UserService,
    {
      provide: USERS_REPOSITORY,
      useClass: UserRepository,
    },
  ],
})
export class UserModule {}
