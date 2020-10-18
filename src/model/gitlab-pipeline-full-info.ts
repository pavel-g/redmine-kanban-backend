import { GitlabPipelineInfo } from './gitlab-pipeline-info';
import { GitlabUser } from './gitlab-user';

export type GitlabPipelineFullInfo = GitlabPipelineInfo & {
  "before_sha": string,
  "tag": boolean,
  "yaml_errors": any,
  "user": GitlabUser,
  "started_at": string,
  "finished_at": string,
  "committed_at": any,
  "duration": number,
  "coverage": any,
  "detailed_status": {
    "icon": string,
    "text": string,
    "label": string,
    "group": string,
    "tooltip": string,
    "has_details": boolean,
    "details_path": string,
    "illustration": any,
    "favicon": string
  }
}