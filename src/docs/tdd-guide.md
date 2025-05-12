# Test-Driven Development (TDD) Guide for Salvage Inspection Backend

## What is TDD?

Test-Driven Development (TDD) is a software development approach where tests are written before the actual code implementation. The TDD cycle consists of three steps:

1. **Red**: Write a failing test that defines the functionality you want to implement.
2. **Green**: Write the minimal code necessary to make the test pass.
3. **Refactor**: Improve the code while ensuring the tests still pass.

This cycle is repeated for each feature or functionality you want to implement.

## Benefits of TDD

- **Higher code quality**: Writing tests first forces you to think about the design and requirements before implementation.
- **Better documentation**: Tests serve as documentation for how your code should behave.
- **Safer refactoring**: Tests provide a safety net when refactoring code.
- **Fewer bugs**: TDD helps catch bugs early in the development process.
- **Faster development in the long run**: While it may seem slower initially, TDD can speed up development by reducing debugging time.

## TDD in NestJS

NestJS has built-in support for testing using Jest. The project is already set up with test files for most services and controllers.

### Test File Naming Convention

In NestJS, test files follow this naming convention:
- `*.spec.ts` for unit tests
- `*.e2e-spec.ts` for end-to-end tests

### Test Structure

A typical NestJS test file has the following structure:

```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { YourService } from './your.service';

describe('YourService', () => {
  let service: YourService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [YourService],
    }).compile();

    service = module.get<YourService>(YourService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // Additional tests...
});
```

## Practical Example: Testing RedisService

Let's implement TDD for the RedisService as an example.

### Step 1: Understand the Requirements

The RedisService has the following methods:
- `get<T>`: Retrieves a value from Redis by key
- `set`: Stores a value in Redis, with an optional TTL
- `del`: Deletes a value from Redis by key
- `exists`: Checks if a key exists in Redis
- `cacheable`: Implements a cache-aside pattern

### Step 2: Write Tests First

Let's enhance the existing `redis.service.spec.ts` file with tests for each method.

```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { RedisService } from './redis.service';
import { Redis } from 'ioredis';

// Mock Redis client
const mockRedis = {
  get: jest.fn(),
  set: jest.fn(),
  del: jest.fn(),
  exists: jest.fn(),
};

describe('RedisService', () => {
  let service: RedisService;
  let redis: Redis;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RedisService,
        {
          provide: 'REDIS_CLIENT',
          useValue: mockRedis,
        },
      ],
    }).compile();

    service = module.get<RedisService>(RedisService);
    redis = module.get('REDIS_CLIENT');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('get', () => {
    it('should return parsed data when key exists', async () => {
      const mockData = JSON.stringify({ test: 'data' });
      mockRedis.get.mockResolvedValue(mockData);

      const result = await service.get('test-key');
      
      expect(mockRedis.get).toHaveBeenCalledWith('test-key');
      expect(result).toEqual({ test: 'data' });
    });

    it('should return null when key does not exist', async () => {
      mockRedis.get.mockResolvedValue(null);

      const result = await service.get('non-existent-key');
      
      expect(mockRedis.get).toHaveBeenCalledWith('non-existent-key');
      expect(result).toBeNull();
    });
  });

  describe('set', () => {
    it('should set value without TTL', async () => {
      const value = { test: 'data' };
      mockRedis.set.mockResolvedValue('OK');

      await service.set('test-key', value);
      
      expect(mockRedis.set).toHaveBeenCalledWith('test-key', JSON.stringify(value));
    });

    it('should set value with TTL', async () => {
      const value = { test: 'data' };
      const ttl = 60;
      mockRedis.set.mockResolvedValue('OK');

      await service.set('test-key', value, ttl);
      
      expect(mockRedis.set).toHaveBeenCalledWith('test-key', JSON.stringify(value), 'EX', ttl);
    });
  });

  describe('del', () => {
    it('should delete key', async () => {
      mockRedis.del.mockResolvedValue(1);

      await service.del('test-key');
      
      expect(mockRedis.del).toHaveBeenCalledWith('test-key');
    });
  });

  describe('exists', () => {
    it('should return true when key exists', async () => {
      mockRedis.exists.mockResolvedValue(1);

      const result = await service.exists('test-key');
      
      expect(mockRedis.exists).toHaveBeenCalledWith('test-key');
      expect(result).toBe(true);
    });

    it('should return false when key does not exist', async () => {
      mockRedis.exists.mockResolvedValue(0);

      const result = await service.exists('non-existent-key');
      
      expect(mockRedis.exists).toHaveBeenCalledWith('non-existent-key');
      expect(result).toBe(false);
    });
  });

  describe('cacheable', () => {
    it('should return cached data when key exists', async () => {
      const cachedData = { test: 'cached-data' };
      mockRedis.get.mockResolvedValue(JSON.stringify(cachedData));

      const fetcher = jest.fn();
      const result = await service.cacheable('test-key', 60, fetcher);
      
      expect(mockRedis.get).toHaveBeenCalledWith('test-key');
      expect(fetcher).not.toHaveBeenCalled();
      expect(result).toEqual(cachedData);
    });

    it('should fetch and cache data when key does not exist', async () => {
      const fetchedData = { test: 'fetched-data' };
      mockRedis.get.mockResolvedValue(null);
      const fetcher = jest.fn().mockResolvedValue(fetchedData);

      const result = await service.cacheable('test-key', 60, fetcher);
      
      expect(mockRedis.get).toHaveBeenCalledWith('test-key');
      expect(fetcher).toHaveBeenCalled();
      expect(mockRedis.set).toHaveBeenCalledWith('test-key', JSON.stringify(fetchedData), 'EX', 60);
      expect(result).toEqual(fetchedData);
    });
  });
});
```

### Step 3: Run the Tests (They Will Fail)

Run the tests using:

```bash
npm test src/redis/redis.service.spec.ts
```

The tests will fail because we need to update our implementation to match the test expectations.

### Step 4: Implement the Code to Make Tests Pass

Update the RedisService implementation to make the tests pass. The current implementation should already be close, but might need adjustments to handle the mocked Redis client.

### Step 5: Refactor if Needed

Once the tests pass, you can refactor the code to improve its quality while ensuring the tests still pass.

## Implementing TDD in Your Project

To implement TDD in your project, follow these steps for each new feature:

1. **Write a Test**: Start by writing a test that defines the expected behavior of the feature.
2. **Run the Test**: Verify that the test fails (since the feature isn't implemented yet).
3. **Implement the Feature**: Write the minimal code necessary to make the test pass.
4. **Run the Tests Again**: Verify that all tests pass.
5. **Refactor**: Improve the code while ensuring the tests still pass.
6. **Repeat**: Continue this cycle for each aspect of the feature.

## Best Practices for TDD

1. **Keep Tests Simple**: Each test should verify a single aspect of behavior.
2. **Use Descriptive Test Names**: Test names should clearly describe what they're testing.
3. **Isolate Tests**: Tests should not depend on each other or external state.
4. **Mock External Dependencies**: Use mocks for external services like databases or APIs.
5. **Test Edge Cases**: Include tests for edge cases and error conditions.
6. **Maintain Test Coverage**: Aim for high test coverage, but focus on critical paths.

## Running Tests in This Project

- Run all tests: `npm test`
- Run tests in watch mode: `npm run test:watch`
- Run tests with coverage: `npm run test:cov`
- Run e2e tests: `npm run test:e2e`

## Conclusion

TDD is a powerful approach that can improve code quality and maintainability. By writing tests first, you ensure that your code meets the requirements and behaves as expected. The NestJS framework provides excellent support for testing, making it easy to implement TDD in your project.

Start small by applying TDD to a single module or feature, and gradually expand as you become more comfortable with the approach.