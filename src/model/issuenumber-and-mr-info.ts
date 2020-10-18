import { MergeRequestStatuses } from './mergerequest-statuses';

export type IssueNumberAndMrInfo = {
  issueNumber: number,
  mergeRequestsInfo: MergeRequestStatuses[]
}