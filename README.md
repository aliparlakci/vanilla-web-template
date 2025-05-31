# Developer Guide

## Architecture Philosophy

### Core Principle: Simplicity First
This architecture prioritizes ease of development and maintenance over complex abstractions. Every decision follows the principle: "Can we make this simpler?"

### No Build Process
- Source code runs directly in browsers using native ES6 modules
- What you write is what executes - no transpilation, bundling, or compilation
- Requires serving from a web server for absolute imports to work

## Key Design Decisions

### 1. File-System Based Routing
- URL structure mirrors directory structure
- `/foo/bar` maps to `/foo/bar/index.html`
- Each route has its own `index.html` and `index.js`
- No client-side router needed - the web server handles it
- Traditional, simple, predictable

### 2. Package by Feature, Not Layer
- **High cohesion**: Related code lives together
- All components live under `/components/` with their own folders
- Each component folder contains its container, view, and CSS files
- Sub-components can be nested within parent component folders

### 3. Container-View Pattern
- **Explicit separation**: State/logic (containers) vs presentation (views)
- Containers manage state, handle API calls, orchestrate business logic
- Views are pure presentation - they receive data and callbacks only
- This separation enables easy testing and clear responsibilities

### 4. Manual Over Magic
- Dependencies passed explicitly via constructor parameters
- No dependency injection frameworks or service locators
- Manual component initialization - you control what loads when
- Direct imports between components - no auto-discovery

### 4. Composition Without Atomic Labels
- Follow atomic design principles but don't expose the hierarchy
- No "atom-button" or "molecule-form" naming
- Components compose naturally without declaring their level
- Focus on building blocks, not categorization

### 5. State Management Strategy
- Containers own and manage their state
- Views are always stateless
- State changes flow: Container → setState() → View.update()
- Granular DOM updates - only change what needs changing
- No virtual DOM, no full re-renders

### 6. Event-Driven Communication
- Pub/sub for cross-component communication
- Multiple event buses for different domains (UserEventBus, AppEventBus, etc.)
- Direct callbacks for parent-child relationships
- No global event soup - organized channels

### 7. Import Strategy
- Absolute paths from web root for all imports (`/components/`, `/api/`, `/utils/`)
- Relative paths only for nested sub-components (`./components/`)
- Eliminates the `../../../` maze while maintaining clarity

### 8. CSS Organization
- Each component owns its CSS file (co-located)
- Scoped naming conventions prevent conflicts
- No CSS-in-JS, no CSS modules, no build-time processing
- Simple, predictable, debuggable styles

## Development Workflow

### Starting a New Feature
1. Create folder under `/components/`
2. Build container first (state logic)
3. Build view second (presentation)
4. Add styles with scoped naming
5. Wire up in relevant page's `index.js`

### Adding a New Route/Page
1. Create directory structure matching the URL path
2. Add `index.html` with necessary component imports
3. Add `index.js` to initialize containers
4. Components are reused from `/components/`

### Component Communication
- Parent initializes children
- Children communicate up via callbacks
- Siblings communicate via event bus
- Never reach across component boundaries directly

### Testing Approach

#### Unit Testing Philosophy
- **Isolation**: Test components in isolation from their dependencies
- **Dependency Injection**: Constructor-based DI enables easy mocking
- **Simplicity**: Use simple object mocks rather than complex mocking libraries
- **Focus on Behavior**: Test what components do, not how they're implemented
- **Separation of Concerns**: Container and view tests have different focuses

#### Unit Testing Components
- **Container Tests**:
  - Mock API clients, event buses, and other dependencies
  - Verify state transitions and management
  - Test error handling and edge cases
  - Ensure proper event publishing
  - Focus on business logic correctness

- **View Tests**:
  - Verify correct DOM structure and rendering
  - Test event handlers and callback invocations
  - Ensure UI updates correctly based on state changes
  - Mock parent callbacks
  - Focus on presentation correctness

- **Service Tests**:
  - Test API clients for correct data handling
  - Test event buses for proper pub/sub functionality
  - Verify utility functions work as expected
  - Mock external dependencies (e.g., localStorage)

#### Unit Testing Best Practices
- Create clean test environments with `beforeEach`
- Tests should be independent and not affect each other
- Use descriptive test names that explain the expected behavior
- Follow the AAA pattern: Arrange, Act, Assert
- Test both happy paths and error cases
- Keep tests focused and small
- Avoid testing implementation details

#### Integration Testing Philosophy
- **Black Box Approach**: Test components as they would be used in production, without knowledge of internal implementation
- **Real Component Interaction**: Test how multiple components work together in realistic scenarios
- **End-to-End Workflows**: Focus on complete user workflows rather than isolated functionality
- **Minimal Mocking**: Only mock external dependencies but use real internal dependencies
- **DOM Verification**: Verify the actual DOM reflects expected application state

#### Integration Testing Strategies
- **Component Integration**: Test how containers communicate via the event bus
- **Workflow Testing**: Simulate user actions (clicks, form submissions) and verify correct behavior
- **Persistence Testing**: Verify data is correctly saved and retrieved
- **Error Handling**: Test how errors propagate through the system
- **State Synchronization**: Verify all components reflect the same application state

## What This Architecture Is NOT

- Not a framework - it's a pattern
- Not optimized for tiny bundle sizes
- Not using latest build tools
- Not following "industry standards" blindly

## Why These Choices Matter

Every decision reduces cognitive load. When you work on a feature, everything you need is right there. When you need to understand data flow, it's explicit. When you need to debug, you're debugging your actual code, not compiled output.

This architecture respects both the developer's time and the simplicity of the web platform. It's proven that we can build maintainable applications without complex tooling.

## Remember

- Explicit is better than implicit
- Simple is better than clever  
- Boring is better than exciting
- Working is better than perfect

The goal is sustainable development - code that's as easy to understand in 6 months as it is today.