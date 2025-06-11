import { Module } from '@nestjs/common';
import { BackendDataService } from './backend-data.service';
import { BackendDataController } from './backend-data.controller';
import { GameCacheModule } from 'apps/web-game/src/game-lib/gamecache/gamecache.module';
import { PrismaModule } from 'apps/web-game/src/game-lib/prisma/prisma.module';
import { GameConfigModule } from 'apps/web-game/src/game-config/game-config.module';
import { HttpModule } from '@nestjs/axios';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    PrismaModule,
    GameCacheModule,
    GameConfigModule,
    HttpModule,
  ],
  controllers: [BackendDataController],
  providers: [BackendDataService],
  exports: [BackendDataService]
})
export class BackendDataModule { }
