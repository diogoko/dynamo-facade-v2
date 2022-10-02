/* eslint-disable @typescript-eslint/no-explicit-any */
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import CommandBuilder from './command';

const builder = new CommandBuilder();

export interface FacadePut extends DocumentClient.Put {
  condition?: any;
}

export interface FacadeUpdate extends DocumentClient.Update {
  condition?: any;
}

export interface FacadeDelete extends DocumentClient.Delete {
  condition?: any;
}

export const transactItem = {
  get(
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
  },

  conditionCheck(
    tableName: string,
    key: DocumentClient.Key,
    condition: any,
    options?: Partial<DocumentClient.ConditionCheck>
  ) {
    const command = builder.buildConditionCheck(
      tableName,
      key,
      condition,
      options
    );

    return {
      ConditionCheck: command as DocumentClient.ConditionCheck,
    };
  },

  put(
    tableName: string,
    item: DocumentClient.PutItemInputAttributeMap,
    options?: Partial<FacadePut>
  ) {
    const command = builder.buildPut(tableName, item, options);

    return {
      Put: command as DocumentClient.Put,
    };
  },

  update(
    tableName: string,
    key: DocumentClient.Key,
    updatedValues: any,
    options?: Partial<FacadeUpdate>
  ) {
    const command = builder.buildUpdate(tableName, key, updatedValues, options);

    return {
      Update: command as DocumentClient.Update,
    };
  },

  delete(
    tableName: string,
    key: DocumentClient.Key,
    options?: Partial<FacadeDelete>
  ) {
    const command = builder.buildDelete(tableName, key, options);

    return {
      Delete: command as DocumentClient.Delete,
    };
  },
};

export default transactItem;
