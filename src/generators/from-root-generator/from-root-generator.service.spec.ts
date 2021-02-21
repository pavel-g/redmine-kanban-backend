import { Test, TestingModule } from '@nestjs/testing';
import { FromRootGeneratorService } from './from-root-generator.service';

describe('FromRootGeneratorService', () => {
  let service: FromRootGeneratorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FromRootGeneratorService],
    }).compile();

    service = module.get<FromRootGeneratorService>(FromRootGeneratorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
