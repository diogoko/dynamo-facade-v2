/* eslint-disable @typescript-eslint/no-explicit-any */
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { buildExpression, buildUpdateExpression } from './expression';
import { isObjectNotEmpty, optionalField } from './utils';

export interface FacadeQueryInput extends DocumentClient.QueryInput {
  filter?: any;
}

export interface FacadePutItemInput extends DocumentClient.PutItemInput {
  condition?: any;
}

export interface FacadeUpdateItemInput extends DocumentClient.UpdateItemInput {
  condition?: any;
}

export interface FacadeDeleteItemInput extends DocumentClient.DeleteItemInput {
  condition?: any;
}

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

export function buildQuery(
  tableName: string,
  keyCondition: any,
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

export function buildScan(
  tableName: string,
  filter?: any,
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

export function buildUpdate(
  tableName: string,
  key: DocumentClient.Key,
  updatedValues: any,
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

export function buildConditionCheck(
  tableName: string,
  key: DocumentClient.Key,
  condition: any,
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

export function buildTransactGet(
  transactItems: DocumentClient.TransactGetItemList,
  options?: Partial<DocumentClient.TransactGetItemsInput>
) {
  return {
    TransactItems: transactItems,
    ...options,
  };
}

export function buildTransactWrite(
  transactItems: DocumentClient.TransactWriteItemList,
  options?: Partial<DocumentClient.TransactWriteItemsInput>
): DocumentClient.TransactWriteItemsInput {
  return {
    TransactItems: transactItems,
    ...options,
  };
}

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
