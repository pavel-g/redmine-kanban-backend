import {RedmineIssueData} from "./redmine-issue-data";

export type IssueParam = {
    number?: number,
    title?: string,
    children?: IssueParam[],
    redmineData?: RedmineIssueData
}