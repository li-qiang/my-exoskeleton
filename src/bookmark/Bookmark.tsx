import {Action, ActionPanel, getPreferenceValues, List} from "@raycast/api";
import {fetchAllSheetsInfo, fetchSheetValues} from "./client";
import {FC, useEffect, useReducer, useState} from "react";
import {BookmarkPreference, sheetProperties} from "./types";
import {Shortcuts} from "../constant/shortcut";

const Bookmark: FC = () => {

    const {BookmarkSheetId: spreadsheetId} = getPreferenceValues<BookmarkPreference>()

    console.log(spreadsheetId)


    const [keyword, setKeyword] = useState('');
    const [selectedSheet, setSelectedSheet] = useState('');


    const [sheets, setSheets] = useState<sheetProperties[]>([]);
    const [listData, setListData] = useReducer(
        (listData: any, newListData: any) => ({...listData, ...newListData}), {}
    )

    useEffect(() => {
        fetchAllSheetsInfo(spreadsheetId).then(({data}) => {
            const {sheets} = data;
            const sheetData = sheets.map((sheet) => {
                const {properties} = sheet;
                return properties;
            })
            setSheets(sheetData);
        });
    }, []);
    useEffect(() => {
        if (sheets.length === 0) {
            return;
        }
        sheets.forEach((sheet) => {
            const begin_row = 1;
            const {title: sheetName, gridProperties: {rowCount: end_row, columnCount: end_column}} = sheet
            fetchSheetValues(spreadsheetId, sheetName, begin_row, end_row, end_column).then(({data}) => {
                const {values} = data;
                setListData({[sheetName]: values})
            })
        })

    }, [sheets]);


    return (
        <List searchText={keyword}
              onSearchTextChange={setKeyword}
              searchBarAccessory={
                  <List.Dropdown tooltip="Dropdown With Squad" onChange={setSelectedSheet}>
                      <List.Dropdown.Item title="All" value=""/>
                      <List.Dropdown.Section title="Select Squad">
                          {Object.keys(listData).map(key => (
                              <List.Dropdown.Item title={key} value={key}/>
                          ))}
                      </List.Dropdown.Section>
                  </List.Dropdown>
              }
        >{
            Object.keys(listData).filter(key => {
                return key.includes(selectedSheet)
            }).map(key => {
                const all_rows: [[string]] = listData[key]
                const data_rows = all_rows.slice(1)

                return <List.Section title={key}>{
                    data_rows.filter(subarray => {
                        const title = subarray[0]
                        return title.toLowerCase().includes(keyword.toLowerCase())
                    }).map((subarray: string[]) => {
                        const title = subarray[0]
                        const link = subarray[1]
                        const comment = subarray[2]
                        return <List.Item title={title}
                                          subtitle={comment}
                                          actions={<ActionPanel>
                                              <Action.OpenInBrowser title="Open in browser"
                                                                    shortcut={Shortcuts.link}
                                                                    url={link}/>
                                          </ActionPanel>}/>
                    })
                } </List.Section>
            })
        }

        </List>
    );
}

export default Bookmark;
