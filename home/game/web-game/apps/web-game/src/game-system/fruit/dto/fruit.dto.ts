import { ApiProperty } from "@nestjs/swagger";
import { IsInt } from "class-validator";

/**升级 勋章 */
export class EatFruitDto {
    
    @ApiProperty({ description: '英雄ID' })
    @IsInt()
    readonly hid: number;
    
    @ApiProperty({ description: '水果表id' })
    @IsInt()
    readonly fid : number;
}


export class AllEatFruitDto {
    
    @ApiProperty({ description: '英雄ID' })
    @IsInt()
    readonly hid: number;
    
}