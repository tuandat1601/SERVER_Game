import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsInt } from "class-validator";

//升级或合成
export class RaremonsterLevelUpDTO {
    @ApiProperty({ description: '异兽ID' })
    @IsInt()
    readonly id: number; 
}

//上阵
export class RaremonsterFightDTO {
    @ApiProperty({ description: '异兽ID' })
    @IsArray()
    readonly id: number[]; 
    @ApiProperty({ description: '组' })
    @IsInt()
    readonly team: number; //组
}

//切换阵容
export class RaremonsterChangeDTO {
    @ApiProperty({ description: '组' })
    @IsInt()
    readonly team: number; //组
}

//捕捉
export class RaremonsterLotteryDTO {
    @ApiProperty({ description: '次数' })
    @IsInt()
    readonly times: number; //次数
}

//共鸣
export class RaremonsterSuitDTO {
    @ApiProperty({ description: '次数' })
    @IsInt()
    readonly group: number; //组id
}


