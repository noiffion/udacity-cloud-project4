import * as AWS  from 'aws-sdk';
import * as AWSXRay from 'aws-xray-sdk';
import { createLogger } from '../utils/logger';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { TodoItem } from '../models/Todo.d';

const XAWS = AWSXRay.captureAWS(AWS);
const logger = createLogger('todoAccess');

export class TodoAccess {

  constructor(
    private readonly docClient: DocumentClient = new XAWS.DynamoDB.DocumentClient(),
    private readonly todosTable = process.env.TODOS_TABLE)
    {
  }

  async getTodos(userId: string): Promise<TodoItem[]> {
    logger.info('Getting all todo items');
    const result = await this.docClient
      .query({
        TableName: this.todosTable,
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: {
          ':userId': userId
        }
      })
      .promise();
    return result.Items as TodoItem[];
  }

  async getTodo(userId: string, todoId: string): Promise<TodoItem> {
    logger.info('Getting one todo item: ', todoId);
    const result = await this.docClient
      .query({
        TableName: this.todosTable,
        KeyConditionExpression: 'userId = :userId and todoId = :todoId',
        ExpressionAttributeValues: {
          ':userId': userId,
          ':todoId': todoId
        }
      })
      .promise();
    const todoItem = result.Items[0];
    return todoItem as TodoItem;
  }

  async createTodo(newTodo: TodoItem): Promise<TodoItem> {
    logger.info('Creating a new todo item: ', newTodo.todoId);
    await this.docClient
      .put({
        TableName: this.todosTable,
        Item: newTodo
      })
      .promise();
    return newTodo;
  }
}