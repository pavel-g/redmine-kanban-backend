import { GitlabUser } from './gitlab-user';
import { GitlabPipelineInfo } from './gitlab-pipeline-info';
import { GitlabPipelineFullInfo } from './gitlab-pipeline-full-info';

export type GitlabMergerequestInfo = {
  "id": number,
  "iid": number,
  "project_id": number,
  "title": string,
  "description": string,
  "state": string,
  "created_at": string,
  "updated_at": string,
  "merged_by": GitlabUser,
  "merged_at": string,
  "closed_by": any,
  "closed_at": any,
  "target_branch": string,
  "source_branch": string,
  "user_notes_count": number,
  "upvotes": number,
  "downvotes": number,
  "assignee": GitlabUser,
  "author": GitlabUser,
  "assignees": GitlabUser[],
  "source_project_id": number,
  "target_project_id": number,
  "labels": any[],
  "work_in_progress": boolean,
  "milestone": any,
  "merge_when_pipeline_succeeds": boolean,
  "merge_status": string,
  "sha": string,
  "merge_commit_sha": string,
  "squash_commit_sha": any,
  "discussion_locked": any,
  "should_remove_source_branch": any,
  "force_remove_source_branch": boolean,
  "reference": string,
  "references": {
    "short": string,
    "relative": string,
    "full": string
  },
  "web_url": string,
  "time_stats": {
    "time_estimate": number,
    "total_time_spent": number,
    "human_time_estimate": any,
    "human_total_time_spent": any
  },
  "squash": boolean,
  "task_completion_status": {
    "count": number,
    "completed_count": number
  },
  "has_conflicts": boolean,
  "blocking_discussions_resolved": boolean,
  "approvals_before_merge": any,
  "subscribed": boolean,
  "changes_count": string,
  "latest_build_started_at": string,
  "latest_build_finished_at": string,
  "first_deployed_to_production_at": any,
  "pipeline"?: GitlabPipelineInfo|null,
  "head_pipeline"?: GitlabPipelineFullInfo|null,
  "diff_refs": {
    "base_sha": string,
    "head_sha": string,
    "start_sha": string
  },
  "merge_error": any,
  "user": {
    "can_merge": boolean
  }
}