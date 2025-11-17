import { Test, TestingModule } from '@nestjs/testing';
import { UserModule } from './user.module';
import { USERS_REPOSITORY } from '../../domain/contracts';
import { PrismaService } from '../../services/prisma.service';
import { UserService } from './user.service';

describe('UserModule DI', () => {
  let module: TestingModule;

  beforeAll(async () => {
    const mockPrisma = {
      user: {
        create: jest.fn().mockResolvedValue({ id: '1' }),
        findMany: jest.fn().mockResolvedValue([]),
        findUnique: jest.fn().mockResolvedValue(null),
        findFirst: jest.fn().mockResolvedValue(null),
        update: jest.fn().mockResolvedValue({ id: '1' }),
        delete: jest.fn().mockResolvedValue({ id: '1' }),
      },
    };

    module = await Test.createTestingModule({
      imports: [UserModule],
    })
      .overrideProvider(PrismaService)
      .useValue(mockPrisma)
      .compile();

    (module as any).__mockPrisma = mockPrisma;
  });

  it('resolves USERS_REPOSITORY provider', () => {
    const repo = module.get(USERS_REPOSITORY as any);
    expect(repo).toBeDefined();
    expect(typeof repo.create).toBe('function');
    expect(typeof repo.findAll).toBe('function');
  });

  it('resolves UserService and methods', () => {
    const service = module.get<UserService>(UserService);
    expect(service).toBeDefined();
    expect(typeof service.create).toBe('function');
    expect(typeof service.findAll).toBe('function');

    return (async () => {
      const mockPrisma = (module as any).__mockPrisma;

      await service.create({ id: 'sample' } as any);
      expect(mockPrisma.user.create).toHaveBeenCalled();

      await service.findAll();
      expect(mockPrisma.user.findMany).toHaveBeenCalled();
    })();
  });

  afterAll(async () => {
    await module.close();
  });
});
