# Testing Guide

## Quick Start

Run tests:
```bash
npm test
```

Watch mode (runs tests on file changes):
```bash
npm run test:watch
```

Generate coverage report:
```bash
npm run test:coverage
```

## Writing Tests

### Component Tests

Example test for a React component:

```typescript
import { render, screen } from '@testing-library/react';
import { Button } from '@/components/ui/button';

describe('Button Component', () => {
  it('renders button text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });
});
```

### Utility Function Tests

Example test for a utility function:

```typescript
import { formatDate } from '@/lib/utils';

describe('formatDate', () => {
  it('formats date correctly', () => {
    const date = new Date('2024-01-01');
    expect(formatDate(date)).toBe('Jan 1, 2024');
  });
});
```

### API Route Tests

Example test for an API endpoint:

```typescript
import request from 'supertest';
import app from '@/server/index';

describe('GET /api/health', () => {
  it('returns 200 status', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
  });
});
```

## Test Structure

- Unit tests: `client/src/__tests__/` or `*.test.tsx`
- Integration tests: `tests/integration/`
- E2E tests: `tests/e2e/` (future)

## Best Practices

1. **Test behavior, not implementation** - Test what users see/experience
2. **Keep tests simple** - One assertion per test when possible
3. **Use descriptive names** - Test names should describe what they test
4. **Mock external dependencies** - Mock API calls, timers, etc.
5. **Clean up** - Reset state between tests

## Coverage Goals

- Aim for 80%+ coverage on critical paths
- Focus on user-facing features first
- Don't obsess over 100% coverage

## Resources

- [Jest Documentation](https://jestjs.io/)
- [React Testing Library](https://testing-library.com/react)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
