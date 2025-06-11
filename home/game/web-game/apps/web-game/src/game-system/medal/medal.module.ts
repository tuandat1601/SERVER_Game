import { Module } from '@nestjs/common';
import { MedalService } from './medal.service';
import { MedalController } from './medal.controller';
import { GameDataModule } from '../../game-data/gamedata.module';

@Module({
  imports: [GameDataModule],
  controllers: [MedalController],
  providers: [MedalService]
})
export class MedalModule {}
