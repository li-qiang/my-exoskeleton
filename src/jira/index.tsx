import {Action, ActionPanel, Color, List} from "@raycast/api";
import {useEffect, useState} from "react";
import {JiraIssue, JiraStatus} from "./types";
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

export default function JiraIndex() {
    const [issues, setIssues] = useState<JiraIssue[]>([]);

    useEffect(() => {
        JiraClient.fetchIssuesByCurrentUser()
            .then((jiraIssues) => {
                setIssues(jiraIssues.issues);

                console.log('issues', new Set(jiraIssues.issues.map(issue => issue.fields.status.name)))
            });
    }, []);

    function Actions(props: { title: string, link: string }) {
        return (
            <ActionPanel title={props.title}>
                {props.link && <Action.OpenInBrowser url={`https://zchengb.top/api/t/${props.link}`}/>}
            </ActionPanel>
        );
    }

    function IssueItem(props: { jiraIssue: JiraIssue }) {
        return (
            <List.Item
                icon={props.jiraIssue.fields.issuetype.iconUrl}
                title={props.jiraIssue.fields.summary ?? "No title"}
                subtitle={props.jiraIssue.key}
                accessories={[
                    {
                        text: {
                            value: props.jiraIssue.fields.status.name,
                            color: getStatusColor(props.jiraIssue.fields.status)
                        }
                    },
                    {
                        text: {
                            value: new Date(props.jiraIssue.fields.created).getFullYear()?.toString() || '',
                            color: Color.SecondaryText
                        }
                    },
                ]}
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
