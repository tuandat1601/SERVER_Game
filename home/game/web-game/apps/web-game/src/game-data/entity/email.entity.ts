import { EEmailState } from "../../config/game-enum";
import { EquipEntity } from "./equip.entity";

export type EmailAry = EmailEntity[]
export type EmailList = Record<number, EmailEntity>
export type EmailIds = Record<number, EEmailState>
export type EmailItems = Record<number, number | EquipEntity>

export class EmailItemsEntity {
  /** 道具或者装备ID*/
  i: number
  /** 数量*/
  n: number
  /** 未生成的 装备品质*/
  q?: number
  /** 已生成的装备*/
  einfo?: EquipEntity
}
export class EmailEntity {
  /** 邮件ID*/
  id: number | bigint;
  /**服务器ID */
  serverid: number;
  /** 标题*/
  title: string;
  /** 内容*/
  content: string;
  /** 附件*/
  items: EmailItemsEntity[] | any;
  /** 状态*/
  state: number;
  /** 发件人*/
  sender: string;
  /** 收件人*/
  owner: string;
  /** 发送时间*/
  time: Date | string;

  /**是否需要保存*/
  needSave?: boolean;
}

export class EmailSysEntity {
  ids: EmailIds;       //记录全服邮件 多人邮件ID和状态
  lasteid: number;     //记录的最后的全服邮件ID
}