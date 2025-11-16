import { Module } from '@nestjs/common';
import { PrismaModule } from '../../services/prisma.module';
import { GardenTemplatesController } from './garden-templates.controller';
import { GardenTemplatesService } from './garden-templates.service';
import { GardenTemplatesRepository } from './garden-templates.repository';
import { GardensRepository } from '../gardens/gardens.repository';
import { PlotsRepository } from '../plots/plots.repository';
import { ActivitiesModule } from '../activities/activities.module';

@Module({
  imports: [PrismaModule, ActivitiesModule],
  controllers: [GardenTemplatesController],
  providers: [
    GardenTemplatesService,
    {
      provide: 'GardenTemplatesRepository',
      useClass: GardenTemplatesRepository,
    },
    { provide: 'GardensRepository', useClass: GardensRepository },
    { provide: 'PlotsRepository', useClass: PlotsRepository },
  ],
  exports: [GardenTemplatesService, 'GardenTemplatesRepository'],
})
export class GardenTemplatesModule {}
