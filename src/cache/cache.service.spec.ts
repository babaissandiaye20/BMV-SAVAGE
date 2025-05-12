import { Test, TestingModule } from '@nestjs/testing';
import { CacheService } from './cache.service';
import { RedisService } from '../redis/redis.service';

// Mock RedisService
const mockRedisService = {
  get: jest.fn(),
  set: jest.fn(),
  del: jest.fn(),
  exists: jest.fn(),
  cacheable: jest.fn(),
};

describe('CacheService', () => {
  let service: CacheService;
  let redisService: RedisService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CacheService,
        {
          provide: RedisService,
          useValue: mockRedisService,
        },
      ],
    }).compile();

    service = module.get<CacheService>(CacheService);
    redisService = module.get<RedisService>(RedisService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getOrSet', () => {
    it('should return cached data when key exists', async () => {
      const key = 'test-key';
      const cachedData = { test: 'cached-data' };
      mockRedisService.get.mockResolvedValue(cachedData);

      const fetcher = jest.fn();
      const result = await service.getOrSet(key, fetcher);

      expect(mockRedisService.get).toHaveBeenCalledWith(key);
      expect(fetcher).not.toHaveBeenCalled();
      expect(result).toEqual(cachedData);
    });

    it('should fetch and cache data when key does not exist', async () => {
      const key = 'test-key';
      const fetchedData = { test: 'fetched-data' };
      mockRedisService.get.mockResolvedValue(null);
      const fetcher = jest.fn().mockResolvedValue(fetchedData);

      const result = await service.getOrSet(key, fetcher);

      expect(mockRedisService.get).toHaveBeenCalledWith(key);
      expect(fetcher).toHaveBeenCalled();
      expect(mockRedisService.set).toHaveBeenCalledWith(key, fetchedData, 3600);
      expect(result).toEqual(fetchedData);
    });

    it('should use custom TTL when provided', async () => {
      const key = 'test-key';
      const fetchedData = { test: 'fetched-data' };
      const customTtl = 7200;
      mockRedisService.get.mockResolvedValue(null);
      const fetcher = jest.fn().mockResolvedValue(fetchedData);

      const result = await service.getOrSet(key, fetcher, customTtl);

      expect(mockRedisService.set).toHaveBeenCalledWith(key, fetchedData, customTtl);
      expect(result).toEqual(fetchedData);
    });
  });

  describe('invalidate', () => {
    it('should delete the cache key', async () => {
      const key = 'test-key';
      mockRedisService.del.mockResolvedValue(undefined);

      await service.invalidate(key);

      expect(mockRedisService.del).toHaveBeenCalledWith(key);
    });
  });

  describe('invalidatePattern', () => {
    it('should delete all cache keys matching the pattern', async () => {
      const pattern = 'user:*';
      const keys = ['user:1', 'user:2', 'user:3'];
      
      // Mock implementation for scanning and deleting keys
      // This is a simplified version for the test
      mockRedisService.cacheable.mockImplementation(async (key, ttl, fetcher) => {
        if (key === `scan:${pattern}`) {
          return keys;
        }
        return null;
      });

      await service.invalidatePattern(pattern);

      expect(mockRedisService.cacheable).toHaveBeenCalled();
      expect(mockRedisService.del).toHaveBeenCalledTimes(keys.length);
      keys.forEach(key => {
        expect(mockRedisService.del).toHaveBeenCalledWith(key);
      });
    });
  });
});