# Testing Guide

## Overview

This project uses multiple testing strategies:
- **Unit Tests**: Testing individual functions and utilities (Vitest)
- **Integration Tests**: Testing database operations and API logic (Vitest)
- **E2E Tests**: Testing complete user flows (Playwright)

## Setup

### Install Dependencies
```bash
bun install
```

### Set Up Test Database
Create a separate test database to avoid affecting development data:

```env
# .env.test
DATABASE_URL="postgresql://user:password@localhost:5432/plantcare_test?schema=public"
```

### Generate Prisma Client
```bash
bun prisma:generate
```

## Running Tests

### All Tests
```bash
bun test
```

### Unit Tests Only
```bash
bun test src/lib/__tests__
```

### Integration Tests Only
```bash
bun test tests/integration
```

### E2E Tests
```bash
# Run all E2E tests
bun test:e2e

# Run with UI
bun test:e2e:ui

# Run in headed mode (see browser)
bun test:e2e:headed
```

### Watch Mode
```bash
bun test --watch
```

### Coverage Report
```bash
bun test:coverage
```

## Test Structure

### Unit Tests
Located in `src/lib/__tests__/`

Example:
```typescript
import { describe, it, expect } from 'vitest';
import { calculateNextDueDate } from '../date-utils';

describe('Date Utility Functions', () => {
  describe('calculateNextDueDate', () => {
    it('should calculate next due date correctly', () => {
      const result = calculateNextDueDate(
        new Date('2024-01-01'),
        7,
        '09:00'
      );
      expect(result).toBeDefined();
    });
  });
});
```

### Integration Tests
Located in `tests/integration/`

Example:
```typescript
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { PrismaClient } from '@/generated/prisma';

const prisma = new PrismaClient();

describe('Plant CRUD Operations', () => {
  beforeAll(async () => {
    // Setup test data
  });

  afterAll(async () => {
    // Cleanup
    await prisma.$disconnect();
  });

  it('should create a plant', async () => {
    const plant = await prisma.plant.create({
      data: { name: 'Test Plant', userId: 'test-user-id' }
    });
    expect(plant).toBeDefined();
  });
});
```

### E2E Tests
Located in `tests/e2e/`

Example:
```typescript
import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test('should sign up a new user', async ({ page }) => {
    await page.goto('/signup');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('/dashboard');
  });
});
```

## Test Coverage Goals

- **Unit Tests**: 80%+ coverage for utility functions
- **Integration Tests**: All CRUD operations covered
- **E2E Tests**: Critical user flows covered

### Current Coverage

#### Unit Tests
- ✅ Date utilities (100%)
- ✅ Authentication validation schemas (100%)
- ⚠️ API error handling (partial)

#### Integration Tests
- ✅ Plant CRUD operations
- ✅ Task completion flow
- ✅ Security tests
- ⚠️ Email notifications (needs mock)
- ⚠️ Push notifications (needs mock)
- ⚠️ Cron job logic (needs mock)

#### E2E Tests
- ✅ User registration and login
- ✅ Plant management
- ⚠️ Schedule creation (partial)
- ⚠️ Task completion (partial)
- ⚠️ Notification preferences (partial)

## Writing New Tests

### Unit Test Template
```typescript
import { describe, it, expect } from 'vitest';
import { yourFunction } from '../your-module';

describe('Your Module', () => {
  describe('yourFunction', () => {
    it('should handle valid input', () => {
      const result = yourFunction('valid-input');
      expect(result).toBe('expected-output');
    });

    it('should handle invalid input', () => {
      expect(() => yourFunction('invalid')).toThrow();
    });

    it('should handle edge cases', () => {
      expect(yourFunction('')).toBe('');
      expect(yourFunction(null)).toBeNull();
    });
  });
});
```

### Integration Test Template
```typescript
import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import { PrismaClient } from '@/generated/prisma';

const prisma = new PrismaClient();

describe('Feature Tests', () => {
  let testUserId: string;

  beforeAll(async () => {
    // Create test user
    const user = await prisma.user.create({
      data: { email: 'test@example.com', password: 'hashed' }
    });
    testUserId = user.id;
  });

  afterAll(async () => {
    // Cleanup
    await prisma.user.delete({ where: { id: testUserId } });
    await prisma.$disconnect();
  });

  beforeEach(async () => {
    // Reset state before each test
  });

  it('should perform operation', async () => {
    // Test implementation
  });
});
```

### E2E Test Template
```typescript
import { test, expect } from '@playwright/test';

test.describe('Feature Name', () => {
  test.beforeEach(async ({ page }) => {
    // Setup: login, navigate, etc.
  });

  test('should complete user flow', async ({ page }) => {
    // Navigate
    await page.goto('/feature');

    // Interact
    await page.fill('input[name="field"]', 'value');
    await page.click('button[type="submit"]');

    // Assert
    await expect(page.locator('.success-message')).toBeVisible();
  });
});
```

## Mocking

### Mocking External Services

#### Firebase
```typescript
import { vi } from 'vitest';

vi.mock('firebase-admin', () => ({
  messaging: () => ({
    send: vi.fn().mockResolvedValue({ messageId: 'test-id' })
  })
}));
```

#### Resend
```typescript
vi.mock('resend', () => ({
  Resend: vi.fn().mockImplementation(() => ({
    emails: {
      send: vi.fn().mockResolvedValue({ id: 'test-email-id' })
    }
  }))
}));
```

#### Prisma
```typescript
import { mockDeep, mockReset } from 'vitest-mock-extended';
import { PrismaClient } from '@/generated/prisma';

const prismaMock = mockDeep<PrismaClient>();

beforeEach(() => {
  mockReset(prismaMock);
});
```

## Debugging Tests

### Vitest
```bash
# Run specific test file
bun test src/lib/__tests__/date-utils.test.ts

# Run tests matching pattern
bun test --grep "should calculate"

# Run with verbose output
bun test --reporter=verbose
```

### Playwright
```bash
# Debug mode
bun test:e2e --debug

# Show browser
bun test:e2e:headed

# Generate test code
bunx playwright codegen http://localhost:3000
```

## CI/CD Integration

### GitHub Actions Example
```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: oven-sh/setup-bun@v1
      - run: bun install
      - run: bun test:run
      - run: bun test:e2e
```

## Best Practices

1. **Isolation**: Each test should be independent
2. **Cleanup**: Always clean up test data
3. **Descriptive Names**: Use clear, descriptive test names
4. **Arrange-Act-Assert**: Follow AAA pattern
5. **Mock External Services**: Don't make real API calls in tests
6. **Test Edge Cases**: Test boundary conditions and errors
7. **Keep Tests Fast**: Unit tests should run in milliseconds
8. **Use Factories**: Create test data with factory functions
9. **Avoid Test Interdependence**: Tests shouldn't rely on execution order
10. **Test Behavior, Not Implementation**: Focus on what, not how

## Common Issues

### Database Connection Errors
- Ensure test database is running
- Check DATABASE_URL in .env.test
- Verify Prisma client is generated

### Timeout Errors
- Increase timeout for slow operations
- Check for infinite loops
- Verify async operations complete

### Flaky Tests
- Add proper waits in E2E tests
- Ensure test isolation
- Check for race conditions

## Performance

### Speed Up Tests
- Use `test.concurrent` for independent tests
- Mock external services
- Use in-memory database for unit tests
- Run E2E tests in parallel

### Example
```typescript
test.concurrent('test 1', async () => {
  // This test runs in parallel
});

test.concurrent('test 2', async () => {
  // This test runs in parallel
});
```

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [Playwright Documentation](https://playwright.dev/)
- [Testing Library](https://testing-library.com/)
- [Prisma Testing Guide](https://www.prisma.io/docs/guides/testing)
