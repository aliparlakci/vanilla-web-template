# Developer Guide

## Architecture Philosophy

### Core Principle: Simplicity First
This architecture prioritizes ease of development and maintenance over complex abstractions. Every decision follows the principle: "Can we make this simpler?"

### No Build Process
- Source code runs directly in browsers using native ES6 modules
- What you write is what executes - no transpilation, bundling, or compilation
- Requires serving from a web server (not file://) for absolute imports to work

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
- Dependency injection enables easy testing
- Containers testable with mock dependencies  
- Views testable with mock callbacks
- No mocking libraries needed - just objects

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