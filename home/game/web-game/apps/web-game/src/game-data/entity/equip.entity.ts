import { ApiProperty } from "@nestjs/swagger";

/**
 * 装备部位结构
 * Record<string（部位ID TableGameEquipPos）, EquipEntity>
 */
export type EquipPosRecord = Record<number, EquipEntity>

/**
 * 装备背包结构
 * Record<string（唯一ID）, EquipEntity>
 */
export type EquipEntityRecord = Record<string, EquipEntity>
/**
 * 装备词条属性
 * Record<number(词条ID [1-2]), Record<number（属性数字ID）,number（属性值）>>
 */
export type EquipAddRecord = Record<number, Record<number, number>>

export class EquipEntity {

    @ApiProperty({ description: '装备ID' })
    id: number;

    @ApiProperty({ description: '品质ID' })
    qid: number;

    @ApiProperty({ description: '唯一ID' })
    eid?: string;

    @ApiProperty({ example: "val + Math.floor(bper*per/10000) val为基础属性，bper万分比,向下取整", description: '基础属性加成' })
    bper: number;

    @ApiProperty({ example: "[1]:100", description: '基础属性' })
    battr?: Record<number, number>;

    @ApiProperty({ example: "{attr_id:attr_val}", description: '附加词条' })
    add?: EquipAddRecord;

    /**临时装备 对比英雄ID */
    @ApiProperty({ description: '临时装备 对比英雄ID' })
    tmphid?: number;
}

export class AddEquips {
    @ApiProperty({ description: '装备ID' })
    id: number;

    @ApiProperty({ description: '装备品质' })
    quality: number;
}

