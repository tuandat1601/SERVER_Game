import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsInt } from "class-validator";

//猜拳升级
export class CQLevelUpDTO {
    @ApiProperty({ description: 'ID' })
    @IsInt()
    readonly id: number;
}



