import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {

  async onModuleDestroy(): Promise<void> {
    await this.$connect()
  }

  async onModuleInit(): Promise<any> {
    await this.$disconnect()
  }

}
