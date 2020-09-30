import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import {AppService} from './app.service';
import {IssueParam} from "./model/issue-param";
import {ColumnParam} from "./model/column-param";
import {KanbanConfig} from "./model/jkanban/kanban-config";
import {BoardConfig} from "./model/jkanban/board-config";
import {ItemConfig} from "./model/jkanban/item-config";
import {ConfigService} from "@nestjs/config";
import { Board, BoardCreateInput, BoardService, BoardUpdateInput } from './board/board.service';
import demoData from "./demo-data"
import { RedmineIssueLoaderService } from './redmine-issue-loader/redmine-issue-loader.service';

@Controller()
export class AppController {
  constructor(
      private readonly appService: AppService,
      private configService: ConfigService,
      private boardService: BoardService,
      private redmineIssueLoader: RedmineIssueLoaderService
  ) {}

  issues: IssueParam[] = [
    {
      number: 155595,
      children: [
        {
          number: 156073
        }
      ]
    },
    {
      number: 148659,
      children: [{number: 141357}, {number: 148662}]
    },
    {
      number: 152467,
      children: [
        {number: 152469},
        {number: 152470},
        {number: 152471},
        {number: 152474},
        {number: 154904}
      ]
    },
    {
      number: 154311,
      children: [
        {number: 153824},
        {number: 154456},
        {number: 154561},
        {number: 154787},
        {number: 155567}
      ]
    }
  ]

  columns: ColumnParam[] = [
    'New',
    'In Progress',
    'Feedback',
    'Re-opened',
    'Code Review',
    'Wait Release',
    'Pending',
    'Resolved',
    'Testing',
    'Confirming',
    'Closed',
    'Rejected',
    'Frozen',
  ].map(name => {return {name: name, status: name}})

  publicUrlPrefix = this.configService.get<string>('REDMINE_PUBLIC_URL_PREFIX')

  @Get('kanban-data')
  async getKanbanData(): Promise<string> {
    // await this.updateAllIssueRedmineData()
    // const res = this.getKanbans()
    const res = demoData
    return JSON.stringify(res)
  }

  @Get('boards')
  async getAllBoards(): Promise<string> {
    const resp = await this.boardService.boards()
    return JSON.stringify(resp)
  }

  @Get('board/:id')
  async getOneBoard(@Param('id') id: string): Promise<string> {
    const resp = await this.boardService.board({id: Number(id)})
    return JSON.stringify(resp)
  }

  @Get('board/:id/kanban')
  async getOneBoardKanbanInfo(@Param('id') id: string): Promise<string> {
    const boardParams = await this.boardService.board({id: Number(id)})
    await this.updateAllIssueRedmineData(boardParams.config)
    const res = this.getKanbans(boardParams.config)
    const resp: Board = {
      id: boardParams.id,
      name: boardParams.name,
      config: res
    }
    return JSON.stringify(resp)
  }

  @Post('board/create')
  async createBoard(@Body() data: BoardCreateInput): Promise<void> {
    await this.boardService.create(data)
  }

  @Post('board/:id/update')
  async updateBoard(@Param('id') id: string, @Body() data: BoardUpdateInput): Promise<void> {
    await this.boardService.update(Number(id), data)
  }

  private async updateIssueRedmineData(issue: IssueParam): Promise<void> {
    const data = await this.redmineIssueLoader.getIssueData(issue.number)
    issue.redmineData = data
  }

  private async updateAllIssueRedmineData(issues: IssueParam[]): Promise<void> {
    const allIssues = this.getFlatIssues(issues)
    await Promise.all(allIssues.map(async issue => {
      await this.updateIssueRedmineData(issue)
    }))
  }

  private getFlatIssues(issues: IssueParam[]): IssueParam[] {
    const res = [];
    for(let i = 0; i < issues.length; i++) {
      const issue = issues[i]
      res.push(issue)
      if (issue.children && issue.children.length > 0) {
        res.push(...issue.children)
      }
    }
    return res
  }

  private getKanbans(issues: IssueParam[]): KanbanConfig[] {
    const res: KanbanConfig[] = issues.map(issue => {
      return {
        id: issue.number,
        element: `issue_${issue.number}`,
        title: `${issue.redmineData.tracker.name} #${issue.redmineData.id}: ${issue.redmineData.subject}`,
        boards: this.getBoards(issue)
      }
    })

    return res
  }

  private boardIndex = 0
  private getBoardUniqId(): string {
    this.boardIndex++
    return `board_${this.boardIndex}`
  }

  private getBoards(issue: IssueParam): BoardConfig[] {
    const store: {column: ColumnParam, issue: IssueParam, children: IssueParam[]}[] = []
    for (let i = 0; i < this.columns.length; i++) {
      const column = this.columns[i]
      store.push({column: column, issue: issue, children: []})
    }
    for (let i = 0; i < issue.children.length; i++) {
      const childIssue = issue.children[i]
      const childIssueStatus = childIssue.redmineData.status.name
      const column = store.find(item => item.column.status === childIssueStatus)
      if (!column) {
        continue
      }
      column.children.push(childIssue)
    }
    const res: BoardConfig[] = store.map(item => {
      return {
        id: this.getBoardUniqId(),
        title: item.column.name || item.issue.redmineData.status.name,
        item: item.children.map(childIssue => {
          return {
            id: `${childIssue.redmineData.id}`,
            title: `${childIssue.redmineData.tracker.name} #${childIssue.redmineData.id}`,
            description: childIssue.redmineData.subject,
            url: this.getIssueUrl(childIssue.redmineData.id)
          } as ItemConfig
        })
      } as BoardConfig
    })
    return res
  }

  private getIssueUrl(number: string|number): string|null {
    return `${this.publicUrlPrefix}/issues/${number}`;
  }
}
