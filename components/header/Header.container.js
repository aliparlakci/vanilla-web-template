import { Header } from './Header.js';
import { TODO_EVENTS } from '/pubsub/TodoEventBus.js';

export class HeaderContainer {
    constructor(eventBus) {
        this.eventBus = eventBus;
        this.view = null;
        this.state = {
            totalTodos: 0,
            completedTodos: 0
        };
        
        // Subscribe to events
        this.eventBus.subscribe(TODO_EVENTS.TODOS_LOADED, this.handleTodosUpdate.bind(this));
        this.eventBus.subscribe(TODO_EVENTS.TODO_ADDED, this.handleTodosUpdate.bind(this));
        this.eventBus.subscribe(TODO_EVENTS.TODO_UPDATED, this.handleTodosUpdate.bind(this));
        this.eventBus.subscribe(TODO_EVENTS.TODO_DELETED, this.handleTodosUpdate.bind(this));
    }

    init(parentElement) {
        this.view = new Header(parentElement);
        this.view.update(this.state);
    }

    handleTodosUpdate(data) {
        if (data.todos) {
            const todos = data.todos;
            this.setState({
                totalTodos: todos.length,
                completedTodos: todos.filter(todo => todo.completed).length
            });
        }
    }

    setState(newState) {
        this.state = { ...this.state, ...newState };
        this.view.update(this.state);
    }
}
