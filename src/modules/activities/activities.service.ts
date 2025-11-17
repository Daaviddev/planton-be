import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import type { Activity } from '@prisma/client';
import { ACTIVITIES_REPOSITORY } from '../../domain/contracts';
import type { IActivitiesRepository } from '../../domain/contracts/activities.contract';

@Injectable()
export class ActivitiesService {
  constructor(
    @Inject(ACTIVITIES_REPOSITORY) private readonly repo: IActivitiesRepository,
  ) {}

  async create(data: Partial<Activity>): Promise<Activity> {
    return this.repo.create(data);
  }

  async findAll(): Promise<Activity[]> {
    return this.repo.findAll();
  }

  async findOne(id: string): Promise<Activity> {
    const item = await this.repo.findOne(id);
    if (!item) throw new NotFoundException('Activity not found');
    return item;
  }

  async update(id: string, data: Partial<Activity>): Promise<Activity> {
    await this.findOne(id);
    return this.repo.update(id, data);
  }

  async remove(id: string): Promise<Activity> {
    await this.findOne(id);
    return this.repo.remove(id);
  }
}
