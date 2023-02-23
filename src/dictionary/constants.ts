import { CollectionDocuments } from "@mysql/xdevapi/types/lib/DevAPI/CollectionAdd";

export const SCHEMA_NAME = 'exoskeleton';
export const COLLECTION_NAME = 'dict';

const COLUMNE_MAP = {
  '英文全称': 'enName',
  '缩写': 'abbr',
  '中文名称': 'cnName',
  '类型': 'type',
  '相关squad': 'squad',
  '说明': 'description',
  '备注': 'remark'
}

export interface DictionaryRecord {
  '英文全称': string,
  '缩写': string,
  '中文名称': string,
  '类型': string,
  '相关squad': string,
  '说明': string,
  '备注': string
}

export interface DictionaryRow extends CollectionDocuments {
  enName: string;
  abbr: string;
  cnName: string;
  type: string;
  squad: string;
  description: string;
  remark: string;
}


export const toDBRecord = (record: DictionaryRecord): CollectionDocuments => Object.entries(COLUMNE_MAP)
  .reduce((v, [key, value]) => ({ ...v, [value]: record[key] }), {} as CollectionDocuments);

export interface DictionaryPreference {
  dictionaryUrl: string;
}
