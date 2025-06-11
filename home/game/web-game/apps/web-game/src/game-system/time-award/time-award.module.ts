import { Module } from '@nestjs/common';
import { TimeAwardService } from './time-award.service';
import { TimeAwardController } from './time-award.controller';
import { GameDataModule } from '../../game-data/gamedata.module';

@Module({
  imports:[GameDataModule],
  controllers: [TimeAwardController],
  providers: [TimeAwardService]
})
export class TimeAwardModule {}
