import { TodoItem } from './TodoItem.js';
import { TODO_EVENTS } from '../../../../../../lib/pubsub/TodoEventBus.js';

export class TodoItemContainer {
    constructor(todo, apiClient, eventBus) {
        this.apiClient = apiClient;
        this.eventBus = eventBus;
        this.view = null;
        this.state = {
            todo: todo,
            loading: false,
            error: null
        };
    }

    init(parentElement) {
        this.view = new TodoItem(parentElement, {
            onToggle: this.handleToggle.bind(this),
            onDelete: this.handleDelete.bind(this)
        });
        this.view.update(this.state);
    }

    async handleToggle() {
        this.setState({ loading: true, error: null });

        try {
            const updated = await this.apiClient.updateTodo(
                this.state.todo.id,
                { completed: !this.state.todo.completed }
            );
            
            this.setState({ 
                todo: updated, 
                loading: false 
            });
            
            // Publish update event
            this.eventBus.publish(TODO_EVENTS.TODO_UPDATED, { 
                todo: updated,
                todos: await this.apiClient.getTodos()
            });
        } catch (error) {
            this.setState({ 
                loading: false, 
                error: 'Failed to update todo' 
            });
        }
    }

    async handleDelete() {
        if (!confirm('Are you sure you want to delete this todo?')) {
            return;
        }

        this.setState({ loading: true });

        try {
            await this.apiClient.deleteTodo(this.state.todo.id);
            
            // Publish delete event
            this.eventBus.publish(TODO_EVENTS.TODO_DELETED, { 
                todoId: this.state.todo.id 
            });
        } catch (error) {
            this.setState({ 
                loading: false, 
                error: 'Failed to delete todo' 
            });
        }
    }

    setState(newState) {
        this.state = { ...this.state, ...newState };
        if (this.view) {
            this.view.update(this.state);
        }
    }
}
