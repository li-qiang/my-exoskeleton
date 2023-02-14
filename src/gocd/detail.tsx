import { Action, ActionPanel, Color, getPreferenceValues, Icon, List } from "@raycast/api";
import { CDClient } from "./client";
import { GocdPerference, StageStatus } from "./types";


const calculateStatus = (stages: Array<{ name: string; status: StageStatus }>) => {
  if (!stages) {
    return 'Unknown';
  }
  const stage = stages.find(s => s.status != 'Passed' && s.status != 'Unknown');
  return stage?.status || 'Passed';
}

const IconMap: Record<StageStatus, any> = {
  Passed: {
    source: Icon.CheckCircle,
    tintColor: Color.Green
  },
  Building: {
    source: Icon.Hourglass,
    tintColor: Color.Yellow
  },
  Unknown: {
    source: Icon.LivestreamDisabled,
    tintColor: Color.SecondaryText
  },
  Failed: {
    source: Icon.MinusCircle,
    tintColor: Color.Red
  },
  Cancelled: {
    source: Icon.Warning,
    tintColor: Color.Yellow
  },
};

export default function PipelineDetailCommand(pros: { pipelineName: string }) {

  // const { data: status } = CDClient.fetchPipelineStatus(pros.pipelineName);
  const { data: history } = CDClient.fetchPipelineHistory(pros.pipelineName);

  return <List navigationTitle={pros.pipelineName} isShowingDetail>
    {
      history?.pipelines.map(pipelineInstance => {

        const status = calculateStatus(pipelineInstance.stages);

        return <List.Item title={pipelineInstance.label}
                          subtitle={status}
                          icon={IconMap[status]}
                          key={pipelineInstance.counter}
                          detail={
                            <List.Item.Detail metadata={
                              <List.Item.Detail.Metadata>
                                <List.Item.Detail.Metadata.Label title="Trigger"
                                                                 text={pipelineInstance.build_cause.trigger_message}/>
                              </List.Item.Detail.Metadata>
                            }/>
                          }
        />;
      })
    }
  </List>
}
