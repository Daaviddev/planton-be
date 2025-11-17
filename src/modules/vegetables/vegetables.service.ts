import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import type { Vegetable } from '@prisma/client';
import { VEGETABLES_REPOSITORY } from '../../domain/contracts';
import type { IVegetablesRepository } from '../../domain/contracts/vegetables.contract';

@Injectable()
export class VegetablesService {
  constructor(
    @Inject(VEGETABLES_REPOSITORY) private readonly repo: IVegetablesRepository,
  ) {}

  async create(data: Partial<Vegetable>): Promise<Vegetable> {
    return this.repo.create(data);
  }

  async findAll(): Promise<Vegetable[]> {
    return this.repo.findAll();
  }

  async findOne(id: string): Promise<Vegetable> {
    const item = await this.repo.findOne(id);
    if (!item) throw new NotFoundException('Vegetable not found');
    return item;
  }

  async update(id: string, data: Partial<Vegetable>): Promise<Vegetable> {
    await this.findOne(id);
    return this.repo.update(id, data);
  }

  async remove(id: string): Promise<Vegetable> {
    await this.findOne(id);
    return this.repo.remove(id);
  }

  async fetchAllVegetablesReadyForHarvest(): Promise<Vegetable[]> {
    return this.repo.findAllWithReadyPlots();
  }

  // Added: alternative method name per API contract
  async findReadyFromHarvestablePlots(): Promise<Vegetable[]> {
    return this.repo.findAllWithReadyPlots();
  }
}
