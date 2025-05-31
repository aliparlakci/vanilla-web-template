import { formatDate } from '/utils/dateFormatter.js';

export class TodoItem {
    constructor(parentElement, callbacks) {
        this.parentElement = parentElement;
        this.callbacks = callbacks;
        this.elements = {};
        this.render();
    }

    render() {
        this.parentElement.innerHTML = `
            <div class="todo-item">
                <label class="todo-item__content">
                    <input type="checkbox" class="todo-item__checkbox">
                    <span class="todo-item__text"></span>
                    <span class="todo-item__date"></span>
                </label>
                <button class="todo-item__delete" aria-label="Delete todo">
                    ×
                </button>
            </div>
        `;
        
        this.elements.container = this.parentElement.querySelector('.todo-item');
        this.elements.checkbox = this.parentElement.querySelector('.todo-item__checkbox');
        this.elements.text = this.parentElement.querySelector('.todo-item__text');
        this.elements.date = this.parentElement.querySelector('.todo-item__date');
        this.elements.deleteBtn = this.parentElement.querySelector('.todo-item__delete');
        
        // Attach event listeners
        this.elements.checkbox.addEventListener('change', this.callbacks.onToggle);
        this.elements.deleteBtn.addEventListener('click', this.callbacks.onDelete);
    }

    update(state) {
        const { todo, loading } = state;
        
        // Update checkbox
        this.elements.checkbox.checked = todo.completed;
        this.elements.checkbox.disabled = loading;
        
        // Update text
        this.elements.text.textContent = todo.text;
        this.elements.text.classList.toggle('todo-item__text--completed', todo.completed);
        
        // Update date
        this.elements.date.textContent = formatDate(todo.createdAt);
        
        // Update delete button
        this.elements.deleteBtn.disabled = loading;
        
        // Update container opacity when loading
        this.elements.container.style.opacity = loading ? '0.5' : '1';
    }
}
