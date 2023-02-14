import { Action, ActionPanel, Detail, getPreferenceValues, Icon, List, useNavigation } from "@raycast/api";
import { useState } from "react";
import { CDClient } from "./client";
import PipelineDetailCommand from "./detail";
import { GocdPerference } from "./types";

export default function GoCDIndex() {

  const { GOCDBaseUrl } = getPreferenceValues<GocdPerference>();

  const { push } = useNavigation();

  const [keyword, setKeyword] = useState('');

  const { data: board } = CDClient.fetchDashboard();

  return (

    <List searchText={keyword} onSearchTextChange={setKeyword}>
      {
        board && board._embedded.pipeline_groups.map(group => {

          return <List.Section title={group.name} key={group.name}>
            {
              group.pipelines.map(pipeline => pipeline.includes(keyword) &&
                  <List.Item title={pipeline} key={pipeline} actions={
                    <ActionPanel>
                      <Action title="Trigger"/>
                      <Action icon={Icon.Leaf} title="Detail"
                              shortcut={{ modifiers: ['cmd'], key: 'd' }}
                              onAction={() => push(<PipelineDetailCommand pipelineName={pipeline}/>)}/>
                      <Action.OpenInBrowser title="Open in browser"
                                            shortcut={{ modifiers: ['cmd'], key: 'l' }}
                                            url={`${GOCDBaseUrl}/go/pipeline/activity/${pipeline}`}/>
                    </ActionPanel>
                  }/>)
            }
          </List.Section>
        })
      }
    </List>

  );
}

