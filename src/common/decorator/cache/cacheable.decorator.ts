import { SetMetadata } from '@nestjs/common';

export const CACHEABLE_KEY = 'CACHEABLE_METADATA';

export interface CacheableOptions {
  key: string | ((params: any) => string);
  ttl: number;
}

export const Cacheable = (options: CacheableOptions) =>
  SetMetadata(CACHEABLE_KEY, options);
