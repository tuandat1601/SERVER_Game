export enum EUserRoleType {
    /**超级管理员 */
    Admin = 'admin',
    /**运维 */
    Operations = 'operations',
    /**客服 */
    Service = 'service',
    /**普通角色 */
    Common = 'common'
}

export enum EUserAuthType {
    /**行为特权 */
    Admin = 'admin',
}

/**后台行为枚举 */
export enum EBActType {
    /**登录 */
    Login = 1,

    /**获取动态路由 */
    GetAsyncRoutes,

    /**刷新token */
    RefreshToken,

    /**获取后台账号列表 */
    GetUserList,

    /**创建后台账号 */
    CreateUser,

    /**修改后台账号 */
    UpdateUser,

    /**删除后台账号 */
    DeleteUser,

    /**生成激活码 */
    GenCode,

    /**管理激活码 */
    CodeAdmin,

    /**获取游戏平台 */
    GetGameList,

    /**创建游戏平台 */
    CreateGame,

    /**修改游戏平台 */
    UpdateGame,

    /**删除游戏平台 */
    DeleteGame,

    /**获取渠道 */
    GetChannelList,

    /**创建渠道 */
    CreateChannel,

    /**修改渠道 */
    UpdateChannel,

    /**删除渠道 */
    DeleteChannel,

    /**获取服务器列表 */
    GetServerList,

    /**创建服务器 */
    CreateServer,

    /**修改服务器 */
    UpdateServer,

    /**删除服务器 */
    DeleteServer,

    /**获取战区列表 */
    GetZoneList,

    /**创建战区 */
    CreateZone,

    /**修改战区 */
    UpdateZone,

    /**删除战区*/
    DeleteZone,

    /**获取公告 */
    GetNotice,

    /**SDK账号登录验证 */
    SDKLoginAuth,

    /**玩家选服登录验证 */
    ServerLoginAuth,

    /**获取订单 */
    GetOrder,

    /**渠道充值回调 */
    CPaymentRet,

    /**发邮件 */
    SendEmail,

    /**发充值商品 */
    SendCShop,

    /**获取充值订单 */
    GetRechargeInfo,

    /**修改角色封禁状态 */
    UpdateRoleStatus,

    /**使用激活码 */
    UserCode,

    /**渠道自动返利 */
    CRebateRet,

    /**渠道活动道具接口调用 */
    CActiceRet,

    /**合服 */
    MergeServer,

    /**一键开启改维护 */
    AutoMaintainServer,

    /**一键维护改开启 */
    AutoOpenServer,

    /**设置服务器聊天节点 */
    setServerChatIP,

    /**获取聊天记录 */
    getChatLog,

    /**创建跨服 */
    createCrossServer,

    /**删除跨服 */
    deleteCrossServer,

    /**设置服务器跨服ID */
    setCrossServerId,

    /**获取充值订单排行 */
    GetRechargeRank,

    /**设置自动开服 */
    SetAutoOpenServer,

    /**游戏充值统计 */
    GameData1,

    /**游戏等级关卡分布统计 */
    GameData2,
}

/**动态路由显示排序 */
export enum EBRouterRank {
    gameRouter = 1,
    userRouter,
    permissionRouter,
    activateCodeRouter,
    customerServiceRouter,
    devOpsRouter
}

/**后台账号状态 */
export enum EBUserStatus {
    /**正常 */
    Normal = "normal",
    /**封禁 */
    Locked = "Locked",
}

/**激活码导出类型 */
export enum EBOutCodeType {
    /**未使用 */
    Unused = 0,
    /**已使用 */
    Used = 1,
    /**所有 */
    All = 2,
    /**通码 */
    Com = 3,
}
/**激活码导出类型 */
export enum EBCodeUniversal {
    /**独码 */
    Only = 0,
    /**通码 */
    Com = 1,
}
/**服务器状态 */
export enum EBServerStatus {
    /**开启 */
    Open = 'Open',
    /**待开启 */
    WaitOpen = 'WaitOpen',
    /**维护 */
    Maintain = 'Maintain',
    /**关闭 */
    Close = 'Close'
}

/**服务器负载情况 */
export enum EBServerWorkload {
    /**流畅 */
    Smooth = 'Smooth',
    /**繁忙 */
    Busy = 'Busy',
    /**爆满 禁止注册新号*/
    Packed = 'Packed'
}