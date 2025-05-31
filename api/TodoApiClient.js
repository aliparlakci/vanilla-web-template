export class TodoApiClient {
    constructor() {
        // Simulate API with localStorage for demo
        this.storageKey = 'todos';
    }

    async getTodos() {
        // Simulate network delay
        await this._delay(300);
        
        const todosJson = localStorage.getItem(this.storageKey);
        return todosJson ? JSON.parse(todosJson) : [];
    }

    async createTodo(todo) {
        await this._delay(200);
        
        const todos = await this.getTodos();
        const newTodo = {
            id: Date.now(),
            text: todo.text,
            completed: false,
            createdAt: new Date().toISOString()
        };
        
        todos.push(newTodo);
        localStorage.setItem(this.storageKey, JSON.stringify(todos));
        
        return newTodo;
    }

    async updateTodo(id, updates) {
        await this._delay(200);
        
        const todos = await this.getTodos();
        const index = todos.findIndex(todo => todo.id === id);
        
        if (index === -1) {
            throw new Error('Todo not found');
        }
        
        todos[index] = { ...todos[index], ...updates };
        localStorage.setItem(this.storageKey, JSON.stringify(todos));
        
        return todos[index];
    }

    async deleteTodo(id) {
        await this._delay(200);
        
        const todos = await this.getTodos();
        const filtered = todos.filter(todo => todo.id !== id);
        
        localStorage.setItem(this.storageKey, JSON.stringify(filtered));
        
        return { success: true };
    }

    _delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}
