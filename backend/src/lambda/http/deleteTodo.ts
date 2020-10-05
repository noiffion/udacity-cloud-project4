import 'source-map-support/register';
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';
import { deleteTodo } from '../../businessLogic/todos';
import { createLogger } from '../../utils/logger';
import { getToken } from '../../utils/getJwt';

const logger = createLogger('deleteTodo');

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  logger.info('Processing DeleteTodo event...');
  const jwtToken: string = getToken(event);
  const todoId = event.pathParameters.todoId;
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': true
  };

  try {
    await deleteTodo(jwtToken, todoId);
    logger.info(`Successfully deleted todo item: ${todoId}`);
    return {
      statusCode: 204,
      headers,
      body: undefined
    };
  } catch (error) {
    logger.error(`Error: ${error.message}`);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error })
    };
  }
};
