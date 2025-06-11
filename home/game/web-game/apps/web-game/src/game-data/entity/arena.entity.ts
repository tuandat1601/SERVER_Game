import { ApiProperty } from "@nestjs/swagger";
import { EObjtype } from "../../config/game-enum";
import { cTools } from "../../game-lib/tools";
import { HerosRecord } from "./hero.entity";
import { AureoleInfo, FashionEntity, RareMonsterEntity, TitleEntity } from "./roleinfo.entity";
import { SkillSystemEntity } from "./skill.entity";

export type ServerArenaRankRecord = Record<number, ArenaEntity>
export type RoleShowInfoRecord = Record<string, RoleShowInfoEntity>

export class RoleCommonEntity {
  /**头像*/
  c?: string;
  /**战力*/
  f?: number;
  /**角色名*/
  n?: string;
  /**等级*/
  lv?: number;
  /**称号id*/
  title?: number;
  /**服务器id*/
  sid?: number;
}

export class RoleShowInfoEntity extends RoleCommonEntity {
  /*英雄*/
  rh?: HerosRecord;
  /**勋章id*/
  m?: number
  /**等阶*/
  lg?: number
  /**光环*/
  gh?: AureoleInfo
  /**上阵异兽*/
  rmon?: number[]
  raremst?: RareMonsterEntity;
  /**角斗*/
  wid?: number;
  //称号
  titleE?: TitleEntity;
  //时装
  fashion?: FashionEntity;
  /**上次登入时间 */
  llt?: string;
  /**技能系统 */
  skill?: SkillSystemEntity;

}

export class RoleFightEntity extends RoleShowInfoEntity {
  /**对象类型*/
  obj?: EObjtype;
}

/**竞技场 - 数据模板*/
export class ArenaEntity extends RoleFightEntity {
  /**角色id,或者机器人表id*/
  id?: string
  /**@ApiProperty({ description: '排名' })*/
  r?: number
  /**@ApiProperty({ description: '积分' })*/
  p?: number
  /**是否需要保存 服务器专用*/
  save?: boolean;
}

export class ArenaLogEntity {
  id?: number
  seasonid: number
  crossServerid?: number
  serverid: number
  roleid: string
  atkid: string
  point: number
  time?: string
  state: number
  info: RoleCommonEntity | any
  save?: boolean;
}

/**公共竞技场数据*/
export class ArenaServerInfo {
  /**开启时间 */
  @ApiProperty({ description: '开启时间' })
  sTime: string = cTools.newLocalDate0String();
  /**赛季id */
  @ApiProperty({ description: '赛季id' })
  season: number = 1;
  @ApiProperty({ description: '排行数据' })
  rank: ServerArenaRankRecord
  @ApiProperty({ description: '上赛季排行' })
  lrank: string[] = []
  // @ApiProperty({ description: '每日排行数据' })
  // dayrank: Record<number, ArenaEntity>
}


/** 角色竞技场数据 */
export class ArenaInfo {

  constructor(season: number, sTime: string, challenge: number) {
    this.season = season;
    this.sTime = sTime;
    this.nowar = {};
    this.challenge = challenge;
  }
  /**开启时间 */
  @ApiProperty({ description: '开启时间' })
  sTime: string;//= cTools.newLocalDate0String();
  /**赛季id */
  @ApiProperty({ description: '赛季id' })
  season: number;
  /** 免费挑战次数 */
  @ApiProperty({ description: '挑战次数' })
  challenge: number = 3;
  /** 排行积分 */
  @ApiProperty({ description: '排行积分' })
  point: number = 1000;
  /** 排名 */
  @ApiProperty({ description: '排名' })
  rank: number;
  /** 挑战界面 */
  @ApiProperty({ description: '挑战界面' })
  show?: ArenaEntity[];
  /** 挑战日志 */
  @ApiProperty({ description: '挑战日志' })
  log: ArenaLogEntity[];
  /** 免战CD */
  @ApiProperty({ description: '免战玩家ID,时间' })
  nowar: Record<number, number>;
}

export class ArenaFightInfo {
  /**自己的积分*/
  ourpoint?: number;
  /**自己变化的积分*/
  ourchangepoint?: number;
  /**对方的积分*/
  foepoint?: number;
  /**对方变化的积分*/
  foechangepoint?: number;
  /**竞技场赢的次数 */
  wincount?: number;
}