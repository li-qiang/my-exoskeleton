import { Action, ActionPanel, getPreferenceValues, Icon, List, useNavigation } from "@raycast/api";
import { useState } from "react";
import { CDClient } from "./gocd/client";
import PipelineDetailCommand from "./gocd/detail";
import { GocdPerference, StageStatus } from "./gocd/types";
import { calculateStatus } from "./gocd/utils";
import { IconMap } from "./gocd/constants";
import { Shortcuts } from "./constant/shortcut";
import moment from "moment";
import { DATETIME_FORMATE } from "./constant/date-format";

export default function GoCDIndex() {

  const { GOCDBaseUrl } = getPreferenceValues<GocdPerference>();
  const { push } = useNavigation();
  const [keyword, setKeyword] = useState('');
  const [selectedStatus, setStatus] = useState('');
  const { data: board } = CDClient.fetchDashboard();

  return (
    <List searchText={keyword}
          onSearchTextChange={setKeyword}
          searchBarAccessory={
            <List.Dropdown tooltip="Dropdown With Items" onChange={setStatus}>
              <List.Dropdown.Item title="All" value=""/>
              <List.Dropdown.Item title="Failed" value="Failed"/>
              <List.Dropdown.Item title="Passed" value="Passed"/>
              <List.Dropdown.Item title="Building" value="Building"/>
              <List.Dropdown.Item title="Cancelled" value="Cancelled"/>
            </List.Dropdown>
          }
    >
      {
        board && board._embedded.pipelines
          .filter(pipeline => pipeline.name.includes(keyword))
          .map(pipeline => {

            const [instance] = pipeline._embedded.instances;
            const pipelineStatus = instance ? calculateStatus(instance._embedded.stages) : 'Unknown';
            const datetime = instance ? moment(instance.scheduled_at).format(DATETIME_FORMATE) : '-'

            if (pipelineStatus.includes(selectedStatus)) {
              return <List.Item icon={IconMap[pipelineStatus]}
                                title={pipeline.name}
                                key={pipeline.name}
                                actions={
                                  <ActionPanel>
                                    <Action icon={Icon.Leaf} title="Detail"
                                            shortcut={Shortcuts.detail}
                                            onAction={() => push(<PipelineDetailCommand pipelineName={pipeline.name}/>)}/>
                                    <Action.OpenInBrowser title="Open in browser"
                                                          shortcut={Shortcuts.link}
                                                          url={`${GOCDBaseUrl}/go/pipeline/activity/${pipeline.name}`}/>
                                  </ActionPanel>
                                }
                                accessories={[{ text: datetime }]}
              />;
            }
          })
      }
    </List>

  );
}

