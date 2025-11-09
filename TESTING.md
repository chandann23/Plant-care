# Testing Guide

This document provides information about testing the Plant Care Reminder App.

## Test Infrastructure

The project uses two testing frameworks:

- **Vitest**: For unit and integration tests
- **Playwright**: For end-to-end (E2E) tests

## Running Tests

### Unit Tests (Vitest)

```bash
# Run tests in watch mode
bun test

# Run tests once
bun test:run

# Run tests with UI
bun test:ui

# Run tests with coverage
bun test:coverage
```

### E2E Tests (Playwright)

```bash
# Run E2E tests
bun test:e2e

# Run E2E tests with UI
bun test:e2e:ui

# Run E2E tests in headed mode (see browser)
bun test:e2e:headed
```

## Test Structure

### Unit Tests

Unit tests are located next to the files they test in `__tests__` directories:

```
src/
  lib/
    __tests__/
      date-utils.test.ts
    validations/
      __tests__/
        auth.test.ts
```

### E2E Tests

E2E tests are located in the `e2e/` directory:

```
e2e/
  auth.spec.ts
  plants.spec.ts
  schedules.spec.ts
  tasks.spec.ts
```

## Writing Tests

### Unit Test Example

```typescript
import { describe, it, expect } from 'vitest';
import { myFunction } from '../my-module';

describe('myFunction', () => {
  it('should return expected result', () => {
    const result = myFunction('input');
    expect(result).toBe('expected');
  });
});
```

### E2E Test Example

```typescript
import { test, expect } from '@playwright/test';

test('should display page', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading')).toBeVisible();
});
```

## Test Coverage

Current test coverage:

- ✅ Authentication validation schemas
- ✅ Date utility functions
- ✅ Authentication flow (E2E)
- ✅ Plant CRUD operations (E2E)

### Coverage Goals

- Unit tests: 80% coverage
- Integration tests: Key API endpoints
- E2E tests: Critical user flows

## Test Database

For integration tests that require database access:

1. Create a separate test database
2. Set `DATABASE_URL` in `.env.test`
3. Run migrations: `bun prisma migrate deploy`

## Continuous Integration

Tests run automatically on:

- Pull requests
- Commits to main branch

CI configuration is in `.github/workflows/test.yml`

## Troubleshooting

### Tests Failing Locally

1. Ensure dependencies are installed: `bun install`
2. Generate Prisma client: `bun prisma:generate`
3. Clear test cache: `bun test --clearCache`

### E2E Tests Failing

1. Ensure dev server is running: `bun dev`
2. Install Playwright browsers: `bunx playwright install`
3. Check `playwright.config.ts` for correct base URL

### Coverage Not Generating

1. Install coverage provider: `bun add -d @vitest/coverage-v8`
2. Run with coverage flag: `bun test:coverage`

## Best Practices

1. **Write tests first**: Follow TDD when possible
2. **Test behavior, not implementation**: Focus on what the code does, not how
3. **Keep tests isolated**: Each test should be independent
4. **Use descriptive names**: Test names should explain what they test
5. **Mock external dependencies**: Don't rely on external services in tests
6. **Test edge cases**: Include boundary conditions and error cases

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [Playwright Documentation](https://playwright.dev/)
- [Testing Library](https://testing-library.com/)
