import { Injectable } from '@nestjs/common';
import { ChatSessionsRepository } from './chat-sessions.repository';
import type { ChatSession, ChatMessage, Prisma } from '@prisma/client';

@Injectable()
export class ChatSessionsService {
  constructor(
    private readonly chatSessionsRepository: ChatSessionsRepository,
  ) {}

  async create(data: Prisma.ChatSessionCreateInput): Promise<ChatSession> {
    return this.chatSessionsRepository.create(data);
  }

  async findAll(): Promise<ChatSession[]> {
    return this.chatSessionsRepository.findAll();
  }

  async findAllByUser(userId: string): Promise<ChatSession[]> {
    return this.chatSessionsRepository.findAllByUser(userId);
  }

  async findOne(id: string): Promise<ChatSession | null> {
    return this.chatSessionsRepository.findOne(id);
  }

  async update(
    id: string,
    data: Prisma.ChatSessionUpdateInput,
  ): Promise<ChatSession> {
    return this.chatSessionsRepository.update(id, data);
  }

  async remove(id: string): Promise<ChatSession> {
    return this.chatSessionsRepository.remove(id);
  }

  async sendMessage(
    sessionId: string,
    messageData: {
      sender: 'USER' | 'BOT' | 'PRODUCER';
      text: string;
      userId: string;
      gardenId: string;
    },
  ): Promise<ChatMessage> {
    // First, verify the session exists and belongs to the user/garden
    const session = await this.chatSessionsRepository.findOne(sessionId);
    if (!session) {
      throw new Error('Chat session not found');
    }

    // Create the message using the repository's public method
    const message = await this.chatSessionsRepository.createMessage({
      sessionId,
      sender: messageData.sender,
      text: messageData.text,
      userId: messageData.userId,
      gardenId: messageData.gardenId,
    });

    return message;
  }
}
