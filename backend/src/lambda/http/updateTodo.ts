import 'source-map-support/register';
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';
import { updateTodo } from '../../businessLogic/todos';
import { TodoUpdate } from '../../models/Todo.d';
import { createLogger } from '../../utils/logger';
import { getToken } from '../../utils/getJwt';

const logger = createLogger('updateTodo');

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  logger.info('Processing UpdateTodo event...');
  const jwtToken: string = getToken(event);
  const todoId = event.pathParameters.todoId;
  const updateData: TodoUpdate = JSON.parse(event.body);
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': true
  };

  try {
    await updateTodo(jwtToken, todoId, updateData);
    logger.info(`Successfully updated the todo item: ${todoId}`);
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
