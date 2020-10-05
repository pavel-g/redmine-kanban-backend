import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { IssueParam } from '../model/issue-param';
import { Board } from '../model/board';

export type BoardWhereUniqInput = {
  id?: number|null,
  name?: string|null
}

export type BoardCreateInput = {
  name: string,
  config?: IssueParam[]|null
}

export type BoardUpdateInput = {
  name?: string|null,
  config?: IssueParam[]|null
}

@Injectable()
export class BoardService {

  constructor(private prisma: PrismaService) {
  }

  async board(where: BoardWhereUniqInput): Promise<Board|null> {
    const dbData = await this.prisma.board.findOne({where: where})
    return {
      id: dbData.id,
      name: dbData.name,
      config: JSON.parse(dbData.config)
    }
  }

  async boards(): Promise<Board[]> {
    return await this.prisma.board.findMany(
      {
        select: {id: true, name: true, config: false}
      }
    )
  }

  async create(data: BoardCreateInput): Promise<void> {
    const dbData = {
      name: data.name,
      config: JSON.stringify(data.config) // TODO: 2020-10-04 Добавить фильтрацию полей и валидацию данных
    }
    await this.prisma.board.create({data: dbData})
  }

  async update(id: number, data: BoardUpdateInput): Promise<void> {
    const dbData = {}
    if (data.name || data.name === null) {
      dbData['name'] = data.name
    }
    if (data.config || data.config === null) {
      dbData['config'] = JSON.stringify(data.config) // TODO: 2020-10-04 Добавить фильтрацию полей и валидацию данных
    }
    await this.prisma.board.update({
      where: {id: id},
      data: dbData
    })
  }

}
