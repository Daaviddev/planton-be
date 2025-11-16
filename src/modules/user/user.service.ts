import { Injectable, Inject } from '@nestjs/common';
import { type UserRepository } from './user.repository';
import type { User } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(
    @Inject('UserRepository') private readonly userRepository: UserRepository,
  ) {}

  async findAll(): Promise<User[]> {
    return this.userRepository.findAll();
  }

  async findOne(id: string): Promise<User | null> {
    return this.userRepository.findOne(id);
  }

  async findFirst(): Promise<User | null> {
    return this.userRepository.findFirst();
  }

  async create(
    data: Omit<User, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<User> {
    return this.userRepository.create(data);
  }

  async update(id: string, data: Partial<User>): Promise<User> {
    return this.userRepository.update(id, data);
  }

  async remove(id: string): Promise<User> {
    return this.userRepository.remove(id);
  }
}
