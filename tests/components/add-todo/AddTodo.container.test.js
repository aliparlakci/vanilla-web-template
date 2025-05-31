import { AddTodoContainer } from '/components/add-todo/AddTodo.container.js';
import { TODO_EVENTS } from '/pubsub/TodoEventBus.js';

// Ensure we're in module mode
const { expect, describe, beforeEach, test, jest } = await import('@jest/globals');

describe('AddTodoContainer', () => {
  let container;
  let mockApiClient;
  let mockEventBus;
  let mockView;
  let mockParentElement;

  beforeEach(() => {
    // Create mock dependencies
    mockApiClient = {
      createTodo: jest.fn()
    };
    
    mockEventBus = {
      publish: jest.fn()
    };
    
    // Mock view implementation that will be set by the container
    mockView = {
      update: jest.fn(),
      clearInput: jest.fn()
    };
    
    mockParentElement = document.createElement('div');
    
    // Create container with mock dependencies
    container = new AddTodoContainer(mockApiClient, mockEventBus);
    
    // Override the view creation in init method
    container.init = (parentElement) => {
      container.view = mockView;
      container.view.update(container.state);
    };
    
    // Initialize container
    container.init(mockParentElement);
  });

  test('initializes with correct state', () => {
    expect(container.state).toEqual({
      loading: false,
      error: null
    });
    expect(mockView.update).toHaveBeenCalledWith(container.state);
  });

  test('handleSubmit with empty text shows error', async () => {
    await container.handleSubmit('   ');
    
    expect(container.state.error).toBe('Please enter a todo');
    expect(mockView.update).toHaveBeenCalledWith(expect.objectContaining({
      error: 'Please enter a todo'
    }));
    expect(mockApiClient.createTodo).not.toHaveBeenCalled();
  });

  test('handleSubmit with valid text creates todo and publishes event', async () => {
    const todoText = 'Test todo';
    const newTodo = { id: 123, text: todoText, completed: false };
    
    mockApiClient.createTodo.mockResolvedValue(newTodo);
    
    await container.handleSubmit(todoText);
    
    // Check loading state was set during API call
    expect(mockView.update).toHaveBeenCalledWith(expect.objectContaining({
      loading: true,
      error: null
    }));
    
    // Check API was called with correct data
    expect(mockApiClient.createTodo).toHaveBeenCalledWith({ text: todoText });
    
    // Check event was published
    expect(mockEventBus.publish).toHaveBeenCalledWith(
      TODO_EVENTS.TODO_ADDED,
      { todo: newTodo }
    );
    
    // Check input was cleared
    expect(mockView.clearInput).toHaveBeenCalled();
    
    // Check final state
    expect(container.state).toEqual({
      loading: false,
      error: null
    });
  });

  test('handleSubmit handles API errors', async () => {
    mockApiClient.createTodo.mockRejectedValue(new Error('API error'));
    
    await container.handleSubmit('Test todo');
    
    // Check error state
    expect(container.state).toEqual({
      loading: false,
      error: 'Failed to add todo. Please try again.'
    });
    
    expect(mockView.update).toHaveBeenCalledWith(expect.objectContaining({
      loading: false,
      error: 'Failed to add todo. Please try again.'
    }));
    
    // Check event was not published
    expect(mockEventBus.publish).not.toHaveBeenCalled();
  });

  test('setState updates state and view', () => {
    const newState = { loading: true, error: 'Test error' };
    
    container.setState(newState);
    
    expect(container.state).toEqual(newState);
    expect(mockView.update).toHaveBeenCalledWith(newState);
  });
});
