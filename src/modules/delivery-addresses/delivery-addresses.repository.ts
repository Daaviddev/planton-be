import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../services/prisma.service';
import type { DeliveryAddress, Prisma } from '@prisma/client';

@Injectable()
export class DeliveryAddressesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    data: Prisma.DeliveryAddressCreateInput,
  ): Promise<DeliveryAddress> {
    return this.prisma.deliveryAddress.create({ data });
  }

  async findAll(): Promise<DeliveryAddress[]> {
    return this.prisma.deliveryAddress.findMany();
  }

  async findOne(id: string): Promise<DeliveryAddress | null> {
    return this.prisma.deliveryAddress.findUnique({ where: { id } });
  }

  async update(
    id: string,
    data: Prisma.DeliveryAddressUpdateInput,
  ): Promise<DeliveryAddress> {
    return this.prisma.deliveryAddress.update({ where: { id }, data });
  }

  async remove(id: string): Promise<DeliveryAddress> {
    return this.prisma.deliveryAddress.delete({ where: { id } });
  }
}
