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
import { ChatMessagesService } from './chat-messages.service';
import { CreateChatMessageDto } from './dto/create-chat-message.dto';
import { UpdateChatMessageDto } from './dto/update-chat-message.dto';
import { ChatMessageResponseDto } from './dto/chat-message-response.dto';

@ApiTags('chat-messages')
@Controller('chat-messages')
export class ChatMessagesController {
  constructor(private readonly service: ChatMessagesService) {}

  @Get()
  @ApiOperation({ summary: 'List chat messages' })
  @ApiResponse({ status: 200, type: [ChatMessageResponseDto] })
  async findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get chat message' })
  @ApiResponse({ status: 200, type: ChatMessageResponseDto })
  async findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Get('garden/:gardenId')
  @ApiOperation({ summary: 'Get chat messages by garden' })
  @ApiResponse({ status: 200, type: [ChatMessageResponseDto] })
  async findByGarden(@Param('gardenId') gardenId: string) {
    return this.service.findByGarden(gardenId);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get chat messages by user' })
  @ApiResponse({ status: 200, type: [ChatMessageResponseDto] })
  async findByUser(@Param('userId') userId: string) {
    return this.service.findByUser(userId);
  }

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  @ApiOperation({ summary: 'Create chat message' })
  @ApiResponse({ status: 201, type: ChatMessageResponseDto })
  async create(@Body() dto: CreateChatMessageDto) {
    return this.service.create(dto as any);
  }

  @Patch(':id')
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  @ApiOperation({ summary: 'Update chat message' })
  @ApiResponse({ status: 200, type: ChatMessageResponseDto })
  async update(@Param('id') id: string, @Body() dto: UpdateChatMessageDto) {
    return this.service.update(id, dto as any);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete chat message' })
  @ApiResponse({ status: 204, description: 'Deleted' })
  async remove(@Param('id') id: string) {
    await this.service.remove(id);
    return { deleted: true };
  }
}
