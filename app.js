// Event logic
const todoList = document.getElementById('todo-list');
const userSelect = document.getElementById('user-select');
const form = document.getElementById('todo-form');
let todos = [];
let users = [];

document.addEventListener('DOMContentLoaded', initApp)
form.addEventListener('submit', handleSubmit);

// Basic logic
function getUserName(userId) {
    const user = users.find(user => user.id === userId);
    return user.name;
}

function handleSubmit(evt) {
    evt.preventDefault();

    createTodo({
        userId: +form.user.value,
        title: form.todo.value,
        completed: false,
    });
}

function alertError(error) {
    alert(error.message);
}

function handleClose() {
    const todoId = this.parentElement.dataset.id;
    deleteTodo(todoId);
};

function removeTodo(todoId) {
    todos = todos.filter((todo) => todo.id !== todoId);
    const currentTodo = todoList.querySelector(`li[data-id="${todoId}"]`);
    currentTodo.querySelector('input').removeEventListener('change', handleChangeStatus);
    currentTodo.querySelector('.close').removeEventListener('click', handleClose);
    currentTodo.remove();
}

function handleChangeStatus() {
    const todoId = this.parentElement.dataset.id;
    const completed = this.checked;

    changeStatusTodo(todoId, completed);
}

function createUserOption(user) {
    const option = document.createElement('option');
    option.value = user.id;
    option.innerText = user.name;

    userSelect.appendChild(option);
}

function renderTodo({id, userId, title, completed}) {
    const li = document.createElement('li');
    li.className = 'todo-list-item';
    li.dataset.id = id;
    li.innerHTML = `<span>${title} <i>by</i> <b>${getUserName(userId)}</b></span>`;

    const status = document.createElement('input');
    status.type = 'checkbox';
    status.checked = completed;
    status.addEventListener('change', handleChangeStatus);

    const close = document.createElement('span');
    close.innerHTML = '&times;';
    close.className = 'close';
    close.addEventListener('click', handleClose);

    li.prepend(status);
    li.appendChild(close);

    todoList.prepend(li);
}

function initApp() {
    Promise.all([getAllTodos(), getAllUsers()]).then((values) => {
        [todos, users] = values;

        todos.forEach((todo) => {
            renderTodo(todo);
        });

        users.forEach((user) => createUserOption(user));
    })
}

// Async logic

async function getAllTodos() {
    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/todos?_limit=15');
        const data = await response.json();
    
        return data;   
    } catch (error) {
        alertError(error);
    }
}

async function getAllUsers() {
    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/users');
        const data = await response.json();
        return data;   
    } catch (error) {
        alertError(error);
    }
}

async function createTodo(todo) {
    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/todos', {
            method: 'POST',
            body: JSON.stringify(todo),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const todoEl = await response.json();
        renderTodo(todoEl);
    } catch (error) {
        alertError(error);
    }
}

async function changeStatusTodo(todoId, completed) {
    try {
        const response = await fetch(`https://jsonplaceholder.typicode.com/todos/${todoId}`, {
            method: 'PATCH',
            body: JSON.stringify({completed}),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) {
            throw newError('response status error!');
        }
    } catch (error) {
        alertError(error);
    }
}

async function deleteTodo(todoId) {
    const response = await fetch(`https://jsonplaceholder.typicode.com/todos/${todoId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    if (response.ok) {
        removeTodo(todoId);
    }

    if (!response.ok) {
        throw newError('response delete todo error!');
    }
}


initApp();
