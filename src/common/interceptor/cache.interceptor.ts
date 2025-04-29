import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, from } from 'rxjs';
import { tap, switchMap } from 'rxjs/operators';
import { Reflector } from '@nestjs/core';
import { RedisService } from '../../redis/redis.service';
import { CACHE_PREFIX_KEY } from '../decorator/cache/cache-prefix.decorator';
import {
  CACHEABLE_KEY,
  CacheableOptions,
} from '../decorator/cache/cacheable.decorator';
import {
  CACHE_EVICT_KEY,
  CacheEvictOptions,
} from '../decorator/cache/cache-evict.decorator';

@Injectable()
export class CacheInterceptor implements NestInterceptor {
  constructor(
    private readonly reflector: Reflector,
    private readonly redisService: RedisService,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const handler = context.getHandler();
    const target = context.getClass();

    const prefix = this.reflector.get<string>(CACHE_PREFIX_KEY, target);
    const cacheable = this.reflector.get<CacheableOptions>(
      CACHEABLE_KEY,
      handler,
    );
    const evict = this.reflector.get<CacheEvictOptions>(
      CACHE_EVICT_KEY,
      handler,
    );

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const request = context.switchToHttp().getRequest();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
    const params = request.params;

    // ✳️ Evict Mode
    if (evict) {
      const key =
        typeof evict.key === 'function' ? evict.key(params) : evict.key;
      const fullKey = prefix ? `${prefix}:${key}` : key;

      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      return next.handle().pipe(tap(() => this.redisService.del(fullKey)));
    }

    // ✅ Cache Mode
    if (cacheable) {
      const key =
        typeof cacheable.key === 'function'
          ? cacheable.key(params)
          : cacheable.key;
      const fullKey = prefix ? `${prefix}:${key}` : key;

      return from(this.redisService.get(fullKey)).pipe(
        switchMap((cached) => {
          if (cached !== null) return from([cached]);

          return next.handle().pipe(
            // eslint-disable-next-line @typescript-eslint/no-misused-promises
            tap(async (result) => {
              await this.redisService.set(fullKey, result, cacheable.ttl);
            }),
          );
        }),
      );
    }

    // 🟡 Default, passthrough
    return next.handle();
  }
}
