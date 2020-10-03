export interface TodoItem {
  userId: string;
  createdAt: string;
  todoId: string;
  name: string;
  dueDate: string;
  done: boolean;
  attachmentUrl: string;
}

export interface GetTodosResp {
  todoList: TodoItem[];
}

export interface GetTodoResp {
  todoItem: TodoItem[];
}

export interface CreateTodoResp {
  newTodo: TodoItem;
}

// Fields in a request to create a single TODO item.
export interface TodoCreate {
  name: string;
  dueDate: string;
  attachmentUrl: string;
}

// Fields in a request to update a single TODO item.
export interface TodoUpdate {
  name: string;
  dueDate: string;
  done: boolean;
}

export interface UploadUrl {
  uploadUrl: string;
}
