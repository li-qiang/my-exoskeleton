import mysqlx from "@mysql/xdevapi";

export const getCollection = async (url: string, schemaName: string, collectionName: string) => {
  const session = await mysqlx.getSession(url)
  const schema = await session.getSchema(schemaName);
  return schema.createCollection(collectionName, { reuseExisting: true })
}
