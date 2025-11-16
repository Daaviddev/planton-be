import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../services/prisma.service';
import type { Garden, Prisma } from '@prisma/client';
import { ActivityType } from '@prisma/client';

@Injectable()
export class GardensRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.GardenCreateInput): Promise<Garden> {
    return this.prisma.garden.create({
      data,
      include: {
        template: {
          include: {
            producer: true,
            allowedVegetables: { include: { vegetable: true } },
          },
        },
        plots: {
          include: {
            vegetable: true,
          },
        },
        user: true,
        activities: true,
      },
    });
  }

  async createFromTemplate(params: {
    templateId: string;
    userId?: string;
    leaseDate?: Date;
    name?: string;
  }): Promise<Garden> {
    const { templateId, userId, leaseDate, name } = params;
    const template = await this.prisma.gardenTemplate.findUnique({
      where: { id: templateId },
      select: { name: true, producerId: true },
    });
    if (!template) {
      throw new Error('Template not found');
    }
    const result = await this.prisma.$transaction(async (tx) => {
      const garden = await tx.garden.create({
        data: {
          name: name ?? template.name,
          leaseDate: leaseDate ?? new Date(),
          template: { connect: { id: templateId } },
          user: userId ? { connect: { id: userId } } : undefined,
        },
        include: {
          template: {
            include: {
              producer: true,
              allowedVegetables: { include: { vegetable: true } },
            },
          },
          plots: { include: { vegetable: true } },
          chatSessions: true,
          user: true,
          activities: true,
        },
      });
      if (userId && template.producerId) {
        await tx.chatSession.create({
          data: {
            userId,
            producerId: template.producerId,
            gardenId: garden.id,
          },
        });
      }
      return garden;
    });
    return result;
  }

  async findAll(): Promise<Garden[]> {
    return this.prisma.garden.findMany({
      include: {
        plots: {
          include: {
            vegetable: true,
          },
        },
        user: true,
        activities: true,
        chatSessions: true,
      },
    });
  }

  // gardenVegetables removed; allowed vegetables come from GardenTemplate

  async findOne(id: string): Promise<Garden | null> {
    return this.prisma.garden.findUnique({
      where: { id },
      include: {
        template: {
          include: {
            producer: true,
            allowedVegetables: { include: { vegetable: true } },
          },
        },
        plots: {
          include: {
            vegetable: true,
          },
        },
        user: true,
        activities: true,
        chatSessions: true,
      },
    });
  }

  // Find all gardens that have at least one LEASE activity created by the given user
  async findAllByLeaseUser(userId: string): Promise<Garden[]> {
    return this.prisma.garden.findMany({
      where: {
        user: {
          id: userId,
        },
      },
      include: {
        template: {
          include: {
            producer: true,
            allowedVegetables: { include: { vegetable: true } },
          },
        },
        plots: {
          include: {
            vegetable: true,
          },
        },
        activities: true,
        chatSessions: true,
      },
    });
  }

  async findAllByUser(userId: string): Promise<Garden[]> {
    return this.prisma.garden.findMany({
      where: { userId },
      include: {
        template: {
          include: {
            producer: true,
            allowedVegetables: { include: { vegetable: true } },
          },
        },
        plots: {
          include: {
            vegetable: true,
          },
        },
        activities: true,
        chatSessions: true,
      },
    });
  }

  async update(id: string, data: Prisma.GardenUpdateInput): Promise<Garden> {
    return this.prisma.garden.update({
      where: { id },
      data,
      include: {
        template: {
          include: {
            producer: true,
            allowedVegetables: { include: { vegetable: true } },
          },
        },
        plots: {
          include: {
            vegetable: true,
          },
        },
        user: true,
        activities: true,
      },
    });
  }

  async remove(id: string): Promise<Garden> {
    return this.prisma.garden.delete({ where: { id } });
  }
}
