export interface TodoItem {
  userId: string;
  createdAt: string;
  todoId: string;
  name: string;
  dueDate: string;
  done: boolean;
  attachmentUrl: string;
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
