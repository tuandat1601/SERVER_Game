import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsInt } from "class-validator";

//时装激活
export class FashionActiveDTO {
    @ApiProperty({ description: '时装ID' })
    @IsInt()
    readonly id: number;
}

//时装穿戴
export class FashionDressDTO {
    @ApiProperty({ description: '时装ID' })
    @IsInt()
    readonly id: number;
    readonly heroid: number;
}

//时装激活
export class FashionUndressDTO {
    @ApiProperty({ description: '时装ID' })
    @IsInt()
    readonly id: number;
    readonly heroid: number;
}

//时装过期
export class FashionExpiredsDTO {}

