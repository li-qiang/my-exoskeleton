import {Action, ActionPanel, Color, Image, List} from "@raycast/api";
import {useEffect, useState} from "react";
import {JiraDetailField, JiraIssue, JiraStatus} from "./types";
import {JiraClient} from "./client";


const getStatusColor = (status: JiraStatus): Color => {
    const statusColorMapping: { [key: string]: Color } = {
        'Assign': Color.Blue,
        'Backlog': Color.PrimaryText,
        'Dev - To Do': Color.Purple,
        'Released': Color.Green,
        'Dev - Done': Color.Green,
        'Ready for Deploy': Color.Orange,
        'Pending': Color.Red,
        'In UAT': Color.Yellow,
        'Testing': Color.SecondaryText
    }
    return statusColorMapping[status.name];
}

const jiraBoardBaseLink = '';

export default function JiraIndex() {
    const [issues, setIssues] = useState<JiraIssue[]>([]);

    useEffect(() => {
        JiraClient.fetchIssuesByCurrentUser()
            .then((jiraIssues) => {
                setIssues(jiraIssues.issues);
            });
    }, []);

    function Actions(props: { issueKey: string, link: string }) {
        return (
            <ActionPanel title={props.issueKey}>
                {props.link && <Action.OpenInBrowser url={props.link}/>}
            </ActionPanel>
        );
    }

    function IssueItem(props: { jiraIssue: JiraIssue }) {
        const jiraDetailField: JiraDetailField = props.jiraIssue.fields;
        const displayName: string = jiraDetailField.assignee?.displayName || 'Unassigned';
        const issueKey = props.jiraIssue.key;
        return (
            <List.Item
                icon={{
                    source: jiraDetailField.issuetype.iconUrl,
                    mask: Image.Mask.RoundedRectangle
                }}
                title={jiraDetailField.summary ?? "No title"}
                subtitle={props.jiraIssue.key}
                accessories={[
                    {
                        text: {
                            value: jiraDetailField.status.name,
                            color: getStatusColor(jiraDetailField.status)
                        }
                    },
                    {
                        text: {
                            value: new Date(jiraDetailField.created).getFullYear()?.toString() || '',
                            color: Color.SecondaryText
                        }
                    },
                    {
                        tag: {
                            value: displayName,
                            color: Color.Orange
                        }
                    },
                    {
                        icon: {
                            source: jiraDetailField.priority.iconUrl
                        }
                    }
                ]}
                actions={<Actions issueKey={issueKey} link={`${jiraBoardBaseLink}${issueKey}`}/>}
            />
        );
    }

    return <List
        isLoading={!issues || (issues.length === 0)}
    >
        {issues?.map((issue, index) => (
            <IssueItem key={index} jiraIssue={issue}/>
        ))}
    </List>;
}
