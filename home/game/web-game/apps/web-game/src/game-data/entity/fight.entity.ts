import { ApiExtraModels, ApiProperty } from "@nestjs/swagger";
import { EFightAct, EFightCamp, EFightResults, EObjtype } from "../../config/game-enum";
import { TableGameBuff } from "../../config/gameTable/TableGameBuff";
import { TableGameHero } from "../../config/gameTable/TableGameHero";
import { TableGameMonster } from "../../config/gameTable/TableGameMonster";
import { TableRobotHero } from "../../config/gameTable/TableRobotHero";
import { AureoleInfo } from "./roleinfo.entity";

/**战斗请求信息结构 */
export class FightReqEntity {

  @ApiProperty({ description: '关卡ID' })
  levels: number;

  @ApiProperty({ description: '关卡里的pos' })
  pos: number;

  @ApiProperty({ description: '竞技对象ID ' })
  id?: number;
  edata?:any;

}


export class FightActEntity {

  @ApiProperty({ enum: EFightAct, enumName: "EFightAct", description: '行动类型' })
  t: EFightAct;

  @ApiProperty({ description: 'skill_id' })
  sid?: number;

  @ApiProperty({ description: 'buff_id' })
  bid?: number;

  @ApiProperty({ description: '发起者pos' })
  ap: number;

  @ApiProperty({ description: '目标pos' })
  tp?: number;

  @ApiProperty({ description: '伤害值' })
  v?: number;

  @ApiProperty({ description: '是否闪避' })
  miss?: boolean;

  @ApiProperty({ description: '是否免伤' })
  no_damage?: boolean;

  @ApiProperty({ description: '是否暴击' })
  crite?: boolean;

  @ApiProperty({ example: "1:1,2:-1 1为 EFightState 枚举值  ：号后 正数位加，负数为减", description: '改变的战斗状态' })
  st?: any;

  @ApiProperty({ description: '嵌套数据' })
  sub?: FightActEntity[];
}

export class FightRoundsEntity {

  @ApiProperty({ description: '当前回合数' })
  rounds: number;

  @ApiProperty({ description: '当前回合 行动队列' })
  acts: FightActEntity[];
}


export class BuffEntity {

  /** BUFF id */
  @ApiProperty({ description: 'BUFF id' })
  id: number;

  /**BUFF表数据 */
  @ApiProperty({ description: 'BUFF表数据' })
  data: TableGameBuff;

  /** 剩余回合数*/
  @ApiProperty({ description: '剩余回合数' })
  rounds: number;

  /** BUFF 计算数值*/
  @ApiProperty({ description: 'BUFF 计算数值' })
  val?: number = 0;
}

export class FightObjEntity {
  /** 对象数据表 id */
  @ApiProperty({ description: '对象数据表 id' })
  id: number;

  /** 战斗位置标识 唯一 */
  @ApiProperty({ description: '战斗位置标识 唯一' })
  pos: number;

  /** 战斗阵营识别 */
  @ApiProperty({ enum: EFightCamp, enumName: "EFightCamp", description: '战斗阵营识别' })
  fightCamp: EFightCamp;

  /** 战斗对象类型 */
  @ApiProperty({ enum: EObjtype, enumName: "EObjtype", description: '战斗对象类型' })
  objType: EObjtype;

  /** 战斗对象表数据 */
  @ApiProperty({ description: '战斗对象表数据' })
  data?: TableGameHero | TableGameMonster | TableRobotHero | any;

  /** 技能列表 */
  @ApiProperty({ isArray: true, description: '技能列表' })
  skill: number[];

  /** 战前属性（人物+装备）*/
  @ApiProperty({ description: '战前属性（英雄基础总属性）' })
  attr?: any;

  /** BUFF属性加成属性 */
  @ApiProperty({ description: 'BUFF属性' })
  bAttr?: any;

  /** 计算后总属性 */
  @ApiProperty({ description: '计算后总属性 = 战前属性（人物）+ BUFF属性' })
  tAttr?: any;

  /** BUFF列表 */
  @ApiProperty({ description: 'BUFF列表' })
  buff?: BuffEntity[];

  /** 战斗状态 */
  @ApiProperty({ description: '战斗状态' })
  state?: any;

  /** 临时数据 */
  @ApiProperty({ description: '临时数据' })
  tmp?: any;

  /** 时装id */
  @ApiProperty({ description: '时装id' })
  fashion?: number;
}

export class FightCampEntity {
  /** 我方 */
  our?: CampInfoEntity;
  /** 敌方 */
  enemy?: CampInfoEntity;
}

export class CampInfoEntity {
  /** 光环 */
  aureole?: AureoleInfo;

  /**上阵异兽 */
  rareMonster?: number[];

  /**王者角斗 上阵信息 */
  wrestl?: WrestleCampEntity;
}
export class WrestleCampEntity {

  order: number[] = []
  pos: number = 0
}