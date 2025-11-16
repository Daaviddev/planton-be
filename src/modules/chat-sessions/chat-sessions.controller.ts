import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { ChatSessionsService } from './chat-sessions.service';
import { CreateChatSessionDto } from './dto/create-chat-session.dto';
import { UpdateChatSessionDto } from './dto/update-chat-session.dto';
import { SendMessageDto } from './dto/send-message.dto';

@Controller('chat-sessions')
@ApiTags('chat-sessions')
export class ChatSessionsController {
  constructor(private readonly chatSessionsService: ChatSessionsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new chat session' })
  @ApiResponse({
    status: 201,
    description: 'Chat session created successfully',
  })
  @ApiBody({ type: CreateChatSessionDto })
  create(@Body() createChatSessionDto: CreateChatSessionDto) {
    // Map DTO to Prisma input format
    const { userId, gardenId, ...rest } = createChatSessionDto;
    const prismaInput = {
      ...rest,
      user: { connect: { id: userId } },
      garden: { connect: { id: gardenId } },
    };
    return this.chatSessionsService.create(prismaInput);
  }

  @Get()
  @ApiOperation({ summary: 'Get all chat sessions' })
  @ApiResponse({ status: 200, description: 'List of all chat sessions' })
  findAll() {
    return this.chatSessionsService.findAll();
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get chat sessions for a specific user' })
  @ApiParam({ name: 'userId', description: 'The ID of the user' })
  @ApiResponse({
    status: 200,
    description: 'List of chat sessions for the user',
  })
  findAllByUser(@Param('userId') userId: string) {
    return this.chatSessionsService.findAllByUser(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a chat session by ID' })
  @ApiParam({ name: 'id', description: 'The ID of the chat session' })
  @ApiResponse({ status: 200, description: 'Chat session details' })
  @ApiResponse({ status: 404, description: 'Chat session not found' })
  findOne(@Param('id') id: string) {
    return this.chatSessionsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a chat session' })
  @ApiParam({ name: 'id', description: 'The ID of the chat session' })
  @ApiBody({ type: UpdateChatSessionDto })
  @ApiResponse({
    status: 200,
    description: 'Chat session updated successfully',
  })
  @ApiResponse({ status: 404, description: 'Chat session not found' })
  update(
    @Param('id') id: string,
    @Body() updateChatSessionDto: UpdateChatSessionDto,
  ) {
    // Map DTO to Prisma update input format
    const { userId, gardenId, ...rest } = updateChatSessionDto;
    const prismaUpdateInput: any = { ...rest };
    if (userId) prismaUpdateInput.user = { connect: { id: userId } };
    if (gardenId) prismaUpdateInput.garden = { connect: { id: gardenId } };
    return this.chatSessionsService.update(id, prismaUpdateInput);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a chat session' })
  @ApiParam({ name: 'id', description: 'The ID of the chat session' })
  @ApiResponse({
    status: 200,
    description: 'Chat session deleted successfully',
  })
  @ApiResponse({ status: 404, description: 'Chat session not found' })
  remove(@Param('id') id: string) {
    return this.chatSessionsService.remove(id);
  }

  @Post(':id/send-message')
  @ApiOperation({ summary: 'Send a message in a chat session' })
  @ApiParam({ name: 'id', description: 'The ID of the chat session' })
  @ApiBody({ type: SendMessageDto })
  @ApiResponse({ status: 200, description: 'Message sent successfully' })
  sendMessage(@Param('id') id: string, @Body() sendMessageDto: SendMessageDto) {
    return this.chatSessionsService.sendMessage(id, sendMessageDto);
  }
}
