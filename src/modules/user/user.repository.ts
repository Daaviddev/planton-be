import { Injectable } from '@nestjs/common';
import type { User, Prisma } from '@prisma/client';
import { PrismaService } from '../../services/prisma.service';

@Injectable()
export class UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<User[]> {
    return this.prisma.user.findMany({
      include: {
        deliveryAddresses: true,
        gardens: true,
        activities: true,
        chatMessages: true,
      },
    });
  }

  async findOne(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id },
      include: {
        deliveryAddresses: true,
        gardens: true,
        activities: true,
        chatMessages: true,
      },
    });
  }

  async findFirst(): Promise<User | null> {
    return this.prisma.user.findFirst({
      orderBy: { createdAt: 'asc' },
      include: {
        deliveryAddresses: true,
        gardens: true,
        activities: true,
        chatMessages: true,
      },
    });
  }

  async create(data: Prisma.UserCreateInput): Promise<User> {
    return this.prisma.user.create({ data });
  }

  async update(id: string, data: Partial<User>): Promise<User> {
    return this.prisma.user.update({ where: { id }, data });
  }

  async remove(id: string): Promise<User> {
    return this.prisma.user.delete({ where: { id } });
  }
}
