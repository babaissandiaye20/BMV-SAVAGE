import { SetMetadata } from '@nestjs/common';

export const CACHE_PREFIX_KEY = 'CACHE_PREFIX_METADATA';

export const CachePrefix = (prefix: string) =>
  SetMetadata(CACHE_PREFIX_KEY, prefix);
