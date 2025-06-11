import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { GameDataService, getAddSRInfoKey } from 'apps/web-game/src/game-data/gamedata.service';
import { Logger as Logger4 } from 'apps/web-game/src/game-lib/log4js';
import { cTools } from 'apps/web-game/src/game-lib/tools';

export interface ISaveData {
  roleid: string,
  serverid: number,
  time: number
}

const SAVE_NUM = 30;

//5*60*1000;
const SAVE_TIME = 1 * 90 * 1000;

const SAVE_SERVERINFO_TIME = 1 * 60 * 1000;

@Injectable()
export class WebSaveDataService {

  private readonly logger = new Logger(WebSaveDataService.name);
  private saveDataObj: any;
  private saveDataList: ISaveData[];
  private saverole_node_idx: number;
  private saveServer_node_idx: number;
  private save_time: any;
  private is_close: boolean = false;
  private serverIds: number[];
  private save_severinfo_time: any;
  constructor(
    private readonly gameDataService: GameDataService
  ) {
    this.saveDataObj = {}
    this.saveDataList = [];
    this.saverole_node_idx = 0;
    this.saveServer_node_idx = 0;
    this.save_time = {};
    this.serverIds = [];
    this.save_severinfo_time = {};
  }

  async initDate(serverIds: number[]) {
    this.serverIds = serverIds;
    this.gameDataService.initMergeServerInfo();
  }

  async onDestroy() {
    this.is_close = true;
    await this.updateServerIds();
    Logger4.log(`关服清理服务器列表:${this.serverIds}`);
    await this.gameDataService.onDestroy(this.serverIds);
    await this.onDestroyAllRoleData(this.serverIds);
  }

  checkIsCanUpdate() {

    if (this.is_close) {
      //tthis.logger.debug("===保存全服数据 节点关闭中....");
      return false;
    }


    if (!this.serverIds || this.serverIds.length == 0) {
      return false
    }

    return true;
  }

  async updateServerIds() {

    let new_serveridx = await this.gameDataService.getDataServerIds();
    if (!new_serveridx || new_serveridx.length == 0) {
      this.logger.error("new_serveridx is null");
      return
    }
    //this.logger.log(`new_serveridx is ${new_serveridx}`);
    this.serverIds = new_serveridx;
  }


  /**
   * 
   * @param isAll 是否强制保存全部
   * @returns 
   */
  async saveRoleDataByList(dateList: ISaveData[], isAll: boolean = false) {

    if (!dateList || dateList.length == 0) { return; }

    let length = Math.min(SAVE_NUM, dateList.length);

    //关闭都时候要保存所有
    if (isAll) {
      length = dateList.length;
    }
    const now = Date.now();
    for (let index = 0; index < length; index++) {
      const element = dateList.shift();
      //this.logger.debug(`save role:${element.roleid} serverid:${element.serverid}`);
      await this.gameDataService.saveRoleData({ id: element.roleid, serverid: element.serverid });
      delete this.saveDataObj[element.roleid];
      if (dateList.length <= 0) { break }
    }
    //this.logger.debug(`---[执行]保存玩家数据... ${Date.now() - now}ms  end`);
  }

  /**
   * 根据服务器ID强制保存所有 需要保存所有角色 并销毁所有在线角色缓存数据 
   * @param serverIds 
   */
  async onDestroyAllRoleData(serverIds: number[]) {

    //整合所有需要强制保存的角色数据
    let dateList: ISaveData[] = [];
    for (let index = 0; index < serverIds.length; index++) {
      const serverid = serverIds[index];
      let cur_list = await this.updateSaveListByID(serverid);
      if (cur_list && cur_list.length > 0) {
        dateList = dateList.concat(cur_list);
      }
    }
    await this.saveRoleDataByList(dateList, true);

    for (let index = 0; index < serverIds.length; index++) {
      const serverid = serverIds[index];
      await this.gameDataService.onDestroyOnlineRole(serverid);
    }
  }

  async updateSaveListByID(serverid: number) {
    var var_data: any
    var_data = await this.gameDataService.getUpdateDate(serverid);

    if (!var_data) {
      //this.logger.debug("没有需要保存的数据 cur_serverid：", serverid);
      return;
    };

    await this.gameDataService.clearUpdateDate(serverid);

    if (Object.keys(this.saveDataObj).length <= 0) {
      this.saveDataObj = var_data;
    }
    else {
      for (const roleid in var_data) {
        if (Object.prototype.hasOwnProperty.call(var_data, roleid)) {
          const time = var_data[roleid];
          if (!this.saveDataObj[roleid]) {
            this.saveDataObj[roleid] = time;
          }
        }
      }

    }

    let dateList = [];
    for (const roleId in this.saveDataObj) {
      if (Object.prototype.hasOwnProperty.call(this.saveDataObj, roleId)) {
        let role_save_time = this.saveDataObj[roleId];
        dateList.push({ roleid: roleId, serverid: serverid, time: role_save_time });
      }
    }

    //按时间排序
    dateList.sort(function (a, b) {

      if (!a || !a.time) { return 1; }

      if (!b || !b.time) { return -1; }

      return a.time - b.time;
    })

    return dateList;
  }

  /**
 * 同步中心角色数据
 */
  async updateSRInfo() {

    let gameCacheService = this.gameDataService.getGameCacheService();

    for (let index = 0; index < this.serverIds.length; index++) {
      const server_id = this.serverIds[index];
      //this.logger.debug(`server_id:${server_id}`);
      let role_ids = await gameCacheService.getJSON(getAddSRInfoKey(server_id));
      if (!role_ids) { continue; }

      await gameCacheService.del(getAddSRInfoKey(server_id));
      await this.gameDataService.loadSeverRoleInfo(server_id, role_ids);
    }
  }

  /**
   * 每间隔一段时间整理保存角色列表
   * @returns 
   */
  @Cron(CronExpression.EVERY_5_SECONDS)
  async handleCron() {

    if (!this.checkIsCanUpdate()) { return; }

    //临时策略 加载跨服那边需要添加的角色数据
    await this.updateSRInfo();

    //this.logger.debug("===保存玩家数据 10 秒获取一次需要存档的数据队列");
    let cur_serverid = this.serverIds[this.saverole_node_idx];
    // this.logger.debug("cur_serverid:", cur_serverid);

    this.saverole_node_idx++;

    if (this.saverole_node_idx >= this.serverIds.length) {
      this.saverole_node_idx = 0;
    };

    const now = Date.now();

    this.save_time = this.save_time || {}
    this.save_time[cur_serverid] = this.save_time[cur_serverid] || 0;

    if (now - this.save_time[cur_serverid] < SAVE_TIME) {
      //this.logger.debug(`间隔时间不足，间隔多少秒：${(now - this.save_time[cur_serverid]) / 1000}`);
      return;
    }

    //this.logger.debug(`===[检测][${cur_serverid}服]玩家数据列表 start ===`);

    this.save_time[cur_serverid] = now;
    await this.gameDataService.checkOnlineRole(cur_serverid);
    this.saveDataList = [];
    this.saveDataList = await this.updateSaveListByID(cur_serverid);

    //tthis.logger.debug(`saveDataList length:${this.saveDataList.length}`);
    //tthis.logger.debug(`[检测]耗时... ${Date.now() - now}ms`);
    //tthis.logger.debug(`===[检测][${cur_serverid}服]玩家数据列表 end ===========`);

  }



  //每秒执行 
  @Cron(CronExpression.EVERY_SECOND)
  async handleCronSaveRole() {

    //保存角色列表
    if (!this.saveDataList || this.saveDataList.length == 0) {
      return;
    }

    if (this.is_close) {
      //this.logger.debug("===保存玩家数据 节点关闭中....");
      return;
    }

    //tthis.logger.debug(`---[执行]保存玩家数据... size:${this.saveDataList.length} start`)
    //this.logger.debug(this.saveDataList);

    const now = Date.now();

    await this.saveRoleDataByList(this.saveDataList);

    //tthis.logger.debug(`---[执行]保存玩家数据... ${Date.now() - now}ms  end`);
  }

  //零点重置服务器
  @Cron("0 0 0 * * *",)
  async handleCronServer() {


    if (!this.checkIsCanUpdate()) { return; }

    //let cur_date = new Date();
    //tthis.logger.debug(`=========cur_date:${cur_date}`);

    //const now = Date.now();
    await this.updateServerIds();
    for (let index = 0; index < this.serverIds.length; index++) {
      const server_id = this.serverIds[index];
      //this.logger.debug(`server_id:${server_id}`);
      await this.gameDataService.resetServer(server_id);
    }

    //tthis.logger.debug(`handleCronServer... ${Date.now() - now}ms`);
  }

  //固定时间保存服务器全局数据
  //EVERY_30_SECONDS
  @Cron(CronExpression.EVERY_30_SECONDS)
  async handleCronServerData() {

    await this.updateServerIds();

    if (!this.checkIsCanUpdate()) { return; }

    //tthis.logger.debug("===EVERY_30_SECONDS 保存全服数据 start");
    const now = Date.now();


    let cur_serverid = this.serverIds[this.saveServer_node_idx];
    //t this.logger.debug("cur_serverid:", cur_serverid);

    this.saveServer_node_idx++;

    if (this.saveServer_node_idx >= this.serverIds.length) {
      this.saveServer_node_idx = 0;
    };


    this.save_severinfo_time = this.save_severinfo_time || {}
    this.save_severinfo_time[cur_serverid] = this.save_severinfo_time[cur_serverid] || 0;

    if (now - this.save_severinfo_time[cur_serverid] < SAVE_SERVERINFO_TIME) {
      //this.logger.debug(`检测][${cur_serverid}服] 间隔时间不足，间隔多少秒：${(now - this.save_severinfo_time[cur_serverid]) / 1000}`);
      return;
    }

    //this.logger.debug(`===[检测][${cur_serverid}服]保存全服数据 start ===`);

    this.save_severinfo_time[cur_serverid] = now;

    await this.gameDataService.saveServerData(cur_serverid);

    //tthis.logger.debug(`===保存全服数据 end ... ${Date.now() - now}ms`)
  }

}
