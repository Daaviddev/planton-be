import { Module } from '@nestjs/common';
import { PrismaModule } from '../../services/prisma.module';
import { GardensController } from './gardens.controller';
import { GardensService } from './gardens.service';
import { GardensRepository } from './gardens.repository';
import { GardenTemplatesRepository } from './garden-templates.repository';
import { ActivitiesModule } from '../activities/activities.module';
import { PlotsModule } from '../plots/plots.module';
import { PlotsRepository } from '../plots/plots.repository';

@Module({
  imports: [PrismaModule, ActivitiesModule, PlotsModule],
  controllers: [GardensController],
  providers: [
    GardensService,
    { provide: 'GardensRepository', useClass: GardensRepository },
    {
      provide: 'GardenTemplatesRepository',
      useClass: GardenTemplatesRepository,
    },
    { provide: 'PlotsRepository', useClass: PlotsRepository },
  ],
  exports: [GardensService, 'GardensRepository'],
})
export class GardensModule {}
