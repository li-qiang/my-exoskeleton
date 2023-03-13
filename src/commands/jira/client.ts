import {getPreferenceValues} from "@raycast/api";
import {JiraIssues, JiraPreference} from "./types";
import request from "./request";

const { jiraToken } = getPreferenceValues<JiraPreference>();

const fetchIssuesByCurrentUser = (): Promise<JiraIssues> => {
    return request<JiraIssues>({
        url: '/api/2/search?jql=reporter+%3D+currentUser()+order+by+created+DESC',
        method: 'get',
        headers: {...{"Authorization": `Bearer ${jiraToken}`}},
    }).then(res => {
        return res.data
    });
};

export const JiraClient = {
    fetchIssuesByCurrentUser,
};
