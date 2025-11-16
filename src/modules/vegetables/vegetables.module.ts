import { Module } from '@nestjs/common';
import { PrismaModule } from '../../services/prisma.module';
import { VegetablesController } from './vegetables.controller';
import { VegetablesService } from './vegetables.service';
import { VegetablesRepository } from './vegetables.repository';

@Module({
  imports: [PrismaModule],
  controllers: [VegetablesController],
  providers: [
    VegetablesService,
    { provide: 'VegetablesRepository', useClass: VegetablesRepository },
  ],
  exports: [VegetablesService, 'VegetablesRepository'],
})
export class VegetablesModule {}
