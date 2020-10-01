import 'source-map-support/register';
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';
import * as AWS from 'aws-sdk';
import * as uuid from 'uuid';
import { TodoCreate, TodoItem } from '../../models/TodoItem.d';

const docClient = new AWS.DynamoDB.DocumentClient();
const todosTable = process.env.TODOS_TABLE;

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const todoId = uuid.v4();
  const newTodoData: TodoCreate = JSON.parse(event.body);

  const authorization = event.headers.Authorization;
  const split = authorization.split(' ');
  const jwtToken = split[1];

  const newTodo: TodoItem = {
    todoId,
    createdAt: new Date().toISOString(),
    userId: uuid.v4(), // getUserId(jwtToken),
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
    headers: { 'Access-Control-Allow-Origin': '*' },
    body: JSON.stringify({ newTodo })
  };
};
