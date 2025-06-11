import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { AuthModule } from 'apps/web-game/src/common/auth/auth.module';
import { WebChatController } from './web-chat.controller';
import { WebChatService } from './web-chat.service';
import { WebSocketsModule } from './web-sockets/web-sockets.module';

let envFilePath = ['.env'];
envFilePath.unshift(`.${process.env.RUNNING_ENV}.env`)

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: envFilePath,
    }),
    //防御限制 60秒 限制请求数量
    ThrottlerModule.forRoot({
      ttl: 10,
      limit: 100,
    }),
    WebSocketsModule,
    AuthModule,
  ],
  controllers: [WebChatController],
  providers: [
    WebChatService,
    // {
    //   provide: APP_GUARD,
    //   useClass: WsThrottlerGuard
    // },
  ],
})
export class WebChatModule { }
