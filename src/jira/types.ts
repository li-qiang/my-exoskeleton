export interface JiraPreference {
    otrJiraToken: string
}

export interface JiraIssues {
    issues: Array<JiraIssue>
}

export interface JiraIssue {
    id: string,
    key: string,
    fields: JiraDetailField
    type: string,
    issueNumber: string,
    title: string,
    description: string,
    avatarLink: string,
    createTime: string,
    updateTime: string,
    assignee: string,
    priority: string,
    reporter: string
}

export interface JiraDetailField {
    assignee: string,
    issuetype: JiraIssueType,
    summary: string
    status: JiraStatus,
    created: string
}

export interface JiraIssueType {
    iconUrl: string,
    name: string
}

export interface JiraStatus {
    name: 'Assign' | 'Backlog' | 'Dev - To Do' | 'Released' | 'Dev - Done' | 'Ready for Deploy' | 'Pending' | 'In UAT' | 'Testing'
}