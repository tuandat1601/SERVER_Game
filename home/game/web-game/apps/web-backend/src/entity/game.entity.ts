
export class NoticeEntity {
    name: string;
    rank: number;
    dec: string;
}

/**渠道实体 */
export class channelAppEntity {
    /**唯一ID 单个游戏下唯一不重复  为了支持同一个游戏下 可能存在多个相同渠道包*/
    channelAppId: number;
    //渠道类型
    channelType: string;
    /**渠道配置 应用名称 */
    appName: number;
    /**渠道配置 游戏/应用APPID */
    appId: string;
    /**渠道配置 APPKEY */
    appKey: string;

    /**奇葩渠道-返利用到的KEY */
    rebate_key?: string;

    /**验证 密钥 奇葩道具回调KEY 也使用这个 */
    serverKey: string;
    /**安卓 验证 */
    /**IOS  验证 */
    /**公告 */
    notice: NoticeEntity[];

    /**用户协议URL */
    user_policy_url: string
    /**隐私协议URL */
    privacy_policy_url: string

    /**充值开关 */
    payMentSwitch: boolean
}

export class BECrossServerInfo {
    id: number;
    url: string;
}

export class BEUrlInfoEntity {
    //"mysql://root:admin@localhost:3306/webgame_dev"
    /**游戏数据库连接地址 */
    gamedbUrl: string;
}
export class BEGameInfoEntity {
    /**按注册量来自动开服模式 */
    autoOpenModel?: boolean;

    /**按注册量来自动开服模式 注册账号数量 达到就自动开启下一个服务器 */
    autoVal?: number;

    /**有效开服时间 0001-2300 每日 0点01分-23点00分 之间*/
    autoTime?: string;

    /**聊天节点IP 数组 */
    chatIPs?: string[];

    /**跨服ID 从1开始 不能重复*/
    crossServer?: BECrossServerInfo[];

    /**game节点URL对应的配置*/
    urlInfo?: Record<string, BEUrlInfoEntity>
}

export class GameEntity {
    /**游戏ID */
    id?: number;
    /**名称 */
    name?: string;
    /**验证密钥 */
    secretkey?: string;
    /**标识 */
    sku?: string;
    /**服务器列表模版名称 */
    serverNF?: string;
    /**多个游戏节点URL地址 */
    gameUrl?: string[];
    /**渠道配置 渠道参数 游戏公告*/
    channels?: channelAppEntity[];
    /**游戏扩展信息 */
    info?: BEGameInfoEntity;
    /**白名单 */
    whitelist?: string[];
    /**黑名单 */
    blacklist?: string[];
    /**创建时间 */
    createdAt?: string;
}

// /**渠道 */
// export class ChannelEntity {
//     /**渠道ID */
//     id?: number;
//     /**渠道 */
//     name?: string;
//     /**渠道前缀*/
//     remark?: string;
//     createdAt?: string;
//     updatedAt?: string;
// }

/**战区 */
export class ZoneEntity {
    /**战区ID */
    id?: number;
    /**战区名称 */
    name?: string;
    /**游戏ID*/
    gameId?: number
    createdAt?: string;
    updatedAt?: string;
}

