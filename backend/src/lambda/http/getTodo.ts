import 'source-map-support/register';
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda';
import { getTodo } from '../../businessLogic/todos';
import { createLogger } from '../../utils/logger';
import { getToken } from '../../utils/getJwt';
import { TodoItem } from '../../models/Todo.d';

const logger = createLogger('getTodo');

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  logger.info('Processing GetTodo event...');
  const jwtToken: string = getToken(event);
  const todoId = event.pathParameters.todoId;
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': true
  };

  try {
    const todoItem: TodoItem = await getTodo(jwtToken, todoId);
    logger.info(`Successfully retrieved todo item: ${todoId}`);
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ todoItem })
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
