import { Test, TestingModule } from '@nestjs/testing';
import { ProducersModule } from './producers.module';
import { PRODUCERS_REPOSITORY } from '../../domain/contracts';
import { PrismaService } from '../../services/prisma.service';
import { ProducersService } from './producers.service';

describe('ProducersModule DI', () => {
  let module: TestingModule;

  beforeAll(async () => {
    const mockPrisma = {
      producer: {
        create: jest.fn().mockResolvedValue({ id: '1' }),
        findMany: jest.fn().mockResolvedValue([]),
        findUnique: jest.fn().mockResolvedValue(null),
        update: jest.fn().mockResolvedValue({ id: '1' }),
        delete: jest.fn().mockResolvedValue({ id: '1' }),
      },
    };

    module = await Test.createTestingModule({
      imports: [ProducersModule],
    })
      .overrideProvider(PrismaService)
      .useValue(mockPrisma)
      .compile();

    (module as any).__mockPrisma = mockPrisma;
  });

  it('resolves PRODUCERS_REPOSITORY provider', () => {
    const repo = module.get(PRODUCERS_REPOSITORY as any);
    expect(repo).toBeDefined();
    expect(typeof repo.create).toBe('function');
    expect(typeof repo.findAll).toBe('function');
  });

  it('resolves ProducersService and methods', () => {
    const service = module.get<ProducersService>(ProducersService);
    expect(service).toBeDefined();
    expect(typeof service.create).toBe('function');
    expect(typeof service.findAll).toBe('function');

    return (async () => {
      const mockPrisma = (module as any).__mockPrisma;

      await service.create({ id: 'sample' } as any);
      expect(mockPrisma.producer.create).toHaveBeenCalled();

      await service.findAll();
      expect(mockPrisma.producer.findMany).toHaveBeenCalled();
    })();
  });

  afterAll(async () => {
    await module.close();
  });
});
