import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import * as commands from './commands';
import DynamoFacade, { DocumentClientOptions } from './facade';

/**
 * Default options for `DocumentClient` initialization when calling this module's functions.
 *
 * After the first call to one of these functions, new changes to the defaults are ignored.
 */
export const defaults: DocumentClientOptions = {};

let _facade: DynamoFacade;
function facade() {
  if (!_facade) {
    _facade = new DynamoFacade(defaults);
  }
  return _facade;
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
export function batchGet(
  requestItems: DocumentClient.BatchGetRequestMap[],
  options?: Partial<DocumentClient.BatchGetItemInput>
) {
  return facade().batchGet(requestItems, options);
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
export function batchWrite(
  requestItems: DocumentClient.BatchWriteItemRequestMap[],
  options?: Partial<DocumentClient.BatchWriteItemInput>
) {
  return facade().batchWrite(requestItems, options);
}

/**
 * Returns a set of attributes for the item with the given primary key by delegating to `DocumentClient.get`.
 *
 * @param tableName The name of the table containing the requested item
 * @param key A map of attribute names to values, representing the primary key of the item to retrieve
 * @param options The options accepted by the original `get` method
 * @returns The same response returned by `get().promise()`
 */
export function get(
  tableName: string,
  key: DocumentClient.Key,
  options?: Partial<DocumentClient.GetItemInput>
) {
  return facade().get(tableName, key, options);
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
export function scan(
  tableName: string,
  filter: DocumentClient.AttributeMap,
  options?: DocumentClient.ScanInput
) {
  return facade().scan(tableName, filter, options);
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
export function query(
  tableName: string,
  keyCondition: DocumentClient.AttributeMap,
  options?: Partial<commands.FacadeQueryInput>
) {
  return facade().query(tableName, keyCondition, options);
}

/**
 * Creates a new item, or replaces an old item with a new item by delegating to `DocumentClient.put`.
 *
 * @param tableName The name of the table to contain the item
 * @param item A map of attribute name/value pairs, one for each attribute
 * @param options The options accepted by the original `put` method, plus an optional `condition` field that generates `ConditionExpression`
 * @returns The same response returned by `put().promise()`
 */
export function put(
  tableName: string,
  item: DocumentClient.PutItemInputAttributeMap,
  options?: Partial<commands.FacadePutItemInput>
) {
  return facade().put(tableName, item, options);
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
export function update(
  tableName: string,
  key: DocumentClient.Key,
  updatedValues: DocumentClient.AttributeMap,
  options?: Partial<commands.FacadeUpdateItemInput>
) {
  return facade().update(tableName, key, updatedValues, options);
}

/**
 * Deletes a single item in a table by primary key by delegating to `DocumentClient.delete`.
 *
 * @param tableName The name of the table from which to delete the item
 * @param key A map of attribute names to values, representing the primary key of the item to delete
 * @param options The options accepted by the original `delete` method, plus an optional `condition` field that generates `ConditionExpression`
 * @returns The same response returned by `delete().promise()`
 */
export function deleteItem(
  tableName: string,
  key: DocumentClient.Key,
  options?: Partial<commands.FacadeUpdateItemInput>
) {
  return facade().deleteItem(tableName, key, options);
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
export function transactGet(
  transactItems: DocumentClient.TransactGetItemList,
  options?: Partial<DocumentClient.TransactGetItemsInput>
) {
  return facade().transactGet(transactItems, options);
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
export function transactWrite(
  transactItems: DocumentClient.TransactWriteItemList,
  options?: Partial<DocumentClient.TransactWriteItemsInput>
) {
  return facade().transactWrite(transactItems, options);
}

/**
 * Creates a set of elements by delegating to `DocumentClient.createSet`.
 *
 * @param list Collection to represent your DynamoDB Set
 * @param options The options accepted by the original `createSet` method
 * @returns The created DynamoDB Set
 */
export function set(
  list: number[] | string[] | DocumentClient.binaryType[],
  options?: Partial<DocumentClient.CreateSetOptions>
) {
  return facade().set(list, options);
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

export * as transactItem from './transact-item';

export * as batchItem from './batch-item';

export * as commands from './commands';

export { default as DynamoFacade } from './facade';
