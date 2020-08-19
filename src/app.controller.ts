import {Controller, Get} from '@nestjs/common';
import {AppService} from './app.service';
import axios from 'axios';
import {RedmineIssueData} from './model/redmine-issue-data'
import {IssueParam} from "./model/issue-param";
import {ColumnParam} from "./model/column-param";
import {KanbanConfig} from "./model/jkanban/kanban-config";
import {BoardConfig} from "./model/jkanban/board-config";
import {ItemConfig} from "./model/jkanban/item-config";
import {ConfigService} from "@nestjs/config";

@Controller()
export class AppController {
  constructor(
      private readonly appService: AppService,
      private configService: ConfigService
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

  urlPrefix = this.configService.get<string>('REDMINE_URL_PREFIX')

  @Get('kanban-data')
  async getKanbanData(): Promise<string> {
    await this.updateAllIssueRedmineData()
    const res = this.getKanbans()
    return JSON.stringify(res)
  }

  private getUrl(issueNumber: number): string {
    if (typeof this.urlPrefix !== 'string' || this.urlPrefix.length === 0) {
      throw 'REDMINE_URL_PREFIX is undefined'
    }
    return `${this.urlPrefix}/issues/${issueNumber}.json`
  }

  private async getIssueData(issueNumber: number): Promise<RedmineIssueData|null> {
    const url = this.getUrl(issueNumber)
    const resp = await axios.get(url)
    if (!resp || !resp.data || !resp.data.issue) {
      return null
    }
    return resp.data.issue as RedmineIssueData
  }

  private async updateIssueRedmineData(issue: IssueParam): Promise<void> {
    const data = await this.getIssueData(issue.number)
    issue.redmineData = data
  }

  private async updateAllIssueRedmineData(): Promise<void> {
    const allIssues = this.getFlatIssues()
    await Promise.all(allIssues.map(async issue => {
      await this.updateIssueRedmineData(issue)
    }))
  }

  private getFlatIssues(): IssueParam[] {
    const res = [];
    for(let i = 0; i < this.issues.length; i++) {
      const issue = this.issues[i]
      res.push(issue)
      if (issue.children && issue.children.length > 0) {
        res.push.apply(res, issue.children)
      }
    }
    return res
  }

  private getKanbans(): KanbanConfig[] {
    const res: KanbanConfig[] = this.issues.map(issue => {
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
            id: `issue_${childIssue.redmineData.id}`,
            title: `${childIssue.redmineData.tracker.name} #${childIssue.redmineData.id}: ${childIssue.redmineData.subject}`
          } as ItemConfig
        })
      } as BoardConfig
    })
    return res
  }
}
