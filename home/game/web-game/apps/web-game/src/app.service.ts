import { Body, Injectable, Logger, Request } from '@nestjs/common';
import { GetresetDailyDto } from './app.dto';
import { EActType } from './config/game-enum';
import { languageConfig } from './config/language/language';
import { RESChangeMsg } from './game-data/entity/msg.entity';
import { RoleKeyDto } from './game-data/role/dto/role-key.dto';
//import { Cron, Interval, Timeout ,CronExpression } from '@nestjs/schedule';

@Injectable()
export class AppService {

  constructor(
  ) {

  }

  async getResetDaily(@Request() req: any, @Body() getresetDailyDto: GetresetDailyDto) {

    //let roleKeyDto: RoleKeyDto = { id: req.user.id, serverid: req.user.serverid };
    let retMsg: RESChangeMsg = new RESChangeMsg();

    languageConfig.setActTypeSuccess(EActType.GET_RESET_DAILY, retMsg);
    return retMsg;

  }
}
