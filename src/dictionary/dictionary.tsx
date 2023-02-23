import { getPreferenceValues, List } from "@raycast/api";
import { usePromise } from "@raycast/utils";
import { getCollection } from "../utils/mysql";
import { COLLECTION_NAME, DictionaryPreference, DictionaryRow, SCHEMA_NAME } from "./constants";
import { useState } from "react";

export default function DictionaryCommand() {

  const [key, setKey] = useState('');
  const { dictionaryUrl } = getPreferenceValues<DictionaryPreference>();

  const { data }: { data: DictionaryRow[] | undefined } = usePromise(async (url: string, key: string) => {
      const collection = await getCollection(url, SCHEMA_NAME, COLLECTION_NAME);

      let rows;

      if (key === '') {
        rows = await collection.find().execute();
      } else {
        rows = await collection.find('lower(enName) like :name or cnName like :name or lower(abbr) like :name')
          .bind("name", `%${key.toLowerCase()}%`)
          .execute();
      }

      return rows.fetchAll();
    },
    [dictionaryUrl, key]
  );

  return <List isShowingDetail searchText={key} onSearchTextChange={setKey}>
    {
      data?.map(r => <List.Item title={r.enName}
                                subtitle={r.cnName}
                                detail={
                                  <List.Item.Detail markdown={r.description} metadata={
                                    <List.Item.Detail.Metadata>
                                      <List.Item.Detail.Metadata.Label title="英文全称" text={r.enName}/>
                                      <List.Item.Detail.Metadata.Label title="中文名称" text={r.cnName}/>
                                      <List.Item.Detail.Metadata.Label title="缩写" text={r.abbr}/>
                                      <List.Item.Detail.Metadata.Label title="类型" text={r.type}/>
                                      <List.Item.Detail.Metadata.Label title="Squad" text={r.squad}/>
                                    </List.Item.Detail.Metadata>
                                  }/>
                                }/>)
    }
  </List>
}
