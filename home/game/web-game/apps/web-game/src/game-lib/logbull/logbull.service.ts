import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { gameConst } from '../../config/game-const';
import { GameCacheService } from '../gamecache/gamecache.service';
import { Logger } from '../log4js';

const init_idx = 1;

@Injectable()
export class LogbullService {

  private sendNodeidx:number = init_idx;

  constructor(@InjectQueue(gameConst.logbull_queue_name) private readonly logQueue: Queue,
              private gameCacheService: GameCacheService) {

              }

  async sendLogBull(sendData:any) {

    let logbull = await this.gameCacheService.getJSON(gameConst.logbull_redis_name);

    if (!logbull) {
       Logger.error(`sendLogBull  ${gameConst.logbull_redis_name} is null`,sendData);
       return;
    }

    let ary_length = Object.keys(logbull).length;

    this.sendNodeidx = Math.min(ary_length,this.sendNodeidx);

    this.logQueue.add(gameConst.getLogBullTaskName(this.sendNodeidx), sendData,{removeOnComplete:true,removeOnFail:true});

    this.sendNodeidx++;
    
    if (this.sendNodeidx >= ary_length) {
        this.sendNodeidx = init_idx;
    }

  }
}
