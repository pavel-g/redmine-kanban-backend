import { Test, TestingModule } from '@nestjs/testing';
import { RedmineIssueLoaderService } from './redmine-issue-loader.service';

describe('RedmineIssueLoaderService', () => {
  let service: RedmineIssueLoaderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RedmineIssueLoaderService],
    }).compile();

    service = module.get<RedmineIssueLoaderService>(RedmineIssueLoaderService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
