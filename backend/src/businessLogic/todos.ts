import * as uuid from 'uuid';
import { TodoAccess } from '../dataLayer/todoAccess';
import { getUserId } from '../utils/getJwt';
import { TodoItem, TodoCreate } from '../models/Todo.d';

const todoAccess = new TodoAccess()

export async function getTodos(jwtToken: string): Promise<TodoItem[]> {
  const userId: string = getUserId(jwtToken);
  return todoAccess.getTodos(userId);
}

export async function getTodo(jwtToken: string, todoId: string): Promise<TodoItem> {
  const userId: string = getUserId(jwtToken);
  return todoAccess.getTodo(userId, todoId);
}

export async function createTodo(jwtToken: string, newTodoData: TodoCreate): Promise<TodoItem> {
  const todoId = uuid.v4();
  const userId = getUserId(jwtToken);
  const newTodo: TodoItem = {
    todoId,
    createdAt: new Date().toISOString(),
    userId,
    done: false,
    ...newTodoData
  };
  return todoAccess.createTodo(newTodo);
}
