import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export type BoardWhereUniqInput = {
  id?: number|null,
  name?: string|null
}

export type Board = {
  id: number,
  name: string,
  config?: string|null
}

@Injectable()
export class BoardService {

  constructor(private prisma: PrismaService) {
  }

  async board(where: BoardWhereUniqInput): Promise<Board|null> {
    return await this.prisma.board.findOne({where: where})
  }

  async boards(): Promise<Board[]> {
    return await this.prisma.board.findMany(
      {
        select: {id: true, name: true, config: false}
      }
    )
  }

}
