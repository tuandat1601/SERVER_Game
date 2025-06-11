import { Module } from '@nestjs/common';
import { GameCacheService } from './gamecache.service';
import { RedisModule } from "nestjs-redis";
import { redisConfig } from "../../config/redis.config";

@Module({
  imports:[
    RedisModule.register(redisConfig)
  ],
  providers: [GameCacheService],
  exports:[GameCacheService]
})


export class GameCacheModule {}

