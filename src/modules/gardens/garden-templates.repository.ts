import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../services/prisma.service';

@Injectable()
export class GardenTemplatesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findOne(id: string): Promise<any> {
    return (this.prisma as any).gardenTemplate.findUnique({
      where: { id },
      include: {
        allowedVegetables: true,
        producer: true,
      },
    }) as any;
  }

  async findAllByProducer(producerId: string) {
    return (this.prisma as any).gardenTemplate.findMany({
      where: { producerId },
      include: { allowedVegetables: true },
    });
  }
}
