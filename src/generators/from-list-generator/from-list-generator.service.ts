import { Injectable } from '@nestjs/common';
import { RedmineIssueLoaderService } from '../../redmine-issue-loader/redmine-issue-loader.service';
import { IssueParam } from '../../model/issue-param';

@Injectable()
export class FromListGeneratorService {

  constructor(
    private redmineIssueLoaderService: RedmineIssueLoaderService
  ) {
  }

  async generate(issues: number[]): Promise<IssueParam[]> {
    const res: IssueParam[] = []
    const data = await this.redmineIssueLoaderService.getIssuesData(issues)
    data.forEach(issue => {
      const parent: number|undefined = issue.parent?.id
      this.putIssueInSwimlane(res, parent || "Разное", issue.id)
    })
    return res
  }

  private putIssueInSwimlane(
    data: IssueParam[],
    parent: string|number,
    issueNumber: number
  ): void {
    const swimlane = data.find(swimlane => {
      if (typeof parent === 'string') {
        return swimlane.title === parent
      } else if (typeof parent === 'number') {
        return swimlane.number === parent
      } else {
        return false
      }
    }) || this.createEmptySwimlane(data, parent)
    if (!swimlane) {
      console.error('Can not find or create swimlane')
      return
    }
    if (!swimlane.children) {
      swimlane.children = []
    }
    swimlane.children.push({number: issueNumber})
  }

  private createEmptySwimlane(data: IssueParam[], parent: string|number): IssueParam|null {
    const swimlane: IssueParam = {}
    if (typeof parent === 'string') {
      swimlane.title = parent
    } else if (typeof parent === 'number') {
      swimlane.number = parent
    } else {
      console.error('Wrong typeof parent')
      return null
    }
    data.push(swimlane)
    return swimlane
  }

}
