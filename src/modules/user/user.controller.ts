import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  ForbiddenException,
  BadRequestException,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ProducersService } from '../producers/producers.service';
import type { User } from '@prisma/client';
import { Public } from '../auth/decorators/public.decorator';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import Serialize from '@decorators/serialize.decorator';
import { UserDto } from './dto/user.dto';
import {
  ApiDefaultResponse,
  StatusCodes,
} from '@decorators/api-default-response.decorator';

@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly producersService: ProducersService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'List users' })
  @ApiDefaultResponse({ status: StatusCodes.OK, type: UserDto, isArray: true })
  @Serialize(UserDto)
  async findAll(): Promise<User[]> {
    // This should probably be restricted to admin users only
    return this.userService.findAll();
  }

  @Public()
  @Get('me')
  @ApiOperation({ summary: 'Get my profile' })
  @ApiDefaultResponse({ status: StatusCodes.OK, type: UserDto })
  @Serialize(UserDto)
  async getMyProfile(): Promise<User | null> {
    return this.userService.findFirst();
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Get a user by id (self only)' })
  @ApiDefaultResponse({ status: StatusCodes.OK, type: UserDto })
  @Serialize(UserDto)
  async findOne(@Param('id') id: string): Promise<User | null> {
    return this.userService.findOne(id);
  }

  @Public()
  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  @ApiOperation({ summary: 'Create user' })
  @ApiDefaultResponse({ status: StatusCodes.CREATED, type: UserDto })
  @Serialize(UserDto)
  async create(@Body() data: CreateUserDto): Promise<User> {
    // This should probably be restricted to admin users only
    return this.userService.create(
      data as unknown as Omit<User, 'id' | 'createdAt' | 'updatedAt'>,
    );
  }

  @Public()
  @Put(':id')
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  @ApiOperation({ summary: 'Update a user by id (self only)' })
  @ApiDefaultResponse({ status: StatusCodes.OK, type: UserDto })
  @Serialize(UserDto)
  async update(
    @Param('id') id: string,
    @Body() data: UpdateUserDto,
  ): Promise<User> {
    // Filter out relation fields that shouldn't be updated through this endpoint
    const {
      deliveryAddresses,
      gardens,
      activities,
      chatMessages,
      chatSessions,
      producer,
      ...filteredData
    } = data as any;
    return this.userService.update(id, filteredData);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a user by id (self only)' })
  @ApiDefaultResponse({ status: StatusCodes.OK, type: UserDto })
  @Serialize(UserDto)
  async remove(@Param('id') id: string): Promise<User> {
    return this.userService.remove(id);
  }

  @Post(':id/producer')
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  @ApiOperation({ summary: 'Create a producer and link it to the user' })
  @ApiDefaultResponse({ status: StatusCodes.CREATED, type: UserDto })
  @Serialize(UserDto)
  async createProducerForUser(
    @Param('id') id: string,
    @Body()
    body: {
      name: string;
      specialty?: string;
      avatar?: string;
    },
  ): Promise<User> {
    // Ensure user exists and doesn't already have a producer
    const user = await this.userService.findOne(id);
    if (!user) throw new BadRequestException('User not found');
    const existing = await this.producersService.findByUserId(id);
    if (existing) {
      throw new BadRequestException('User already has an associated producer');
    }

    // Create producer linked to user
    const producer = await this.producersService.create({
      name: body.name,
      specialty: body.specialty,
      avatar: body.avatar,
      user: { connect: { id } } as any,
    } as any);

    // Update user with the producerId
    const updated = await this.userService.update(id, {
      producerId: producer.id,
    } as any);
    return updated;
  }
}
