import { Injectable, Request } from '@nestjs/common';
import { EActType } from '../../config/game-enum';
import { TableGameConfig } from '../../config/gameTable/TableGameConfig';
import { TableGameItem } from '../../config/gameTable/TableGameItem';
import { TableGameLevels } from '../../config/gameTable/TableGameLevels';
import { TableGameSys } from '../../config/gameTable/TableGameSys';
import { TablePrivilegeType } from '../../config/gameTable/TablePrivilegeType';
import { languageConfig } from '../../config/language/language';
import { DropDataEntity } from '../../game-data/entity/drop.entity';
import { HerosRecord } from '../../game-data/entity/hero.entity';
import { RESGetQuickTimeAwardMsg, RESGetTimeAwardMsg } from '../../game-data/entity/msg.entity';
import { RoleInfoEntity, RoleSubInfoEntity } from '../../game-data/entity/roleinfo.entity';
import { GameDataService, GetRoleALLInfoDto } from '../../game-data/gamedata.service';
import { RoleKeyDto } from '../../game-data/role/dto/role-key.dto';
import { cTools } from '../../game-lib/tools';
import { cpAttrRateVal } from '../fight/fight-attr';
import { cGameCommon, RetRoleALLInfo } from '../game-common';
import { syshero } from '../hero/hero-lvup';
import { cItemBag } from '../item/item-bag';
import { GetQuickTimeAwardDto, GetTimeAwardDto } from './dto/time-award.dto';

@Injectable()
export class TimeAwardService {

  constructor(
    private readonly gameDataService: GameDataService,
  ) {

  }

  async getTimeAward(@Request() req: any, getTimeAwardDto: GetTimeAwardDto) {

    let roleKeyDto: RoleKeyDto = { id: req.user.id, serverid: req.user.serverid };

    let reMsg: RESGetTimeAwardMsg = { ok: false, msg: "null" }

    let getRoleALLInfoDto = new GetRoleALLInfoDto(roleKeyDto);
    getRoleALLInfoDto.need_roleInfo = true;
    getRoleALLInfoDto.need_roleHero = true;
    //获取角色信息
    let retRoleALLInfo: RetRoleALLInfo = await this.gameDataService.getRoleAllInfo(getRoleALLInfoDto);
    if (!retRoleALLInfo.isHaveData()) {
      reMsg.msg = retRoleALLInfo.getRetMsg();
      return reMsg;
    }


    if (!cGameCommon.isOpenSystem(retRoleALLInfo, TableGameSys.timeaward)) {
      reMsg.msg = `系统暂未开放`;
      return reMsg;
    }


    let cur_time = cTools.newDate();
    let last_startTime = new Date(retRoleALLInfo.roleSubInfo.timeAward.startTime);
    let dif_minutes = cTools.GetDateMinutesDiff(last_startTime, cur_time);

    if (dif_minutes < 1) {
      reMsg.msg = "超过1分钟才能领取";
      return reMsg;
    }


    dif_minutes = Math.min(dif_minutes, TableGameConfig.time_award_max * 60);
    dif_minutes = Math.floor(dif_minutes);
    if (!TableGameLevels.checkHave(retRoleALLInfo.roleInfo.gamelevels)) {
      reMsg.msg = "TableGameLevels data is null by id:" + retRoleALLInfo.roleInfo.gamelevels;
      return reMsg;
    }

    let gamelevels_table = new TableGameLevels(retRoleALLInfo.roleInfo.gamelevels);
    let total_drops: DropDataEntity[] = [];
    //60秒
    let multiplier1 = Math.floor(dif_minutes);
    let ret_drop1: DropDataEntity = await cGameCommon.addItemByDrop(roleKeyDto, gamelevels_table.timedrop1, this.gameDataService, multiplier1);
    if (!ret_drop1) {
      reMsg.msg = "ret_drop data is null by id:" + gamelevels_table.timedrop1;
      return reMsg;
    }
    total_drops.push(ret_drop1);

    //600秒
    let ret_drop2: DropDataEntity;
    if (dif_minutes * 60 >= 600) {
      let multiplier2 = Math.floor(dif_minutes * 60 / 600);
      ret_drop2 = await cGameCommon.addItemByDrop(roleKeyDto, gamelevels_table.timedrop2, this.gameDataService, multiplier2);
    }
    total_drops.push(ret_drop2);

    //3600秒
    let ret_drop3: DropDataEntity;
    if (dif_minutes * 60 >= 3600) {
      let multiplier3 = Math.floor(dif_minutes * 60 / 3600);
      ret_drop3 = await cGameCommon.addItemByDrop(roleKeyDto, gamelevels_table.timedrop3, this.gameDataService, multiplier3);
    }
    total_drops.push(ret_drop3);

    //返回总掉落
    for (let index = 0; index < total_drops.length; index++) {
      const cur_dropDataEntity = total_drops[index];
      cGameCommon.hanleDropMsg(cur_dropDataEntity, reMsg);
    }

    //特权 总加成
    let add_item_bonus = cGameCommon.getPrivilegeAddItemBonus(retRoleALLInfo.roleInfo, TableGameSys.timeaward);
    if (add_item_bonus && Object.keys(add_item_bonus).length > 0 && reMsg.additem && Object.keys(reMsg.additem).length > 0) {
      let total_additem = {};

      for (const itemid in reMsg.additem) {
        if (Object.prototype.hasOwnProperty.call(reMsg.additem, itemid)) {
          const item_num = reMsg.additem[itemid];
          if (add_item_bonus[itemid]) {
            //单个加成
            let cur_addnum = cpAttrRateVal(item_num, add_item_bonus[itemid]);
            total_additem[itemid] = total_additem[itemid] || 0;
            total_additem[itemid] += cur_addnum;
          }
        }
      }

      if (Object.keys(total_additem).length > 0) {
        let dropDataEntity = await cGameCommon.addItem(roleKeyDto, total_additem, this.gameDataService);
        cGameCommon.hanleDropMsg(dropDataEntity, reMsg);
      }
    }

    //经验处理
    let add_exp = multiplier1 * gamelevels_table.time_exp;
    if (add_exp) {
      reMsg.roleAddExp = syshero.leadheroAddExp(retRoleALLInfo, retRoleALLInfo.roleHero, add_exp);
    }
    retRoleALLInfo.roleSubInfo.timeAward.startTime = cTools.newLocalDateString(cur_time);

    if (reMsg.roleAddExp?.newHero || reMsg.roleAddExp?.newActiveHeros) {
      await this.gameDataService.updateRoleHero(roleKeyDto, retRoleALLInfo.roleHero);
    }

    await this.gameDataService.updateRoleInfo(roleKeyDto, retRoleALLInfo.roleInfo);
    await this.gameDataService.expireRoleData(roleKeyDto);

    reMsg.ok = true;
    reMsg.startTime = retRoleALLInfo.roleSubInfo.timeAward.startTime;
    reMsg.srctype = EActType.TIME_AWARD_GET;
    reMsg.msg = languageConfig.actTypeSuccess(reMsg.srctype);

    return reMsg;
  }

  async getQuickTimeAward(@Request() req: any, getQuickTimeAwardDto: GetQuickTimeAwardDto) {

    let roleKeyDto: RoleKeyDto = { id: req.user.id, serverid: req.user.serverid };

    let reMsg: RESGetQuickTimeAwardMsg = new RESGetQuickTimeAwardMsg();

    let getRoleALLInfoDto = new GetRoleALLInfoDto(roleKeyDto);
    getRoleALLInfoDto.need_roleInfo = true;
    getRoleALLInfoDto.need_roleHero = true;
    //获取角色信息
    let retRoleALLInfo: RetRoleALLInfo = await this.gameDataService.getRoleAllInfo(getRoleALLInfoDto);
    if (!retRoleALLInfo.isHaveData()) {
      reMsg.msg = retRoleALLInfo.getRetMsg();
      return reMsg;
    }

    if (!cGameCommon.isOpenSystem(retRoleALLInfo, TableGameSys.timeaward)) {
      reMsg.msg = `系统暂未开放`;
      return reMsg;
    }

    let add_num = cGameCommon.getPrivilegeVal(retRoleALLInfo.roleSubInfo, TableGameSys.timeaward, TablePrivilegeType.timeaward_quickcount);
    if (retRoleALLInfo.roleSubInfo.timeAward.dailyNum + add_num <= 0) {
      reMsg.msg = "剩余次数不够";
      return reMsg;
    }

    let dif_minutes = TableGameConfig.time_award_quickmax * 60;
    dif_minutes = Math.floor(dif_minutes);
    if (!TableGameLevels.checkHave(retRoleALLInfo.roleInfo.gamelevels)) {
      reMsg.msg = "TableGameLevels data is null by id:" + retRoleALLInfo.roleInfo.gamelevels;
      return reMsg;
    }

    let gamelevels_table = new TableGameLevels(retRoleALLInfo.roleInfo.gamelevels);
    let total_drops: DropDataEntity[] = [];
    //60秒
    let multiplier1 = Math.floor(dif_minutes);
    let ret_drop1: DropDataEntity = await cGameCommon.addItemByDrop(roleKeyDto, gamelevels_table.timedrop1, this.gameDataService, multiplier1);
    if (!ret_drop1) {
      reMsg.msg = "ret_drop data is null by id:" + gamelevels_table.timedrop1;
      return reMsg;
    }
    total_drops.push(ret_drop1);

    //600秒
    let ret_drop2: DropDataEntity;
    if (dif_minutes * 60 >= 600) {
      let multiplier2 = Math.floor(dif_minutes * 60 / 600);
      ret_drop2 = await cGameCommon.addItemByDrop(roleKeyDto, gamelevels_table.timedrop2, this.gameDataService, multiplier2);
    }
    total_drops.push(ret_drop2);

    //3600秒
    let ret_drop3: DropDataEntity;
    if (dif_minutes * 60 >= 3600) {
      let multiplier3 = Math.floor(dif_minutes * 60 / 3600);
      ret_drop3 = await cGameCommon.addItemByDrop(roleKeyDto, gamelevels_table.timedrop3, this.gameDataService, multiplier3);
    }
    total_drops.push(ret_drop3);

    //返回总掉落
    for (let index = 0; index < total_drops.length; index++) {
      const cur_dropDataEntity = total_drops[index];
      cGameCommon.hanleDropMsg(cur_dropDataEntity, reMsg);
    }

    retRoleALLInfo.roleSubInfo.timeAward.dailyNum -= 1;

    //经验处理
    let add_exp = multiplier1 * gamelevels_table.time_exp;
    if (add_exp) {
      reMsg.roleAddExp = syshero.leadheroAddExp(retRoleALLInfo, retRoleALLInfo.roleHero, add_exp);
    }


    if (reMsg.roleAddExp?.newHero || reMsg.roleAddExp?.newActiveHeros) {
      await this.gameDataService.updateRoleHero(roleKeyDto, retRoleALLInfo.roleHero);
    }

    await this.gameDataService.updateRoleInfo(roleKeyDto, retRoleALLInfo.roleInfo);

    reMsg.ok = true;
    reMsg.dailyNum = retRoleALLInfo.roleSubInfo.timeAward.dailyNum;
    reMsg.srctype = EActType.TIME_AWARD_GET_QUICK;
    reMsg.msg = languageConfig.actTypeSuccess(reMsg.srctype);
    return reMsg;
  }

  //获取钻石获得奖励界面信息
  async getDiamondAwardInfo(@Request() req: any, getQuickTimeAwardDto: GetQuickTimeAwardDto) {

    let roleKeyDto: RoleKeyDto = { id: req.user.id, serverid: req.user.serverid };

    let reMsg: RESGetQuickTimeAwardMsg = new RESGetQuickTimeAwardMsg();

    let getRoleALLInfoDto = new GetRoleALLInfoDto(roleKeyDto);
    getRoleALLInfoDto.need_roleInfo = true;
    getRoleALLInfoDto.need_roleHero = true;
    getRoleALLInfoDto.need_roleItem = true;
    //获取角色信息
    let retRoleALLInfo: RetRoleALLInfo = await this.gameDataService.getRoleAllInfo(getRoleALLInfoDto);
    if (!retRoleALLInfo.isHaveData()) {
      reMsg.msg = retRoleALLInfo.getRetMsg();
      return reMsg;
    }

    if (!cGameCommon.isOpenSystem(retRoleALLInfo, TableGameSys.timeaward)) {
      reMsg.msg = `系统暂未开放`;
      return reMsg;
    }
    let add_num = cGameCommon.getPrivilegeVal(retRoleALLInfo.roleSubInfo, TableGameSys.timeaward, TablePrivilegeType.timeaward_quickcount);
    const all_count = TableGameConfig.time_award_quicknum + add_num;
    const cur_count = retRoleALLInfo.roleSubInfo.timeAward.dailyNum + add_num;
    const count = all_count - cur_count;
    const cost = TableGameConfig.time_award_skip_cost;
    let costNum = cost[count] || 0;

    reMsg.ok = true;
    reMsg.dailyNum = cur_count;
    reMsg.diamond = costNum;
    reMsg.srctype = EActType.TIME_AWARD_DIAMOND_INFO;
    reMsg.msg = '挂机奖励信息成功'
    return reMsg;
  }
  //钻石获得奖励
  async getDiamondAward(@Request() req: any, getQuickTimeAwardDto: GetQuickTimeAwardDto) {

    let roleKeyDto: RoleKeyDto = { id: req.user.id, serverid: req.user.serverid };

    let reMsg: RESGetQuickTimeAwardMsg = new RESGetQuickTimeAwardMsg();

    let getRoleALLInfoDto = new GetRoleALLInfoDto(roleKeyDto);
    getRoleALLInfoDto.need_roleInfo = true;
    getRoleALLInfoDto.need_roleHero = true;
    getRoleALLInfoDto.need_roleItem = true;
    //获取角色信息
    let retRoleALLInfo: RetRoleALLInfo = await this.gameDataService.getRoleAllInfo(getRoleALLInfoDto);
    if (!retRoleALLInfo.isHaveData()) {
      reMsg.msg = retRoleALLInfo.getRetMsg();
      return reMsg;
    }

    if (!cGameCommon.isOpenSystem(retRoleALLInfo, TableGameSys.timeaward)) {
      reMsg.msg = `系统暂未开放`;
      return reMsg;
    }


    let add_num = cGameCommon.getPrivilegeVal(retRoleALLInfo.roleSubInfo, TableGameSys.timeaward, TablePrivilegeType.timeaward_quickcount);
    if (retRoleALLInfo.roleSubInfo.timeAward.dailyNum + add_num <= 0) {
      reMsg.msg = "剩余次数不够";
      return reMsg;
    }

    let dif_minutes = TableGameConfig.time_award_quickmax * 60;
    dif_minutes = Math.floor(dif_minutes);
    if (!TableGameLevels.checkHave(retRoleALLInfo.roleInfo.gamelevels)) {
      reMsg.msg = "TableGameLevels data is null by id:" + retRoleALLInfo.roleInfo.gamelevels;
      return reMsg;
    }

    //消耗钻石
    let costType = TableGameConfig.moneyId_diamond;
    const all_count = TableGameConfig.time_award_quicknum + add_num;
    const cur_count = retRoleALLInfo.roleSubInfo.timeAward.dailyNum + add_num;
    const count = all_count - cur_count;
    const cost = TableGameConfig.time_award_skip_cost;
    let costNum = cost[count] || 0;
    let nextcostNum = cost[count + 1] || 0;
    reMsg.decitem = {};
    if (costNum > 0 && (!retRoleALLInfo.roleItem[costType] || retRoleALLInfo.roleItem[costType] < costNum)) {
      let item_name = TableGameItem.getVal(costType, TableGameItem.field_name);
      item_name = item_name || costType
      reMsg.msg = `${item_name + languageConfig.tip.not_enough}`;
      delete reMsg.decitem;
      return reMsg;
    }
    cItemBag.decitem(retRoleALLInfo.roleItem, reMsg.decitem, costType, costNum);
    await this.gameDataService.updateRoleItem(roleKeyDto, retRoleALLInfo.roleItem);

    let gamelevels_table = new TableGameLevels(retRoleALLInfo.roleInfo.gamelevels);
    let total_drops: DropDataEntity[] = [];
    //60秒
    let multiplier1 = Math.floor(dif_minutes);
    let ret_drop1: DropDataEntity = await cGameCommon.addItemByDrop(roleKeyDto, gamelevels_table.timedrop1, this.gameDataService, multiplier1);
    if (!ret_drop1) {
      reMsg.msg = "ret_drop data is null by id:" + gamelevels_table.timedrop1;
      return reMsg;
    }
    total_drops.push(ret_drop1);

    //600秒
    let ret_drop2: DropDataEntity;
    if (dif_minutes * 60 >= 600) {
      let multiplier2 = Math.floor(dif_minutes * 60 / 600);
      ret_drop2 = await cGameCommon.addItemByDrop(roleKeyDto, gamelevels_table.timedrop2, this.gameDataService, multiplier2);
    }
    total_drops.push(ret_drop2);

    //3600秒
    let ret_drop3: DropDataEntity;
    if (dif_minutes * 60 >= 3600) {
      let multiplier3 = Math.floor(dif_minutes * 60 / 3600);
      ret_drop3 = await cGameCommon.addItemByDrop(roleKeyDto, gamelevels_table.timedrop3, this.gameDataService, multiplier3);
    }
    total_drops.push(ret_drop3);

    //返回总掉落
    for (let index = 0; index < total_drops.length; index++) {
      const cur_dropDataEntity = total_drops[index];
      cGameCommon.hanleDropMsg(cur_dropDataEntity, reMsg);
    }

    retRoleALLInfo.roleSubInfo.timeAward.dailyNum -= 1;

    //经验处理
    let add_exp = multiplier1 * gamelevels_table.time_exp;
    if (add_exp) {
      reMsg.roleAddExp = syshero.leadheroAddExp(retRoleALLInfo, retRoleALLInfo.roleHero, add_exp);
    }


    if (reMsg.roleAddExp?.newHero || reMsg.roleAddExp?.newActiveHeros) {
      await this.gameDataService.updateRoleHero(roleKeyDto, retRoleALLInfo.roleHero);
    }

    await this.gameDataService.updateRoleInfo(roleKeyDto, retRoleALLInfo.roleInfo);

    reMsg.ok = true;
    reMsg.dailyNum = retRoleALLInfo.roleSubInfo.timeAward.dailyNum + add_num;
    reMsg.diamond = nextcostNum;
    reMsg.srctype = EActType.TIME_AWARD_GET_QUICK;
    reMsg.msg = languageConfig.actTypeSuccess(reMsg.srctype);
    return reMsg;
  }



}
