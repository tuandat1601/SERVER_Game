import { Module } from '@nestjs/common';
import { ArenaService } from './arena.service';
import { ArenaController } from './arena.controller';
import { GameDataModule } from '../../game-data/gamedata.module';
import { FightModule } from '../fight/fight.module';

@Module({
  imports: [GameDataModule, FightModule],
  controllers: [ArenaController],
  providers: [ArenaService]
})
export class ArenaModule {}
