import type { Vegetable, Prisma } from '@prisma/client';

export const VEGETABLES_REPOSITORY = Symbol('VEGETABLES_REPOSITORY');

export interface IVegetablesRepository {
  create(
    data: Prisma.VegetableCreateInput | Partial<Vegetable>,
  ): Promise<Vegetable>;
  findAll(): Promise<Vegetable[]>;
  findOne(id: string): Promise<Vegetable | null>;
  update(
    id: string,
    data: Prisma.VegetableUpdateInput | Partial<Vegetable>,
  ): Promise<Vegetable>;
  remove(id: string): Promise<Vegetable>;
  findAllWithReadyPlots(): Promise<Vegetable[]>;
}

// Example usage:
// @Inject(VEGETABLES_REPOSITORY) private readonly repo: IVegetablesRepository
