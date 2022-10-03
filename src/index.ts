/* eslint-disable @typescript-eslint/no-explicit-any */
import DynamoDB, { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { ServiceConfigurationOptions } from 'aws-sdk/lib/service';
import CommandBuilder, {
  FacadePutItemInput,
  FacadeQueryInput,
  FacadeUpdateItemInput,
} from './command';

export class DynamoFacade {
  defaults: DocumentClient.DocumentClientOptions &
    ServiceConfigurationOptions &
    DynamoDB.ClientApiVersions = {};

  private _client?: DocumentClient;

  get client() {
    if (!this._client) {
      this._client = new DocumentClient(this.defaults);
    }
    return this._client;
  }

  private builder: CommandBuilder;

  constructor(client?: DocumentClient) {
    this._client = client;
    this.builder = new CommandBuilder();
  }

  batchGet(
    requestItems: DocumentClient.BatchGetRequestMap[],
    options?: Partial<DocumentClient.BatchGetItemInput>
  ) {
    return this.client.batchGet(
      this.builder.buildBatchGet(requestItems, options)
    );
  }

  batchWrite(
    requestItems: DocumentClient.BatchWriteItemRequestMap[],
    options?: Partial<DocumentClient.BatchWriteItemInput>
  ) {
    return this.client.batchWrite(
      this.builder.buildBatchWrite(requestItems, options)
    );
  }

  get(
    tableName: string,
    key: DocumentClient.Key,
    options?: Partial<DocumentClient.GetItemInput>
  ) {
    return this.client
      .get(this.builder.buildGet(tableName, key, options))
      .promise();
  }

  scan(tableName: string, filter: any, options?: DocumentClient.ScanInput) {
    return this.client
      .scan(this.builder.buildScan(tableName, filter, options))
      .promise();
  }

  query(
    tableName: string,
    keyCondition: any,
    options?: Partial<FacadeQueryInput>
  ) {
    return this.client
      .query(this.builder.buildQuery(tableName, keyCondition, options))
      .promise();
  }

  put(
    tableName: string,
    item: DocumentClient.PutItemInputAttributeMap,
    options?: Partial<FacadePutItemInput>
  ) {
    return this.client
      .put(this.builder.buildPut(tableName, item, options))
      .promise();
  }

  update(
    tableName: string,
    key: DocumentClient.Key,
    updatedValues: any,
    options?: Partial<FacadeUpdateItemInput>
  ) {
    return this.client
      .update(this.builder.buildUpdate(tableName, key, updatedValues, options))
      .promise();
  }

  delete(
    tableName: string,
    key: DocumentClient.Key,
    options?: Partial<FacadeUpdateItemInput>
  ) {
    return this.client
      .delete(this.builder.buildDelete(tableName, key, options))
      .promise();
  }

  transactGet(
    transactItems: DocumentClient.TransactGetItemList,
    options?: Partial<DocumentClient.TransactGetItemsInput>
  ) {
    return this.client.transactGet(
      this.builder.buildTransactGet(transactItems, options)
    );
  }

  transactWrite(
    transactItems: DocumentClient.TransactWriteItemList,
    options?: Partial<DocumentClient.TransactWriteItemsInput>
  ) {
    return this.client
      .transactWrite(this.builder.buildTransactWrite(transactItems, options))
      .promise();
  }

  set(
    list: number[] | string[] | DocumentClient.binaryType[],
    options?: Partial<DocumentClient.CreateSetOptions>
  ) {
    return this.client.createSet(list, options);
  }
}

/**
 * @ignore
 */
export default new DynamoFacade();

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

export * from './transact-item';

export * from './batch-item';
