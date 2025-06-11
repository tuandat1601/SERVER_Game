import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { EmailController } from './email.controller';
import { EquipModule } from '../equip/equip.module';
import { GameDataModule } from '../../game-data/gamedata.module';

@Module({
  imports: [GameDataModule],
  controllers: [EmailController],
  providers: [EmailService],
  exports: [EmailService]
})
export class EmailModule { }
