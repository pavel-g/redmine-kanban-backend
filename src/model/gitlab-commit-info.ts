import { GitlabPipelineInfo } from './gitlab-pipeline-info';

export type GitlabCommitInfo = {
  "id": string,
  "short_id": string,
  "created_at": string,
  "parent_ids": string[],
  "title": string,
  "message": string,
  "author_name": string,
  "author_email": string,
  "authored_date": string,
  "committer_name": string,
  "committer_email": string,
  "committed_date": string,
  "web_url": string,
  "stats": {
    "additions": number,
    "deletions": number,
    "total": number
  },
  "status": string,
  "project_id": number,
  "last_pipeline": GitlabPipelineInfo
}