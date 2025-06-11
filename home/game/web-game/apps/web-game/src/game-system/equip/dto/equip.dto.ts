import { IsBoolean, IsInt, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class EquipSetUpDto {

    @ApiProperty({ description: '英雄ID' })
    @IsInt()
    readonly hid : number;

    @ApiProperty({ description: '装备部位' })
    @IsInt()
    readonly pos : number;

    @ApiProperty({ description: '装备唯一ID' })
    @IsString()
    readonly eid : string;

    @ApiProperty({description:`装备：true 卸下：false`})
    @IsBoolean()
    readonly setUp:boolean;
}


export class EquipAutoSetUpDto {

    @ApiProperty({ description: '英雄ID' })
    @IsInt()
    readonly hid : number;
}

export class EquipSellDto {

    @ApiProperty({ description: '装备唯一ID' })
    @IsString()
    readonly eid : string;
}

export class QuickEquipSellDto {

    @ApiProperty({ description: '要出售的装备品质数据结构' })
    readonly data : Record<number,boolean>;
}