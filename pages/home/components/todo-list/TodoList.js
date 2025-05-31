export class TodoList {
    constructor(parentElement) {
        this.parentElement = parentElement;
        this.elements = {};
        this.render();
    }

    render() {
        this.parentElement.innerHTML = `
            <div class="todo-list">
                <div class="todo-list__loading loading">Loading todos...</div>
                <div class="todo-list__error error"></div>
                <div class="todo-list__empty">No todos yet. Add one above!</div>
                <ul class="todo-list__items"></ul>
            </div>
        `;
        
        this.elements.loading = this.parentElement.querySelector('.todo-list__loading');
        this.elements.error = this.parentElement.querySelector('.todo-list__error');
        this.elements.empty = this.parentElement.querySelector('.todo-list__empty');
        this.elements.items = this.parentElement.querySelector('.todo-list__items');
    }

    update(state) {
        // Handle loading state
        this.elements.loading.style.display = state.loading ? 'block' : 'none';
        
        // Handle error state
        if (state.error) {
            this.elements.error.textContent = state.error;
            this.elements.error.style.display = 'block';
        } else {
            this.elements.error.style.display = 'none';
        }
        
        // Handle empty state
        const hasItems = state.todos.length > 0;
        this.elements.empty.style.display = !state.loading && !hasItems ? 'block' : 'none';
        this.elements.items.style.display = !state.loading && hasItems ? 'block' : 'none';
    }

    renderTodos(todoContainers) {
        this.elements.items.innerHTML = '';
        
        todoContainers.forEach((container, todoId) => {
            const li = document.createElement('li');
            li.className = 'todo-list__item';
            li.dataset.todoId = todoId;
            this.elements.items.appendChild(li);
            
            // Initialize the todo item container
            container.init(li);
        });
    }

    addTodo(todoId, container) {
        const li = document.createElement('li');
        li.className = 'todo-list__item';
        li.dataset.todoId = todoId;
        
        // Add at the beginning
        this.elements.items.insertBefore(li, this.elements.items.firstChild);
        
        // Initialize the container
        container.init(li);
        
        // Update empty state
        this.elements.empty.style.display = 'none';
        this.elements.items.style.display = 'block';
    }

    removeTodo(todoId) {
        const item = this.elements.items.querySelector(`[data-todo-id="${todoId}"]`);
        if (item) {
            item.remove();
        }
        
        // Check if list is now empty
        if (this.elements.items.children.length === 0) {
            this.elements.empty.style.display = 'block';
            this.elements.items.style.display = 'none';
        }
    }
}
