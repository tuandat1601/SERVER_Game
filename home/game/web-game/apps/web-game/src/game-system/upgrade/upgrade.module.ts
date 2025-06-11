import { Module } from '@nestjs/common';
import { UpgradeService } from './upgrade.service';
import { UpgradeController } from './upgrade.controller';
import { GameDataModule } from '../../game-data/gamedata.module';
import { FightModule } from '../fight/fight.module';
import { FightService } from '../fight/fight.service';

@Module({
  imports: [GameDataModule, FightModule],
  controllers: [UpgradeController],
  providers: [UpgradeService]
})
export class UpgradeModule { }
