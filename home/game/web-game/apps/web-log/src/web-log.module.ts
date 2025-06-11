import { Module } from '@nestjs/common';
import { WebLogController } from './web-log.controller';
import { WebLogService } from './web-log.service';
import { GameCacheModule } from 'apps/web-game/src/game-lib/gamecache/gamecache.module';
import { BullModule } from '@nestjs/bull';
import { redisConfig } from 'apps/web-game/src/config/redis.config';
import { ScheduleModule } from '@nestjs/schedule';
import { PrismaModule } from 'apps/web-game/src/game-lib/prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { gameConst } from 'apps/web-game/src/config/game-const';

let envFilePath = ['.env'];
envFilePath.unshift(`.${process.env.RUNNING_ENV}.env`)


@Module({
  imports: [
    ConfigModule.forRoot({
    isGlobal: true,
    envFilePath: envFilePath,
    }),
    GameCacheModule,
    PrismaModule,
    ScheduleModule.forRoot(),
    BullModule.registerQueue({
      name: gameConst.logbull_queue_name,
      redis: redisConfig,
      limiter: {
        max: 100,
        duration: 1000
      }
    }),
  ],
  controllers: [WebLogController],
  providers: [WebLogService],
})
export class WebLogModule { }
