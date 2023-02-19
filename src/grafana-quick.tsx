import {Action, ActionPanel, getPreferenceValues, Icon, List, useNavigation} from "@raycast/api";
import {useState} from "react";
import {CDClient} from "./gocd/client";
import PipelineDetailCommand from "./gocd/detail";
import {GocdPerference, StageStatus} from "./gocd/types";
import {calculateStatus} from "./gocd/utils";
import {IconMap} from "./gocd/constants";
import {Shortcuts} from "./constant/shortcut";
import moment from "moment";
import {DATETIME_FORMATE} from "./constant/date-format";
import {GrafanaPerference} from "./grafana/types";

export default function GrafanaIndex() {

    const {GrafanaBaseUrl} = getPreferenceValues<GrafanaPerference>();
    const {push} = useNavigation();
    const [keyword, setKeyword] = useState('');
    const [selectedStatus, setStatus] = useState('');
    const {data: board} = CDClient.fetchDashboard();

    return;
}

