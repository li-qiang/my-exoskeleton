export interface JiraPreference {
    jiraToken: string
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
    assignee: JiraAssignee,
    issuetype: JiraIssueType,
    summary: string
    status: JiraStatus,
    priority: IssuePriority,
    created: string
}

export interface JiraIssueType {
    iconUrl: string,
    name: string
}

export interface JiraStatus {
    name: 'Assign' | 'Backlog' | 'Dev - To Do' | 'Released' | 'Dev - Done' | 'Ready for Deploy' | 'Pending' | 'In UAT' | 'Testing'
}

export interface JiraAssignee {
    name: string,
    displayName: string,
    avatarUrls: AvatarUrls
}

export interface AvatarUrls {
    "16x16": string,
    "24x24": string,
    "32x32": string,
    "48x48": string,
}

export interface IssuePriority {
    name: string,
    iconUrl: string
}