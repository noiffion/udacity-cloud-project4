import 'source-map-support/register';
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';
import * as AWS from 'aws-sdk';
import * as uuid from 'uuid';
import getUserId from '../auth/utils';
import { createLogger } from '../../utils/logger';
import { TodoCreate, TodoItem } from '../../models/Todo.d';

const logger = createLogger('createTodo');
const docClient = new AWS.DynamoDB.DocumentClient();
const todosTable = process.env.TODOS_TABLE;

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const todoId = uuid.v4();
  const newTodoData: TodoCreate = JSON.parse(event.body);
  const userId = getUserId(event);
  const newTodo: TodoItem = {
    todoId,
    createdAt: new Date().toISOString(),
    userId,
    done: false,
    ...newTodoData
  };

  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': true
  };

  try {
    await docClient
      .put({
        TableName: todosTable,
        Item: newTodo
      })
      .promise();
    logger.info('Successfully created a new todo item.')

    return {
      statusCode: 201,
      headers,
      body: JSON.stringify({ newTodo })
    };
  } catch (error) {
    logger.error('Error: ', error.message)
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error })
    };
  }
};
