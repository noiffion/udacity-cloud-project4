import 'source-map-support/register';
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';
import * as AWS from 'aws-sdk';
import getUserId from '../auth/utils';
import { TodoUpdate } from '../../models/Todo.d';

const docClient = new AWS.DynamoDB.DocumentClient();
const todosTable = process.env.TODOS_TABLE;

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const updateTodo: TodoUpdate = JSON.parse(event.body);
  const userId = getUserId(event);
  const todoId = event.pathParameters.todoId;

  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': true
  };

  try {
    await docClient
      .update({
        TableName: todosTable,
        Key: { userId, todoId },
        UpdateExpression: 'set #n = :n, dueDate = :due, done = :dn',
        ExpressionAttributeNames: { '#n': 'name' },
        ExpressionAttributeValues: {
          ':n': updateTodo.name,
          ':due': updateTodo.dueDate,
          ':dn': updateTodo.done
        }
      })
      .promise();

    return {
      statusCode: 204,
      headers,
      body: undefined
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error })
    };
  }
};
