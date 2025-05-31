export class TodoEventBus {
    constructor() {
        this.events = {};
    }

    subscribe(event, callback) {
        if (!this.events[event]) {
            this.events[event] = [];
        }
        this.events[event].push(callback);
        
        // Return unsubscribe function
        return () => {
            this.events[event] = this.events[event].filter(cb => cb !== callback);
        };
    }

    publish(event, data) {
        if (!this.events[event]) return;
        this.events[event].forEach(callback => callback(data));
    }
}

// Event constants
export const TODO_EVENTS = {
    TODO_ADDED: 'todo:added',
    TODO_UPDATED: 'todo:updated',
    TODO_DELETED: 'todo:deleted',
    TODOS_LOADED: 'todos:loaded'
};
