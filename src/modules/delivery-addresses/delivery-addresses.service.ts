import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import type { DeliveryAddress } from '@prisma/client';

@Injectable()
export class DeliveryAddressesService {
  constructor(
    @Inject('DeliveryAddressesRepository') private readonly repo: any,
  ) {}

  async create(data: Partial<DeliveryAddress>): Promise<DeliveryAddress> {
    return this.repo.create(data);
  }

  async findAll(): Promise<DeliveryAddress[]> {
    return this.repo.findAll();
  }

  async findOne(id: string): Promise<DeliveryAddress> {
    const item = await this.repo.findOne(id);
    if (!item) throw new NotFoundException('DeliveryAddress not found');
    return item;
  }

  async update(
    id: string,
    data: Partial<DeliveryAddress>,
  ): Promise<DeliveryAddress> {
    await this.findOne(id);
    return this.repo.update(id, data);
  }

  async remove(id: string): Promise<DeliveryAddress> {
    await this.findOne(id);
    return this.repo.remove(id);
  }
}
