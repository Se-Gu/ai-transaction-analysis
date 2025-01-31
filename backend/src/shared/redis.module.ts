import { Module, Global } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-redis-store';

@Global()
@Module({
  imports: [
    CacheModule.register({
      store: redisStore,
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT ?? '6379', 10), // Ensure port is always a string
      ttl: 86400, // Cache expiration time in seconds (1 day)
    }),
  ],
  exports: [CacheModule],
})
export class RedisModule {}
