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
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { PlotsService } from './plots.service';
import { CreatePlotDto } from './dto/create-plot.dto';
import { UpdatePlotDto } from './dto/update-plot.dto';
import { PlotResponseDto } from './dto/plot-response.dto';
import { PlantPlotDto } from './dto/plant-plot.dto';
import { ChangeStatusDto } from './dto/change-status.dto';

@ApiTags('plots')
@Controller('plots')
export class PlotsController {
  constructor(private readonly service: PlotsService) {}

  @Get()
  @ApiOperation({ summary: 'List plots' })
  @ApiResponse({ status: 200, type: [PlotResponseDto] })
  async findAll() {
    return this.service.findAll();
  }

  // Place static route before dynamic routes to avoid conflicts
  @Get('ready/:userId')
  @ApiOperation({ summary: 'List plots ready for harvest' })
  @ApiResponse({ status: 200, type: [PlotResponseDto] })
  async findReadyAll(@Param('userId') userId: string) {
    return this.service.findReadyAllForUser(userId);
  }

  @Get('garden/:gardenId')
  @ApiOperation({ summary: 'Get all plots by garden id' })
  @ApiResponse({ status: 200, type: [PlotResponseDto] })
  async findByGarden(@Param('gardenId') gardenId: string) {
    return this.service.findByGarden(gardenId);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get all plots by user id' })
  @ApiResponse({ status: 200, type: [PlotResponseDto] })
  async findByUser(@Param('userId') userId: string) {
    return this.service.findByUser(userId);
  }

  @Get('ready/by-garden/:gardenId')
  @ApiOperation({ summary: 'List plots ready to harvest by garden id' })
  @ApiResponse({ status: 200, type: [PlotResponseDto] })
  async findReadyByGarden(@Param('gardenId') gardenId: string) {
    return this.service.findReadyByGarden(gardenId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get plot' })
  @ApiResponse({ status: 200, type: PlotResponseDto })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  @ApiOperation({ summary: 'Create plot' })
  @ApiResponse({ status: 201, type: PlotResponseDto })
  async create(@Body() dto: CreatePlotDto) {
    return this.service.create(dto as any);
  }

  @Patch(':id')
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  @ApiOperation({ summary: 'Update plot' })
  @ApiResponse({ status: 200, type: PlotResponseDto })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdatePlotDto,
  ) {
    return this.service.update(id, dto as any);
  }

  @Patch(':id/harvest')
  @ApiOperation({ summary: 'Harvest a plot' })
  @ApiResponse({ status: 200, type: PlotResponseDto })
  async harvest(@Param('id', ParseIntPipe) id: number) {
    return this.service.harvest(id);
  }

  @Post('harvest/ready')
  @ApiOperation({
    summary:
      'Harvest all plots ready to harvest (optionally supply gardenId query)',
  })
  @ApiResponse({ status: 200, type: [PlotResponseDto] })
  async harvestAllReady(@Body('gardenId') gardenId?: string) {
    return this.service.harvestAllReady(gardenId);
  }

  @Post('harvest/ready/user/:userId')
  @ApiOperation({ summary: 'Harvest all plots ready to harvest for a user' })
  @ApiResponse({ status: 200, type: [PlotResponseDto] })
  async harvestAllReadyForUser(@Param('userId') userId: string) {
    return this.service.harvestAllReadyForUser(userId);
  }

  @Patch(':id/status')
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  @ApiOperation({ summary: 'Change plot status' })
  @ApiResponse({ status: 200, type: PlotResponseDto })
  async changeStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: ChangeStatusDto,
  ) {
    return this.service.changeStatus(id, dto.status);
  }

  @Post(':id/plant')
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  @ApiOperation({ summary: 'Plant a vegetable on a plot' })
  @ApiResponse({ status: 200, type: PlotResponseDto })
  async plant(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: PlantPlotDto,
  ) {
    const plantedDate = dto.plantedDate ? new Date(dto.plantedDate) : undefined;
    return this.service.plant(id, dto.vegetableId, plantedDate);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete plot' })
  @ApiResponse({ status: 204, description: 'Deleted' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.service.remove(id);
    return { deleted: true };
  }
}
