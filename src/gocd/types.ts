export interface GocdPerference {
  GocdPAT: string,
  GOCDBaseUrl: string
}

export interface GocdBoard {
  _embedded: {
    pipeline_groups: Array<{
      name: string,
      pipelines: string[]
    }>
  }
}

export interface GocdPipelineStatus {
  "paused": boolean,
  "paused_cause": string | undefined,
  "paused_by": string,
  "locked": boolean,
  "schedulable": boolean
}

export type StageStatus = 'Building' | 'Passed' | 'Failed' | 'Cancelled' | 'Unknown';


export interface GocdPipelineInstance {
  name: string,
  counter: number,
  label: string,
  scheduled_date: number,
  build_cause: {
    trigger_message: string
  }
  stages: Array<{
    name: string,
    status: StageStatus,
  }>,
}

export interface GocdPipelineHistory {
  pipelines: Array<GocdPipelineInstance>,
}
