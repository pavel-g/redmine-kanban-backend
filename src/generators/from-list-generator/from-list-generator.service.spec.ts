import { Test, TestingModule } from '@nestjs/testing';
import { FromListGeneratorService } from './from-list-generator.service';

describe('FromListGeneratorService', () => {
  let service: FromListGeneratorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FromListGeneratorService],
    }).compile();

    service = module.get<FromListGeneratorService>(FromListGeneratorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
