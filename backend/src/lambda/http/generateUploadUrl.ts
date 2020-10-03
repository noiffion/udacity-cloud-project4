import 'source-map-support/register';
import * as AWS  from 'aws-sdk';
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda';
import getUserId from '../auth/utils';
import { TodoItem } from '../../models/Todo.d';

const docClient = new AWS.DynamoDB.DocumentClient();
const todosTable = process.env.TODOS_TABLE;
const bucketName = process.env.IMAGES_S3_BUCKET;
const urlExpiration = process.env.SIGNED_URL_EXPIRATION;

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId;
  const s3 = new AWS.S3({
    signatureVersion: 'v4'
  });

  const todo: TodoItem = JSON.parse(event.body);
  todo.userId = getUserId(event);
  todo.attachmentUrl = undefined;

  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': true
  };

  try {
    await docClient
      .put({
        TableName: todosTable,
        Item: todo
      })
      .promise();

    // TODO: Return a presigned URL to upload a file for a TODO item with the provided id
    return {
      statusCode: 201,
      headers,
      body: JSON.stringify({ todo })
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error })
    };
  }
};
