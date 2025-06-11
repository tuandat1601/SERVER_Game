import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { GameCacheService } from '../game-lib/gamecache/gamecache.service';
import { PrismaGameDBService } from '../game-lib/prisma/prisma.gamedb.service';
import { Role, RoleEquip, RoleHero, RoleInfo, RoleItem } from '@prisma/client1';
import { UpdateRoleDto } from './role/dto/update-role.dto';
import { SnowflakeIdv1 } from 'simple-flakeid';
import { GameLoginDto, NotifyLoginDto } from '../game-system/login/dto/game-login.dto';
import { TableGameConfig } from '../config/gameTable/TableGameConfig';
import { RoleKeyDto, RoleUserDto } from './role/dto/role-key.dto';
import { TableGameHero } from '../config/gameTable/TableGameHero';
import { RoleEntity } from './entity/role.entity';
import { ReDayInfo, RoleInfoEntity, RoleRechargeInfo, RoleSubInfoEntity, } from './entity/roleinfo.entity';
import { SkillSystemEntity } from './entity/skill.entity';
import { HeroEntity, HerosRecord, HeroStateRecord } from './entity/hero.entity';
import { REMsg, RESChangeMsg, RESLoginMsg } from './entity/msg.entity';
import { cpHero } from '../game-system/hero/hero-cpattr';
import { EBoxEntity, SBoxEntity } from './entity/ebox.entity';
import { ItemsRecord } from './entity/item.entity';
import { gameConst } from '../config/game-const';
import { cTools } from '../game-lib/tools';
import { EActType, EArenaSatate, EChatType, EEmailState, EGameRankType, EGameRoleStatus, EGameRunState, EGuildPost, EObjtype, EquipAddType, ETaskType } from '../config/game-enum';
import { EmailEntity, EmailList } from './entity/email.entity';
import { EquipAddRecord, EquipEntity, EquipEntityRecord } from './entity/equip.entity';
import { syshero } from '../game-system/hero/hero-lvup';
import { cGameCommon, RetRoleALLInfo } from '../game-system/game-common';
import { ChatLogEntity, RoleAddExp, SetDailyEntity } from './entity/common.entity';
import { BuyItemTag, RechargeShop } from './entity/shop.entity';
import { ServerInfoEntity, ServerSubInfoEntity } from './entity/server-info.entity';
import { cGameServer } from '../game-system/game-server';
import { GameConfigService } from '../game-config/game-config.service';
import { LogbullService } from '../game-lib/logbull/logbull.service';
import { cItemBag } from '../game-system/item/item-bag';
import { cTaskSystem } from '../game-system/task/task-sytem';
import { TableWelfareDailyAward } from '../config/gameTable/TableWelfareDailyAward';
import { PirateShipRoleEntity } from './entity/pirateShip.entity';
import { SendEmailDto } from '../game-system/email/dto/email-system.dto';
import { languageConfig } from '../config/language/language';
import { TableGameSys } from '../config/gameTable/TableGameSys';
import { Logger } from '../game-lib/log4js';
import { clone, cloneDeep } from 'lodash';
import { ArenaLogEntity, ArenaEntity, ServerArenaRankRecord, RoleShowInfoEntity, RoleShowInfoRecord, ArenaServerInfo, ArenaInfo } from './entity/arena.entity';
import { TableGameEquip } from '../config/gameTable/TableGameEquip';
import { TableGameEquipQuality } from '../config/gameTable/TableGameEquipQuality';
import { TableGameEquipAdd } from '../config/gameTable/TableGameEquipAdd';
import { TableRoleName } from '../config/gameTable/TableRoleName';
import { PrismaBackendDBService } from '../game-lib/prisma/prisma.backend.service';
import { EBServerStatus } from 'apps/web-backend/src/backend-enum';
import { TableGameItem } from '../config/gameTable/TableGameItem';
import { GameRankEntity, GameRankRecord } from './entity/rank.entity';
import { TableStatus } from '../config/gameTable/TableStatus';
import { TableRoleUpgrade } from '../config/gameTable/TableRoleUpgrade';
import { TableTask } from '../config/gameTable/TableTask';
import { ServerEntity } from 'apps/web-backend/src/entity/server.entity';
import { getCross_ArenaInfo_RKey, getCross_ArenaRank2_Key, getCross_ArenaRank_RKey } from 'apps/web-cross-server/src/common/redis-key';
import { GuildEntity, GuildInfoEntity, GuildRecord } from './entity/guild.entity';



const SAVE_TIME = 30 * 60;
const def_timeout = 60; //60 秒的 防御缓存穿透

let GAME_SKU = process.env.GAME_SKU;

//防止redis集中到期
export function getRandomSaveTime() {
  return SAVE_TIME + Math.floor(Math.random() * 5 * 60);
}

/**角色单独用的KEY */
//待处理 redis key 表格化
export function getRoleKey(roleKeyDto: RoleKeyDto) {
  //return roleKeyDto.id + '_role_' + roleKeyDto.serverid;
  return `${GAME_SKU}_${roleKeyDto.serverid}_${roleKeyDto.id}_role`;
}

export function getRoleHeroKey(roleKeyDto: RoleKeyDto) {
  //return roleKeyDto.id + '_rhero_' + roleKeyDto.serverid;
  return `${GAME_SKU}_${roleKeyDto.serverid}_${roleKeyDto.id}_rhero`;
}

export function getRoleInfoKey(roleKeyDto: RoleKeyDto) {
  //return roleKeyDto.id + '_rinfo_' + roleKeyDto.serverid;
  return `${GAME_SKU}_${roleKeyDto.serverid}_${roleKeyDto.id}_rinfo`;
}

export function getRoleItemKey(roleKeyDto: RoleKeyDto) {
  //return roleKeyDto.id + '_ritem_' + roleKeyDto.serverid;
  return `${GAME_SKU}_${roleKeyDto.serverid}_${roleKeyDto.id}_ritem`;
}

export function getRoleEquipKey(roleKeyDto: RoleKeyDto) {
  //return roleKeyDto.id + '_requip_' + roleKeyDto.serverid;
  return `${GAME_SKU}_${roleKeyDto.serverid}_${roleKeyDto.id}_requip`;
}

export function getRoleEmailKey(roleKeyDto: RoleKeyDto) {
  return `${GAME_SKU}_${roleKeyDto.serverid}_${roleKeyDto.id}_email`;
}

export function getRoleJwtKey(roleKeyDto: RoleKeyDto) {
  return `${GAME_SKU}_${roleKeyDto.serverid}_${roleKeyDto.id}_jwt`;
}

/**角色竞技场日志 */
export function getRoleArenaLogKey(roleKeyDto: RoleKeyDto) {
  return `${GAME_SKU}_${roleKeyDto.serverid}_${roleKeyDto.id}_alog`;
}

/**角色跨服竞技场日志 */
export function getRoleCrossArenaLogKey(roleKeyDto: RoleKeyDto) {
  return `${GAME_SKU}_${roleKeyDto.serverid}_${roleKeyDto.id}_cross_alog`;
}

/**角色登录验证 */
export function getRoleGameLoginKey(notifyLoginDto: NotifyLoginDto) {
  return `${GAME_SKU}_${notifyLoginDto.channelType}_${notifyLoginDto.serverid}_${notifyLoginDto.userid}_glKey`;
}


/**服务器 全局KEY */

/**邮件 */
export function getGlobalEmailKey(serverid: number) {
  return `${GAME_SKU}_s${serverid}_email`;
}

/**数据有修改，需要保存的玩家列表 */
export function getSaveDataKey(serverid: number) {
  return `${GAME_SKU}_s${serverid}_save`;
}

/**服务器全局info数据 */
export function getServerInfoKey(serverid: number) {
  return `${GAME_SKU}_s${serverid}_serverInfo`;
}

/**服务器全局 竞技排行榜 */
export function getServerArenaRankKey(serverid: number) {
  return `${GAME_SKU}_s${serverid}_serverArenaRank`;
}
/**服务器全局 竞技排行榜 */
export function getServerArRankKey(serverid: number) {
  return `${GAME_SKU}_s${serverid}_serverArRank`;
}
/**服务器全局 竞技排行榜 */
export function getServerArRank2Key(serverid: number) {
  return `${GAME_SKU}_s${serverid}_serverArRank2`;
}
/**服务器全局 关卡排行榜 */
export function getServerLRankKey(serverid: number) {
  return `${GAME_SKU}_s${serverid}_serverLRank`;
}

/**服务器全局 精英排行榜 */
export function getServerERankKey(serverid: number) {
  return `${GAME_SKU}_s${serverid}_serverERank`;
}

/**服务器全局 深渊巨龙排行榜 */
export function getServerADRankKey(serverid: number) {
  return `${GAME_SKU}_s${serverid}_serverADRank`;
}

/**服务器全局 魔渊排行榜 */
export function getServerDARankKey(serverid: number) {
  return `${GAME_SKU}_s${serverid}_serverDARank`;
}

/**服务器全局 王者角斗排行榜 */
export function getServerWRankKey(serverid: number) {
  return `${GAME_SKU}_s${serverid}_serverWRank`;
}

/**服务器全局 角色信息库 */
export function getSRinfoKey(serverid: number) {
  return `${GAME_SKU}_s${serverid}_SRinfo`;
}

/**服务器全局 所有在线角色列表 */
export function getServerOnlineKey(serverid: number) {
  return `${GAME_SKU}_s${serverid}_online`;
}

/**数据库节点需要处理保存的服务器ID*/
export function getDataServerIdsKey() {
  return `${GAME_SKU}_${process.env.RUNNING_ENV}_data${cTools.getDataNodeId()}_sids`;
}

/**合服信息*/
export function getMergeServerInfoKey() {
  return `${GAME_SKU}_merge`;
}

/**全服聊天 */
export function getGlobalChatKey(serverid: number) {
  return `${GAME_SKU}_s${serverid}_schat`;
}

/**公会聊天 */
export function getGuildChatKey(serverid: number, guildid: string) {
  return `${GAME_SKU}_s${serverid}_gchat_${guildid}`;
}

/**等待加入角色信息中心的 role id 数组 */
export function getAddSRInfoKey(serverid: number) {
  return `${GAME_SKU}_s${serverid}_AddSRinfo`;
}

/**服务器全局公会数据 */
export function getGuildInfoKey(serverid: number) {
  return `${GAME_SKU}_s${serverid}_guild`;
}
/**服务器全局公会数据 */
export function getGuildInfoHmKey(serverid: number) {
  return `${GAME_SKU}_s${serverid}_guild_hm`;
}

export class GetRoleALLInfoDto {
  constructor(roleKeyDto: RoleKeyDto) {
    this.roleKeyDto = roleKeyDto;
  }

  roleKeyDto: RoleKeyDto;

  need_roleInfo: boolean = false;
  need_roleHero: boolean = false;
  need_roleItem: boolean = false;
  need_roleEquip: boolean = false;
  need_serverInfo: boolean = true;
}

@Injectable()
export class GameDataService {
  public snowflakeIdv1: SnowflakeIdv1;
  public equipGenID: SnowflakeIdv1;
  constructor(
    private readonly gameCacheService: GameCacheService,
    private readonly prismaGameDB: PrismaGameDBService,
    private readonly gameConfigService: GameConfigService,
    private readonly logbullService: LogbullService,
    private readonly prismaBackendDB: PrismaBackendDBService,
  ) {
    this.init();
  }

  async init() {
    const workerId = process.env.WORKER_ID == undefined ? 1 : Number(process.env.WORKER_ID);

    this.snowflakeIdv1 = new SnowflakeIdv1({
      workerId: workerId,
      workerIdBitLength: Number(process.env.roleid_workerIdBitLength),
      baseTime: Number(process.env.roleid_baseTime),
      seqBitLength: Number(process.env.roleid_eqBitLength),
    });

    this.equipGenID = new SnowflakeIdv1({
      workerId: workerId,
      workerIdBitLength: Number(process.env.equipid_workerIdBitLength),
      baseTime: Number(process.env.equipid_baseTime),
      seqBitLength: Number(process.env.equipid_eqBitLength),
      topOverCostCount: 1000,
    })
  }

  /**
 * 获取装备唯一ID
 * @returns
 */
  getEquipEID() {
    return String(this.equipGenID.NextNumber())
  }

  getGameCacheService() {
    return this.gameCacheService;
  }

  getPrismaBackendDB() {
    return this.prismaBackendDB;
  }

  getPrismaGameDB() {
    return this.prismaGameDB;
  }


  /**
 * 随机获取词条属性
 * @param addId 词条ID
 * @returns "{"i":24,"v":1000}"
 */
  randomEquipAddAttr(addId: number) {

    let random_val = null
    let equip_add_table = new TableGameEquipAdd(addId);
    if (equip_add_table.rolltype == EquipAddType.NORMAL) {
      let attr_ary: any[] = equip_add_table.attr;
      random_val = attr_ary[Math.floor(Math.random() * attr_ary.length)];
      return random_val;
    }
    return random_val;
  }

  /**
   * 创建一个装备
   * @param equipId 装备ID
   * @param quality 品质
   */
  createEquip(equipId: number, quality: number) {

    if (!TableGameEquip.getVal(equipId, TableGameEquip.field_pos)) { return null; }
    let equip_table = new TableGameEquip(equipId);
    let equipQuality = new TableGameEquipQuality(quality)
    let bper = Math.floor(Math.random() * equipQuality.range1);
    let add_attr: EquipAddRecord;

    if (equipQuality.range2 > 0 && TableGameEquipAdd.getVal(equip_table.add1, TableGameEquipAdd.field_rolltype)) {
      //随机词条1
      let add_attr1 = this.randomEquipAddAttr(equip_table.add1);
      if (add_attr1) {
        add_attr = {}
        add_attr["1"] = { [add_attr1[gameConst.table_id]]: add_attr1[gameConst.table_val] };
      }

    }

    if (equipQuality.range3 > 0 && TableGameEquipAdd.getVal(equip_table.add2, TableGameEquipAdd.field_rolltype)) {
      //随机词条2
      let add_attr2 = this.randomEquipAddAttr(equip_table.add2);
      if (add_attr2) {
        add_attr = add_attr || {};
        add_attr["2"] = { [add_attr2[gameConst.table_id]]: add_attr2[gameConst.table_val] };
      }
    }

    let equipEntity: EquipEntity = {
      id: equipId,
      qid: quality,
      eid: this.getEquipEID(),
      bper: bper,
    }

    if (add_attr != undefined) { equipEntity.add = add_attr; }
    return equipEntity;
  }

  getGameConfigService() {
    return this.gameConfigService;
  }

  /**
   * 根据需要获取角色数据
   * @param getRoleALLInfoDto
   * @param isFindDB
   * @param save_time
   * @returns
   */
  async getRoleAllInfo(getRoleALLInfoDto: GetRoleALLInfoDto, isFindDB: Boolean = false, save_time: number = SAVE_TIME) {
    let retRoleALLInfo: RetRoleALLInfo = new RetRoleALLInfo(this);

    if (getRoleALLInfoDto.need_roleInfo) {
      //获取角色游戏信息
      retRoleALLInfo.roleInfo = await this.getRoleInfo(getRoleALLInfoDto.roleKeyDto, isFindDB, save_time);
      if (retRoleALLInfo.roleInfo) {
        retRoleALLInfo.roleSubInfo = retRoleALLInfo.roleInfo.info;
      }
      retRoleALLInfo.need_roleInfo = true;
    }

    if (getRoleALLInfoDto.need_roleHero) {
      //获取英雄信息
      let hero_data = await this.getRoleHero(getRoleALLInfoDto.roleKeyDto, isFindDB, save_time);
      if (hero_data && hero_data.info) {
        retRoleALLInfo.roleHero = <HerosRecord>(<unknown>hero_data.info);
      }
      retRoleALLInfo.need_roleHero = true;
    }

    if (getRoleALLInfoDto.need_roleItem) {
      //获取角色道具信息
      retRoleALLInfo.roleItem = await this.getRoleItemInfo(getRoleALLInfoDto.roleKeyDto, isFindDB, save_time);
      retRoleALLInfo.need_roleItem = true;
    }

    if (getRoleALLInfoDto.need_roleEquip) {
      //获取角色装备数据
      retRoleALLInfo.roleEquip = await this.getRoleEquipInfo(getRoleALLInfoDto.roleKeyDto, isFindDB, save_time,);
      retRoleALLInfo.need_roleEquip = true;
    }

    if (getRoleALLInfoDto.need_serverInfo) {
      //服务器全局数据
      retRoleALLInfo.serverInfo = await this.gameCacheService.getJSON(getServerInfoKey(getRoleALLInfoDto.roleKeyDto.serverid));
      retRoleALLInfo.need_serverInfo = true;
    }

    return retRoleALLInfo;
  }

  //角色登录
  async loginRole(req: any, gameLoginDto: GameLoginDto) {


    let roleUserDto: RoleUserDto = {
      userid: gameLoginDto.username,
      originServerid: gameLoginDto.serverid,
    };

    let cur_save_time = getRandomSaveTime();

    let var_role: Role = await this.getRoleByUserId(roleUserDto, cur_save_time);
    //console.log("111111 var_role=",var_role)
    let roleHero: any = {};
    let roleInfo: any = {};
    let roleItem: any = {};
    let roleEquip: any = {};
    let roleKeyDto: RoleKeyDto;
    let is_new_role = false;
    let role_emails = {};

    if (!var_role) {
      is_new_role = true;
      //没有就创建一个新角色
      //创建角色基础数据
      var_role = await this.createRole(roleUserDto, cur_save_time);
      //console.log("222222 var_role=",var_role)
      roleKeyDto = {
        id: var_role.id,
        serverid: var_role.serverid,
      };

      //创建初始化英雄
      roleHero = await this.createRoleHero(roleKeyDto, cur_save_time);
      //创建角色综合数据
      roleInfo = await this.createRoleInfo(roleKeyDto, cur_save_time);
      //创建角色道具数据
      roleItem = await this.createRoleItem(roleKeyDto, cur_save_time);
      //创建角色装备数据
      roleEquip = await this.createRoleEquip(roleKeyDto, cur_save_time);

    } else {
      //有数据 更新过期时间
      roleKeyDto = {
        id: var_role.id,
        serverid: var_role.serverid,
      };

      //更新获取角色基础信息
      //获取英雄信息
      roleHero = await this.getRoleHero(roleKeyDto, true, cur_save_time);
      //获取角色游戏信息
      roleInfo = await this.getRoleInfo(roleKeyDto, true, cur_save_time);
      //获取角色道具信息
      roleItem = await this.getRoleItem(roleKeyDto, true, cur_save_time);
      //获取角色装备数据
      roleEquip = await this.getRoleEquip(roleKeyDto, true, cur_save_time);

      //拉取角色邮件数据
      role_emails = await this.getRoleEmail(roleKeyDto, true, cur_save_time);
    }

    let resLoginMsg: RESLoginMsg = new RESLoginMsg();
    if (!var_role || !roleHero || !roleInfo || !roleItem || !roleEquip) {
      resLoginMsg.msg = 'role is null';
      return resLoginMsg;
    }

    if (var_role.status === EGameRoleStatus.DISABLE) {
      throw new HttpException(languageConfig.tip.role_forbidden, HttpStatus.FORBIDDEN);
    }

    let retRoleALLInfo: RetRoleALLInfo = new RetRoleALLInfo(this);
    retRoleALLInfo.need_roleInfo = true;
    retRoleALLInfo.need_roleHero = true;
    retRoleALLInfo.need_roleItem = true;
    retRoleALLInfo.need_roleEquip = true;
    retRoleALLInfo.roleInfo = roleInfo;
    retRoleALLInfo.roleSubInfo = roleInfo?.info;
    retRoleALLInfo.roleHero = roleHero?.info;
    retRoleALLInfo.roleEquip = roleEquip?.info;
    retRoleALLInfo.roleItem = roleItem?.info;

    retRoleALLInfo.serverInfo = await this.gameCacheService.getJSON(getServerInfoKey(var_role.serverid));
    retRoleALLInfo.roleSubInfo.name = var_role.name;
    retRoleALLInfo.roleSubInfo.roleid = var_role.id;
    retRoleALLInfo.roleSubInfo.serverid = var_role.serverid;

    if (!retRoleALLInfo.isHaveData()) {
      resLoginMsg.msg = retRoleALLInfo.getRetMsg();
      return resLoginMsg;
    }
    let cross_arenaInfo: ArenaServerInfo = await this.gameCacheService.getJSON(getCross_ArenaInfo_RKey(retRoleALLInfo.serverInfo.info.crossServerId));
    cGameCommon.loginInitRoleInfo(retRoleALLInfo, cross_arenaInfo);

    resLoginMsg.isCreateRole = is_new_role;
    let save_item = false;
    if (!is_new_role) {
      //拉取角色竞技场挑战日志数据
      if (retRoleALLInfo.serverInfo && retRoleALLInfo.serverInfo.info
        && retRoleALLInfo.serverInfo.info.arenaData
        && retRoleALLInfo.serverInfo.info.arenaData.season != undefined
        && retRoleALLInfo.roleSubInfo.arenaInfo) {
        let arenaData = retRoleALLInfo.serverInfo.info.arenaData;
        await this.getRoleArenaLog(arenaData.season, roleKeyDto, true);
      }

      //跨服竞技场
      if (retRoleALLInfo.serverInfo && retRoleALLInfo.serverInfo.info && retRoleALLInfo.serverInfo.info.crossServerId) {
        let cross_arenaInfo: ArenaServerInfo = await this.gameCacheService.getJSON(getCross_ArenaInfo_RKey(retRoleALLInfo.serverInfo.info.crossServerId));
        if (cross_arenaInfo) {
          await this.getRoleCrossArenaLog(cross_arenaInfo.season, retRoleALLInfo.serverInfo.info.crossServerId, roleKeyDto, true);
        }
      }


      //每日重置处理
      let cur_time = cTools.newDate();
      let last_login_date = new Date(retRoleALLInfo.roleSubInfo.lastlogintime);
      if (cTools.isNewDay(last_login_date, cur_time)) {
        await this.resetDaily(retRoleALLInfo, new SetDailyEntity(), req);
        if (retRoleALLInfo.roleItem) {
          save_item = true;
        }
      }
      retRoleALLInfo.roleSubInfo.lastlogintime = cTools.newLocalDateString();

      role_emails = await this.getRoleEmail(roleKeyDto);
      //邮件小红点
      if (role_emails && Object.keys(role_emails).length > 0) {
        for (const key in role_emails) {
          if (Object.prototype.hasOwnProperty.call(role_emails, key)) {
            let element: EmailEntity = role_emails[key];
            if (element.state <= EEmailState.UNREAD) {
              resLoginMsg.redDot = resLoginMsg.redDot || {}
              resLoginMsg.redDot[TableGameSys.email] = true;
              break;
            }
            else if (element.items && Object.keys(element.items).length > 0 && element.state <= EEmailState.READ) {
              resLoginMsg.redDot = resLoginMsg.redDot || {}
              resLoginMsg.redDot[TableGameSys.email] = true;
              break;
            }
          }
        }
      }

      //公会红点
      let rguild = retRoleALLInfo?.roleSubInfo?.guild;
      if (rguild?.guildid) {
        let guild: GuildEntity = await this.gameCacheService.getHash(getGuildInfoHmKey(var_role.serverid), rguild.guildid);
        if (guild?.info?.member) {
          let result = guild.info.member.find(item => (item.post === EGuildPost.LEADER && item.id === var_role.id))
          if (result && guild?.info?.unMember && guild.info.unMember.length > 0) {
            resLoginMsg.redDot = resLoginMsg.redDot || {}
            resLoginMsg.redDot[TableGameSys.guild] = true;
          }
        }
      }

      //合服检测
      if (!save_item) {
        if (retRoleALLInfo.roleInfo.merge == 1) {
          save_item = true;
        }
      }
      cGameCommon.checkRoleMergeServer(retRoleALLInfo);
    }


    //是否有新系统开启
    let new_system = cGameCommon.checkOpenNewSystem(retRoleALLInfo);
    if (new_system) {
      resLoginMsg.roleAddExp = new RoleAddExp();
      resLoginMsg.roleAddExp.newSystem = new_system;
    }
    //新系统相关处理
    cGameCommon.setNewSystem(resLoginMsg.roleAddExp?.newSystem, new_system, resLoginMsg, this, roleKeyDto, req);

    //任务修正
    await this.taskRevision(retRoleALLInfo)

    //是否有已经支付未获取奖励的订单
    let orderIds = await this.prismaBackendDB.orders.findMany(
      {
        where: {
          serverId: roleUserDto.originServerid,
          gameUserId: var_role.userid,
          gameRoleId: var_role.id,
          paid: 1,
          delivered: 0
        }
      }
    )

    if (orderIds && orderIds.length > 0) {
      resLoginMsg.orderIds = [];
      for (let index = 0; index < orderIds.length; index++) {
        const element = orderIds[index];
        resLoginMsg.orderIds.push(element.id);
      }
    }

    if (save_item) {
      await this.updateRoleItem(roleKeyDto, retRoleALLInfo.roleItem);
    }

    //排行榜更新
    {
      if (retRoleALLInfo.roleInfo?.gamelevels ?? 0 > 0) {
        await this.changeServerRankByType(retRoleALLInfo, EGameRankType.LEVEL, retRoleALLInfo.roleInfo.gamelevels);
      }
      if (retRoleALLInfo.roleInfo.info?.elitelevels ?? 0 >= TableGameConfig.el_rank_open) {
        await this.changeServerRankByType(retRoleALLInfo, EGameRankType.ELITE, retRoleALLInfo.roleInfo.info.elitelevels);
      }
      if (retRoleALLInfo.roleSubInfo?.demonAbyss?.da_levels ?? 0 >= TableGameConfig.da_rank_open) {
        await this.changeServerRankByType(retRoleALLInfo, EGameRankType.DEMONABYSS, retRoleALLInfo.roleSubInfo.demonAbyss.da_levels);
      }
      if (retRoleALLInfo.roleSubInfo?.wrestle?.id ?? 0 >= TableGameConfig.w_rank_open) {
        await this.changeServerRankByType(retRoleALLInfo, EGameRankType.WRESTLE, retRoleALLInfo.roleSubInfo.wrestle.id);
      }
    }

    await this.updateRoleInfo(roleKeyDto, retRoleALLInfo.roleInfo);
    await this.updateRoleHero(roleKeyDto, retRoleALLInfo.roleHero);
    //更新信息
    await this.setUpdateDate(roleKeyDto);

    // console.log("roleHero:", roleHero)
    // console.log("roleInfo:", roleInfo)
    // console.log("roleItem:", roleItem)
    // console.log("roleEquip:", roleEquip)
    // console.log("var_role:", var_role)
    resLoginMsg.role = {
      id: var_role.id,
      name: var_role.name,
      userid: var_role.userid,
      serverid: var_role.serverid,
      status: var_role.status,
    };

    resLoginMsg.hero = roleHero.info;

    for (const heroid in resLoginMsg.hero) {
      if (Object.prototype.hasOwnProperty.call(resLoginMsg.hero, heroid)) {
        let hero_entity = resLoginMsg.hero[heroid];
        if (hero_entity?.curHP) {
          delete hero_entity.curHP;
        }

        hero_entity.id = Number(heroid);
        cpHero.cpHeroAttr(hero_entity, roleInfo.info)

        if (hero_entity?.id) {
          //delete hero_entity.id;
        }
      }
    }

    delete roleInfo.id;
    delete roleInfo.updatedAt;

    resLoginMsg.info = roleInfo;

    resLoginMsg.item = roleItem.info;
    resLoginMsg.equipbag = roleEquip.info;
    resLoginMsg.openServerTime = retRoleALLInfo.serverInfo.info.startTime;
    languageConfig.setActTypeSuccess(EActType.LOGIN, resLoginMsg);
    return resLoginMsg;
  }

  async taskRevision(retRoleALLInfo: RetRoleALLInfo) {
    if (!retRoleALLInfo.isHaveData()) {
      return;
    }
    //修正 主线任务
    let taskMain = retRoleALLInfo.roleSubInfo?.taskMain
    if (taskMain?.curEntity) {
      let change = false;
      let target_ary = TableTask.getVal(taskMain.curEntity.id, TableTask.field_target);
      for (let index = 0; index < target_ary.length; index++) {
        const element = target_ary[index];
        if ((taskMain.curEntity.count[element] === undefined)) {
          change = true;
          break;
        }
      }
      if (change) {
        // console.log('taskMain Revision!!', taskMain)
        taskMain.curEntity = cTaskSystem.newTaskEntity(taskMain.curEntity.id, retRoleALLInfo);
      }

    }
    //修正 每日任务
    let taskDaily = retRoleALLInfo.roleSubInfo?.taskDaily
    let task_data = TableTask.getTable()
    let reset = false;
    for (const taskid in task_data) {
      if (Object.prototype.hasOwnProperty.call(task_data, taskid)) {
        const cur_data = task_data[taskid];
        if (cur_data.type != ETaskType.DAILY) { continue; }
        let taskid_int = Number(taskid);
        if (taskDaily?.tasklist && taskDaily.tasklist[taskid_int]) {
          let dtask = taskDaily.tasklist[taskid_int];
          for (let index = 0; index < cur_data.target.length; index++) {
            const tarid = cur_data.target[index];
            if (dtask.count[tarid] === undefined) {
              reset = true;
              break;
            }
          }
        } else {
          reset = true;
        }
      }
    }
    if (reset) {
      // console.log('taskDaily Revision!!', taskDaily)
      cTaskSystem.initTaskDaily(retRoleALLInfo);
    }


    //修正 进阶任务
    let upgrade = retRoleALLInfo.roleSubInfo?.upgrade
    let taskUpgrade = retRoleALLInfo.roleSubInfo?.taskUpgrade
    if (upgrade && TableRoleUpgrade.checkHave(upgrade)) {
      let init = false;
      let task_ary = TableRoleUpgrade.getVal(upgrade, TableRoleUpgrade.field_task);
      if (!taskUpgrade) {
        init = true;
      }
      else if (task_ary.length != taskUpgrade.length) {
        init = true;
      }
      else {
        for (let index = 0; index < taskUpgrade.length; index++) {
          const element = taskUpgrade[index];
          if (!task_ary.includes(element.id)) {
            init = true;
            break;
          }
        }
      }
      if (init) {
        // console.log('tastupgrade Revision!!', taskUpgrade)
        cTaskSystem.initTaskUpgrade(retRoleALLInfo);
      }
    }

    //修正 隐藏任务
    let taskHide = retRoleALLInfo.roleSubInfo?.taskHide
    if (taskHide === undefined || !taskHide) {
      cTaskSystem.initTaskHide(retRoleALLInfo);
      // console.log('taskHide Revision!!', retRoleALLInfo.roleSubInfo?.taskHide)
    }

  }

  //创建角色
  async createRole(roleUserDto: RoleUserDto, save_time: number,): Promise<Role | null> {

    let mains_serverid = await this.getMainServerIds(roleUserDto.originServerid);

    let dmode = new RoleEntity();
    //获取系统配置名字
    let leth = Object.keys(TableRoleName.table).length;
    let tname = '';
    let temp = TableRoleName.getVal(Math.floor(Math.random() * leth), TableRoleName.field_front);
    if (temp != undefined) tname += temp;
    temp = TableRoleName.getVal(Math.floor(Math.random() * leth), TableRoleName.field_later);
    if (temp != undefined) tname += temp;
    if (tname == '') tname = dmode.name
    //默认数据
    let save_date = cTools.newSaveLocalDate();
    let new_role: Role = {
      //分布式雪花算法
      id: String(this.snowflakeIdv1.NextNumber()),
      userid: roleUserDto.userid,
      name: tname, //dmode.name,
      serverid: mains_serverid,
      status: EGameRoleStatus.NORMAL,
      originServerid: roleUserDto.originServerid,
      createdAt: save_date,
      updatedAt: save_date,
    };

    let var_role = await this.prismaGameDB.role.create({
      data: new_role,
    });

    if (var_role) {
      delete new_role.createdAt;
      delete new_role.updatedAt;
      await this.gameCacheService.setJSON(getRoleKey({ serverid: new_role.serverid, id: new_role.id }), new_role, save_time);
    }

    return var_role;
  }

  //获取角色
  async getRoleByUserId(roleUserDto: RoleUserDto, save_time: number,): Promise<Role | null> {
    let var_role: Role = await this.prismaGameDB.role.findFirst({
      where: {
        originServerid: roleUserDto.originServerid,
        userid: roleUserDto.userid,
      },
    });

    if (var_role) {
      const var_key = getRoleKey({
        id: var_role.id,
        serverid: var_role.serverid,
      });

      let role = await this.gameCacheService.getJSON(var_key);

      if (role) {
        //在线
        var_role = role;
      }
      else {
        //不在线
        delete var_role.createdAt;
        delete var_role.updatedAt;
        await this.gameCacheService.setJSON(var_key, var_role, save_time);
      }
    } else {
      // //防御 缓存穿透
      // await this.gameCacheService.setJSON(var_key,{},save_time)
      return null;
    }

    return var_role;
  }

  //获取角色
  async getRole(roleKeyDto: RoleKeyDto, isFindDB: Boolean = false, save_time: number = SAVE_TIME, isSave: boolean = true): Promise<Role | null> {
    //return `This action returns a #${id} role`;
    let var_role: any;

    const var_key = getRoleKey(roleKeyDto);
    var_role = await this.gameCacheService.getJSON(var_key);

    if (!var_role) {
      if (isFindDB) {
        var_role = await this.prismaGameDB.role.findUnique({
          where: {
            id: roleKeyDto.id,
          },
        });

        //防御 缓存穿透
        if (!var_role) {
          return null;
        }

        if (isSave) {
          await this.gameCacheService.setJSON(var_key, var_role, save_time);
        }
        return var_role;
      }

      return null;
    }

    return var_role;
  }

  //更新角色
  async updateRole(updateRoleDto: UpdateRoleDto): Promise<boolean> {
    //return `This action returns a #${id} role`;

    const var_key = getRoleKey(updateRoleDto);
    let cur_role: Role = await this.gameCacheService.getJSON(var_key);

    if (!cur_role) {
      return false;
    }

    cur_role.name = updateRoleDto.name;
    cur_role.status = updateRoleDto.status;
    cur_role.updatedAt = cTools.newSaveLocalDate();

    await this.gameCacheService.setJSON(var_key, cur_role, getRandomSaveTime());
    //待处理
    //刷新 落地MYSQL 标记 或者通知事件

    return true;
  }

  //创建角色信息数据
  async createRoleInfo(roleKeyDto: RoleKeyDto, save_time: number) {
    //获取初始化英雄
    let init_hero = TableGameConfig.initRole;
    let skillSystemEntity: SkillSystemEntity = {
      list: {},
    };

    let heroState: HeroStateRecord = {};

    let init_heroList = TableGameConfig.heroList;

    if (init_heroList) {
      for (let index = 0; index < init_heroList.length; index++) {
        let data = init_heroList[index];
        if (data && data.id) {
          if (data.needlv <= 1) {
            heroState[data.id] = true;
          } else {
            heroState[data.id] = false;
          }
        }
      }
    }

    for (let index = 0; index < init_hero.length; index++) {
      const heroid = init_hero[index];
      let skill_id = TableGameHero.getVal(heroid, TableGameHero.field_skill);
      skillSystemEntity.list[skill_id] = {};
      heroState[heroid] = true;
    }

    //console.log("skillSystemEntity:", skillSystemEntity)

    let ebox: EBoxEntity = {
      lv: 1,
      speCount: 0,
    };

    let sbox: SBoxEntity = {
      speCount: 10,
    };

    let roleSubInfoEntity: RoleSubInfoEntity = {
      fteam: TableGameConfig.initRole,
      skill: skillSystemEntity,
      ebox: ebox,
      sbox: sbox,
      heroState: heroState,
      taskTargetTag: {},
      email: { ids: {}, lasteid: 0 },
      rechargeInfo: new RoleRechargeInfo(),
      lastlogintime: cTools.newLocalDateString(),
      adverts: false,
      buyItemTag: new BuyItemTag(),
      rechargeShop: new RechargeShop(),
      reDayInfo: new ReDayInfo(),

    }

    let new_roleInfo: RoleInfo = {
      id: roleKeyDto.id,
      serverid: roleKeyDto.serverid,
      rolelevel: 1,
      gamelevels: 0,
      exp: 0,
      info: <any>roleSubInfoEntity,
      merge: 0,
      updatedAt: cTools.newSaveLocalDate(),
    };


    let var_roleInfo = await this.prismaGameDB.roleInfo.create({
      data: new_roleInfo,
    });

    //创建成功
    if (var_roleInfo) {
      await this.gameCacheService.setJSON(
        getRoleInfoKey(roleKeyDto),
        new_roleInfo,
        save_time,
      );
      await this.gameCacheService.setJSON(
        getRoleEmailKey(roleKeyDto),
        {},
        save_time,
      );
    }

    //待处理
    //刷新 落地MYSQL 标记 或者通知事件

    return var_roleInfo;
  }

  //更新角色信息数据
  async updateRoleInfo(roleKeyDto: RoleKeyDto, updateRoleInfoDto: RoleInfoEntity) {

    if (!updateRoleInfoDto) {
      return false;
    }

    let key_RoleInfo = getRoleInfoKey(roleKeyDto);

    let cur_RoleInfo: any = await this.gameCacheService.getJSON(key_RoleInfo);

    if (!cur_RoleInfo) {
      return false;
    }

    //console.log("cur_RoleInfo.info:",cur_RoleInfo.info);
    let is_update = false;
    if (updateRoleInfoDto.rolelevel != undefined) {
      is_update = true;
      cur_RoleInfo.rolelevel = updateRoleInfoDto.rolelevel;
    }

    if (updateRoleInfoDto.gamelevels != undefined) {
      is_update = true;
      cur_RoleInfo.gamelevels = updateRoleInfoDto.gamelevels;
    }

    if (updateRoleInfoDto.exp != undefined) {
      is_update = true;
      cur_RoleInfo.exp = updateRoleInfoDto.exp;
    }

    if (updateRoleInfoDto.glpos != undefined) {
      is_update = true;
      cur_RoleInfo.glpos = updateRoleInfoDto.glpos;
    }

    if (updateRoleInfoDto.merge != undefined) {
      is_update = true;
      cur_RoleInfo.merge = updateRoleInfoDto.merge;
    }

    if (updateRoleInfoDto.info != undefined) {
      is_update = true;
      cur_RoleInfo.info = <any>updateRoleInfoDto.info;
    }

    if (!is_update) {
      return false;
    }

    cur_RoleInfo.updatedAt = cTools.newSaveLocalDate();
    await this.gameCacheService.setJSON(key_RoleInfo, cur_RoleInfo, getRandomSaveTime());

    return true;
  }

  //获取角色信息数据
  async getRoleInfo(roleKeyDto: RoleKeyDto, isFindDB: Boolean = false, save_time: number = SAVE_TIME,): Promise<any | null> {
    //return `This action returns a #${id} role`;
    let var_data: any;

    const var_key = getRoleInfoKey(roleKeyDto);
    var_data = await this.gameCacheService.getJSON(var_key);

    if (!var_data) {
      if (isFindDB) {
        var_data = await this.prismaGameDB.roleInfo.findUnique({
          where: {
            id: roleKeyDto.id,
          },
        });

        if (var_data) {
          await this.gameCacheService.setJSON(var_key, var_data, save_time);
        } else {
          // //防御 缓存穿透
          // await this.gameCacheService.setJSON(var_key,{},save_time)
          return null;
        }
      }
    }

    return var_data;
  }

  async getRoleSubInfo(roleKeyDto: RoleKeyDto, isFindDB: Boolean = false, save_time: number = SAVE_TIME,): Promise<RoleSubInfoEntity | null> {
    let roleInfo: RoleInfoEntity = await this.getRoleInfo(roleKeyDto, isFindDB, save_time,);

    if (!roleInfo || !roleInfo.info) {
      return null;
    }

    let roleSubInfoEntity: RoleSubInfoEntity = roleInfo.info;
    return roleSubInfoEntity;
  }

  //创建角色道具数据
  async createRoleItem(roleKeyDto: RoleKeyDto, save_time: number) {
    let itemsRecord: ItemsRecord = {};

    for (const key in TableGameConfig.initItems) {
      if (
        Object.prototype.hasOwnProperty.call(TableGameConfig.initItems, key)
      ) {
        const item_data = TableGameConfig.initItems[key];

        itemsRecord[item_data[gameConst.table_id]] =
          item_data[gameConst.table_num];
      }
    }

    let new_roleInfo: RoleItem = {
      id: roleKeyDto.id,
      serverid: roleKeyDto.serverid,
      info: <any>itemsRecord,
      updatedAt: cTools.newSaveLocalDate(),
    };

    let var_roleItem = await this.prismaGameDB.roleItem.create({
      data: new_roleInfo,
    });

    //创建成功
    if (var_roleItem) {
      await this.gameCacheService.setJSON(getRoleItemKey(roleKeyDto), var_roleItem, save_time);
    }

    //待处理
    //刷新 落地MYSQL 标记 或者通知事件

    return var_roleItem;
  }

  //更新角色道具数据
  async updateRoleItem(roleKeyDto: RoleKeyDto, items: any) {

    if (!items) {
      Logger.error("updateRoleItem items is null");
      return false;
    }

    let key_RoleItem = getRoleItemKey(roleKeyDto);

    let cur_roleItem: RoleItem = await this.gameCacheService.getJSON(key_RoleItem,);

    if (!cur_roleItem) {
      Logger.error("roleItem is null");
      return false;
    }
    if (!cur_roleItem.info) {
      Logger.error("roleItem info is null");
    }
    //console.log("cur_RoleInfo.info:",cur_RoleInfo.info);
    cur_roleItem.info = <any>items;
    cur_roleItem.updatedAt = cTools.newSaveLocalDate();
    await this.gameCacheService.setJSON(key_RoleItem, cur_roleItem, getRandomSaveTime());

    return true;
  }

  //更新角色道具数据
  async updateAddRoleItem(roleKeyDto: RoleKeyDto, retMsg: RESChangeMsg) {

    if (!retMsg) {
      Logger.error("updateRoleItem items is null");
      return false;
    }

    let key_RoleItem = getRoleItemKey(roleKeyDto);

    let cur_roleItem: RoleItem = await this.gameCacheService.getJSON(key_RoleItem,);

    if (!cur_roleItem) {
      Logger.error("roleItem is null");
      return false;
    }
    if (!cur_roleItem.info) {
      Logger.error("roleItem info is null");
    }
    //console.log("cur_RoleInfo.info:",cur_RoleInfo.info);

    let is_update = false;
    if (retMsg.additem) {
      for (const itemId in retMsg.additem) {
        if (Object.prototype.hasOwnProperty.call(retMsg.additem, itemId)) {

          if (itemId.indexOf(gameConst.log_itemNumTag) !== -1) {
            continue;
          }

          const add_item_num = Number(retMsg.additem[itemId]);
          cur_roleItem.info[itemId] = cur_roleItem.info[itemId] || 0;
          cur_roleItem.info[itemId] += add_item_num;
          is_update = true
        }
      }
    }

    if (retMsg.decitem) {
      for (const itemId in retMsg.decitem) {
        if (Object.prototype.hasOwnProperty.call(retMsg.decitem, itemId)) {
          if (itemId.indexOf(gameConst.log_itemNumTag) !== -1) {
            continue;
          }
          const dec_item_num = Number(retMsg.decitem[itemId]);
          cur_roleItem.info[itemId] = cur_roleItem.info[itemId] || 0;
          cur_roleItem.info[itemId] -= dec_item_num;
          is_update = true
        }
      }
    }

    if (!is_update) {
      return is_update;
    }

    cur_roleItem.info = cur_roleItem.info;
    cur_roleItem.updatedAt = cTools.newSaveLocalDate();
    await this.gameCacheService.setJSON(key_RoleItem, cur_roleItem, getRandomSaveTime());

    return true;
  }

  //获取角色RoleItem数据
  async getRoleItem(roleKeyDto: RoleKeyDto, isFindDB: Boolean = false, save_time: number = SAVE_TIME,): Promise<RoleItem | null> {
    //return `This action returns a #${id} role`;
    let var_data: any;

    const var_key = getRoleItemKey(roleKeyDto);
    var_data = await this.gameCacheService.getJSON(var_key);

    if (!var_data || !var_data.info) {
      if (isFindDB) {
        var_data = await this.prismaGameDB.roleItem.findUnique({
          where: {
            id: roleKeyDto.id,
          },
        });

        if (var_data) {
          await this.gameCacheService.setJSON(var_key, var_data, save_time);
        } else {
          // //防御 缓存穿透
          // await this.gameCacheService.setJSON(var_key,{},save_time)
          return null;
        }
      }
    }

    return var_data;
  }

  /**获取RoleItem.info数据 */
  async getRoleItemInfo(roleKeyDto: RoleKeyDto, isFindDB: Boolean = false, save_time: number = SAVE_TIME,): Promise<ItemsRecord | null> {
    //return `This action returns a #${id} role`;
    let item_info = await this.getRoleItem(roleKeyDto, isFindDB, save_time);

    if (!item_info || !item_info.info) {
      return null;
    }
    let roleItemBag: ItemsRecord = <ItemsRecord>(<unknown>item_info.info);

    return roleItemBag;
  }

  //创建英雄初始数据
  async createRoleHero(roleKeyDto: RoleKeyDto, save_time: number) {
    //初始化英雄
    let init_hero = TableGameConfig.initRole;
    //console.log("init_hero:",init_hero[0])
    //let hero_skillmax = TableGameConfig.skill_maxnum;
    let init_heroList: HerosRecord = {};
    for (let index = 0; index < init_hero.length; index++) {
      const heroid = init_hero[index];

      let hero_entity: HeroEntity = syshero.createHero(heroid);

      if (hero_entity) {
        delete hero_entity.id;
        init_heroList[heroid] = hero_entity;
      }
    }

    let new_hero: RoleHero = {
      id: roleKeyDto.id,
      serverid: roleKeyDto.serverid,
      info: <any>init_heroList,
      updatedAt: cTools.newSaveLocalDate(),
    };

    let var_hero = await this.prismaGameDB.roleHero.create({ data: new_hero });

    //创建成功
    if (var_hero) {
      await this.gameCacheService.setJSON(getRoleHeroKey(roleKeyDto), var_hero, save_time);
    }

    //待处理
    //刷新 落地MYSQL 标记 或者通知事件

    return var_hero;
  }

  //更新英雄
  async updateRoleHero(roleKeyDto: RoleKeyDto, herosMap: HerosRecord) {
    if (!herosMap) {
      return false;
    }

    let key_RoleHero = getRoleHeroKey(roleKeyDto);

    let cur_RoleHero: RoleHero = await this.gameCacheService.getJSON(
      key_RoleHero,
    );

    if (!cur_RoleHero) {
      return false;
    }

    for (const heroid in herosMap) {
      if (Object.prototype.hasOwnProperty.call(herosMap, heroid)) {
        let heroEntity = herosMap[heroid];
        if (heroEntity?.tAttr == undefined) {
          continue;
        }
        delete heroEntity.tAttr;
      }
    }

    //console.log("cur_RoleHero.info:",cur_RoleHero.info);
    cur_RoleHero.info = <any>herosMap;
    cur_RoleHero.updatedAt = cTools.newSaveLocalDate();
    await this.gameCacheService.setJSON(key_RoleHero, cur_RoleHero, getRandomSaveTime(),);

    return true;
  }

  //获取角色英雄
  async getRoleHero(roleKeyDto: RoleKeyDto, isFindDB: Boolean = false, save_time: number = SAVE_TIME,): Promise<RoleHero | null> {
    //return `This action returns a #${id} role`;
    let var_data: any;

    const var_key = getRoleHeroKey(roleKeyDto);
    var_data = await this.gameCacheService.getJSON(var_key);
    //console.log("getRoleHero 11 var_data:",var_data)
    if (!var_data || !var_data.info) {
      if (isFindDB) {
        //console.log("getRoleHero 2")
        var_data = await this.prismaGameDB.roleHero.findUnique({
          where: {
            id: roleKeyDto.id,
          },
        });
        //console.log("getRoleHero 3 var_data:",var_data)
        if (var_data) {
          //console.log("getRoleHero 4 var_data:",var_data)
          await this.gameCacheService.setJSON(var_key, var_data, save_time);
        } else {
          // //防御 缓存穿透
          // await this.gameCacheService.setJSON(var_key,{},save_time)
          return null;
        }
      }
    }
    //console.log("getRoleHero 5 var_data:",var_data)
    return var_data;
  }

  //创建角色道具数据
  async createRoleEquip(roleKeyDto: RoleKeyDto, save_time: number) {
    let new_roleEquip: RoleEquip = {
      id: roleKeyDto.id,
      serverid: roleKeyDto.serverid,
      info: {},
      updatedAt: cTools.newSaveLocalDate(),
    };

    let var_roleEquip = await this.prismaGameDB.roleEquip.create({
      data: new_roleEquip,
    });

    //创建成功
    if (var_roleEquip) {
      await this.gameCacheService.setJSON(
        getRoleEquipKey(roleKeyDto),
        var_roleEquip,
        save_time,
      );
    }

    //待处理
    //刷新 落地MYSQL 标记 或者通知事件

    return var_roleEquip;
  }

  //更新角色道具数据
  async updateRoleEquip(roleKeyDto: RoleKeyDto, roleEquip: any) {

    if (!roleEquip) {
      return false;
    }

    let key_roleEquip = getRoleEquipKey(roleKeyDto);

    let cur_roleEquip = await this.gameCacheService.getJSON(key_roleEquip);

    if (!cur_roleEquip) {
      return false;
    }

    //console.log("cur_RoleInfo.info:",cur_RoleInfo.info);
    cur_roleEquip.info = <any>roleEquip;
    cur_roleEquip.updatedAt = cTools.newSaveLocalDate();
    await this.gameCacheService.setJSON(
      key_roleEquip,
      cur_roleEquip,
      getRandomSaveTime(),
    );

    return true;
  }

  //获取装备数据
  async getRoleEquip(
    roleKeyDto: RoleKeyDto,
    isFindDB: Boolean = false,
    save_time: number = SAVE_TIME,
  ): Promise<RoleEquip | null> {
    //return `This action returns a #${id} role`;
    let var_data: any;

    const var_key = getRoleEquipKey(roleKeyDto);
    var_data = await this.gameCacheService.getJSON(var_key);

    if (!var_data || !var_data.info) {
      if (isFindDB) {
        var_data = await this.prismaGameDB.roleEquip.findUnique({
          where: {
            id: roleKeyDto.id,
          },
        });

        if (var_data) {
          await this.gameCacheService.setJSON(var_key, var_data, save_time);
        } else {
          // //防御 缓存穿透
          // await this.gameCacheService.setJSON(var_key,{},save_time)
          return null;
        }
      }
    }

    return var_data;
  }

  //获取RoleEquip.info数据
  async getRoleEquipInfo(roleKeyDto: RoleKeyDto, isFindDB: Boolean = false, save_time: number = SAVE_TIME,): Promise<EquipEntityRecord | null> {
    //return `This action returns a #${id} role`;

    let roleEquip = await this.getRoleEquip(roleKeyDto);
    if (!roleEquip || !roleEquip.info) {
      return null;
    }

    let equipBagRecord = <EquipEntityRecord>(<unknown>roleEquip.info);

    return equipBagRecord;
  }

  /**初始化 服务器竞技场排行榜 */
  async initSeverArenaRank(serverid: number, isCreate: boolean = false) {

    if (isCreate) {
      await this.updateServerAreanRank(serverid, {});
      return
    }
    let roleids: string[] = [];
    let server_arena_rank = await this.prismaGameDB.arenaRank.findMany(
      {
        where: {
          serverid: serverid,
          p: {
            gt: 0
          }
        },
        orderBy: [
          {
            p: `desc`
          }
        ],
        take: gameConst.arena_rank_exmax,
        select: {
          id: true,
          serverid: true,
          p: true,
          info: true
        }
      }
    )

    if (!server_arena_rank) {
      Logger.error(`initSeverArenaLog  server_arena_log is null serverid:${serverid}`);
      return;
    }

    let arean_rank_any: ServerArenaRankRecord = {}
    for (let index = 0; index < server_arena_rank.length; index++) {
      let element = server_arena_rank[index];
      roleids.push(element.id)
      arean_rank_any[element.id] = Object.assign(
        {
          id: element.id,
          r: index + 1,
          p: element.p
        }, element.info
      );
    }
    await this.updateServerAreanRank(serverid, arean_rank_any);
    //let server_arena_log = await this.gameCacheService.getJSON(getServerInfoKey(serverid));
    await this.loadSeverRoleInfo(serverid, roleids)
  }

  async findGameRanks(serverid: number, EGtype: EGameRankType = undefined) {
    let whereCondition = {
      serverid: serverid,
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
    let rank = await this.prismaGameDB.gameRank.findMany(
      {
        where: whereCondition,
        orderBy: orderByCondition,
        // take: gameConst.arena_rank_exmax,
        select: {
          id: true,
          type: true,
          roleid: true,
          serverid: true,
          val: true,
          info: true
        }
      }
    )
    return rank;
  }
  /**初始化 游戏排行榜 */
  async initSeverRank(serverid: number, isCreate: boolean = false) {

    if (isCreate) {
      await this.updateServerRankByType(serverid, {}, EGameRankType.LEVEL);
      await this.updateServerRankByType(serverid, {}, EGameRankType.ELITE);
      await this.updateServerRankByType(serverid, {}, EGameRankType.ARENA);
      await this.updateServerRankByType(serverid, {}, EGameRankType.ARENA2);
      await this.updateServerRankByType(serverid, {}, EGameRankType.ABYSS_DRAGON);
      await this.updateServerRankByType(serverid, {}, EGameRankType.DEMONABYSS);
      await this.updateServerRankByType(serverid, {}, EGameRankType.WRESTLE);
      await this.gameCacheService.setJSON(getSRinfoKey(serverid), {});
      return
    }

    let server_rank = await this.findGameRanks(serverid);

    if (!server_rank) {
      Logger.error(`initGameRank server_rank is null serverid:${serverid}`);
      return;
    }

    let LRank: GameRankRecord = {};
    let ERank: GameRankRecord = {};
    /**深渊巨龙 */
    let ADRank: GameRankRecord = {};
    let DARank: GameRankRecord = {};
    let WRank: GameRankRecord = {};
    let ArRank: GameRankRecord = {};
    let ArRank2: GameRankRecord = {};
    let roleids: string[] = [];
    for (let index = 0; index < server_rank.length; index++) {
      let element = server_rank[index];
      roleids.push(element.roleid)
      let data: GameRankEntity = {
        id: element.id,
        type: element.type,
        roleid: element.roleid,
        serverid: element.serverid,
        val: element.val,
        info: element.info
      }
      if (element.type == EGameRankType.LEVEL) {
        LRank[data.roleid] = data;
      }
      else if (element.type == EGameRankType.ELITE) {
        ERank[data.roleid] = data;
      }
      else if (element.type == EGameRankType.ARENA) {
        ArRank[data.roleid] = data;
      }
      else if (element.type == EGameRankType.ARENA2) {
        ArRank2[data.roleid] = data;
      }
      else if (element.type == EGameRankType.ABYSS_DRAGON) {
        ADRank[data.roleid] = data;
      }
      else if (element.type == EGameRankType.DEMONABYSS) {
        DARank[data.roleid] = data;
      }
      else if (element.type == EGameRankType.WRESTLE) {
        WRank[data.roleid] = data;
      }
    }

    await this.updateServerRankByType(serverid, LRank, EGameRankType.LEVEL);
    await this.updateServerRankByType(serverid, ERank, EGameRankType.ELITE);
    await this.updateServerRankByType(serverid, ArRank, EGameRankType.ARENA);
    await this.updateServerRankByType(serverid, ArRank2, EGameRankType.ARENA2);
    await this.updateServerRankByType(serverid, ADRank, EGameRankType.ABYSS_DRAGON);
    await this.updateServerRankByType(serverid, DARank, EGameRankType.DEMONABYSS);
    await this.updateServerRankByType(serverid, WRank, EGameRankType.WRESTLE);

    await this.loadSeverRoleInfo(serverid, roleids);
  }

  /**
   * 加载角色中心库
   * @param serverid 服务器id
   * @param ids 角色id数组
   * @returns 
   */
  async loadSeverRoleInfo(serverid: number, ids: string[]) {

    if (ids.length == 0) { return }
    ids = ids.map(String)
    let set_ids = new Set(ids)
    // ids = Array.from(new Set(ids))
    let cur_data: RoleShowInfoRecord = await this.gameCacheService.getJSON(getSRinfoKey(serverid))
    if (cur_data) {
      let cur_ids = Object.keys(cur_data)
      cur_ids.forEach(item => { set_ids.add(item) })
    }
    ids = Array.from(set_ids)
    let load_data: RoleShowInfoRecord = {};
    let condition = { id: { in: ids, } }

    if (ids.length == 0) { return }

    let role_heros = await this.prismaGameDB.roleHero.findMany({ where: condition })
    for (let index = 0; index < role_heros.length; index++) {
      const element = role_heros[index];
      load_data[element.id] = load_data[element.id] || {}
      load_data[element.id].rh = <HerosRecord><unknown>element.info
    }
    let role_infos = await this.prismaGameDB.roleInfo.findMany({ where: condition })
    for (let index = 0; index < role_infos.length; index++) {
      const element = role_infos[index];
      let roleInfo: RoleInfoEntity = <RoleInfoEntity><unknown>element;
      load_data[element.id] = load_data[element.id] || {}
      this.saveSRInfo(load_data, element.id, roleInfo, load_data[element.id]?.rh)
    }

    await this.gameCacheService.setJSON(getSRinfoKey(serverid), load_data)
  }

  /**
   * 更新角色中心库
   * @param serverid 
   * @param roleInfo 
   * @param roleHero 
   * @returns 
   */
  async updataSeverRoleInfo(serverid: number, roleInfo: RoleInfoEntity, roleHero: HerosRecord) {
    if (!roleInfo) { return }
    if (!roleHero) { return }
    if (!serverid) { return }
    let SR_data: RoleShowInfoRecord = await this.gameCacheService.getJSON(getSRinfoKey(serverid))
    let id = roleInfo.info?.roleid
    if (!id) { return }
    if (!SR_data) { return }
    if (!SR_data[id]) { return }
    SR_data[id].rh = roleHero;
    this.saveSRInfo(SR_data, id, roleInfo, roleHero)
    await this.gameCacheService.setJSON(getSRinfoKey(serverid), SR_data)
  }
  /**
    * 添加角色中心库
    * @param serverid 
    * @param roleInfo 
    * @param roleHero 
    * @returns 
    */
  async addSeverRoleInfo(serverid: number, roleInfo: RoleInfoEntity, roleHero: HerosRecord) {
    if (!roleInfo) { return }
    if (!serverid) { return }
    let SR_data: RoleShowInfoRecord = await this.gameCacheService.getJSON(getSRinfoKey(serverid))
    let id = roleInfo.info?.roleid
    if (!id) { return }
    SR_data[id] = {}
    this.saveSRInfo(SR_data, id, roleInfo, roleHero)
    await this.gameCacheService.setJSON(getSRinfoKey(serverid), SR_data)
    return SR_data
  }

  //统一添加需要的值
  async saveSRInfo(data: RoleShowInfoRecord, id: string, roleInfo: RoleInfoEntity, roleHero: HerosRecord = null) {
    if (!data[id]) { return }
    if (roleInfo) {
      data[id].lv = roleInfo.rolelevel;
      data[id].n = roleInfo.info?.name;
      data[id].m = roleInfo.info?.medalInfo?.mid;
      data[id].c = roleInfo.info?.ico;
      data[id].lg = roleInfo.info?.upgrade;
      data[id].gh = roleInfo.info?.aureole;
      data[id].sid = roleInfo.info?.serverid;
      if (roleInfo.info?.raremst) {
        let rm = roleInfo.info.raremst
        data[id].rmon = [];
        data[id].rmon = rm?.fight[(rm?.use ?? 0)]
        data[id].raremst = rm;
      }
      data[id].wid = roleInfo.info?.wrestle?.id;
      data[id].titleE = roleInfo.info?.title;
      data[id].fashion = roleInfo.info?.fashion;
      data[id].llt = roleInfo.info?.lastlogintime;
      data[id].skill = roleInfo.info?.skill;
    }
    if (roleHero) {
      data[id].rh = roleHero;
      data[id].f = cGameCommon.getRoleFightPoint(roleHero);
    }
  }

  /**
   * 删除对应id角色
   * @param serverid 
   * @param roleid 
   */
  async delSeverRoleInfo(serverid: number, roleid: string) {
    if (!roleid) { return }
    if (!serverid) { return }
    let SR_data: RoleShowInfoRecord = await this.gameCacheService.getJSON(getSRinfoKey(serverid))
    let data = SR_data[roleid]
    if (!data) { return }
    delete SR_data[roleid];
    await this.gameCacheService.setJSON(getSRinfoKey(serverid), SR_data)
  }

  /**
   * 获取中心角色信息
   * @param serverid 
   * @returns 
   */
  async getSeverRoleInfo(serverid: number) {
    if (!serverid) { return }
    let SR_data: RoleShowInfoRecord = await this.gameCacheService.getJSON(getSRinfoKey(serverid))
    return SR_data;
  }

  /**获取竞技场排行榜 */
  async getSeverArenaRank(serverid: number) {
    let arena_rank: ServerArenaRankRecord = await this.gameCacheService.getJSON(getServerArenaRankKey(serverid));

    let ret_arena_rank: ServerArenaRankRecord = {}

    if (!arena_rank) {
      return ret_arena_rank;
    }

    if (Object.keys(arena_rank).length <= TableGameConfig.arena_rank_max) {
      return arena_rank;
    }

    let cur_count = 0;
    for (const key in arena_rank) {
      if (Object.prototype.hasOwnProperty.call(arena_rank, key)) {
        let element = arena_rank[key];
        if (cur_count > TableGameConfig.arena_rank_max) {
          break;
        }
        ret_arena_rank[element.id] = element;
        cur_count++;
      }
    }

    return ret_arena_rank;
  }

  /**
   * 保存服务器全局竞技场排行榜
   * @param serverid 
   */
  async saveSeverArenaRank(serverid: number, server_arena_rank: ServerArenaRankRecord = null) {

    if (!server_arena_rank) {
      server_arena_rank = await this.gameCacheService.getJSON(getServerArenaRankKey(serverid));
    }

    if (!server_arena_rank) { return; }

    let cur_count = 0;
    let save_redis_ranks: ServerArenaRankRecord = {}
    let save_ranks = [];
    for (const key in server_arena_rank) {
      if (Object.prototype.hasOwnProperty.call(server_arena_rank, key)) {
        let element: ArenaEntity = server_arena_rank[key];

        //比实际排名多缓存一些
        if (cur_count <= gameConst.arena_rank_exmax) {
          save_redis_ranks[element.id] = element;
        }

        cur_count++;
        if (!element.save) {
          continue;
        }
        delete element.save;
        let save_obj = Object.assign({}, {
          id: element.id,
          serverid: serverid,
          p: element.p,
          info: <any>{
            rh: <any>element.rh,
            m: element.m,
            obj: element.obj,
            c: element.c,
            f: element.f,
            n: element.n,
            lv: element.lv,
            lg: element.lg,
            gh: element.gh
          },
          updatedAt: cTools.newSaveLocalDate()
        })
        await this.prismaGameDB.arenaRank.update({
          where: {
            id: save_obj.id,
          },
          data: save_obj
        })
        //save_ranks.push();
      }
    }

    //数据保存到缓存
    if (save_redis_ranks && Object.keys(save_redis_ranks).length > 0) {
      await this.updateServerAreanRank(serverid, save_redis_ranks);
    }

  }

  /**更新全服竞技场数据到缓存 */
  async updateServerAreanRank(serverid: number, server_arena_rank: ServerArenaRankRecord) {

    if (!server_arena_rank) {
      return;
    }

    await this.gameCacheService.setJSON(getServerArenaRankKey(serverid), server_arena_rank);
  }

  /**
   * 从数据库里获取
   * @param roleKeyDto 
   * @returns 
   */
  async getMysqlSARankByRoleID(roleKeyDto: RoleKeyDto) {

    let cur_rank = await this.prismaGameDB.arenaRank.findUnique(
      {
        where: {
          id: roleKeyDto.id,
        }
      }
    )

    let ret_rank: ArenaEntity;
    if (cur_rank) {
      ret_rank = Object.assign(
        {
          id: cur_rank.id,
          r: gameConst.arena_rank_exmax1,
          p: cur_rank.p
        }, cur_rank.info
      );
    }

    return ret_rank;
  }

  /**
   * 竞技场排名变化
   * @param roleKeyDto            要改变的角色ID 和 服务器ID 【注意 不要弄混了攻击和被攻击方】
   * @param cpoint                积分变化
   * @param server_arena_rank     排行榜数据
   * @param server_arena_rank     要改变的角色信息 不在线不传参数默认NULL  在线请先从缓存里读取出来 强制需要roleInfo,roleHero 数据 【注意 不要弄混了攻击和被攻击方】
   */
  async changeSAreanRank(roleKeyDto: RoleKeyDto, cpoint: number, server_arena_rank: ServerArenaRankRecord, retRoleALLInfo: RetRoleALLInfo = null) {

    if (!roleKeyDto) { return; }

    if (cpoint === 0) { return; }

    //当前玩家是否在线？
    //let roleSubInfo = await this.getRoleSubInfo(roleKeyDto);
    //在线就 同步角色信息里的积分
    if (retRoleALLInfo) {
      if (!retRoleALLInfo.checkData(true, true)) {
        Logger.error(`changeSAreanRank  retRoleALLInfo is null ${retRoleALLInfo.getRetMsg()}`);
        return;
      }

      if (retRoleALLInfo.roleSubInfo && retRoleALLInfo.roleSubInfo.arenaInfo) {
        retRoleALLInfo.roleSubInfo.arenaInfo.point += cpoint;
      }
    }


    //let server_arena_rank = await this.getSeverArenaRank(roleKeyDto.serverid);
    if (!server_arena_rank) {
      Logger.error(`changeSAreanRank  server_arena_rank is null serverid:${roleKeyDto.serverid}`);
      return;
    }

    //是否在排行榜
    let cur_role_arenainfo: ArenaEntity;
    if (server_arena_rank[roleKeyDto.id]) {
      //取缓存里的数据
      cur_role_arenainfo = server_arena_rank[roleKeyDto.id];
    }
    else {
      //从数据库里拉取
      cur_role_arenainfo = await this.getMysqlSARankByRoleID(roleKeyDto);
      if (cur_role_arenainfo && cur_role_arenainfo.p == -999) {
        cur_role_arenainfo.p = TableGameConfig.arena_base_point
      }
    }

    if (!cur_role_arenainfo) {
      //攻击方第一次 打没入榜
      if (retRoleALLInfo && retRoleALLInfo.roleSubInfo && retRoleALLInfo.roleSubInfo.arenaInfo) {

        let m_id = 0;
        let roleSubInfo = retRoleALLInfo.roleSubInfo;
        if (roleSubInfo.medalInfo) {
          m_id = roleSubInfo.medalInfo.mid;
        }

        //初始化排名数据
        cur_role_arenainfo = {
          id: roleSubInfo.roleid,
          r: gameConst.arena_rank_exmax1,
          p: TableGameConfig.arena_base_point,
          rh: clone(retRoleALLInfo.roleHero),
          m: m_id,
          obj: EObjtype.HERO,
          c: "1",
          // f: cGameCommon.cpRoleFightPoint(roleSubInfo, retRoleALLInfo.roleHero),
          f: cGameCommon.getRoleFightPoint(retRoleALLInfo.roleHero),
          n: roleSubInfo.name,
          lg: roleSubInfo.upgrade,
          gh: roleSubInfo.aureole,
          lv: retRoleALLInfo.roleInfo.rolelevel
        }

        let save_obje = {
          id: cur_role_arenainfo.id,
          serverid: roleKeyDto.serverid,
          p: cur_role_arenainfo.p,
          info: <any>{
            rh: <any>cur_role_arenainfo.rh,
            m: cur_role_arenainfo.m,
            obj: cur_role_arenainfo.obj,
            c: cur_role_arenainfo.c,
            f: cur_role_arenainfo.f,
            n: cur_role_arenainfo.n,
            lg: cur_role_arenainfo.lg,
            gh: cur_role_arenainfo.gh,
            lv: cur_role_arenainfo.lv
          },
          updatedAt: cTools.newSaveLocalDate()
        }
        await this.prismaGameDB.arenaRank.create({
          data: save_obje
        })

      }
      else {
        //被攻击方 但是没入榜 异常
        Logger.error(`changeSAreanRank  cur_role_arenainfo is null roleid:${roleKeyDto.id}  serverid:${roleKeyDto.serverid}`);
        return;
      }
    }

    //同步排行榜里的积分
    cur_role_arenainfo.p += cpoint;
    cur_role_arenainfo.save = true;
    //添加到缓存里
    if (!server_arena_rank[roleKeyDto.id]) {
      server_arena_rank[roleKeyDto.id] = cur_role_arenainfo;
    }
    else {
      //排行数据在缓存内 同时角色也同时在线 更新战力
      if (retRoleALLInfo) {
        // cur_role_arenainfo.f = cGameCommon.cpRoleFightPoint(retRoleALLInfo.roleSubInfo, retRoleALLInfo.roleHero);
        cur_role_arenainfo.f = cGameCommon.getRoleFightPoint(retRoleALLInfo.roleHero);
        cur_role_arenainfo.lg = retRoleALLInfo.roleSubInfo?.upgrade;
        cur_role_arenainfo.gh = retRoleALLInfo.roleSubInfo?.aureole;
        if (retRoleALLInfo.roleSubInfo?.raremst) {
          let rm = retRoleALLInfo.roleSubInfo.raremst
          cur_role_arenainfo.rmon = [];
          cur_role_arenainfo.rmon = rm?.fight[(rm?.use ?? 0)]
          cur_role_arenainfo.raremst = rm;
        }
        cur_role_arenainfo.wid = retRoleALLInfo.roleSubInfo?.wrestle?.id
        cur_role_arenainfo.titleE = retRoleALLInfo.roleSubInfo?.title;
        cur_role_arenainfo.fashion = retRoleALLInfo.roleSubInfo?.fashion;
        cur_role_arenainfo.skill = retRoleALLInfo.roleSubInfo?.skill;
      }
    }

  }

  async createServerInfo(serverid: number, status: EBServerStatus, startTime: string | Date | number) {
    //初始化
    let serverSubInfoEntity: ServerSubInfoEntity = {
      status: status,
      startTime: cTools.newLocalDateString(new Date(startTime)),
      resetTime: cTools.newLocalDate0String(new Date(startTime))
    }
    cGameServer.checkOpenNewSystem(serverSubInfoEntity);

    let serverInfoEntity: ServerInfoEntity = {
      serverid: serverid,
      info: serverSubInfoEntity,
      nodeid: Number(cTools.getDataNodeId()),
      updatedAt: cTools.newLocalDateString()
    }

    let ret = await this.prismaGameDB.serverInfo.create(
      {
        data: <any>serverInfoEntity
      }
    )

    if (ret) {
      serverInfoEntity.id = ret.id;
      await this.gameCacheService.setJSON(getServerInfoKey(serverid), serverInfoEntity);
    }

    //初始化邮件
    await this.initEmail([serverid]);

    //初始化竞技场
    await this.initSeverArenaRank(serverid, true);
    //初始化排行榜
    await this.initSeverRank(serverid, true);
    //添加数据节点管理ID
    await this.addDataServerIds(serverid);

    //初始化公会数据
    await this.initGuild([serverid]);

    //初始化聊天数据
    await this.initChatData([serverid]);

    return serverInfoEntity;
  }

  /**
   * 初始化合服信息
   */
  async initMergeServerInfo() {

    /**服务器ID  主服务器ID */
    let mergeServerInfo: Record<number, number> = {}
    let game = await this.prismaBackendDB.games.findFirst(
      {
        where: {
          sku: GAME_SKU
        }
      }
    )

    let server_list = await this.prismaBackendDB.servers.findMany(
      {
        where: {
          gameId: game.id,
        },
        select: {
          serverId: true,
          info: true
        }
      }
    )

    //console.log("server_list:", server_list);

    if (server_list && server_list.length > 0) {

      for (let index = 0; index < server_list.length; index++) {
        let element: ServerEntity = <unknown>server_list[index];
        if (element.info && element.info.mainsId) {
          mergeServerInfo[element.serverId] = element.info.mainsId;
        }

      }
    }

    await this.gameCacheService.setJSON(getMergeServerInfoKey(), mergeServerInfo);

    Logger.log("mergeServerInfo:", mergeServerInfo);

  }


  /**
   * 获取合服后当前的最新服务器主ID
   * @param originServerid 合服前原始服务器ID
   */
  async getMainServerIds(originServerid: number) {

    let mergeServerInfo = await this.gameCacheService.getJSON(getMergeServerInfoKey());

    if (!mergeServerInfo || !mergeServerInfo[originServerid]) {
      return originServerid;
    }

    return mergeServerInfo[originServerid];
  }

  /**
   * 游戏服务器全局数据初始化
   */
  async initServerInfo(initServerids?: number[]) {

    let serverInfo_ary = [];
    if (initServerids && initServerids.length > 0) {
      //指定参数初始化
      serverInfo_ary = await this.prismaGameDB.serverInfo.findMany(
        {
          where: {
            serverid: {
              in: initServerids
            }
          }
        }
      );
    }
    else {

      //启动初始化
      let node_id = Number(cTools.getDataNodeId());
      serverInfo_ary = await this.prismaGameDB.serverInfo.findMany(
        {
          where: {
            nodeid: node_id
          }
        }
      );
    }

    serverInfo_ary = serverInfo_ary || [];

    if (serverInfo_ary.length === 0) {
      //初始化 第一个服 必须走后台创建
      return;
    }

    //有效服务器ID
    let server_ids = [];
    for (let index = 0; index < serverInfo_ary.length; index++) {
      const serverInfo = serverInfo_ary[index];
      server_ids.push(serverInfo.serverid);
    }


    //同步server status 
    let game = await this.prismaBackendDB.games.findFirst(
      {
        where: {
          sku: GAME_SKU
        }
      }
    )

    let server_list = await this.prismaBackendDB.servers.findMany(
      {
        where: {
          serverId: {
            in: server_ids
          },
          gameId: game.id,
        }
      }
    )
    //console.log(server_list);

    let server_status = {};
    for (let index = 0; index < server_list.length; index++) {
      const server_entity = server_list[index];
      server_status[server_entity.serverId] = server_entity.status;
    }
    //console.log(server_status);
    //读取到内存
    for (let index = 0; index < serverInfo_ary.length; index++) {
      const serverInfo = serverInfo_ary[index];
      let serverInfoEntity: ServerInfoEntity = {
        id: serverInfo.id,
        serverid: serverInfo.serverid,
        info: <ServerSubInfoEntity><unknown>serverInfo.info,
        nodeid: serverInfo.nodeid,
        updatedAt: cTools.newSaveLocalDate()
      }
      cGameServer.checkOpenNewSystem(serverInfoEntity.info);

      //同步后台服务器状态
      if (server_status[serverInfo.serverid] !== undefined) {
        if (server_status[serverInfo.serverid] !== serverInfoEntity.info.status) {
          serverInfoEntity.info.status = server_status[serverInfo.serverid];
        }
      }

      await this.gameCacheService.setJSON(getServerInfoKey(serverInfo.serverid), serverInfoEntity);

      //联动跨服角色信息启动
      let cur_sroles = await this.gameCacheService.getJSON(getSRinfoKey(serverInfo.serverid));
      if (!cur_sroles || Object.keys(cur_sroles).length == 0) {
        await this.gameCacheService.setJSON(getSRinfoKey(serverInfo.serverid), {});
      }

      //待优化 改成根据服务器ID范围初始化数据 优化启动时间
      await this.initSeverArenaRank(serverInfo.serverid);
      await this.initSeverRank(serverInfo.serverid);

      await this.addDataServerIds(serverInfo.serverid);

      let open_days = cTools.GetServerOpenDays(serverInfoEntity.info.startTime);
      console.log(`服务器:[${serverInfoEntity.serverid}]初始化成功 开服时间:${serverInfoEntity.info.startTime} 开服天数:${open_days}`);
    }

    Logger.log(`initServerInfo server[${server_ids}]`);
    //初始化邮件
    await this.initEmail(server_ids);

    //初始化公会数据
    await this.initGuild(server_ids);

    //初始化聊天数据
    await this.initChatData(server_ids);



    return server_ids;
  }

  async getDataServerIds() {
    let serverids: number[] = await this.gameCacheService.getJSON(getDataServerIdsKey());

    return serverids;
  }

  async addDataServerIds(serverid: number) {

    let server_ids = await this.getDataServerIds();
    if (!server_ids) {
      server_ids = [];
    }

    if (server_ids.indexOf(serverid) != -1) {
      return;
    }
    console.debug(`========addDataServerIds start ========serverid:${serverid} server_ids:${server_ids}`);
    server_ids.push(serverid);
    console.debug("========addDataServerIds end ========server_ids:", server_ids);
    await this.gameCacheService.setJSON(getDataServerIdsKey(), server_ids);
  }

  async delDataServerIds(serverid: number) {

    let server_ids = await this.getDataServerIds();
    let idx = server_ids.indexOf(serverid);
    if (idx == -1) {
      return;
    }
    console.debug(`========delDataServerIds start ========serverid:${serverid} server_ids:${server_ids}`);
    server_ids.splice(idx, 1);
    console.debug("========delDataServerIds end ========server_ids:", server_ids);
    await this.gameCacheService.setJSON(getDataServerIdsKey(), server_ids);
  }

  /**
   * 获取服务器全局info 缓存数据
   * @param serverid 
   * @param isFindDB 后台接口专用 其他地方不要用
   * @returns 
   */
  async getServerInfo(serverid: number, isFindDB: Boolean = false) {
    let serverInfoEntity: ServerInfoEntity = await this.gameCacheService.getJSON(getServerInfoKey(serverid));

    if (!serverInfoEntity && isFindDB) {
      let severInfo = await this.prismaGameDB.serverInfo.findFirst(
        {
          where: {
            serverid: serverid
          }
        }
      )

      if (severInfo) {
        serverInfoEntity = Object.assign({}, severInfo, {
          info: <any>severInfo.info
        });
        return serverInfoEntity
      }
    }

    return serverInfoEntity;
  }

  /**
   * 获取服务器全局subinfo 缓存数据
   * @param serverid 
   * @returns 
   */
  async getServerSubInfo(serverid: number) {
    let serverInfoEntity: ServerInfoEntity = await this.getServerInfo(serverid);

    if (!serverInfoEntity || !serverInfoEntity.info) {
      return null;
    }

    let serverSubInfoEntity: ServerSubInfoEntity = serverInfoEntity.info;

    return serverSubInfoEntity;

  }

  /**
   * 保存服务器全局数据到数据库
   * @param serverid 
   */
  async saveSververInfo(serverid: number) {

    let serverInfoEntity = await this.gameCacheService.getJSON(getServerInfoKey(serverid));
    if (serverInfoEntity) {
      await this.prismaGameDB.serverInfo.update(
        {
          where: {
            id: serverInfoEntity.id,
          },
          data: {
            info: serverInfoEntity.info,
            updatedAt: cTools.newSaveLocalDate(),
          },
        }
      )
    }
  }

  /**刷新服务器信息 到缓存*/
  async updateSververSubInfo(serverid: number, serverSubInfoEntity: ServerSubInfoEntity) {

    if (!serverSubInfoEntity) {
      return;
    }

    let serverInfoEntity = await this.gameCacheService.getJSON(getServerInfoKey(serverid));
    if (!serverInfoEntity) { return; }

    serverInfoEntity.info = serverSubInfoEntity;
    await this.gameCacheService.setJSON(getServerInfoKey(serverid), serverInfoEntity);
  }

  /**刷新服务器信息 只更新夺宝大作战的排行信息*/
  async updateSververPSRank(serverid: number, serverSubInfoEntity: ServerSubInfoEntity) {

    if (!serverSubInfoEntity || !serverSubInfoEntity.pirateShip || !serverSubInfoEntity.pirateShip.rank) {
      return;
    }

    let serverInfoEntity = await this.gameCacheService.getJSON(getServerInfoKey(serverid));
    if (!serverInfoEntity || !serverInfoEntity.info || !serverInfoEntity.info.pirateShip) { return; }

    serverInfoEntity.info.pirateShip.rank = serverSubInfoEntity.pirateShip.rank;

    await this.gameCacheService.setJSON(getServerInfoKey(serverid), serverInfoEntity);
  }


  /**
   * 邮箱数据初始化
   */
  async initEmail(serverIds: number[]) {
    const now = Date.now();
    Logger.log(`initEmail start server:[${serverIds}]`);

    let out_days = Number(process.env.LOG_TIMEOUT);
    if (out_days === undefined) {
      out_days = 21;
    }
    let out_time = cTools.newDate();
    out_time.setHours(0, 0, 0, 0);
    out_time.setHours(out_days * 24 + 8);
    //Logger.log('initEmail out_time:', out_time);

    await this.prismaGameDB.email.updateMany({
      where: {
        serverid: {
          in: serverIds
        },
        owner: { not: '' },
        time: {
          lt: out_time,
        },
        state: {
          not: EEmailState.Deleted,
        },
      },
      data: {
        state: EEmailState.Deleted,
      },
    });
    Logger.log(`initEmail updateMany end ${now - Date.now()}`);

    let cur_emails = await this.prismaGameDB.email.findMany({
      where: {
        serverid: {
          in: serverIds
        },
        owner: gameConst.email_globalTag,
        time: {
          gte: out_time,
        },
        state: {
          not: EEmailState.Deleted,
        },
      },
    });

    Logger.log(`email num:${cur_emails.length}`);

    let emailInfo = {}; //缓存里的邮件数据
    if (cur_emails.length > 0) {
      for (let index = 0; index < cur_emails.length; index++) {
        let emailEntity: EmailEntity = cur_emails[index];
        emailEntity.id = Number(emailEntity.id);
        emailInfo[emailEntity.serverid] = emailInfo[emailEntity.serverid] || (await this.gameCacheService.getJSON(getGlobalEmailKey(emailEntity.serverid)));
        emailInfo[emailEntity.serverid] = emailInfo[emailEntity.serverid] || {};
        emailInfo[emailEntity.serverid][emailEntity.id] = emailEntity;
      }

      for (let index = 0; index < serverIds.length; index++) {
        const serverid = serverIds[index];
        await this.gameCacheService.setJSON(getGlobalEmailKey(serverid), emailInfo[serverid] || {});
      }

    } else {
      for (let index = 0; index < serverIds.length; index++) {
        const serverid = serverIds[index];
        await this.gameCacheService.setJSON(getGlobalEmailKey(serverid), {});
      }
    }

    Logger.log(`initEmail end ${now - Date.now()}`);
  }

  /**
   * 获取服务器全服邮件
   * @param serverid
   */
  async getGlobalEmail(serverid: number) {
    let emails: EmailList = await this.gameCacheService.getJSON(getGlobalEmailKey(serverid));

    emails = emails || {};
    return emails;
  }

  async saveGlobalEmailReids(serverid: number, emails: any) {
    if (!emails) {
      return false;
    }

    await this.gameCacheService.setJSON(getGlobalEmailKey(serverid), emails);
    return true;
  }

  async addGlobalEmailToReids(serverid: number, emailEntity: EmailEntity) {

    let emails = await this.getGlobalEmail(serverid);

    if (!emails) {
      return false;
    }

    await this.gameCacheService.setJSON(getGlobalEmailKey(serverid), emails);
    return true;
  }

  async saveGlobalEmailMySql(serverid: number, isSaveRedis = true) {

    let emailList: EmailList = await this.gameCacheService.getJSON(getGlobalEmailKey(serverid));

    if (!emailList) {
      return;
    }

    let out_days = Number(process.env.LOG_TIMEOUT);
    if (out_days === undefined) {
      out_days = 21;
    }

    let out_date = cTools.newDate();
    out_date.setHours(0, 0, 0, 0);
    out_date.setHours(out_days * 24 + 8);
    let out_time = out_date.getTime();
    let dif_time = (1000 * 60 * 60 * 24) * out_days;

    let delete_ids = [];
    for (const eid in emailList) {
      if (Object.prototype.hasOwnProperty.call(emailList, eid)) {
        let eid_int = Number(eid);
        let emailEntity: EmailEntity = emailList[eid_int];
        let email_time = new Date(emailEntity.time).getTime();

        let save_data = {
          id: emailEntity.id,
          serverid: emailEntity.serverid,
          title: emailEntity.title,
          content: emailEntity.content,
          items: <any>emailEntity.items ? <any>emailEntity.items : {},
          state: emailEntity.state,
          sender: emailEntity.sender,
          owner: emailEntity.owner,
          time: cTools.newSaveLocalDate(new Date(emailEntity.time))
        }
        if (emailEntity.needSave) {
          delete emailEntity.needSave;

          await this.prismaGameDB.email.upsert({
            where: { id: emailEntity.id },
            create: save_data,
            update: save_data,
          });

          if (emailEntity.state === EEmailState.Deleted) {
            delete_ids.push(Number(emailEntity.id));
          }
        }
        else if (email_time + dif_time > out_time) {
          emailEntity.state = EEmailState.Deleted;
          await this.prismaGameDB.email.upsert({
            where: { id: emailEntity.id },
            create: save_data,
            update: save_data,
          });
          delete_ids.push(Number(emailEntity.id));
        }
      }
    }

    //清空标记为删除的邮件
    if (delete_ids.length > 0 && isSaveRedis) {
      for (let index = 0; index < delete_ids.length; index++) {
        const eid = delete_ids[index];
        delete emailList[eid];
      }
      await this.gameCacheService.setJSON(getGlobalEmailKey(serverid), emailList);
    }
  }

  /**
   * 获取玩家的竞技场日志
   * @param seasonid 服务器的当前赛季 不是玩家个人的
   * @param roleKeyDto 
   * @param isFindDB 
   * @param save_time 
   */
  async getRoleArenaLog(seasonid: number, roleKeyDto: RoleKeyDto, isFindDB: Boolean = false, save_time: number = SAVE_TIME) {

    if (seasonid == undefined) {
      Logger.error(`getRoleArenaLog seasonid is null`)
      return
    }

    let is_update = false;
    let arena_log: any[] = await this.gameCacheService.getJSON(getRoleArenaLogKey(roleKeyDto));

    //修正报错逻辑
    if (!Array.isArray(arena_log)) {
      arena_log = [];
      is_update = true;
    }

    if (isFindDB) {
      /**查找有效的日志 */
      arena_log = await this.prismaGameDB.arenaLog.findMany({
        where: {
          serverid: roleKeyDto.serverid,
          seasonid: seasonid,
          state: { lt: EArenaSatate.DELETED },
          roleid: roleKeyDto.id,
        }
      });

      is_update = true;

      if (!arena_log) { return null; }

      for (let index = 0; index < arena_log.length; index++) {
        let element = arena_log[index];
        element.time = cTools.newTransformToUTCZDate(element.time);
        delete element.updatedAt;
      }
    }
    if (!arena_log) { return null; }

    arena_log.sort(function (a, b) {

      if (!a || !a.time) { return 1; }

      if (!b || !b.time) { return -1; }

      let atime = new Date(a.time).getTime();
      let btime = new Date(b.time).getTime();
      return btime - atime;
    })

    //过滤
    let tmp_arenaLog = [];
    for (let index = 0; index < arena_log.length; index++) {
      let element = arena_log[index];
      if (element.updatedAt) { delete element.updatedAt; }
      if (element.state < EArenaSatate.DELETED) {
        if (tmp_arenaLog.length <= TableGameConfig.arena_log_max) {
          element.time = cTools.newLocalDateString(new Date(element.time));
          tmp_arenaLog.push(element);
        }
        else {
          element.state = EArenaSatate.DELETED;
          element.needsave = true;
          is_update = true;
        }
      }
      else {
        is_update = true;
      }
    }

    if (is_update) {
      await this.gameCacheService.setJSON(getRoleArenaLogKey(roleKeyDto), arena_log, save_time);
    }

    return tmp_arenaLog;
  }

  /**
   * 发送玩家竞技场挑战日志
   * @param arenaLogEntity 
   * @param save_time 
   * @returns 
   */
  async sendRoleArenaLog(arenaLogEntity: ArenaLogEntity, save_time: number = SAVE_TIME) {

    if (!arenaLogEntity) { return; }

    let roleKeyDto = { id: arenaLogEntity.roleid, serverid: arenaLogEntity.serverid };

    let arena_log = await this.getRoleArenaLog(arenaLogEntity.seasonid, roleKeyDto);

    let save_obj = Object.assign(
      {
        time: cTools.newLocalDateString(),
      }, arenaLogEntity
    )

    let ret = await this.prismaGameDB.arenaLog.create({
      data: Object.assign({},
        save_obj, {
        time: cTools.newSaveLocalDate(new Date(save_obj.time)),
        updatedAt: cTools.newSaveLocalDate()
      }
      ),
    });

    //不在线直接存后不管了
    if (!arena_log) {
      return;
    }

    //赋值ID
    save_obj.id = ret.id;

    //在线
    arena_log.push(save_obj)

    arena_log.sort(function (a, b) {

      if (!a || !a.time) { return 1; }

      if (!b || !b.time) { return -1; }

      let atime = new Date(a.time).getTime();
      let btime = new Date(b.time).getTime();;
      return btime - atime;
    })

    //如果超过上限 就改变多余的日志状态为 可删除
    if (arena_log.length > TableGameConfig.arena_log_max) {
      for (let index = TableGameConfig.arena_log_max; index < arena_log.length; index++) {
        let element = arena_log[index];
        if (element.updatedAt) { delete element.updatedAt; }
        if (index + 1 > TableGameConfig.arena_log_max && element.state < EArenaSatate.DELETED) {
          element.state = EArenaSatate.DELETED;
          element.save = true;
        }
      }
    }

    await this.gameCacheService.setJSON(getRoleArenaLogKey(roleKeyDto), arena_log, save_time);
  }


  /**
   * 获取玩家跨服竞技场日志
   * @param seasonid 服务器的当前赛季 不是玩家个人的
   */
  async getRoleCrossArenaLog(seasonid: number, crossServerId: number, roleKeyDto: RoleKeyDto, isFindDB: Boolean = false, save_time: number = SAVE_TIME) {

    if (seasonid == undefined) {
      Logger.error(`getRoleCrossArenaLog seasonid is null`)
      return
    }

    let arena_log: any[] = await this.gameCacheService.getJSON(getRoleCrossArenaLogKey(roleKeyDto));

    let is_update = false;

    if (!arena_log && isFindDB) {

      /**查找有效的日志 */
      arena_log = await this.prismaGameDB.crossArenaLog.findMany({
        where: {
          crossServerid: crossServerId,
          serverid: roleKeyDto.serverid,
          seasonid: seasonid,
          state: { lt: EArenaSatate.DELETED },
          roleid: roleKeyDto.id,
        }
      });

      is_update = true;

      if (!arena_log) { return null; }

      for (let index = 0; index < arena_log.length; index++) {
        let element = arena_log[index];
        element.time = cTools.newTransformToUTCZDate(element.time);
        delete element.updatedAt;
      }
    }
    if (!arena_log) { return null; }

    arena_log.sort(function (a, b) {

      if (!a || !a.time) { return 1; }

      if (!b || !b.time) { return -1; }

      let atime = new Date(a.time).getTime();
      let btime = new Date(b.time).getTime();
      return btime - atime;
    })

    //过滤
    let tmp_arenaLog = [];
    for (let index = 0; index < arena_log.length; index++) {
      let element = arena_log[index];
      if (element.updatedAt) { delete element.updatedAt; }
      if (element.state < EArenaSatate.DELETED) {
        if (tmp_arenaLog.length <= TableGameConfig.arena_log_max_kf) {
          element.time = cTools.newLocalDateString(new Date(element.time));
          tmp_arenaLog.push(element);
        }
        else {
          element.state = EArenaSatate.DELETED;
          element.needsave = true;
          is_update = true;
        }
      }
      else {
        is_update = true;
      }
    }

    if (is_update) {
      await this.gameCacheService.setJSON(getRoleCrossArenaLogKey(roleKeyDto), arena_log, save_time);
    }

    return tmp_arenaLog;
  }

  /**
   * 发送玩家跨服竞技场挑战日志
   * @param arenaLogEntity 
   * @param save_time 
   * @returns 
   */
  async sendRoleCrossArenaLog(arenaLogEntity: ArenaLogEntity, save_time: number = SAVE_TIME) {

    if (!arenaLogEntity) { return; }

    if (!arenaLogEntity.crossServerid) { return; }

    let roleKeyDto = { id: arenaLogEntity.roleid, serverid: arenaLogEntity.serverid };

    let arena_log = await this.getRoleCrossArenaLog(arenaLogEntity.seasonid, arenaLogEntity.crossServerid, roleKeyDto);

    let save_obje = Object.assign(
      {
        time: cTools.newLocalDateString(),
      }, arenaLogEntity
    )

    let ret = await this.prismaGameDB.crossArenaLog.create({
      data: Object.assign({},
        save_obje, {
        time: cTools.newSaveLocalDate(new Date(save_obje.time)),
        updatedAt: cTools.newSaveLocalDate()
      }
      ),
    });

    //不在线直接存后不管了
    if (!arena_log) {
      return;
    }

    save_obje.id = ret.id;
    //在线
    arena_log.push(save_obje)

    arena_log.sort(function (a, b) {

      if (!a || !a.time) { return 1; }

      if (!b || !b.time) { return -1; }

      let atime = new Date(a.time).getTime();
      let btime = new Date(b.time).getTime();;
      return btime - atime;
    })

    //如果超过上限 就改变多余的日志状态为 可删除
    if (arena_log.length > TableGameConfig.arena_log_max_kf) {
      for (let index = TableGameConfig.arena_log_max_kf; index < arena_log.length; index++) {
        let element = arena_log[index];
        if (element.updatedAt) { delete element.updatedAt; }
        if (index + 1 > TableGameConfig.arena_log_max_kf && element.state < EArenaSatate.DELETED) {
          element.state = EArenaSatate.DELETED;
          element.save = true;
        }
      }
    }

    await this.gameCacheService.setJSON(getRoleCrossArenaLogKey(roleKeyDto), arena_log, save_time);
  }

  /**
   * 获取跨服竞技信息
   * @param crossServerId 
   * @returns 
   */
  async getArenaServerInfo(crossServerId: any) {
    let cross_arenaInfo: ArenaServerInfo = await this.gameCacheService.getJSON(getCross_ArenaInfo_RKey(crossServerId));
    return cross_arenaInfo
  }


  /**
   * 获取玩家邮件列表
   * @param roleKeyDto
   */
  async getRoleEmail(roleKeyDto: RoleKeyDto, isFindDB: Boolean = false, save_time: number = SAVE_TIME,) {
    let emails = await this.gameCacheService.getJSON(getRoleEmailKey(roleKeyDto));

    if (!emails && isFindDB) {
      let out_days = Number(process.env.LOG_TIMEOUT);
      if (out_days === undefined) {
        out_days = 21;
      }
      let out_time = cTools.newDate();
      out_time.setHours(0, 0, 0, 0);
      out_time.setHours(out_days * 24 + 8);
      //console.log('initEmail out_time:', out_time);

      await this.prismaGameDB.email.updateMany({
        where: {
          serverid: roleKeyDto.serverid,
          owner: roleKeyDto.id,
          time: { lt: out_time },
          state: { not: EEmailState.Deleted },
        },
        data: {
          state: EEmailState.Deleted,
        },
      });

      let emails_mysql = await this.prismaGameDB.email.findMany({
        where: {
          serverid: roleKeyDto.serverid,
          owner: roleKeyDto.id,
          time: { gte: out_time },
          state: { not: EEmailState.Deleted },
        },
      });

      emails = {};
      if (emails_mysql) {
        for (let index = 0; index < emails.length; index++) {
          let emailsEntity: EmailEntity = emails[index];
          emailsEntity.time = cTools.newTransformToUTCZDate(emailsEntity.time);
          emails[Number(emailsEntity.id)] = emailsEntity;
        }
      }
      await this.gameCacheService.setJSON(getRoleEmailKey(roleKeyDto), emails, save_time,);
    }

    if (!emails) { return null; }

    //过滤已经删除的邮件
    let ret_email = {};
    for (const key in emails) {
      if (Object.prototype.hasOwnProperty.call(emails, key)) {
        let element: EmailEntity = emails[key];
        if (element.state < EEmailState.Deleted) {
          ret_email[key] = element;
        }
      }
    }

    return ret_email;
  }

  /**
   * 不在线玩家直接 存邮件数据
   * @param emailEntity
   * @returns
   */
  async createEmailMysql(emailEntity: EmailEntity) {
    delete emailEntity.needSave;
    // let save_data = Object.assign({}, emailEntity, {
    //   time: cTools.newSaveLocalDate(emailEntity.time),
    // });
    let save_data = Object.assign({}, emailEntity, { time: cTools.newSaveLocalDate(new Date(emailEntity.time)), });
    let ret = await this.prismaGameDB.email.create({
      data: save_data,
    });

    return ret;
  }

  /**
   * 保存到内存
   * @param roleKeyDto
   * @param emails
   * @returns
   */
  async updateRoleEmail(roleKeyDto: RoleKeyDto, emails: any, save_time: number = SAVE_TIME) {
    if (!emails) {
      return;
    }

    await this.gameCacheService.setJSON(getRoleEmailKey(roleKeyDto), emails, save_time,);
  }

  async saveRoleJWT(roleKeyDto: RoleKeyDto, jwt: string, save_time: number = SAVE_TIME,) {
    if (!jwt) {
      return;
    }

    await this.gameCacheService.setJSON(getRoleJwtKey(roleKeyDto), jwt, save_time);
  }

  async getRoleJWT(roleKeyDto: RoleKeyDto) {
    let jwt = await this.gameCacheService.getJSON(getRoleJwtKey(roleKeyDto));

    return jwt;
  }

  /**
   * 信息更新
   * @param roleKeyDto
   */
  async expireRoleData(roleKeyDto: RoleKeyDto, save_time: number = -1) {
    if (save_time === -1) {
      save_time = getRandomSaveTime();
    }
    //信息更新
    //更新角色基础信息
    await this.gameCacheService.expire(getRoleKey(roleKeyDto), save_time);
    //更新英雄信息
    await this.gameCacheService.expire(getRoleHeroKey(roleKeyDto), save_time);
    //更新角色游戏信息
    await this.gameCacheService.expire(getRoleInfoKey(roleKeyDto), save_time);
    //更新角色道具信息
    await this.gameCacheService.expire(getRoleItemKey(roleKeyDto), save_time);
    //更新角色装备数据
    await this.gameCacheService.expire(getRoleEquipKey(roleKeyDto), save_time);
    //更新角色邮件数据
    await this.gameCacheService.expire(getRoleEmailKey(roleKeyDto), save_time);
    //更新JWT数据库
    await this.gameCacheService.expire(getRoleJwtKey(roleKeyDto), save_time);
    //更新竞技场挑战日志
    await this.gameCacheService.expire(getRoleArenaLogKey(roleKeyDto), save_time);

    //更新跨服竞技场挑战日志
    await this.gameCacheService.expire(getRoleCrossArenaLogKey(roleKeyDto), save_time);
  }

  /**
   * 销毁角色所有信息
   * @param roleKeyDto
   */
  async onDestroyRoleData(roleKeyDto: RoleKeyDto) {
    //销毁角色基础信息
    await this.gameCacheService.del(getRoleKey(roleKeyDto));
    //销毁英雄信息
    await this.gameCacheService.del(getRoleHeroKey(roleKeyDto));
    //销毁角色游戏信息
    await this.gameCacheService.del(getRoleInfoKey(roleKeyDto));
    //销毁角色道具信息
    await this.gameCacheService.del(getRoleItemKey(roleKeyDto));
    //销毁角色装备数据
    await this.gameCacheService.del(getRoleEquipKey(roleKeyDto));
    //销毁角色邮件数据
    await this.gameCacheService.del(getRoleEmailKey(roleKeyDto));
    //销毁JWT数据库
    await this.gameCacheService.del(getRoleJwtKey(roleKeyDto));
    //销毁竞技场挑战日志
    await this.gameCacheService.del(getRoleArenaLogKey(roleKeyDto));
    //更新跨服竞技场挑战日
    await this.gameCacheService.del(getRoleCrossArenaLogKey(roleKeyDto));

  }

  async UpdateArenaDate(roleKeyDto: RoleKeyDto) {
    let roleHero = await this.gameCacheService.getJSON(getRoleHeroKey(roleKeyDto));
    let roleInfo = await this.gameCacheService.getJSON(getRoleInfoKey(roleKeyDto));
    await this.updataSeverRoleInfo(roleKeyDto.serverid, roleInfo, roleHero.info);

    let data = await this.gameCacheService.getJSON(getServerArenaRankKey(roleKeyDto.serverid));
    if (data && data[roleKeyDto.id]) {
      this.saveSRInfo(data, roleKeyDto.id, roleInfo, roleHero.info)
      await this.updateServerAreanRank(roleKeyDto.serverid, data)
    }
  }

  async setUpdateDate(roleKeyDto: RoleKeyDto) {
    let var_data: any;
    var_data = await this.gameCacheService.getJSON(getSaveDataKey(roleKeyDto.serverid),);

    if (!var_data) { var_data = {}; }
    let save_time = getRandomSaveTime();
    await this.expireRoleData(roleKeyDto, save_time);

    if (var_data[roleKeyDto.id]) { return; }

    let cur_time = Date.now();
    var_data[roleKeyDto.id] = cur_time;

    await this.gameCacheService.setJSON(getSaveDataKey(roleKeyDto.serverid), var_data,);

    await this.UpdateArenaDate(roleKeyDto);

    let over_time = Math.floor(cur_time / 1000) + save_time;
    await this.expireOnlineRole(roleKeyDto, over_time);

  }

  async getUpdateDate(serverid: number) {
    return await this.gameCacheService.getJSON(getSaveDataKey(serverid));
  }

  async clearUpdateDate(serverid: number) {
    await this.gameCacheService.del(getSaveDataKey(serverid));
  }

  /**
   * 保存玩家数据
   * @param roleKeyDto
   */
  async saveRoleData(roleKeyDto: RoleKeyDto) {
    //console.log(`开始保存数据 ${roleKeyDto.id}`)

    let time_data = cTools.newSaveLocalDate();

    let role = await this.getRole(roleKeyDto)
    if (role) {
      await this.prismaGameDB.role.update(
        {
          where: {
            id: roleKeyDto.id
          },
          data: {
            name: role.name,
            status: role.status,
            updatedAt: time_data,
          }
        }
      )
    }
    let roleHero = await this.gameCacheService.getJSON(getRoleHeroKey(roleKeyDto),);
    if (roleHero) {
      // console.log(`保存 roleHero 数据`)
      //console.log(roleHero)

      roleHero.updatedAt = time_data;
      let ret = await this.prismaGameDB.roleHero.update({
        where: {
          id: roleKeyDto.id,
        },
        data: {
          info: roleHero.info,
          updatedAt: time_data,
        },
      });

      //Logger.debug("save roleHero ret:",ret);
    }

    let roleInfo = await this.gameCacheService.getJSON(getRoleInfoKey(roleKeyDto),);
    if (roleInfo) {
      //console.log(`保存 roleInfo 数据`)
      //console.log(roleInfo)
      roleInfo.exp = Math.min(roleInfo.exp, 2000000000);
      roleInfo.updatedAt = time_data;
      let ret = await this.prismaGameDB.roleInfo.update({
        where: {
          id: roleKeyDto.id,
        },
        data: {
          rolelevel: roleInfo.rolelevel,
          gamelevels: roleInfo.gamelevels,
          exp: roleInfo.exp,
          info: roleInfo.info,
          merge: roleInfo.merge,
          updatedAt: time_data,
        },
      });
      //Logger.debug("save roleInfo ret:",ret);
    }

    let roleItem = await this.gameCacheService.getJSON(getRoleItemKey(roleKeyDto));
    if (roleItem) {
      //console.log(`保存 roleItem 数据`)
      //console.log(roleItem)

      roleItem.updatedAt = time_data;
      let ret = await this.prismaGameDB.roleItem.update({
        where: {
          id: roleKeyDto.id,
        },
        data: {
          info: roleItem.info,
          updatedAt: time_data,
        },
      });
      //Logger.debug("save roleItem ret:",ret);
    }

    let roleEquip = await this.gameCacheService.getJSON(getRoleEquipKey(roleKeyDto),);
    if (roleEquip) {
      //console.log(`保存 roleEquip 数据`)
      //console.log(roleEquip)

      roleEquip.updatedAt = time_data;
      let ret = await this.prismaGameDB.roleEquip.update({
        where: {
          id: roleKeyDto.id,
        },
        data: {
          info: roleEquip.info,
          updatedAt: time_data,
        },
      });

      //Logger.debug("save roleEquip ret:",ret);
    }

    //邮件处理
    let emailList: EmailList = await this.gameCacheService.getJSON(getRoleEmailKey(roleKeyDto));
    //console.log("emailList");
    //console.log(emailList);
    if (emailList && Object.keys(emailList).length > 0) {
      let delete_ids = [];
      for (const eid in emailList) {
        if (Object.prototype.hasOwnProperty.call(emailList, eid)) {
          let emailEntity: EmailEntity = emailList[Number(eid)];
          if (emailEntity.needSave) {
            delete emailEntity.needSave;
            // let save_data = Object.assign({}, emailEntity, {
            //   time: cTools.newSaveLocalDate(emailEntity.time),
            // });
            let save_data = {
              id: emailEntity.id,
              serverid: emailEntity.serverid,
              title: emailEntity.title,
              content: emailEntity.content,
              items: <any>emailEntity.items ? <any>emailEntity.items : {},
              state: emailEntity.state,
              sender: emailEntity.sender,
              owner: emailEntity.owner,
              time: cTools.newSaveLocalDate(new Date(emailEntity.time))
            }

            await this.prismaGameDB.email.upsert({
              where: { id: emailEntity.id },
              create: save_data,
              update: save_data,
            });

            if (emailEntity.state === EEmailState.Deleted) {
              delete_ids.push(Number(emailEntity.id));
            }
          }
        }
      }

      //清空标记为删除的邮件
      if (delete_ids.length > 0) {
        for (let index = 0; index < delete_ids.length; index++) {
          const eid = delete_ids[index];
          delete emailList[eid];
        }
        await this.gameCacheService.setJSON(getRoleEmailKey(roleKeyDto), emailList, SAVE_TIME);
      }
    }

    //挑战日志处理
    let arena_log: ArenaLogEntity[] = await this.gameCacheService.getJSON(getRoleArenaLogKey(roleKeyDto));
    if (arena_log && arena_log.length > 0) {

      arena_log.sort(function (a, b) {

        if (!a || !a.time) { return 1; }

        if (!b || !b.time) { return -1; }

        let atime = new Date(a.time).getTime();
        let btime = new Date(b.time).getTime();
        return btime - atime;
      })

      //过滤
      let is_update = true;
      let tmp_arenaLog = [];
      for (let index = 0; index < arena_log.length; index++) {
        let element = arena_log[index];
        if (element.state < EArenaSatate.DELETED) {
          if (tmp_arenaLog.length <= TableGameConfig.arena_log_max) {
            tmp_arenaLog.push(element);
          }
          else {
            element.state = EArenaSatate.DELETED;
            element.save = true;
            is_update = true;
          }
        }
        else {
          is_update = true;
        }

        if (element.save) {
          delete element.save;
          let save_obj = Object.assign({}, element, {
            time: cTools.newSaveLocalDate(new Date(element.time)),
            updatedAt: cTools.newSaveLocalDate()
          })

          await this.prismaGameDB.arenaLog.update({
            where: {
              id: save_obj.id,
            },
            data: save_obj
          })
        }
      }

      if (is_update) {
        await this.gameCacheService.setJSON(getRoleArenaLogKey(roleKeyDto), tmp_arenaLog, SAVE_TIME);
      }
    }

    //跨服挑战日志处理
    let cross_arena_log: ArenaLogEntity[] = await this.gameCacheService.getJSON(getRoleCrossArenaLogKey(roleKeyDto));
    if (cross_arena_log && cross_arena_log.length > 0) {

      cross_arena_log.sort(function (a, b) {

        if (!a || !a.time) { return 1; }

        if (!b || !b.time) { return -1; }

        let atime = new Date(a.time).getTime();
        let btime = new Date(b.time).getTime();
        return btime - atime;
      })

      //过滤
      let is_update = true;
      let tmp_arenaLog = [];
      for (let index = 0; index < cross_arena_log.length; index++) {
        let element = cross_arena_log[index];
        if (element.state < EArenaSatate.DELETED) {
          if (tmp_arenaLog.length <= TableGameConfig.arena_log_max_kf) {
            tmp_arenaLog.push(element);
          }
          else {
            element.state = EArenaSatate.DELETED;
            element.save = true;
            is_update = true;
          }
        }
        else {
          is_update = true;
        }

        if (element.save) {
          delete element.save;
          let save_obj = Object.assign({}, element, {
            time: cTools.newSaveLocalDate(new Date(element.time)),
            updatedAt: cTools.newSaveLocalDate()
          })

          await this.prismaGameDB.crossArenaLog.update({
            where: {
              id: save_obj.id,
            },
            data: save_obj
          })
        }
      }

      if (is_update) {
        await this.gameCacheService.setJSON(getRoleCrossArenaLogKey(roleKeyDto), tmp_arenaLog, SAVE_TIME);
      }
    }
  }

  /**
   * 保存全服数据
   * @param serverid
   */
  async saveServerData(serverid: number) {

    //console.log('saveServerData serverid:', serverid);
    //全服邮件
    await this.saveGlobalEmailMySql(serverid);

    //全局数据
    await this.saveSververInfo(serverid);

    //竞技排行
    await this.saveSeverArenaRank(serverid);

    //排行榜
    await this.saveSeverRank(serverid);

    //全服聊天
    await this.saveChatDataMysql(serverid, EChatType.Server);

    //公会聊天
    await this.saveChatDataMysql(serverid, EChatType.Guild);

    //公会数据
    await this.saveGuildInfo(serverid);
  }

  //关服销毁-保存并缓存数据
  async onDestroy(serverIds: number[], isSave: boolean = true) {

    if (!serverIds || !serverIds.length) {
      return
    }

    for (let index = 0; index < serverIds.length; index++) {
      const serveridx = serverIds[index];
      if (isSave) {
        //保存邮件系统
        await this.saveGlobalEmailMySql(serveridx, false);
        //保存全服数据
        await this.saveSververInfo(serveridx);
        //保存全服竞技场数据
        await this.saveSeverArenaRank(serveridx);
        //保存全服排行数据
        await this.saveSeverRank(serveridx);
        //全服聊天
        await this.saveChatDataMysql(serveridx, EChatType.Server);
        //公会聊天
        await this.saveChatDataMysql(serveridx, EChatType.Guild);
        //公会
        await this.saveGuildInfo(serveridx);
      }

      //删除邮件系统
      await this.gameCacheService.del(getGlobalEmailKey(serveridx));
      //删除全服数据
      await this.gameCacheService.del(getServerInfoKey(serveridx));
      //删除全服竞技场数据
      await this.gameCacheService.del(getServerArenaRankKey(serveridx));
      //删除全服排行数据
      await this.gameCacheService.del(this.getServerRankRedisKey(serveridx, EGameRankType.LEVEL));
      await this.gameCacheService.del(this.getServerRankRedisKey(serveridx, EGameRankType.ELITE));
      await this.gameCacheService.del(this.getServerRankRedisKey(serveridx, EGameRankType.ARENA));
      await this.gameCacheService.del(this.getServerRankRedisKey(serveridx, EGameRankType.ARENA2));
      await this.gameCacheService.del(this.getServerRankRedisKey(serveridx, EGameRankType.ABYSS_DRAGON));
      await this.gameCacheService.del(this.getServerRankRedisKey(serveridx, EGameRankType.DEMONABYSS));
      await this.gameCacheService.del(this.getServerRankRedisKey(serveridx, EGameRankType.WRESTLE));
      //删除角色中心库
      await this.gameCacheService.del(getSRinfoKey(serveridx));
      //删除数据库节点-控制-服务器ID
      await this.delDataServerIds(serveridx);
      //删除全服聊天
      await this.gameCacheService.del(this.getChatKeyByType(serveridx, EChatType.Server));

      //删除公会聊天
      let all: GuildEntity[] = await this.gameCacheService.getHash(getGuildInfoHmKey(serveridx));
      if (all && all.length > 0) {
        for (let index = 0; index < all.length; index++) {
          const guild = all[index];
          await this.gameCacheService.del(this.getChatKeyByType(serveridx, EChatType.Guild, guild.guildid));
        }
      }

      //删除公会
      await this.gameCacheService.del(getGuildInfoKey(serveridx));
      await this.gameCacheService.del(getGuildInfoHmKey(serveridx));
    }
  }

  //清理全服数据
  async onDestroyMysqlData(serveridx_min: number, serveridx_max: number) {

    for (let serveridx = serveridx_min; serveridx <= serveridx_max; serveridx++) {

      await this.prismaGameDB.arenaLog.deleteMany(
        {
          where: {
            serverid: serveridx
          }
        }
      )

      await this.prismaGameDB.crossArenaLog.deleteMany(
        {
          where: {
            serverid: serveridx
          }
        }
      )

      await this.prismaGameDB.arenaRank.deleteMany(
        {
          where: {
            serverid: serveridx
          }
        }
      )

      await this.prismaGameDB.email.deleteMany(
        {
          where: {
            serverid: serveridx
          }
        }
      )

      await this.prismaGameDB.role.deleteMany(
        {
          where: {
            serverid: serveridx
          }
        }
      )

      await this.prismaGameDB.roleEquip.deleteMany(
        {
          where: {
            serverid: serveridx
          }
        }
      )

      await this.prismaGameDB.roleHero.deleteMany(
        {
          where: {
            serverid: serveridx
          }
        }
      )

      await this.prismaGameDB.roleInfo.deleteMany(
        {
          where: {
            serverid: serveridx
          }
        }
      )
      await this.prismaGameDB.roleItem.deleteMany(
        {
          where: {
            serverid: serveridx
          }
        }
      )

      await this.prismaGameDB.serverInfo.deleteMany(
        {
          where: {
            serverid: serveridx
          }
        }
      )

      await this.prismaGameDB.gameRank.deleteMany(
        {
          where: {
            serverid: serveridx
          }
        }
      )

      await this.prismaGameDB.chatLog.deleteMany(
        {
          where: {
            serverid: serveridx
          }
        }
      )

      await this.prismaGameDB.guild.deleteMany(
        {
          where: {
            serverid: serveridx
          }
        }
      )

    }
  }

  sendLog(req: any, rawData: any) {

    let is_can = true;
    if (!rawData?.srctype) {
      is_can = false;
    }

    if (!rawData?.ok) {
      is_can = false;
    }



    if (!gameConst.only_game_log[rawData.srctype]) { is_can = false; }

    if (rawData?.ok && cTools.getTestModel()) {
      is_can = true;
    }

    //屏蔽日志处理
    if (gameConst.no_log[rawData.srctype]) { is_can = false; }

    if (!is_can) {
      if (rawData.additem) {
        cItemBag.clearItemTag(rawData.additem);
      }

      if (rawData.decitem) {
        cItemBag.clearItemTag(rawData.decitem);
      }

      if (rawData.decEquipInfo) {
        delete rawData.decEquipInfo;
      }

      return;
    }


    let data: any = {};
    data.user = req.user || {};
    data.logtime = cTools.newSaveLocalDate();
    data.type = rawData.srctype || -1;
    data.req = req.body || {};

    if (gameConst.only_game_log[rawData.srctype] || cTools.getTestModel()) {
      data.savesys = true;
    }

    if (rawData.srctype === EActType.LOGIN) {
      let resLoginMsg: RESLoginMsg = rawData;
      data.sDate = {
        userid: req.body.username,
        roleid: resLoginMsg.role.id,
        name: resLoginMsg.role.name,
        serverid: resLoginMsg.role.serverid,
        rolelevel: resLoginMsg.info.rolelevel,
        logtime: data.logtime,
        ip: req.headers["x-real-ip"]
      };

      delete resLoginMsg.role.serverid;
    }

    if (rawData.additem) {
      data.additem = Object.assign({}, rawData.additem);
      cItemBag.clearItemTag(rawData.additem);
    }

    if (rawData.decitem) {
      data.decitem = Object.assign({}, rawData.decitem);
      cItemBag.clearItemTag(rawData.decitem);
    }

    if (rawData.addEquip) {
      data.addEquip = JSON.parse(JSON.stringify(rawData.addEquip));
    }

    if (rawData.addTmpEquip) {
      let add_tmp = JSON.parse(JSON.stringify(rawData.addTmpEquip));
      data.addEquip = data.addEquip || {}
      data.addEquip = Object.assign({}, data.addEquip, add_tmp);
    }

    if (rawData.decEquipInfo) {
      data.decEquipInfo = Object.assign({}, rawData.decEquipInfo);
      delete rawData.decEquipInfo;
    }

    this.logbullService.sendLogBull(data);
  }



  /**
   * 每日重置相关系统
   */
  async resetDaily(retRoleALLInfo: RetRoleALLInfo, resetDaily: SetDailyEntity, req: any) {

    //roleIemBag: ItemsRecord, roleInfoEntity: RoleInfoEntity

    if (!retRoleALLInfo.isHaveData() || !retRoleALLInfo.roleItem) {
      return;
    }

    let roleIemBag = retRoleALLInfo.roleItem;
    let roleInfoEntity = retRoleALLInfo.roleInfo;

    if (!roleInfoEntity || !roleInfoEntity.info) { return; }
    let roleSubInfoEntity = retRoleALLInfo.roleSubInfo;

    /**为了发日志 */
    let retMsg = new RESChangeMsg();
    retMsg.srctype = EActType.DAILY_RESET;

    /**挂机 每日奖励次数 */
    if (roleSubInfoEntity.timeAward) {
      roleSubInfoEntity.timeAward.dailyNum = resetDaily.timeAward_dailyNum;
    }
    /**每日任务 */
    if (roleSubInfoEntity.taskDaily) {
      let reset_itemid = TableGameConfig.var_taskdaily_point;
      cTaskSystem.initTaskDaily(retRoleALLInfo);
      resetDaily.taskDaiy = roleSubInfoEntity.taskDaily;
      resetDaily.reSetItem = resetDaily.reSetItem || {};
      resetDaily.reSetItem[reset_itemid] = 0;
      retMsg.decitem = retMsg.decitem || {}
      if (roleIemBag && roleIemBag[reset_itemid] > 0) {
        let item_num = roleIemBag[reset_itemid];
        cItemBag.decitem(roleIemBag, retMsg.decitem, reset_itemid, item_num);
      }
    }

    if (roleSubInfoEntity.taskGuild) {
      cTaskSystem.initTaskGuild(retRoleALLInfo);
      resetDaily.taskGuild = roleSubInfoEntity.taskGuild;
    }

    /**福利-每日有礼 */
    if (roleSubInfoEntity.welfareDaily) {
      let table_data = TableWelfareDailyAward.getTable();
      roleSubInfoEntity.welfareDaily.todayReceived = false;
      if (
        roleSubInfoEntity.welfareDaily.receivedDays >=
        Object.keys(table_data).length
      ) {
        roleSubInfoEntity.welfareDaily.receivedDays = 0;
      }
      resetDaily.welfareDaily = roleSubInfoEntity.welfareDaily;
    }

    //福利-积天豪礼
    if (roleSubInfoEntity.welfarePaidDaily) {
      roleSubInfoEntity.welfarePaidDaily.dailyReceived = false;
      resetDaily.welfarePaidDays = roleSubInfoEntity.welfarePaidDaily;
    }

    //充值信息
    if (roleSubInfoEntity.rechargeInfo) {
      roleSubInfoEntity.rechargeInfo.today6IsPaid = false;
      roleSubInfoEntity.rechargeInfo.dailyAmounts = 0;
    }

    //检测状态和特权 是否过期
    if (roleSubInfoEntity.status && Object.keys(roleSubInfoEntity.status).length > 0) {
      cGameCommon.checkStatusTimeOut(roleInfoEntity);
      resetDaily.status = roleSubInfoEntity.status;
    }

    //购买道具使用限制 清理每日标记
    if (roleSubInfoEntity.buyItemTag && roleSubInfoEntity.buyItemTag.dailyTag) {
      resetDaily.dailyTag = {};
      delete roleSubInfoEntity.buyItemTag.dailyTag;
    }

    //月卡每日重置
    if (roleSubInfoEntity.rechargeShop?.monsthCard_daily !== undefined) {
      roleSubInfoEntity.rechargeShop.monsthCard_daily = false;
      resetDaily.monsthCard_daily = false;
    }
    //终身卡每日重置
    if (roleSubInfoEntity.rechargeShop?.foreverCard_daily !== undefined) {
      roleSubInfoEntity.rechargeShop.foreverCard_daily = false;
      resetDaily.foreverCard_daily = false;
    }

    //夺宝大作战-每日重置处理  没有合服的状态下
    if (roleSubInfoEntity.pirateShip && retRoleALLInfo.roleInfo.merge === 0) {
      //每日奖励
      let cur_sys_table = new TableGameSys(TableGameSys.pirateShip);
      let server_pirateShip = retRoleALLInfo.serverInfo.info.pirateShip;
      let role_pirateShip = roleSubInfoEntity.pirateShip;
      let days = 1;
      if (roleSubInfoEntity.pirateShip.damage > 0) {
        if (role_pirateShip.rankDAT) {
          let last_date = new Date(cTools.newLocalDate0String(new Date(role_pirateShip.rankDAT)));
          let cur_date = new Date(cTools.newLocalDate0String());
          days = Math.floor(Math.abs((cur_date.getTime() - last_date.getTime())) / (1000 * 60 * 60 * 24));

          let season_end_date = new Date(role_pirateShip.sTime);
          season_end_date.setHours(TableGameConfig.ps_season_days * 24);
          //赛季剩余天数
          let season_days = Math.floor(Math.abs((season_end_date.getTime() - last_date.getTime())) / (1000 * 60 * 60 * 24));
          days = Math.floor(Math.min(days, season_days));
        }

        if (days >= 1) {
          role_pirateShip.rankDAT = cTools.newLocalDate0String();
          let cur_rank = role_pirateShip.rank;
          //是否同一个赛季
          if (role_pirateShip.season !== server_pirateShip.season) {
            if (role_pirateShip.season === server_pirateShip.lseason) {
              //上赛季 取上赛季排名
              cur_rank = cGameCommon.getPSRank(roleSubInfoEntity.roleid, server_pirateShip.lrank);
            }
            else {
              //跨多个赛季 直接给榜单外奖励
              cur_rank = TableGameConfig.ps_rank_max + 1;
            }
          }
          else {
            //当前赛季
            cur_rank = cGameCommon.getPSRank(roleSubInfoEntity.roleid, server_pirateShip.rank);
          }

          let cur_award_data = cGameCommon.getPSDailyAward(cur_rank);
          for (let index = 0; index < days; index++) {
            let cur_SendEmailDto: SendEmailDto = {
              key: gameConst.email_systemTag,
              serverid: retRoleALLInfo.serverInfo.serverid,
              title: `${cur_sys_table.name}${languageConfig.act_type[EActType.PS_DAILY_AWARD]}[${cur_rank}]`,
              content: `${cur_sys_table.name} 第[${role_pirateShip.season}]赛季 ${languageConfig.act_type[EActType.PS_DAILY_AWARD]}`,
              items: cur_award_data.award,
              sender: gameConst.email_systemTag,
              owner: retRoleALLInfo.roleSubInfo.roleid,
            }
            await this.sendEmail(cur_SendEmailDto, roleInfoEntity);
          }
          roleSubInfoEntity.pirateShip = role_pirateShip;
        }
      }

      //新赛季重置处理
      let last_season = role_pirateShip.season;
      let last_rank = role_pirateShip.rank;
      if (role_pirateShip.season !== server_pirateShip.season) {
        let server_pirateShip = retRoleALLInfo.serverInfo.info.pirateShip;

        role_pirateShip = new PirateShipRoleEntity(server_pirateShip.season, server_pirateShip.sTime);
        //赛季重置后 要从0点开始计算恢复骰子
        role_pirateShip.adddice_time = cTools.newLocalDate0String();
        roleSubInfoEntity.pirateShip = role_pirateShip;
        resetDaily.pirateShip = role_pirateShip;

        //赛季道具重置
        for (let index = 0; index < gameConst.sp_all_item.length; index++) {
          let item_id = Number(gameConst.sp_all_item[index]);
          resetDaily.reSetItem = resetDaily.reSetItem || {};
          retMsg.decitem = retMsg.decitem || {}

          if (roleIemBag && roleIemBag[item_id] > 0) {
            let item_num = roleIemBag[item_id];
            resetDaily.reSetItem[item_id] = 0;
            cItemBag.decitem(roleIemBag, retMsg.decitem, item_id, item_num);
          }
        }

        //普通骰子初始化
        resetDaily.reSetItem = resetDaily.reSetItem || {};
        resetDaily.reSetItem[TableGameConfig.ps_item_ndice] = TableGameConfig.ps_init_dice;
        retMsg.additem = retMsg.additem || {}
        cItemBag.addItem(roleIemBag, retMsg.additem, TableGameConfig.ps_item_ndice, TableGameConfig.ps_init_dice);

        //福利宝藏状态重置
        if (roleSubInfoEntity.status && roleSubInfoEntity.status[TableStatus.ps_welfare]) {
          delete roleSubInfoEntity.status[TableStatus.ps_welfare];
          resetDaily.status = roleSubInfoEntity.status;
        }

        //福利商品状态重置
        if (roleSubInfoEntity.buyItemTag && roleSubInfoEntity.buyItemTag.alwayTag && roleSubInfoEntity.buyItemTag.alwayTag[TableGameConfig.ps_welfare_shopid]) {
          delete roleSubInfoEntity.buyItemTag.alwayTag[TableGameConfig.ps_welfare_shopid];
          resetDaily.alwayTag = roleSubInfoEntity.buyItemTag.alwayTag;
        }


        let is_in_rank = last_rank <= TableGameConfig.ps_rank_max;
        if (last_season === server_pirateShip.lseason) {
          //跨一个赛季  
          last_rank = cGameCommon.getPSRank(roleSubInfoEntity.roleid, server_pirateShip.lrank);
          is_in_rank = last_rank <= TableGameConfig.ps_rank_max;
        } else {
          //跨多个赛季
          //如果无视之前赛季排名，直接给榜单外奖励
          is_in_rank = false;
          last_rank = TableGameConfig.ps_rank_max + 1;
        }

        //赛季奖励邮件
        let cur_s_award_data = cGameCommon.getPSSeasonAward(last_rank);
        let cur_SendEmailDto: SendEmailDto = {
          key: gameConst.email_systemTag,
          serverid: retRoleALLInfo.serverInfo.serverid,
          title: `${cur_sys_table.name}${languageConfig.act_type[EActType.PS_S_AWARD]}`,
          content: `${cur_sys_table.name} 第[${last_season}]赛季 ${languageConfig.act_type[EActType.PS_S_AWARD]}`,
          items: cur_s_award_data.award,
          sender: gameConst.email_systemTag,
          owner: retRoleALLInfo.roleSubInfo.roleid,
        }
        await this.sendEmail(cur_SendEmailDto, roleInfoEntity);
      }
    }

    // //没有合服的状态下
    // if (roleSubInfoEntity.arenaInfo && retRoleALLInfo.roleInfo.merge === 0) {
    //   //竞技场挑战次数每日重置
    //   roleSubInfoEntity.arenaInfo.challenge = TableGameConfig.arena_count;

    //   let cur_sys_table = new TableGameSys(TableGameSys.arena);
    //   let arenaData = retRoleALLInfo.serverInfo.info.arenaData;
    //   let arenaInfo = roleSubInfoEntity.arenaInfo;
    //   let roleid = roleSubInfoEntity.roleid;

    //   //赛季奖励 
    //   let cur_rank = 0;
    //   if (arenaData.season > arenaInfo.season) {
    //     arenaInfo.point = TableGameConfig.arena_base_point;//重置积分
    //     let last_season = cloneDeep(arenaInfo.season); //克隆
    //     arenaInfo.season = arenaData.season;//切换赛季
    //     arenaInfo.show = [];
    //     roleSubInfoEntity.arenaInfo = arenaInfo;
    //     cur_rank = TableGameConfig.arena_rank_max + 1;
    //     for (const key in arenaData.lrank) {
    //       if (Object.prototype.hasOwnProperty.call(arenaData.lrank, key)) {
    //         if (roleid == arenaData.lrank[key]) {
    //           cur_rank = Number(key) + 1;
    //           break;
    //         }
    //       }
    //     }
    //     let cur_award_data = cGameCommon.getArenaSeasonAward(cur_rank);
    //     let cur_SendEmailDto: SendEmailDto = {
    //       key: gameConst.email_systemTag,
    //       serverid: retRoleALLInfo.serverInfo.serverid,
    //       title: `${cur_sys_table.name}${languageConfig.rank_season_award}`,
    //       content: `${cur_sys_table.name}第[${last_season}]赛季${languageConfig.rank_season_award}`,
    //       items: cur_award_data.award,
    //       sender: gameConst.email_systemTag,
    //       owner: roleid,
    //     }
    //     await this.sendEmail(cur_SendEmailDto, roleInfoEntity);
    //     //清除竞技场日志
    //     await this.gameCacheService.setJSON(getRoleArenaLogKey({ id: roleid, serverid: retRoleALLInfo.serverInfo.serverid }), [], SAVE_TIME);
    //   }

    //   //每日奖励
    //   if (cur_rank == 0) {
    //     let SveRank = await this.getSeverArenaRank(retRoleALLInfo.serverInfo.serverid);
    //     let rankdata: any = SveRank[roleid]
    //     cur_rank = rankdata ? rankdata.r : TableGameConfig.arena_rank_max
    //   }
    //   let cur_award_data = cGameCommon.getArenaDailyAward(cur_rank);
    //   let cur_SendEmailDto: SendEmailDto = {
    //     key: gameConst.email_systemTag,
    //     serverid: retRoleALLInfo.serverInfo.serverid,
    //     title: `${cur_sys_table.name}${languageConfig.rank_daily_award}`,
    //     content: `${cur_sys_table.name}${languageConfig.rank_daily_award}`,
    //     items: cur_award_data.award,
    //     sender: gameConst.email_systemTag,
    //     owner: roleid,
    //   }
    //   await this.sendEmail(cur_SendEmailDto, roleInfoEntity);

    // }

    //没有合服的状态下才能发每日排行榜奖励
    if (retRoleALLInfo.roleInfo.merge === 0) {
      await this.sendDailyRankAward(retRoleALLInfo)
    }

    //累充礼包是否每日重置
    if (TableGameConfig.recharge_gift_rest === 1) {
      if (retRoleALLInfo.roleSubInfo.rechargeGift) {
        retRoleALLInfo.roleSubInfo.rechargeGift = {};
        resetDaily.rechargeGift = {};
      }
    }

    /**关卡扫荡 每日重置 */
    if (roleSubInfoEntity.reDayInfo) {
      roleSubInfoEntity.reDayInfo = new ReDayInfo();
      resetDaily.reDayInfo = roleSubInfoEntity.reDayInfo;
      resetDaily.elitesweepcount = 0;
    }
    //角斗重置
    if (roleSubInfoEntity.wrestle?.fight?.daynum) {
      roleSubInfoEntity.wrestle.fight.daynum = 0;
      resetDaily.wrestle_daynum = 0;
    }

    this.sendLog(req, retMsg);

  }

  /***
   * 每日发送排行奖励
   */
  async sendDailyRankAward(retRoleALLInfo: RetRoleALLInfo) {

    let roleInfoEntity = retRoleALLInfo?.roleInfo;
    if (!roleInfoEntity) { return; }
    let serverid = retRoleALLInfo.serverInfo.serverid
    let roleid = retRoleALLInfo.roleSubInfo.roleid
    let crossServerId = retRoleALLInfo.serverInfo.info.crossServerId

    function getEmailinfo(type: EGameRankType, cur_rank: number, sys: number) {
      if (!cur_rank) { return; }
      if (!cGameCommon.isOpenSystem(retRoleALLInfo, sys)) { return }

      let cur_award_data: any = cGameCommon.getRankDailyAwards(type, cur_rank);

      let cur_sys_table = new TableGameSys(sys);
      let sys_name = cur_sys_table?.name || sys;
      let str = `${sys_name}${languageConfig.rank_daily_award}`
      if (type === EGameRankType.WRESTLE || type === EGameRankType.SEASON_CROSS_ARENA || type === EGameRankType.SEASON_ARENA) {
        str = `${sys_name}${languageConfig.rank_season_award}`
      }
      let cur_SendEmailDto: SendEmailDto = {
        key: gameConst.email_systemTag,
        serverid: serverid,
        title: str,
        content: str,
        items: cur_award_data.award,
        sender: gameConst.email_systemTag,
        owner: roleid,
      }
      return cur_SendEmailDto;
    }
    //跨服竞技排行榜奖励
    if (roleInfoEntity.info.arenaInfoKf && crossServerId) {
      let Rank = await this.getServerRankByType(crossServerId, EGameRankType.CROSS_ARENA)
      //发送每日
      let cur_SendEmailDto: SendEmailDto = getEmailinfo(EGameRankType.CROSS_ARENA, Rank[roleid]?.info?.r, TableGameSys.arenaKF)
      await this.sendEmail(cur_SendEmailDto, roleInfoEntity);
      //发送赛季
      let arenaData: ArenaServerInfo = await this.gameCacheService.getJSON(getCross_ArenaInfo_RKey(crossServerId));
      if (arenaData && arenaData.season > roleInfoEntity.info.arenaInfoKf.season) {
        roleInfoEntity.info.arenaInfoKf = new ArenaInfo(arenaData.season, arenaData.sTime, TableGameConfig.arena_count_kf);
        // roleInfoEntity.info.arenaInfoKf.season = arenaData.season
        let seasonRank = TableGameConfig.arena_rank_max_kf
        let index = arenaData.lrank.indexOf(roleid)
        if (index != -1) { seasonRank = index }
        let cur_SendEmailDto: SendEmailDto = getEmailinfo(EGameRankType.SEASON_CROSS_ARENA, seasonRank + 1, TableGameSys.arenaKF)
        await this.sendEmail(cur_SendEmailDto, roleInfoEntity);
        //清理跨服竞技场日志缓存
        await this.gameCacheService.setJSON(getRoleCrossArenaLogKey({ id: roleid, serverid: crossServerId }), [], SAVE_TIME);

      }
    }
    //竞技排行榜奖励
    if (roleInfoEntity.info.arenaInfo) {
      // let Rank = this.getServerRankByType(serverid, EGameRankType.ARENA)
      let Rank = await this.getSeverArenaRank(serverid);
      //发送每日
      let cur_SendEmailDto: SendEmailDto = getEmailinfo(EGameRankType.ARENA, Rank[roleid]?.r, TableGameSys.arena)
      await this.sendEmail(cur_SendEmailDto, roleInfoEntity);
      //发送赛季
      let arenaData: ArenaServerInfo = retRoleALLInfo.serverInfo.info.arenaData;
      if (arenaData && arenaData.season > roleInfoEntity.info.arenaInfo.season) {
        roleInfoEntity.info.arenaInfo = new ArenaInfo(arenaData.season, arenaData.sTime, TableGameConfig.arena_count);
        // roleInfoEntity.info.arenaInfo.season = arenaData.season
        let seasonRank = TableGameConfig.arena_rank_max
        let index = arenaData.lrank.indexOf(roleid)
        if (index != -1) { seasonRank = index }
        let cur_SendEmailDto: SendEmailDto = getEmailinfo(EGameRankType.SEASON_ARENA, seasonRank + 1, TableGameSys.arena)
        await this.sendEmail(cur_SendEmailDto, roleInfoEntity);
        //清理竞技场日志缓存
        await this.gameCacheService.setJSON(getRoleArenaLogKey({ id: roleid, serverid: retRoleALLInfo.serverInfo.serverid }), [], SAVE_TIME);
      }
    }
    //关卡排行榜每日奖励
    if ((roleInfoEntity.gamelevels ?? 0) >= TableGameConfig.gl_rank_minlv) {
      let Rank: GameRankRecord = await this.gameCacheService.getJSON(getServerLRankKey(serverid));
      let cur_SendEmailDto: SendEmailDto = getEmailinfo(EGameRankType.LEVEL, Rank[roleid]?.info?.r, TableGameSys.gamelevels)
      await this.sendEmail(cur_SendEmailDto, roleInfoEntity);
    }
    //精英排行榜每日奖励
    if ((roleInfoEntity.info?.elitelevels ?? 0) >= TableGameConfig.el_rank_open) {
      let Rank: GameRankRecord = await this.gameCacheService.getJSON(getServerERankKey(serverid));
      let cur_SendEmailDto: SendEmailDto = getEmailinfo(EGameRankType.ELITE, Rank[roleid]?.info?.r, TableGameSys.elitelevels)
      await this.sendEmail(cur_SendEmailDto, roleInfoEntity);
    }
    //魔渊排行榜每日奖励
    if ((roleInfoEntity.info?.demonAbyss?.da_levels ?? 0) >= TableGameConfig.da_rank_open) {
      let Rank: GameRankRecord = await this.gameCacheService.getJSON(getServerDARankKey(serverid));
      let cur_SendEmailDto: SendEmailDto = getEmailinfo(EGameRankType.DEMONABYSS, Rank[roleid]?.info?.r, TableGameSys.demon_abyss)
      await this.sendEmail(cur_SendEmailDto, roleInfoEntity);
    }
    //王者角斗-排行榜奖励
    if (roleInfoEntity.info.wrestle && (roleInfoEntity.info.wrestle.id ?? 0) >= TableGameConfig.w_rank_open) {
      let WrestleData = retRoleALLInfo.serverInfo.info?.WrestleData;
      let season = roleInfoEntity.info.wrestle.season || 0
      let rank = WrestleData.lrank.indexOf(roleid)
      if (WrestleData && WrestleData.season > season && rank !== -1) {
        roleInfoEntity.info.wrestle.season = WrestleData.season;
        let cur_SendEmailDto: SendEmailDto = getEmailinfo(EGameRankType.WRESTLE, rank + 1, TableGameSys.wrestle)
        await this.sendEmail(cur_SendEmailDto, roleInfoEntity);
      }
    }

    //深渊巨龙-排行榜每日奖励
    if (roleInfoEntity.info.reDayInfo.ad_damage && roleInfoEntity.info.reDayInfo.ad_damage > 0) {

      let cur_rank_idx = TableGameConfig.abyss_dragon_rankmax + 1;
      let cur_rank_data = retRoleALLInfo.serverInfo.info.ad_lrank;
      if (cur_rank_data && cur_rank_data[roleInfoEntity.info.roleid]) {
        cur_rank_idx = cur_rank_data[roleInfoEntity.info.roleid]
      }

      let cur_award_data = cGameCommon.getADAward(cur_rank_idx);

      let cur_sys_table = new TableGameSys(TableGameSys.abyss_dragon);
      let sys_name = cur_sys_table?.name || TableGameSys.abyss_dragon;
      let cur_SendEmailDto: SendEmailDto = {
        key: gameConst.email_systemTag,
        serverid: serverid,
        title: `${sys_name}${languageConfig.rank_daily_award}`,
        content: `${sys_name}${languageConfig.rank_daily_award}`,
        items: cur_award_data.award,
        sender: gameConst.email_systemTag,
        owner: retRoleALLInfo.roleSubInfo.roleid,
      }
      await this.sendEmail(cur_SendEmailDto, roleInfoEntity);
    }
  }

  /**
   * 发送邮件
   */
  async sendEmail(sendEmailDto: SendEmailDto, roleInfoEntity: RoleInfoEntity = undefined) {

    if (!sendEmailDto) { return }
    let ret_msg: REMsg = {
      ok: false,
      msg: "error"
    }

    //先发缓存 设置存储标记
    let emailEntity: EmailEntity = {
      id: this.snowflakeIdv1.NextNumber(),
      state: EEmailState.UNREAD,
      time: cTools.newLocalDateString(),
      needSave: true,
      serverid: sendEmailDto.serverid,
      title: sendEmailDto.title,
      content: sendEmailDto.content,
      items: sendEmailDto.items || [],
      sender: sendEmailDto.sender,
      owner: sendEmailDto.owner
    }

    if (sendEmailDto.items && sendEmailDto.items.length > 0) {

      for (let index = 0; index < sendEmailDto.items.length; index++) {
        const element = sendEmailDto.items[index];

        if (element.q || element.einfo) {

          if (!TableGameEquip.checkHave(element.i)) {
            ret_msg.msg = `邮件附件包含非法装备ID:${element.i}`
            Logger.error(ret_msg.msg);
            Logger.error(sendEmailDto);
            return ret_msg
          }

        }
        else {
          if (!TableGameItem.checkHave(element.i)) {
            ret_msg.msg = `邮件附件包含非法道具ID:${element.i}`
            Logger.error(ret_msg.msg);
            Logger.error(sendEmailDto);
            return ret_msg
          }
        }
      }

    }

    //判断类型
    if (emailEntity.owner === gameConst.email_globalTag) {
      //全服邮件
      let emails = await this.getGlobalEmail(sendEmailDto.serverid);

      if (!emails) {
        ret_msg.msg = "sendEmail emails is null ";
        Logger.error(ret_msg.msg);
        return ret_msg
      }

      if (emails[Number(emailEntity.id)]) {
        ret_msg.msg = "sendEmail emailEntity.id  already exists :" + emailEntity.id;
        Logger.error(ret_msg.msg);
        return ret_msg
      }

      emails[Number(emailEntity.id)] = emailEntity;
      await this.saveGlobalEmailReids(sendEmailDto.serverid, emails);
      ret_msg.ok = true;
      ret_msg.srctype = EActType.EMAIL_SEND;
      ret_msg.msg = languageConfig.actTypeSuccess(ret_msg.srctype);
      this.sendLog({ user: { id: emailEntity.owner, name: "全服", serverid: sendEmailDto.serverid }, body: cloneDeep(emailEntity) }, ret_msg);
      return ret_msg;
    }

    //玩家邮件
    //玩家是否在线
    const roleKeyDto: RoleKeyDto = {
      id: emailEntity.owner,
      serverid: emailEntity.serverid
    }

    let local_roleInfo: RoleInfoEntity;
    if (!roleInfoEntity) {
      local_roleInfo = await this.getRoleInfo(roleKeyDto);

      if (!local_roleInfo) {
        //不在线
        let ret = await this.createEmailMysql(emailEntity);

        if (!ret) {
          ret_msg.msg = "个人邮件存储失败";
          return ret_msg;
        }
        ret_msg.ok = true;
        ret_msg.srctype = EActType.EMAIL_SEND;
        ret_msg.msg = languageConfig.actTypeSuccess(ret_msg.srctype);
        this.sendLog({ user: { id: emailEntity.owner, name: emailEntity.owner, serverid: sendEmailDto.serverid }, body: cloneDeep(emailEntity) }, ret_msg);
        return ret_msg;
      }
    }


    let role_emails = await this.getRoleEmail(roleKeyDto);

    if (!role_emails) {
      ret_msg.msg = "getRoleEmail data is nil";
      return ret_msg;
    }

    if (role_emails[Number(emailEntity.id)]) {
      ret_msg.msg = "sendEmail emailEntity.id  already exists :" + emailEntity.id;
      Logger.error(ret_msg.msg);
      return ret_msg;
    }


    role_emails[Number(emailEntity.id)] = emailEntity;
    await this.updateRoleEmail(roleKeyDto, role_emails);

    ret_msg.ok = true;
    ret_msg.srctype = EActType.EMAIL_SEND;
    ret_msg.msg = languageConfig.actTypeSuccess(ret_msg.srctype);


    //更新邮件小红点？
    let roleSubInfoEntity: RoleSubInfoEntity;
    let is_save = false;
    if (roleInfoEntity) {
      roleSubInfoEntity = roleInfoEntity.info;
    }
    else {

      if (local_roleInfo) {
        is_save = true
        roleSubInfoEntity = local_roleInfo.info;
      }
    }

    if (roleSubInfoEntity) {
      roleSubInfoEntity.redDot = roleSubInfoEntity.redDot || {};
      roleSubInfoEntity.redDot[TableGameSys.email] = true;
      if (is_save) {
        await this.updateRoleInfo(roleKeyDto, { info: roleSubInfoEntity });
      }
    }
    this.sendLog({ user: { id: emailEntity.owner, name: roleSubInfoEntity.name || emailEntity.owner, serverid: sendEmailDto.serverid }, body: cloneDeep(emailEntity) }, ret_msg);
    await this.setUpdateDate(roleKeyDto);
    return ret_msg;

  }

  async resetServer(serverid: number) {

    let serverSubInfo: ServerSubInfoEntity = await this.getServerSubInfo(serverid);
    //应对提前开服情况
    cGameServer.checkOpenNewSystem(serverSubInfo);
    await this.resetServerDaily(serverid, serverSubInfo);
    await this.updateSververSubInfo(serverid, serverSubInfo);
  }

  /**服务器全局数据 每日0点开始重置 */
  async resetServerDaily(serverid: number, serverSubInfoEntity: ServerSubInfoEntity = null) {

    let serverSubInfo: ServerSubInfoEntity = serverSubInfoEntity;
    if (!serverSubInfo) {
      serverSubInfo = await this.getServerSubInfo(serverid);
    }

    if (!serverSubInfo) {
      return
    }

    if (serverSubInfo?.pirateShip) {
      //赛季判断  
      let pirateShip = serverSubInfo.pirateShip;
      let season_end_date = new Date(pirateShip.sTime);
      season_end_date.setHours(TableGameConfig.ps_season_days * 24);

      let cur_date = new Date();
      if (cur_date.getTime() >= season_end_date.getTime()) {
        //赛季结束
        pirateShip.sTime = cTools.newLocalDate0String();
        pirateShip.lseason = pirateShip.season;
        pirateShip.season++;
        delete pirateShip.lrank;
        pirateShip.lrank = clone(pirateShip.rank);
        for (let index = 0; index < pirateShip.lrank.length; index++) {
          let element = pirateShip.lrank[index];
          pirateShip.lrank[index] = {
            id: element.id
          }
        }
        delete pirateShip.rank;
        pirateShip.rank = [];
      }

      serverSubInfo.pirateShip = pirateShip;
    }

    if (serverSubInfo?.arenaData) {
      //赛季判断  
      let arenaData = serverSubInfo.arenaData;
      let cur_date = new Date();
      if (cur_date.getDay() == TableGameConfig.arena_season_days) {
        //赛季结束
        arenaData.sTime = cTools.newLocalDate0String();
        arenaData.season++;
        // delete arenaData.rank;
        let SveRank = await this.getSeverArenaRank(serverid);
        arenaData.lrank = Object.keys(SveRank);
        await this.updateServerAreanRank(serverid, {});
        await this.initArenaPoint(serverid);

        //删除日志
        await this.prismaGameDB.arenaLog.deleteMany({
          where: {
            serverid: serverid
          }
        })

      }
    }

    //深渊巨龙排行榜清空
    await this.prismaGameDB.gameRank.deleteMany(
      {
        where: {
          serverid: serverid,
          type: EGameRankType.ABYSS_DRAGON
        }
      }
    )

    serverSubInfo.ad_lrank = {};
    let cur_rank = await this.getServerRankByType(serverid, EGameRankType.ABYSS_DRAGON);
    if (cur_rank && Object.keys(cur_rank).length > 0) {

      for (const key in cur_rank) {
        if (Object.prototype.hasOwnProperty.call(cur_rank, key)) {
          const element = cur_rank[key];
          serverSubInfo.ad_lrank[key] = element.info?.r || TableGameConfig.abyss_dragon_rankmax + 1;
        }
      }
    }

    await this.gameCacheService.setJSON(getServerADRankKey(serverid), {});

    //王者角斗排行榜
    if (serverSubInfo?.WrestleData) {
      //赛季判断  
      let WrestleData = serverSubInfo.WrestleData;
      let cur_date = new Date();
      if (cur_date.getDay() == TableGameConfig.wrestle_season_days) {
        //赛季结束
        WrestleData.sTime = cTools.newLocalDate0String();
        WrestleData.season++;
        let cur_rank = await this.getServerRankByType(serverid, EGameRankType.WRESTLE);
        WrestleData.lrank = Object.keys(cur_rank);
      }
    }

    let guilds: GuildEntity[] = await this.gameCacheService.getHash(getGuildInfoHmKey(serverid));
    if (guilds && guilds.length > 0){
      guilds.forEach(guild => {
        if (guild.info.liveness){
          delete guild.info.liveness;
          this.gameCacheService.setHash(getGuildInfoHmKey(serverid), guild.guildid, guild);
        }
        
      });
      await this.saveGuildInfo(serverid);
    }
  }
  /**
   * 初始化竞技场积分
   * @param serverid
   */
  async initArenaPoint(serverid: number) {

    await this.prismaGameDB.arenaRank.updateMany({
      where: {
        serverid: serverid,
      },
      data: {
        p: -999,//TableGameConfig.arena_base_point,
        // updatedAt: cTools.newSaveLocalDate(),
      },
    });
  }

  /**
   * 保存服务器排行榜
   * @param serverid 
   */
  async saveSeverRank(serverid: number) {
    // await this.saveSeverLRank(serverid);
    await this.saveSeverRankByType(serverid, EGameRankType.LEVEL);
    await this.saveSeverRankByType(serverid, EGameRankType.ELITE);
    await this.saveSeverRankByType(serverid, EGameRankType.ARENA);
    await this.saveSeverRankByType(serverid, EGameRankType.ARENA2);
    await this.saveSeverRankByType(serverid, EGameRankType.ABYSS_DRAGON);
    await this.saveSeverRankByType(serverid, EGameRankType.DEMONABYSS);
    await this.saveSeverRankByType(serverid, EGameRankType.WRESTLE);
  }

  /**
   * 排行榜排序
   * @param Rank 
   * @returns 
   */
  rank_sort(Rank: GameRankRecord) {
    // 将 rank 转换为数组并排序
    let sortedRank = Object.entries(Rank)
      .sort((a, b) => b[1].val - a[1].val)
      .reduce((obj, [key, value], index) => {
        value.info.r = index + 1;
        obj[key] = value;
        return obj;
      }, {} as GameRankRecord);
    // console.log('>>',sortedRank)
    return sortedRank;
  }

  getServerRankRedisKey(serverid: number, eGameRankType: EGameRankType) {
    let redis_key = "";
    if (eGameRankType === EGameRankType.LEVEL) {
      redis_key = getServerLRankKey(serverid)
    }
    else if (eGameRankType === EGameRankType.ELITE) {
      redis_key = getServerERankKey(serverid)
    }
    else if (eGameRankType === EGameRankType.ARENA) {
      redis_key = getServerArRankKey(serverid)
    }
    else if (eGameRankType === EGameRankType.ABYSS_DRAGON) {
      redis_key = getServerADRankKey(serverid)
    }
    else if (eGameRankType === EGameRankType.DEMONABYSS) {
      redis_key = getServerDARankKey(serverid)
    }
    else if (eGameRankType === EGameRankType.WRESTLE) {
      redis_key = getServerWRankKey(serverid)
    }
    else if (eGameRankType === EGameRankType.CROSS_ARENA) {
      redis_key = getCross_ArenaRank_RKey(serverid)
    }
    else if (eGameRankType === EGameRankType.ARENA2) {
      redis_key = getServerArRank2Key(serverid)
    }
    else if (eGameRankType === EGameRankType.CROSS_ARENA2) {
      redis_key = getCross_ArenaRank2_Key(serverid)
    }
    return redis_key;
  }

  getServerRankMax(eGameRankType: EGameRankType) {

    if (eGameRankType === EGameRankType.ABYSS_DRAGON) {
      return TableGameConfig.abyss_dragon_rankmax;
    }
    else if (eGameRankType === EGameRankType.ARENA || eGameRankType === EGameRankType.ARENA2) {
      return TableGameConfig.arena_rank_max;
    }
    else if (eGameRankType === EGameRankType.CROSS_ARENA || eGameRankType === EGameRankType.CROSS_ARENA2) {
      return TableGameConfig.arena_rank_max_kf;
    }

    return TableGameConfig.gl_rank_max;
  }

  getServerRankShowMax(eGameRankType: EGameRankType) {

    if (eGameRankType === EGameRankType.WRESTLE) {
      return gameConst.rank_show_count;
    }

    return gameConst.lrank_max;
  }
  /**
   * 根据类型获取缓存排行榜
   */
  async getServerRankByType(serverid: number, eGameRankType: EGameRankType) {
    let cur_count = 0;
    let cur_Rank: GameRankRecord = await this.gameCacheService.getJSON(this.getServerRankRedisKey(serverid, eGameRankType));
    let SR_data: RoleShowInfoRecord = await this.gameCacheService.getJSON(getSRinfoKey(serverid))
    let ret_Rank: GameRankRecord = {}
    for (const key in cur_Rank) {
      if (Object.prototype.hasOwnProperty.call(cur_Rank, key)) {
        const element = cur_Rank[key];
        let cur_rank_max = this.getServerRankMax(eGameRankType);
        if (cur_count >= cur_rank_max) { break; }
        // element.roleid = key;
        ret_Rank[key] = element;
        cur_count++;
        if (eGameRankType !== EGameRankType.CROSS_ARENA && SR_data[key]) { //
          ret_Rank[key].info = Object.assign(ret_Rank[key].info, SR_data[key]);
          //不要英雄数据
          delete ret_Rank[key].info.rh;
        }
      }

    }

    return ret_Rank;
  }

  /**根据类型更新排行榜数据到缓存 */
  async updateServerRankByType(serverid: number, server_rank: GameRankRecord, eGameRankType: EGameRankType) {

    if (!server_rank) {
      return;
    }
    server_rank = this.rank_sort(server_rank)
    let redis_key = this.getServerRankRedisKey(serverid, eGameRankType);

    if (redis_key === "") {
      return;
    }

    await this.gameCacheService.setJSON(redis_key, server_rank);
  }

  /**根据类型修改排行榜数据 */
  async changeServerRankByType(retRoleALLInfo: RetRoleALLInfo, eGameRankType: EGameRankType, newVal: number) {

    if (!retRoleALLInfo.checkData(true, true)) {
      return;
    }

    let serverid = retRoleALLInfo.serverInfo.serverid;
    let crossServerId = retRoleALLInfo.serverInfo.info.crossServerId
    //存储目标服务器id
    let targetserverid = serverid
    if (eGameRankType === EGameRankType.CROSS_ARENA && crossServerId) {
      targetserverid = crossServerId
    }
    let cur_rank = await this.getServerRankByType(targetserverid, eGameRankType);
    if (!cur_rank) {
      console.error(`changeServerRankByType cur_rank is null serverid:${serverid} ranktype:${eGameRankType}`);
      return;
    }

    let rank_max = this.getServerRankMax(eGameRankType);

    let cur_roleid = retRoleALLInfo.roleSubInfo.roleid;
    if (cur_rank[cur_roleid]) {

      if (cur_rank[cur_roleid].val === newVal) {
        //没有改变
        return;
      }

      //已经在排行榜内 直接更新数据
      cur_rank[cur_roleid].val = newVal;
      cur_rank[cur_roleid].save = true;

      if (eGameRankType === EGameRankType.CROSS_ARENA) {
        await this.setRankInfo(serverid, cur_roleid, cur_rank)
      }
      await this.updateServerRankByType(targetserverid, cur_rank, eGameRankType);
      return;
    }

    //榜单已超过上限
    if (Object.keys(cur_rank).length >= rank_max) {
      let last_obj: GameRankEntity;
      //找最后一名
      for (const key in cur_rank) {
        if (Object.prototype.hasOwnProperty.call(cur_rank, key)) {
          const element = cur_rank[key];
          if (element.info.r && element.info.r === rank_max) {
            last_obj = element;
            break;
          }
        }
      }

      if (!last_obj) {
        //数据异常
        return;
      }

      //没有达到入榜条件 都是倒序排序
      if (last_obj.val >= newVal) {
        return;
      }

      //可以入榜
      cur_rank[cur_roleid] = cloneDeep(cur_rank[last_obj.roleid]); //复用数据库里的ID 不用重新创建
      cur_rank[cur_roleid].roleid = cur_roleid;
      cur_rank[cur_roleid].val = newVal;
      cur_rank[cur_roleid].save = true;
      cur_rank[cur_roleid].info = {};
      //保存的时候重新排序
      //cur_rank[cur_roleid].info.r = Object.keys(cur_rank).length;
      cur_rank[cur_roleid].info.n = retRoleALLInfo.roleSubInfo.name;
      //插入新的角色数据
      await this.addSeverRoleInfo(serverid, retRoleALLInfo.roleInfo, retRoleALLInfo.roleHero);
      if (eGameRankType === EGameRankType.CROSS_ARENA) {
        await this.setRankInfo(serverid, cur_roleid, cur_rank)
      }
      //删除最后一名
      //待处理 删除角色中心数据 要判断系统系统是否有使用
      //await this.delSeverRoleInfo(serverid, last_obj.roleid);
      delete cur_rank[last_obj.roleid];
      await this.updateServerRankByType(targetserverid, cur_rank, eGameRankType);
      return;
    }

    //直接插入新的数据
    cur_rank[cur_roleid] = new GameRankEntity();
    cur_rank[cur_roleid].type = eGameRankType;
    cur_rank[cur_roleid].roleid = cur_roleid;
    cur_rank[cur_roleid].serverid = serverid;
    cur_rank[cur_roleid].val = newVal;
    cur_rank[cur_roleid].save = true;
    cur_rank[cur_roleid].info = {};
    cur_rank[cur_roleid].info.r = Object.keys(cur_rank).length;
    cur_rank[cur_roleid].info.n = retRoleALLInfo.roleSubInfo.name;
    //插入新的角色数据
    await this.addSeverRoleInfo(serverid, retRoleALLInfo.roleInfo, retRoleALLInfo.roleHero);

    if (eGameRankType === EGameRankType.CROSS_ARENA) {
      await this.setRankInfo(serverid, cur_roleid, cur_rank)
    }
    await this.updateServerRankByType(targetserverid, cur_rank, eGameRankType);
    return;

  }

  /***
   * 把info数据加载到rank
   */
  async setRankInfo(serverid: number, roleid: string, RankData: GameRankRecord, del = true) {
    if (serverid && roleid && Object.keys(RankData).length > 0) {
      let SR_data: RoleShowInfoRecord = await this.gameCacheService.getJSON(getSRinfoKey(serverid))
      if (SR_data) {
        RankData[roleid].info = Object.assign(RankData[roleid].info, SR_data[roleid]);
        if (del) {
          //不要英雄数据
          delete RankData[roleid].info.rh;
        }
      }
    }
  }

  /**
   * 改变他人排行 
   * */
  async changeOthersServerRankByType(data: any, eGameRankType: EGameRankType, newVal: number) {

    if (!data) { return; }
    if (newVal === 0) { return; }
    let serverid = data.serverid;
    let cur_rank = await this.getServerRankByType(serverid, eGameRankType);
    if (!cur_rank) {
      return;
    }

    let rank_max = this.getServerRankMax(eGameRankType);

    let cur_roleid = data.roleid;
    if (cur_rank[cur_roleid]) {

      if (cur_rank[cur_roleid].val === newVal) {
        //没有改变
        return;
      }

      //已经在排行榜内 直接更新数据
      cur_rank[cur_roleid].val = newVal;
      cur_rank[cur_roleid].save = true;
      await this.updateServerRankByType(serverid, cur_rank, eGameRankType);
      return;
    }

  }

  /**
   * 根据数据保存服务器排行榜
   * @param serverid 
   * @param eGameRankType 
   */
  async saveSeverRankByType(serverid: number, eGameRankType: EGameRankType) {

    let cur_rank = await this.getServerRankByType(serverid, eGameRankType);
    if (!cur_rank) {
      console.error(`saveSeverRankByType cur_rank is null serverid:${serverid} ranktype:${eGameRankType}`);
      return;
    }
    let is_update = false;
    for (const key in cur_rank) {
      if (Object.prototype.hasOwnProperty.call(cur_rank, key)) {
        let element = cur_rank[key];
        element.info = { n: element.info?.n, r: element.info?.r }
        if (element.save) {
          is_update = true;
          delete element.save;
          let save_data = Object.assign({ updatedAt: cTools.newSaveLocalDate() }, element);
          if (element.id) {
            await this.prismaGameDB.gameRank.update({
              where: { id: element.id },
              data: <any>save_data
            });
          }
          else {
            let ret = await this.prismaGameDB.gameRank.create({
              data: <any>save_data
            });
            element.id = ret.id;
          }
        }
      }
    }

    if (is_update && cur_rank && Object.keys(cur_rank).length > 0) {
      await this.updateServerRankByType(serverid, cur_rank, eGameRankType);
    }

  }

  /**
   * 在线角色记录 
   * @param roleKeyDto 
   * @param overtime 过期时间戳
   * @returns 
   */
  async expireOnlineRole(roleKeyDto: RoleKeyDto, overtime: number) {

    let cur_online: Record<string, number> = await this.gameCacheService.getJSON(getServerOnlineKey(roleKeyDto.serverid));

    cur_online = cur_online || {};

    //if (cur_online[roleKeyDto.id]) { return; }

    cur_online[roleKeyDto.id] = overtime;

    await this.gameCacheService.setJSON(getServerOnlineKey(roleKeyDto.serverid), cur_online);

  }


  async checkOnlineRole(serverid: number) {

    let cur_online: Record<string, number> = await this.gameCacheService.getJSON(getServerOnlineKey(serverid));

    cur_online = cur_online || {};

    if (Object.keys(cur_online).length === 0) {
      return;
    }


    let entries = Object.entries(cur_online);

    //按时间排序
    entries.sort(function (a, b) {

      if (!a || !a[1]) { return 1; }

      if (!b || !b[1]) { return -1; }

      return a[1] - b[1];
    })


    for (let index = 0; index < entries.length; index++) {
      const element = entries[index];
      let time = element[1] - Math.floor(Date.now() / 1000);

      //之后的时间都没结束
      if (time > 0) { break; }

      let roleid = element[0];
      let r_key = getRoleKey({ id: roleid, serverid: serverid });

      // let is_ok = await this.gameCacheService.checkKeyExpiration(r_key);
      // if (is_ok) { continue; }

      //删除过期角色
      delete cur_online[roleid];

    }

    await this.gameCacheService.setJSON(getServerOnlineKey(serverid), cur_online);

  }

  async onDestroyOnlineRole(serverid: number) {

    let cur_online: Record<string, number> = await this.gameCacheService.getJSON(getServerOnlineKey(serverid));

    cur_online = cur_online || {};

    if (Object.keys(cur_online).length === 0) { return; }

    for (const key in cur_online) {
      if (Object.prototype.hasOwnProperty.call(cur_online, key)) {
        const element = cur_online[key];
        let roleKeyDto: RoleKeyDto = { id: key, serverid: serverid };
        await this.onDestroyRoleData(roleKeyDto);
      }
    }

    await this.gameCacheService.del(getServerOnlineKey(serverid));

  }

  /**
 * ===============================聊天模块-start========================================
 */

  getChatKeyByType(serverid: number, type: EChatType, guildid?: string) {

    switch (type) {
      case EChatType.Server:
        return getGlobalChatKey(serverid);
      case EChatType.Guild:
        if (!guildid) {
          Logger.error("getChatKeyByType guildid is null");
          return undefined;
        }
        return getGuildChatKey(serverid, guildid);
      default:
        break;
    }
    return undefined;
  }

  getChatMaxNumByType(serverid: number, type: EChatType) {

    switch (type) {
      case EChatType.Server:
        return TableGameConfig.schat_save_num;
      case EChatType.Guild:
        return TableGameConfig.gchat_save_num;
      default:
        break;
    }
    return undefined;
  }

  /**
   * 初始化聊天信息
   * @param serverids 
   * @returns 
   */
  async initChatData(serverids: number[]) {

    if (!serverids || serverids.length == 0) {
      return;
    }

    let cur_all_chat = await this.prismaGameDB.chatLog.findMany(
      {
        where: {
          serverid: {
            in: serverids
          }
        }
      }
    )

    if (cur_all_chat.length > 0) {

      //全服聊天
      let server_chat = {}
      //公会聊天
      let guild_chat = {};

      let all_roleids = {};
      //数据筛选
      for (let index = 0; index < cur_all_chat.length; index++) {
        let element = cur_all_chat[index];
        element.createdAt = cTools.newTransformToUTCZDate(element.createdAt);
        if (element.type === EChatType.Server) {
          server_chat[element.serverid] = server_chat[element.serverid] || [];
          server_chat[element.serverid].push(element);
        }
        else if (element.type === EChatType.Guild) {
          guild_chat[element.serverid] = guild_chat[element.serverid] || {};
          if (element.target) {
            guild_chat[element.serverid][element.target] = guild_chat[element.serverid][element.target] || [];
            guild_chat[element.serverid][element.target].push(element);
          }
        }

        all_roleids[element.serverid] = all_roleids[element.serverid] || {};
        all_roleids[element.serverid][element.sender] = 1;
      }

      for (let index = 0; index < serverids.length; index++) {
        const server_id = serverids[index];

        //全服聊天聊天初始化
        let cur_ary: ChatLogEntity[] = server_chat[server_id] || [];
        //按时间排序
        cur_ary.sort(function (a, b) {
          if (!a || !a.createdAt) { return 1; }
          if (!b || !b.createdAt) { return -1; }
          let atime = new Date(a.createdAt).getTime();
          let btime = new Date(b.createdAt).getTime();
          return atime - btime;
        })
        await this.gameCacheService.setJSON(this.getChatKeyByType(server_id, EChatType.Server), server_chat[server_id] || []);


        //公会聊天初始化
        let all: GuildEntity[] = await this.gameCacheService.getHash(getGuildInfoHmKey(server_id));
        if (all && all.length > 0) {
          for (let index = 0; index < all.length; index++) {
            const guild = all[index];
            let cur_ary: ChatLogEntity[] = [];
            if (guild_chat[server_id] && guild_chat[server_id][guild.guildid]) {
              cur_ary = guild_chat[server_id][guild.guildid];
            }

            //按时间排序
            cur_ary.sort(function (a, b) {
              if (!a || !a.createdAt) { return 1; }
              if (!b || !b.createdAt) { return -1; }
              let atime = new Date(a.createdAt).getTime();
              let btime = new Date(b.createdAt).getTime();
              return atime - btime;
            })
            await this.gameCacheService.setJSON(this.getChatKeyByType(server_id, EChatType.Guild, guild.guildid), cur_ary);
          }
        }
      }

      //设置需要添加角色数据中心的数据
      for (const serverid in all_roleids) {
        if (Object.prototype.hasOwnProperty.call(all_roleids, serverid)) {
          const rols_objs = all_roleids[serverid];
          let cross_rols_ids: string[] = Object.keys(rols_objs).map(String);
          await this.loadSeverRoleInfo(Number(serverid), cross_rols_ids);
        }
      }
    }
    else {

      for (let index = 0; index < serverids.length; index++) {
        const server_id = serverids[index];
        await this.gameCacheService.setJSON(this.getChatKeyByType(server_id, EChatType.Server), []);

        //公会
        let all: GuildEntity[] = await this.gameCacheService.getHash(getGuildInfoHmKey(server_id));
        if (all && all.length > 0) {
          for (let index = 0; index < all.length; index++) {
            const guild = all[index];
            await this.gameCacheService.setJSON(this.getChatKeyByType(server_id, EChatType.Guild, guild.guildid), []);
          }
        }
      }

    }
  }

  async saveChatDataMysql(serverId: number, type: EChatType) {

    let cur_chat_list: ChatLogEntity[] = [];
    let all_guild_chatlist = {}
    if (type === EChatType.Guild) {
      let all: GuildEntity[] = await this.gameCacheService.getHash(getGuildInfoHmKey(serverId));
      if (all && all.length > 0) {
        for (let index = 0; index < all.length; index++) {
          const guild = all[index];
          let cur_list = await this.getChatListByType(serverId, EChatType.Guild, guild.guildid);
          if (cur_list && cur_list.length > 0) {
            cur_chat_list = cur_chat_list.concat(cur_list);
            all_guild_chatlist[guild.guildid] = cur_list;
          }

        }
      }
    }
    else if (type === EChatType.Server) {
      cur_chat_list = await this.getChatListByType(serverId, EChatType.Server);
    }

    let is_update_redis = false;
    let update_guild_ids = {};
    for (let index = 0; index < cur_chat_list.length; index++) {
      let element: ChatLogEntity = cur_chat_list[index];
      let save_date = {
        serverid: element.serverid,
        type: element.type,
        sender: element.sender,
        target: element.target,
        msg: element.msg,
        info: <any>element.info,
        createdAt: cTools.newSaveLocalDate(new Date(element.createdAt))
      }

      if (!element.needSave) { continue; }

      delete element.needSave;
      is_update_redis = true;
      if (type === EChatType.Guild) {
        update_guild_ids[element.target] = 1;
      }
      if (element.id) {
        await this.prismaGameDB.chatLog.update({
          where: {
            id: element.id
          },
          data: save_date
        })
      }
      else {
        let crate_ret = await this.prismaGameDB.chatLog.create({
          data: save_date
        })
        element.id = crate_ret.id;
      }

    }

    if (cur_chat_list.length > 0 && is_update_redis) {

      if (type === EChatType.Guild) {
        for (const guildId in all_guild_chatlist) {
          if (Object.prototype.hasOwnProperty.call(all_guild_chatlist, guildId)) {

            if (update_guild_ids[guildId] != undefined) {
              let cur_gchat_list = all_guild_chatlist[guildId];
              for (let index = 0; index < cur_gchat_list.length; index++) {
                let cur_chat_entity: ChatLogEntity = cur_gchat_list[index];
                if (cur_chat_entity.needSave) {
                  delete cur_chat_entity.needSave;
                }
              }
              await this.gameCacheService.setJSON(this.getChatKeyByType(serverId, type), cur_gchat_list);
            }

          }
        }
      }
      else {
        await this.gameCacheService.setJSON(this.getChatKeyByType(serverId, type), cur_chat_list);
      }

    }
  }

  async addChatData(chatLogEntity: ChatLogEntity) {

    if (!chatLogEntity) { return; }

    chatLogEntity.createdAt = new Date();
    chatLogEntity.needSave = true;

    let cur_chat_list: ChatLogEntity[] = await this.getChatListByType(chatLogEntity.serverid, chatLogEntity.type, chatLogEntity.target);

    cur_chat_list = cur_chat_list || [];
    let max_num = this.getChatMaxNumByType(chatLogEntity.serverid, chatLogEntity.type);
    if (cur_chat_list.length >= max_num) {
      let old_chatLogEntity = cur_chat_list.shift();
      chatLogEntity.id = old_chatLogEntity.id;
    }
    cur_chat_list.push(chatLogEntity);

    let ret = await this.gameCacheService.setJSON(this.getChatKeyByType(chatLogEntity.serverid, chatLogEntity.type, chatLogEntity.target), cur_chat_list);
    //console.log(ret);

    //插入新的角色数据
    let getRoleALLInfoDto = new GetRoleALLInfoDto({ id: chatLogEntity.sender, serverid: chatLogEntity.serverid });
    getRoleALLInfoDto.need_roleInfo = true;
    getRoleALLInfoDto.need_roleHero = true;
    //获取角色信息
    let retRoleALLInfo: RetRoleALLInfo = await this.getRoleAllInfo(getRoleALLInfoDto);
    await this.addSeverRoleInfo(chatLogEntity.serverid, retRoleALLInfo.roleInfo, retRoleALLInfo.roleHero);
  }


  async getChatListByType(serverid: number, type: EChatType, guildid?: string) {

    let cur_key = this.getChatKeyByType(serverid, type, guildid);
    if (!cur_key) { return []; }
    let cur_chat_list: ChatLogEntity[] = await this.gameCacheService.getJSON(cur_key);
    if (!cur_chat_list) { return []; }

    return cur_chat_list;
  }

  async getCache(var_key: any) {
    return await this.gameCacheService.getJSON(var_key);
  }
  async setCache(var_key: any, data: any) {
    return await this.gameCacheService.setJSON(var_key, data);
  }

  /**
   * ===============================聊天模块-end========================================
   */

  /**初始化 公会 */
  async initGuild(serverids: number[]) {

    if (!serverids || serverids.length == 0) {
      return;
    }

    let all_guild = await this.prismaGameDB.guild.findMany({
      where: {
        serverid: { in: serverids }
      }
    })

    for (let index = 0; index < all_guild.length; index++) {
      let element = all_guild[index];
      let guildinfo: GuildEntity = {
        id: element.id,
        serverid: element.serverid,
        crossServerid: element.crossServerid,
        guildid: element.guildid,
        name: element.name,
        info: <GuildInfoEntity>element.info,
      }
      await this.gameCacheService.setHash(getGuildInfoHmKey(element.serverid), element.guildid, guildinfo)
    }

  }


  /**
   * 保存公会数据到数据库
   * @param serverid 
   */
  async saveGuildInfo(serverid: number) {

    let data = await this.gameCacheService.getHash(getGuildInfoHmKey(serverid));
    if (!data) { return }
    for (let index = 0; index < data.length; index++) {
      let element: GuildEntity = data[index];
      let save_data = {
        serverid: element.serverid,
        crossServerid: element.crossServerid,
        guildid: element.guildid,
        name: element.name,
        info: <any>element.info
      }
      if (!element.needSave) { continue; }
      delete element.needSave;
      await this.prismaGameDB.guild.upsert({
        where: { guildid: element.guildid },
        create: save_data,
        update: save_data,
      })
      await this.gameCacheService.setHash(getGuildInfoHmKey(serverid), element.guildid, element);
    }
  }

}
