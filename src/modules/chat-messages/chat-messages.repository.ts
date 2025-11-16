import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../services/prisma.service';
import type { ChatMessage, Prisma } from '@prisma/client';

@Injectable()
export class ChatMessagesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.ChatMessageCreateInput): Promise<ChatMessage> {
    return this.prisma.chatMessage.create({ data });
  }

  async findAll(): Promise<ChatMessage[]> {
    return this.prisma.chatMessage.findMany({
      include: {
        user: true,
        garden: {
          include: {
            template: {
              include: {
                producer: true,
              },
            },
          },
        },
      },
    });
  }

  async findOne(id: string): Promise<ChatMessage | null> {
    return this.prisma.chatMessage.findUnique({
      where: { id },
      include: {
        user: true,
        garden: {
          include: {
            template: {
              include: {
                producer: true,
              },
            },
          },
        },
      },
    });
  }

  async update(
    id: string,
    data: Prisma.ChatMessageUpdateInput,
  ): Promise<ChatMessage> {
    return this.prisma.chatMessage.update({ where: { id }, data });
  }

  async remove(id: string): Promise<ChatMessage> {
    return this.prisma.chatMessage.delete({ where: { id } });
  }

  async findByGarden(gardenId: string): Promise<ChatMessage[]> {
    return this.prisma.chatMessage.findMany({
      where: { gardenId },
      include: {
        user: true,
        garden: {
          include: {
            template: {
              include: {
                producer: true,
              },
            },
          },
        },
      },
    });
  }

  async findByUser(userId: string): Promise<ChatMessage[]> {
    return this.prisma.chatMessage.findMany({
      where: { userId },
      include: {
        user: true,
        garden: {
          include: {
            template: {
              include: {
                producer: true,
              },
            },
          },
        },
      },
    });
  }
}
