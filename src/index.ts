/* eslint-disable @typescript-eslint/no-explicit-any */
import DynamoDB, { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { ServiceConfigurationOptions } from 'aws-sdk/lib/service';
import CommandBuilder, {
  FacadePutItemInput,
  FacadeQueryInput,
  FacadeUpdateItemInput,
} from './command';

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

const builder = new CommandBuilder();

export function batchGet(
  requestItems: DocumentClient.BatchGetRequestMap[],
  options?: Partial<DocumentClient.BatchGetItemInput>
) {
  return client().batchGet(builder.buildBatchGet(requestItems, options));
}

export function batchWrite(
  requestItems: DocumentClient.BatchWriteItemRequestMap[],
  options?: Partial<DocumentClient.BatchWriteItemInput>
) {
  return client().batchWrite(builder.buildBatchWrite(requestItems, options));
}

export function get(
  tableName: string,
  key: DocumentClient.Key,
  options?: Partial<DocumentClient.GetItemInput>
) {
  return client().get(builder.buildGet(tableName, key, options)).promise();
}

export function scan(
  tableName: string,
  filter: any,
  options?: DocumentClient.ScanInput
) {
  return client().scan(builder.buildScan(tableName, filter, options)).promise();
}

export function query(
  tableName: string,
  keyCondition: any,
  options?: Partial<FacadeQueryInput>
) {
  return client()
    .query(builder.buildQuery(tableName, keyCondition, options))
    .promise();
}

export function put(
  tableName: string,
  item: DocumentClient.PutItemInputAttributeMap,
  options?: Partial<FacadePutItemInput>
) {
  return client().put(builder.buildPut(tableName, item, options)).promise();
}

export function update(
  tableName: string,
  key: DocumentClient.Key,
  updatedValues: any,
  options?: Partial<FacadeUpdateItemInput>
) {
  return client()
    .update(builder.buildUpdate(tableName, key, updatedValues, options))
    .promise();
}

export function deleteItem(
  tableName: string,
  key: DocumentClient.Key,
  options?: Partial<FacadeUpdateItemInput>
) {
  return client()
    .delete(builder.buildDelete(tableName, key, options))
    .promise();
}

export function transactGet(
  transactItems: DocumentClient.TransactGetItemList,
  options?: Partial<DocumentClient.TransactGetItemsInput>
) {
  return client().transactGet(builder.buildTransactGet(transactItems, options));
}

export function transactWrite(
  transactItems: DocumentClient.TransactWriteItemList,
  options?: Partial<DocumentClient.TransactWriteItemsInput>
) {
  return client()
    .transactWrite(builder.buildTransactWrite(transactItems, options))
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
