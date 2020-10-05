import { Injectable } from '@nestjs/common';
import { BoardService } from '../board/board.service';
import { IssueParam } from '../model/issue-param';
import { RedmineIssueLoaderService } from '../redmine-issue-loader/redmine-issue-loader.service';
import { KanbanConfig } from '../model/jkanban/kanban-config';
import { BoardConfig } from '../model/jkanban/board-config';
import { ColumnParam } from '../model/column-param';
import { ItemConfig } from '../model/jkanban/item-config';
import { ConfigService } from '@nestjs/config';
import { Board } from '../model/board';
import { BoardFullInfo } from '../model/board-full-info';

@Injectable()
export class BoardDataLinkingService {

  private boardIndex = 0

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

  constructor(
    private boardService: BoardService,
    private redmineIssueLoader: RedmineIssueLoaderService,
    private configService: ConfigService
  ) {
  }

  async getData(boardId: number): Promise<BoardFullInfo> {
    const boardParams = await this.boardService.board({id: boardId})
    await this.updateAllIssueRedmineData(boardParams.config)
    const res = this.getKanbans(boardParams.config)
    const resp: BoardFullInfo = {
      id: boardParams.id,
      name: boardParams.name,
      config: boardParams,
      kanban: res
    }
    return resp
  }

  // noinspection JSMethodCanBeStatic
  private getFlatIssuesList(issueParams: IssueParam[]): IssueParam[] {
    if (!issueParams) return [];
    const res = [];
    for(let i = 0; i < issueParams.length; i++) {
      const issue = issueParams[i]
      res.push(issue)
      if (issue.children && issue.children.length > 0) {
        res.push(...issue.children)
      }
    }
    return res
  }

  private async updateAllIssueRedmineData(issueParams: IssueParam[]): Promise<void> {
    const allIssues = this.getFlatIssuesList(issueParams)
    await Promise.all(allIssues.map(async issue => {
      await this.updateIssueRedmineData(issue)
    }))
  }

  private async updateIssueRedmineData(issue: IssueParam): Promise<void> {
    issue.redmineData = await this.redmineIssueLoader.getIssueData(issue.number)
  }

  private getKanbans(issues: IssueParam[]): KanbanConfig[] {
    if (!issues) return [];
    return issues.map(issue => {
      return {
        id: issue.number,
        element: `issue_${issue.number}`,
        title: `${issue.redmineData.tracker.name} #${issue.redmineData.id}: ${issue.redmineData.subject}`,
        boards: this.getBoards(issue)
      }
    })
  }

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
    if (issue.children && issue.children.length > 0) {
      for (let i = 0; i < issue.children.length; i++) {
        const childIssue = issue.children[i]
        const childIssueStatus = childIssue.redmineData.status.name
        const column = store.find(item => item.column.status === childIssueStatus)
        if (!column) {
          continue
        }
        column.children.push(childIssue)
      }
    }
    return store.map(item => {
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
  }

  private getIssueUrl(number: string|number): string|null {
    return `${this.publicUrlPrefix}/issues/${number}`;
  }

}
