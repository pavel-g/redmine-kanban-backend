import { Test, TestingModule } from '@nestjs/testing';
import { MrStatusesLoaderService } from './mr-statuses-loader.service';

describe('MrStatusesLoaderService', () => {
  let service: MrStatusesLoaderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MrStatusesLoaderService],
    }).compile();

    service = module.get<MrStatusesLoaderService>(MrStatusesLoaderService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
