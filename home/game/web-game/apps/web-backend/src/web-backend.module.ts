import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { WebBackendController } from './web-backend.controller';
import { WebBackendService } from './web-backend.service';
import { LoginModule } from './backend-system/login/login.module';
import { GamesMgrModule } from './backend-system/games-mgr/games-mgr.module';
import { CustomerServiceModule } from './backend-system/customer-service/customer-service.module';
import { UserModule } from './backend-system/user/user.module';
import { BackendAuthModule } from './common/auth/backend-auth/backend-auth.module';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { TransformBEInterceptor } from './common/interceptors/transform.interceptor';
import { BackendDataModule } from './data/backend-data/backend-data.module';
import { OperationsModule } from './backend-system/operations/operations.module';
import { ChannelModule } from './channel/channel/channel.module';
import { YltaptapModule } from './channel/yltaptap/yltaptap.module';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { YoulongModule } from './channel/youlong/youlong.module';
import { QipaModule } from './channel/qipa/qipa.module';
import { BrsdkModule } from './channel/brsdk/brsdk.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { ThrottlerBehindProxyGuard } from 'apps/web-game/src/common/guards/throttler-behind-proxy.guard';
import { FywechatModule } from './channel/fywechat/fywechat.module';


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
      ttl: 60,
      limit: 10000,
    }),
    BackendAuthModule,
    ScheduleModule.forRoot(),
    LoginModule,
    UserModule,
    GamesMgrModule,
    CustomerServiceModule,
    OperationsModule,
    BackendDataModule,
    ChannelModule,
    YltaptapModule,
    YoulongModule,
    QipaModule,
    BrsdkModule,
    FywechatModule,
  ],
  controllers: [WebBackendController],
  providers: [
    WebBackendService,
    { provide: APP_INTERCEPTOR, useClass: TransformBEInterceptor },
    {
      provide: APP_GUARD,
      useClass: ThrottlerBehindProxyGuard
    },
  ],
})
export class WebBackendModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
