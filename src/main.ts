import "./styles/style.css";
import "./styles/utils.css";
import "./styles/todo.css";
import "./styles/modal.css";

import { AppState } from "./types/State";
import { closeModal, openModal } from "./utils/ui";
import { TodoStatus } from "./types/Todo";
import { addTodo, getTodos, renderAllTodos, saveTodo } from "./utils/todos";
import { addBtn, todosBtn, todosList, xmarkBtn } from "./utils/globals";

// App state with all todos & clicked category where new todo will be put
const app: AppState = {
  todos: { todo: [], doing: [], done: [] },
  clickedStatus: "todo",
};

// Add event listeners to todos list for drag & drop
todosList.forEach((todoList) => {
  todoList.addEventListener("dragover", (event) => {
    event.preventDefault();
  });

  todoList.addEventListener("drop", (event) => {
    event.preventDefault();

    // Read data from event
    const data = event.dataTransfer?.getData("text/plain");
    if (!data) return;
    const { id, status }: { id: string; status: TodoStatus } = JSON.parse(data);

    // Find todo that is being dragged
    const todoToMove = app.todos[status].find((todo) => todo.id === id);
    if (!todoToMove) return;

    // Find parent with data-status attribute
    const target = (event.target as HTMLElement).closest("[data-status]");
    if (!target) return;

    const newStatus = target.getAttribute("data-status") as TodoStatus;
    if (!newStatus || newStatus === status) return;

    app.todos[status].map((todo) => {
      if (todo.id === todoToMove.id) todo.status = newStatus;
      return todo;
    });
    app.todos[status] = app.todos[status].filter((todo) => todo.id !== id);
    app.todos[newStatus].push(todoToMove);

    renderAllTodos(app);
    saveTodo(app);
  });
});

// Open modal
todosBtn.forEach((btn) => {
  btn.addEventListener("click", (event) => {
    const target = event.target as HTMLElement;
    const category = target.dataset.category as TodoStatus;

    app.clickedStatus = category;

    openModal(app, "add");
  });
});

// Close modal
xmarkBtn?.addEventListener("click", () => {
  closeModal();
});

// Add new todo
addBtn?.addEventListener("click", () => addTodo(app));

getTodos(app); // Get all todos
renderAllTodos(app); // Render all todos at the start
