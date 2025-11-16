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
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ProducersService } from './producers.service';
import { CreateProducerDto } from './dto/create-producer.dto';
import { UpdateProducerDto } from './dto/update-producer.dto';
import { ProducerResponseDto } from './dto/producer-response.dto';
import Serialize from '@decorators/serialize.decorator';
import {
  ApiDefaultResponse,
  StatusCodes,
} from '@decorators/api-default-response.decorator';

@ApiTags('producers')
@Controller('producers')
export class ProducersController {
  constructor(private readonly service: ProducersService) {}

  @Get()
  @ApiOperation({ summary: 'List producers' })
  @ApiDefaultResponse({
    status: StatusCodes.OK,
    type: ProducerResponseDto,
    isArray: true,
  })
  @Serialize(ProducerResponseDto)
  async findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get producer' })
  @ApiDefaultResponse({ status: StatusCodes.OK, type: ProducerResponseDto })
  @Serialize(ProducerResponseDto)
  async findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  @ApiOperation({ summary: 'Create producer' })
  @ApiDefaultResponse({
    status: StatusCodes.CREATED,
    type: ProducerResponseDto,
  })
  @Serialize(ProducerResponseDto)
  async create(@Body() dto: CreateProducerDto) {
    return this.service.create(dto as any);
  }

  @Patch(':id')
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  @ApiOperation({ summary: 'Update producer' })
  @ApiDefaultResponse({ status: StatusCodes.OK, type: ProducerResponseDto })
  @Serialize(ProducerResponseDto)
  async update(@Param('id') id: string, @Body() dto: UpdateProducerDto) {
    return this.service.update(id, dto as any);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete producer' })
  @ApiDefaultResponse({ status: StatusCodes.OK, type: ProducerResponseDto })
  @Serialize(ProducerResponseDto)
  async remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
