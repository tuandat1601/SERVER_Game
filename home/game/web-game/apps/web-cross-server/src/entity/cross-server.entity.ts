import { ApiProperty } from "@nestjs/swagger";
import { ArenaServerInfo } from "apps/web-game/src/game-data/entity/arena.entity";

/**
 * 跨服服务器结构
 */
export class CRServerEntity {

    /**竞技场 数据结构 */
    @ApiProperty({ description: '竞技场 数据结构' })
    arenaData?: ArenaServerInfo;
}