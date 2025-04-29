import { SetMetadata } from '@nestjs/common';

export const CACHE_EVICT_KEY = 'CACHE_EVICT_METADATA';

export interface CacheEvictOptions {
  key: string | ((params: any) => string);
}

export const CacheEvict = (options: CacheEvictOptions) =>
  SetMetadata(CACHE_EVICT_KEY, options);
