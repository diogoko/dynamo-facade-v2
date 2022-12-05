import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { buildExpression, buildUpdateExpression } from './expression';
import { isObjectNotEmpty, optionalField } from './utils';

export interface FacadeQueryInput extends DocumentClient.QueryInput {
  /**
   * An object describing the comparisons to generate `FilterExpression`, `ExpressionAttributeNames`, and `ExpressionAttributeValues`
   */
  filter?: DocumentClient.AttributeMap;
}

export interface FacadePutItemInput extends DocumentClient.PutItemInput {
  /**
   * An object describing the comparisons to generate `ConditionExpression`, `ExpressionAttributeNames`, and `ExpressionAttributeValues`
   */
  condition?: DocumentClient.AttributeMap;
}

export interface FacadeUpdateItemInput extends DocumentClient.UpdateItemInput {
  /**
   * An object describing the comparisons to generate `ConditionExpression`, `ExpressionAttributeNames`, and `ExpressionAttributeValues`
   */
  condition?: DocumentClient.AttributeMap;
}

export interface FacadeDeleteItemInput extends DocumentClient.DeleteItemInput {
  /**
   * An object describing the comparisons to generate `ConditionExpression`, `ExpressionAttributeNames`, and `ExpressionAttributeValues`
   */
  condition?: DocumentClient.AttributeMap;
}

/**
 * Create the input parameters for `DocumentClient.get`.
 *
 * @param tableName The name of the table containing the requested item
 * @param key A map of attribute names to values, representing the primary key of the item to retrieve
 * @param options The options accepted by the original `get` method
 * @returns An object with the input parameters
 */
export function buildGet(
  tableName: string,
  key: DocumentClient.Key,
  options?: Partial<DocumentClient.GetItemInput>
): DocumentClient.GetItemInput {
  return {
    TableName: tableName,
    Key: key,
    ...options,
  };
}

/**
 * Create the input parameters for `DocumentClient.query`.
 *
 * @param tableName The name of the table containing the requested items
 * @param keyCondition An object describing the comparisons used to generate `KeyConditionExpression`, `ExpressionAttributeNames`, and `ExpressionAttributeValues`
 * @param options The options accepted by the original `query` method, plus an optional `filter` field that generates `FilterExpression`
 * @returns An object with the input parameters
 */
export function buildQuery(
  tableName: string,
  keyCondition: DocumentClient.AttributeMap,
  options?: Partial<FacadeQueryInput>
): DocumentClient.QueryInput {
  const keyConditionInfo = buildExpression(keyCondition);

  const { filter, ...remainingOptions } = options ?? {};
  const filterInfo = buildExpression(filter);

  return {
    TableName: tableName,
    KeyConditionExpression: keyConditionInfo.expression,
    ExpressionAttributeNames: {
      ...keyConditionInfo.names,
      ...filterInfo.names,
    },
    ExpressionAttributeValues: {
      ...keyConditionInfo.values,
      ...filterInfo.values,
    },
    ...optionalField('FilterExpression', filterInfo.expression),
    ...remainingOptions,
  };
}

/**
 * Create the input parameters for `DocumentClient.scan`.
 *
 * @param tableName The name of the table containing the requested items; or, if you provide `IndexName` in the `options`, the name of the table to which that index belongs
 * @param filter An object describing the comparisons used to generate `FilterExpression`, `ExpressionAttributeNames`, and `ExpressionAttributeValues`
 * @param options The options accepted by the original `scan` method
 * @returns An object with the input parameters
 */
export function buildScan(
  tableName: string,
  filter?: DocumentClient.AttributeMap,
  options?: Partial<DocumentClient.ScanInput>
): DocumentClient.ScanInput {
  const filterInfo = buildExpression(filter);

  return {
    TableName: tableName,
    ...optionalField('FilterExpression', filterInfo.expression),
    ...optionalField(
      'ExpressionAttributeNames',
      filterInfo.names,
      isObjectNotEmpty
    ),
    ...optionalField(
      'ExpressionAttributeValues',
      filterInfo.values,
      isObjectNotEmpty
    ),
    ...options,
  };
}

/**
 * Create the input parameters for `DocumentClient.put`.
 *
 * @param tableName The name of the table to contain the item
 * @param item A map of attribute name/value pairs, one for each attribute
 * @param options The options accepted by the original `put` method, plus an optional `condition` field that generates `ConditionExpression`
 * @returns An object with the input parameters
 */
export function buildPut(
  tableName: string,
  item: DocumentClient.PutItemInputAttributeMap,
  options?: Partial<FacadePutItemInput>
): DocumentClient.PutItemInput {
  const { condition, ...remainingOptions } = options ?? {};
  const conditionInfo = buildExpression(condition);

  return {
    TableName: tableName,
    Item: item,
    ...optionalField('ConditionExpression', conditionInfo.expression),
    ...optionalField(
      'ExpressionAttributeNames',
      conditionInfo.names,
      isObjectNotEmpty
    ),
    ...optionalField(
      'ExpressionAttributeValues',
      conditionInfo.values,
      isObjectNotEmpty
    ),
    ...remainingOptions,
  };
}

/**
 * Create the input parameters for `DocumentClient.update`.
 *
 * @param tableName The name of the table containing the item to update
 * @param key The primary key of the item to be updated
 * @param updatedValues A map of attribute name/value pairs with the attributes that must be modified
 * @param options The options accepted by the original `update` method, plus an optional `condition` field that generates `ConditionExpression`
 * @returns An object with the input parameters
 */
export function buildUpdate(
  tableName: string,
  key: DocumentClient.Key,
  updatedValues: DocumentClient.AttributeMap,
  options?: Partial<FacadeUpdateItemInput>
): DocumentClient.UpdateItemInput {
  const { condition, ...remainingOptions } = options ?? {};
  const conditionInfo = buildExpression(condition);

  const updatedValuesInfo = buildUpdateExpression(updatedValues);

  return {
    TableName: tableName,
    Key: key,
    UpdateExpression: updatedValuesInfo.expression,
    ...optionalField('ConditionExpression', conditionInfo.expression),
    ...optionalField(
      'ExpressionAttributeNames',
      { ...conditionInfo.names, ...updatedValuesInfo.names },
      isObjectNotEmpty
    ),
    ...optionalField(
      'ExpressionAttributeValues',
      { ...conditionInfo.values, ...updatedValuesInfo.values },
      isObjectNotEmpty
    ),
    ...remainingOptions,
  };
}

/**
 * Create the input parameters for `DocumentClient.delete`.
 *
 * @param tableName The name of the table from which to delete the item
 * @param key A map of attribute names to values, representing the primary key of the item to delete
 * @param options The options accepted by the original `delete` method, plus an optional `condition` field that generates `ConditionExpression`
 * @returns An object with the input parameters
 */
export function buildDelete(
  tableName: string,
  key: DocumentClient.Key,
  options?: Partial<FacadeDeleteItemInput>
): DocumentClient.DeleteItemInput {
  const { condition, ...remainingOptions } = options ?? {};
  const conditionInfo = buildExpression(condition);

  return {
    TableName: tableName,
    Key: key,
    ...optionalField('ConditionExpression', conditionInfo.expression),
    ...optionalField(
      'ExpressionAttributeNames',
      conditionInfo.names,
      isObjectNotEmpty
    ),
    ...optionalField(
      'ExpressionAttributeValues',
      conditionInfo.values,
      isObjectNotEmpty
    ),
    ...remainingOptions,
  };
}

/**
 * Create a map to build the `ConditionCheck` operation to use {@link transactWrite}.
 *
 * @param tableName The name of the table that should contain the item
 * @param key The primary key of the item to be checked
 * @param condition An object describing the comparisons to generate `ConditionExpression`, `ExpressionAttributeNames`, and `ExpressionAttributeValues`
 * @param options The same parameters accepted by the original `Document.transactWrite` condition check items
 * @returns A map in the format `{ TableName, Key, ... }`
 */
export function buildConditionCheck(
  tableName: string,
  key: DocumentClient.Key,
  condition: DocumentClient.AttributeMap,
  options?: Partial<DocumentClient.ConditionCheck>
) {
  const conditionInfo = buildExpression(condition);

  return {
    TableName: tableName,
    Key: key,
    ...optionalField('ConditionExpression', conditionInfo.expression),
    ...optionalField(
      'ExpressionAttributeNames',
      conditionInfo.names,
      isObjectNotEmpty
    ),
    ...optionalField(
      'ExpressionAttributeValues',
      conditionInfo.values,
      isObjectNotEmpty
    ),
    ...options,
  };
}

/**
 * Create the input parameters for `Document.transactGet`.
 *
 * @param transactItems The items to get in the format `[{ Get: { TableName: ..., Key: ... } }, ...]`
 * @param options The options accepted by the original `transactGet` method
 * @returns An object with the input parameters
 */
export function buildTransactGet(
  transactItems: DocumentClient.TransactGetItemList,
  options?: Partial<DocumentClient.TransactGetItemsInput>
) {
  return {
    TransactItems: transactItems,
    ...options,
  };
}

/**
 * Create the input parameters for `Document.transactWrite`.
 *
 * @param transactItems The items to write in the format `[ { Put: { ... } }, ...]`
 * @param options The options accepted by the original `transactWrite` method
 * @returns An object with the input parameters
 */
export function buildTransactWrite(
  transactItems: DocumentClient.TransactWriteItemList,
  options?: Partial<DocumentClient.TransactWriteItemsInput>
): DocumentClient.TransactWriteItemsInput {
  return {
    TransactItems: transactItems,
    ...options,
  };
}

/**
 * Create the input parameters for `Document.batchGet`.
 *
 * @param requestItems The items to get in the format `{ [tableName]: { Keys: [...] } }`
 * @param options The options accepted by the original `batchGet` method
 * @returns An object with the input parameters
 */
export function buildBatchGet(
  requestItems: DocumentClient.BatchGetRequestMap[],
  options?: Partial<DocumentClient.BatchGetItemInput>
) {
  const mergedItems: DocumentClient.BatchGetRequestMap = {};

  requestItems.forEach((item) => {
    Object.entries(item).forEach(([tableName, { Keys: keys }]) => {
      if (tableName in mergedItems) {
        mergedItems[tableName].Keys = [...mergedItems[tableName].Keys, ...keys];
      } else {
        mergedItems[tableName] = {
          Keys: keys,
        };
      }
    });
  });

  return {
    RequestItems: mergedItems,
    ...options,
  };
}

/**
 * Create the input parameters for `Document.batchWrite`.
 *
 * @param requestItems The items to write in the format `{ tableName: [ { ...request }, ...] }`
 * @param options The options accepted by the original `batchWrite` method
 * @returns An object with the input parameters
 */
export function buildBatchWrite(
  requestItems: DocumentClient.BatchWriteItemRequestMap[],
  options?: Partial<DocumentClient.BatchWriteItemInput>
) {
  const mergedItems: DocumentClient.BatchWriteItemRequestMap = {};

  requestItems.forEach((item) => {
    Object.entries(item).forEach(([tableName, writeRequests]) => {
      if (tableName in mergedItems) {
        mergedItems[tableName] = [...mergedItems[tableName], ...writeRequests];
      } else {
        mergedItems[tableName] = writeRequests;
      }
    });
  });

  return {
    RequestItems: mergedItems,
    ...options,
  };
}
