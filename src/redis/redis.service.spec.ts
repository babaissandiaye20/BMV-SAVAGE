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
          provide: 'default_IORedisModuleConnectionToken',
          useValue: mockRedis,
        },
      ],
    }).compile();

    service = module.get<RedisService>(RedisService);
    redis = module.get('default_IORedisModuleConnectionToken');
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
