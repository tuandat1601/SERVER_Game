import { Module } from '@nestjs/common';
import { EquipService } from './equip.service';
import { EquipController } from './equip.controller';
import { GameDataModule } from '../../game-data/gamedata.module';

@Module({
  imports: [GameDataModule],
  controllers: [EquipController],
  providers: [EquipService],
  exports: [EquipService],
})
export class EquipModule {}
