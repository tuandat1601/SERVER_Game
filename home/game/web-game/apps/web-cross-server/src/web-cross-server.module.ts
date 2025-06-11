import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';
import { LoggerMiddleware } from 'apps/web-game/src/common/middleware/logger.middleware';
import { GameDataModule } from 'apps/web-game/src/game-data/gamedata.module';
import { GameCacheModule } from 'apps/web-game/src/game-lib/gamecache/gamecache.module';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { PrismaCrossModule } from './datadb/prisma.cross.module';
import { WebCrossServerController } from './web-cross-server.controller';
import { WebCrossServerService } from './web-cross-server.service';

let envFilePath = ['.env'];
envFilePath.unshift(`.${process.env.RUNNING_ENV}.env`)

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: envFilePath,
    }),
    ScheduleModule.forRoot(),
    GameDataModule,
    PrismaCrossModule,
  ],
  controllers: [WebCrossServerController],
  providers: [
    WebCrossServerService,
    { provide: APP_INTERCEPTOR, useClass: TransformInterceptor },
  ],

})
export class WebCrossServerModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
