import { IsBoolean, IsInt, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * 英雄装备部位强化
 */
export class EquipPosUpDto {

    @ApiProperty({ description: '英雄ID' })
    @IsInt()
    readonly hid: number;

    @ApiProperty({ description: '装备部位 1-6' })
    @IsInt()
    readonly pos: number;
}

/**
 * 英雄装备部位全身强化
 */
 export class AllEquipPosUpDto {

    @ApiProperty({ description: '英雄ID' })
    @IsInt()
    readonly hid: number;
}

/**
 * 英雄升级
 */
export class HeroLvUpDto {

    @ApiProperty({ description: '英雄ID' })
    @IsInt()
    readonly hid: number;
}
/**
 * 角色换头像
 */
export class RoleUpIcoDto {

    @ApiProperty({ description: '头像id' })
    // @IsInt()
    readonly ico: string;
}
/**
 * 角色换名称
 */
export class RoleUpNameDto {

    @ApiProperty({ description: '名称' })
    readonly name: string;
}