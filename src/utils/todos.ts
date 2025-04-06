import { STORAGE_KEY } from "../config";
import { AppState } from "../types/State";
import { Todo, TodoStatus } from "../types/Todo";
import { openModal, renderTextAfterAction } from "./ui";

// Get all todo list from localStorage
export function getTodos(app: AppState) {
  try {
    const savedTodos = localStorage.getItem(STORAGE_KEY);
    if (savedTodos) app.todos = JSON.parse(savedTodos);
  } catch (error) {
    console.error("Cannot read data from localStorage", error);
  }
}

// Save todos to localStorage
export function saveTodo(app: AppState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(app.todos));
}

// Add new todo to app.todos
export function addTodo(app: AppState) {
  const todoNameInput = document.querySelector<HTMLInputElement>("#todo-name");
  if (!todoNameInput?.value.trim()) return;

  const newTodo: Todo = {
    id: crypto.randomUUID().toLowerCase(),
    name: todoNameInput.value.trim(),
    status: app.clickedStatus,
  };

  app.todos[app.clickedStatus].push(newTodo);

  renderTextAfterAction();

  saveTodo(app);
  renderTodo(app, newTodo); // Create new HTML todo element in the list

  console.log(`New todo: ${newTodo}`);
}

// Delete todo from localStorage & its HTML Element
function deleteTodo(app: AppState, todo: Todo) {
  deleteTodoElement(todo);

  // Remove todo from the list
  app.todos[todo.status] = app.todos[todo.status].filter(
    (t) => t.id !== todo.id
  );

  saveTodo(app);
}

// Edit selected todo
export function editTodo(app: AppState, todo: Todo) {
  const todoNameInput: HTMLInputElement = document.querySelector(
    "#todo-name"
  ) as HTMLInputElement;
  if (!todoNameInput.value.trim()) return;
  const todoName = todoNameInput.value;

  // Update todo name
  app.todos[todo.status] = app.todos[todo.status].map((t) => {
    if (t.id === todo.id) t.name = todoName;
    return t;
  });

  // Update todo header with new name
  const todoEl = document.querySelector(`[data-id="${todo.id}"`);
  const todoNameEl = todoEl?.querySelector(".todo__header");
  if (todoNameEl) todoNameEl.textContent = todoName;

  renderTextAfterAction();
  saveTodo(app);
}

// Creates HTML Element for todo
export function renderTodo(app: AppState, todo: Todo) {
  const container = document.querySelector(
    `[data-status="${todo.status}"]`
  ) as HTMLDivElement;
  const todos__list = container?.querySelector(
    ".todos__list"
  ) as HTMLUListElement;

  // List element of todo
  const li: HTMLLIElement = document.createElement("li");
  li.classList.add("todo");
  li.setAttribute("data-id", todo.id);
  li.draggable = true;
  li.addEventListener("dragstart", (event) => {
    event.dataTransfer?.setData(
      "text/plain",
      JSON.stringify({
        id: todo.id,
        status: todo.status,
      })
    );
  });

  const h6: HTMLHeadingElement = document.createElement("h6");
  h6.classList.add("todo__header");
  h6.innerText = todo.name;

  const btnContainer = renderTodoButtons(app, todo);

  li.appendChild(h6);
  li.appendChild(btnContainer);
  todos__list.appendChild(li);
}

// Render buttons for todo
function renderTodoButtons(app: AppState, todo: Todo) {
  // Container for buttons
  const btnContainer: HTMLDivElement = document.createElement("div");
  btnContainer.classList.add("todo__btn__container");

  // Button for editing todo
  const editBtn: HTMLButtonElement = document.createElement("button");
  editBtn.classList.add("btn", "btn-edit", "btn-utils");
  editBtn.addEventListener("click", () => openModal(app, "edit", todo));
  editBtn.innerText = "✏️";

  // Button for deleting todo
  const deleteBtn: HTMLButtonElement = document.createElement("button");
  deleteBtn.classList.add("btn", "btn-danger", "btn-utils");
  deleteBtn.addEventListener("click", () => deleteTodo(app, todo));
  deleteBtn.innerText = "🗑️";

  // Append childs to li element
  btnContainer.appendChild(editBtn);
  btnContainer.appendChild(deleteBtn);

  return btnContainer;
}

// Render all todos
export function renderAllTodos(app: AppState) {
  const statusKeys = Object.keys(app.todos) as TodoStatus[];
  statusKeys.forEach((key: TodoStatus) => {
    app.todos[key].forEach((todo) => {
      deleteTodoElement(todo);
      renderTodo(app, todo);
    });
  });
}

// Delete todo HTML Element
function deleteTodoElement(todo: Todo) {
  // Remove todo's HTML Element
  const todoEl = document.querySelector(`[data-id="${todo.id}"]`);
  todoEl?.remove();
}
