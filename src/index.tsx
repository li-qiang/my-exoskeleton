import { Action, ActionPanel, getPreferenceValues, List, useNavigation } from "@raycast/api";
import React, { useState } from "react";
import { GoCDPreference } from "./gocd/types";
import {GrafanaPreference} from "./grafana/types";
import DictionaryCommand from "./dictionary/dictionary";
import DictionaryLoadCommand from "./dictionary/load";
import GoCDPipelines from "./gocd-pipelines";
import { Shortcuts } from "./constant/shortcut";
import GrafanaIndex from "./grafana-quick";

export default function Command() {

  const { push } = useNavigation();
  const { GoCDBaseUrl } = getPreferenceValues<GoCDPreference>();
  const [keyword, setKeyword] = useState('');

  const { GrafanaBaseUrl } = getPreferenceValues<GrafanaPreference>();

  return (
    <List searchText={keyword} onSearchTextChange={setKeyword}>
      <List.Item title="GoCD" icon="command-gocd-icon.png" actions={
        <ActionPanel>
          <Action title="Search Pipelines" onAction={() => push(<GoCDPipelines />)}/>
          <Action.OpenInBrowser title="Open GOCD" url={GoCDBaseUrl}/>
        </ActionPanel>
      } />
      <List.Item title="Grafana" icon="command-grafana-icon.png" actions={
        <ActionPanel>
          <Action title="Search Grafana" onAction={() => push(<GrafanaIndex />)}/>
          <Action.OpenInBrowser title="Open Grafana"
                                shortcut={Shortcuts.link}
                                url={`${GrafanaBaseUrl}/grafana/?search=open&orgId=1`}/>
        </ActionPanel>
      } />
      <List.Item title="Dictionary" icon="dictionary.png"
                 actions={
                   <ActionPanel>
                     <Action title="Go to dictionary" onAction={() => push(<DictionaryCommand/>)}/>
                     <Action title="Load dictionary" onAction={() => push(<DictionaryLoadCommand/>)}/>
                   </ActionPanel>
                 }/>
    </List>
  );
}
