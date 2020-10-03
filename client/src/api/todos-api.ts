import Axios from 'axios';
import { Method, AxiosResponse } from 'axios';
import { apiEndpoint } from '../config';
import {
  TodoItem,
  GetTodosResp,
  GetTodoResp,
  TodoCreate,
  TodoUpdate,
  CreateTodoResp,
  UploadUrl
} from '../types/Todo.d';

async function axRequest<ReqData, RespData>(
  idToken: string,
  path: string,
  method: Method,
  reqBody: ReqData
): Promise<AxiosResponse<RespData>> {
  const url = `${apiEndpoint}/${path}`;
  const data = reqBody ? JSON.stringify(reqBody) : reqBody;
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${idToken}`
  };
  return Axios({ method, url, headers, data });
}

export async function getTodos(idToken: string): Promise<TodoItem[]> {
  const response: AxiosResponse<GetTodosResp> = await axRequest<null, GetTodosResp>(
    idToken,
    'todos',
    'GET',
    null
  );
  return response.data.todoList;
}

export async function getTodo(idToken: string, todoId: string): Promise<TodoItem> {
  const response: AxiosResponse<GetTodoResp> = await axRequest<null, GetTodoResp>(
    idToken,
    `todos/${todoId}`,
    'GET',
    null
  );
  return response.data.todoItem[0];
}

export async function createTodo(idToken: string, newTodo: TodoCreate): Promise<TodoItem> {
  const response: AxiosResponse<CreateTodoResp> = await axRequest<TodoCreate, CreateTodoResp>(
    idToken,
    'todos',
    'POST',
    newTodo
  );
  return response.data.newTodo;
}

export async function updateTodo(
  idToken: string,
  todoId: string,
  updatedTodo: TodoUpdate
): Promise<undefined> {
  const response: AxiosResponse<undefined> = await axRequest<TodoUpdate, undefined>(
    idToken,
    `todos/${todoId}`,
    'PUT',
    updatedTodo
  );
  return response.data;
}

export async function deleteTodo(idToken: string, todoId: string): Promise<undefined> {
  const response: AxiosResponse<undefined> = await axRequest<null, undefined>(
    idToken,
    `todos/${todoId}`,
    'DELETE',
    null
  );
  return response.data;
}

export async function getUploadUrl(
  idToken: string,
  todoId: string
): Promise<string> {
  const response: AxiosResponse<UploadUrl> = await axRequest<null, UploadUrl>(
    idToken,
    `todos/${todoId}/attachment`,
    'POST',
    null
  );
  return response.data.uploadUrl;
}

export async function uploadFile(uploadUrl: string, file: Buffer): Promise<void> {
  await Axios.put(uploadUrl, file);
}
