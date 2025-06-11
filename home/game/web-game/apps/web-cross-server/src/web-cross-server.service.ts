import { Body, Injectable, Request } from '@nestjs/common';
import { BECreateCrossServerDto, BEDeleteCrossServerDto } from 'apps/web-backend/src/backend-system/games-mgr/dto/games-mgr.dto';
import { REMsg } from 'apps/web-game/src/game-data/entity/msg.entity';
import { GameCacheService } from 'apps/web-game/src/game-lib/gamecache/gamecache.service';
import { getCross_ArenaInfo_RKey, getCross_ArenaRank_RKey, getCross_ServerInfo_RKey } from './common/redis-key';
import { PrismaCrossDBService } from './datadb/prisma.cross.service';
import { ServerInfo } from '@prisma/client4';
import { cTools } from 'apps/web-game/src/game-lib/tools';
import { languageConfig } from 'apps/web-game/src/config/language/language';
import { EActType, EGameRankType } from 'apps/web-game/src/config/game-enum';
import { CRServerEntity } from './entity/cross-server.entity';
import { ArenaServerInfo } from 'apps/web-game/src/game-data/entity/arena.entity';
import { Logger } from 'apps/web-game/src/game-lib/log4js';
import { GameDataService, getAddSRInfoKey } from 'apps/web-game/src/game-data/gamedata.service';
import { CrossRankEntity, RankInfoEntity } from 'apps/web-game/src/game-data/entity/rank.entity';
import { BECrossServerInfo } from 'apps/web-backend/src/entity/game.entity';
import { Cron, CronExpression } from '@nestjs/schedule';
import { TableGameConfig } from 'apps/web-game/src/config/gameTable/TableGameConfig';


const SAVE_SERVERINFO_TIME = 1 * 60 * 1000;
@Injectable()
export class WebCrossServerService {
  // getHello(): string {
  //   return 'Hello World!';
  // }
  private gameCacheService: GameCacheService;
  private allCrossServerIds: number[];
  private saveServer_node_idx: number;
  private save_severinfo_time: any;
  private is_close: boolean = false;
  constructor(
    private readonly prismaCrossDBService: PrismaCrossDBService,
    private readonly gameDataService: GameDataService,
  ) {
    this.gameCacheService = this.gameDataService.getGameCacheService();
    this.saveServer_node_idx = 0;
    this.save_severinfo_time = {};
    this.allCrossServerIds = [];
  }

  async initCrossServer(crossServerIds?: number[]) {

    let all_server_info: ServerInfo[];
    let is_app_start = false;
    if (!crossServerIds) {
      all_server_info = await this.prismaCrossDBService.serverInfo.findMany({
        where: {
          nodeid: cTools.getDataNodeId()
        }
      })
      is_app_start = true;
    }
    else {
      all_server_info = await this.prismaCrossDBService.serverInfo.findMany({
        where: {
          nodeid: cTools.getDataNodeId(),
          crossServerid: {
            in: crossServerIds
          }
        }
      })
    }



    for (let index = 0; index < all_server_info.length; index++) {
      const element = all_server_info[index];
      let info: CRServerEntity = <any>element.info;
      let server_info: CRServerEntity = Object.assign({}, <any>element.info);
      //删除排行榜系统信息 单独存
      info.arenaData = undefined

      await this.gameCacheService.setJSON(getCross_ServerInfo_RKey(element.crossServerid), element);

      await this.gameCacheService.setJSON(getCross_ArenaInfo_RKey(element.crossServerid), server_info.arenaData);

      if (is_app_start) {
        this.allCrossServerIds.push(element.crossServerid);
      }
    }

    //初始化排行榜
    await this.initCrossSeverRank(this.allCrossServerIds);

    //初始化聊天

    console.log("initCrossServer  allCrossServerIds:", this.allCrossServerIds);
  }

  async createCrossServerMysqlData(crossServerId: number) {

    let time = cTools.newSaveLocalDate();
    let server_info: CRServerEntity = {
      arenaData: new ArenaServerInfo()
    }
    await this.prismaCrossDBService.serverInfo.create(
      {
        data: {
          crossServerid: crossServerId,
          info: <any>server_info,
          nodeid: cTools.getDataNodeId(),
          createdAt: time,
          updatedAt: time
        }
      }
    )

    await this.initCrossServer([crossServerId]);
  }

  async createCrossServer(@Request() req: any, @Body() beCreateCrossServerDto: BECreateCrossServerDto) {

    let reMsg = new REMsg();

    let server_info = await this.gameCacheService.getJSON(getCross_ServerInfo_RKey(beCreateCrossServerDto.crossServerId));

    if (server_info) {
      reMsg.msg = "跨服已存在";
      return reMsg;
    }

    let ret = await this.prismaCrossDBService.serverInfo.findMany({
      where: {
        crossServerid: beCreateCrossServerDto.crossServerId
      }
    });

    if (ret && ret.length > 0) {
      reMsg.msg = "跨服已经存在";
      return reMsg;
    }

    console.log("createCrossServer 111 allCrossServerIds:", this.allCrossServerIds);
    if (!this.allCrossServerIds.includes(beCreateCrossServerDto.crossServerId)) {
      this.allCrossServerIds.push(beCreateCrossServerDto.crossServerId);
    }
    console.log("createCrossServer 222 allCrossServerIds:", this.allCrossServerIds);

    await this.createCrossServerMysqlData(beCreateCrossServerDto.crossServerId);


    languageConfig.setActTypeSuccess(EActType.BE_CREATE_CROSS_SERVER, reMsg);
    return reMsg;
  }

  async deleteCrossServer(@Request() req: any, @Body() beDeleteCrossServerDto: BEDeleteCrossServerDto) {
    let reMsg = new REMsg();

    let server_info = await this.gameCacheService.getJSON(getCross_ServerInfo_RKey(beDeleteCrossServerDto.crossServerId));

    if (!server_info) {
      reMsg.msg = "跨服不存在";
      return reMsg;
    }

    console.log("deleteCrossServer 111 allCrossServerIds:", this.allCrossServerIds);
    let index = this.allCrossServerIds.indexOf(beDeleteCrossServerDto.crossServerId);
    if (index !== -1) {
      this.allCrossServerIds.splice(index, 1);
    }
    console.log("deleteCrossServer 222 allCrossServerIds:", this.allCrossServerIds);

    await this.onDestroyCrossMysql([beDeleteCrossServerDto.crossServerId]);


    languageConfig.setActTypeSuccess(EActType.BE_DELETE_CROSS_SERVER, reMsg);
    return reMsg;
  }

  async onSaveCrossMysql(crossServerIds: number[]) {

    if (!crossServerIds || crossServerIds.length == 0) {
      return;
    }

    let update_time = cTools.newSaveLocalDate();
    for (let index = 0; index < crossServerIds.length; index++) {
      const cross_serverid = crossServerIds[index];

      let cross_server_info: ServerInfo = await this.gameCacheService.getJSON(getCross_ServerInfo_RKey(cross_serverid));

      if (!cross_server_info) {
        Logger.error(`onSaveCrossMysql cross_server_info is null cross_serverid:${cross_serverid}`);
        continue;
      }


      let cross_arnea = await this.gameCacheService.getJSON(getCross_ArenaInfo_RKey(cross_serverid));
      let server_info = <CRServerEntity><unknown>cross_server_info.info
      server_info.arenaData = cross_arnea;

      let cur_ret = await this.prismaCrossDBService.serverInfo.update({
        where: {
          id: cross_server_info.id
        },
        data: {
          info: cross_server_info.info,
          updatedAt: update_time
        }
      })

      await this.saveCrossSeverRank(cross_serverid);
    }



  }

  /**
  * 保存服务器排行榜
  * @param cross_serverid 
  */
  async saveCrossSeverRank(cross_serverid: number) {
    // await this.saveSeverLRank(serverid);
    await this.saveCrossSeverRankByType(cross_serverid, EGameRankType.CROSS_ARENA);

  }

  /**
   * 根据数据保存服务器排行榜
   * @param cross_serverid 
   * @param eGameRankType 
   */
  async saveCrossSeverRankByType(cross_serverid: number, eGameRankType: EGameRankType) {

    let cur_rank = await this.gameDataService.getServerRankByType(cross_serverid, eGameRankType);
    if (!cur_rank) {
      console.error(`saveCrossSeverRankByType cur_rank is null cross_serverid:${cross_serverid} ranktype:${eGameRankType}`);
      return;
    }
    let is_update = false;
    for (const key in cur_rank) {
      if (Object.prototype.hasOwnProperty.call(cur_rank, key)) {
        let element = cur_rank[key];
        // element.info = { n: element.info?.n, r: element.info?.r }
        if (element.save) {
          is_update = true;
          delete element.save;
          let save_data = Object.assign({ updatedAt: cTools.newSaveLocalDate(), crossServerid: cross_serverid }, element);
          if (element.id) {
            await this.prismaCrossDBService.gameRank.update({
              where: { id: element.id },
              data: <any>save_data
            });
          }
          else {
            let ret = await this.prismaCrossDBService.gameRank.create({
              data: <any>save_data
            });
            element.id = ret.id;
          }
        }
      }
    }

    if (is_update && cur_rank && Object.keys(cur_rank).length > 0) {
      await this.gameDataService.updateServerRankByType(cross_serverid, cur_rank, eGameRankType);
    }

  }


  /**
   * 关闭APP 保持数据 销毁缓存
   * @param isSave 
   * @returns 
   */
  async onDestroyCross(isSave: boolean = true) {

    let crossServerIds = this.allCrossServerIds;
    if (!crossServerIds || crossServerIds.length == 0) {
      return;
    }

    if (isSave) {
      await this.onSaveCrossMysql(crossServerIds);
    }

    await this.onDestroyCrossRedis(crossServerIds);
  }


  async onDestroyCrossRedis(crossServerIds: number[]) {

    if (!crossServerIds || crossServerIds.length == 0) {
      return;
    }

    for (let index = 0; index < crossServerIds.length; index++) {
      let crossServerId = crossServerIds[index];
      await this.gameCacheService.del(getCross_ServerInfo_RKey(crossServerId));
      await this.gameCacheService.del(getCross_ArenaInfo_RKey(crossServerId));
      await this.gameCacheService.del(getCross_ArenaRank_RKey(crossServerId));
    }
  }


  async onDestroyCrossMysql(crossServerIds: number[]) {

    if (!crossServerIds || crossServerIds.length == 0) {
      return;
    }

    await this.onDestroyCrossRedis(crossServerIds);

    let serverQueries: string | any[] = [];

    let cur_ret = this.prismaCrossDBService.serverInfo.deleteMany({
      where: {
        crossServerid: {
          in: crossServerIds
        }
      }
    })
    serverQueries.push(cur_ret);

    cur_ret = this.prismaCrossDBService.chatLog.deleteMany({
      where: {
        crossServerid: {
          in: crossServerIds
        }
      }
    })
    serverQueries.push(cur_ret);

    cur_ret = this.prismaCrossDBService.gameRank.deleteMany({
      where: {
        crossServerid: {
          in: crossServerIds
        }
      }
    })
    serverQueries.push(cur_ret);



    let ret = await this.prismaCrossDBService.$transaction(serverQueries);
    console.log("ret:", ret);
  }

  /**==============================跨服排行榜-start=================================*/

  async initCrossServerEmptRank(cross_serverid: number) {
    await this.gameDataService.updateServerRankByType(cross_serverid, {}, EGameRankType.CROSS_ARENA);
  }

  /**初始化 跨服排行榜 */
  async initCrossSeverRank(cross_serverids: number[]) {

    let server_rank = await this.findCrossRanks(cross_serverids);

    if (!server_rank) {
      Logger.error(`initSeverRank server_rank is null serverids:${cross_serverids}`);
      return;
    }

    if (server_rank.length === 0) {
      //无数据
      for (let index = 0; index < cross_serverids.length; index++) {
        const cur_cross_serverid = cross_serverids[index];
        await this.initCrossServerEmptRank(cur_cross_serverid);
      }
      return;
    }

    //排行榜分跨服分类处理
    let rank_by_crossid_type = {};
    for (let index = 0; index < server_rank.length; index++) {
      const element = server_rank[index];
      rank_by_crossid_type[element.crossServerid] = rank_by_crossid_type[element.crossServerid] || {};
      rank_by_crossid_type[element.crossServerid][element.type] = rank_by_crossid_type[element.crossServerid][element.type] || [];
      let data: CrossRankEntity = {
        id: element.id,
        type: element.type,
        roleid: element.roleid,
        crossServerid: element.crossServerid,
        serverid: element.serverid,
        val: element.val,
        info: element.info
      }
      rank_by_crossid_type[element.crossServerid][element.type].push(data);
    }

    //排行榜上限处理
    let all_delete_ids = [];
    for (const cross_serverid in rank_by_crossid_type) {
      if (Object.prototype.hasOwnProperty.call(rank_by_crossid_type, cross_serverid)) {
        const all_rank_ary = rank_by_crossid_type[cross_serverid];

        for (let rankType = 0; rankType < all_rank_ary.length; rankType++) {
          let rank_ary: CrossRankEntity[] = all_rank_ary[rankType];

          rank_ary.sort((a: CrossRankEntity, b: CrossRankEntity) => {
            if (a.val > b.val) {
              return -1; // 如果 a.val 大于 b.val，则 a 排在 b 前面  
            } else if (a.val < b.val) {
              return 1; // 如果 a.val 小于 b.val，则 a 排在 b 后面  
            } else {
              return 0; // 如果 a.val 等于 b.val，则位置不变  
            }
          });

          let rank_max = this.gameDataService.getServerRankMax(rankType);

          if (rank_ary.length > rank_max) {
            let new_rank = rank_ary.slice(rank_max - 1, rank_ary.length);
            let delete_rank = rank_ary.slice(0, rank_max - 1);

            all_rank_ary[rankType] = new_rank;

            let del_ids = delete_rank.map(obj => obj.id);
            all_delete_ids = all_delete_ids.concat(del_ids);
          }

        }

      }
    }

    //删除多余的
    if (all_delete_ids.length > 0) {
      await this.prismaCrossDBService.gameRank.deleteMany(
        {
          where: {
            id: {
              in: all_delete_ids
            }
          }
        }
      )
    }

    //转换格式
    let all_rank_data = {};
    let all_roleids = {};
    for (const cross_serverid in rank_by_crossid_type) {
      if (Object.prototype.hasOwnProperty.call(rank_by_crossid_type, cross_serverid)) {
        const all_rank_ary = rank_by_crossid_type[cross_serverid];
        for (const rankType in all_rank_ary) {
          if (Object.prototype.hasOwnProperty.call(all_rank_ary, rankType)) {
            let rank_ary: CrossRankEntity[] = all_rank_ary[rankType];
            for (let index = 0; index < rank_ary.length; index++) {
              const element = rank_ary[index];
              all_rank_data[element.crossServerid] = all_rank_data[element.crossServerid] || {};
              all_rank_data[element.crossServerid][element.type] = all_rank_data[element.crossServerid][element.type] || {}
              all_rank_data[element.crossServerid][element.type][element.roleid] = element;
              all_roleids[element.serverid] = all_roleids[element.serverid] || {};
              all_roleids[element.serverid][element.roleid] = 1;
            }
          }
        }

      }
    }

    //设置跨服排行榜缓存数据
    for (let crossServerid of cross_serverids) {
      if (Object.prototype.hasOwnProperty.call(all_rank_data, crossServerid)) {
        //每个跨服数据
        const all_rank = all_rank_data[crossServerid];
        await this.initCrossServerEmptRank(crossServerid);

        if (all_rank) {
          for (const rankType in all_rank) {
            if (Object.prototype.hasOwnProperty.call(all_rank, rankType)) {
              //每个类型数据
              const rank_datas = all_rank[rankType];
              await this.gameDataService.updateServerRankByType(Number(crossServerid), rank_datas, Number(rankType));
            }
          }
        }
      }
    }

    //设置需要添加角色数据中心的数据
    for (const serverid in all_roleids) {
      if (Object.prototype.hasOwnProperty.call(all_roleids, serverid)) {
        const rols_objs = all_roleids[serverid];
        let cross_rols_ids: string[] = Object.keys(rols_objs).map(String);
        let cur_roles: string[] = await this.gameCacheService.getJSON(getAddSRInfoKey(Number(serverid)));
        if (!cur_roles) {
          cur_roles = [];
        }
        cur_roles = cur_roles.concat(cross_rols_ids);
        await this.gameCacheService.setJSON(getAddSRInfoKey(Number(serverid)), cur_roles);
      }
    }

  }

  async findCrossRanks(cross_serverids: number[], EGtype: EGameRankType = undefined) {
    let whereCondition = {
      crossServerid: {
        in: cross_serverids
      },
    };
    let orderByCondition = []
    if (EGtype != undefined) {
      whereCondition = Object.assign(
        whereCondition, {
        type: EGtype
      }
      )
      orderByCondition = [
        {
          val: `desc`
        }
      ]
    }
    let rank = await this.prismaCrossDBService.gameRank.findMany(
      {
        where: whereCondition,
        orderBy: orderByCondition,
        // take: gameConst.arena_rank_exmax,
        select: {
          id: true,
          type: true,
          roleid: true,
          crossServerid: true,
          serverid: true,
          val: true,
          info: true
        }
      }
    )
    return rank;
  }

  /**==============================跨服排行榜-end================================== */

  checkIsCanUpdate() {

    if (this.is_close) {
      //tthis.logger.debug("===保存全服数据 节点关闭中....");
      return false;
    }


    if (!this.allCrossServerIds || this.allCrossServerIds.length == 0) {
      return false
    }

    return true;
  }

  //固定时间保存服务器全局数据
  //EVERY_30_SECONDS
  @Cron(CronExpression.EVERY_5_SECONDS)
  async handleCronServerData() {

    if (!this.checkIsCanUpdate()) { return; }
    //tthis.logger.debug("===EVERY_30_SECONDS 保存全服数据 start");
    const now = Date.now();
    let cur_cross_serverid = this.allCrossServerIds[this.saveServer_node_idx];
    // this.logger.debug("cur_cross_serverid:", cur_cross_serverid);

    this.saveServer_node_idx++;

    if (this.saveServer_node_idx >= this.allCrossServerIds.length) {
      this.saveServer_node_idx = 0;
    };


    this.save_severinfo_time = this.save_severinfo_time || {}
    this.save_severinfo_time[cur_cross_serverid] = this.save_severinfo_time[cur_cross_serverid] || 0;

    if (now - this.save_severinfo_time[cur_cross_serverid] < SAVE_SERVERINFO_TIME) {
      //this.logger.debug(`检测][${cur_cross_serverid}服] 间隔时间不足，间隔多少秒：${(now - this.save_severinfo_time[cur_cross_serverid]) / 1000}`);
      return;
    }

    //this.logger.debug(`===[检测][${cur_cross_serverid}服]保存全服数据 start ===`);

    this.save_severinfo_time[cur_cross_serverid] = now;

    await this.onSaveCrossMysql([cur_cross_serverid]);

    //tthis.logger.debug(`===保存全服数据 end ... ${Date.now() - now}ms`)
  }


  /**
   * 初始化跨服竞技场
   * @param cross_serverid
   */
  async initCrossArena(cross_serverid: number) {

    // let updatetime = cTools.newSaveLocalDate();
    // await this.prismaCrossDBService.gameRank.updateMany({
    //   where: {
    //     crossServerid: cross_serverid,
    //     type: EGameRankType.CROSS_ARENA
    //   },
    //   data: {
    //     val: -999,
    //     updatedAt: updatetime,
    //   },
    // });
    await this.prismaCrossDBService.gameRank.deleteMany(
      {
        where: {
          crossServerid: cross_serverid,
          type: EGameRankType.CROSS_ARENA
        }
      }
    );

  }


  //0点重置跨服服务器逻辑
  async resetCrossServer(cross_serverid: number) {

    //重置逻辑

    //赛季重置逻辑跨服竞技场
    let cross_ArenaInfo: ArenaServerInfo = await this.gameCacheService.getJSON(getCross_ArenaInfo_RKey(cross_serverid));
    if (cross_ArenaInfo) {
      //赛季判断  
      let arenaData = cross_ArenaInfo;
      let cur_date = new Date();
      if (cur_date.getDay() == TableGameConfig.arena_season_days_kf) {
        //赛季结束
        arenaData.sTime = cTools.newLocalDate0String();
        arenaData.season++;
        let SveRank = await this.gameCacheService.getJSON(getCross_ArenaRank_RKey(cross_serverid));
        arenaData.lrank = Object.keys(SveRank);
        await this.gameCacheService.setJSON(getCross_ArenaRank_RKey(cross_serverid), {});
        await this.initCrossArena(cross_serverid);

        await this.gameCacheService.setJSON(getCross_ArenaInfo_RKey(cross_serverid), cross_ArenaInfo);
      }
    }


  }

  //零点重置服务器
  @Cron("0 0 0 * * *",)
  async handleCronServer() {


    if (!this.checkIsCanUpdate()) { return; }

    //let cur_date = new Date();
    //tthis.logger.debug(`=========cur_date:${cur_date}`);

    //const now = Date.now();

    for (let index = 0; index < this.allCrossServerIds.length; index++) {
      const cross_serverid = this.allCrossServerIds[index];
      //this.logger.debug(`cross_serverid:${cross_serverid}`);
      await this.resetCrossServer(cross_serverid);
    }

    //tthis.logger.debug(`handleCronServer... ${Date.now() - now}ms`);
  }
}
