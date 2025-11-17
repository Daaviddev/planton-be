import { Module } from '@nestjs/common';
import { PrismaModule } from '../../services/prisma.module';
import { ActivitiesController } from './activities.controller';
import { ActivitiesService } from './activities.service';
import { ActivitiesRepository } from './activities.repository';
import { ACTIVITIES_REPOSITORY } from '../../domain/contracts';

@Module({
  imports: [PrismaModule],
  controllers: [ActivitiesController],
  providers: [
    ActivitiesService,
    { provide: ACTIVITIES_REPOSITORY, useClass: ActivitiesRepository },
  ],
  exports: [ActivitiesService, ACTIVITIES_REPOSITORY],
})
export class ActivitiesModule {}
