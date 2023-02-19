import {useFetch} from "@raycast/utils";
import {getBearerTokenHeader} from "./utils";
import {getPreferenceValues} from "@raycast/api";
import {GrafanaPerference, GrafanaSimpleFolders, GrafanaDashboards} from "./types";

/*
Reference to Grafana Document **https://grafana.com/docs/grafana/latest/developers/**
 */

const {GrafanaPAT, GrafanaBaseUrl} = getPreferenceValues<GrafanaPerference>();

const fetchAllFolders = () => useFetch<GrafanaSimpleFolders>(`${GrafanaBaseUrl}/grafana/api/folders`, {
    headers: {...getBearerTokenHeader(GrafanaPAT)}
});

const fetchDashboardByFolder = (folderId: string) => useFetch<GrafanaDashboards>(`${GrafanaBaseUrl}/grafana/api/search?folderIds=${folderId}&query=&starred=false&type=type`, {
    headers: {...getBearerTokenHeader(GrafanaPAT)}
});

export const GrafanaClient = {
    fetchAllFolders,
    fetchDashboardByFolder
};
