import { Module } from '@nestjs/common';
import { MercenaryService } from './mercenary.service';
import { MercenaryController } from './mercenary.controller';
import { GameDataModule } from '../../game-data/gamedata.module';
import { FightModule } from '../fight/fight.module';

@Module({
  imports: [GameDataModule,FightModule],
  controllers: [MercenaryController],
  providers: [MercenaryService]
})
export class MercenaryModule {}
