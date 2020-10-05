import 'source-map-support/register';
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda';
import { createTodo } from '../../businessLogic/todos';
import { createLogger } from '../../utils/logger';
import { getToken } from '../../utils/getJwt';
import { TodoCreate, TodoItem } from '../../models/Todo.d';

const logger = createLogger('createTodo');

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  logger.info('Processing CreateTodo event...');
  const jwtToken: string = getToken(event);
  const newTodoData: TodoCreate = JSON.parse(event.body);
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': true
  };

  try {
    const newTodo: TodoItem = await createTodo(jwtToken, newTodoData);
    logger.info('Successfully created a new todo item.');
    return {
      statusCode: 201,
      headers,
      body: JSON.stringify({ newTodo })
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
