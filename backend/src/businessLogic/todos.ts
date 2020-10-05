import * as uuid from 'uuid';
import { TodoAccess } from '../dataLayer/todoAccess';
import { getUserId } from '../utils/getJwt';
import { TodoItem, TodoCreate, TodoUpdate } from '../models/Todo.d';

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
  const createdAt = new Date().toISOString();
  const done = false;
  const newTodo: TodoItem = { todoId, userId, createdAt, done, ...newTodoData };
  return todoAccess.createTodo(newTodo);
}

export async function updateTodo(jwtToken: string, todoId: string, updateData: TodoUpdate): Promise<void> {
  const userId = getUserId(jwtToken);
  return todoAccess.updateTodo(userId, todoId, updateData);
}

export async function deleteTodo(jwtToken: string, todoId: string): Promise<void> {
  const userId = getUserId(jwtToken);
  return todoAccess.deleteTodo(userId, todoId);
}
