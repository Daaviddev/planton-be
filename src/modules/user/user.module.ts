import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserRepository } from './user.repository';
import { PrismaModule } from '../../services/prisma.module';
import { ProducersModule } from '../producers/producers.module';

@Module({
  imports: [PrismaModule, ProducersModule],
  controllers: [UserController],
  exports: [UserService, 'UserRepository'],
  providers: [
    UserService,
    {
      provide: 'UserRepository',
      useClass: UserRepository,
    },
  ],
})
export class UserModule {}
