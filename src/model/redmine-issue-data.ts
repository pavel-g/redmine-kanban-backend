type IdAndName = {
    id: number,
    name: string
}

export type IssueChildren = {
    id: number,
    tracker: IdAndName
    subject: string,
    children?: IssueChildren[]
}

type CustomField = {
  id: number,
  name: string,
  value: string
}

type JournalItem = {
    id: number,
    user: IdAndName
    notes?: string
    created_on: string
}

export type RedmineIssueData = {
    id: number,
    project: IdAndName,
    tracker: IdAndName,
    status: IdAndName,
    author: IdAndName,
    assigned_to: IdAndName,
    subject: string,
    parent?: {
        id: number
    },
    /** Данные грузятся только при указании параметра "children" - `http://.../issues/123.json?include=children` */
    children?: IssueChildren[],
    custom_fields: CustomField[],
    journals?: JournalItem[]
}
