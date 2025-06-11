import { ApiProperty } from "@nestjs/swagger";

/**升级 勋章 */
export class LvUpMedalDto {
    @ApiProperty({ description: '一键' })
    all?: boolean
}

