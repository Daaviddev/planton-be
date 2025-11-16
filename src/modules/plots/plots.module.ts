import { Module } from '@nestjs/common';
import { PrismaModule } from '../../services/prisma.module';
import { PlotsController } from './plots.controller';
import { PlotsService } from './plots.service';
import { PlotsRepository } from './plots.repository';
import { ActivitiesModule } from '../activities/activities.module';

@Module({
  imports: [PrismaModule, ActivitiesModule],
  controllers: [PlotsController],
  providers: [
    PlotsService,
    { provide: 'PlotsRepository', useClass: PlotsRepository },
  ],
  exports: [PlotsService, 'PlotsRepository'],
})
export class PlotsModule {}
