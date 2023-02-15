import { Action, ActionPanel, getPreferenceValues, Icon, List, useNavigation } from "@raycast/api";
import { useState } from "react";
import { CDClient } from "./gocd/client";
import PipelineDetailCommand from "./gocd/detail";
import { GocdPerference } from "./gocd/types";
import { calculateStatus } from "./gocd/utils";
import { IconMap } from "./gocd/constants";

export default function GoCDIndex() {

  const { GOCDBaseUrl } = getPreferenceValues<GocdPerference>();
  const { push } = useNavigation();
  const [keyword, setKeyword] = useState('');
  const { data: board } = CDClient.fetchDashboard();

  return (
    <List searchText={keyword} onSearchTextChange={setKeyword}>
      {
        board && board._embedded.pipelines
          .filter(pipeline => pipeline.name.includes(keyword))
          .map(pipeline => {

            const [instance] = pipeline._embedded.instances;

            const pipelineStatus = instance ? calculateStatus(instance._embedded.stages) : 'Unknown';

            return <List.Item icon={IconMap[pipelineStatus]}
                              title={pipeline.name}
                              actions={
                                <ActionPanel>
                                  <Action title="Trigger"/>
                                  <Action icon={Icon.Leaf} title="Detail"
                                          shortcut={{ modifiers: ['cmd'], key: 'd' }}
                                          onAction={() => push(<PipelineDetailCommand pipelineName={pipeline.name}/>)}/>
                                  <Action.OpenInBrowser title="Open in browser"
                                                        shortcut={{ modifiers: ['cmd'], key: 'l' }}
                                                        url={`${GOCDBaseUrl}/go/pipeline/activity/${pipeline}`}/>
                                </ActionPanel>
                              }
            />
          })
      }
    </List>

  );
}

