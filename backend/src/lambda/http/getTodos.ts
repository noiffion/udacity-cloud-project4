import 'source-map-support/register';
import { APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda';
import * as AWS from 'aws-sdk';

const docClient = new AWS.DynamoDB.DocumentClient();
const todosTable = process.env.TODOS_TABLE;

export const handler: APIGatewayProxyHandler = async (): Promise<APIGatewayProxyResult> => {
  const result = await docClient
  .scan({
    TableName: todosTable,
  })
  .promise();
  const todoList = result.Items;

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    body: JSON.stringify({ todoList }),
  };
};
