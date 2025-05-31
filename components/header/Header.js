export class Header {
    constructor(parentElement) {
        this.parentElement = parentElement;
        this.elements = {};
        this.render();
    }

    render() {
        this.parentElement.innerHTML = `
            <header class="app-header">
                <h1 class="app-header__title">Todo App</h1>
                <div class="app-header__stats">
                    <span class="app-header__stat">
                        Total: <strong class="app-header__total">0</strong>
                    </span>
                    <span class="app-header__stat">
                        Completed: <strong class="app-header__completed">0</strong>
                    </span>
                </div>
            </header>
        `;
        
        this.elements.total = this.parentElement.querySelector('.app-header__total');
        this.elements.completed = this.parentElement.querySelector('.app-header__completed');
    }

    update(state) {
        this.elements.total.textContent = state.totalTodos;
        this.elements.completed.textContent = state.completedTodos;
    }
}
