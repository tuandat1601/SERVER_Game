import { ApiProperty } from "@nestjs/swagger";
import { EBoxEntity, SBoxEntity, XBoxEntity } from "./ebox.entity";
import { SkillSystemEntity } from "./skill.entity";
import { EmailSysEntity } from "./email.entity";
import { HeroStateRecord } from "./hero.entity";
import { TimeAwardEntity } from "./time-award.entity";
import { TaskDailyEntity, TaskEntity, TaskGuildEntity, TaskMainEntity, TaskTargetTagRecord } from "./task.entity";
import { EquipEntity, EquipEntityRecord } from "./equip.entity";
import { WelfareDaily, WelfarePaidDays } from "./welfare.entity";
import { PrivilegeRecord, StatusRecord } from "./common.entity";
import { BuyItemTag, RechargeShop } from "./shop.entity";
import { MedalInfo } from "./medal.entity";
import { PirateShipRoleEntity } from "./pirateShip.entity";
import { ArenaInfo } from "./arena.entity";
import { CQType, EFightType, EGameRunState } from "../../config/game-enum";
import { WrestleEntity } from "../../game-system/wrestle/entities/wrestle.entity";
import { GuildRoleinfo } from "./guild.entity";

export type RedDotRecord = Record<number, boolean>
/**number 佣兵类型 MercenaryLvEntity 数据 */
export type MercenaryLvRecord = Record<number, MercenaryLvEntity>
export class RoleSubInfoEntity {

  /**角色id 登录后同步role表里的id字段 */
  roleid?: string;
  /**名称 登录后同步role表里的name字段 */
  name?: string;
  /**服务器 登录后同步role表里的serverid字段 */
  serverid?: number;

  /**合服前 主服务器ID 废弃 */
  last_serverid?: number;

  /**头像 */
  ico?: string;

  /**版本号 */
  ver?: string;

  /**是否是调试模式 */
  gameRunState?: EGameRunState;


  /**上次战斗类型 */
  lastFightType?: EFightType;


  /**出战队伍 普通关卡 精英挑战*/
  @ApiProperty({ example: [1001, 1002, 1003], description: '出战队伍' })
  fteam: number[];

  /** 出战英雄顺序 记录的是英雄类别 新战斗模式临时记录用 */
  fightGroup?: number[];

  /**怪物血量记录  新战斗模式临时记录用 <pos,hp> */
  fightMonsterHp?: Record<number, number>

  /**技能系统 */
  skill: SkillSystemEntity;

  /**锻造系统 原装备宝箱 */
  ebox: EBoxEntity;

  /**技能宝箱 */
  sbox: SBoxEntity;

  email: EmailSysEntity;

  /**英雄解锁状态 */
  heroState: HeroStateRecord;

  /**挂机 时间奖励 */
  timeAward?: TimeAwardEntity;

  /**任务目标常驻累计类型的计数 */
  taskTargetTag: TaskTargetTagRecord;

  /**已通过的精英关卡最新记录 */
  elitelevels?: number;

  /**临时开出来的 对比装备 [废弃] */
  tmpEquip?: EquipEntity;

  /**临时开出来的 多个对比装备 */
  tmpEquips?: EquipEntityRecord;

  /**临时开出来的装备对比英雄 [废弃]*/
  tmpEquipHero?: number;

  /**主线任务 */
  taskMain?: TaskMainEntity;

  /**每日任务 */
  taskDaily?: TaskDailyEntity;

  /**进阶任务 */
  taskUpgrade?: TaskEntity[];

  /**隐藏任务 */
  taskHide?: TaskEntity[];

  /**开服福利任务 */
  openWelfare?: OpenWelfareEntity;

  /**公会任务 */
  taskGuild?: TaskGuildEntity;

  /**关卡任务 */
  TaskLevel?: TaskMainEntity;

  /**福利-每日有礼 */
  welfareDaily?: WelfareDaily;

  /**福利-等级奖励 已经领取过的奖励等级*/
  welfareLevel?: number

  /**福利-积天豪礼 */
  welfarePaidDaily?: WelfarePaidDays;

  /**充值信息 */
  rechargeInfo: RoleRechargeInfo;

  /**状态信息 */
  status?: StatusRecord;

  /**
   * 特权信息
   * 每次登录会根据 status 重新生成
   *  */
  privilege?: PrivilegeRecord;

  /**道具购买限制 */
  buyItemTag: BuyItemTag;

  /**广告激活状态 */
  adverts: boolean;

  /**充值商品信息集合 */
  rechargeShop: RechargeShop;

  /**勋章信息集合 */
  medalInfo?: MedalInfo;

  /**竞技信息 */
  arenaInfo?: ArenaInfo;
  /**跨服竞技信息 */
  arenaInfoKf?: ArenaInfo;

  /**夺宝大作战 */
  pirateShip?: PirateShipRoleEntity;

  /**每日重置信息 */
  reDayInfo: ReDayInfo;

  /**累积充值礼包 领取标记
   * <number, number> =  <累充金额档位, 领取标记：1>
   * rechargeGift 为空，代表没有领取过任何累充档位奖励
   * 对应的金额档位没有数据，代表这个档位的金额没有领过
   * {[6]:1}  代表6元累充，已经领取
   * 记录每个金额领取记录，是为了防止策划加入新金额后导致记录混乱
   * */
  rechargeGift?: Record<number, number>

  /**小红点 */
  @ApiProperty({ example: " [1001]=true", description: '[服务器专用] 小红点 gamesys 表里有系统ID 布尔值true/false 代表是否有小红点' })
  redDot?: RedDotRecord;

  /**上次登录时间 */
  @ApiProperty({ description: '上次登录时间标记 计算JWT过期处理' })
  lastlogintime: string;

  @ApiProperty({ description: '[服务器专用]新的JWT 是否发送成功' })
  newGt?: string;

  /**佣兵进阶*/
  upgrade?: number

  /**光环*/
  aureole?: AureoleInfo

  /**魔渊*/
  demonAbyss?: DemonAbyssEntity

  /**佣兵寻宝 */
  mercenary?: MercenaryDataEntity;

  //异兽
  raremst?: RareMonsterEntity;

  /**角斗 */
  wrestle?: WrestleEntity;

  //历程领取奖励
  sysOpenAward?: number[];

  //称号
  title?: TitleEntity;

  //时装
  fashion?: FashionEntity;

  /**公会 */
  guild?: GuildRoleinfo;

  //寻宝
  xbox?: XBoxEntity;

  //猜拳
  cq?: CQEntity;
}

export class RoleInfoEntity {

  /**角色等级 */
  @ApiProperty({ description: '角色等级' })
  rolelevel?: number

  /**角色经验-主角英雄共用 */
  @ApiProperty({ description: '角色经验-主角英雄共用' })
  exp?: number

  /**已通过的最新关卡ID */
  @ApiProperty({ description: '已通过的最新关卡ID' })
  gamelevels?: number

  /**关卡节点 */
  @ApiProperty({ example: 0, description: '关卡节点' })
  glpos?: number

  /**角色游戏综合信息 */
  @ApiProperty({ description: '角色游戏综合信息' })
  info?: RoleSubInfoEntity

  /**合服标记 0：未合服 1：已合服 登录后需要合服处理 */
  @ApiProperty({ description: '合服标记 0：未合服 1：已合服 登录后需要合服处理' })
  merge?: number

}


export class RoleRechargeInfo {
  /**6元以上的累积充值天数 */
  total6Days: number = 0;

  /**6元以上 今日是否已经充值*/
  today6IsPaid: boolean = false;

  /**每日累积充值 */
  dailyAmounts: number = 0;

  /**总累积充值 */
  totalAmounts: number = 0;
}

/**每日重置变量集合 */
export class ReDayInfo {
  /**扫荡精英关卡次数 */
  elitesweepcount: number = 0;

  /**深渊巨龙每日最高伤害 */
  ad_damage: number = 0;

  /**深渊巨龙每日伤害奖励 已领取的最高档位标记*/
  ad_awardTag: number = 0;

  /**魔渊每日奖励标记 */
  da_awards: boolean = false;

  /**魔渊每日付费购买标记 */
  da_buytag: number = 0;

  //异兽每日捕捉次数
  raremst_daily: number = 0;
}

/**光环 */
export class AureoleInfo {
  /**光环表id */
  id: number = 1001;
  /**激活光环类型 */
  act: any[] = [1];
}


/**
 * 魔渊
 */
export class DemonAbyssEntity {
  /**魔渊层数（已打过的关卡ID） */
  da_levels: number = 0;

  /*魔渊成就奖励标记（已领取过成就奖励的标记） */
  da_awards_tag: number = 0;

  /**失败和中断战斗标记 下次挑战就需要扣道具 */
  da_fight_lost: boolean = false;

  /**当前战斗节点 */
  da_pos: number = 0;
}


/**
 * 佣兵数据 
 */
export class MercenaryDataEntity {
  /**等级 */
  mlv?: MercenaryLvRecord;
  /**激活信息 */
  actinfo?: MercenaryActEntity;
  /**恢复时间标记 */
  flag_time?: string
}
/**
 * 佣兵激活
 */
export class MercenaryActEntity {
  /**击毁30条海盗船 */
  pn: number = 0;
  /**竞技场获胜100场 */
  an: number = 0;
  /**挑战魔龙伤害达到1亿 */
  dam: number = 0;
}

/**
 * 佣兵等级
 */
export class MercenaryLvEntity {
  constructor(id: number, fid: number) {
    this.id = id;
    this.exp = 0;
    this.fid = fid;
  }
  /**表id */
  id: number;
  /**经验 */
  exp: number;
  /**切磋(关卡表id) */
  fid: number;
}

//异兽
export class RareMonsterEntity {
  id: number[] = []; //激活的id
  fight: number[][] = [[0, 0, 0], [0, 0, 0], [0, 0, 0]]; //上阵组
  use: number = 0; //生效的上阵
  suit: number[] = []; //共鸣
  num: number = 0; //捕捉次数
}

export class TitleEntity {
  id: Record<number, number> = {}; //激活的id
  show: number = 0; //穿戴的称号
}

export class FashionEntity {
  id: Record<number, number> = {}; //激活的id
  dress: Record<number, number> = {}; //穿戴的时装(废弃不能删)
}


/**开服福利 */
export class OpenWelfareEntity {
  /**任务ID 任务实体 */
  tasklist: Record<number, TaskEntity> = {};

  /**总积分 */
  totalPoint: number = 0;

  /**开服福利积分奖励已领取档位ID */
  received: number = 0;
}

export class CQEntity {
  constructor() {
    this.lv = {};
    this.lv[CQType.STONE] = 0;
    this.lv[CQType.FORFEX] = 0;
    this.lv[CQType.CLOTH] = 0;
  }
  lv: Record<number, number>;
}
