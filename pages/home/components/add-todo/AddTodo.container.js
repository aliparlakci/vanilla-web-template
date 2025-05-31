import { AddTodo } from './AddTodo.js';
import { TODO_EVENTS } from '../../../../lib/pubsub/TodoEventBus.js';

export class AddTodoContainer {
    constructor(apiClient, eventBus) {
        this.apiClient = apiClient;
        this.eventBus = eventBus;
        this.view = null;
        this.state = {
            loading: false,
            error: null
        };
    }

    init(parentElement) {
        this.view = new AddTodo(parentElement, {
            onSubmit: this.handleSubmit.bind(this)
        });
        this.view.update(this.state);
    }

    async handleSubmit(todoText) {
        if (!todoText.trim()) {
            this.setState({ error: 'Please enter a todo' });
            return;
        }

        this.setState({ loading: true, error: null });

        try {
            const newTodo = await this.apiClient.createTodo({ text: todoText });
            
            // Publish event
            this.eventBus.publish(TODO_EVENTS.TODO_ADDED, { todo: newTodo });
            
            // Clear form
            this.view.clearInput();
            this.setState({ loading: false });
        } catch (error) {
            this.setState({ 
                loading: false, 
                error: 'Failed to add todo. Please try again.' 
            });
        }
    }

    setState(newState) {
        this.state = { ...this.state, ...newState };
        this.view.update(this.state);
    }
}
