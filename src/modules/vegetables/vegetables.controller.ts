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
import { VegetablesService } from './vegetables.service';
import { CreateVegetableDto } from './dto/create-vegetable.dto';
import { UpdateVegetableDto } from './dto/update-vegetable.dto';
import { VegetableResponseDto } from './dto/vegetable-response.dto';

@ApiTags('vegetables')
@Controller('vegetables')
export class VegetablesController {
  constructor(private readonly service: VegetablesService) {}

  @Get()
  @ApiOperation({ summary: 'List vegetables' })
  @ApiResponse({ status: 200, type: [VegetableResponseDto] })
  async findAll() {
    return this.service.findAll();
  }

  // Static route before dynamic
  @Get('ready')
  @ApiOperation({ summary: 'List vegetables ready for harvest' })
  @ApiResponse({ status: 200, type: [VegetableResponseDto] })
  async findReadyAll() {
    return this.service.fetchAllVegetablesReadyForHarvest();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get vegetable' })
  @ApiResponse({ status: 200, type: VegetableResponseDto })
  async findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  @ApiOperation({ summary: 'Create vegetable' })
  @ApiResponse({ status: 201, type: VegetableResponseDto })
  async create(@Body() dto: CreateVegetableDto) {
    return this.service.create(dto as any);
  }

  @Patch(':id')
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  @ApiOperation({ summary: 'Update vegetable' })
  @ApiResponse({ status: 200, type: VegetableResponseDto })
  async update(@Param('id') id: string, @Body() dto: UpdateVegetableDto) {
    return this.service.update(id, dto as any);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete vegetable' })
  @ApiResponse({ status: 204, description: 'Deleted' })
  async remove(@Param('id') id: string) {
    await this.service.remove(id);
    return { deleted: true };
  }
}
