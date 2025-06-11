import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { gameConst } from '../../config/game-const';
import { redisConfig } from '../../config/redis.config';
import { GameCacheModule } from '../gamecache/gamecache.module';
import { LogbullService } from './logbull.service';

@Module({
  imports: [
    BullModule.registerQueue({
      name: gameConst.logbull_queue_name,
      redis: redisConfig
    }),
    GameCacheModule
  ],
  providers: [LogbullService],
  exports:[LogbullService]
})
export class LogbullModule {}
