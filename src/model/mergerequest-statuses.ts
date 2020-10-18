import { GitlabPipelineInfo } from './gitlab-pipeline-info';

export type MergeRequestStatuses = {
  id: number,
  before_merge: GitlabPipelineInfo|null,
  after_merge: GitlabPipelineInfo|null
}