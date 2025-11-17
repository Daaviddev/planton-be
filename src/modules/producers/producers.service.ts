import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import type { Producer } from '@prisma/client';
import { PRODUCERS_REPOSITORY } from '../../domain/contracts';
import type { IProducersRepository } from '../../domain/contracts/producers.contract';

@Injectable()
export class ProducersService {
  constructor(
    @Inject(PRODUCERS_REPOSITORY) private readonly repo: IProducersRepository,
  ) {}

  async create(data: Partial<Producer>): Promise<Producer> {
    return this.repo.create(data);
  }

  async findAll(): Promise<Producer[]> {
    return this.repo.findAll();
  }

  async findOne(id: string): Promise<Producer> {
    const item = await this.repo.findOne(id);
    if (!item) throw new NotFoundException('Producer not found');
    return item;
  }

  async findByUserId(userId: string): Promise<Producer | null> {
    return this.repo.findByUserId(userId);
  }

  async update(id: string, data: Partial<Producer>): Promise<Producer> {
    await this.findOne(id);
    return this.repo.update(id, data);
  }

  async remove(id: string): Promise<Producer> {
    await this.findOne(id);
    return this.repo.remove(id);
  }
}
