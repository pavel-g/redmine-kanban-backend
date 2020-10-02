import { Test, TestingModule } from '@nestjs/testing';
import { BoardDataLinkingService } from './board-data-linking.service';

describe('BoardDataLinkingService', () => {
  let service: BoardDataLinkingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BoardDataLinkingService],
    }).compile();

    service = module.get<BoardDataLinkingService>(BoardDataLinkingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
