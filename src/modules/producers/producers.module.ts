import { Module } from '@nestjs/common';
import { PrismaModule } from '../../services/prisma.module';
import { ProducersController } from './producers.controller';
import { ProducersService } from './producers.service';
import { ProducersRepository } from './producers.repository';
import { PRODUCERS_REPOSITORY } from '../../domain/contracts';

@Module({
  imports: [PrismaModule],
  controllers: [ProducersController],
  providers: [
    ProducersService,
    { provide: PRODUCERS_REPOSITORY, useClass: ProducersRepository },
  ],
  exports: [ProducersService, PRODUCERS_REPOSITORY],
})
export class ProducersModule {}
