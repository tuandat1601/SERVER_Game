import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ScheduleModule } from '@nestjs/schedule';
import { CoreModule } from './core/core.module';
import { AuthModule } from './common/auth/auth.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { RoleModule } from './game-data/role/role.module';
import { ConfigModule } from "@nestjs/config";
import { LoginModule } from './game-system/login/login.module';
import { GameCacheModule } from './game-lib/gamecache/gamecache.module';
import { GameDataModule } from './game-data/gamedata.module';
import { FightModule } from './game-system/fight/fight.module';
import { GameConfigModule } from './game-config/game-config.module';
import { SkillModule } from './game-system/skill/skill.module';
import { EquipModule } from './game-system/equip/equip.module';
import { HeroModule } from './game-system/hero/hero.module';
import { BoxModule } from './game-system/box/box.module';
import { LogbullModule } from "./game-lib/logbull/logbull.module";
import { EmailModule } from './game-system/email/email.module';
import { TimeAwardModule } from './game-system/time-award/time-award.module';
import { TaskModule } from './game-system/task/task.module';
import { WelfareModule } from './game-system/welfare/welfare.module';
import { ShopModule } from './game-system/shop/shop.module';
import { MedalModule } from './game-system/medal/medal.module';
import { PirateShipModule } from './game-system/pirate-ship/pirate-ship.module';
import { ArenaModule } from './game-system/arena/arena.module';
import { GameCommonModule } from './game-system/game-common/game-common.module';
import { FruitModule } from './game-system/fruit/fruit.module';
import { UpgradeModule } from './game-system/upgrade/upgrade.module';
import { AureoleModule } from './game-system/aureole/aureole.module';
import { MercenaryModule } from './game-system/mercenary/mercenary.module';
import { RaremonsterModule } from './game-system/raremonster/raremonster.module';
import { WrestleModule } from './game-system/wrestle/wrestle.module';
import { TitleModule } from './game-system/title/title.module';
import { FashionModule } from './game-system/fashion/fashion.module';
import { ThrottlerBehindProxyGuard } from './common/guards/throttler-behind-proxy.guard';
import { cTools } from './game-lib/tools';
import { GuildModule } from './game-system/guild/guild.module';
import { CQModule} from './game-system/cq/cq.module';


let envFilePath = ['.env'];
envFilePath.unshift(`.${process.env.RUNNING_ENV}.env`)

// LN登陆节点 GN游戏节点
let imports_m: any
if (process.env.RUNNING_TYPE == "LN") {
  imports_m = [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: envFilePath,
    }),
    ScheduleModule.forRoot(),
    CoreModule,
    AuthModule,
    //UsersModule,
    //防御限制 60秒 限制请求数量
    ThrottlerModule.forRoot({
      ttl: 10,
      limit: 100,
    }),
    LogbullModule,
    RoleModule, LoginModule,
    GameCacheModule, GameDataModule,
    GameConfigModule
  ]
}
else if (process.env.RUNNING_TYPE == "GN") {
  imports_m = [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: envFilePath,
    }),
    ScheduleModule.forRoot(),
    CoreModule,
    AuthModule,
    //UsersModule,
    //防御限制 60秒 限制请求数量
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 10000,
    }),
    LogbullModule, RoleModule, SkillModule, EquipModule, HeroModule,
    BoxModule, EmailModule, TimeAwardModule, TaskModule, WelfareModule,
    ShopModule, PirateShipModule, GameCommonModule, GameCacheModule, GameDataModule,
    GameConfigModule, MedalModule, ArenaModule, FruitModule, FightModule,
    UpgradeModule, AureoleModule, MercenaryModule, RaremonsterModule, WrestleModule,
    TitleModule, FashionModule, GuildModule, CQModule,
  ]
}
@Module({
  imports: imports_m,
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerBehindProxyGuard
    },
  ],
})
export class AppModule { }
