import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsInt, IsString } from "class-validator";

/**
 * 开启装备宝箱
 */
export class OpenEBoxDto {

    /**锻造次数 */
    @ApiProperty({ description: '锻造次数' })
    readonly openNum: number;

    /**出售小于最低品质等级 如果没有勾选就发0  */
    @ApiProperty({ description: '出售小于最低品质等级 如果没有勾选就发0 ' })
    readonly sellLv: number;

    /**装备战力有提升时停止 */
    @ApiProperty({ description: '装备战力有提升时停止' })
    readonly fightUp: boolean;

    /**符合品质的装备自动存仓库 sellLv为0时 不触发保存 */
    @ApiProperty({ description: '符合品质的装备自动存仓库' })
    readonly autoSave: boolean;

    @ApiProperty({ description: '判断属性1' })
    readonly ckattr1: boolean;
    @ApiProperty({ description: '判断属性2' })
    readonly ckattr2: boolean;
    @ApiProperty({ description: '属性条件1' })
    readonly attr1: number;
    @ApiProperty({ description: '属性条件2' })
    readonly attr2: number;
    @ApiProperty({ description: '属性条件3' })
    readonly attr3: number;
    @ApiProperty({ description: '属性条件4' })
    readonly attr4: number;

    /**是否是自动开启 自动开启如果前面三个选项没有达标就自动出售 */
    @ApiProperty({ description: '是否是自动开启 自动开启如果前面三个选项没有达标就自动出售' })
    @IsBoolean()
    readonly autoOpen: boolean;

    /**类型 */
    @ApiProperty({ description: '类型 0:锻造 1:寻宝' })
    readonly type?: number;
}

/**
 * 出售临时对比装备
 */
export class SellTmpEquipDto {
    /**装备唯一ID */
    @ApiProperty({ description: '装备唯一ID' })
    readonly eid: string;
}

/**
 * 存储临时对比装备
 */
export class SaveTmpEquipDto {
    /**装备唯一ID */
    @ApiProperty({ description: '装备唯一ID' })
    readonly eid: string;
}


/**
 * 替换临时对比装备
 */
export class SetUpTmpEquipDto {
    /**装备唯一ID */
    @ApiProperty({ description: '装备唯一ID' })
    readonly eid: string;
}


/**
 * 加速装备宝箱升级CD
 */
export class QuickenEBoxCDDto {

    @ApiProperty({ description: '是否是广告加速' })
    @IsBoolean()
    readonly isadv: boolean;

    @ApiProperty({ description: '使用道具加速 道具数量 广告加速则数量填0' })
    @IsInt()
    readonly num: number;

    @ApiProperty({ description: '使用钻石' })
    // @IsBoolean()
    readonly diamond: boolean;
}


/**
 * 开启技能宝箱
 */
export class OpenSBoxDto {

    @ApiProperty({ description: '开启装备数量' })
    @IsInt()
    readonly num: number;

    @ApiProperty({ description: '自动出售配置' })
    readonly sellcfg: Record<number, boolean>;
}

/**
 * 寻宝奖励
 */
 export class XBAwardDto {
    @ApiProperty({ description: '次数' })
    @IsInt()
    readonly times: number;
}

