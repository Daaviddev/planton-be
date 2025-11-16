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
import { ActivitiesService } from './activities.service';
import { CreateActivityDto } from './dto/create-activity.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';
import { ActivityResponseDto } from './dto/activity-response.dto';

@ApiTags('activities')
@Controller('activities')
export class ActivitiesController {
  constructor(private readonly service: ActivitiesService) {}

  @Get()
  @ApiOperation({ summary: 'List activities' })
  @ApiResponse({ status: 200, type: [ActivityResponseDto] })
  async findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get activity' })
  @ApiResponse({ status: 200, type: ActivityResponseDto })
  async findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  @ApiOperation({ summary: 'Create activity' })
  @ApiResponse({ status: 201, type: ActivityResponseDto })
  async create(@Body() dto: CreateActivityDto) {
    return this.service.create(dto as any);
  }

  @Patch(':id')
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  @ApiOperation({ summary: 'Update activity' })
  @ApiResponse({ status: 200, type: ActivityResponseDto })
  async update(@Param('id') id: string, @Body() dto: UpdateActivityDto) {
    return this.service.update(id, dto as any);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete activity' })
  @ApiResponse({ status: 204, description: 'Deleted' })
  async remove(@Param('id') id: string) {
    await this.service.remove(id);
    return { deleted: true };
  }
}
