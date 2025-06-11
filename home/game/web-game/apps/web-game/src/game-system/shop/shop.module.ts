import { Module } from '@nestjs/common';
import { ShopService } from './shop.service';
import { ShopController } from './shop.controller';
import { GameDataModule } from '../../game-data/gamedata.module';

@Module({
  imports:[GameDataModule],
  controllers: [ShopController],
  providers: [ShopService]
})
export class ShopModule {}
