import { Module } from '@nestjs/common';
import { GameConfigService } from './game-config.service';

@Module({
  providers: [GameConfigService],
  exports:[GameConfigService]
})
export class GameConfigModule {}
