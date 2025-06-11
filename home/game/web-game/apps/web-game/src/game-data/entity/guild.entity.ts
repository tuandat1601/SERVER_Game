import { EGuildPost } from "../../config/game-enum"
import { cTools } from "../../game-lib/tools"
import { cGameCommon } from "../../game-system/game-common"
import { HerosRecord } from "./hero.entity"
import { RoleInfoEntity } from "./roleinfo.entity"

export type GuildRecord = Record<string, GuildEntity>

export class GuildEntity {
  id?: number
  /** 服务器id*/
  serverid?: number
  /** 跨服服务器ID*/
  crossServerid?: number
  /** 公会id*/
  guildid?: string
  /** 公会名*/
  name?: string
  /** 帮会信息*/
  info?: GuildInfoEntity
  needSave?: boolean
}

export class GuildInfoEntity {

  // /** 帮主id*/
  // leader?: string
  // /** 帮主名字*/
  // leadername?: string
  // /** 副帮主id*/
  // viceadmin?: string
  /** 帮会等级*/
  level?: number
  /** 帮会经验*/
  exp?: number
  /** 旗帜*/
  flag?: number
  /** 人数上限*/
  // limit?: number
  /** 成员*/
  member?: mInfo[]
  /** 是否开放允许随时加入*/
  open?: number
  /** 宣言*/
  desc?: string
  /** 公告*/
  notice?: string
  /** 加入需要等级*/
  needlv?: number
  /** 动态*/
  log?: guildLog[]
  /** 总战力*/
  af?: number
  /** 非正式成员*/
  unMember?: mInfo[]
  /**排名 */
  rank?:number

  /**每日活跃 */
  liveness?: number;
}

export class guildLog {
  constructor(str: string) {
    this.time = cTools.newLocalDateString();
    this.str = str;
  }
  time?: string;
  str?: string;
}
export class mInfo {

  constructor(post: EGuildPost, roleInfo: RoleInfoEntity, roleHero: HerosRecord) {
    this.post = post;
    this.id = roleInfo.info.roleid;
    this.name = roleInfo.info.name;
    this.lv = roleInfo.rolelevel;
    this.lg = roleInfo.info.upgrade;
    this.ico = roleInfo.info.ico;
    this.llt = roleInfo.info.lastlogintime;
    this.fight = cGameCommon.getRoleFightPoint(roleHero);
    this.daygx = 0;
    this.allgx = 0;
  }
  /**公会里的职位 */
  post?: number;
  /**角色id */
  id?: string;
  /**角色名 */
  name?: string;
  /**角色等级 */
  lv?: number;
  /**角色等阶 */
  lg?: number;
  /**角色头像 */
  ico?: string;
  /**今日贡献 */
  daygx?: number;
  /**全部贡献 */
  allgx?: number;
  /**战力 */
  fight?: number;
  /**上次登入时间 */
  llt?: string;

}
export class GuildRoleinfo {
  constructor(guildid: string, joinTime: number) {
    this.guildid = guildid;
    this.joinTime = joinTime;
    this.leaveTime = 0;
    // this.applyList = [];
  }
  /**公会id */
  guildid?: string
  /**进入时间 */
  joinTime?: number
  /**离开时间 */
  leaveTime?: number
  /**申请待通过的公会 */
  // applyList?:string[]
}


export class GuildRankinfo {
  /**公会id */
  gid?: string
  /**公会名 */
  gname?: string
  /**公会等级 */
  glv?: number
  /**公会旗帜 */
  flag?: number
  /**公会总战力 */
  af?: number
  /**会长名 */
  leadername?: string
  /**当前人数 */
  cur?: number
  /**上限人数 */
  limit?: number
  /**是否申请过 */
  apply?:boolean

  /**排名 */
  rank?:number
}