import Axios from 'axios';
import { apiEndpoint } from '../config';
import { TodoItem, TodoCreate, TodoUpdate } from '../types/TodoItem.d';

export async function getTodos(idToken: string): Promise<TodoItem[]> {
  console.log('Fetching todos');

  const response = await Axios.get(`${apiEndpoint}/todos`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${idToken}`
    }
  });
  console.log('Todos:', response.data);
  return response.data.items;
}

export async function createTodo(idToken: string, newTodo: TodoCreate): Promise<TodoItem> {
  const response = await Axios.post(`${apiEndpoint}/todos`, JSON.stringify(newTodo), {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${idToken}`
    }
  });
  return response.data.item;
}

export async function patchTodo(
  idToken: string,
  todoId: string,
  updatedTodo: TodoUpdate
): Promise<void> {
  await Axios.patch(`${apiEndpoint}/todos/${todoId}`, JSON.stringify(updatedTodo), {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${idToken}`
    }
  });
}

export async function deleteTodo(idToken: string, todoId: string): Promise<void> {
  await Axios.delete(`${apiEndpoint}/todos/${todoId}`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${idToken}`
    }
  });
}

export async function getUploadUrl(idToken: string, todoId: string): Promise<string> {
  const response = await Axios.post(`${apiEndpoint}/todos/${todoId}/attachment`, '', {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${idToken}`
    }
  });
  return response.data.uploadUrl;
}

export async function uploadFile(uploadUrl: string, file: Buffer): Promise<void> {
  await Axios.put(uploadUrl, file);
}
