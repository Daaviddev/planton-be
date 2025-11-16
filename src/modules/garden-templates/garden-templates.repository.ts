import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../services/prisma.service';

@Injectable()
export class GardenTemplatesRepository {
  constructor(private readonly prisma: PrismaService) {}

  includeTree() {
    return {
      producer: true,
      allowedVegetables: { include: { vegetable: true } },
      leases: true,
    } as const;
  }

  async create(data: any) {
    return (this.prisma as any).gardenTemplate.create({
      data,
      include: this.includeTree(),
    });
  }

  async findAll() {
    return (this.prisma as any).gardenTemplate.findMany({
      include: this.includeTree(),
    });
  }

  async findOne(id: string) {
    return (this.prisma as any).gardenTemplate.findUnique({
      where: { id },
      include: this.includeTree(),
    });
  }

  async findAllByProducer(producerId: string) {
    return (this.prisma as any).gardenTemplate.findMany({
      where: { producerId },
      include: this.includeTree(),
    });
  }

  async update(id: string, data: any) {
    return (this.prisma as any).gardenTemplate.update({
      where: { id },
      data,
      include: this.includeTree(),
    });
  }

  async setAllowedVegetables(id: string, vegetableIds: string[]) {
    // replace allowed vegetables
    await (this.prisma as any).gardenVegetable.deleteMany({
      where: { templateId: id },
    });
    if (vegetableIds.length) {
      await (this.prisma as any).gardenTemplate.update({
        where: { id },
        data: {
          allowedVegetables: {
            create: vegetableIds.map((vid) => ({ vegetableId: vid })),
          },
        },
      });
    }
  }

  async remove(id: string) {
    return (this.prisma as any).gardenTemplate.delete({ where: { id } });
  }
}
