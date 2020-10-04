type IdAndName = {
    id: number,
    name: string
}

type IssueChildren = {
    id: number,
    tracker: IdAndName
    subject: string
}

export type RedmineIssueData = {
    id: number,
    project: IdAndName,
    tracker: IdAndName,
    status: IdAndName,
    author: IdAndName,
    subject: string,
    /** Данные грузятся только при указании параметра "children" - `http://.../issues/123.json?include=children` */
    children?: IssueChildren[]
}