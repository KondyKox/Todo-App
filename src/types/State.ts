import { TodosList, TodoStatus } from "./Todo";

export type AppState = {
  todos: TodosList;
  clickedStatus: TodoStatus;
};
