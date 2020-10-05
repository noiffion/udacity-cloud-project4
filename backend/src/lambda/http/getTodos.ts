import 'source-map-support/register';
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda';
import { getTodos } from '../../businessLogic/todos';
import { createLogger } from '../../utils/logger';
import { getToken } from '../../utils/getJwt';
import { TodoItem } from '../../models/Todo.d';

const logger = createLogger('getTodos');

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  logger.info('Processing GetTodos event...');
  const jwtToken: string = getToken(event);
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': true
  };

  try {
    const todoList: TodoItem[] = await getTodos(jwtToken);
    logger.info('Successfully retrieved todolist');
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ todoList })
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
