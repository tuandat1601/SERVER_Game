import { Module } from '@nestjs/common';
import { GameDataService } from './gamedata.service';
import { GameCacheModule } from "../game-lib/gamecache/gamecache.module";
import { PrismaModule } from '../game-lib/prisma/prisma.module';
import { GameConfigModule } from '../game-config/game-config.module';
import { LogbullModule } from '../game-lib/logbull/logbull.module';
import { GameMergeService } from './game-merge.service';

@Module({
  imports: [GameCacheModule, PrismaModule, GameConfigModule, LogbullModule],
  providers: [GameDataService, GameMergeService],
  exports: [GameDataService, GameMergeService],
})
export class GameDataModule { }
