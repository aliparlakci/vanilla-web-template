import { AddTodoContainer } from '/components/add-todo/AddTodo.container.js';
import { TodoListContainer } from '/components/todo-list/TodoList.container.js';
import { TodoApiClient } from '/api/TodoApiClient.js';
import { TodoEventBus } from '/pubsub/TodoEventBus.js';

// Ensure we're in module mode
const { expect, describe, beforeEach, afterEach, test, jest } = await import('@jest/globals');

describe('Todo Workflow Integration', () => {
  let addTodoContainer;
  let todoListContainer;
  let apiClient;
  let eventBus;
  let addTodoRoot;
  let todoListRoot;
  
  beforeEach(() => {
    // Mock window.confirm to always return true
    window.confirm = jest.fn().mockReturnValue(true);
    // Set up DOM elements
    document.body.innerHTML = `
      <div id="add-todo-root"></div>
      <div id="todo-list-root"></div>
    `;
    
    addTodoRoot = document.getElementById('add-todo-root');
    todoListRoot = document.getElementById('todo-list-root');
    
    // Create real instances of shared dependencies
    apiClient = new TodoApiClient();
    eventBus = new TodoEventBus();
    
    // Clear localStorage
    localStorage.clear();
    
    // Mock the delay method to speed up tests
    apiClient._delay = jest.fn().mockResolvedValue();
    
    // Initialize containers with real dependencies
    addTodoContainer = new AddTodoContainer(apiClient, eventBus);
    todoListContainer = new TodoListContainer(apiClient, eventBus);
    
    // Initialize components
    addTodoContainer.init(addTodoRoot);
    todoListContainer.init(todoListRoot);
  });
  
  afterEach(() => {
    // Clean up
    document.body.innerHTML = '';
  });
  
  test('adding a todo should update the todo list', async () => {
    // Verify todo list is initially empty
    expect(todoListRoot.querySelectorAll('.todo-item').length).toBe(0);
    
    // Get the form elements
    const form = addTodoRoot.querySelector('.add-todo');
    const input = addTodoRoot.querySelector('.add-todo__input');
    
    // Set input value and submit form
    input.value = 'Integration Test Todo';
    form.dispatchEvent(new Event('submit'));
    
    // Wait for async operations to complete
    // In a real test, you might use a more robust waiting mechanism
    await new Promise(resolve => setTimeout(resolve, 10));
    
    // Verify todo was added to the list
    const todoItems = todoListRoot.querySelectorAll('.todo-item');
    expect(todoItems.length).toBe(1);
    expect(todoItems[0].textContent).toContain('Integration Test Todo');
  });
  
  test('completing a todo should update its status', async () => {
    // Add a todo first
    await apiClient.createTodo({ text: 'Complete Me Todo' });
    
    // Trigger list refresh
    await todoListContainer.loadTodos();
    
    // Find the todo checkbox
    const todoItem = todoListRoot.querySelector('.todo-item');
    const checkbox = todoItem.querySelector('input[type="checkbox"]');
    expect(checkbox.checked).toBe(false);
    
    // Check the checkbox
    checkbox.checked = true;
    checkbox.dispatchEvent(new Event('change'));
    
    // Wait for async operations
    await new Promise(resolve => setTimeout(resolve, 10));
    
    // Verify todo was marked as completed
    const updatedCheckbox = todoListRoot.querySelector('.todo-item input[type="checkbox"]');
    expect(updatedCheckbox.checked).toBe(true);
    
    // Verify the todo item text has the completed class
    const todoText = todoListRoot.querySelector('.todo-item__text');
    expect(todoText.classList.contains('todo-item__text--completed')).toBe(true);
  });
  
  test('deleting a todo should remove it from the list', async () => {
    // Add a todo first
    await apiClient.createTodo({ text: 'Delete Me Todo' });
    
    // Trigger list refresh
    await todoListContainer.loadTodos();
    
    // Verify todo is in the list
    expect(todoListRoot.querySelectorAll('.todo-item').length).toBe(1);
    
    // Find and click the delete button
    const deleteButton = todoListRoot.querySelector('.todo-item__delete');
    deleteButton.click();
    
    // Wait for async operations
    await new Promise(resolve => setTimeout(resolve, 10));
    
    // Verify todo was removed from the list
    expect(todoListRoot.querySelectorAll('.todo-item').length).toBe(0);
  });
  
  test('error handling when API fails', async () => {
    // Mock API failure
    const originalCreateTodo = apiClient.createTodo;
    apiClient.createTodo = jest.fn().mockRejectedValue(new Error('API Error'));
    
    // Get the form elements
    const form = addTodoRoot.querySelector('.add-todo');
    const input = addTodoRoot.querySelector('.add-todo__input');
    
    // Set input value and submit form
    input.value = 'Error Test Todo';
    form.dispatchEvent(new Event('submit'));
    
    // Wait for async operations
    await new Promise(resolve => setTimeout(resolve, 10));
    
    // Verify error message is displayed
    const errorElement = addTodoRoot.querySelector('.add-todo__error');
    expect(errorElement.textContent).toBe('Failed to add todo. Please try again.');
    expect(errorElement.style.display).toBe('block');
    
    // Verify todo was not added to the list
    expect(todoListRoot.querySelectorAll('.todo-item').length).toBe(0);
    
    // Restore original method
    apiClient.createTodo = originalCreateTodo;
  });
});
