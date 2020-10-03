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

export interface CreateTodoResp {
  newTodo: TodoItem;
}

export interface UpdateTodoResp {
  updatedTodo: TodoItem;
}

export interface DeleteTodoResp {
  deletedTodoId: string;
}

// Fields in a request to create a single TODO item.
export interface TodoCreate {
  name: string;
  dueDate: string;
  attachmentUrl: string;
}

// Fields in a request to delete a single TODO item.
export interface TodoDelete {
  todoId: string;
  createdAt: string;
}

export interface UploadUrl {
  uploadUrl: string;
}
