import {
  Injectable,
  Inject,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import type { Plot, PlotStatus, Vegetable, Garden } from '@prisma/client';
import { ActivityType } from '@prisma/client';
import { ActivitiesService } from '../activities/activities.service';

@Injectable()
export class PlotsService {
  constructor(
    @Inject('PlotsRepository') private readonly repo: any,
    private readonly activitiesService: ActivitiesService,
  ) {}

  async create(data: Partial<Plot>): Promise<Plot> {
    return this.repo.create(data);
  }

  async findAll(): Promise<Plot[]> {
    return this.repo.findAll();
  }

  async findOne(id: number): Promise<Plot> {
    const item = await this.repo.findOne(id);
    if (!item) throw new NotFoundException('Plot not found');
    return item;
  }

  async update(id: number, data: Partial<Plot>): Promise<Plot> {
    await this.findOne(id);
    return this.repo.update(id, data);
  }

  async findReadyAllForUser(userId: string): Promise<Plot[]> {
    return this.repo.findReadyAllForUser(userId);
  }

  async remove(id: number): Promise<Plot> {
    await this.findOne(id);
    return this.repo.remove(id);
  }

  async findReady(): Promise<Plot[]> {
    return this.repo.findReady();
  }

  async findReadyAll(): Promise<Plot[]> {
    return this.repo.findReady();
  }

  async findReadyByGarden(gardenId: string): Promise<Plot[]> {
    return this.repo.findManyReadyByGarden(gardenId);
  }

  async findByGarden(gardenId: string): Promise<Plot[]> {
    return this.repo.findManyByGarden(gardenId);
  }

  async findByUser(userId: string): Promise<Plot[]> {
    return this.repo.findManyByUser(userId);
  }

  async plant(
    plotId: number,
    vegetableId: string,
    plantedDate?: Date,
  ): Promise<Plot> {
    const plot = await this.findOne(plotId);
    if (plot.status !== 'EMPTY' && plot.status !== 'HARVEST_READY') {
      throw new BadRequestException('Plot not available for planting');
    }
    const exists = await this.repo.vegetableExists(vegetableId);
    if (!exists) throw new BadRequestException('Vegetable not found');
    const plantedPlot = await this.repo.plant(plotId, vegetableId, plantedDate);
    await this.activitiesService.create({
      gardenId: plantedPlot.gardenId,
      userId: plantedPlot.garden.userId,
      type: ActivityType.PLANTING,
      date: plantedDate || new Date(),
      comment: `Planted ${
        (plantedPlot as any).vegetable?.name || 'vegetable'
      } on plot ${plotId}`,
    });
    return plantedPlot;
  }

  async harvest(plotId: number): Promise<Plot> {
    const plot = await this.findOne(plotId);
    const vegetableName = (plot as any).vegetable?.name || 'unknown';
    const harvestedPlot = await this.repo.harvest(plotId);
    await this.activitiesService.create({
      gardenId: harvestedPlot.gardenId,
      userId: harvestedPlot.garden.userId,
      type: ActivityType.HARVEST,
      date: new Date(),
      comment: `Harvested ${vegetableName} from plot ${plotId}`,
    });
    return harvestedPlot;
  }

  async harvestAllReady(gardenId?: string): Promise<Plot[]> {
    const readyPlots = await this.repo.findReadyPlots(gardenId);
    const plots = await this.repo.harvestAllReady(gardenId);
    await Promise.all(
      readyPlots.map(async (p) => {
        await this.activitiesService.create({
          gardenId: (p as any).gardenId,
          userId: (p as any).garden.userId,
          type: ActivityType.HARVEST,
          date: new Date(),
          comment: `Harvested ${
            (p as any).vegetable?.name || 'vegetable'
          } from plot ${(p as any).id}`,
        });
      }),
    );
    return plots;
  }

  async harvestAllReadyForUser(userId: string): Promise<Plot[]> {
    const readyPlots = await this.repo.findReadyAllForUser(userId);
    const plots = await this.repo.harvestAllReadyForUser(userId);
    await Promise.all(
      readyPlots.map(async (p) => {
        await this.activitiesService.create({
          gardenId: (p as any).gardenId,
          userId: (p as any).garden.userId,
          type: ActivityType.HARVEST,
          date: new Date(),
          comment: `Harvested ${
            (p as any).vegetable?.name || 'vegetable'
          } from plot ${(p as any).id}`,
        });
      }),
    );
    return plots;
  }

  async changeStatus(id: number, status: PlotStatus): Promise<Plot> {
    await this.findOne(id);
    return this.repo.changeStatus(id, status);
  }
}
