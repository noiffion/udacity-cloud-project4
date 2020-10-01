import 'source-map-support/register';
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda';
import * as AWS from 'aws-sdk';

const docClient = new AWS.DynamoDB.DocumentClient();
const todosTable = process.env.TODOS_TABLE;

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {

  const authorization = event.headers.Authorization;
  const split = authorization.split(' ');
  const jwtToken = split[1];
  console.log(jwtToken);

  const { todoId, createdAt } = JSON.parse(event.body);

  await docClient
    .delete({
      TableName: todosTable,
      Key: {
        todoId,
        createdAt
      }
    })
    .promise();

  const deletedTodoId = todoId;
  return {
    statusCode: 200,
    headers: { 'Access-Control-Allow-Origin': '*' },
    body: JSON.stringify({ deletedTodoId })
  };
};
