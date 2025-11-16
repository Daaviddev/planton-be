import {
  Injectable,
  Inject,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { ActivityType, PlotStatus } from '@prisma/client';
import type { Activity, Garden, Plot } from '@prisma/client';

@Injectable()
export class GardensService {
  constructor(
    @Inject('GardensRepository') private readonly repo: any,
    @Inject('GardenTemplatesRepository') private readonly templatesRepo: any,
    @Inject('ActivitiesRepository') private readonly activitiesRepo: any,
    @Inject('PlotsRepository') private readonly plotsRepo: any,
  ) {}

  async create(data: Partial<Garden>): Promise<Garden> {
    const gardenPayload = data as any;
    const newGarden = await this.repo.create({
      name: gardenPayload.name,
      leaseDate: gardenPayload.leaseDate
        ? new Date(gardenPayload.leaseDate as any)
        : new Date(),
      user: gardenPayload.userId
        ? { connect: { id: gardenPayload.userId } }
        : undefined,
      template: gardenPayload.templateId
        ? { connect: { id: gardenPayload.templateId } }
        : undefined,
    } as any);
    // Ensure 9 empty plots are created for this garden
    if (this.plotsRepo?.createManyForGarden) {
      await this.plotsRepo.createManyForGarden(newGarden.id, 9);
    }
    return newGarden;
  }

  // gardenVegetables removed; allowed vegetables now come from template

  // Lease now clones a template garden into a new leased instance with unique plots
  async leaseGarden(params: {
    gardenId: string;
    userId?: string;
    comment?: string;
    date?: Date;
  }): Promise<Activity> {
    const { gardenId, userId, comment, date } = params;
    const template: any = await this.templatesRepo.findOne(gardenId);
    if (!template) throw new NotFoundException('Garden template not found');

    // Create leased garden from template (this also creates chat session if userId and producerId exist)
    const leasedGarden = await this.repo.createFromTemplate({
      templateId: gardenId,
      userId,
      leaseDate: date ?? new Date(),
      name: template.name,
    });

    // Create fresh plots for the leased garden using template defaultPlots
    const plotCount = template.defaultPlots ?? 9;
    if (this.plotsRepo?.createManyForGarden) {
      await this.plotsRepo.createManyForGarden(leasedGarden.id, plotCount);
    } else if (this.plotsRepo?.create) {
      for (let i = 0; i < plotCount; i++) {
        await this.plotsRepo.create({ gardenId: leasedGarden.id });
      }
    }

    // Create LEASE activity attached to the newly created leased garden
    const activity = await this.activitiesRepo.create({
      type: ActivityType.LEASE,
      date: date ?? new Date(),
      comment,
      garden: { connect: { id: leasedGarden.id } },
      ...(userId ? { user: { connect: { id: userId } } } : {}),
    });
    return activity;
  }

  async findAll(): Promise<Garden[]> {
    return this.repo.findAll();
  }

  async findOne(id: string): Promise<Garden> {
    const item = await this.repo.findOne(id);
    if (!item) throw new NotFoundException('Garden not found');
    return item;
  }

  async findAllByUser(userId: string): Promise<Garden[]> {
    return this.repo.findAllByLeaseUser(userId);
  }

  async update(id: string, data: Partial<Garden>): Promise<Garden> {
    await this.findOne(id);
    return this.repo.update(id, data);
  }

  async remove(id: string): Promise<Garden> {
    await this.findOne(id);
    return this.repo.remove(id);
  }

  // Plant a vegetable in a plot square of a given garden
  async plantVegetable(params: {
    gardenId: string;
    squareId: number;
    vegetableId: string;
    userId?: string;
    comment?: string;
  }): Promise<{ plot: Plot; activity: Activity }> {
    const { gardenId, squareId, vegetableId, userId, comment } = params;
    await this.findOne(gardenId);
    const plot = await this.plotsRepo.findOne(squareId);
    if (!plot) throw new NotFoundException('Plot not found');
    if (plot.gardenId !== gardenId) {
      throw new BadRequestException(
        'Plot does not belong to the specified garden',
      );
    }
    if (plot.status && plot.status !== PlotStatus.EMPTY) {
      throw new BadRequestException('Plot is not empty');
    }
    const updatedPlot = await this.plotsRepo.update(squareId, {
      status: PlotStatus.PLANTED,
      vegetable: { connect: { id: vegetableId } },
      plantedDate: new Date(),
      progress: 0,
    });
    const activity = await this.activitiesRepo.create({
      type: ActivityType.PLANTING,
      date: new Date(),
      comment,
      garden: { connect: { id: gardenId } },
      ...(userId ? { user: { connect: { id: userId } } } : {}),
    });
    return { plot: updatedPlot, activity };
  }

  // Mark all harvest-ready plots as harvested for a garden and create activity
  async orderHarvest(params: {
    gardenId: string;
    userId?: string;
    comment?: string;
  }): Promise<{ harvestedPlotIds: number[]; activity: Activity }> {
    const { gardenId, userId, comment } = params;
    await this.findOne(gardenId);
    const plots: Plot[] = await this.plotsRepo.findManyByGardenAndStatus(
      gardenId,
      PlotStatus.HARVEST_READY,
    );
    const harvestedIds: number[] = [];
    for (const p of plots) {
      const updated = await this.plotsRepo.update(p.id, {
        status: PlotStatus.EMPTY,
        vegetable: { disconnect: true },
        plantedDate: null,
        progress: 0,
      });
      harvestedIds.push(updated.id);
    }
    const activity = await this.activitiesRepo.create({
      type: ActivityType.HARVEST,
      date: new Date(),
      comment,
      garden: { connect: { id: gardenId } },
      ...(userId ? { user: { connect: { id: userId } } } : {}),
    });
    return { harvestedPlotIds: harvestedIds, activity };
  }

  async getReadyPlots(gardenId: string): Promise<Plot[]> {
    await this.findOne(gardenId);
    if (this.plotsRepo?.findManyReadyByGarden) {
      return this.plotsRepo.findManyReadyByGarden(gardenId);
    }
    return this.plotsRepo.findManyByGardenAndStatus(
      gardenId,
      PlotStatus.HARVEST_READY,
    );
  }

  async getReadyPlotsForUser(userId: string): Promise<Plot[]> {
    // Fetch both: gardens directly assigned to user and gardens leased by user (via LEASE activity)
    const [byUser, byLease] = await Promise.all([
      this.repo.findAllByUser(userId),
      this.repo.findAllByLeaseUser
        ? this.repo.findAllByLeaseUser(userId)
        : Promise.resolve([]),
    ]);
    const gardenMap = new Map<string, Garden>();
    for (const g of [...byUser, ...byLease]) gardenMap.set(g.id, g);
    const readyPlots: Plot[] = [];
    for (const garden of gardenMap.values()) {
      const plots = await this.getReadyPlots(garden.id);
      readyPlots.push(...plots);
    }
    return readyPlots;
  }

  async orderHarvestAll(params: {
    userId: string;
    comment?: string;
  }): Promise<{ harvestedPlotIds: number[]; activities: Activity[] }> {
    const { userId, comment } = params;
    const readyPlots = await this.getReadyPlotsForUser(userId);

    // Group plots by garden
    const plotsByGarden = new Map<string, Plot[]>();
    for (const p of readyPlots) {
      if (!p.gardenId) continue;
      const list = plotsByGarden.get(p.gardenId) ?? [];
      list.push(p);
      plotsByGarden.set(p.gardenId, list);
    }

    const harvestedIds: number[] = [];
    const activities: Activity[] = [];

    for (const [gardenId, plots] of plotsByGarden.entries()) {
      // Clear plots for this garden
      for (const p of plots) {
        const updated = await this.plotsRepo.update(p.id, {
          status: PlotStatus.EMPTY,
          vegetable: { disconnect: true },
          plantedDate: null,
          progress: 0,
        });
        harvestedIds.push(updated.id);
      }

      // Create a HARVEST activity tied to this garden (garden is required by schema)
      try {
        const activity = await this.activitiesRepo.create({
          type: ActivityType.HARVEST,
          date: new Date(),
          comment,
          garden: { connect: { id: gardenId } },
          ...(userId ? { user: { connect: { id: userId } } } : {}),
        });
        activities.push(activity);
      } catch (e) {
        // Fallback: if user connect fails (e.g., invalid user), create activity without user connect
        const activity = await this.activitiesRepo.create({
          type: ActivityType.HARVEST,
          date: new Date(),
          comment,
          garden: { connect: { id: gardenId } },
        });
        activities.push(activity);
      }
    }

    return { harvestedPlotIds: harvestedIds, activities };
  }
}
