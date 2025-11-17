import { Module } from '@nestjs/common';
import { PrismaModule } from '../../services/prisma.module';
import { VegetablesController } from './vegetables.controller';
import { VegetablesService } from './vegetables.service';
import { VegetablesRepository } from './vegetables.repository';
import { VEGETABLES_REPOSITORY } from '../../domain/contracts';

@Module({
  imports: [PrismaModule],
  controllers: [VegetablesController],
  providers: [
    VegetablesService,
    { provide: VEGETABLES_REPOSITORY, useClass: VegetablesRepository },
  ],
  exports: [VegetablesService, VEGETABLES_REPOSITORY],
})
export class VegetablesModule {}
