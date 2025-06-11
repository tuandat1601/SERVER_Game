import { ApiProperty } from "@nestjs/swagger";
import { EquipPosRecord } from "./equip.entity";
import { SkillPosEntity } from "./skill.entity";

/**
 * 英雄属性结构
 * HeroAttrRecord = Record<number（属性数字ID）, number（属性数值）>
 */
export type HeroAttrRecord = Record<number, number>
export type FruitRecord = Record<number, number>

/**
 * 技能槽位结构
 * SkillPosRecord = Record<number（技能槽位 [0-3]）, SkillPosEntity>
 */
export type SkillPosRecord = Record<number, SkillPosEntity>

/**
 * 英雄列表结构
 * HerosRecord = Record<number（英雄ID）, HeroEntity>
 */
export type HerosRecord = Record<number, HeroEntity>

/**
 * 英雄部位强化等级
 * Record<number(部位ID), number(部位等级)>
 */
export type PosLvRecord = Record<number, number>

/**英雄列表状态 true=已解锁 false=未解锁*/
export type HeroStateRecord = Record<number, boolean>

export class HeroEntity {

    @ApiProperty({ description: '英雄ID' })
    id?: number;

    @ApiProperty({ description: '英雄技能' })
    skill?: SkillPosRecord;

    @ApiProperty({ example: "{[部位ID]:EquipEntity}", description: '英雄装备' })
    equip?: EquipPosRecord;

    @ApiProperty({ description: '装备部位属性' })
    poslv?: PosLvRecord;

    @ApiProperty({ description: '食果属性' })
    fruit?: FruitRecord;

    @ApiProperty({ description: '当前血量 只存在内存中 用于关卡战斗' })
    curHP?: number;

    // @ApiProperty({ description: '装备总属性(用于计算英雄总属性)' })
    // eAttr?: HeroAttrRecord;

    // @ApiProperty({ description: '装备部位总属性(用于计算英雄总属性)' })
    // epAttr?: HeroAttrRecord;

    @ApiProperty({ description: '英雄基础总属性（不算百分比加成）=表属性（静态）+ 装备总属性（动态）+ 装备部位总属性（动态）' })
    attr?: HeroAttrRecord;

    @ApiProperty({ description: '英雄总属性=英雄基础总属性*百分比加成' })
    tAttr?: HeroAttrRecord;

    @ApiProperty({ description: '英雄战力' })
    fight?: number;

    @ApiProperty({ description: '角斗PK卡集' })
    pkcards?: number[];

    @ApiProperty({ description: '时装id' })
    fashion?: number = 0;
}


export class FruitEntity {

    // @ApiProperty({ description: '水果id:食用数量' })
    // info: HeroFruitRecord[] ;

}