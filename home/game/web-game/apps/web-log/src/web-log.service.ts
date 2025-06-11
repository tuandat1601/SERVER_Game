import { Process, Processor } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { GameCacheService } from 'apps/web-game/src/game-lib/gamecache/gamecache.service';
import { Logger } from 'apps/web-game/src/game-lib/log4js';
import { PrismaLogDBService } from 'apps/web-game/src/game-lib/prisma/prisma.logdb.service';
import { Job } from 'bull';
import { log_equip, log_gamesys, log_item, log_login } from '@prisma/client2';
import { EActType } from 'apps/web-game/src/config/game-enum';
import { gameConst } from 'apps/web-game/src/config/game-const';
import { languageConfig } from 'apps/web-game/src/config/language/language';
import { EquipEntity } from 'apps/web-game/src/game-data/entity/equip.entity';
import { cTools } from 'apps/web-game/src/game-lib/tools';

@Injectable()
@Processor(gameConst.logbull_queue_name)
export class WebLogService {

  constructor(
    private gameCacheService: GameCacheService,
    private gameLogDB: PrismaLogDBService,
  ) {

  }

  async onDestroy() {

    let logbull = await this.gameCacheService.getJSON(gameConst.logbull_redis_name);

    if (!logbull) { logbull = {} }

    let log_str = [];
    log_str.push("onModuleDestroy befor...");
    log_str.push(logbull);
    if (logbull && logbull[process.env.RUNNING_NODE_ID]) {
      delete logbull[process.env.RUNNING_NODE_ID];
    }

    await this.gameCacheService.setJSON(gameConst.logbull_redis_name, logbull)

    log_str.push("onModuleDestroy last...");
    log_str.push(logbull);

    log_str.push(process.env.RUNNING_ENV + "onModuleDestroy!");
    Logger.log(log_str);
  }

  async init() {
    let logbull = await this.gameCacheService.getJSON(gameConst.logbull_redis_name)

    if (!logbull) { logbull = {} }

    let log_str = [];
    log_str.push("befor...");
    log_str.push(logbull);
    if (logbull) {
      logbull[process.env.RUNNING_NODE_ID] = true;
    }

    await this.gameCacheService.setJSON(gameConst.logbull_redis_name, logbull)

    log_str.push("last...");
    log_str.push(logbull);
    Logger.log(log_str);
  }

  @Process(gameConst.getLogBullTaskName(Number(process.env.RUNNING_NODE_ID)))
  async handleLog(job: Job) {

    if (!job || !job.data) {
      return
    }
    const now = Date.now();
    //Logger.debug('Start handleLog...', job.toJSON());

    let job_data = job.data;
    let save_data = job_data.sDate;
    let user_data = job_data.user;
    //Logger.debug('Start handleLog job_data:', job_data);

    await job.progress(10000);

    if (Number(job_data.type) === EActType.LOGIN) {
      await this.loginlog(save_data);
    } else {
      let sDate = Object.assign(
        {
          logtime: job_data.logtime,
          type: job_data.type,
          dec: languageConfig.act_type[job_data.type],
          roleid: user_data.id,
          req: job_data.req || ""
        }, user_data)
      delete sDate.id;
      delete sDate.userid;

      if (job_data.savesys) {
        await this.gamesyslog(sDate);
      }

    }

    if (job_data.additem && Object.keys(job_data.additem).length > 0) {
      let items = job_data.additem;
      for (const key in items) {
        if (Object.prototype.hasOwnProperty.call(items, key)) {

          if (key.indexOf(gameConst.log_itemNumTag) !== -1) { continue; }

          const item_num = items[key];
          const last_num = items[gameConst.log_itemNumTag + key];
          let sDate = Object.assign(
            {
              logtime: job_data.logtime,
              type: job_data.type,
              itemid: Number(key),
              change: Number(item_num),
              last: Number(last_num),
              dec: "获得-" + languageConfig.act_type[job_data.type],
              roleid: user_data.id
            }, user_data)
          delete sDate.id;
          delete sDate.userid;

          await this.itemlog(sDate);
        }
      }

    }

    if (job_data.decitem) {
      let items = job_data.decitem;
      for (const key in items) {
        if (Object.prototype.hasOwnProperty.call(items, key)) {

          if (key.indexOf(gameConst.log_itemNumTag) !== -1) { continue; }

          const item_num = items[key];
          const last_num = items[gameConst.log_itemNumTag + key];
          let sDate = Object.assign(
            {
              logtime: job_data.logtime,
              type: job_data.type,
              itemid: Number(key),
              change: Number(item_num) * -1,
              last: Number(last_num),
              dec: "删除-" + languageConfig.act_type[job_data.type],
              roleid: user_data.id
            }, user_data)
          delete sDate.id;
          delete sDate.userid;

          await this.itemlog(sDate);
        }
      }
    }

    if (job_data.addEquip) {
      let equips = job_data.addEquip;
      for (const eid in equips) {
        if (Object.prototype.hasOwnProperty.call(equips, eid)) {
          const entity: EquipEntity = equips[eid];

          let sDate = Object.assign(
            {
              logtime: job_data.logtime,
              type: job_data.type,
              roleid: user_data.id,
              eid: eid,
              equipid: Number(entity.id),
              entity: entity,
              num: 1,
              dec: "获得-" + languageConfig.act_type[job_data.type]
            }, user_data)

          delete sDate.id;
          delete sDate.userid;

          await this.equiplog(sDate);
        }
      }

    }

    if (job_data.decEquipInfo) {
      let equips = job_data.decEquipInfo;
      for (const eid in equips) {
        if (Object.prototype.hasOwnProperty.call(equips, eid)) {

          const entity: EquipEntity = equips[eid];
          let sDate = Object.assign(
            {
              logtime: job_data.logtime,
              type: job_data.type,
              roleid: user_data.id,
              eid: eid,
              equipid: Number(entity.id),
              entity: entity,
              num: -1,
              dec: "删除-" + languageConfig.act_type[job_data.type]
            }, user_data)

          delete sDate.id;
          delete sDate.userid;

          await this.equiplog(sDate);
        }
      }
    }

    //Logger.log(`handleLog completed ${Date.now() - now}ms`);
  }

  async loginlog(data: log_login) {

    //const now = Date.now();
    //Logger.debug('log_login data:', data);
    await this.gameLogDB.log_login.create(
      {
        data: data
      }
    )
    //console.log(`${Date.now() - now}ms`)
  }

  async itemlog(data: log_item) {
    //const now = Date.now();
    //Logger.debug('itemlog data:', data);
    await this.gameLogDB.log_item.create(
      {
        data: data
      }
    )
    //console.log(`${Date.now() - now}ms`)
  }

  async equiplog(data: log_equip) {
    //const now = Date.now();
    //Logger.debug('equiplog data:', data);
    await this.gameLogDB.log_equip.create(
      {
        data: data
      }
    )
    //console.log(`${Date.now() - now}ms`)
  }

  async gamesyslog(data: log_gamesys) {
    //const now = Date.now();
    //Logger.debug('gamesyslog data:', data);
    await this.gameLogDB.log_gamesys.create(
      {
        data: data
      }
    )
    //console.log(`${Date.now() - now}ms`)
  }


  @Cron(CronExpression.EVERY_DAY_AT_1AM)
  async handleCron() {

    if (process.env.AUTO_DELTE_LOG == undefined || process.env.AUTO_DELTE_LOG !== "TRUE") {
      return;
    }

    let log_str = []
    log_str.push("开始检测-删除过期日志");

    let out_days = Number(process.env.LOG_TIMEOUT);

    log_str.push(`过期【${out_days}】天 开始删除`);
    if (out_days === undefined) { return; };

    let curtime = cTools.newDate();
    curtime.setHours(0, 0, 0, 0);
    curtime.setHours(curtime.getHours() - (out_days - 1) * 24);
    log_str.push(`过期时间：`);
    log_str.push(curtime);

    const now = Date.now();
    const sub_now1 = Date.now();
    let rdata1 = await this.gameLogDB.log_login.deleteMany(
      {
        where: {
          logtime: {
            lt: curtime,
          }
        }
      }
    )
    log_str.push(`删除 log_login 表信息：`);
    log_str.push(rdata1);
    log_str.push(`耗时：${Date.now() - sub_now1}ms`)

    const sub_now2 = Date.now();
    let rdata2 = await this.gameLogDB.log_gamesys.deleteMany(
      {
        where: {
          logtime: {
            lt: curtime,
          }
        }
      }
    )
    log_str.push(`删除 log_gamesys 表信息：`);
    log_str.push(rdata2);
    log_str.push(`耗时：${Date.now() - sub_now2}ms`)

    const sub_now3 = Date.now();
    let rdata3 = await this.gameLogDB.log_item.deleteMany(
      {
        where: {
          logtime: {
            lt: curtime,
          }
        }
      }
    )
    log_str.push(`删除 log_item 表信息：`);
    log_str.push(rdata3);
    log_str.push(`耗时：${Date.now() - sub_now3}ms`)

    const sub_now4 = Date.now();
    let rdata4 = await this.gameLogDB.log_equip.deleteMany(
      {
        where: {
          logtime: {
            lt: curtime,
          }
        }
      }
    )
    log_str.push(`删除 log_equip 表信息：`);
    log_str.push(rdata4);
    log_str.push(`耗时：${Date.now() - sub_now4}ms`)


    const sub_now5 = Date.now();
    let rdata5 = await this.gameLogDB.log_chat.deleteMany(
      {
        where: {
          createdAt: {
            lt: curtime,
          }
        }
      }
    )
    log_str.push(`删除 log_chat 表信息：`);
    log_str.push(rdata5);
    log_str.push(`耗时：${Date.now() - sub_now5}ms`)

    log_str.push(`总耗时：${Date.now() - now}ms`)

    //Logger.log(log_str);
  }
}
