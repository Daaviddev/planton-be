import { Module } from '@nestjs/common';
import { PrismaModule } from '../../services/prisma.module';
import { ActivitiesController } from './activities.controller';
import { ActivitiesService } from './activities.service';
import { ActivitiesRepository } from './activities.repository';

@Module({
  imports: [PrismaModule],
  controllers: [ActivitiesController],
  providers: [
    ActivitiesService,
    { provide: 'ActivitiesRepository', useClass: ActivitiesRepository },
  ],
  exports: [ActivitiesService, 'ActivitiesRepository'],
})
export class ActivitiesModule {}
