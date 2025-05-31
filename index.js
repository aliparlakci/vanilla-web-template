import { HeaderContainer } from '/components/header/Header.container.js';
import { AddTodoContainer } from '/components/add-todo/AddTodo.container.js';
import { TodoListContainer } from '/components/todo-list/TodoList.container.js';
import { TodoApiClient } from '/api/TodoApiClient.js';
import { TodoEventBus } from '/pubsub/TodoEventBus.js';

// Initialize shared dependencies
const apiClient = new TodoApiClient();
const eventBus = new TodoEventBus();

// Initialize top-level containers
const headerContainer = new HeaderContainer(eventBus);
headerContainer.init(document.getElementById('header-root'));

const addTodoContainer = new AddTodoContainer(apiClient, eventBus);
addTodoContainer.init(document.getElementById('add-todo-root'));

const todoListContainer = new TodoListContainer(apiClient, eventBus);
todoListContainer.init(document.getElementById('todo-list-root'));
