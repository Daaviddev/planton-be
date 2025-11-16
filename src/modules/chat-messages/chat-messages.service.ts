import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import type { ChatMessage } from '@prisma/client';

@Injectable()
export class ChatMessagesService {
  constructor(@Inject('ChatMessagesRepository') private readonly repo: any) {}

  async create(data: Partial<ChatMessage>): Promise<ChatMessage> {
    return this.repo.create(data);
  }

  async findAll(): Promise<ChatMessage[]> {
    return this.repo.findMany ? this.repo.findMany() : this.repo.findAll();
  }

  async findOne(id: string): Promise<ChatMessage> {
    const item = await this.repo.findOne(id);
    if (!item) throw new NotFoundException('ChatMessage not found');
    return item;
  }

  async update(id: string, data: Partial<ChatMessage>): Promise<ChatMessage> {
    await this.findOne(id);
    return this.repo.update(id, data);
  }

  async remove(id: string): Promise<ChatMessage> {
    await this.findOne(id);
    return this.repo.remove(id);
  }

  async findByGarden(gardenId: string): Promise<ChatMessage[]> {
    return this.repo.findByGarden(gardenId);
  }

  async findByUser(userId: string): Promise<ChatMessage[]> {
    return this.repo.findByUser(userId);
  }
}
