import { Action, ActionPanel, Detail, getPreferenceValues, Icon, List, useNavigation } from "@raycast/api";
import React, { useState } from "react";
import { GocdPerference } from "./gocd/types";
import GoCDIndex from "./gocd";

export default function Command() {

  const { push } = useNavigation();

  const { GOCDBaseUrl } = getPreferenceValues<GocdPerference>();

  const [keyword, setKeyword] = useState('');

  return (
    <List searchText={keyword} onSearchTextChange={setKeyword}>
      <List.Item title="GOCD" actions={
        <ActionPanel>
          <Action title="Search Pipelines" onAction={() => push(<GoCDIndex />)}/>
          <Action.OpenInBrowser title="Search Pipelines" url={GOCDBaseUrl}/>
        </ActionPanel>
      }></List.Item>
    </List>

  );
}
