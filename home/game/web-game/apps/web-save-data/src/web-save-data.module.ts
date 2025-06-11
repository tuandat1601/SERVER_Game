import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { GameDataModule } from 'apps/web-game/src/game-data/gamedata.module';
import { WebSaveDataController } from './web-save-data.controller';
import { WebSaveDataService } from './web-save-data.service';

let envFilePath = ['.env'];
envFilePath.unshift(`.${process.env.RUNNING_ENV}.env`)

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: envFilePath,
    }),
    ScheduleModule.forRoot(),
    GameDataModule,],
  controllers: [WebSaveDataController],
  providers: [WebSaveDataService],
})
export class WebSaveDataModule { }
