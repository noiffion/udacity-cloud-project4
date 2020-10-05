import 'source-map-support/register';
import * as AWS from 'aws-sdk';
import * as AWSXRay from 'aws-xray-sdk';
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda';
import getUserId from '../auth/utils';
import { createLogger } from '../../utils/logger';

const XAWS = AWSXRay.captureAWS(AWS);
const docClient = new XAWS.DynamoDB.DocumentClient();
const todosTable = process.env.TODOS_TABLE;
const bucketName = process.env.IMAGES_S3_BUCKET;
const urlExpiration = parseInt(process.env.SIGNED_URL_EXPIRATION, 10);
const logger = createLogger('getTodo');

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId;
  const userId = getUserId(event);
  const s3 = new AWS.S3({ signatureVersion: 'v4' });

  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': true
  };

  try {
    const signedUrl = s3.getSignedUrl('putObject', {
      Bucket: bucketName,
      Key: todoId,
      Expires: urlExpiration
    });

    await docClient
      .update({
        TableName: todosTable,
        Key: { userId, todoId },
        ConditionExpression: 'attribute_exists(todoId)',
        UpdateExpression: 'set attachmentUrl = :attachmentUrl',
        ExpressionAttributeValues: {
          ':attachmentUrl': `https://${bucketName}.s3.amazonaws.com/${todoId}`
        }
      })
      .promise();

    logger.info('Successfully created signed url.');
    return {
      statusCode: 201,
      headers,
      body: JSON.stringify({ uploadUrl: signedUrl })
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
