import { Action, ActionPanel, getPreferenceValues, List, useNavigation } from "@raycast/api";
import React, { useState } from "react";
import { GoCDPreference } from "../gocd/types";
import { GrafanaPreference } from "../grafana/types";
import DictionaryCommand from "../dictionary/dictionary";
import DictionaryLoadCommand from "../dictionary/load";
import GoCDPipelines from "../../gocd-pipelines";
import { Shortcuts } from "../../constants/shortcut";
import GrafanaIndex from "../../grafana-quick";
import Bookmark from "../../bookmark";

export default function Command() {

  const { push } = useNavigation();
  const { GrafanaBaseUrl, GoCDBaseUrl } = getPreferenceValues<GoCDPreference & GrafanaPreference>();
  const [keyword, setKeyword] = useState('');

  const items = [{
    title: 'Dictionary',
    actions: <ActionPanel>
      <Action title="Go to dictionary" onAction={() => push(<DictionaryCommand/>)}/>
      <Action title="Load dictionary" onAction={() => push(<DictionaryLoadCommand/>)}/>
    </ActionPanel>
  }, {
    title: 'GOCD',
    actions: <ActionPanel>
      <Action title="Search Pipelines" onAction={() => push(<GoCDPipelines/>)}/>
      <Action.OpenInBrowser title="Open GOCD" url={GoCDBaseUrl}/>
    </ActionPanel>,
  }, {
    title: 'Grafana',
    actions: <ActionPanel>
      <Action title="Search Grafana" onAction={() => push(<GrafanaIndex/>)}/>
      <Action.OpenInBrowser title="Open Grafana"
                            shortcut={Shortcuts.link}
                            url={`${GrafanaBaseUrl}/grafana/?search=open&orgId=1`}/>
    </ActionPanel>
  }, {
    title: 'Bookmark',
    actions: <ActionPanel>
      <Action title="Go to bookmark" onAction={() => push(<Bookmark/>)}/>
    </ActionPanel>

  }];

  return (
    <List searchText={keyword} onSearchTextChange={setKeyword}>
      {
        items
          .filter(i => i.title.toLowerCase().includes(keyword.toLowerCase()))
          .map(i => <List.Item title={i.title} actions={i.actions}/>)
      }
    </List>
  );
}
