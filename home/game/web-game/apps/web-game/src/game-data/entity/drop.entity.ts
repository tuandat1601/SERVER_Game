import { ApiProperty } from "@nestjs/swagger";
import { EquipAddRecord, EquipEntityRecord } from "./equip.entity";
import { ItemsRecord } from "./item.entity";

export class DropDataEntity {

    /**掉落的道具列表 */
    items?: ItemsRecord;

    /**掉落的装备列表 */
    equips?: EquipEntityRecord;
}

/**要生成的道具或者装备*/
export class DropEntity {

    /**要生成的道具或者装备ID*/
    @ApiProperty({ description: 'item or equip id' })
    i: number;

    /**生成品质 */
    @ApiProperty({ description: '品质' })
    q?: number;

    /**生成概率 */
    @ApiProperty({ description: '概率' })
    p?: number;

    /**生成数量 */
    @ApiProperty({ description: '数量' })
    n?: number;

    /**固定装备 固定基础属性加成 */
    bper?: number;

    /**固定装备 固定追加属性 */
    add?: EquipAddRecord;
}