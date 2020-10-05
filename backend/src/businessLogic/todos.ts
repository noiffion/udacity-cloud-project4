import * as uuid from 'uuid';
import { TodoAccess } from '../dataLayer/todoAccess';
import { getUserId } from '../utils/getJwt';
import { TodoItem } from '../models/Todo.d';

const groupAccess = new TodoAccess()

export async function getTodos(jwtToken: string): Promise<TodoItem[]> {
  const userId: string = getUserId(jwtToken);
  return groupAccess.getTodos(userId);
}

export async function createGroup(
  createGroupRequest: CreateGroupRequest,
  jwtToken: string
): Promise<Group> {

  const itemId = uuid.v4()
  const userId = getUserId(jwtToken)

  return await groupAccess.createGroup({
    id: itemId,
    userId: userId,
    name: createGroupRequest.name,
    description: createGroupRequest.description,
    timestamp: new Date().toISOString()
  })
}
