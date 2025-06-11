import { Module } from '@nestjs/common';
import { WrestleService } from './wrestle.service';
import { WrestleController } from './wrestle.controller';
import { GameDataModule } from '../../game-data/gamedata.module';
import { FightModule } from '../fight/fight.module';

@Module({
  imports: [GameDataModule, FightModule],
  controllers: [WrestleController],
  providers: [WrestleService]
})
export class WrestleModule { }
