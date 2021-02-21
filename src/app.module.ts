import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {ServeStaticModule} from "@nestjs/serve-static";
import { join } from 'path';
import {ConfigModule} from "@nestjs/config";
import { PrismaService } from './prisma/prisma.service';
import { BoardService } from './board/board.service';
import { RedisService } from './redis/redis.service';
import { RedisIssuesCacheService } from './redis-issues-cache/redis-issues-cache.service';
import { RedmineIssueLoaderService } from './redmine-issue-loader/redmine-issue-loader.service';
import { BoardDataLinkingService } from './board-data-linking/board-data-linking.service';
import { RedisUsersCacheService } from './redis-users-cache/redis-users-cache.service';
import { RedmineUsersLoaderService } from './redmine-users-loader/redmine-users-loader.service';
import { RedisMergerequestsCacheService } from './redis-mergerequests-cache/redis-mergerequests-cache.service';
import { RedisMrStatusesCacheService } from './redis-mr-statuses-cache/redis-mr-statuses-cache.service';
import { MrStatusesLoaderService } from './mr-statuses-loader/mr-statuses-loader.service';
import { FromRootGeneratorService } from './generators/from-root-generator/from-root-generator.service';
import { FromListGeneratorService } from './generators/from-list-generator/from-list-generator.service';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    ConfigModule.forRoot({
      envFilePath: ['.env.local', '.env'],
      isGlobal: true
    })
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService, BoardService, RedisService, RedisIssuesCacheService, RedmineIssueLoaderService, BoardDataLinkingService, RedisUsersCacheService, RedmineUsersLoaderService, RedisMergerequestsCacheService, RedisMrStatusesCacheService, MrStatusesLoaderService, FromRootGeneratorService, FromListGeneratorService],
})
export class AppModule implements NestModule {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  configure(consumer: MiddlewareConsumer): any {
  }
}
