# Cache Module

This module provides a higher-level abstraction over the Redis service for caching data in the application.

## Features

- Simple API for getting and setting cached values
- Automatic handling of cache misses
- Methods for invalidating cache entries
- Support for pattern-based cache invalidation

## Usage

### Import the module

```typescript
import { Module } from '@nestjs/common';
import { CacheModule } from './cache/cache.module';

@Module({
  imports: [CacheModule],
  // ...
})
export class YourModule {}
```

### Inject and use the service

```typescript
import { Injectable } from '@nestjs/common';
import { CacheService } from '../cache/cache.service';

@Injectable()
export class YourService {
  constructor(private readonly cacheService: CacheService) {}

  async getUserById(id: string): Promise<User> {
    return this.cacheService.getOrSet(
      `user:${id}`,
      async () => {
        // This function will only be called if the data is not in the cache
        return this.fetchUserFromDatabase(id);
      },
      3600, // Cache for 1 hour (optional, default is 3600 seconds)
    );
  }

  async updateUser(id: string, data: UserUpdateDto): Promise<User> {
    const updatedUser = await this.updateUserInDatabase(id, data);
    
    // Invalidate the cache for this user
    await this.cacheService.invalidate(`user:${id}`);
    
    return updatedUser;
  }

  async deleteAllUserData(): Promise<void> {
    // Invalidate all user-related cache entries
    await this.cacheService.invalidatePattern('user:*');
  }
}
```

## API Reference

### `getOrSet<T>(key: string, fetcher: () => Promise<T>, ttlSeconds = 3600): Promise<T>`

Gets a value from the cache or sets it if it doesn't exist.

- `key`: The cache key
- `fetcher`: A function that returns the value to cache if not found
- `ttlSeconds`: Time to live in seconds (default: 1 hour)

Returns the cached value or the result of the fetcher function.

### `invalidate(key: string): Promise<void>`

Invalidates a specific cache key.

- `key`: The cache key to invalidate

### `invalidatePattern(pattern: string): Promise<void>`

Invalidates all cache keys matching a pattern.

- `pattern`: The pattern to match (e.g., 'user:*')

## Implementation Details

This module was implemented using Test-Driven Development (TDD). The tests were written first to define the expected behavior, and then the implementation was created to satisfy the tests.

For more information on TDD in this project, see the [TDD Guide](../docs/tdd-guide.md).