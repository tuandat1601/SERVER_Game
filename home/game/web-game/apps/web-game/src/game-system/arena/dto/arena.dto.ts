import { ApiProperty } from "@nestjs/swagger";



export class ArenaDto {

    @ApiProperty({ description: '挑战类型-1不刷新2刷新' })
    readonly type?: number;
    @ApiProperty({ description: '0本服1跨服' })
    readonly flag?: number;
    @ApiProperty({ description: '1：新战斗模式' })
    readonly mode?: number;
}
export class ArenaRoleinfoDto {

    @ApiProperty({ description: '角色ID' })
    readonly id: number;
    @ApiProperty({ description: '0本服1跨服' })
    readonly flag?: number;
    
}
