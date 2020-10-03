import { IssueParam } from './issue-param';

export type Board = {
  id: number,
  name: string,
  config?: IssueParam[] | null
}