import type { Activity, Prisma } from '@prisma/client';

export const ACTIVITIES_REPOSITORY = Symbol('ACTIVITIES_REPOSITORY');

export interface IActivitiesRepository {
  // Accept either Prisma input types or partial Activity for easier migration.
  create(
    data: Prisma.ActivityCreateInput | Partial<Activity>,
  ): Promise<Activity>;
  findAll(): Promise<Activity[]>;
  findOne(id: string): Promise<Activity | null>;
  update(
    id: string,
    data: Prisma.ActivityUpdateInput | Partial<Activity>,
  ): Promise<Activity>;
  remove(id: string): Promise<Activity>;
}

// Example usage:
// import { ACTIVITIES_REPOSITORY, IActivitiesRepository } from 'src/domain/contracts';
// @Inject(ACTIVITIES_REPOSITORY) private readonly repo: IActivitiesRepository
