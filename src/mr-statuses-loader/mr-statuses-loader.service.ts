import { Injectable } from '@nestjs/common';
import { RedisMrStatusesCacheService } from '../redis-mr-statuses-cache/redis-mr-statuses-cache.service';
import { MergeRequestStatuses } from '../model/mergerequest-statuses';
import { ConfigService } from '@nestjs/config';
import { GitlabMergerequestInfo } from '../model/gitlab-mergerequest-info';
import axios from 'axios';
import { GitlabPipelineInfo } from '../model/gitlab-pipeline-info';
import { GitlabCommitInfo } from '../model/gitlab-commit-info';

@Injectable()
export class MrStatusesLoaderService {

  private gitlabApiUrl = this.configService.get<string>('GITLAB_API_URL')
  private gitlabToken = this.configService.get<string>('GITLAB_TOKEN')
  private gitlabProjectId = this.configService.get<number>('GITLAB_PROJECT_ID')
  private checked = false

  constructor(
    private redisMrStatusesCache: RedisMrStatusesCacheService,
    private configService: ConfigService
  ) {
  }

  async getMrStatuses(mrId: number): Promise<MergeRequestStatuses> {

    const mrStatusesExists = await this.redisMrStatusesCache.exists(mrId)
    if (mrStatusesExists) {
      return await this.redisMrStatusesCache.get(mrId)
    }

    const saveAndReturn = async (res: MergeRequestStatuses) => {
      await this.redisMrStatusesCache.save(mrId, res)
      return res
    }

    const res: MergeRequestStatuses = { id: mrId, after_merge: null, before_merge: null }

    const mrInfo = await this.getMrInfo(mrId)
    if (!mrInfo) {
      return await saveAndReturn(res);
    }

    const pipelineBefore = this.getPipelineBefore(mrInfo)
    if (pipelineBefore) {
      res.before_merge = pipelineBefore
    }

    const mergeCommit = this.getMergeCommit(mrInfo)
    if (!mergeCommit) {
      return await saveAndReturn(res);
    }

    const mrCommitInfo = await this.getMergeCommitInfo(mergeCommit)
    if (!mrCommitInfo || !mrCommitInfo.last_pipeline) {
      return await saveAndReturn(res);
    }

    res.after_merge = mrCommitInfo.last_pipeline
    return await saveAndReturn(res)

  }

  async getAllMrStatuses(mrIds: number[]): Promise<MergeRequestStatuses[]> {
    const promises = mrIds.map(mrId => this.getMrStatuses(mrId))
    return await Promise.all(promises)
  }

  private async getMrInfo(mrId: number): Promise<GitlabMergerequestInfo|null> {
    const url = `${this.gitlabApiUrl}/projects/${this.gitlabProjectId}/merge_requests/${mrId}`
    const resp = await axios.get<GitlabMergerequestInfo>(url, this.getConfig())
    return resp.data ? resp.data : null
  }

  private getPipelineBefore(mr: GitlabMergerequestInfo): GitlabPipelineInfo|null {
    return mr.pipeline || null
  }

  private getMergeCommit(mr: GitlabMergerequestInfo): string|null {
    return mr.merge_commit_sha || null
  }

  private async getMergeCommitInfo(commit: string): Promise<GitlabCommitInfo|null> {
    const url = `${this.gitlabApiUrl}/projects/${this.gitlabProjectId}/repository/commits/${commit}`
    const resp = await axios.get<GitlabCommitInfo>(url, this.getConfig())
    return resp.data || null
  }

  private checkProperties(): void {
    if (this.checked) return
    if (typeof this.gitlabApiUrl !== 'string' || this.gitlabApiUrl.length === 0) {
      throw new Error('Param GITLAB_API_URL undefined')
    }
    if (typeof this.gitlabToken !== 'string' || this.gitlabToken.length === 0) {
      throw new Error('Param GITLAB_TOKEN undefined')
    }
    if (typeof this.gitlabProjectId !== 'number') {
      throw new Error('Param GITLAB_PROJECT_ID undefined')
    }
    this.checked = true
  }

  private getConfig(): any {
    return {
      headers: {
        'Authorization': `Bearer ${this.gitlabToken}`
      }
    }
  }

}
