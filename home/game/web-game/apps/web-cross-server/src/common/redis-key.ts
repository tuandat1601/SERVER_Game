let GAME_SKU = process.env.GAME_SKU;

/**跨服服务器信息 */
export function getCross_ServerInfo_RKey(cross_serverid: number) {
    return `${GAME_SKU}_cross${cross_serverid}_serverinfo`;
}


/**跨服竞技全服数据 */
export function getCross_ArenaInfo_RKey(cross_serverid: number) {
    return `${GAME_SKU}_cross${cross_serverid}_ArenaInfo`;
}

/**跨服竞技排行数据 */
export function getCross_ArenaRank_RKey(cross_serverid: number) {
    return `${GAME_SKU}_cross${cross_serverid}_ArenaRank`;
}
/**跨服竞技排行数据 */
export function getCross_ArenaRank2_Key(cross_serverid: number) {
    return `${GAME_SKU}_cross${cross_serverid}_ArenaRank2`;
}