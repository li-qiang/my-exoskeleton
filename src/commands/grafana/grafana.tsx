import {Action, ActionPanel, getPreferenceValues, Icon, List} from "@raycast/api";
import {useState} from "react";
import {Shortcuts} from "../../constants/shortcut";
import {GrafanaDashboard, GrafanaDashboards, GrafanaPreference} from "./types";
import {GrafanaClient} from "./client";

export default function GrafanaIndex() {

    const {GrafanaBaseUrl} = getPreferenceValues<GrafanaPreference>();
    const [keyword, setKeyword] = useState('');
    const [selectedFolder, setFolder] = useState('');

    const {data: folders} = GrafanaClient.fetchAllFolders()

    const dashboard_mapper: Map<string, GrafanaDashboards> = new Map();

    folders?.forEach(folder => {
        const {data: dashboards} = GrafanaClient.fetchDashboardByFolder(folder.id)
        dashboard_mapper.set(folder.title, dashboards as GrafanaDashboard[])
    })

    return (
        <List searchText={keyword}
              onSearchTextChange={setKeyword}
              searchBarAccessory={
                  <List.Dropdown tooltip="Dropdown With Folders" onChange={setFolder}>
                      <List.Dropdown.Item title="All" value=""/>
                      <List.Dropdown.Section title="Select Folder">
                          {folders?.map((folder) => (
                              <List.Dropdown.Item title={folder.title} value={folder.title}/>
                          ))}
                      </List.Dropdown.Section>
                  </List.Dropdown>
              }
        >
            {
                folders?.filter(folder => folder.title.includes(selectedFolder))
                    .map(folder => {
                        const dashboards = dashboard_mapper.get(folder.title)
                        return <List.Section title={folder.title}>
                            {
                                dashboards?.filter(board => board.title.toLowerCase().includes(keyword.toLowerCase()))
                                    .map(board => {
                                            return <List.Item title={board.title}
                                                              key={board.title}
                                                              icon={Icon.Stars}
                                                              actions={<ActionPanel>
                                                                  <Action.OpenInBrowser title="Open in browser"
                                                                                        shortcut={Shortcuts.link}
                                                                                        url={`${GrafanaBaseUrl}${board.url}`}/>
                                                              </ActionPanel>}/>
                                        }
                                    )
                            }

                        </List.Section>

                    })

            };
        </List>


    );
}

