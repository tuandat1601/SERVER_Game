import { ApiProperty } from "@nestjs/swagger"
import { RoleCommonEntity, RoleShowInfoEntity } from "./arena.entity";

export type GameRankRecord = Record<string, GameRankEntity>
// export type ShowRankRecord = Record<string, ShowRankEntity>

export class GameRankEntity {
    @ApiProperty({ description: '自增id' })
    id?: number;

    @ApiProperty({ description: '排行类型' })
    type: number;

    @ApiProperty({ description: '角色id' })
    roleid: string;

    @ApiProperty({ description: '服务器id' })
    serverid: number;

    @ApiProperty({ description: '排行的值' })
    val: number;

    @ApiProperty({ description: '扩展信息' })
    info: RankInfoEntity | any;

    /**是否需要保存 服务器专用*/
    save?: boolean;
}

/**跨服-排行榜节点 */
export class CrossRankEntity extends GameRankEntity {

    @ApiProperty({ description: '跨服id' })
    crossServerid: number;
}

export class RankInfoEntity extends RoleShowInfoEntity {
    @ApiProperty({ description: '排名' })
    r?: number;

}
