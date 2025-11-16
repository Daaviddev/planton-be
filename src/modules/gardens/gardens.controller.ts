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
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { GardensService } from './gardens.service';
import { CreateGardenDto } from './dto/create-garden.dto';
import { UpdateGardenDto } from './dto/update-garden.dto';
import { GardenResponseDto } from './dto/garden-response.dto';
import { PlantVegetableDto } from './dto/plant-vegetable.dto';
import { OrderHarvestAllDto, OrderHarvestDto } from './dto/order-harvest.dto';
import { ParseIntPipe } from '@nestjs/common';
import { LeaseGardenDto } from './dto/lease-garden.dto';

@ApiTags('gardens')
@Controller('gardens')
export class GardensController {
  constructor(private readonly service: GardensService) {}

  @Get()
  @ApiOperation({ summary: 'List gardens' })
  @ApiResponse({ status: 200, type: [GardenResponseDto] })
  async findAll() {
    return this.service.findAll();
  }

  // Get All Gardens From User (must be above the generic ':id' route)
  @Get('user/:userId')
  async findAllByUser(@Param('userId') userId: string) {
    return this.service.findAllByUser(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get garden by id' })
  @ApiResponse({ status: 200, type: GardenResponseDto })
  async findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  @ApiOperation({ summary: 'Create garden (also creates 9 empty plots)' })
  @ApiResponse({ status: 201, type: GardenResponseDto })
  async create(@Body() dto: CreateGardenDto) {
    return this.service.create(dto as any);
  }

  @Patch(':id')
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  @ApiOperation({ summary: 'Update garden' })
  @ApiResponse({ status: 200, type: GardenResponseDto })
  async update(@Param('id') id: string, @Body() dto: UpdateGardenDto) {
    return this.service.update(id, dto as any);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete garden' })
  @ApiResponse({ status: 204, description: 'Deleted' })
  async remove(@Param('id') id: string) {
    await this.service.remove(id);
    return { deleted: true };
  }

  // Separate lease action: creates a LEASE activity for an existing garden
  @Post(':id/lease')
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  @ApiOperation({ summary: 'Lease garden (create LEASE activity)' })
  async leaseGarden(@Param('id') id: string, @Body() dto: LeaseGardenDto) {
    return this.service.leaseGarden({
      gardenId: id,
      userId: dto.userId,
      comment: dto.comment,
      date: dto.date ? new Date(dto.date) : undefined,
    });
  }

  @Post(':gardenId/plots/:squareId/plant')
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  @ApiOperation({ summary: 'Plant a vegetable in a plot square' })
  async plantVegetable(
    @Param('gardenId') gardenId: string,
    @Param('squareId', ParseIntPipe) squareId: number,
    @Body() dto: PlantVegetableDto,
  ) {
    return this.service.plantVegetable({
      gardenId,
      squareId,
      vegetableId: dto.vegetableId,
      userId: dto.userId,
      comment: dto.comment,
    });
  }

  @Post(':gardenId/harvest')
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  @ApiOperation({ summary: 'Order harvest for all ready plots in a garden' })
  async orderHarvest(
    @Param('gardenId') gardenId: string,
    @Body() dto: OrderHarvestDto,
  ) {
    return this.service.orderHarvest({
      gardenId,
      userId: dto.userId,
      comment: dto.comment,
    });
  }

  @Get(':gardenId/plots/ready')
  @ApiOperation({ summary: 'Get plots ready for harvest in a garden' })
  async getReadyPlots(@Param('gardenId') gardenId: string) {
    return this.service.getReadyPlots(gardenId);
  }

  // get all plots ready for harvest in all gardens of a user
  @Get('user/:userId/plots/ready')
  async getReadyPlotsForUser(@Param('userId') userId: string) {
    return this.service.getReadyPlotsForUser(userId);
  }

  // HARVEST ALL plots ready for harvest in all gardens of a user and clean plots
  @Post('user/:userId/harvest')
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async harvestAll(
    @Param('userId') userId: string,
    @Body() dto: OrderHarvestAllDto,
  ) {
    return this.service.orderHarvestAll({
      userId,
      comment: dto.comment,
    });
  }
}
