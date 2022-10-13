/* eslint-disable @typescript-eslint/no-explicit-any */
import DynamoDB, { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { ServiceConfigurationOptions } from 'aws-sdk/lib/service';
import * as commands from './command';

const defaults: DocumentClient.DocumentClientOptions &
  ServiceConfigurationOptions &
  DynamoDB.ClientApiVersions = {};

let _client: DocumentClient;
function client() {
  if (!_client) {
    _client = new DocumentClient(defaults);
  }
  return _client;
}

export function batchGet(
  requestItems: DocumentClient.BatchGetRequestMap[],
  options?: Partial<DocumentClient.BatchGetItemInput>
) {
  return client()
    .batchGet(commands.buildBatchGet(requestItems, options))
    .promise();
}

export function batchWrite(
  requestItems: DocumentClient.BatchWriteItemRequestMap[],
  options?: Partial<DocumentClient.BatchWriteItemInput>
) {
  return client()
    .batchWrite(commands.buildBatchWrite(requestItems, options))
    .promise();
}

export function get(
  tableName: string,
  key: DocumentClient.Key,
  options?: Partial<DocumentClient.GetItemInput>
) {
  return client().get(commands.buildGet(tableName, key, options)).promise();
}

export function scan(
  tableName: string,
  filter: any,
  options?: DocumentClient.ScanInput
) {
  return client()
    .scan(commands.buildScan(tableName, filter, options))
    .promise();
}

export function query(
  tableName: string,
  keyCondition: any,
  options?: Partial<commands.FacadeQueryInput>
) {
  return client()
    .query(commands.buildQuery(tableName, keyCondition, options))
    .promise();
}

export function put(
  tableName: string,
  item: DocumentClient.PutItemInputAttributeMap,
  options?: Partial<commands.FacadePutItemInput>
) {
  return client().put(commands.buildPut(tableName, item, options)).promise();
}

export function update(
  tableName: string,
  key: DocumentClient.Key,
  updatedValues: any,
  options?: Partial<commands.FacadeUpdateItemInput>
) {
  return client()
    .update(commands.buildUpdate(tableName, key, updatedValues, options))
    .promise();
}

export function deleteItem(
  tableName: string,
  key: DocumentClient.Key,
  options?: Partial<commands.FacadeUpdateItemInput>
) {
  return client()
    .delete(commands.buildDelete(tableName, key, options))
    .promise();
}

export function transactGet(
  transactItems: DocumentClient.TransactGetItemList,
  options?: Partial<DocumentClient.TransactGetItemsInput>
) {
  return client().transactGet(
    commands.buildTransactGet(transactItems, options)
  );
}

export function transactWrite(
  transactItems: DocumentClient.TransactWriteItemList,
  options?: Partial<DocumentClient.TransactWriteItemsInput>
) {
  return client()
    .transactWrite(commands.buildTransactWrite(transactItems, options))
    .promise();
}

export function set(
  list: number[] | string[] | DocumentClient.binaryType[],
  options?: Partial<DocumentClient.CreateSetOptions>
) {
  return client().createSet(list, options);
}

export {
  attribute_exists,
  attribute_not_exists,
  attribute_type,
  begins_with,
  between,
  contains,
  ge,
  gt,
  inList,
  le,
  lt,
  ne,
  size,
} from './helpers';

export { transactItem } from './transact-item';

export { batchItem } from './batch-item';
