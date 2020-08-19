type IdAndName = {
    id: number,
    name: string
}

export type RedmineIssueData = {
    id: number,
    project: IdAndName,
    tracker: IdAndName,
    status: IdAndName,
    author: IdAndName,
    subject: string
}