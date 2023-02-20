import { Action, ActionPanel, Detail, getPreferenceValues, Icon, List, useNavigation } from "@raycast/api";
import React, { useState } from "react";
import { GocdPerference } from "./gocd/types";
import GoCDIndex from "./gocd-pipelines";
import {GrafanaPerference} from "./grafana/types";
import {Shortcuts} from "./constant/shortcut";
import GrafanaIndex from "./grafana-quick";

export default function Command() {

  const { push } = useNavigation();
  const { GOCDBaseUrl } = getPreferenceValues<GocdPerference>();
  const [keyword, setKeyword] = useState('');

  const { GrafanaBaseUrl } = getPreferenceValues<GrafanaPerference>();

  return (
    <List searchText={keyword} onSearchTextChange={setKeyword}>
      <List.Item title="GOCD" actions={
        <ActionPanel>
          <Action title="Search Pipelines" onAction={() => push(<GoCDIndex />)}/>
          <Action.OpenInBrowser title="Open GOCD" url={GOCDBaseUrl}/>
        </ActionPanel>
      }></List.Item>

      <List.Item title="Grafana" actions={
        <ActionPanel>
          <Action title="Search Grafana" onAction={() => push(<GrafanaIndex />)}/>
          <Action.OpenInBrowser title="Open Grafana"
                                shortcut={Shortcuts.link}
                                url={`${GrafanaBaseUrl}/grafana/?search=open&orgId=1`}/>
        </ActionPanel>
      }></List.Item>
    </List>
  );
}
