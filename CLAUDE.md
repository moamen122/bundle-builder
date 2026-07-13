# AI Instructions for Uapp Web

## Project Overview

This project follows a strict and consistent engineering architecture.

Goals:

- Maintainability
- Scalability
- Reusability
- Separation of Concerns
- High Testability
- Predictable Folder Structure
- Clean Code
- SOLID Principles

Every implementation must follow the existing architecture.

Never introduce a different pattern if an existing one already exists.

Always search the project before creating new files or components.

Consistency is more important than personal preference.

---

## Architecture

The project follows a Feature-First Architecture.

Inside each feature we follow a Component-Driven Architecture.

Example:

src/
common/
features/
auth/
dashboard/
patients/

Each feature is isolated.

Every component owns its implementation.

Presentation, business logic, utilities, constants and API access must always be separated.

Never mix multiple responsibilities inside one file.

Always follow the Single Responsibility Principle.

---

## Folder Structure

Every component must have its own folder.

Example:

Button/

    Button.tsx
    Button.service.ts
    Button.api.ts
    Button.types.ts
    Button.const.ts
    Button.utils.ts
    Button.stories.tsx
    index.ts

### Responsibilities

#### Button.tsx

- UI only
- JSX only
- No API calls
- No business logic
- No long functions

#### Button.service.ts

Contains:

- custom hook
- useState
- useEffect
- useMemo
- useCallback
- event handlers
- business logic

The hook should be named:

useButton

#### Button.api.ts

Contains only API functions.

No:

- try/catch
- toast
- notifications
- UI logic
- state management

Error handling belongs to the caller or shared API layer.

#### Button.types.ts

Contains:

- interfaces
- types

#### Button.const.ts

Contains:

- constants
- enums
- regex
- readonly arrays
- default values

#### Button.utils.ts

Contains only pure helper functions.

No React hooks.

Every feature-specific child component follows exactly the same structure.

---

## Storybook Rules

Every new component and every new page must ship with a `*.stories.tsx` file. This applies to every future implementation without exception, including small presentational components.

No implementation is complete until its stories file exists.

Story file conventions (match the existing codebase):

- `title` follows `UI/ComponentName` for shared `common/components`, `Pages/PageName` for feature pages, and `FeatureName/ComponentName` for feature-scoped components (e.g. `Configuration/ConfigCard`).
- Always include `tags: ['autodocs']`.
- Pages use `parameters: { layout: 'fullscreen' }`; small components rely on the default centered layout.
- If the component or page depends on `react-router` hooks (`useNavigate`, `useSearchParams`, `useParams`, `Link`), wrap it with `RouterDecorator` from `src/stories/decorators.tsx`, or a custom `MemoryRouter`/`Routes` decorator when specific initial paths or route params are required.
- If the component depends on a Zustand store (e.g. auth session), seed it via a decorator that calls the store's `setState`, following the pattern in `DashboardPage.stories.tsx`.
- Cover the meaningful states of the component (variants, locked/disabled, empty, with/without data) as separate named stories rather than a single default story.

---

## Testing Rules

Full reference: `docs/testing.md`. This section defines the mandatory testing conventions for the project.

### Testing Philosophy

- Every change should be evaluated to determine the appropriate testing layer(s): Unit, React Testing Library, Storybook, and/or Playwright.
- Do not create tests in multiple layers unless each layer validates different behavior.
- Coverage is a health metric, not the goal. Never write tests solely to increase coverage percentages. Every test should validate meaningful user-facing behavior or business logic.
- Test observable behavior, not implementation details.

---

### Unit Tests

- Every new `*.utils.ts` or `*.service.ts` containing non-trivial logic must have a colocated `*.test.ts(x)` covering its meaningful branches.
- Every custom hook with meaningful behavior should have a colocated unit test using `renderHook`.
- Every Zustand store should have unit tests verifying its public behavior.
- Do not write unit tests for trivial wrappers, barrel exports, constants, or thin HTTP wrappers without business logic.

---

### Component Tests (React Testing Library)

- Every component containing business logic, async behavior, store interaction, routing, or complex state should have a colocated RTL test.
- Purely presentational components with no `.service.ts` and no `.api.ts` should rely on Storybook stories and `play`-function interaction tests instead of separate RTL tests.
- Never duplicate the same assertion in both RTL tests and Storybook interaction tests.
- Test rendered output, accessibility, navigation, user interactions, localStorage, and observable state changes.
- Never assert internal implementation details such as state variables, private functions, or React hook internals.

---

### Storybook

- Every reusable component should have a `*.stories.tsx`.
- Use Storybook primarily for documentation, visual validation, and interaction testing.
- Storybook interaction tests complement RTL tests; they do not replace RTL for components containing meaningful business logic.
- Prefer Storybook interaction tests for reusable UI components with simple behavior.

---

### Playwright

- Add Playwright tests only for critical user journeys crossing multiple pages, routes, authentication boundaries, or browser persistence.
- Never add Playwright tests for behavior already sufficiently covered by Unit or RTL tests.
- Keep the smoke suite small, deterministic, and fast.
- Keep regression scenarios deterministic by mocking only the required network requests.

---

### Mocking

- Mock external boundaries only (network, browser APIs, time, third-party services).
- Use MSW (`src/test/msw/handlers/`) as the shared network mocking layer.
- Never mock `.api.ts` modules directly.
- Never mock Zustand stores. Seed real store state using `.setState(...)`.
- Prefer real application code whenever practical.

---

### Shared Testing Infrastructure

Always reuse existing shared infrastructure before creating new utilities:

- `renderWithProviders`
- `resetAllStores`
- MSW `server`
- MSW handlers
- `RouterDecorator`
- `createAuthStoreDecorator`

Do not introduce duplicate wrappers or custom test helpers unless there is a clear benefit.

---

### Bug Fixes

- Every bug fix must include a regression test that fails before the fix and passes after the fix.
- If writing a test reveals an unrelated production bug, do not fix it in the same PR.
- Document discovered issues in `docs/known-issues.md` and address them in a dedicated follow-up PR.

---

### Test Quality

- Evaluate every component individually before writing tests.
- Skip tests that provide no meaningful value.
- Do not write tests simply because similar files have tests.
- Prefer fewer high-quality tests over many low-value tests.
- Test names should describe observable behavior (for example: `should redirect unauthenticated users to the login page`).
- No skipped or pending tests may be merged.
- Never use arbitrary sleeps or fixed timeouts. Use RTL's async utilities and Playwright's built-in auto-waiting.

---

### Pull Requests

Before considering any feature complete, verify whether the following are required:

- Storybook story
- Unit tests
- RTL tests
- Playwright tests
- Regression tests

If any of them are intentionally omitted, explain the reasoning in the PR description.

## React Rules

Always use functional components.

Prefer composition over inheritance.

Keep components small.

Prefer custom hooks for reusable logic.

Never place business logic inside JSX.

Never call APIs directly inside components.

Extract complex logic into \*.service.ts.

Avoid unnecessary re-renders.

Use React.memo only when profiling proves it is needed.

Use useMemo only for expensive computations.

Use useCallback only when required.

Prefer controlled components.

Avoid deeply nested JSX.

Extract reusable UI into separate components.

---

## TypeScript Rules

Avoid any.

Always prefer explicit types.

Prefer interfaces for object contracts.

Prefer type for unions and utility types.

Use readonly whenever possible.

Never disable TypeScript errors.

Always narrow unknown values.

Never use non-null assertion (!) unless absolutely necessary.

Export shared types from dedicated \*.types.ts files.

---

## API Rules

Every endpoint must live inside \*.api.ts.

Never call fetch directly inside components.

Never call axios directly inside JSX.

API functions should only perform HTTP requests.

No:

- try/catch
- toast
- notifications
- UI state

Business logic belongs inside \*.service.ts.

The caller decides how to handle errors.

---

## Styling Rules

Tailwind CSS is the default styling solution.

Shadcn/ui is the default component library.

Use SCSS only when:

- Tailwind cannot solve the problem.
- Complex reusable styles are required.

Prefer Tailwind utilities.

Avoid inline styles.

Keep styles close to the component whenever possible.

---

## Performance Rules

Lazy load routes.

Virtualize large lists.

Avoid unnecessary state.

Prefer derived state.

Avoid duplicate API requests.

Memoize only when necessary.

Split large components.

Keep renders predictable.

---

## Coding Standards

Always follow the existing project structure.

Never create a new architecture pattern.

Search for existing implementations before creating new ones.

Reuse existing hooks.

Reuse existing utilities.

Reuse existing types.

Reuse existing components.

Avoid code duplication.

Prefer readability over clever code.

Keep functions small.

Keep files focused on a single responsibility.

Write self-explanatory code.

Avoid unnecessary comments.

If code requires many comments, refactor it.

Do not introduce new dependencies unless they provide clear value.

Do not change existing functionality unless explicitly requested.

---

## Before Writing Any Code

1. Inspect the existing project structure.
2. Search the project for an existing implementation before creating any new component, hook, utility, service, API module, type or constant.
3. Reuse or extend existing implementations whenever possible.
4. Never create duplicate implementations.
5. Never introduce a new architecture pattern.
6. Never change functionality unless explicitly requested.
7. Keep changes as small as possible.
8. Follow the existing naming conventions.
9. Respect Separation of Concerns.
10. Explain the implementation plan before making structural changes.
11. Generate production-ready code that passes ESLint, TypeScript and existing tests without requiring manual fixes.
12. Do not assume project conventions. Always inspect the existing codebase before making architectural or implementation decisions.
