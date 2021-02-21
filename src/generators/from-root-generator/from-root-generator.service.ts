import { Injectable } from '@nestjs/common';
import { IssueParam } from '../../model/issue-param';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';
import { IssueChildren } from '../../model/redmine-issue-data';

@Injectable()
export class FromRootGeneratorService {

  constructor(
    private configService: ConfigService
  ) {
  }

  urlPrefix = this.configService.get<string>('REDMINE_URL_PREFIX')

  async generate(issueNumber: number): Promise<IssueParam[]> {
    const url = `${this.urlPrefix}/issues/${issueNumber}.json?include=children`
    const resp = await axios.get(url)
    const data = resp.data
    if (typeof data !== 'object' || data === null) {
      return []
    }
    if (!data?.issue) {
      return []
    }
    const rootIssue = data.issue as IssueChildren
    return this.issueToSwimlanes(rootIssue)
  }

  private issueToSwimlanes(issue: IssueChildren): IssueParam[] {
    if (typeof issue.children !== 'object' || issue.children.length <= 0) {
      return []
    }
    const res: IssueParam[] = []
    res.push({
      number: issue.id,
      children: issue.children.map(childIssue => {
        return {
          number: childIssue.id
        }
      })
    })
    const additionalSwimlanes = this.childrenIssuesToSwimlanes(issue.children)
    res.push(...additionalSwimlanes)
    return res
  }

  private childrenIssuesToSwimlanes(issues: IssueChildren[]): IssueParam[] {
    const res: IssueParam[] = []
    issues.forEach(issue => {
      const swimlanes = this.issueToSwimlanes(issue)
      res.push(...swimlanes)
    })
    return res
  }

}
