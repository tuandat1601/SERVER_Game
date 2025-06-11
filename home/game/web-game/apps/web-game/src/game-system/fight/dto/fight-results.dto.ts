import { IsInt, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';


export class FightResultsDto {

    @ApiProperty({ description: '战斗阵营方' })
    @IsInt()
    readonly fightCamp : number;

    @ApiProperty({ description: '战斗数据队列' })
    readonly fightData : any;

}