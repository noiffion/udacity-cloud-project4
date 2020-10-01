import 'source-map-support/register';
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';
import * as AWS from 'aws-sdk';
import * as uuid from 'uuid';
import { TodoCreate, TodoItem } from '../../models/Todo.d';
import getUserId from '../auth/utils';

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

  await docClient
    .put({
      TableName: todosTable,
      Item: newTodo
    })
    .promise();

  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({ newTodo })
  };
};
