import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ActivityType } from '@prisma/client';

@Injectable()
export class GardenTemplatesService {
  constructor(
    @Inject('GardenTemplatesRepository') private readonly repo: any,
    @Inject('GardensRepository') private readonly gardensRepo: any,
    @Inject('PlotsRepository') private readonly plotsRepo: any,
    @Inject('ActivitiesRepository') private readonly activitiesRepo: any,
  ) {}

  async create(dto: any) {
    const { allowedVegetableIds, ...data } = dto;
    const template = await (this.repo as any).create({
      ...data,
      allowedVegetables: allowedVegetableIds?.length
        ? {
            create: allowedVegetableIds.map((id: string) => ({
              vegetableId: id,
            })),
          }
        : undefined,
    });
    return template;
  }

  async findAll() {
    return this.repo.findAll();
  }

  async findOne(id: string) {
    const t = await this.repo.findOne(id);
    if (!t) throw new NotFoundException('Garden template not found');
    return t;
  }

  async findAllByProducer(producerId: string) {
    return this.repo.findAllByProducer(producerId);
  }

  async update(id: string, dto: any) {
    const { allowedVegetableIds, ...data } = dto;
    await this.findOne(id);
    const updated = await (this.repo as any).update(id, data);
    if (allowedVegetableIds) {
      await (this.repo as any).setAllowedVegetables(id, allowedVegetableIds);
      return this.repo.findOne(id);
    }
    return updated;
  }

  async remove(id: string) {
    await this.findOne(id);
    return (this.repo as any).remove(id);
  }

  // Create a new Garden instance from a template and a LEASE activity
  async leaseTemplate(
    templateId: string,
    dto: { name: string; userId?: string; comment?: string; date?: string },
  ) {
    const template = await this.findOne(templateId);
    const leaseDate = dto.date ? new Date(dto.date) : new Date();

    // Create the garden instance (this also creates chat session if userId and producerId exist)
    const garden = await (this.gardensRepo as any).createFromTemplate({
      templateId,
      userId: dto.userId,
      leaseDate,
      name: dto.name,
    });

    // Create default plots
    const plotCount = template.defaultPlots ?? 9;
    if ((this.plotsRepo as any)?.createManyForGarden) {
      const created = await (this.plotsRepo as any).createManyForGarden(
        garden.id,
        plotCount,
      );
      // Fallback: if createMany didn't create all plots, create the rest individually
      if (typeof created === 'number' && created < plotCount) {
        const remaining = plotCount - created;
        for (let i = 0; i < remaining; i++) {
          await (this.plotsRepo as any).create({
            status: 'EMPTY',
            garden: { connect: { id: garden.id } },
          });
        }
      }
    } else if ((this.plotsRepo as any)?.create) {
      for (let i = 0; i < plotCount; i++) {
        await (this.plotsRepo as any).create({
          status: 'EMPTY',
          garden: { connect: { id: garden.id } },
        });
      }
    }

    // Re-fetch garden to include the newly created plots in the response
    const gardenWithPlots = await (this.gardensRepo as any).findOne(garden.id);

    // Create LEASE activity for this garden
    const activity = await (this.activitiesRepo as any).create({
      type: ActivityType.LEASE,
      date: leaseDate,
      comment: dto.comment,
      garden: { connect: { id: garden.id } },
      ...(dto.userId ? { user: { connect: { id: dto.userId } } } : {}),
    });

    return { garden: gardenWithPlots ?? garden, activity };
  }
}
