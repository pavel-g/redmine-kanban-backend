import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {ServeStaticModule} from "@nestjs/serve-static";
import { join } from 'path';
import {ConfigModule} from "@nestjs/config";
import { PrismaService } from './prisma/prisma.service';
import { BoardService } from './board/board.service';

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
  providers: [AppService, PrismaService, BoardService],
})
export class AppModule implements NestModule {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  configure(consumer: MiddlewareConsumer): any {
  }
}
