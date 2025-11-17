import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../services/prisma.service';
import type { Activity, Prisma } from '@prisma/client';
import type { IActivitiesRepository } from '../../domain/contracts/activities.contract';

@Injectable()
export class ActivitiesRepository implements IActivitiesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.ActivityCreateInput): Promise<Activity> {
    return this.prisma.activity.create({
      data,
      include: {
        garden: {
          include: {
            template: { include: { producer: { include: { user: true } } } },
          },
        },
        user: true,
      },
    });
  }

  async findAll(): Promise<Activity[]> {
    return this.prisma.activity.findMany({
      include: {
        garden: {
          include: {
            template: { include: { producer: { include: { user: true } } } },
          },
        },
        user: true,
      },
    });
  }

  async findOne(id: string): Promise<Activity | null> {
    return this.prisma.activity.findUnique({
      where: { id },
      include: {
        garden: {
          include: {
            template: { include: { producer: { include: { user: true } } } },
          },
        },
        user: true,
      },
    });
  }

  async update(
    id: string,
    data: Prisma.ActivityUpdateInput,
  ): Promise<Activity> {
    return this.prisma.activity.update({
      where: { id },
      data,
      include: {
        garden: {
          include: {
            template: { include: { producer: { include: { user: true } } } },
          },
        },
        user: true,
      },
    });
  }

  async remove(id: string): Promise<Activity> {
    return this.prisma.activity.delete({
      where: { id },
      include: {
        garden: {
          include: {
            template: { include: { producer: { include: { user: true } } } },
          },
        },
        user: true,
      },
    });
  }
}
