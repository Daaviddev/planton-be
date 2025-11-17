import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../services/prisma.service';
import type { Producer, Prisma } from '@prisma/client';
import type { IProducersRepository } from '../../domain/contracts/producers.contract';

@Injectable()
export class ProducersRepository implements IProducersRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.ProducerCreateInput): Promise<Producer> {
    return this.prisma.producer.create({ data });
  }

  async findAll(): Promise<Producer[]> {
    return this.prisma.producer.findMany({ include: { user: true } });
  }

  async findOne(id: string): Promise<Producer | null> {
    return this.prisma.producer.findUnique({
      where: { id },
      include: { user: true },
    });
  }

  async findByUserId(userId: string): Promise<Producer | null> {
    return this.prisma.producer.findUnique({
      where: { userId },
      include: { user: true },
    });
  }

  async update(
    id: string,
    data: Prisma.ProducerUpdateInput,
  ): Promise<Producer> {
    return this.prisma.producer.update({ where: { id }, data });
  }

  async remove(id: string): Promise<Producer> {
    return this.prisma.producer.delete({ where: { id } });
  }
}
