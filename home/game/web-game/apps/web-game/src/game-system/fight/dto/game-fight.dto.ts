import { IsArray, IsInt, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';


export class GameFightDto {

    @ApiProperty({ example: "gamelevels", description: 'gamelevels:关卡战斗' })
    @IsString()
    readonly fightType: string;
}


export class GameLevelsFightDto {

    @ApiProperty({ example: "1", description: '关卡id' })
    @IsInt()
    readonly gamelevels: number;


    @ApiProperty({ example: "1", description: '关卡节点' })
    @IsInt()
    readonly pos: number;

}

export class GameLevelsFight2Dto {

    /**关卡id */
    @ApiProperty({ example: "1", description: '关卡id' })
    @IsInt()
    readonly gamelevels: number;

    /**出战英雄顺序 记录的是英雄类别 */
    @ApiProperty({ example: "[1,2,3]", description: '出战英雄顺序 记录的是英雄类别' })
    @IsArray()
    readonly fightGroup: number[];
}

export class EliteFightDto {

    @ApiProperty({ example: "1", description: '关卡id' })
    @IsInt()
    readonly elitelevels: number;
}

export class ArenaFightDto {

    // @ApiProperty({ description: '竞技对象类型' })
    // readonly type?: number;
    @ApiProperty({ description: '1跨服' })
    readonly flag?: number;
    @ApiProperty({ description: '竞技对象ID' })
    // @IsInt()
    readonly id: number | string;

    @ApiProperty({ description: '猜拳ID' })
    // @IsInt()
    readonly cqid: number;
}


export class ArenaFight2Dto {

    @ApiProperty({ description: '1跨服' })
    readonly flag?: number;
    @ApiProperty({ description: '竞技对象ID' })
    @IsString()
    readonly id: string;

    @ApiProperty({ description: '猜拳ID' })
    // @IsInt()
    readonly cqid: number;

    /**出战英雄顺序 记录的是英雄类别 */
    @ApiProperty({ example: "[1,2,3]", description: '出战英雄顺序 记录的是英雄类别' })
    @IsArray()
    readonly fightGroup: number[];
}

export class RoleShowDto {

    serverid?: number;
    @ApiProperty({ description: '角色ID' })
    @IsString()
    readonly id: string;
}

export class AbyssDragonFightDto {

}

export class ADDamageAwardDto {

}


export class GetADRankDto {

}

/**魔渊挑战 */
export class DemonAbyssFightDto {
    /**关卡里的战斗节点 */
    da_pos: number;
}


/**领取魔渊每日奖励 */
export class DemonAbyssDailyAwardsDto {

}

/**魔渊每日付费购买道具 */
export class DemonAbyssDailyBuyItemDto {

}

/**领取魔渊成就奖励 */
export class DemonAbyssGetAwardsDto {

}

export class RankDto {

    @ApiProperty({ example: "1", description: '排行榜类型' })
    // @IsInt()
    readonly type: number;
}
export class AllRankDto {

    @ApiProperty({ example: "1", description: '排行榜类型' })
    // @IsInt()
    readonly type: number[];
}