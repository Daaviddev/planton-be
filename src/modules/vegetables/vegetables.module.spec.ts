import { Test, TestingModule } from '@nestjs/testing';
import { VegetablesModule } from './vegetables.module';
import { VEGETABLES_REPOSITORY } from '../../domain/contracts';
import { PrismaService } from '../../services/prisma.service';
import { VegetablesService } from './vegetables.service';

describe('VegetablesModule DI', () => {
  let module: TestingModule;

  beforeAll(async () => {
    const mockPrisma = {
      vegetable: {
        create: jest.fn().mockResolvedValue({ id: '1' }),
        findMany: jest.fn().mockResolvedValue([]),
        findUnique: jest.fn().mockResolvedValue(null),
        update: jest.fn().mockResolvedValue({ id: '1' }),
        delete: jest.fn().mockResolvedValue({ id: '1' }),
      },
      plot: {
        findMany: jest.fn().mockResolvedValue([]),
      },
    };

    module = await Test.createTestingModule({
      imports: [VegetablesModule],
    })
      .overrideProvider(PrismaService)
      .useValue(mockPrisma)
      .compile();

    (module as any).__mockPrisma = mockPrisma;
  });

  it('resolves VEGETABLES_REPOSITORY provider', () => {
    const repo = module.get(VEGETABLES_REPOSITORY as any);
    expect(repo).toBeDefined();
    expect(typeof repo.create).toBe('function');
    expect(typeof repo.findAll).toBe('function');
  });

  it('resolves VegetablesService and methods', () => {
    const service = module.get<VegetablesService>(VegetablesService);
    expect(service).toBeDefined();
    expect(typeof service.create).toBe('function');
    expect(typeof service.findAll).toBe('function');

    return (async () => {
      const mockPrisma = (module as any).__mockPrisma;

      await service.create({ id: 'sample' } as any);
      expect(mockPrisma.vegetable.create).toHaveBeenCalled();

      await service.findAll();
      expect(mockPrisma.vegetable.findMany).toHaveBeenCalled();
    })();
  });

  afterAll(async () => {
    await module.close();
  });
});
