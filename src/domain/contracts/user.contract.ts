import type { User, Prisma } from '@prisma/client';

export const USERS_REPOSITORY = Symbol('USERS_REPOSITORY');

export interface IUsersRepository {
  findAll(): Promise<User[]>;
  findOne(id: string): Promise<User | null>;
  findFirst(): Promise<User | null>;
  create(data: Prisma.UserCreateInput | Partial<User>): Promise<User>;
  update(id: string, data: Partial<User>): Promise<User>;
  remove(id: string): Promise<User>;
}
