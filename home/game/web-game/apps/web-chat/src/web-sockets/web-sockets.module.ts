import { Module } from '@nestjs/common';
import { WebSocketsService } from './web-sockets.service';
import { WebSocketsGateway } from './web-sockets.gateway';
import { GameDataModule } from 'apps/web-game/src/game-data/gamedata.module';
import { AuthModule } from 'apps/web-game/src/common/auth/auth.module';



@Module({
  imports:
    [GameDataModule, AuthModule,],
  providers: [
    WebSocketsGateway,
    WebSocketsService,
  ],
  exports: [WebSocketsService],
})
export class WebSocketsModule { }
