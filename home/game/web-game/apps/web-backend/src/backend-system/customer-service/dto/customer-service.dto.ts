import { ApiProperty } from "@nestjs/swagger";
import { EGameRoleStatus } from "apps/web-game/src/config/game-enum";
import { isInt, IsInt, IsString } from "class-validator";
import { BaseWebApi } from "../../games-mgr/dto/games-mgr.dto";

export class CreateCustomerServiceDto { }


export class RechargeInfoDto {
    @ApiProperty({ description: '服务器ID' })
    @IsInt()
    readonly serverid: number;

    @ApiProperty({ description: '游戏ID' })
    @IsInt()
    readonly gameid: number;

    @ApiProperty({ description: '角色ID' })
    @IsString()
    readonly roleid: string;

    @ApiProperty({ description: '当前页' })
    @IsInt()
    readonly page: number;

    @ApiProperty({ description: '当前页显示数量' })
    @IsInt()
    readonly pagesize: number;

    @ApiProperty({ description: '是否支付' })
    readonly paid?: number;
    @ApiProperty({ description: '是否发货' })
    readonly delivered?: number;
}


/**修改角色状态 */
export class UpdateRoleStatusDto extends BaseWebApi {

    @ApiProperty({ description: '游戏ID' })
    @IsInt()
    readonly gameid: number;

    @ApiProperty({ description: '服务器ID' })
    @IsInt()
    readonly serverid: number;

    @ApiProperty({ description: '角色ID' })
    @IsString()
    readonly roleid: string;

    @ApiProperty({ description: '状态' })
    @IsInt()
    readonly status: EGameRoleStatus;
}


export class RechargeRankDto {
    @ApiProperty({ description: '服务器ID' })
    @IsInt()
    readonly serverid: number;

    @ApiProperty({ description: '游戏ID' })
    @IsInt()
    readonly gameid: number;

    @ApiProperty({ description: '数量' })
    @IsInt()
    readonly count: number;

}