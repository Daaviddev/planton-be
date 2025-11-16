import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { DeliveryAddressesService } from './delivery-addresses.service';
import { CreateDeliveryAddressDto } from './dto/create-delivery-address.dto';
import { UpdateDeliveryAddressDto } from './dto/update-delivery-address.dto';
import { DeliveryAddressResponseDto } from './dto/delivery-address-response.dto';

@ApiTags('delivery-addresses')
@Controller('delivery-addresses')
export class DeliveryAddressesController {
  constructor(private readonly service: DeliveryAddressesService) {}

  @Get()
  @ApiOperation({ summary: 'List delivery addresses' })
  @ApiResponse({ status: 200, type: [DeliveryAddressResponseDto] })
  async findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get delivery address' })
  @ApiResponse({ status: 200, type: DeliveryAddressResponseDto })
  async findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  @ApiOperation({ summary: 'Create delivery address' })
  @ApiResponse({ status: 201, type: DeliveryAddressResponseDto })
  async create(@Body() dto: CreateDeliveryAddressDto) {
    return this.service.create(dto as any);
  }

  @Patch(':id')
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  @ApiOperation({ summary: 'Update delivery address' })
  @ApiResponse({ status: 200, type: DeliveryAddressResponseDto })
  async update(@Param('id') id: string, @Body() dto: UpdateDeliveryAddressDto) {
    return this.service.update(id, dto as any);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete delivery address' })
  @ApiResponse({ status: 204, description: 'Deleted' })
  async remove(@Param('id') id: string) {
    await this.service.remove(id);
    return { deleted: true };
  }
}
