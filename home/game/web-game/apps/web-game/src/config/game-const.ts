import { EActType } from "./game-enum";
import { TableGameConfig } from "./gameTable/TableGameConfig";
import { TableStatus } from "./gameTable/TableStatus";

export const logbull_queue_tag = "logbull_queue";          //队列名称
export const logbull_task_tag = "logbull_task";

export const logbull_redis_name_tag = "logbull_redis_name";

export const game_tag = `${process.env.GAME_SKU}_${process.env.RUNNING_ENV}`;

export const gameConst = {

    ver: "0.0.8",
    //默认头像
    ico: "1",
    /**表里复杂结构 字段 */

    /**ID */
    table_id: "i",

    /**品质 */
    table_quailty: "q",

    /**万分比概率 */
    table_pro: "p",

    /**数量 */
    table_num: "n",

    /**数值 */
    table_val: "v",
    /**------------------------------------------*/

    /**JWT 过期时间 分钟 */
    jwt_outtime: 50,

    log_itemNumTag: `lastnum_`,

    email_systemTag: "system",

    email_globalTag: "all",

    /**用于注册队列名称 */
    logbull_queue_name: `${game_tag}_${logbull_queue_tag}`,

    /**用于 redis 管理日志节点对象*/
    logbull_redis_name: `${game_tag}_${logbull_redis_name_tag}`,

    /**队列任务名称 */
    getLogBullTaskName: function (nodeid: number) {
        return `${game_tag}_${logbull_task_tag}_${nodeid}`;
    },

    /**日志屏蔽 */
    no_log: {
        [EActType.EMAIL_GETDATA]: true,
        [EActType.PS_GET_RANK]: true,
        [EActType.ARENA_SHOW]: true,
        [EActType.RANK_LIST]: true,
        [EActType.ROLE_UPICO]: true,
        [EActType.GET_ADRANK]: true,

    },

    only_game_log: {
        [EActType.LOGIN]: true,
        [EActType.EMAIL_SEND]: true,
        [EActType.SHOP_PAY_BUY_ITEM]: true,
        // [EActType.SHOP_BUY_ITEM]: true,
        [EActType.GM_CMD]: true,
        //[EActType.HERO_MAIN_LVUP]: true,
        [EActType.BE_SEND_CSHOP]: true,
        [EActType.UPDATE_ROLESTATUS]: true,
        [EActType.BE_MERGE_SERVER]: true,
    },

    only_access_log: {
        //[EActType.LOGIN]: true,
        [EActType.EMAIL_SEND]: true,
        [EActType.SHOP_PAY_BUY_ITEM]: true,
        [EActType.GM_CMD]: true,
        [EActType.BE_SEND_CSHOP]: true,
        [EActType.UPDATE_ROLESTATUS]: true,
        [EActType.BE_MERGE_SERVER]: true,

    },

    /**-----------------夺宝大作战-------------------------*/
    /**行动一次消耗多少个骰子 */
    sp_act_dice_num: 1,

    /**夺宝大作战 赛季重置后需要重置清空的道具 */
    sp_all_item: [
        TableGameConfig.ps_item_bshell, TableGameConfig.ps_item_double_damage, TableGameConfig.ps_item_energy,
        TableGameConfig.ps_item_ldice, TableGameConfig.ps_item_ndice, TableGameConfig.ps_item_nshell,
        TableGameConfig.ps_item_tshell, TableGameConfig.ps_item_upshell
    ],

    /**夺宝大作战 赛季重置后需要重置情况的状态 */
    sp_all_status: [
        TableStatus.ps_welfare,
    ],

    /**夺宝大作战 格子上可随机的道具 */
    sp_roll_item: [
        TableGameConfig.ps_item_ndice, TableGameConfig.ps_item_ldice, TableGameConfig.ps_item_upshell,
        TableGameConfig.ps_item_double_damage, TableGameConfig.ps_item_energy
    ],
    sp_roll_item_once: TableGameConfig.ps_roll_item_once,
    /**-----------------end-------------------------------*/

    /**-----------------竞技场-------------------------*/
    /**排行榜实际缓存数量 */
    arena_rank_exmax: Math.max(TableGameConfig.arena_rank_max, 1200),
    arena_rank_exmax1: Math.max(TableGameConfig.arena_rank_max, 1200) + 1,
    /**机器人最大id */
    robot_max_id: 100000,

    /**排行榜 */
    lrank_max: TableGameConfig.gl_rank_max,
    rank_show_count: TableGameConfig.gl_rank_show,
    lrank_minlv: TableGameConfig.gl_rank_minlv,//上榜最低关卡
    /**-----------------end-------------------------------*/

    /**-----------------战斗-------------------------*/
    rareMonster_our_pos: 80,
    rareMonster_entmy_pos: 90,

    rareMonster_our_speed: 9000000,
    rareMonster_entmy_speed: 8000000,
    /**-----------------end----------------------------*/
}