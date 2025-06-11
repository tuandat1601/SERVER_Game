import { ApiProperty } from "@nestjs/swagger";
import { EBOutCodeType } from "apps/web-backend/src/backend-enum";
import { IsArray, IsInt, IsString } from "class-validator";


export class GenCodeDto {

    @ApiProperty({ description: '激活码生成数量' })
    @IsInt()
    readonly quantity: number;

    // @ApiProperty({ description: '激活码生成长度' })
    // @IsInt()
    // readonly length?: number;

    @ApiProperty({ description: '管理表ID' })
    @IsInt()
    readonly id: number;

}

export class GenComCodeDto {

    @ApiProperty({ description: '通用激活码' })
    @IsString()
    readonly code: string;

    @ApiProperty({ description: '管理表ID' })
    @IsInt()
    readonly id: number;

}
export class OutCodeDto {
    @ApiProperty({ description: '游戏类型' })
    @IsInt()
    readonly gameid: number;
    @ApiProperty({ enum: EBOutCodeType, description: '导出类型' })
    @IsInt()
    readonly type: number;

    @ApiProperty({ description: '对应管理id' })
    readonly cinfoid?: number;

    @ApiProperty({ description: '当前页' })
    readonly page?: number;

    @ApiProperty({ description: '当前页显示数量' })
    readonly pagesize?: number;
}
export class UseCodeDto {
    // @ApiProperty({ description: '游戏ID' })
    // @IsInt()
    // readonly gameid: number;
    @ApiProperty({ description: 'SKU' })
    @IsString()
    readonly sku: string;
    @ApiProperty({ description: 'serverid' })
    @IsInt()
    readonly serverid: number;
    @ApiProperty({ description: '角色ID' })
    @IsInt()
    readonly roleid: number;
    @ApiProperty({ description: '激活码' })
    @IsString()
    readonly code: string;
}
export class CodeInfoDto {
    id?: number
    gameid: number;
    codename: string;
    //奖励邮件ID
    emailid: number;
    //长度
    len: number;
    //是否是通用码 通用码只生成一个 0 独码  1通用
    universal: number;
    //重复激活次数
    @IsInt()
    repe: number;
    //使用
    isuse: number;
    //有效时间
    endTime?: string;
    // createdAt         DateTime            @default(now())
    // updatedAt         DateTime            @default(now()) @updatedAt
    // game_code_used    game_code_used[]
    // game_comcode_used game_comcode_used[]

}

export class DelCodeadminDto {
    @IsInt()
    id: number;
}
export class GetCodeInfoDto {
    @IsInt()
    gameid: number;
}


export class CodeEmailDto {
    @ApiProperty({ description: '服务器ID' })
    @IsInt()
    readonly serverid: number;
    @ApiProperty({ description: '游戏ID' })
    @IsInt()
    readonly gameid: number;
    @ApiProperty({ description: '标题' })
    @IsString()
    readonly title: string;
    @ApiProperty({ description: '内容' })
    @IsString()
    readonly content: string;
    @ApiProperty({ description: '道具' })
    // @IsString()
    readonly items: any;
}
export class DelCodeEmailDto {
    @IsInt()
    id: number;
}

/**请求游戏统计数据 */
export class GameDataDto {
    @ApiProperty({ description: '游戏ID' })
    @IsInt()
    readonly gameid: number;
}

export enum BEGameData2Type {

    ROLE_LEVEL = 0,
    GAME_LEVEL
}

export type BEGameData2Range = {
    min: number,
    max: number
}

/**请求游戏统计数据2 (等级分布/关卡分布) */
export class GameData2Dto {
    @ApiProperty({ description: '游戏ID' })
    @IsInt()
    readonly gameid: number;

    @ApiProperty({ description: '服务器ID 0为全服' })
    @IsInt()
    readonly serverid: number;

    @ApiProperty({ description: '分布区间 [{min:1,max:20},{min:21,max:40}]' })
    @IsArray()
    readonly range: BEGameData2Range[];

    @ApiProperty({ description: '类型 等级分布:0 关卡分布:1' })
    @IsInt()
    readonly type: BEGameData2Type;
}