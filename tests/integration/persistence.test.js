import { TodoApiClient } from '/client/TodoApiClient.js';
import { TodoEventBus } from '/pubsub/TodoEventBus.js';

// Ensure we're in module mode
const { expect, describe, beforeEach, afterEach, test, jest } = await import('@jest/globals');

describe('Todo Persistence Integration', () => {
  let apiClient;
  let eventBus;
  let todoListContainer;
  let todoListRoot;
  
  beforeEach(async () => {
    // Set up DOM elements
    document.body.innerHTML = '<div id="todo-list-root"></div>';
    todoListRoot = document.getElementById('todo-list-root');
    
    // Import TodoListContainer dynamically
    const { TodoListContainer } = await import('/components/todo-list/TodoList.container.js');
    
    // Create dependencies
    apiClient = new TodoApiClient();
    eventBus = new TodoEventBus();
    
    // Mock the delay method
    apiClient._delay = jest.fn().mockResolvedValue();
    
    // Clear localStorage
    localStorage.clear();
    
    // Initialize TodoListContainer
    todoListContainer = new TodoListContainer(apiClient, eventBus);
    todoListContainer.init(todoListRoot);
  });
  
  afterEach(() => {
    document.body.innerHTML = '';
    localStorage.clear();
  });
  
  test('todos should persist across page reloads', async () => {
    // Add some todos to localStorage (simulating previous session)
    const initialTodos = [
      { id: 1, text: 'Persisted Todo 1', completed: false },
      { id: 2, text: 'Persisted Todo 2', completed: true }
    ];
    localStorage.setItem('todos', JSON.stringify(initialTodos));
    
    // Load todos (simulating page load)
    await todoListContainer.loadTodos();
    
    // Verify todos were loaded from localStorage
    const todoItems = todoListRoot.querySelectorAll('.todo-item');
    expect(todoItems.length).toBe(2);
    expect(todoItems[0].textContent).toContain('Persisted Todo 1');
    expect(todoItems[1].textContent).toContain('Persisted Todo 2');
    
    // Verify completed status was preserved
    const checkboxes = todoListRoot.querySelectorAll('.todo-item input[type="checkbox"]');
    expect(checkboxes[0].checked).toBe(false);
    expect(checkboxes[1].checked).toBe(true);
  });
  
  test('changes should persist to localStorage', async () => {
    // Add a todo through the API
    await apiClient.createTodo({ text: 'New Todo' });
    
    // Reload the list
    await todoListContainer.loadTodos();
    
    // Verify todo was added to the DOM
    const todoItems = todoListRoot.querySelectorAll('.todo-item');
    expect(todoItems.length).toBe(1);
    
    // Check localStorage to verify persistence
    const storedTodos = JSON.parse(localStorage.getItem('todos'));
    expect(storedTodos.length).toBe(1);
    expect(storedTodos[0].text).toBe('New Todo');
    
    // Mark todo as completed
    const checkbox = todoListRoot.querySelector('.todo-item input[type="checkbox"]');
    checkbox.checked = true;
    checkbox.dispatchEvent(new Event('change'));
    
    // Wait for async operations
    await new Promise(resolve => setTimeout(resolve, 10));
    
    // Verify change was persisted to localStorage
    const updatedTodos = JSON.parse(localStorage.getItem('todos'));
    expect(updatedTodos[0].completed).toBe(true);
  });
  
  test('simulating browser refresh should maintain state', async () => {
    // Add a todo
    await apiClient.createTodo({ text: 'Pre-refresh Todo' });
    
    // Load the initial list
    await todoListContainer.loadTodos();
    
    // Verify todo is in the list
    expect(todoListRoot.querySelectorAll('.todo-item').length).toBe(1);
    
    // Simulate browser refresh by re-initializing the component
    document.body.innerHTML = '<div id="todo-list-root"></div>';
    todoListRoot = document.getElementById('todo-list-root');
    
    // Re-import and re-initialize (simulating a page refresh)
    const { TodoListContainer } = await import('/components/todo-list/TodoList.container.js');
    todoListContainer = new TodoListContainer(apiClient, eventBus);
    todoListContainer.init(todoListRoot);
    
    // Load todos again (as would happen on page load)
    await todoListContainer.loadTodos();
    
    // Verify todo is still in the list after "refresh"
    const todoItems = todoListRoot.querySelectorAll('.todo-item');
    expect(todoItems.length).toBe(1);
    expect(todoItems[0].textContent).toContain('Pre-refresh Todo');
  });
  
  test('multiple clients should see the same data', async () => {
    // Simulate first client adding a todo
    await apiClient.createTodo({ text: 'Client 1 Todo' });
    
    // Create a second "client" (new instances but same localStorage)
    const secondApiClient = new TodoApiClient();
    secondApiClient._delay = jest.fn().mockResolvedValue();
    
    // Get todos with second client
    const todos = await secondApiClient.getTodos();
    
    // Verify second client sees the todo added by first client
    expect(todos.length).toBe(1);
    expect(todos[0].text).toBe('Client 1 Todo');
    
    // Second client adds a todo
    await secondApiClient.createTodo({ text: 'Client 2 Todo' });
    
    // First client should now see both todos
    const updatedTodos = await apiClient.getTodos();
    expect(updatedTodos.length).toBe(2);
    expect(updatedTodos.map(todo => todo.text)).toContain('Client 1 Todo');
    expect(updatedTodos.map(todo => todo.text)).toContain('Client 2 Todo');
  });
});
