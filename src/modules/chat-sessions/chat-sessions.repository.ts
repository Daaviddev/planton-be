import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../services/prisma.service';
import type { ChatSession, Prisma } from '@prisma/client';

@Injectable()
export class ChatSessionsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.ChatSessionCreateInput): Promise<ChatSession> {
    return this.prisma.chatSession.create({
      data,
      include: {
        user: true,
        producer: true,
        garden: true,
        messages: {
          include: {
            user: true,
            garden: true,
          },
          orderBy: { createdAt: 'asc' },
        },
      },
    });
  }

  async findAll(): Promise<ChatSession[]> {
    return this.prisma.chatSession.findMany({
      include: {
        user: true,
        producer: true,
        garden: true,
        messages: {
          include: {
            user: true,
            garden: true,
          },
          orderBy: { createdAt: 'asc' },
        },
      },
    });
  }

  async findAllByUser(userId: string): Promise<ChatSession[]> {
    return this.prisma.chatSession.findMany({
      where: { userId },
      include: {
        user: true,
        producer: true,
        garden: true,
        messages: {
          include: {
            user: true,
            garden: true,
          },
          orderBy: { createdAt: 'asc' },
        },
      },
    });
  }

  async findOne(id: string): Promise<ChatSession | null> {
    return this.prisma.chatSession.findUnique({
      where: { id },
      include: {
        user: true,
        producer: true,
        garden: true,
        messages: {
          include: {
            user: true,
            garden: true,
          },
          orderBy: { createdAt: 'asc' },
        },
      },
    });
  }

  async update(
    id: string,
    data: Prisma.ChatSessionUpdateInput,
  ): Promise<ChatSession> {
    return this.prisma.chatSession.update({
      where: { id },
      data,
      include: {
        user: true,
        producer: true,
        garden: true,
        messages: {
          include: {
            user: true,
            garden: true,
          },
          orderBy: { createdAt: 'asc' },
        },
      },
    });
  }

  async remove(id: string): Promise<ChatSession> {
    return this.prisma.chatSession.delete({ where: { id } });
  }

  async createMessage(data: {
    sessionId: string;
    sender: 'USER' | 'BOT' | 'PRODUCER';
    text: string;
    userId: string;
    gardenId: string;
  }) {
    return this.prisma.chatMessage.create({
      data,
      include: {
        user: true,
        garden: true,
        session: true,
      },
    });
  }
}
