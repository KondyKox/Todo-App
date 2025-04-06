export type Todo = {
  id: string;
  name: string;
  status: TodoStatus;
};

export type TodoStatus = "todo" | "doing" | "done";
export type TodosList = { todo: Todo[]; doing: Todo[]; done: Todo[] };
