import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../services/prisma.service';
import type { Vegetable, Prisma } from '@prisma/client';
import { PlotStatus } from '@prisma/client';
import type { IVegetablesRepository } from '../../domain/contracts/vegetables.contract';

@Injectable()
export class VegetablesRepository implements IVegetablesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.VegetableCreateInput): Promise<Vegetable> {
    return this.prisma.vegetable.create({ data });
  }

  async findAll(): Promise<Vegetable[]> {
    return this.prisma.vegetable.findMany({
      include: { growthStages: true, templateLinks: true },
    });
  }

  async findOne(id: string): Promise<Vegetable | null> {
    return this.prisma.vegetable.findUnique({
      where: { id },
      include: { growthStages: true, templateLinks: true },
    });
  }

  async update(
    id: string,
    data: Prisma.VegetableUpdateInput,
  ): Promise<Vegetable> {
    return this.prisma.vegetable.update({ where: { id }, data });
  }

  async remove(id: string): Promise<Vegetable> {
    return this.prisma.vegetable.delete({ where: { id } });
  }

  async findAllWithReadyPlots(): Promise<Vegetable[]> {
    return this.prisma.vegetable.findMany({
      where: {
        plots: {
          some: {
            status: PlotStatus.HARVEST_READY,
          },
        },
      },
    });
  }
}
