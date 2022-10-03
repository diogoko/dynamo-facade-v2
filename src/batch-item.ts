import { DocumentClient } from 'aws-sdk/clients/dynamodb';

/**
 * Helper functions to create batch items for `batchGet` and `batchWrite`.
 *
 * The suggested import is:
 *
 * ```js
 * import { batchItem as bi } from 'dynamo-facade-v2';
 * ```
 */
export const batchItem = {
  get(
    tableName: string,
    key: DocumentClient.Key | DocumentClient.Key[],
    options?: Partial<DocumentClient.KeysAndAttributes>
  ): DocumentClient.BatchGetRequestMap {
    const keyList = Array.isArray(key) ? key : [key];

    return {
      [tableName]: {
        Keys: keyList,
        ...options,
      },
    };
  },

  put(
    tableName: string,
    item:
      | DocumentClient.PutItemInputAttributeMap
      | DocumentClient.PutItemInputAttributeMap[]
  ): DocumentClient.BatchWriteItemRequestMap {
    const itemList = Array.isArray(item) ? item : [item];

    return {
      [tableName]: itemList.map((item) => ({ PutRequest: { Item: item } })),
    };
  },

  delete(
    tableName: string,
    key: DocumentClient.Key | DocumentClient.Key[]
  ): DocumentClient.BatchWriteItemRequestMap {
    const keyList = Array.isArray(key) ? key : [key];

    return {
      [tableName]: keyList.map((key) => ({ DeleteRequest: { Key: key } })),
    };
  },
};

export default batchItem;
