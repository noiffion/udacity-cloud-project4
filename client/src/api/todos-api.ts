import Axios from 'axios';
import { Method, AxiosResponse } from 'axios';
import { apiEndpoint } from '../config';
import { TodoItem, GetTodosResp, TodoCreate, CreateTodoResp, UpdateTodoResp, TodoDelete, DeleteTodoResp } from '../types/TodoItem.d';

async function axRequest<ReqData, RespData>(idToken: string, path: string, method: Method, reqBody: ReqData): Promise<AxiosResponse<RespData>> {
  const url = `${apiEndpoint}/${path}`;
  const data = reqBody ? JSON.stringify(reqBody) : reqBody;
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${idToken}`
  }
  return Axios({ method, url, headers, data });
}

export async function getTodos(idToken: string): Promise<TodoItem[]> {
  const response: AxiosResponse<GetTodosResp> = await axRequest<null, GetTodosResp>(idToken, 'todos', 'GET', null);
  return response.data.todoList;
}

export async function createTodo(idToken: string, newTodo: TodoCreate): Promise<TodoItem> {
  const response: AxiosResponse<CreateTodoResp> = await axRequest<TodoCreate, CreateTodoResp>(idToken, 'todos', 'POST', newTodo);
  return response.data.newTodo;
}

export async function updateTodo(idToken: string, updatedTodo: TodoItem): Promise<TodoItem> {
  const response: AxiosResponse<UpdateTodoResp> = await axRequest<TodoItem, UpdateTodoResp>(idToken, 'todos', 'PUT', updatedTodo);
  return response.data.updatedTodo;
}

export async function deleteTodo(idToken: string, todoId: string, createdAt: string): Promise<string> {
  const response: AxiosResponse<DeleteTodoResp> = await axRequest<TodoDelete, DeleteTodoResp>(idToken, 'todos', 'DELETE', { todoId, createdAt });
  return response.data.deletedTodoId;
}

export async function getUploadUrl(idToken: string, todoId: string): Promise<string> {
  const response = await Axios.post(`${apiEndpoint}/todos/${todoId}/attachment`, '', {
    headers: {

    }
  });
  return response.data.uploadUrl;
}

export async function uploadFile(uploadUrl: string, file: Buffer): Promise<void> {
  await Axios.put(uploadUrl, file);
}


/*
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

    }
  });
  return response.data.uploadUrl;
}

export async function uploadFile(uploadUrl: string, file: Buffer): Promise<void> {
  await Axios.put(uploadUrl, file);
}

*/
