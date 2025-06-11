import { EBServerStatus, EBServerWorkload } from "../backend-enum"

export class BEServerInfoEntity {
    /**合并的服务器 */
    mergeIds?: number[];

    /**被合并后主服务器 */
    mainsId?: number;

    /**跨服ID 合服后要处理 */
    crossServerId?: number;
}

export class ServerEntity {
    id?: number
    gameId?: number
    /**战区ID */
    zoneId?: number
    /**服务器ID */
    serverId?: number
    name?: string
    /**渠道APP id */
    channels?: number[]
    /**游戏节点URL */
    gameUrl?: string
    /**聊天节点IP */
    chatIP?: string
    /**状态 开启 维护 关闭*/
    status?: EBServerStatus
    /**流畅 繁忙 爆满 */
    workload?: EBServerWorkload
    /**是否是新服 0不是 1是 */
    isNew?: number
    /**开服时间 */
    openTime?: string
    /**合服时间 */
    mergeTime?: string

    /**扩展信息 */
    info?: BEServerInfoEntity;

    /**创建时间 */
    createdAt?: string

    /**刷新时间 */
    updatedAt?: string
}