import { Module } from '@nestjs/common';
import { WelfareService } from './welfare.service';
import { WelfareController } from './welfare.controller';
import { GameDataModule } from '../../game-data/gamedata.module';
@Module({
  imports:[GameDataModule],
  controllers: [WelfareController],
  providers: [WelfareService]
})
export class WelfareModule {}
