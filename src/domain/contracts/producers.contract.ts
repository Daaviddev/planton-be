import type { Producer, Prisma } from '@prisma/client';

export const PRODUCERS_REPOSITORY = Symbol('PRODUCERS_REPOSITORY');

export interface IProducersRepository {
  create(
    data: Prisma.ProducerCreateInput | Partial<Producer>,
  ): Promise<Producer>;
  findAll(): Promise<Producer[]>;
  findOne(id: string): Promise<Producer | null>;
  findByUserId(userId: string): Promise<Producer | null>;
  update(
    id: string,
    data: Prisma.ProducerUpdateInput | Partial<Producer>,
  ): Promise<Producer>;
  remove(id: string): Promise<Producer>;
}

// Example usage:
// @Inject(PRODUCERS_REPOSITORY) private readonly repo: IProducersRepository
