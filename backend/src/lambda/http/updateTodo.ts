import 'source-map-support/register';
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';
import * as AWS from 'aws-sdk';
import { TodoItem } from '../../models/TodoItem.d';

const docClient = new AWS.DynamoDB.DocumentClient();
const todosTable = process.env.TODOS_TABLE;

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const updatedTodo: TodoItem = JSON.parse(event.body);
  updatedTodo.todoId = event.pathParameters.todoId;

  const authorization = event.headers.Authorization;
  const split = authorization.split(' ');
  const jwtToken = split[1];
  console.log(jwtToken);

  await docClient
    .put({
      TableName: todosTable,
      Item: updatedTodo
    })
    .promise();

  return {
    statusCode: 200,
    headers: { 'Access-Control-Allow-Origin': '*' },
    body: JSON.stringify({ updatedTodo })
  };
};
