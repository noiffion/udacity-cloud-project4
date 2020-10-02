import 'source-map-support/register';
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';
import * as AWS from 'aws-sdk';
import getUserId from '../auth/utils';
import { TodoItem } from '../../models/Todo.d';

const docClient = new AWS.DynamoDB.DocumentClient();
const todosTable = process.env.TODOS_TABLE;

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const updatedTodo: TodoItem = JSON.parse(event.body);
  updatedTodo.userId = getUserId(event);

  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': true
  };

  try {
    await docClient
      .put({
        TableName: todosTable,
        Item: updatedTodo
      })
      .promise();

    return {
      statusCode: 201,
      headers,
      body: JSON.stringify({ updatedTodo })
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error })
    };
  }
};
