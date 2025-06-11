import { Module } from '@nestjs/common';
import { GameDataModule } from '../../game-data/gamedata.module';
import { FruitController } from './fruit.controller';
import { FruitService } from './fruit.service';

@Module({
  imports: [GameDataModule],
  controllers: [FruitController],
  providers: [FruitService]
})
export class FruitModule {}
