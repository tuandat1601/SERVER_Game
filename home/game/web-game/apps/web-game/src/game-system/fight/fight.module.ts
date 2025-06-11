import { Module } from '@nestjs/common';
import { FightService } from './fight.service';
import { FightController } from './fight.controller';
import { GameDataModule } from '../../game-data/gamedata.module';

@Module({
  imports: [GameDataModule],
  controllers: [FightController],
  providers: [FightService],
  exports: [FightService]
})
export class FightModule { }
