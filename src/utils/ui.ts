import { ModalType } from "../types/Modal";
import { AppState } from "../types/State";
import { Todo } from "../types/Todo";
import { modal } from "./globals";
import { addTodo, editTodo } from "./todos";

// Open modal for add or edit todo
export function openModal(
  app: AppState,
  modalType: ModalType,
  todoToEdit?: Todo
) {
  switch (modalType) {
    case "add":
      renderModal(app, modalType);
      break;
    case "edit":
      renderModal(app, modalType, todoToEdit);
      break;
    default:
      break;
  }

  if (modal) modal.style.display = "flex";
}

// Close modal
export function closeModal() {
  if (modal) modal.style.display = "none";
}

// Render modal for adding new todo
export function renderModal(
  app: AppState,
  modalType: ModalType,
  todoToEdit?: Todo
) {
  const modalContainer: HTMLDivElement = document.querySelector(
    ".modal__container"
  ) as HTMLDivElement;
  modalContainer.innerHTML = "";

  const modalHeader = document.createElement("h2") as HTMLHeadingElement;
  if (modalHeader)
    modalHeader.textContent =
      modalType === "add" ? "Adding todo" : "Editing todo";

  // Form for adding todo
  const form: HTMLFormElement = document.createElement("form");
  form.id = "todo__form";
  form.classList.add("modal__form");
  // Prevent submit on form
  form.addEventListener("submit", (e) => {
    e.preventDefault();
  });

  // Div for all inputs
  const modalFormInputs: HTMLDivElement = document.createElement("div");
  modalFormInputs.classList.add("modal__form__inputs");

  // Container for todo name
  const todoNameInputContainer: HTMLDivElement = document.createElement("div");
  todoNameInputContainer.classList.add("modal__form__input");

  // Label for todo name input
  const todoNameLabel: HTMLLabelElement = document.createElement("label");
  todoNameLabel.htmlFor = "todo-name";
  todoNameLabel.innerText = "TODO Name";

  // Input for todo name
  const todoNameInput: HTMLInputElement = document.createElement("input");
  todoNameInput.type = "text";
  todoNameInput.id = "todo-name";
  todoNameInput.placeholder = "Enter todo name...";
  todoNameInput.required = true;
  todoNameInput.maxLength = 30;
  if (modalType === "edit" && todoToEdit) todoNameInput.value = todoToEdit.name;

  // Span with succesful message
  const spanSuccesful: HTMLSpanElement = document.createElement("span");
  spanSuccesful.classList.add("succesful");
  spanSuccesful.innerText =
    modalType === "add" ? "Added todo!" : "Updated todo!";

  // Modal buttons
  const { utilsBtn, closeModalBtn } = renderModalButtons(
    app,
    modalType,
    todoToEdit
  );

  // Append all the childs
  todoNameInputContainer.appendChild(todoNameLabel);
  todoNameInputContainer.appendChild(todoNameInput);
  modalFormInputs.appendChild(todoNameInputContainer);
  form.appendChild(modalFormInputs);
  modalContainer.appendChild(modalHeader);
  modalContainer.appendChild(form);
  modalContainer.appendChild(utilsBtn);
  modalContainer.appendChild(spanSuccesful);
  modalContainer.appendChild(closeModalBtn);
}

// Renders button to add or edit todo, depends on modal type
function renderModalButtons(
  app: AppState,
  modalType: ModalType,
  todoToEdit?: Todo
) {
  // Button for adding / editing todo
  const utilsBtn: HTMLButtonElement = document.createElement("button");
  utilsBtn.classList.add("btn");
  utilsBtn.innerText = modalType === "add" ? "Add todo" : "Save todo";
  utilsBtn.addEventListener("click", () => {
    switch (modalType) {
      case "add":
        addTodo(app);
        break;
      case "edit":
        if (todoToEdit) editTodo(app, todoToEdit);
        break;
      default:
        break;
    }
  });

  // Close modal button
  const closeModalBtn: HTMLButtonElement = document.createElement("button");
  closeModalBtn.classList.add("btn", "btn-xmark");

  const xmark = document.createElement("i");
  xmark.classList.add("fa-solid", "fa-xmark");

  closeModalBtn.addEventListener("click", closeModal);
  closeModalBtn.appendChild(xmark);

  return { utilsBtn, closeModalBtn };
}

// Renders span with animation & text after addding/editing todo
export function renderTextAfterAction() {
  const succesful = document.querySelector<HTMLSpanElement>(".succesful");
  succesful?.classList.add("succesful-animated"); // Display span with animation

  setTimeout(() => {
    closeModal();
    succesful?.classList.remove("succesful-animated");
  }, 2000);
}
