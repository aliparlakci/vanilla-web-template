import { TodoApiClient } from '/api/TodoApiClient.js';
import { TodoEventBus } from '/pubsub/TodoEventBus.js';

// Ensure we're in module mode
const { expect, describe, beforeEach, afterEach, test, jest } = await import('@jest/globals');

// This test simulates the app initialization process from index.js
// but in a controlled test environment
describe('App Initialization Integration', () => {
  let apiClient;
  let eventBus;
  let headerContainer;
  let addTodoContainer;
  let todoListContainer;
  
  beforeEach(async () => {
    // Mock window.confirm to always return true
    window.confirm = jest.fn().mockReturnValue(true);
    // Set up DOM structure similar to index.html
    document.body.innerHTML = `
      <header id="header-root"></header>
      <main>
        <section id="add-todo-root"></section>
        <section id="todo-list-root"></section>
      </main>
    `;
    
    // Import components dynamically to avoid issues with Jest's module system
    const { HeaderContainer } = await import('/components/header/Header.container.js');
    const { AddTodoContainer } = await import('/components/add-todo/AddTodo.container.js');
    const { TodoListContainer } = await import('/components/todo-list/TodoList.container.js');
    
    // Create shared dependencies
    apiClient = new TodoApiClient();
    eventBus = new TodoEventBus();
    
    // Mock API delay
    apiClient._delay = jest.fn().mockResolvedValue();
    
    // Clear localStorage
    localStorage.clear();
    
    // Initialize components (similar to index.js)
    headerContainer = new HeaderContainer(eventBus);
    headerContainer.init(document.getElementById('header-root'));
    
    addTodoContainer = new AddTodoContainer(apiClient, eventBus);
    addTodoContainer.init(document.getElementById('add-todo-root'));
    
    todoListContainer = new TodoListContainer(apiClient, eventBus);
    todoListContainer.init(document.getElementById('todo-list-root'));
  });
  
  afterEach(() => {
    document.body.innerHTML = '';
  });
  
  test('components should initialize and render correctly', () => {
    // Verify header rendered
    expect(document.querySelector('header h1')).not.toBeNull();
    
    // Verify add todo form rendered
    expect(document.querySelector('#add-todo-root form')).not.toBeNull();
    expect(document.querySelector('#add-todo-root input')).not.toBeNull();
    expect(document.querySelector('#add-todo-root button')).not.toBeNull();
    
    // Verify todo list rendered
    expect(document.querySelector('#todo-list-root ul')).not.toBeNull();
  });
  
  test('full workflow: add, complete, and delete a todo', async () => {
    // 1. Add a new todo
    const input = document.querySelector('#add-todo-root input');
    const form = document.querySelector('#add-todo-root form');
    
    input.value = 'Full Workflow Test Todo';
    form.dispatchEvent(new Event('submit'));
    
    // Wait for async operations
    await new Promise(resolve => setTimeout(resolve, 10));
    
    // Verify todo was added
    let todoItems = document.querySelectorAll('#todo-list-root .todo-item');
    expect(todoItems.length).toBe(1);
    expect(todoItems[0].textContent).toContain('Full Workflow Test Todo');
    
    // 2. Complete the todo
    const checkbox = document.querySelector('#todo-list-root .todo-item input[type="checkbox"]');
    checkbox.checked = true;
    checkbox.dispatchEvent(new Event('change'));
    
    // Wait for async operations
    await new Promise(resolve => setTimeout(resolve, 10));
    
    // Verify todo was marked as completed
    const completedTodoItem = document.querySelector('#todo-list-root .todo-item');
    const todoText = completedTodoItem.querySelector('.todo-item__text');
    expect(todoText.classList.contains('todo-item__text--completed')).toBe(true);
    
    // 3. Delete the todo
    const deleteButton = document.querySelector('#todo-list-root .todo-item__delete');
    deleteButton.click();
    
    // Wait for async operations
    await new Promise(resolve => setTimeout(resolve, 10));
    
    // Verify todo was removed
    todoItems = document.querySelectorAll('#todo-list-root .todo-item');
    expect(todoItems.length).toBe(0);
  });
  
  test('event bus should facilitate communication between components', async () => {
    // Spy on event bus publish method
    const publishSpy = jest.spyOn(eventBus, 'publish');
    
    // Add a todo
    const input = document.querySelector('#add-todo-root input');
    const form = document.querySelector('#add-todo-root form');
    
    input.value = 'Event Bus Test Todo';
    form.dispatchEvent(new Event('submit'));
    
    // Wait for async operations
    await new Promise(resolve => setTimeout(resolve, 10));
    
    // Verify event was published
    expect(publishSpy).toHaveBeenCalled();
    
    // Verify the todo list received and processed the event
    const todoItems = document.querySelectorAll('#todo-list-root .todo-item');
    expect(todoItems.length).toBe(1);
    
    // Clean up spy
    publishSpy.mockRestore();
  });
  
  test('header should update todo count when todos change', async () => {
    // Add initial todos to localStorage
    const initialTodos = [
      { id: 1, text: 'First Todo', completed: false },
      { id: 2, text: 'Second Todo', completed: true }
    ];
    localStorage.setItem('todos', JSON.stringify(initialTodos));
    
    // Trigger a refresh (normally this would happen on load)
    await todoListContainer.loadTodos();
    
    // Wait for events to propagate
    await new Promise(resolve => setTimeout(resolve, 10));
    
    // Verify header shows correct count
    const totalCount = document.querySelector('#header-root .app-header__total');
    const completedCount = document.querySelector('#header-root .app-header__completed');
    expect(totalCount.textContent).toBe('2'); // 2 total todos
    expect(completedCount.textContent).toBe('1'); // 1 completed todo
    
    // Add another todo
    const input = document.querySelector('#add-todo-root input');
    const form = document.querySelector('#add-todo-root form');
    
    input.value = 'Another Todo';
    form.dispatchEvent(new Event('submit'));
    
    // Wait for async operations
    await new Promise(resolve => setTimeout(resolve, 10));
    
    // Verify header count updated
    expect(totalCount.textContent).toBe('3'); // Now 3 total todos
    expect(completedCount.textContent).toBe('1'); // Still 1 completed todo
  });
});
