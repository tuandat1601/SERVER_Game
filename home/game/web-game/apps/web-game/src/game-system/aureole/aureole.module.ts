import { Module } from '@nestjs/common';
import { AureoleService } from './aureole.service';
import { AureoleController } from './aureole.controller';
import { GameDataModule } from '../../game-data/gamedata.module';

@Module({
  imports: [GameDataModule],
  controllers: [AureoleController],
  providers: [AureoleService]
})
export class AureoleModule {}
