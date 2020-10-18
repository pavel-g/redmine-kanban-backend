import { Injectable } from '@nestjs/common';
import { RedmineIssueData } from '../model/redmine-issue-data';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';
import { RedisIssuesCacheService } from '../redis-issues-cache/redis-issues-cache.service';
import { AllIssuesData } from '../model/all-issues-data';
import { RedisMergerequestsCacheService } from '../redis-mergerequests-cache/redis-mergerequests-cache.service';
import { MergeRequestStatuses } from '../model/mergerequest-statuses';
import { MrStatusesLoaderService } from '../mr-statuses-loader/mr-statuses-loader.service';
import { IssueNumberAndMrInfo } from '../model/issuenumber-and-mr-info';

@Injectable()
export class RedmineIssueLoaderService {

  constructor(
    private configService: ConfigService,
    private redisIssuesCache: RedisIssuesCacheService,
    private redisMergerequestsCache: RedisMergerequestsCacheService,
    private mrStatusesLoader: MrStatusesLoaderService
  ) {
  }

  urlPrefix = this.configService.get<string>('REDMINE_URL_PREFIX')
  gitlabMergeRequestPrefix = this.configService.get<string>('GITLAB_MERGE_REQUEST_PREFIX', 'https://gitlab.com/your-group/your-project/-/merge_requests/')

  private gitlabNumberRegexp = /^[0-9]*\b/

  async getIssuesData(numbers: number[]): Promise<RedmineIssueData[]> {
    const promises = numbers.map(issueNumber => this.getIssueData(issueNumber))
    return await Promise.all(promises)
  }

  async getIssueData(issueNumber: number): Promise<RedmineIssueData|null> {
    const issueExistsInRedis = await this.redisIssuesCache.exists(issueNumber)
    if (issueExistsInRedis) {
      return await this.redisIssuesCache.get(issueNumber)
    }
    const url = this.getUrl(issueNumber)
    const resp = await axios.get(url)
    if (!resp || !resp.data || !resp.data.issue) {
      return null
    }
    const data = resp.data.issue as RedmineIssueData
    await this.redisIssuesCache.save(issueNumber, data)
    return data
  }

  async getChildren(issueNumber: number): Promise<number[]> {
    const data = await this.getIssueData(issueNumber)
    if (!data.children) {
      return null
    }
    const children = data.children
    return children.map(item => item.id)
  }

  async getMergeRequests(issueNumber: number): Promise<number[]> {
    const mrExists = await this.redisMergerequestsCache.exists(issueNumber)
    if (mrExists) {
      return await this.redisMergerequestsCache.get(issueNumber)
    }

    const data = await this.getIssueData(issueNumber)
    if (!data.journals) {
      return []
    }

    const journals = data.journals
    const comments = journals.filter(item => typeof item.notes === 'string').map(item => item.notes) as string[]

    const res = this.searchAllGitlabMergeRequests(comments)
    this.redisMergerequestsCache.save(issueNumber, res)
    return res
  }

  async getMergeRequestsInfo(issueNumber: number): Promise<MergeRequestStatuses[]> {
    const mrIds = await this.getMergeRequests(issueNumber)
    return await this.mrStatusesLoader.getAllMrStatuses(mrIds)
  }

  async getMergeRequestsInfoForAllIssues(ids: number[]): Promise<IssueNumberAndMrInfo[]> {
    const createPromise = async (issueNumber: number): Promise<IssueNumberAndMrInfo> => {
      const mrsInfo = await this.getMergeRequestsInfo(issueNumber)
      return {issueNumber: issueNumber, mergeRequestsInfo: mrsInfo}
    }
    const promises = ids.map(id => createPromise(id))
    return await Promise.all(promises)
  }

  private searchGitlabMergeRequest(comment: string): number[] {
    const parts = comment.split(this.gitlabMergeRequestPrefix)
    if (parts.length <= 1) {
      return []
    }

    parts.splice(0, 1)
    const res = parts
      .map(part => {
        const results = part.match(this.gitlabNumberRegexp)
        if (results && results.length > 0) {
          return Number(results[0])
        }
      })
      .filter(num => Number.isFinite(num)) as number []

    return res
  }

  private searchAllGitlabMergeRequests(comments: string[]): number[] {
    const res: number[] = []
    comments
      .map(comment => this.searchGitlabMergeRequest(comment))
      .forEach(mrs => {
        res.push(...mrs)
      })
    return res
  }

  private getUrl(issueNumber: number): string {
    if (typeof this.urlPrefix !== 'string' || this.urlPrefix.length === 0) {
      throw 'REDMINE_URL_PREFIX is undefined'
    }
    return `${this.urlPrefix}/issues/${issueNumber}.json?include=children,journals`
  }

}
