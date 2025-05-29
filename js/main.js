// ----------------------------
// State Management
// ----------------------------
function loadTodos() {
    const todos = JSON.parse(localStorage.getItem("todos"));
    // Return empty array if no todos exist
    return todos || [];
}

function saveTodos(todos) {
    localStorage.setItem("todos", JSON.stringify(todos));
}

// ----------------------------
// Event Handlers
// ----------------------------
function handleAddTodo(event) {
    event.preventDefault();
    const input = document.getElementById("todo-input");
    const text = input.value.trim();
    if (!text) return;

    const todos = loadTodos();
    todos.push({ id: crypto.randomUUID(), text, done: false });

    saveTodos(todos);
    input.value = "";
    renderTodos();
}

function handleEditTodo(id) {
    return (e) => {
        e.stopPropagation();
        editTodo(id);
    };
}

// ----------------------------
// Core UI Logic
// ----------------------------
function renderTodos() {
    const todos = loadTodos();
    const list = document.getElementById("todo-list");
    list.innerHTML = "";

    if (todos.length === 0) {
        const empty = document.createElement("li");
        empty.textContent = "No todos yet";
        list.appendChild(empty);
        return;
    }

    todos.forEach((todo) => {
        const li = createTodoItem(todo);
        list.appendChild(li);
    });
}

function createTodoItem(todo) {
    const li = document.createElement("li");
    li.dataset.id = todo.id;
    li.addEventListener("click", () => {
        toggleTodo(todo.id);
    });

    const textSpan = document.createElement("span");
    textSpan.textContent = todo.text;
    textSpan.className = todo.done ? "done" : "";

    const buttons = document.createElement("div");
    buttons.className = "buttons";

    const editButton = createEditButton(todo.id);
    const deleteButton = createDeleteButton(todo.id);

    buttons.appendChild(editButton);
    buttons.appendChild(deleteButton);

    li.appendChild(textSpan);
    li.appendChild(buttons);

    return li;
}

// ----------------------------
// Button Creators
// ----------------------------
function createDeleteButton(id) {
    const button = document.createElement("button");
    button.textContent = "Delete";
    button.className = "delete-button";
    button.ariaLabel = "Delete todo";

    button.addEventListener("click", (event) => {
        event.stopPropagation();
        deleteTodo(id);
    });

    return button;
}

function createEditButton(id) {
    const button = document.createElement("button");
    button.textContent = "Edit";
    button.className = "edit-button";
    button.ariaLabel = "Edit todo";

    button.addEventListener("click", handleEditTodo(id));

    return button;
}

function createSaveButton(input, todo, todos) {
    const button = document.createElement("button");
    button.textContent = "Save";
    button.className = "save-button";

    button.addEventListener("click", (event) => {
        event.stopPropagation();

        const newText = input.value.trim();

        todo.text = newText;
        saveTodos(todos);
        renderTodos();
    });

    return button;
}

// ----------------------------
// Actions
// ----------------------------
function toggleTodo(id) {
    const todos = loadTodos();
    const todo = todos.find((t) => t.id === id);
    if (!todo) return;

    todo.done = !todo.done;
    saveTodos(todos);
    renderTodos();
    console.log("triggered");
}

function deleteTodo(id) {
    const todos = loadTodos().filter((t) => t.id !== id);
    saveTodos(todos);
    renderTodos();
}

function editTodo(id) {
    const todos = loadTodos();
    const todo = todos.find((t) => t.id === id);
    if (!todo) return;

    const li = document.querySelector(`li[data-id="${id}"]`);
    if (!li) return;

    const input = document.createElement("input");
    input.type = "text";
    input.value = todo.text;
    input.className = "edit-input";
    input.addEventListener("click", (event) => event.stopPropagation());

    const saveButton = createSaveButton(input, todo, todos);

    li.replaceChildren(input, saveButton);

    input.focus();
}

// ----------------------------
// App Init
// ----------------------------
function insertMockData() {
    const todos = [
        { id: Date.now(), text: "👋 Welcome to Todo!", done: false },
        { id: Date.now() + 1, text: "✅ Try marking me as done", done: false },
        { id: Date.now() + 2, text: "✏️ Or edit this item", done: false },
    ];

    saveTodos(todos);
    localStorage.setItem("hasSeenMockData", "true"); // Mark as seen
}

function setupApp() {
    const form = document.getElementById("todo-form");
    form.addEventListener("submit", handleAddTodo);

    if (loadTodos().length === 0 && !localStorage.getItem("hasSeenMockData")) {
        insertMockData();
    }

    renderTodos();
}

setupApp();
