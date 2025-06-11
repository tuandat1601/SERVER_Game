import { Module } from '@nestjs/common';
import { GameCommonService } from './game-common.service';
import { GameCommonController } from './game-common.controller';
import { GameDataModule } from '../../game-data/gamedata.module';

@Module({
  imports: [GameDataModule],
  controllers: [GameCommonController],
  providers: [GameCommonService]
})
export class GameCommonModule { }
