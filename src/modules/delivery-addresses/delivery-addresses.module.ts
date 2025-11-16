import { Module } from '@nestjs/common';
import { PrismaModule } from '../../services/prisma.module';
import { DeliveryAddressesController } from './delivery-addresses.controller';
import { DeliveryAddressesService } from './delivery-addresses.service';
import { DeliveryAddressesRepository } from './delivery-addresses.repository';

@Module({
  imports: [PrismaModule],
  controllers: [DeliveryAddressesController],
  providers: [
    DeliveryAddressesService,
    {
      provide: 'DeliveryAddressesRepository',
      useClass: DeliveryAddressesRepository,
    },
  ],
  exports: [DeliveryAddressesService, 'DeliveryAddressesRepository'],
})
export class DeliveryAddressesModule {}
