import { Module } from '@nestjs/common';
import { PrismaModule } from '../../services/prisma.module';
import { ProducersController } from './producers.controller';
import { ProducersService } from './producers.service';
import { ProducersRepository } from './producers.repository';

@Module({
  imports: [PrismaModule],
  controllers: [ProducersController],
  providers: [
    ProducersService,
    { provide: 'ProducersRepository', useClass: ProducersRepository },
  ],
  exports: [ProducersService, 'ProducersRepository'],
})
export class ProducersModule {}
