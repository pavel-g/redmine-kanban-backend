import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import {AppService} from './app.service';
import { BoardCreateInput, BoardService, BoardUpdateInput } from './board/board.service';
import demoData from "./demo-data"
import { RedmineIssueLoaderService } from './redmine-issue-loader/redmine-issue-loader.service';
import { BoardDataLinkingService } from './board-data-linking/board-data-linking.service';
import { RedmineUsersLoaderService } from './redmine-users-loader/redmine-users-loader.service';
import { MrStatusesLoaderService } from './mr-statuses-loader/mr-statuses-loader.service';

@Controller()
export class AppController {
  constructor(
      private readonly appService: AppService,
      private boardService: BoardService,
      private redmineIssueLoader: RedmineIssueLoaderService,
      private boardDataLinking: BoardDataLinkingService,
      private redmineUsersLoader: RedmineUsersLoaderService,
      private mrStatusesLoader: MrStatusesLoaderService
  ) {}

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
    const resp = await this.boardDataLinking.getData(Number(id))
    return JSON.stringify(resp)
  }

  @Get('issue/:id')
  async getIssueInfo(@Param('id') id: string): Promise<string> {
    const data = await this.redmineIssueLoader.getIssueData(Number(id))
    return JSON.stringify(data)
  }

  @Get('issue/:id/children')
  async getIssueChildren(@Param('id') id: number): Promise<string> {
    const data = await this.redmineIssueLoader.getChildren(id)
    return JSON.stringify(data)
  }

  @Get('issue/:id/merge-requests')
  async getIssueMergeRequests(@Param('id') id: number): Promise<string> {
    const data = await this.redmineIssueLoader.getMergeRequests(id)
    return JSON.stringify(data)
  }

  @Post('issues')
  async getIssuesInfo(@Body() body: number[]): Promise<string> {
    const data = await this.redmineIssueLoader.getIssuesData(body)
    return JSON.stringify(data)
  }

  @Post('board/create')
  async createBoard(@Body() data: BoardCreateInput): Promise<void> {
    await this.boardService.create(data)
  }

  @Post('board/:id/update')
  async updateBoard(@Param('id') id: string, @Body() data: BoardUpdateInput): Promise<void> {
    await this.boardService.update(Number(id), data)
  }

  @Get('user/:id')
  async getUser(@Param('id') userId: number): Promise<string> {
    const data = await this.redmineUsersLoader.getUserData(userId)
    return JSON.stringify(data)
  }

  @Post('users')
  async getUsers(@Body() body: number[]): Promise<string> {
    const data = await this.redmineUsersLoader.getUsersData(body)
    return JSON.stringify(data)
  }

  @Get('merge-request/:id')
  async getMergeRequest(@Param('id') mrId: number): Promise<string> {
    const data = await this.mrStatusesLoader.getMrStatuses(mrId)
    return JSON.stringify(data)
  }

  @Post('merge-requests')
  async getMergeRequests(@Body() mrIds: number[]): Promise<string> {
    const data = await this.mrStatusesLoader.getAllMrStatuses(mrIds)
    return JSON.stringify(data)
  }

}
