import { AddTodo } from '/components/add-todo/AddTodo.js';

// Ensure we're in module mode
const { expect, describe, beforeEach, afterEach, test, jest } = await import('@jest/globals');

describe('AddTodo View', () => {
  let parentElement;
  let callbacks;
  let addTodoView;

  beforeEach(() => {
    // Setup DOM element
    parentElement = document.createElement('div');
    document.body.appendChild(parentElement);
    
    // Mock callbacks
    callbacks = {
      onSubmit: jest.fn()
    };
    
    // Create component
    addTodoView = new AddTodo(parentElement, callbacks);
  });

  afterEach(() => {
    document.body.removeChild(parentElement);
  });

  test('renders correctly', () => {
    // Check if elements exist
    expect(parentElement.querySelector('.add-todo')).not.toBeNull();
    expect(parentElement.querySelector('.add-todo__input')).not.toBeNull();
    expect(parentElement.querySelector('.add-todo__button')).not.toBeNull();
    expect(parentElement.querySelector('.add-todo__error')).not.toBeNull();
  });

  test('calls onSubmit callback with input value when form is submitted', () => {
    // Set input value
    const input = parentElement.querySelector('.add-todo__input');
    input.value = 'Test todo';
    
    // Submit form
    const form = parentElement.querySelector('.add-todo');
    form.dispatchEvent(new Event('submit'));
    
    // Check if callback was called with correct value
    expect(callbacks.onSubmit).toHaveBeenCalledWith('Test todo');
  });

  test('updates UI based on state', () => {
    // Test loading state
    addTodoView.update({ loading: true });
    const button = parentElement.querySelector('.add-todo__button');
    expect(button.disabled).toBe(true);
    expect(button.textContent).toBe('Adding...');
    
    // Test error state
    addTodoView.update({ loading: false, error: 'Test error' });
    const error = parentElement.querySelector('.add-todo__error');
    expect(button.disabled).toBe(false);
    expect(button.textContent).toBe('Add Todo');
    expect(error.textContent).toBe('Test error');
    expect(error.style.display).toBe('block');
    
    // Test normal state
    addTodoView.update({ loading: false, error: null });
    expect(error.style.display).toBe('none');
  });

  test('clearInput clears the input field and sets focus', () => {
    // Set input value
    const input = parentElement.querySelector('.add-todo__input');
    input.value = 'Test todo';
    
    // Mock focus method
    input.focus = jest.fn();
    
    // Call clearInput
    addTodoView.clearInput();
    
    // Check if input was cleared and focus was set
    expect(input.value).toBe('');
    expect(input.focus).toHaveBeenCalled();
  });
});
