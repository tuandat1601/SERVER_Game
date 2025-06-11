import { clone, cloneDeep } from 'lodash';
import { gameConst } from '../config/game-const';
import { EActType, EDropType, EStatusCPType, EStatusTimeType } from '../config/game-enum';
import { TableAbyssDragonRankAward } from '../config/gameTable/TableAbyssDragonRankAward';
import { TableGameAttr } from '../config/gameTable/TableGameAttr';
import { TableGameConfig } from '../config/gameTable/TableGameConfig';
import { TableGameDrop } from '../config/gameTable/TableGameDrop';
import { TableGameEquip } from '../config/gameTable/TableGameEquip';
import { TableGameItem } from '../config/gameTable/TableGameItem';
import { TableGameSys } from '../config/gameTable/TableGameSys';
import { TableMercenaryAct } from '../config/gameTable/TableMercenaryAct';
import { TablePirateShipDailyRank } from '../config/gameTable/TablePirateShipDailyRank';
import { TablePirateShipSeasonRank } from '../config/gameTable/TablePirateShipSeasonRank';
import { TablePrivilegeConfig } from '../config/gameTable/TablePrivilegeConfig';
import { TablePrivilegeType } from '../config/gameTable/TablePrivilegeType';
import { TableRankAwards } from '../config/gameTable/TableRankAwards';
import { TableRareMonster } from '../config/gameTable/TableRareMonster';
import { TableStatus } from '../config/gameTable/TableStatus';
import { languageConfig } from '../config/language/language';
import { ArenaInfo, ArenaServerInfo } from '../game-data/entity/arena.entity';
import { DropDataEntity, DropEntity } from '../game-data/entity/drop.entity';
import { EquipEntity, EquipEntityRecord } from '../game-data/entity/equip.entity';
import { HerosRecord } from '../game-data/entity/hero.entity';
import { ItemsRecord } from '../game-data/entity/item.entity';
import { MedalInfo } from '../game-data/entity/medal.entity';
import { RESChangeMsg, RESLoginMsg } from '../game-data/entity/msg.entity';
import { PirateShipRoleEntity, SPSRankEntity } from '../game-data/entity/pirateShip.entity';
import { AureoleInfo, DemonAbyssEntity, MercenaryActEntity, MercenaryDataEntity, MercenaryLvEntity, ReDayInfo, RoleInfoEntity, RoleRechargeInfo, RoleSubInfoEntity, RareMonsterEntity, TitleEntity, FashionEntity, OpenWelfareEntity, CQEntity } from '../game-data/entity/roleinfo.entity';
import { ServerInfoEntity, ServerSubInfoEntity } from '../game-data/entity/server-info.entity';
import { BuyItemTag, RechargeShop } from '../game-data/entity/shop.entity';
import { TimeAwardEntity } from '../game-data/entity/time-award.entity';
import { WelfareDaily, WelfarePaidDays, } from '../game-data/entity/welfare.entity';
import { GameDataService, getGuildInfoHmKey } from '../game-data/gamedata.service';
import { RoleKeyDto } from '../game-data/role/dto/role-key.dto';
import { Logger } from '../game-lib/log4js';
import { cTools } from '../game-lib/tools';
import { cpHero } from './hero/hero-cpattr';
import { cItemBag } from './item/item-bag';
import { cTaskSystem } from './task/task-sytem';
import { WrestleEntity, WrestleFightEntity } from './wrestle/entities/wrestle.entity';
import { TablePirateShip } from '../config/gameTable/TablePirateShip';
import { PSFightEntity } from '../game-data/entity/pirateShip.entity';
import { TableArenaSeasonRank } from '../config/gameTable/TableArenaSeasonRank';
import { TableArenaDailyRank } from '../config/gameTable/TableArenaDailyRank';
import { XBoxEntity } from '../game-data/entity/ebox.entity';
import { getCross_ArenaInfo_RKey } from 'apps/web-cross-server/src/common/redis-key';
import { GuildEntity } from '../game-data/entity/guild.entity';

export class RetRoleALLInfo {

  constructor(gameDataService: GameDataService) {
    this.gameDataService = gameDataService;
  }

  need_roleInfo: boolean = false;
  need_roleHero: boolean = false;
  need_roleItem: boolean = false;
  need_roleEquip: boolean = false;
  need_serverInfo: boolean = true;

  retMsg: string = 'ret null';

  roleInfo: RoleInfoEntity;
  roleSubInfo: RoleSubInfoEntity;
  roleHero: HerosRecord;
  roleItem: ItemsRecord;
  roleEquip: EquipEntityRecord;
  serverInfo: ServerInfoEntity;
  gameDataService: GameDataService;

  getRetMsg() {
    return this.retMsg;
  }

  /**
   * 根据情况设置强制检测数据
   */
  checkData(isNRoleInfo: boolean = false, isNRoleHero: boolean = false, isNeedRoleItem: boolean = false, isNRoleEquip: boolean = false) {

    if (isNRoleInfo) { this.need_roleInfo = true; }

    if (isNRoleHero) { this.need_roleHero = true; }

    if (isNeedRoleItem) { this.need_roleItem = true; }

    if (isNRoleEquip) { this.need_roleEquip = true; }

    return this.isHaveData();
  }

  isHaveData() {

    if (this.need_roleInfo) {
      if (!this.roleInfo || !this.roleSubInfo) {
        this.retMsg = 'roleInfo is null';
        return false;
      }
    }

    if (this.need_roleHero) {
      if (!this.roleHero) {
        this.retMsg = 'roleHero is null';
        return false;
      }
    }

    if (this.need_roleItem) {
      if (!this.roleItem) {
        this.retMsg = 'roleItem is null';
        return false;
      }
    }

    if (this.need_roleEquip) {
      if (!this.roleEquip) {
        this.retMsg = 'roleEquip is null';
        return false;
      }
    }

    if (this.need_serverInfo) {
      if (!this.serverInfo) {
        this.retMsg = 'serverInfo is null';
        return false;
      }
    }

    return true;
  }
}

export const cGameCommon = {
  /**创建账号或登录数据初始化 */
  loginInitRoleInfo(retRoleALLInfo: RetRoleALLInfo, cross_arenaInfo: ArenaServerInfo = null) {

    if (!retRoleALLInfo.isHaveData()) {
      return;
    }

    retRoleALLInfo.roleSubInfo.ver = gameConst.ver;

    //兼容老账号
    if (retRoleALLInfo.roleSubInfo.last_serverid) {
      delete retRoleALLInfo.roleSubInfo.last_serverid;
    }

    //任务初始化
    if (!retRoleALLInfo.roleSubInfo.taskTargetTag || Object.keys(retRoleALLInfo.roleSubInfo.taskTargetTag).length == 0) {
      cTaskSystem.initTaskTargetType(retRoleALLInfo);
    }

    if (!retRoleALLInfo.roleSubInfo.rechargeInfo) {
      retRoleALLInfo.roleSubInfo.rechargeInfo = new RoleRechargeInfo();
    }

    if (retRoleALLInfo.roleSubInfo.rechargeInfo) {
      if (retRoleALLInfo.roleSubInfo.rechargeInfo.dailyAmounts == undefined) {
        retRoleALLInfo.roleSubInfo.rechargeInfo.dailyAmounts = 0;
      }

      if (retRoleALLInfo.roleSubInfo.rechargeInfo.totalAmounts == undefined) {
        retRoleALLInfo.roleSubInfo.rechargeInfo.totalAmounts = 0;
      }
    }

    if (!retRoleALLInfo.roleSubInfo.privilege) {
      retRoleALLInfo.roleSubInfo.privilege = {};
    }

    if (!retRoleALLInfo.roleSubInfo.status) {
      retRoleALLInfo.roleSubInfo.status = {};
    }
    else {
      //特权重置
      retRoleALLInfo.roleSubInfo.privilege = {}
      for (const key in retRoleALLInfo.roleSubInfo.status) {
        if (Object.prototype.hasOwnProperty.call(retRoleALLInfo.roleSubInfo.status, key)) {
          //const element = retRoleALLInfo.roleSubInfo.status[key];
          let statusId = Number(key)
          if (!TableStatus.checkHave(statusId)) {
            continue;
          }
          let tableStatus = new TableStatus(statusId);
          //添加特权  
          if (tableStatus.privilege && tableStatus.privilege.length > 0) {
            for (let index = 0; index < tableStatus.privilege.length; index++) {
              const pid = tableStatus.privilege[index];
              cGameCommon.addPrivilege(retRoleALLInfo.roleInfo, pid);
            }
          }
        }
      }
    }
    if (!retRoleALLInfo.roleSubInfo.buyItemTag) {
      retRoleALLInfo.roleSubInfo.buyItemTag = new BuyItemTag();
    }

    if (!retRoleALLInfo.roleSubInfo.buyItemTag.doubleTag) {
      retRoleALLInfo.roleSubInfo.buyItemTag.doubleTag = {};
    }

    if (retRoleALLInfo.roleSubInfo.adverts === undefined) {
      retRoleALLInfo.roleSubInfo.adverts = false;
    }

    if (!retRoleALLInfo.roleSubInfo.rechargeShop) {
      retRoleALLInfo.roleSubInfo.rechargeShop = new RechargeShop();
    }

    if (retRoleALLInfo.roleSubInfo.pirateShip) {
      if (!retRoleALLInfo.roleSubInfo.pirateShip.sTime == undefined) {
        retRoleALLInfo.roleSubInfo.pirateShip.sTime = retRoleALLInfo.serverInfo.info.pirateShip.sTime;
      }

      if (retRoleALLInfo.roleSubInfo.pirateShip.adddice_time == undefined && retRoleALLInfo.roleItem) {
        if (!retRoleALLInfo.roleItem[TableGameConfig.ps_item_ndice] || retRoleALLInfo.roleItem[TableGameConfig.ps_item_ndice] < TableGameConfig.ps_dice_max) {
          retRoleALLInfo.roleSubInfo.pirateShip.adddice_time = cTools.newLocalDateString();
        }
      }

      if (retRoleALLInfo.roleSubInfo.pirateShip.killNum == undefined) {
        retRoleALLInfo.roleSubInfo.pirateShip.killNum = 0;
      }

      let table_data = TablePirateShip.getTable();
      if (retRoleALLInfo.roleSubInfo.pirateShip.shipId > Object.keys(table_data).length) {
        delete retRoleALLInfo.roleSubInfo.pirateShip.fightInfo;
        let shipId = Number(cTools.randRecordByWeight(table_data));
        retRoleALLInfo.roleSubInfo.pirateShip.shipId = shipId
        retRoleALLInfo.roleSubInfo.pirateShip.fightInfo = new PSFightEntity(shipId);
      }
    }

    let raremst = retRoleALLInfo.roleInfo.info.raremst;
    if (raremst != undefined) {
      let gs: Record<number, Record<number, number>> = {};
      let delindex: number[] = [];
      let delid: number[] = [];
      for (let i = 0; i < raremst.id.length; i++) {
        const id = raremst.id[i];
        if (TableRareMonster.checkHave(id)) {
          let d = new TableRareMonster(id);
          if (gs[d.group] == undefined) { gs[d.group] = {}; }
          gs[d.group][i] = id;
        }
        else {
          delindex.push(i);
          delid.push(id);
        }
      }
      for (const [k, g] of Object.entries(gs)) {
        let at = Object.entries(g);
        if (at.length > 1) {
          let maxid = 0;
          let index = -1;
          for (const [i, id] of at) {
            if (id > maxid) {
              maxid = id;
              index = Number(i);
            }
          }
          for (const [i, id] of at) {
            if (Number(i) != index) {
              delindex.push(Number(i));
              delid.push(id);
            }
          }
        }
      }
      if (delindex.length > 0) {
        delindex.sort((a, b) => b - a);
        for (let i of delindex) {
          raremst.id.splice(i, 1);
        }
      }
      if (delid.length > 0) {
        for (let id of delid) {
          for (let i = 0; i < raremst.fight.length; i++) {
            let j = raremst.fight[i].indexOf(id);
            if (j != -1) {
              raremst.fight[i].splice(j, 1, 0);
            }
          }
        }
      }
    }
    if (retRoleALLInfo.roleSubInfo.ico === undefined) {
      retRoleALLInfo.roleSubInfo.ico = gameConst.ico;
    }

    if (retRoleALLInfo.roleSubInfo.reDayInfo === undefined) {
      retRoleALLInfo.roleSubInfo.reDayInfo = new ReDayInfo();
    }
    else {
      if (retRoleALLInfo.roleSubInfo.reDayInfo.ad_damage === undefined) {
        retRoleALLInfo.roleSubInfo.reDayInfo.ad_damage = 0;
      }

      if (retRoleALLInfo.roleSubInfo.reDayInfo.ad_awardTag === undefined) {
        retRoleALLInfo.roleSubInfo.reDayInfo.ad_awardTag = 0;
      }

      if (retRoleALLInfo.roleSubInfo.reDayInfo.da_awards === undefined) {
        retRoleALLInfo.roleSubInfo.reDayInfo.da_awards = false;
      }

      if (retRoleALLInfo.roleSubInfo.reDayInfo.da_buytag === undefined) {
        retRoleALLInfo.roleSubInfo.reDayInfo.da_buytag = 0;
      }

    }

    //临时装备对比兼容
    if (retRoleALLInfo.roleSubInfo.tmpEquip && retRoleALLInfo.roleSubInfo.tmpEquipHero) {
      let new_tmpEquip = cloneDeep(retRoleALLInfo.roleSubInfo.tmpEquip);
      new_tmpEquip.tmphid = retRoleALLInfo.roleSubInfo.tmpEquipHero;
      retRoleALLInfo.roleSubInfo.tmpEquips = retRoleALLInfo.roleSubInfo.tmpEquips || {};
      retRoleALLInfo.roleSubInfo.tmpEquips[new_tmpEquip.eid] = new_tmpEquip;

      delete retRoleALLInfo.roleSubInfo.tmpEquip;
      delete retRoleALLInfo.roleSubInfo.tmpEquipHero;
    }
    else {
      delete retRoleALLInfo.roleSubInfo.tmpEquip;
      delete retRoleALLInfo.roleSubInfo.tmpEquipHero;
    }

    //佣兵
    if (retRoleALLInfo.roleSubInfo.mercenary) {
      if (retRoleALLInfo.roleSubInfo.mercenary.flag_time === undefined) {
        let itemid = TableGameConfig.mercenary_data?.itemid
        if (itemid && (!retRoleALLInfo.roleItem[itemid] || retRoleALLInfo.roleItem[itemid] < TableGameConfig.mercenary_max)) {
          retRoleALLInfo.roleSubInfo.mercenary.flag_time = cTools.newLocalDateString();
        }
      }
    }

    if (retRoleALLInfo.roleSubInfo.openWelfare) {
      if (!retRoleALLInfo.roleSubInfo.openWelfare.totalPoint) {
        retRoleALLInfo.roleSubInfo.openWelfare.totalPoint = 0;
      }
    }

    if (retRoleALLInfo.roleSubInfo.arenaInfoKf) {
      let arean = retRoleALLInfo.roleSubInfo.arenaInfoKf
      if (cross_arenaInfo && arean.season !== cross_arenaInfo.season) {
        arean.season = cross_arenaInfo.season
      }
    }

  },

  /**
   * 检测系统是否开放
   * @param roleInfo
   * @param systemId 系统ID
   * @returns
   */
  isOpenSystem(retRoleALLInfo: RetRoleALLInfo, systemId: number) {

    if (!TableGameSys.checkHave(systemId)) {
      return false;
    }

    if (!retRoleALLInfo.isHaveData()) {
      return false;
    }

    let roleInfo = retRoleALLInfo.roleInfo;
    let serverSubInfoEntity = retRoleALLInfo.serverInfo.info;

    let tableGameSys_table = new TableGameSys(systemId);
    if (tableGameSys_table.is_open !== 1) {
      return false;
    }
    if (!tableGameSys_table.open_rolelevel) {
      return false;
    }
    if (roleInfo.rolelevel < tableGameSys_table.open_rolelevel) {
      return false;
    }

    if (!serverSubInfoEntity || !serverSubInfoEntity.startTime) {
      return false;
    }

    let open_days = cTools.GetServerOpenDays(serverSubInfoEntity.startTime);
    if (open_days < tableGameSys_table.server_opendays) {
      return false;
    }

    if (tableGameSys_table.guild > 0) {
      if (roleInfo.info.guild == undefined)
        return false;
    }

    if (tableGameSys_table.need_task > 0) {
      //需要完成主线任务
      let needtask = tableGameSys_table.need_task
      let lastId = roleInfo.info.taskMain?.lastId
      if (lastId !== undefined && needtask > lastId) {
        return false;
      }
    }

    //关闭
    //开服多少天关闭
    if (tableGameSys_table.close_serverday && tableGameSys_table.close_serverday > 0) {
      if (open_days > tableGameSys_table.close_serverday) {
        return false;
      }
    }

    return true;
  },

  /**
   * 升级有检测是否有新的系统开放
   * @param roleInfo
   * @returns
   */
  checkOpenNewSystem(retRoleALLInfo: RetRoleALLInfo) {

    if (!retRoleALLInfo.isHaveData()) { return null; }

    let ret: any;
    let cur_system_id = -1;
    let roleInfo = retRoleALLInfo.roleInfo;

    //挂机系统
    cur_system_id = TableGameSys.timeaward;
    if (roleInfo.info.timeAward === undefined && cGameCommon.isOpenSystem(retRoleALLInfo, cur_system_id)) {
      roleInfo.info.timeAward = new TimeAwardEntity();
      ret = ret || {};
      ret[cur_system_id] = roleInfo.info.timeAward;
    }

    //精英关卡
    cur_system_id = TableGameSys.elitelevels;
    if (roleInfo.info.elitelevels === undefined && cGameCommon.isOpenSystem(retRoleALLInfo, cur_system_id)) {
      roleInfo.info.elitelevels = 0;
      roleInfo.info.reDayInfo.elitesweepcount = 0;
      ret = ret || {};
      ret[cur_system_id] = { elitelevels: roleInfo.info.elitelevels };
    }

    //主线任务
    cur_system_id = TableGameSys.task_main;
    if (roleInfo.info.taskMain === undefined && cGameCommon.isOpenSystem(retRoleALLInfo, cur_system_id)) {
      roleInfo.info.taskMain = cTaskSystem.initTaskMain(retRoleALLInfo);
      ret = ret || {};
      ret[cur_system_id] = roleInfo.info.taskMain;
      //隐藏任务
      cTaskSystem.initTaskHide(retRoleALLInfo);
    }

    // //关卡任务
    // if (roleInfo.info.TaskLevel === undefined) {
    //   cTaskSystem.initTaskLevel(retRoleALLInfo);
    // }

    //每日任务
    cur_system_id = TableGameSys.task_daily;
    if (roleInfo.info.taskDaily === undefined && cGameCommon.isOpenSystem(retRoleALLInfo, cur_system_id)) {
      cTaskSystem.initTaskDaily(retRoleALLInfo);
      ret = ret || {};
      ret[cur_system_id] = roleInfo.info.taskDaily;
    }

    //福利-每日有礼
    cur_system_id = TableGameSys.welfare_daily;
    if (roleInfo.info.welfareDaily === undefined && cGameCommon.isOpenSystem(retRoleALLInfo, cur_system_id)) {
      roleInfo.info.welfareDaily = new WelfareDaily();
      ret = ret || {};
      ret[cur_system_id] = roleInfo.info.welfareDaily;
    }

    //每日任务
    cur_system_id = TableGameSys.guild_task;
    if (roleInfo.info.taskGuild === undefined && cGameCommon.isOpenSystem(retRoleALLInfo, cur_system_id)) {
      cTaskSystem.initTaskGuild(retRoleALLInfo);
      ret = ret || {};
      ret[cur_system_id] = roleInfo.info.taskGuild;
    }

    //福利-等级奖励
    cur_system_id = TableGameSys.welfare_level;
    if (roleInfo.info.welfareLevel === undefined && cGameCommon.isOpenSystem(retRoleALLInfo, cur_system_id)) {
      roleInfo.info.welfareLevel = 0;
      ret = ret || {};
      ret[cur_system_id] = roleInfo.info.welfareLevel;
    }

    //福利-积天豪礼
    cur_system_id = TableGameSys.welfare_paid_days;
    if (roleInfo.info.welfarePaidDaily === undefined && cGameCommon.isOpenSystem(retRoleALLInfo, cur_system_id)) {
      roleInfo.info.welfarePaidDaily = new WelfarePaidDays();
      ret = ret || {};
      ret[cur_system_id] = roleInfo.info.welfarePaidDaily;
    }

    //月卡
    cur_system_id = TableGameSys.recharge_month_card;
    if (roleInfo.info.rechargeShop?.monsthCard_daily === undefined && cGameCommon.isOpenSystem(retRoleALLInfo, cur_system_id)) {
      roleInfo.info.rechargeShop.monsthCard_daily = false;
      ret = ret || {};
      ret[cur_system_id] = roleInfo.info.rechargeShop.monsthCard_daily;
    }

    //终身卡
    cur_system_id = TableGameSys.recharge_forever_card;
    if (roleInfo.info.rechargeShop?.foreverCard_daily === undefined && cGameCommon.isOpenSystem(retRoleALLInfo, cur_system_id)) {
      roleInfo.info.rechargeShop.foreverCard_daily = false;
      ret = ret || {};
      ret[cur_system_id] = roleInfo.info.rechargeShop.foreverCard_daily;
    }

    //等级基金
    cur_system_id = TableGameSys.recharge_level_fund;
    if (roleInfo.info.rechargeShop.fundLevel_Lv === undefined && cGameCommon.isOpenSystem(retRoleALLInfo, cur_system_id)) {
      roleInfo.info.rechargeShop.fundLevel_Lv = 0;
      ret = ret || {};
      ret[cur_system_id] = roleInfo.info.rechargeShop.fundLevel_Lv;
    }

    //锻造基金
    cur_system_id = TableGameSys.recharge_ebox_fund;
    if (roleInfo.info.rechargeShop.fundEbox_Lv === undefined && cGameCommon.isOpenSystem(retRoleALLInfo, cur_system_id)) {
      roleInfo.info.rechargeShop.fundEbox_Lv = 0;
      ret = ret || {};
      ret[cur_system_id] = roleInfo.info.rechargeShop.fundEbox_Lv;
    }

    //勋章制作
    cur_system_id = TableGameSys.medal;
    if (
      roleInfo.info.medalInfo === undefined && cGameCommon.isOpenSystem(retRoleALLInfo, cur_system_id)
    ) {
      roleInfo.info.medalInfo = new MedalInfo();
      ret = ret || {};
      ret[cur_system_id] = roleInfo.info.medalInfo;

    }
    //竞技场
    cur_system_id = TableGameSys.arena;
    if (roleInfo.info.arenaInfo === undefined && cGameCommon.isOpenSystem(retRoleALLInfo, cur_system_id)) {
      let arenaData = retRoleALLInfo.serverInfo.info.arenaData;
      if (arenaData) {
        roleInfo.info.arenaInfo = new ArenaInfo(arenaData.season, arenaData.sTime, TableGameConfig.arena_count);
        ret = ret || {};
        ret[cur_system_id] = roleInfo.info.arenaInfo;
      }
    }
    //跨服竞技场
    cur_system_id = TableGameSys.arenaKF;
    if (roleInfo.info.arenaInfoKf === undefined && cGameCommon.isOpenSystem(retRoleALLInfo, cur_system_id)) {
      roleInfo.info.arenaInfoKf = new ArenaInfo(0, cTools.newLocalDate0String(), TableGameConfig.arena_count_kf);
      ret = ret || {};
      ret[cur_system_id] = roleInfo.info.arenaInfoKf;
    }

    //夺宝大作战
    cur_system_id = TableGameSys.pirateShip;
    if (roleInfo.info.pirateShip === undefined && cGameCommon.isOpenSystem(retRoleALLInfo, cur_system_id)) {
      let server_pirateShip = retRoleALLInfo.serverInfo.info.pirateShip;
      roleInfo.info.pirateShip = new PirateShipRoleEntity(server_pirateShip.season, server_pirateShip.sTime);

      if (TableGameConfig.ps_init_dice < TableGameConfig.ps_dice_max) {
        roleInfo.info.pirateShip.adddice_time = cTools.newLocalDateString();
      }

      ret = ret || {};
      ret[cur_system_id] = roleInfo.info.pirateShip;
    }

    // //食果
    // cur_system_id = TableGameSys.eat_fruit;
    // if (
    //   roleInfo.info.fruit === undefined && cGameCommon.isOpenSystem(retRoleALLInfo, cur_system_id)
    // ) {
    //   roleInfo.info.fruit = new FruitEntity();
    //   ret = ret || {};
    //   ret[cur_system_id] = roleInfo.info.fruit;
    // }

    //佣兵进阶
    cur_system_id = TableGameSys.upgrade;
    if (roleInfo.info.upgrade === undefined && cGameCommon.isOpenSystem(retRoleALLInfo, cur_system_id)) {
      roleInfo.info.upgrade = 1;
      cTaskSystem.initTaskUpgrade(retRoleALLInfo);
      ret = ret || {};
      ret[cur_system_id] = { task: retRoleALLInfo.roleInfo.info.taskUpgrade, grade: roleInfo.info.upgrade }
    }

    //光环
    cur_system_id = TableGameSys.aureole;
    if (roleInfo.info.aureole === undefined && cGameCommon.isOpenSystem(retRoleALLInfo, cur_system_id)) {
      roleInfo.info.aureole = new AureoleInfo();
      ret = ret || {};
      ret[cur_system_id] = roleInfo.info.aureole;
    }

    //魔渊
    cur_system_id = TableGameSys.demon_abyss;
    if (roleInfo.info.demonAbyss === undefined && cGameCommon.isOpenSystem(retRoleALLInfo, cur_system_id)) {
      roleInfo.info.demonAbyss = new DemonAbyssEntity();
      ret = ret || {};
      ret[cur_system_id] = roleInfo.info.demonAbyss;
    }

    //异兽
    cur_system_id = TableGameSys.raremonster;
    if (roleInfo.info.raremst === undefined && cGameCommon.isOpenSystem(retRoleALLInfo, cur_system_id)) {
      roleInfo.info.raremst = new RareMonsterEntity();
      ret = ret || {};
      ret[cur_system_id] = roleInfo.info.raremst;
    }

    //佣兵
    cur_system_id = TableGameSys.mercenary;
    if (roleInfo.info.mercenary === undefined && cGameCommon.isOpenSystem(retRoleALLInfo, cur_system_id)) {
      roleInfo.info.mercenary = new MercenaryDataEntity();
      roleInfo.info.mercenary.actinfo = new MercenaryActEntity()
      roleInfo.info.mercenary.mlv = {}
      //开启系统默认激活一个指定佣兵
      let type = TableGameConfig.mercenary_data?.type
      if ((type ?? 0) > 0) {
        let id = TableMercenaryAct.getVal(type, TableMercenaryAct.field_id)
        let fid = TableMercenaryAct.getVal(type, TableMercenaryAct.field_fid)
        if ((id ?? 0) > 0) {
          roleInfo.info.mercenary.mlv[type] = new MercenaryLvEntity(id, fid);
        }
      }
      ret = ret || {};
      ret[cur_system_id] = roleInfo.info.mercenary;
    }

    //角斗
    cur_system_id = TableGameSys.wrestle;
    if ((roleInfo.info.wrestle === undefined || roleInfo.info.wrestle.fight === undefined) && cGameCommon.isOpenSystem(retRoleALLInfo, cur_system_id)) {
      roleInfo.info.wrestle = new WrestleEntity();
      roleInfo.info.wrestle.fight = new WrestleFightEntity();
      ret = ret || {};
      ret[cur_system_id] = roleInfo.info.wrestle;
    }

    //称号
    cur_system_id = TableGameSys.title;
    if (roleInfo.info.title === undefined && cGameCommon.isOpenSystem(retRoleALLInfo, cur_system_id)) {
      roleInfo.info.title = new TitleEntity();
      ret = ret || {};
      ret[cur_system_id] = roleInfo.info.title;
    }

    //时装
    cur_system_id = TableGameSys.change;
    if (roleInfo.info.fashion === undefined && cGameCommon.isOpenSystem(retRoleALLInfo, cur_system_id)) {
      roleInfo.info.fashion = new FashionEntity();
      ret = ret || {};
      ret[cur_system_id] = roleInfo.info.fashion;
    }

    //开服福利
    cur_system_id = TableGameSys.open_server_welfare;
    if (roleInfo.info.openWelfare === undefined && cGameCommon.isOpenSystem(retRoleALLInfo, cur_system_id)) {
      cTaskSystem.initOpenWelfare(retRoleALLInfo);
      ret = ret || {};
      ret[cur_system_id] = roleInfo.info.openWelfare;
    }

    //寻宝
    cur_system_id = TableGameSys.xunbao;
    if (roleInfo.info.xbox === undefined && cGameCommon.isOpenSystem(retRoleALLInfo, cur_system_id)) {
      roleInfo.info.xbox = new XBoxEntity();
      ret = ret || {};
      ret[cur_system_id] = roleInfo.info.xbox;
    }

    //猜拳
    cur_system_id = TableGameSys.cq;
    if (roleInfo.info.cq === undefined && cGameCommon.isOpenSystem(retRoleALLInfo, cur_system_id)) {
      roleInfo.info.cq = new CQEntity();
      ret = ret || {};
      ret[cur_system_id] = roleInfo.info.cq;
    }

    return ret;

  },



  /**
   * 根据掉落表ID 生成掉落的装备和道具
   * @param dropid 掉落表ID
   * @param multiplier 数量倍速
   * @returns
   */
  randomItem(dropid: number, multiplier: number = 1) {
    if (!TableGameDrop.getVal(dropid, TableGameDrop.field_type)) {
      return { items: [], equips: [] };
    }

    const drop_table = new TableGameDrop(dropid);

    let item_dropList: DropEntity[] = [];
    let equip_dropList: DropEntity[] = [];

    const drop_table_ary: DropEntity[] = drop_table.drop;
    if (drop_table.type == EDropType.ONE) {
      let dropEntity = clone(drop_table_ary[Math.floor(Math.random() * drop_table_ary.length)],);
      dropEntity.n = dropEntity.n ? dropEntity.n : 1;
      dropEntity.n = dropEntity.n * multiplier;

      if (TableGameItem.table[dropEntity.i]) {
        item_dropList.push(dropEntity);
      } else if (TableGameEquip.table[dropEntity.i]) {
        equip_dropList.push(dropEntity);
      }
    } else if (drop_table.type == EDropType.ALL) {
      for (let index = 0; index < drop_table_ary.length; index++) {
        let dropEntity = clone(drop_table_ary[index]);
        let cur_pro = dropEntity.p || 10000;
        if (Math.floor(Math.random() * 10000) <= cur_pro) {
          dropEntity.n = dropEntity.n ? dropEntity.n : 1;
          dropEntity.n = dropEntity.n * multiplier;

          if (TableGameItem.table[dropEntity.i]) {
            item_dropList.push(dropEntity);
          } else if (TableGameEquip.table[dropEntity.i]) {
            equip_dropList.push(dropEntity);
          }
        }
      }
    }

    return { items: item_dropList, equips: equip_dropList };
  },

  /**
   * 根据掉落添加道具
   * @param roleKeyDto
   * @param addItems
   * @param isSave 是否保存
   * @returns
   */
  async addRoleItem(roleKeyDto: RoleKeyDto, addItems: DropEntity[], gameDataService: GameDataService, isSave: boolean = true) {
    if (!addItems || addItems.length <= 0) { return; }

    let roleItem = await gameDataService.getRoleItem(roleKeyDto);
    if (!roleItem || !roleItem.info) {
      Logger.error('addRoleItem getRoleItem is null', roleKeyDto);
      return;
    }

    let itembag = <ItemsRecord>(<unknown>roleItem.info);
    let new_items: ItemsRecord = {};
    for (let itemidx = 0; itemidx < addItems.length; itemidx++) {
      const dropEntity = addItems[itemidx];

      if (!dropEntity || !TableGameItem.table[dropEntity.i]) {
        continue;
      }

      dropEntity.n = dropEntity.n ? dropEntity.n : 1;
      cItemBag.addItem(itembag, new_items, dropEntity.i, dropEntity.n);
    }

    if (isSave) {
      await gameDataService.updateRoleItem(roleKeyDto, itembag);
    }
    return new_items;
  },

  /**
   * 根据掉落配置-角色添加装备
   * @param roleKeyDto 角色ID和服务器ID
   * @param addEquips 添加装备数组
   * @param isSave 是否保存
   */
  async addRoleEquip(roleKeyDto: RoleKeyDto, addEquips: DropEntity[], gameDataService: GameDataService, isSave: boolean = true) {

    if (!addEquips || addEquips.length <= 0) { return; }

    let roleEquip = await gameDataService.getRoleEquip(roleKeyDto);
    if (!roleEquip || !roleEquip.info) {
      ///console.log("getRoleEquip is null");
      Logger.error('addRoleEquip getRoleEquip is null', roleKeyDto);
      return;
    }

    let equipBagRecord = <EquipEntityRecord>(<unknown>roleEquip.info);
    if (Object.keys(equipBagRecord).length >= TableGameConfig.equip_bag_max) {
      return;
    }

    let drop_euqips: EquipEntityRecord = {};
    for (let index = 0; index < addEquips.length; index++) {
      const dropEntity = addEquips[index];
      if (!dropEntity || !TableGameEquip.table[dropEntity.i]) {
        continue;
      }
      if (Object.keys(equipBagRecord).length >= TableGameConfig.equip_bag_max) {
        break;
      }

      dropEntity.n = dropEntity.n ? dropEntity.n : 1;
      for (let idx = 0; idx < dropEntity.n; idx++) {
        if (Object.keys(equipBagRecord).length >= TableGameConfig.equip_bag_max) { break; }

        let equipEntity: EquipEntity;
        if (dropEntity.q != undefined && (dropEntity.bper != undefined || dropEntity.add != undefined)) {
          equipEntity = new EquipEntity();
          equipEntity.id = dropEntity.i;
          equipEntity.eid = gameDataService.getEquipEID();
          equipEntity.qid = dropEntity.q;
          equipEntity.bper = dropEntity.bper || 0;
          equipEntity.add = dropEntity.add || undefined;
        }
        else {
          //随机生成
          equipEntity = gameDataService.createEquip(dropEntity.i, dropEntity.q);
        }

        if (!equipEntity) { continue; }

        if (equipBagRecord[equipEntity.eid]) {
          //console.log(`[error] addRoleEquip roleid:${roleKeyDto.id} serverid:${roleKeyDto.serverid} equipEntity.eid is have equip:${dropEntity.i} eid:${equipEntity.eid}`);
          Logger.error(
            `addRoleEquip roleid:${roleKeyDto.id} serverid:${roleKeyDto.serverid} equipEntity.eid is have equip:${dropEntity.i} eid:${equipEntity.eid}`,
          );
          continue;
        }

        let eid = equipEntity.eid;
        delete equipEntity.eid;
        equipBagRecord[eid] = equipEntity;
        drop_euqips[eid] = equipEntity;
      }
    }
    if (isSave) {
      await gameDataService.updateRoleEquip(roleKeyDto, equipBagRecord);
    }
    return drop_euqips;
  },

  /**
   * 根据掉落组来获取装备和道具
   * @param roleKeyDto
   * @param drops
   * @param multiplier 奖励数量倍率 不是次数 如果是要多次  则drops 拷贝多个弄成一个数组传入
   * @param isSave  是否保存 装备和道具！！！都走这个控制 如果为false 道具 装备都得单独存
   * @returns
   */
  async addItemByDrop(roleKeyDto: RoleKeyDto, drops: number[], gameDataService: GameDataService, multiplier: number = 1, isSave: boolean = true) {

    if (!drops) { return; }

    let item_dropList: DropEntity[] = [];
    let equip_dropList: DropEntity[] = [];
    for (let index = 0; index < drops.length; index++) {
      const drop_id = drops[index];
      let new_data = cGameCommon.randomItem(drop_id, multiplier);
      item_dropList = item_dropList.concat(new_data.items);
      equip_dropList = equip_dropList.concat(new_data.equips);
    }

    let dropDataEntity: DropDataEntity = {};
    dropDataEntity.items = await cGameCommon.addRoleItem(roleKeyDto, item_dropList, gameDataService, isSave);
    dropDataEntity.equips = await cGameCommon.addRoleEquip(roleKeyDto, equip_dropList, gameDataService, isSave);

    return dropDataEntity;
  },

  async addItem(roleKeyDto: RoleKeyDto, items: ItemsRecord, gameDataService: GameDataService, multiplier: number = 1, isSave: boolean = true) {

    if (!items) { return; }
    if (Object.keys(items).length <= 0) { return; }

    let item_dropList: DropEntity[] = [];
    for (const itemid in items) {
      if (Object.prototype.hasOwnProperty.call(items, itemid)) {
        const item_num = items[itemid];
        let dropEntity = new DropEntity();
        dropEntity.i = Number(itemid);
        dropEntity.n = item_num * multiplier;
        item_dropList.push(dropEntity);
      }
    }

    let dropDataEntity: DropDataEntity = {};
    dropDataEntity.items = await cGameCommon.addRoleItem(roleKeyDto, item_dropList, gameDataService, isSave);

    return dropDataEntity;
  },

  hanleDropMsg(dropDataEntity: DropDataEntity, reMsg: RESChangeMsg) {
    if (!dropDataEntity) { return; }

    if (dropDataEntity?.items && Object.keys(dropDataEntity.items).length > 0) {
      reMsg.additem = reMsg.additem || {};
      for (const itemid in dropDataEntity.items) {
        if (Object.prototype.hasOwnProperty.call(dropDataEntity.items, itemid)) {

          if (itemid.indexOf(gameConst.log_itemNumTag) !== -1) {
            continue;
          }
          const item_num = dropDataEntity.items[itemid];
          reMsg.additem[itemid] = reMsg.additem[itemid] || 0;
          reMsg.additem[itemid] += item_num;
          reMsg.additem[gameConst.log_itemNumTag + itemid] = reMsg.additem[gameConst.log_itemNumTag + itemid] || 0;
          reMsg.additem[gameConst.log_itemNumTag + itemid] = dropDataEntity.items[gameConst.log_itemNumTag + itemid] || 0;
        }
      }
    }

    if (dropDataEntity?.equips && Object.keys(dropDataEntity.equips).length > 0) {
      reMsg.addEquip = reMsg.addEquip || {};
      reMsg.addEquip = Object.assign({}, reMsg.addEquip, dropDataEntity.equips);
    }
  },

  cpRoleFightPoint(roleSubInfoEntity: RoleSubInfoEntity, heroList: HerosRecord) {

    let total_point: number = 0;
    for (const key in heroList) {
      if (Object.prototype.hasOwnProperty.call(heroList, key)) {
        let heroEntity = heroList[key];
        cpHero.cpHeroAttr(heroEntity, roleSubInfoEntity);
        let cur_fight = cGameCommon.cpFightPoint(heroEntity.tAttr);
        total_point += cur_fight;
      }
    }
    return total_point;
  },

  getRoleFightPoint(heroList: HerosRecord) {

    let total_point: number = 0;
    for (const key in heroList) {
      if (Object.prototype.hasOwnProperty.call(heroList, key)) {
        let heroEntity = heroList[key];
        let cur_fight = heroEntity.fight;
        total_point += cur_fight || 0;
      }
    }
    return total_point;
  },

  cpFightPoint(attr: any) {
    let fight_point = 0;
    if (!attr) {
      return fight_point;
    }

    for (const attrid in attr) {
      if (Object.prototype.hasOwnProperty.call(attr, attrid)) {
        const attrid_int = Number(attrid);
        const attr_val = attr[attrid_int];
        let fight_point_per = TableGameAttr.getVal(
          attrid_int,
          TableGameAttr.field_zhanli,
        );

        let cur_fight_point = attr_val * fight_point_per;
        fight_point += cur_fight_point;
      }
    }

    return fight_point;
  },

  /**
   * 添加状态
   * @param roleInfo
   * @param statusId
   * @returns
   */
  addStatus(roleInfo: RoleInfoEntity, statusId: number) {
    if (!roleInfo || !roleInfo.info) {
      return;
    }

    let roleSubInfo = roleInfo.info;
    if (!statusId || !TableStatus.checkHave(statusId)) {
      return;
    }

    let tableStatus = new TableStatus(statusId);

    switch (tableStatus.timetype) {
      case EStatusTimeType.FOREVER:
        if (roleSubInfo.status[statusId] !== undefined) {
          return;
        }
        roleSubInfo.status[statusId] = 1;
        break;
      case EStatusTimeType.TIME_LIMIT:
        if (roleSubInfo.status[statusId] !== undefined) {
          let new_date = new Date(roleSubInfo.status[statusId]);
          new_date.setHours(0, 0, 0, 0);
          new_date.setHours(24 * tableStatus.time);
          roleSubInfo.status[statusId] = cTools.newLocalDateString(new_date);
          return;
        } else {
          let new_date = cTools.newDate();
          new_date.setHours(0, 0, 0, 0);
          new_date.setHours(24 * tableStatus.time);
          roleSubInfo.status[statusId] = cTools.newLocalDateString(new_date);
        }
        break;
      default:
        break;
    }

    //添加特权
    if (tableStatus.privilege && tableStatus.privilege.length > 0) {
      for (let index = 0; index < tableStatus.privilege.length; index++) {
        const pid = tableStatus.privilege[index];
        cGameCommon.addPrivilege(roleInfo, pid);
      }
    }
  },

  /**
   * 状态是否过期
   * @param roleInfo
   */
  checkStatusTimeOut(roleInfo: RoleInfoEntity) {
    if (!roleInfo || !roleInfo.info) {
      return;
    }

    let roleSubInfo = roleInfo.info;
    let delete_status = clone(roleSubInfo.status);
    for (const sid in delete_status) {
      if (Object.prototype.hasOwnProperty.call(delete_status, sid)) {
        const statusId = Number(sid);
        if (!statusId || !TableStatus.checkHave(statusId)) {
          continue;
        }
        let tableStatus = new TableStatus(statusId);
        if (tableStatus.timetype !== EStatusTimeType.TIME_LIMIT) {
          continue;
        }
        if (!roleSubInfo.status[statusId]) {
          continue;
        }

        let out_time = new Date(roleSubInfo.status[statusId]);
        let cur_time = new Date();
        cur_time.setHours(0, 0, 0, 0);

        let startTime = cur_time.getTime();
        let endTime = out_time.getTime();

        if (startTime < endTime) {
          continue;
        }

        //删除状态
        cGameCommon.removeStatus(roleInfo, statusId);
      }
    }
  },

  /**
   * 删除状态
   * @param roleInfo
   * @param statusId
   */
  removeStatus(roleInfo: RoleInfoEntity, statusId: number) {
    if (!roleInfo || !roleInfo.info) {
      return;
    }

    let roleSubInfo = roleInfo.info;
    if (!statusId || !TableStatus.checkHave(statusId)) {
      return;
    }

    let tableStatus = new TableStatus(statusId);

    if (roleSubInfo.status[statusId]) {
      delete roleSubInfo.status[statusId];
    }

    //删除特权
    if (tableStatus.privilege && tableStatus.privilege.length > 0) {
      for (let index = 0; index < tableStatus.privilege.length; index++) {
        const pid = tableStatus.privilege[index];
        cGameCommon.removePrivilege(roleInfo, pid);
      }
    }
  },

  isHaveStatus(roleInfo: RoleInfoEntity, statusId: number) {
    if (!roleInfo || !roleInfo.info) {
      return false;
    }

    let roleSubInfo = roleInfo.info;
    if (!statusId || !TableStatus.checkHave(statusId)) {
      return false;
    }

    if (!roleSubInfo.status[statusId]) {
      return false;
    }

    let tableStatus = new TableStatus(statusId);

    if (tableStatus.timetype === EStatusTimeType.FOREVER) {
      return true;
    } else if (tableStatus.timetype === EStatusTimeType.TIME_LIMIT) {
      let out_time = new Date(roleSubInfo.status[statusId]);
      let cur_time = new Date();
      cur_time.setHours(0, 0, 0, 0);

      let startTime = cur_time.getTime();
      let endTime = out_time.getTime();

      if (startTime < endTime) {
        return true;
      }

      return false;
    }

    return false;
  },

  /**
   * 添加特权
   * @param roleInfo
   * @param pid
   * @returns
   */
  addPrivilege(roleInfo: RoleInfoEntity, pid: number) {
    if (!roleInfo || !roleInfo.info) {
      return;
    }
    let roleSubInfo = roleInfo.info;

    if (!pid || !TablePrivilegeConfig.checkHave(pid)) {
      return;
    }

    let tablePrivilegeConfig = new TablePrivilegeConfig(pid);

    if (!tablePrivilegeConfig.type || !TablePrivilegeType.checkHave(tablePrivilegeConfig.type)) {
      return;
    }

    let tablePrivilegeType = new TablePrivilegeType(tablePrivilegeConfig.type);
    roleSubInfo.privilege[pid] = roleSubInfo.privilege[pid] || 0;
    switch (tablePrivilegeType.cptype) {
      case EStatusCPType.COUNT:
        roleSubInfo.privilege[pid] += tablePrivilegeConfig.val;
        break;
      case EStatusCPType.SWITCH:
        roleSubInfo.privilege[pid] += 1;
        break;
      default:
        break;
    }
  },

  /**
   * 删除特权
   * @param roleInfo
   * @param pid
   */
  removePrivilege(roleInfo: RoleInfoEntity, pid: number) {
    if (!roleInfo || !roleInfo.info) {
      return;
    }
    let roleSubInfo = roleInfo.info;

    if (!pid || !TablePrivilegeConfig.checkHave(pid)) {
      return;
    }

    let tablePrivilegeConfig = new TablePrivilegeConfig(pid);

    if (
      !tablePrivilegeConfig.type ||
      !TablePrivilegeType.checkHave(tablePrivilegeConfig.type)
    ) {
      return;
    }

    let tablePrivilegeType = new TablePrivilegeType(tablePrivilegeConfig.type);
    roleSubInfo.privilege[pid] = roleSubInfo.privilege[pid] || 0;
    switch (tablePrivilegeType.cptype) {
      case EStatusCPType.COUNT:
        roleSubInfo.privilege[pid] -= tablePrivilegeConfig.val;
        break;
      case EStatusCPType.SWITCH:
        roleSubInfo.privilege[pid] -= 1;
        break;
      default:
        break;
    }

    if (roleSubInfo.privilege[pid] <= 0) {
      delete roleSubInfo.privilege[pid];
    }
  },

  /** 是否又拥有这个特权 */
  getIsHavePrivilege(roleInfo: RoleInfoEntity, ptype: number) {
    if (!roleInfo || !roleInfo.info) {
      return 0;
    }
    let roleSubInfo = roleInfo.info;

    for (const pid in roleSubInfo.privilege) {
      if (Object.prototype.hasOwnProperty.call(roleSubInfo.privilege, pid)) {
        const count = roleSubInfo.privilege[pid];
        if (count <= 0) {
          continue;
        }
        const pid_int = Number(pid);
        if (!TablePrivilegeConfig.checkHave(pid_int)) {
          continue;
        }
        let tablePrivilegeConfig = new TablePrivilegeConfig(pid_int);
        if (
          !tablePrivilegeConfig.type ||
          !TablePrivilegeType.checkHave(tablePrivilegeConfig.type)
        ) {
          continue;
        }

        if (tablePrivilegeConfig.type === ptype) {
          return count;
        }
      }
    }
    return 0;
  },

  /**获取该系统 特权列表下 添加道具参数*/
  getPrivilegeAddItem(roleInfo: RoleInfoEntity, systemid: number) {
    if (!roleInfo || !roleInfo.info) {
      return;
    }
    let roleSubInfo = roleInfo.info;
    let add_items: ItemsRecord = {};
    for (const pid in roleSubInfo.privilege) {
      if (Object.prototype.hasOwnProperty.call(roleSubInfo.privilege, pid)) {
        const count = roleSubInfo.privilege[pid];
        if (count <= 0) { continue; }
        const pid_int = Number(pid);

        if (!TablePrivilegeConfig.checkHave(pid_int)) { continue; }
        let tablePrivilegeConfig = new TablePrivilegeConfig(pid_int);
        if (!tablePrivilegeConfig.type || !TablePrivilegeType.checkHave(tablePrivilegeConfig.type)) { continue; }
        if (tablePrivilegeConfig.systemid !== systemid) { continue; }

        if (tablePrivilegeConfig.type === TablePrivilegeType.add_item) {
          add_items[tablePrivilegeConfig.param] = add_items[tablePrivilegeConfig.param] || 0;
          add_items[tablePrivilegeConfig.param] += tablePrivilegeConfig.val;
        }
      }
    }
    return add_items;
  },

  /**获取该系统 特权列表下 道具额外加成参数*/
  getPrivilegeAddItemBonus(roleInfo: RoleInfoEntity, systemid: number) {
    if (!roleInfo || !roleInfo.info) { return; }
    let roleSubInfo = roleInfo.info;
    let add_items: ItemsRecord = {};
    for (const pid in roleSubInfo.privilege) {
      if (Object.prototype.hasOwnProperty.call(roleSubInfo.privilege, pid)) {
        const count = roleSubInfo.privilege[pid];

        if (count <= 0) { continue; }

        const pid_int = Number(pid);
        if (!TablePrivilegeConfig.checkHave(pid_int)) {
          continue;
        }
        let tablePrivilegeConfig = new TablePrivilegeConfig(pid_int);
        if (!tablePrivilegeConfig.type || !TablePrivilegeType.checkHave(tablePrivilegeConfig.type)) {
          continue;
        }

        if (tablePrivilegeConfig.systemid !== systemid) { continue; }

        if (tablePrivilegeConfig.type === TablePrivilegeType.add_item_bonus) {
          add_items[tablePrivilegeConfig.param] = add_items[tablePrivilegeConfig.param] || 0;
          add_items[tablePrivilegeConfig.param] += tablePrivilegeConfig.val;
        }
      }
    }
    return add_items;
  },

  /**获取该系统 指定特权参数*/
  getPrivilegeVal(roleSubInfo: RoleSubInfoEntity, systemid: number, ptype: number, shopid: number = -1,) {
    if (!roleSubInfo) {
      return 0;
    }

    let total_val = 0;
    for (const pid in roleSubInfo.privilege) {
      if (Object.prototype.hasOwnProperty.call(roleSubInfo.privilege, pid)) {
        const count = roleSubInfo.privilege[pid];
        if (count <= 0) {
          continue;
        }
        const pid_int = Number(pid);
        if (!TablePrivilegeConfig.checkHave(pid_int)) {
          continue;
        }
        let tablePrivilegeConfig = new TablePrivilegeConfig(pid_int);
        if (
          !tablePrivilegeConfig.type ||
          !TablePrivilegeType.checkHave(tablePrivilegeConfig.type)
        ) {
          continue;
        }
        if (tablePrivilegeConfig.systemid !== systemid) {
          continue;
        }

        if (ptype === TablePrivilegeType.shop_add_daily_num) {
          if (tablePrivilegeConfig.param !== shopid) {
            continue;
          }
        }

        if (tablePrivilegeConfig.type === ptype) {
          total_val += tablePrivilegeConfig.val;
        }
      }
    }
    return total_val;
  },

  getPSSeasonAward(rank: number) {
    let ps_s_awards = TablePirateShipSeasonRank.getTable();
    let cur_s_award_data: TablePirateShipSeasonRank;
    for (const key in ps_s_awards) {
      if (Object.prototype.hasOwnProperty.call(ps_s_awards, key)) {
        let cur_data = new TablePirateShipSeasonRank(Number(key));
        if (rank >= cur_data.min && rank <= cur_data.max) {
          cur_s_award_data = cur_data;
          break;
        }
      }
    }
    return cur_s_award_data;
  },

  getPSDailyAward(rank: number) {
    let ps_d_awards = TablePirateShipDailyRank.getTable();
    let cur_award_data: TablePirateShipDailyRank;
    for (const key in ps_d_awards) {
      if (Object.prototype.hasOwnProperty.call(ps_d_awards, key)) {
        let cur_data = new TablePirateShipDailyRank(Number(key));
        if (rank >= cur_data.min && rank <= cur_data.max) {
          cur_award_data = cur_data;
          break;
        }
      }
    }

    return cur_award_data;
  },

  getPSRank(roleid: string, rank: SPSRankEntity[]) {

    let rank_id = TableGameConfig.ps_rank_max + 1;
    if (!rank) {
      return rank_id;
    }

    for (let index = 0; index < rank.length; index++) {
      const element = rank[index];
      if (element.id !== roleid) { continue; }
      return index + 1;
    }

    return rank_id;

  },

  getArenaSeasonAward(rank: number) {
    let ps_s_awards = TableArenaSeasonRank.getTable();
    let cur_s_award_data: TableArenaSeasonRank;
    for (const key in ps_s_awards) {
      if (Object.prototype.hasOwnProperty.call(ps_s_awards, key)) {
        let cur_data = new TableArenaSeasonRank(Number(key));
        if (rank >= cur_data.min && rank <= cur_data.max) {
          cur_s_award_data = cur_data;
          break;
        }
      }
    }
    return cur_s_award_data;
  },

  getArenaDailyAward(rank: number) {
    let ps_d_awards = TableArenaDailyRank.getTable();
    let cur_award_data: TableArenaDailyRank;
    for (const key in ps_d_awards) {
      if (Object.prototype.hasOwnProperty.call(ps_d_awards, key)) {
        let cur_data = new TableArenaDailyRank(Number(key));
        if (rank >= cur_data.min && rank <= cur_data.max) {
          cur_award_data = cur_data;
          break;
        }
      }
    }

    return cur_award_data;
  },

  getRankDailyAwards(type: number, rank: number) {
    let d_awards = TableRankAwards.getTable();
    let cur_award_data: TableRankAwards;
    for (const key in d_awards) {
      if (Object.prototype.hasOwnProperty.call(d_awards, key)) {
        let cur_data = new TableRankAwards(Number(key));
        if (cur_data.type == type && rank >= cur_data.min && rank <= cur_data.max) {
          cur_award_data = cur_data;
          break;
        }
      }
    }
    return cur_award_data;
  },
  /**
   * 深渊巨龙每日排行奖励
   * @param rank 
   * @returns 
   */
  getADAward(rank: number) {
    let table_awards = TableAbyssDragonRankAward.getTable();
    let cur_award_data: TableAbyssDragonRankAward;
    for (const key in table_awards) {
      if (Object.prototype.hasOwnProperty.call(table_awards, key)) {
        let cur_data = new TableAbyssDragonRankAward(Number(key));
        if (rank >= cur_data.min && rank <= cur_data.max) {
          cur_award_data = cur_data;
          break;
        }
      }
    }

    return cur_award_data;
  },


  /**
   * 检查并执行角色合服处理逻辑
   * @param retRoleALLInfo 
   * @returns 
   */
  checkRoleMergeServer(retRoleALLInfo: RetRoleALLInfo) {

    // //是否已经合服
    if (!retRoleALLInfo.roleInfo?.merge) {
      return;
    }

    retRoleALLInfo.roleInfo.merge = 0;

    //夺宝赛季重置
    if (retRoleALLInfo.roleSubInfo.pirateShip) {
      //重置
      retRoleALLInfo.roleSubInfo.pirateShip = new PirateShipRoleEntity(retRoleALLInfo.serverInfo.info.pirateShip.season, retRoleALLInfo.serverInfo.info.pirateShip.sTime);
      retRoleALLInfo.roleSubInfo.pirateShip.adddice_time = cTools.newLocalDateString();
      //赛季道具重置
      for (let index = 0; index < gameConst.sp_all_item.length; index++) {
        let item_id = Number(gameConst.sp_all_item[index]);
        if (retRoleALLInfo.roleItem[item_id] != undefined) {
          delete retRoleALLInfo.roleItem[item_id];
        }
      }

      //普通骰子初始化
      retRoleALLInfo.roleItem[TableGameConfig.ps_item_ndice] = TableGameConfig.ps_init_dice;

      //福利宝藏状态重置
      if (retRoleALLInfo.roleSubInfo.status && retRoleALLInfo.roleSubInfo.status[TableStatus.ps_welfare]) {
        delete retRoleALLInfo.roleSubInfo.status[TableStatus.ps_welfare];
      }

      //福利商品状态重置
      if (retRoleALLInfo.roleSubInfo.buyItemTag && retRoleALLInfo.roleSubInfo.buyItemTag.alwayTag && retRoleALLInfo.roleSubInfo.buyItemTag.alwayTag[TableGameConfig.ps_welfare_shopid]) {
        delete retRoleALLInfo.roleSubInfo.buyItemTag.alwayTag[TableGameConfig.ps_welfare_shopid];
      }

    }


    //竞技场赛季重置
    if (retRoleALLInfo.roleSubInfo.arenaInfo) {
      retRoleALLInfo.roleSubInfo.arenaInfo = new ArenaInfo(retRoleALLInfo.serverInfo.info.arenaData.season, retRoleALLInfo.serverInfo.info.arenaData.sTime, TableGameConfig.arena_count);
    }

    //深渊BOSS重置
    if (retRoleALLInfo.roleSubInfo.reDayInfo) {
      //统一用一个默认数值
      let new_reDayInfo = new ReDayInfo();
      retRoleALLInfo.roleSubInfo.reDayInfo.ad_awardTag = new_reDayInfo.ad_awardTag;
      retRoleALLInfo.roleSubInfo.reDayInfo.ad_damage = new_reDayInfo.ad_damage;
    }

  },

  //新系统相关处理
  async setNewSystem(newSystem: any, new_system: any, rawData: any, gameDataService: GameDataService, roleKeyDto: RoleKeyDto, req: any) {

    async function gAdditem(items: ItemsRecord, new_msg: RESChangeMsg) {
      // console.log('>>', items)
      let dropDataEntity = await cGameCommon.addItem(roleKeyDto, items, gameDataService);
      cGameCommon.hanleDropMsg(dropDataEntity, new_msg);
      gameDataService.sendLog(req, new_msg);
      if (rawData.additem) {
        rawData.additem = Object.assign({}, rawData.additem, new_msg.additem)
      }
      else {
        if (new_msg.additem) {
          rawData.additem = new_msg.additem;
        }
      }
    }
    if (new_system || newSystem) {
      for (const key in newSystem) {
        if (Object.prototype.hasOwnProperty.call(newSystem, key)) {
          new_system = new_system || {}
          new_system[Number(key)] = newSystem[key];
        }
      }
      //夺宝大作战处理 特殊处理添加道具
      if (new_system[TableGameSys.pirateShip] !== undefined) {
        let items = {}
        let new_msg = new RESChangeMsg();
        languageConfig.setActTypeSuccess(EActType.PS_INIT, new_msg);
        items[TableGameConfig.ps_item_ndice] = TableGameConfig.ps_init_dice;
        await gAdditem(items, new_msg)
      }
      //佣兵 特殊处理添加道具
      if (new_system[TableGameSys.mercenary] !== undefined) {
        let items = {}
        let new_msg = new RESChangeMsg();
        new_msg.msg = '佣兵初始化送道具'
        items[TableGameConfig.mercenary_data.itemid] = TableGameConfig.mercenary_max;
        await gAdditem(items, new_msg)
      }
      //角斗
      if (new_system[TableGameSys.wrestle] !== undefined) {
        let items = {}
        let new_msg = new RESChangeMsg();
        new_msg.msg = '角斗初始化送道具'
        let init_item = TableGameConfig.wrestle_init_item;
        for (let index = 0; index < init_item.length; index++) {
          const element = init_item[index];
          items[element.i] = element.n;
        }
        await gAdditem(items, new_msg)
      }
    }
  },

  getRareMonsterSkill(roleInfo: RoleInfoEntity) {
    let raremst = roleInfo.info.raremst;
    if (raremst == undefined || !!raremst.fight || raremst.use || !raremst.fight[raremst.use]) { return; }

    let skill_list: number[] = [];

    for (let mid of raremst.fight[raremst.use]) {
      let d = new TableRareMonster(mid);
      if (d != undefined && d.skill > 0) {
        skill_list.push(d.skill);
      }
    }

    return skill_list;
  },



};
