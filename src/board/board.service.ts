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
    if (!dbData) {
      return null
    }
    return {
      id: dbData.id,
      name: dbData.name,
      config: (typeof dbData.config === 'string' && dbData.config.length > 0) ? JSON.parse(dbData.config) : null
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
      config: data.config ? JSON.stringify(this.clearConfig(data.config)) : ""
    }
    await this.prisma.board.create({data: dbData})
  }

  async update(id: number, data: BoardUpdateInput): Promise<void> {
    const dbData = {}
    if (data.name || data.name === null) {
      dbData['name'] = data.name
    }
    if (data.config || data.config === null) {
      dbData['config'] = JSON.stringify(this.clearConfig(data.config))
    }
    await this.prisma.board.update({
      where: {id: id},
      data: dbData
    })
  }

  private clearConfig(config: IssueParam[]): IssueParam[] {
    return config.map(item => {
      return this.clearConfigItem(item)
    })
  }

  private clearConfigItem(item: IssueParam): IssueParam {
    const res: IssueParam = {}
    if (typeof item.number === 'number') res.number = item.number
    if (typeof item.title === 'string') res.title = item.title
    if (item.children) res.children = this.clearConfig(item.children)
    return res
  }

}
