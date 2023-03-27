const setList = (list) => {
    localStorage.setItem('todo-list', JSON.stringify(list));
}

const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');
const searchList = document.getElementById('search-list');
const resultCount = document.getElementById('result-count');
const searchForm = document.getElementById('search-form');
const search = document.getElementById('search-input');
const notification = document.getElementById('notification');
const dateInput = document.getElementById('date-input');
const editTodo = document.getElementById('edit-block');
let todos = [];
let selected_todo = null;
let selected_node = null;

search.addEventListener('focus', function () {
    search.select();
});

search.addEventListener('click', function () {
    search.select();
});

searchForm.addEventListener('submit', function(event) {
    event.preventDefault();
    const result = todos.filter((todo) => todo.text.includes(search.value));
    search.select();
    if (!result.length) {
        searchList.innerHTML = `
            <li class="no-data">
                <i>No results found!</i>
            </li>
        `;
        return
    }

    searchList.innerHTML = '';
    resultCount.innerHTML = `Showing: ${result.length} result${result.length > 1 ? 's' : ''}`;
    
});

todoForm.addEventListener('submit', function(event) {
    event.preventDefault();

    const todoText = todoInput.value.trim();

    const todo_item = {
        id: Date.now(),
        text: todoText,
        is_complete: false,
        is_deleted: false,
        due_date: null,
        desc: '',
    }

    if(todoText) {
        todos.push(todo_item);
        result.push(todo_item);
        outputList();
        todoInput.value='';
    }
});

//functions
function outputList() {
    todoList.innerHTML = '';

    if(!todos.length) {
        todoList.innerHTML = `
            <li class="no-todo">
                <i>There are no Todos found!</i>
            </li>
        `;
        return;
    }

    todos.forEach((todo) => {
        const todoItem = createTodoItem(todo);
        todoList.appendChild(todoItem);
    });
}

function createTodoItem(todo) {
    const newTodo = document.createElement('li');

    newTodo.innerHTML = `
        <div class="item-todo">
            <input type="checkbox" class="tick-checkbox" id="done-check" ${todo.is_complete?'checked':''}>
            <div class="text-todo">
                <p>${todo.text}</p>
            </div>
            <button id="delete-todo" class="btn btn-primary">
                <i class="fa-solid fa-trash"></i>
            </button>
        </div>
     `;

    
    const todoButton = newTodo.querySelector('.item-todo');
     if (todoButton) {
        selected_todo = todo;
        selected_node = newTodo;
        todoButton.addEventListener('click', () => {
            onSelect(todo);
        });
     }

    const deleteButton = newTodo.querySelector('#delete-todo');
    if (deleteButton) {
        deleteButton.addEventListener('click', function(event) {
            event.stopPropagation();
            todoList.removeChild(newTodo);
            const index = todos.indexOf(todo);
            todos.splice(index, 1);
            if (editTodo.innerHTML) {
                editTodo.innerHTML = '';
            }
        });
    }
    return newTodo;
}

const onSelect = (todo) => {
    const currentdate = new Date();
    const el = document.createElement('div');
    el.innerHTML = `
        <label>Title</label>
        <input type="text" id="input-update" class="input-field w100" value="${todo.text}">
        <label class="mt16">Description</label>
        <textarea rows="10" id="update-desc" class="input-text-area w100">${todo.desc}</textarea>
        <p class="date-desc">${'Date created: ' + currentdate.toLocaleString([], { hour12: true})}</p>
        <label class="mt16">Due Date</label>
        <input type="date" id="due-date" class="input-field w100" value="${todo.due_date}">
        <div class="pg16 justify-end d-flex">
            <button id="delete-edit" class="btn btn-secondary mr8">Delete</button>
            <button id="update-edit" class="btn btn-primary">Update</button>
        </div>
    `;
    
    // adding event listeners to delete button
    const deleteTodo = el.querySelector('#delete-edit');
    deleteTodo.addEventListener('click', () => {
        todoList.removeChild(selected_node);
        const index = todos.indexOf(todo);
        todos.splice(index, 1);
        if (editTodo.innerHTML) {
            editTodo.innerHTML = '';
        }
        outputList();
        editTodo.innerHTML = '';
    });

    const updateTodo = el.querySelector('#update-edit');
    const updateText = el.querySelector('#input-update');
    const updateDesc = el.querySelector('#update-desc');
    const updateDate = el.querySelector('#due-date');

    updateTodo.addEventListener('click', function() {
        todo.text = updateText.value;
        todo.desc = updateDesc.value;
        todo.due_date = updateDate.value;
        todos.findIndex((item) => {
            if (item.id === todo.id) {
                setList(todos);
                outputList();
            }
        });
        editTodo.innerHTML = '';
    });
    editTodo.appendChild(el);   
}

//<i class="fa-sharp fa-regular fa-circle-chevron-down"></i>
