import {ColumnParam} from "../model/column-param"

export const DefaultColumnsConst: ColumnParam[] = [
  'New',
  'In Progress',
  'Feedback',
  'Re-opened',
  'Code Review',
  'Wait Release',
  'Pending',
  'Resolved',
  'Testing',
  'Confirming',
  'Closed',
  'Rejected',
  'Frozen',
].map(name => {return {name: name, status: name}})