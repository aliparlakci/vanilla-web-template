import { TodoEventBus, TODO_EVENTS } from '/pubsub/TodoEventBus.js';

// Ensure we're in module mode
const { expect, describe, beforeEach, test, jest } = await import('@jest/globals');

describe('TodoEventBus', () => {
  let eventBus;
  
  beforeEach(() => {
    eventBus = new TodoEventBus();
  });
  
  test('subscribe adds callback to events', () => {
    const callback = jest.fn();
    
    eventBus.subscribe(TODO_EVENTS.TODO_ADDED, callback);
    
    // Check internal state (this is implementation-dependent)
    expect(eventBus.events[TODO_EVENTS.TODO_ADDED]).toContain(callback);
  });
  
  test('publish calls all subscribed callbacks with data', () => {
    const callback1 = jest.fn();
    const callback2 = jest.fn();
    const eventData = { todo: { id: 1, text: 'Test' } };
    
    eventBus.subscribe(TODO_EVENTS.TODO_ADDED, callback1);
    eventBus.subscribe(TODO_EVENTS.TODO_ADDED, callback2);
    
    eventBus.publish(TODO_EVENTS.TODO_ADDED, eventData);
    
    expect(callback1).toHaveBeenCalledWith(eventData);
    expect(callback2).toHaveBeenCalledWith(eventData);
  });
  
  test('publish does nothing when no callbacks are registered', () => {
    // This should not throw an error
    eventBus.publish(TODO_EVENTS.TODO_ADDED, { data: 'test' });
  });
  
  test('unsubscribe removes callback', () => {
    const callback = jest.fn();
    
    // Subscribe and get unsubscribe function
    const unsubscribe = eventBus.subscribe(TODO_EVENTS.TODO_ADDED, callback);
    
    // Verify callback is registered
    eventBus.publish(TODO_EVENTS.TODO_ADDED, { data: 'test' });
    expect(callback).toHaveBeenCalledTimes(1);
    
    // Unsubscribe
    unsubscribe();
    
    // Reset mock to clear call count
    callback.mockReset();
    
    // Publish again
    eventBus.publish(TODO_EVENTS.TODO_ADDED, { data: 'test' });
    
    // Callback should not have been called
    expect(callback).not.toHaveBeenCalled();
  });
  
  test('multiple event types work independently', () => {
    const addedCallback = jest.fn();
    const updatedCallback = jest.fn();
    
    eventBus.subscribe(TODO_EVENTS.TODO_ADDED, addedCallback);
    eventBus.subscribe(TODO_EVENTS.TODO_UPDATED, updatedCallback);
    
    // Publish added event
    eventBus.publish(TODO_EVENTS.TODO_ADDED, { todo: { id: 1 } });
    
    expect(addedCallback).toHaveBeenCalledTimes(1);
    expect(updatedCallback).not.toHaveBeenCalled();
    
    // Publish updated event
    eventBus.publish(TODO_EVENTS.TODO_UPDATED, { todo: { id: 2 } });
    
    expect(addedCallback).toHaveBeenCalledTimes(1);
    expect(updatedCallback).toHaveBeenCalledTimes(1);
  });
});
