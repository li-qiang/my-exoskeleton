import { getPreferenceValues, List } from "@raycast/api";
import { usePromise } from "@raycast/utils";
import { buildExpression, getCollection, Operator } from "../utils/mysql";
import { COLLECTION_NAME, DictionaryPreference, DictionaryRow, SCHEMA_NAME } from "./constants";
import { useState } from "react";
import { AsyncState } from "@raycast/utils/dist/types";

export default function DictionaryCommand() {
  const [key, setKey] = useState('');
  const [selectedType, setType] = useState('');
  const { dictionaryUrl } = getPreferenceValues<DictionaryPreference>();

  const { data: types } = usePromise(async (url: string) => {
    const collection = await getCollection(url, SCHEMA_NAME, COLLECTION_NAME);
    const typeResults = await collection.find().fields('type').execute();
    const types = typeResults.fetchAll().map(r => r.type as string).reduce((s, r) => ({ ...s, [r]: 1 }), {});
    return Object.keys(types);
  }, [dictionaryUrl]) as AsyncState<string[]>;

  const { data } = usePromise(async (url: string, key: string, type: string) => {
      const collection = await getCollection(url, SCHEMA_NAME, COLLECTION_NAME);
      const operation = Operator.and(
        type === '' ? null : Operator.eq('type', ':type'),
        key === '' ? null : Operator.or(
          Operator.like('lower(enName)', ':name'),
          Operator.like('lower(enName)', ':name'),
          Operator.like('lower(abbr)', ':name'),
        ),
      );

      const ex = buildExpression(operation);
      const rows = await collection.find(ex)
        .bind('name', `%${key.toLowerCase()}%`)
        .bind('type', type)
        .execute();
      return rows.fetchAll();
    },
    [dictionaryUrl, key, selectedType]
  ) as AsyncState<DictionaryRow[]>;

  return <List isShowingDetail searchText={key} onSearchTextChange={setKey}
               navigationTitle={`Find ${data?.length || 0} Items`}
               searchBarAccessory={
                 <List.Dropdown tooltip="Dropdown With Items" onChange={setType}>
                   <List.Dropdown.Item title="All" value=""/>
                   {
                     types?.map(t => <List.Dropdown.Item title={t} value={t}/>)
                   }
                 </List.Dropdown>
               }>
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
