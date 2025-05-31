# Testing Approach

This project follows the testing principles outlined in the developer guide, with a focus on:

1. Testing containers with mock dependencies
2. Testing views with mock callbacks
3. Using simple object mocks rather than complex mocking libraries

## Test Structure

The tests are organized to mirror the project structure:

```
tests/
├── api/                 # API client tests
├── components/          # Component tests
│   └── add-todo/        # Tests for add-todo component
│       ├── AddTodo.container.test.js
│       └── AddTodo.test.js
└── pubsub/              # Event bus tests
```

## Running Tests

To run all tests:

```bash
npm test
```

To run tests for a specific component or module:

```bash
npm test -- tests/components/add-todo
```

## Testing Philosophy

Following the architecture principles from the developer guide:

1. **Container Tests**: Focus on testing state management, API interactions, and event publishing
   - Mock dependencies (API clients, event buses)
   - Verify correct state transitions
   - Ensure proper event publishing

2. **View Tests**: Focus on testing DOM rendering and user interactions
   - Verify correct DOM structure
   - Test event handlers and callbacks
   - Ensure UI updates correctly based on state changes

3. **API Client Tests**: Verify correct data manipulation and storage
   - Test localStorage interactions
   - Verify proper data transformations

4. **Event Bus Tests**: Ensure proper pub/sub functionality
   - Test subscription and publishing mechanisms
   - Verify event isolation

## Best Practices

- Each test file should import only what it needs to test
- Tests should be isolated and not depend on each other
- Use beforeEach to set up clean test environments
- Mock external dependencies and focus on unit behavior
