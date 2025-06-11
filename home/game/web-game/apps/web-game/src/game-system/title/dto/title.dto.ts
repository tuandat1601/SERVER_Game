import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsInt } from "class-validator";

//称号激活
export class TitleActiveDTO {
    @ApiProperty({ description: '称号ID' })
    @IsInt()
    readonly id: number;
}

//称号穿戴
export class TitleDressDTO {
    @ApiProperty({ description: '称号ID' })
    @IsInt()
    readonly id: number;
}

//称号激活
export class TitleUndressDTO {
    @ApiProperty({ description: '称号ID' })
    @IsInt()
    readonly id: number;
}

//称号过期
export class TitleExpiredsDTO {}

