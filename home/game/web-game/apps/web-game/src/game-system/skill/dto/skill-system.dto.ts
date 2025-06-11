import { ApiProperty } from "@nestjs/swagger";

/**
 * 激活技能
 */
export class ActiveSkillDto {

    @ApiProperty({description:`英雄ID`})
    readonly heroid:number;


    @ApiProperty({description:`pos 技能槽位`})
    readonly pos:number;
}

/**
 * 升级技能
 */
export class LvUpSkillDto {

    @ApiProperty({description:`技能ID`})
    readonly sid:number;
}

/**
 * 装备/卸下 技能
 */

 export class SetUpSkillDto {

    @ApiProperty({description:`装备：true 卸下：false`})
    readonly setUp:boolean;

    @ApiProperty({description:`英雄ID`})
    readonly heroid:number;

    @ApiProperty({description:`技能ID`})
    readonly sid:number;

    @ApiProperty({description:`pos 技能槽位`})
    readonly pos:number;
}

/**
 * 技能图鉴升级
 */
export class SkillSuitDTO {
    @ApiProperty({ description: '技能图鉴组' })
    readonly group: number; //组id
}
