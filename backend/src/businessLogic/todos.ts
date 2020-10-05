import * as uuid from 'uuid';
import { TodoAccess } from '../dataLayer/todoAccess';
import { getUserId } from '../utils/getJwt';
import { TodoItem } from '../models/Todo.d';

const todoAccess = new TodoAccess()

export async function getTodos(jwtToken: string): Promise<TodoItem[]> {
  const userId: string = getUserId(jwtToken);
  return todoAccess.getTodos(userId);
}

export async function getTodo(jwtToken: string, todoId: string): Promise<TodoItem> {
  const userId: string = getUserId(jwtToken);
  return todoAccess.getTodo(userId, todoId);
}

export async function createTodo(
  createGroupRequest: CreateGroupRequest,
  jwtToken: string
): Promise<TodoItem> {

  const todoId = uuid.v4()
  const userId = getUserId(jwtToken)

  return await groupAccess.createGroup({
    id: itemId,
    userId: userId,
    name: createGroupRequest.name,
    description: createGroupRequest.description,
    timestamp: new Date().toISOString()
  })
}
