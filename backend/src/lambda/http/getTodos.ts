import 'source-map-support/register';
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda';
import * as AWS from 'aws-sdk';
import * as AWSXRay from 'aws-xray-sdk';
import getUserId from '../auth/utils';
import { createLogger } from '../../utils/logger';

const XAWS = AWSXRay.captureAWS(AWS);
const docClient = new XAWS.DynamoDB.DocumentClient();
const todosTable = process.env.TODOS_TABLE;
const logger = createLogger('getTodos');

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const userId = getUserId(event);

  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': true
  };

  try {
    const result = await docClient
      .query({
        TableName: todosTable,
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: {
          ':userId': userId
        }
      })
      .promise();
    const todoList = result.Items;

    logger.info('Successfully retrieved todolist');
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ todoList })
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
