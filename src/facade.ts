import DynamoDB, { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { ServiceConfigurationOptions } from 'aws-sdk/lib/service';
import * as commands from './commands';

export type DocumentClientOptions = DocumentClient.DocumentClientOptions &
  ServiceConfigurationOptions &
  DynamoDB.ClientApiVersions;

/**
 * Facade class for easy access to DynamoDB.
 */
export default class DynamoFacade {
  /**
   * The options used to initialize this object's `DocumentClient` instance.
   */
  options: DocumentClientOptions;

  /**
   * @param options Options for `DocumentClient` initialization
   */
  constructor(options: DocumentClientOptions = {}) {
    this.options = options;
  }

  private _client: DocumentClient | null = null;

  /**
   * The `DocumentClient` instance used by the methods of this object.
   *
   * This property is lazily initialized.
   */
  get client() {
    if (!this._client) {
      this._client = new DocumentClient(this.options);
    }
    return this._client;
  }

  /**
   * Returns the attributes of one or more items from one or more tables by delegating to `DocumentClient.batchGet()`.
   *
   * You can use the {@link batchItem} helper to create the request items.
   *
   * @example
   * ```js
   * import { batchItem as bi } from 'dynamo-facade-v2';
   *
   * // These two are equivalent
   * df.batchGet([
   *   bi.get('movies', { actor: 'Tom Hanks', movie: 'Toy Story' }),
   *   bi.get('movies', { actor: 'Tom Hanks', movie: 'Forrest Gump' }),
   * ])
   *
   * df.batchGet([
   *   bi.get('movies', [
   *     { actor: 'Tom Hanks', movie: 'Toy Story' },
   *     { actor: 'Tom Hanks', movie: 'Forrest Gump' },
   *   ])
   * ])
   * ```
   *
   * @param requestItems The items to get in the format `{ [tableName]: { Keys: [...] } }`
   * @param options The options accepted by the original `batchGet` method
   * @returns The same response returned by `batchGet().promise()`
   */
  batchGet(
    requestItems: DocumentClient.BatchGetRequestMap[],
    options?: Partial<DocumentClient.BatchGetItemInput>
  ) {
    return this.client
      .batchGet(commands.buildBatchGet(requestItems, options))
      .promise();
  }

  /**
   * Puts or deletes multiple items in one or more tables by delegating to `DocumentClient.batchWrite()`.
   *
   * You can use the {@link batchItem} helper to create the request items.
   *
   * @example
   * ```js
   * import { batchItem as bi } from 'dynamo-facade-v2';
   *
   * df.batchWrite([
   *   bi.put('movies', [
   *     { actor: 'Tom Hanks', movie: 'Toy Story' },
   *     { actor: 'Tom Hanks', movie: 'Forrest Gump' },
   *   ])
   * ])
   * ```
   *
   * @param requestItems The items to write in the format `{ tableName: [ { ...request }, ...] }`
   * @param options The options accepted by the original `batchWrite` method
   * @returns The same response returned by `batchWrite().promise()`
   */
  batchWrite(
    requestItems: DocumentClient.BatchWriteItemRequestMap[],
    options?: Partial<DocumentClient.BatchWriteItemInput>
  ) {
    return this.client
      .batchWrite(commands.buildBatchWrite(requestItems, options))
      .promise();
  }

  /**
   * Returns a set of attributes for the item with the given primary key by delegating to `DocumentClient.get`.
   *
   * @param tableName The name of the table containing the requested item
   * @param key A map of attribute names to values, representing the primary key of the item to retrieve
   * @param options The options accepted by the original `get` method
   * @returns The same response returned by `get().promise()`
   */
  get(
    tableName: string,
    key: DocumentClient.Key,
    options?: Partial<DocumentClient.GetItemInput>
  ) {
    return this.client
      .get(commands.buildGet(tableName, key, options))
      .promise();
  }

  /**
   * Returns one or more items and item attributes by accessing every item in a table or a secondary index by delegating to `DocumentClient.scan`.
   *
   * @example
   * ```js
   * df.scan('movies', { actor: 'Tom Hanks' })
   * ```
   *
   * @param tableName The name of the table containing the requested items; or, if you provide `IndexName` in the `options`, the name of the table to which that index belongs
   * @param filter An object describing the comparisons used to generate `FilterExpression`, `ExpressionAttributeNames`, and `ExpressionAttributeValues`
   * @param options The options accepted by the original `scan` method
   * @returns The same response returned by `scan().promise()`
   */
  scan(
    tableName: string,
    filter: DocumentClient.AttributeMap,
    options?: DocumentClient.ScanInput
  ) {
    return this.client
      .scan(commands.buildScan(tableName, filter, options))
      .promise();
  }

  /**
   * Directly access items from a table by primary key or a secondary index by delegating to `DocumentClient.query`.
   *
   * @example
   * ```js
   * df.query('movies', { actor: 'Tom Hanks', movie: 'Toy Story' })
   * ```
   *
   * @param tableName The name of the table containing the requested items
   * @param keyCondition An object describing the comparisons used to generate `KeyConditionExpression`, `ExpressionAttributeNames`, and `ExpressionAttributeValues`
   * @param options The options accepted by the original `query` method, plus an optional `filter` field that generates `FilterExpression`
   * @returns The same response returned by `query().promise()`
   */
  query(
    tableName: string,
    keyCondition: DocumentClient.AttributeMap,
    options?: Partial<commands.FacadeQueryInput>
  ) {
    return this.client
      .query(commands.buildQuery(tableName, keyCondition, options))
      .promise();
  }

  /**
   * Creates a new item, or replaces an old item with a new item by delegating to `DocumentClient.put`.
   *
   * @param tableName The name of the table to contain the item
   * @param item A map of attribute name/value pairs, one for each attribute
   * @param options The options accepted by the original `put` method, plus an optional `condition` field that generates `ConditionExpression`
   * @returns The same response returned by `put().promise()`
   */
  put(
    tableName: string,
    item: DocumentClient.PutItemInputAttributeMap,
    options?: Partial<commands.FacadePutItemInput>
  ) {
    return this.client
      .put(commands.buildPut(tableName, item, options))
      .promise();
  }

  /**
   * Edits an existing item's attributes, or adds a new item to the table if it does not already exist by delegating to `DocumentClient.update`.
   *
   * @param tableName The name of the table containing the item to update
   * @param key The primary key of the item to be updated
   * @param updatedValues A map of attribute name/value pairs with the attributes that must be modified
   * @param options The options accepted by the original `update` method, plus an optional `condition` field that generates `ConditionExpression`
   * @returns The same response returned by `update().promise()`
   */
  update(
    tableName: string,
    key: DocumentClient.Key,
    updatedValues: DocumentClient.AttributeMap,
    options?: Partial<commands.FacadeUpdateItemInput>
  ) {
    return this.client
      .update(commands.buildUpdate(tableName, key, updatedValues, options))
      .promise();
  }

  /**
   * Deletes a single item in a table by primary key by delegating to `DocumentClient.delete`.
   *
   * @param tableName The name of the table from which to delete the item
   * @param key A map of attribute names to values, representing the primary key of the item to delete
   * @param options The options accepted by the original `delete` method, plus an optional `condition` field that generates `ConditionExpression`
   * @returns The same response returned by `delete().promise()`
   */
  deleteItem(
    tableName: string,
    key: DocumentClient.Key,
    options?: Partial<commands.FacadeUpdateItemInput>
  ) {
    return this.client
      .delete(commands.buildDelete(tableName, key, options))
      .promise();
  }

  /**
   * Atomically retrieves multiple items from one or more tables (but not from indexes) in a single account and region by delegating to `DocumentClient.transactGet`.
   *
   * You can use the {@link transactItem} helper to create the request items.
   *
   * @example
   * ```js
   * import { transactItem as tr } from 'dynamo-facade-v2';
   *
   * df.transactGet([
   *   tr.get('movies', { actor: 'Tom Hanks', movie: 'Toy Story' }
   * ])
   * ```
   *
   * @param transactItems The items to get in the format `[{ Get: { TableName: ..., Key: ... } }, ...]`
   * @param options The options accepted by the original `transactGet` method
   * @returns The same response returned by `transactGet().promise()`
   */
  transactGet(
    transactItems: DocumentClient.TransactGetItemList,
    options?: Partial<DocumentClient.TransactGetItemsInput>
  ) {
    return this.client.transactGet(
      commands.buildTransactGet(transactItems, options)
    );
  }

  /**
   * Synchronous write operation that groups up to 25 action requests by delegating to `DocumentClient.transactWrite`.
   *
   * You can use the {@link transactItem} helper to create the request items.
   *
   * @example
   * ```js
   * import { transactItem as tr } from 'dynamo-facade-v2';
   *
   * df.transactWrite([
   *   tr.put('movies', { actor: 'Tom Hanks', movie: 'Toy Story' }
   * ])
   * ```
   *
   * @param transactItems The items to write in the format `[ { Put: { ... } }, ...]`
   * @param options The options accepted by the original `transactWrite` method
   * @returns The same response returned by `transactWrite().promise()`
   */
  transactWrite(
    transactItems: DocumentClient.TransactWriteItemList,
    options?: Partial<DocumentClient.TransactWriteItemsInput>
  ) {
    return this.client
      .transactWrite(commands.buildTransactWrite(transactItems, options))
      .promise();
  }

  /**
   * Creates a set of elements by delegating to `DocumentClient.createSet`.
   *
   * @param list Collection to represent your DynamoDB Set
   * @param options The options accepted by the original `createSet` method
   * @returns The created DynamoDB Set
   */
  set(
    list: number[] | string[] | DocumentClient.binaryType[],
    options?: Partial<DocumentClient.CreateSetOptions>
  ) {
    return this.client.createSet(list, options);
  }
}
