import { TodoList } from './TodoList.js';
import { TodoItemContainer } from './components/todo-item/TodoItem.container.js';
import { TODO_EVENTS } from '../../../../lib/pubsub/TodoEventBus.js';

export class TodoListContainer {
    constructor(apiClient, eventBus) {
        this.apiClient = apiClient;
        this.eventBus = eventBus;
        this.view = null;
        this.todoContainers = new Map();
        this.state = {
            todos: [],
            loading: true,
            error: null
        };
        
        // Subscribe to events
        this.eventBus.subscribe(TODO_EVENTS.TODO_ADDED, this.handleTodoAdded.bind(this));
        this.eventBus.subscribe(TODO_EVENTS.TODO_DELETED, this.handleTodoDeleted.bind(this));
    }

    init(parentElement) {
        this.view = new TodoList(parentElement);
        this.loadTodos();
    }

    async loadTodos() {
        this.setState({ loading: true, error: null });

        try {
            const todos = await this.apiClient.getTodos();
            this.setState({ todos, loading: false });
            
            // Publish loaded event
            this.eventBus.publish(TODO_EVENTS.TODOS_LOADED, { todos });
            
            // Initialize todo item containers
            this.initializeTodoItems();
        } catch (error) {
            this.setState({ 
                loading: false, 
                error: 'Failed to load todos. Please refresh the page.' 
            });
        }
    }

    initializeTodoItems() {
        // Clear existing containers
        this.todoContainers.clear();
        
        // Create containers for each todo
        this.state.todos.forEach(todo => {
            const container = new TodoItemContainer(
                todo,
                this.apiClient,
                this.eventBus
            );
            this.todoContainers.set(todo.id, container);
        });
        
        // Tell view to render with containers
        this.view.renderTodos(this.todoContainers);
    }

    handleTodoAdded(data) {
        const newTodos = [data.todo, ...this.state.todos];
        this.setState({ todos: newTodos });
        
        // Create container for new todo
        const container = new TodoItemContainer(
            data.todo,
            this.apiClient,
            this.eventBus
        );
        this.todoContainers.set(data.todo.id, container);
        
        // Update view
        this.view.addTodo(data.todo.id, container);
        
        // Publish updated todos
        this.eventBus.publish(TODO_EVENTS.TODOS_LOADED, { todos: newTodos });
    }

    handleTodoDeleted(data) {
        const newTodos = this.state.todos.filter(todo => todo.id !== data.todoId);
        this.setState({ todos: newTodos });
        
        // Remove container
        this.todoContainers.delete(data.todoId);
        
        // Update view
        this.view.removeTodo(data.todoId);
        
        // Publish updated todos
        this.eventBus.publish(TODO_EVENTS.TODOS_LOADED, { todos: newTodos });
    }

    setState(newState) {
        this.state = { ...this.state, ...newState };
        this.view.update(this.state);
    }
}
