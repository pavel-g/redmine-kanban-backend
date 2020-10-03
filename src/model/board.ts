import { IssueParam } from './issue-param';

/**
 * Запись с описанием доски из БД
 */
export type Board = {
  id: number,
  name: string,
  config?: IssueParam[] | null
}