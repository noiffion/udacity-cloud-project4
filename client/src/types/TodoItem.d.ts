export interface TodoItem {
  todoId: string;
  createdAt: string;
  userId: string;
  name: string;
  dueDate: string;
  done: boolean;
  attachmentUrl?: string;
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
}

// Fields in a request to update a single TODO item.
export interface TodoUpdate {
  name: string;
  dueDate: string;
  done: boolean;
}
