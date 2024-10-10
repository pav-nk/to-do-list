// Event logic
const todoList = document.getElementById('todo-list');
let todos = [];
let users = [];

document.addEventListener('DOMContentLoaded', initApp)

// Basic logic
function getUserName(userId) {
    const user = users.find(user => user.id === userId);
    return user.name;
}

function renderTodo({id, userId, title, completed}) {
    const li = document.createElement('li');
    li.className = 'todo-list-item';
    li.dataset.id = id;
    li.innerHTML = `<span>${title} <i>by</i> <b>${getUserName(userId)}</b></span>`;

    const status = document.createElement('input');
    status.type = 'checkbox';
    status.checked = completed;

    const close = document.createElement('span');
    close.innerHTML = '&times;';
    close.className = 'close';

    li.prepend(status);
    li.appendChild(close);

    todoList.prepend(li);
}

function initApp() {
    Promise.all([getAllTodos(), getAllUsers()]).then((values) => {
        [todos, users] = values;

        // Отправить в разметку
        todos.forEach((todo) => {
            renderTodo(todo);
        });
    })
}

// Async logic

async function getAllTodos() {
    const response = await fetch('https://jsonplaceholder.typicode.com/todos');
    const data = await response.json();

    return data;
}

async function getAllUsers() {
    const response = await fetch('https://jsonplaceholder.typicode.com/users');
    const data = await response.json();

    return data;
}

initApp();