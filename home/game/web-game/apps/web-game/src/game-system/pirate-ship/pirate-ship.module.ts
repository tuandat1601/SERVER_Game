import { Module } from '@nestjs/common';
import { PirateShipService } from './pirate-ship.service';
import { PirateShipController } from './pirate-ship.controller';
import { GameDataModule } from '../../game-data/gamedata.module';

@Module({
  imports: [GameDataModule],
  controllers: [PirateShipController],
  providers: [PirateShipService]
})
export class PirateShipModule { }
