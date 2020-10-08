import { Test, TestingModule } from '@nestjs/testing';
import { RedmineUsersLoaderService } from './redmine-users-loader.service';

describe('RedmineUsersLoaderService', () => {
  let service: RedmineUsersLoaderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RedmineUsersLoaderService],
    }).compile();

    service = module.get<RedmineUsersLoaderService>(RedmineUsersLoaderService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
