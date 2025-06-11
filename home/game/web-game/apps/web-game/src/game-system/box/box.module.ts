import { Module } from '@nestjs/common';
import { BoxService } from './box.service';
import { BoxController } from './box.controller';
import { GameDataModule } from '../../game-data/gamedata.module';

@Module({
  imports: [GameDataModule],
  controllers: [BoxController],
  providers: [BoxService]
})
export class BoxModule { }
