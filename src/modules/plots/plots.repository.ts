import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../services/prisma.service';
import { PlotStatus } from '@prisma/client';
import type { Plot, Prisma } from '@prisma/client';

@Injectable()
export class PlotsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.PlotCreateInput): Promise<Plot> {
    return this.prisma.plot.create({
      data,
      include: { vegetable: true, garden: true },
    });
  }

  async findAll(): Promise<Plot[]> {
    return this.prisma.plot.findMany({
      include: { vegetable: true, garden: true },
    });
  }

  async findOne(id: number): Promise<Plot | null> {
    return this.prisma.plot.findUnique({
      where: { id },
      include: { vegetable: true, garden: true },
    });
  }

  async findReadyAllForUser(userId: string): Promise<Plot[]> {
    return this.prisma.plot.findMany({
      where: {
        garden: { userId },
        OR: [{ status: PlotStatus.HARVEST_READY }, { progress: { gte: 100 } }],
      },
      include: { vegetable: true, garden: true },
    });
  }

  async update(id: number, data: Prisma.PlotUpdateInput): Promise<Plot> {
    return this.prisma.plot.update({
      where: { id },
      data,
      include: { vegetable: true, garden: true },
    });
  }

  async remove(id: number): Promise<Plot> {
    return this.prisma.plot.delete({
      where: { id },
      include: { vegetable: true, garden: true },
    });
  }

  async findManyByGarden(gardenId: string): Promise<Plot[]> {
    return this.prisma.plot.findMany({
      where: { gardenId },
      include: { vegetable: true, garden: true },
    });
  }

  async findManyByUser(userId: string): Promise<Plot[]> {
    return this.prisma.plot.findMany({
      where: { garden: { userId } },
      include: { vegetable: true, garden: true },
    });
  }

  async findManyByGardenAndStatus(
    gardenId: string,
    status: PlotStatus,
  ): Promise<Plot[]> {
    return this.prisma.plot.findMany({
      where: { gardenId, status },
      include: { vegetable: true, garden: true },
    });
  }

  // Ready = explicitly HARVEST_READY or progress reached 100%
  async findManyReadyByGarden(gardenId: string): Promise<Plot[]> {
    return this.prisma.plot.findMany({
      where: {
        gardenId,
        OR: [{ status: PlotStatus.HARVEST_READY }, { progress: { gte: 100 } }],
      },
      include: {
        vegetable: true,
        garden: true,
      },
    });
  }

  async findReady(): Promise<Plot[]> {
    return this.prisma.plot.findMany({
      where: {
        OR: [{ status: PlotStatus.HARVEST_READY }, { progress: { gte: 100 } }],
      },
      include: { vegetable: true, garden: true },
    });
  }

  async findReadyPlots(gardenId?: string): Promise<Plot[]> {
    const where: Prisma.PlotWhereInput = gardenId
      ? {
          gardenId,
          OR: [
            { status: PlotStatus.HARVEST_READY },
            { progress: { gte: 100 } },
          ],
        }
      : {
          OR: [
            { status: PlotStatus.HARVEST_READY },
            { progress: { gte: 100 } },
          ],
        };
    return this.prisma.plot.findMany({
      where,
      include: { vegetable: true, garden: true },
    });
  }

  // Create N plots for a garden with EMPTY status
  async createManyForGarden(gardenId: string, count = 9): Promise<number> {
    const data: Prisma.PlotCreateManyInput[] = Array.from(
      { length: count },
      () => ({
        gardenId,
        status: PlotStatus.EMPTY,
      }),
    );
    const result = await this.prisma.plot.createMany({ data });
    return result.count;
  }

  async plant(
    plotId: number,
    vegetableId: string,
    plantedDate?: Date,
  ): Promise<Plot> {
    return this.prisma.plot.update({
      where: { id: plotId },
      data: {
        vegetableId,
        status: PlotStatus.PLANTED,
        plantedDate: plantedDate ?? new Date(),
        progress: 0,
      },
      include: { vegetable: true, garden: true },
    });
  }

  async harvest(plotId: number): Promise<Plot> {
    return this.prisma.plot.update({
      where: { id: plotId },
      data: {
        vegetableId: null,
        status: PlotStatus.EMPTY,
        plantedDate: null,
        progress: null,
      },
      include: { vegetable: true, garden: true },
    });
  }

  async harvestAllReady(gardenId?: string): Promise<Plot[]> {
    const where: Prisma.PlotWhereInput = gardenId
      ? {
          gardenId,
          OR: [
            { status: PlotStatus.HARVEST_READY },
            { progress: { gte: 100 } },
          ],
        }
      : {
          OR: [
            { status: PlotStatus.HARVEST_READY },
            { progress: { gte: 100 } },
          ],
        };

    const ready = await this.prisma.plot.findMany({
      where,
      select: { id: true },
    });
    if (ready.length === 0) return [];

    const updates = ready.map((r) =>
      this.prisma.plot.update({
        where: { id: r.id },
        data: {
          vegetableId: null,
          status: PlotStatus.EMPTY,
          plantedDate: null,
          progress: null,
        },
        include: { vegetable: true, garden: true },
      }),
    );
    return this.prisma.$transaction(updates);
  }

  async harvestAllReadyForUser(userId: string): Promise<Plot[]> {
    const where: Prisma.PlotWhereInput = {
      garden: { userId },
      OR: [{ status: PlotStatus.HARVEST_READY }, { progress: { gte: 100 } }],
    };

    const ready = await this.prisma.plot.findMany({
      where,
      select: { id: true },
    });
    if (ready.length === 0) return [];

    const updates = ready.map((r) =>
      this.prisma.plot.update({
        where: { id: r.id },
        data: {
          vegetableId: null,
          status: PlotStatus.EMPTY,
          plantedDate: null,
          progress: null,
        },
        include: { vegetable: true, garden: true },
      }),
    );
    return this.prisma.$transaction(updates);
  }

  async changeStatus(id: number, status: PlotStatus): Promise<Plot> {
    return this.prisma.plot.update({
      where: { id },
      data: { status },
      include: { vegetable: true },
    });
  }

  async vegetableExists(vegetableId: string): Promise<boolean> {
    const v = await this.prisma.vegetable.findUnique({
      where: { id: vegetableId },
      select: { id: true },
    });
    return !!v;
  }
}
