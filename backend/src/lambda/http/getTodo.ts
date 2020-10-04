import 'source-map-support/register';
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda';
import * as AWS from 'aws-sdk';
import * as AWSXRay from 'aws-xray-sdk';
import getUserId from '../auth/utils';
import { createLogger } from '../../utils/logger';

const XAWS = AWSXRay.captureAWS(AWS);
const docClient = new XAWS.DynamoDB.DocumentClient();
const todosTable = process.env.TODOS_TABLE;
const logger = createLogger('getTodo');

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

    logger.info('Successfully retrieved todo item', todoId);
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ todoItem })
    };
  } catch (error) {
    logger.error('Error: ', error.message);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error })
    };
  }
};
