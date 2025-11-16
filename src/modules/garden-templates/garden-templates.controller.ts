import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GardenTemplatesService } from './garden-templates.service';
import { CreateGardenTemplateDto } from './dto/create-garden-template.dto';
import { UpdateGardenTemplateDto } from './dto/update-garden-template.dto';
import { GardenTemplateResponseDto } from './dto/garden-template-response.dto';
import { LeaseTemplateDto } from './dto/lease-template.dto';

@ApiTags('garden-templates')
@Controller('garden-templates')
export class GardenTemplatesController {
  constructor(private readonly service: GardenTemplatesService) {}

  @Get()
  @ApiOperation({ summary: 'List garden templates' })
  @ApiResponse({ status: 200, type: [GardenTemplateResponseDto] })
  async findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a garden template' })
  @ApiResponse({ status: 200, type: GardenTemplateResponseDto })
  async findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Get('producer/:producerId')
  @ApiOperation({ summary: 'List templates by producer' })
  @ApiResponse({ status: 200, type: [GardenTemplateResponseDto] })
  async findAllByProducer(@Param('producerId') producerId: string) {
    return this.service.findAllByProducer(producerId);
  }

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  @ApiOperation({ summary: 'Create garden template' })
  @ApiResponse({ status: 201, type: GardenTemplateResponseDto })
  async create(@Body() dto: CreateGardenTemplateDto) {
    return this.service.create(dto);
  }

  @Patch(':id')
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  @ApiOperation({ summary: 'Update garden template' })
  @ApiResponse({ status: 200, type: GardenTemplateResponseDto })
  async update(@Param('id') id: string, @Body() dto: UpdateGardenTemplateDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete garden template' })
  async remove(@Param('id') id: string) {
    await this.service.remove(id);
    return { deleted: true };
  }

  // Lease a template: creates a new Garden instance from template and a LEASE activity
  @Post(':id/lease')
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  @ApiOperation({
    summary: 'Lease a garden template (create garden + LEASE activity)',
  })
  @ApiBody({ type: LeaseTemplateDto })
  async leaseTemplate(@Param('id') id: string, @Body() dto: LeaseTemplateDto) {
    return this.service.leaseTemplate(id, dto);
  }
}
