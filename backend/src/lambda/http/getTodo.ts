import 'source-map-support/register';
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda';
import * as AWS from 'aws-sdk';
import getUserId from '../auth/utils';

const docClient = new AWS.DynamoDB.DocumentClient();
const todosTable = process.env.TODOS_TABLE;

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const userId = getUserId(event);
  const todoId = event.pathParameters.todoId;

  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': true
  };

  try {
    const result = await docClient
      .query({
        TableName: todosTable,
        KeyConditionExpression: 'userId = :userId and todoId = :todoId',
        ExpressionAttributeValues: {
          ':userId': userId,
          ':todoId': todoId
        }
      })
      .promise();
    const todoItem = result.Items;

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ todoItem })
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error })
    };
  }
};
