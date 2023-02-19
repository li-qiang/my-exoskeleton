import {Action, ActionPanel, getPreferenceValues, List} from "@raycast/api";
import {useState} from "react";
import {Shortcuts} from "./constant/shortcut";
import {GrafanaPerference} from "./grafana/types";
import {GrafanaClient} from "./grafana/client";

export default function GrafanaIndex() {

    const {GrafanaBaseUrl} = getPreferenceValues<GrafanaPerference>();
    const [keyword, setKeyword] = useState('');
    const [selectedFolder, setFolder] = useState('');
    const {data: folders} = GrafanaClient.fetchAllFolders()
    console.log(folders)

    return (
        <List searchText={keyword}
              onSearchTextChange={setKeyword}
              searchBarAccessory={
                  <List.Dropdown tooltip="Dropdown With Folders" onChange={setFolder}>
                      <List.Dropdown.Item title="All" value=""/>
                      <List.Dropdown.Item title="OTR Monitor" value="288"/>
                      {/*<List.Dropdown.Section title="Select Folder">*/}
                      {/*    {folders?.map((folder) => (*/}
                      {/*        <List.Dropdown.Item title={folder.title} value={folder.id}/>*/}
                      {/*    ))}*/}
                      {/*</List.Dropdown.Section>*/}
                  </List.Dropdown>
              }
        >
            {
                folders?.filter(folder => {
                    console.log(selectedFolder)
                    if (selectedFolder === "") {
                        return true
                    } else if (folder.id === selectedFolder) {
                        return true
                    }
                    return false
                }).map(folder => {
                    console.log(folder)
                    const {data: dashboards} = GrafanaClient.fetchDashboardByFolder(folder.id)
                    return dashboards?.filter(board => board.title.includes(keyword)).map(board => {
                        return <List.Item title={board.title}
                                          key={board.title}
                                          actions={<ActionPanel>

                                              <Action.OpenInBrowser title="Open in browser"
                                                                    shortcut={Shortcuts.link}
                                                                    url={`${GrafanaBaseUrl}${board.url}`}/>
                                          </ActionPanel>}/>


                    });
                })}


        </List>


    );
}

