import { Test, TestingModule } from '@nestjs/testing';
import { ActivitiesModule } from './activities.module';
import { ACTIVITIES_REPOSITORY } from '../../domain/contracts';
import { PrismaService } from '../../services/prisma.service';
import { ActivitiesService } from './activities.service';

describe('ActivitiesModule DI', () => {
  let module: TestingModule;

  beforeAll(async () => {
    const mockPrisma = {
      activity: {
        create: jest.fn().mockResolvedValue({ id: '1' }),
        findMany: jest.fn().mockResolvedValue([]),
        findUnique: jest.fn().mockResolvedValue(null),
        update: jest.fn().mockResolvedValue({ id: '1' }),
        delete: jest.fn().mockResolvedValue({ id: '1' }),
      },
    };

    module = await Test.createTestingModule({
      imports: [ActivitiesModule],
    })
      .overrideProvider(PrismaService)
      .useValue(mockPrisma)
      .compile();

    // expose mocks for assertions
    (module as any).__mockPrisma = mockPrisma;
  });

  it('resolves ACTIVITIES_REPOSITORY provider', () => {
    const repo = module.get(ACTIVITIES_REPOSITORY as any);
    expect(repo).toBeDefined();
    expect(typeof repo.create).toBe('function');
    expect(typeof repo.findAll).toBe('function');
  });

  it('resolves ActivitiesService and methods', () => {
    const service = module.get<ActivitiesService>(ActivitiesService);
    expect(service).toBeDefined();
    expect(typeof service.create).toBe('function');
    expect(typeof service.findAll).toBe('function');

    // call service methods and assert underlying Prisma calls
    return (async () => {
      const mockPrisma = (module as any).__mockPrisma;

      await service.create({ id: 'sample' } as any);
      expect(mockPrisma.activity.create).toHaveBeenCalled();

      await service.findAll();
      expect(mockPrisma.activity.findMany).toHaveBeenCalled();
    })();
  });

  afterAll(async () => {
    await module.close();
  });
});
