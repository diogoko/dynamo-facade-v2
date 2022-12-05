/* eslint-disable @typescript-eslint/no-explicit-any */
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import * as commands from './commands';

export interface FacadePut extends DocumentClient.Put {
  /**
   * An object describing the comparisons to generate `ConditionExpression`, `ExpressionAttributeNames`, and `ExpressionAttributeValues`
   */
  condition?: any;
}

export interface FacadeUpdate extends DocumentClient.Update {
  /**
   * An object describing the comparisons to generate `ConditionExpression`, `ExpressionAttributeNames`, and `ExpressionAttributeValues`
   */
  condition?: any;
}

export interface FacadeDelete extends DocumentClient.Delete {
  /**
   * An object describing the comparisons to generate `ConditionExpression`, `ExpressionAttributeNames`, and `ExpressionAttributeValues`
   */
  condition?: any;
}

/**
 * Create a map to get one or more items using {@link transactGet}.
 *
 * @param tableName The name of the table that contains the item
 * @param key A map of attribute names to values that specifies the primary key of the item to retrieve
 * @param options The same parameters accepted by the original `Document.transactGet` items
 * @returns A map in the format `{ Get: { TableName: ..., Key: ... } }`
 */
export function get(
  tableName: string,
  key: DocumentClient.Key,
  options?: Partial<DocumentClient.Get>
) {
  return {
    Get: {
      TableName: tableName,
      Key: key,
      ...options,
    },
  };
}

/**
 * Create a map for the `ConditionCheck` operation to use {@link transactWrite}.
 *
 * @param tableName The name of the table that should contain the item
 * @param key The primary key of the item to be checked
 * @param condition An object describing the comparisons to generate `ConditionExpression`, `ExpressionAttributeNames`, and `ExpressionAttributeValues`
 * @param options The same parameters accepted by the original `Document.transactWrite` condition check items
 * @returns A map in the format `{ ConditionCheck: { ... } }`
 */
export function conditionCheck(
  tableName: string,
  key: DocumentClient.Key,
  condition: any,
  options?: Partial<DocumentClient.ConditionCheck>
) {
  const command = commands.buildConditionCheck(
    tableName,
    key,
    condition,
    options
  );

  return {
    ConditionCheck: command as DocumentClient.ConditionCheck,
  };
}

/**
 * Create a map for the `Put` operation to use {@link transactWrite}.
 *
 * @param tableName The name of the table to write the item in
 * @param item An object with the item's attributes
 * @param options The same parameters accepted by the original `Document.transactWrite` put items
 * @returns A map in the format `{ Put: { ... } }`
 */
export function put(
  tableName: string,
  item: DocumentClient.PutItemInputAttributeMap,
  options?: Partial<FacadePut>
) {
  const command = commands.buildPut(tableName, item, options);

  return {
    Put: command as DocumentClient.Put,
  };
}

/**
 * Create a map for the `Update` operation to use {@link transactWrite}.
 *
 * @param tableName The name of the table where the item resides
 * @param key The primary key of the item to be updated
 * @param updatedValues A map of attribute name/value pairs with the attributes that must be modified
 * @param options The same parameters accepted by the original `Document.transactWrite` update items
 * @returns A map in the format `{ Update: { ... } }`
 */
export function update(
  tableName: string,
  key: DocumentClient.Key,
  updatedValues: any,
  options?: Partial<FacadeUpdate>
) {
  const command = commands.buildUpdate(tableName, key, updatedValues, options);

  return {
    Update: command as DocumentClient.Update,
  };
}

/**
 * Create a map for the `Delete` operation to use {@link transactWrite}.
 *
 * @param tableName The name of the table where the item resides
 * @param key The primary key of the item to be deleted
 * @param options The same parameters accepted by the original `Document.transactWrite` delete items
 * @returns A map in the format `{ Delete: { ... } }`
 */
export function deleteItem(
  tableName: string,
  key: DocumentClient.Key,
  options?: Partial<FacadeDelete>
) {
  const command = commands.buildDelete(tableName, key, options);

  return {
    Delete: command as DocumentClient.Delete,
  };
}
