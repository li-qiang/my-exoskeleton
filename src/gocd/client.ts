import { useFetch } from "@raycast/utils";
import { GocdBoard, GocdPerference, GocdPipelineHistory, GocdPipelineStatus } from "./types";
import { GOCDAcceptHeaders } from "./constants";
import { getBearerTokenHeader } from "./utils";
import { getPreferenceValues } from "@raycast/api";


/*
Reference to GoCD Document **https://api.gocd.org/current/**
 */

const { GocdPAT, GOCDBaseUrl } = getPreferenceValues<GocdPerference>();

const fetchDashboard = () => useFetch<GocdBoard>(`${GOCDBaseUrl}/go/api/dashboard`, {
  headers: { ...GOCDAcceptHeaders.v3, ...getBearerTokenHeader(GocdPAT) }
});

const fetchPipelineStatus = (pipelineName: string) => useFetch<GocdPipelineStatus>(`${GOCDBaseUrl}/go/api/pipelines/${pipelineName}/status`, {
  headers: { ...GOCDAcceptHeaders.v1, ...getBearerTokenHeader(GocdPAT) }
});

const fetchPipelineHistory = (pipelineName: string) => useFetch<GocdPipelineHistory>(`${GOCDBaseUrl}/go/api/pipelines/${pipelineName}/history`, {
  headers: { ...GOCDAcceptHeaders.v1, ...getBearerTokenHeader(GocdPAT) }
});

export const CDClient = {
  fetchDashboard,
  fetchPipelineStatus,
  fetchPipelineHistory
};
