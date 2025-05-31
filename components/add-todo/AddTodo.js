export class AddTodo {
    constructor(parentElement, callbacks) {
        this.parentElement = parentElement;
        this.callbacks = callbacks;
        this.elements = {};
        this.render();
    }

    render() {
        this.parentElement.innerHTML = `
            <form class="add-todo">
                <div class="add-todo__input-group">
                    <input 
                        type="text" 
                        class="add-todo__input" 
                        placeholder="What needs to be done?"
                        maxlength="100"
                    >
                    <button type="submit" class="add-todo__button">
                        Add Todo
                    </button>
                </div>
                <div class="add-todo__error error"></div>
            </form>
        `;
        
        this.elements.form = this.parentElement.querySelector('.add-todo');
        this.elements.input = this.parentElement.querySelector('.add-todo__input');
        this.elements.button = this.parentElement.querySelector('.add-todo__button');
        this.elements.error = this.parentElement.querySelector('.add-todo__error');
        
        this.elements.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.callbacks.onSubmit(this.elements.input.value);
        });
    }

    update(state) {
        this.elements.button.disabled = state.loading;
        this.elements.button.textContent = state.loading ? 'Adding...' : 'Add Todo';
        
        if (state.error) {
            this.elements.error.textContent = state.error;
            this.elements.error.style.display = 'block';
        } else {
            this.elements.error.style.display = 'none';
        }
    }

    clearInput() {
        this.elements.input.value = '';
        this.elements.input.focus();
    }
}
