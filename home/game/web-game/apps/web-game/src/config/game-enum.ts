
/**战斗类型 */
export enum EFightType {
    /** 关卡战斗 */
    GANME_LEVELS = 1,
    /** 精英挑战 */
    ELITE = 2,

    /** 竞技场 */
    ARENA = 3,

    /** 深渊巨龙 */
    ABYSS_DRAGON = 4,

    /** 升阶战斗 */
    UPGRADE = 5,

    /** 魔渊战斗 */
    Demon_ABYSS = 6,

    /** 佣兵切磋 */
    Mercenary = 7,

    /** 角斗场（王者争霸） */
    WRESTLE = 8,

    /** 竞技场 */
    ARENA_KF = 9,

    /** 关卡战斗2 一个一个上阵 */
    GANME_LEVELS2 = 10,

    /** 竞技场 一个一个上阵*/
    ARENA2 = 11,

    /** 跨服 竞技场 一个一个上阵*/
    ARENA_KF2 = 12,
}

export enum EObjtype {
    /** 英雄 */
    HERO = 1,
    /** 怪物 */
    MONSTER = 2,

    /** 机器人 */
    ROBOT = 3,

    /** 异兽 */
    RARE_MONSTER = 4,
}

export enum EFightResults {
    /** 胜利 */
    WIN = 1,
    /** 平局 */
    DRAW = 2,
    /** 失败 */
    LOST = 3,
}

export enum EFightCamp {
    /** 无阵营，混乱状态 */
    NONE = 0,
    /** 我方 */
    OUR = 1,
    /** 敌方 */
    ENEMY = 2,
}

export enum EFightAct {
    /** 普通攻击 */
    ATK = 1,

    /** 释放技能 */
    SKILL,

    /** 添加BUFF */
    ADDBUFF,

    /** 移除BUFF */
    REMOVEBUFF,

    /** 覆盖BUFF */
    UPBUFF,

    /** 触发拥有的BUFF 效果 */
    TRIGGER_BUFF,

    /** 反击 */
    ATKBACK,

    /** 连击 */
    DOUBLEATK,

    /** 闪避 */
    MISS,

    /** 暴击 */
    CRITE,
}

export enum ESkillType {
    /** 主动 */
    ACTIVE = 1,
    /** 追击 */
    APPEND = 2,
    /** 被动 */
    PASSIVE = 3,
}

export enum ESkillActive {
    /** 未激活 */
    NO = 1,
    /** 已经激活 */
    ACTIVE = 2,
}

/** 技能品质 */
export enum ESkillQuality {
    /** 品质A */
    A = 1,
    /** 品质S */
    S = 2,
    /** 品质SS */
    SS = 3,
    /** 品质SSR */
    SSR = 4,
}

/** 战斗状态 */
export enum EFightState {
    /** 不能行动 */
    NO_ACT = 1,
    /** 不能释放主动技能 */
    NO_ASKILL = 2,
    /** 不能普通攻击 */
    NO_ATK = 3,
    /** 不能反击 */
    NO_ATKBACK = 4,
    /** 不能闪避 */
    NO_MISS = 5,
    /** 混乱-攻击不分敌我 */
    CONFUSION = 6,
    /** 免疫伤害（次数） */
    NO_DAMAGE = 7,
    /** 免疫负面BUFF */
    NO_DBUFF = 8,

    /** 不能连击 */
    NO_DOUBLEATK = 9,
}

export enum EBuffType {
    /** 伤害BUFF */
    DAMAGE = 1,
    /** 增益 */
    ADD = 2,
    /** 负面 */
    DEC = 3,
}

/** BUFF 覆盖逻辑 */
export enum EBuffUpType {
    /** 等级高覆盖等级低 */
    LV = 1,

    /** 多个BUFF效果叠加 */
    ADD = 2,
}

/** BUFF 持续类型 */
export enum EBuffRoundsType {
    /** 临时 */
    TMP = 1,
    /** 永久 */
    LONG = 2,
}

/** BUFF目标类型 */
export enum EBuffTargetType {
    /** 敌我双方 混乱状态 */
    NONE = 0,
    /** 自己 */
    SELF = 1,
    /** 我方 */
    OUR = 2,
    /** 敌方 */
    ENEMY = 3,
    /** 我方生命最低的角色 */
    OUR_MIN_HP = 4,
}

/** buff触发生效类型 */
export enum EBuffTrigger {
    /**添加后立即生效 */
    ADD = 1,
    /**每回合开始 */
    RSTART,
    /**每回合结束*/
    REND,
    /**行动开始 */
    ACTSTART,
    /**行动结束 */
    ACTEND,
    /**被攻击 */
    BEATK,
    /**受伤害 */
    BEDAMAGE,
};

/**计算目标类型 */
/**BUFF 生效时，用哪方的属性参与计算。*/
export enum EComputeType {
    /**无 不计算 */
    NONE = 0,
    /**发起者 */
    SENDER = 1,
    /**目标 */
    TARGET = 2,
}

/**计算后改变的公式 */
export enum EFormula {
    /**无 不计算 */
    NONE = 0,

    /**攻击计算公式 */
    ATKCP = 1,

    /**加 */
    ADD = 2,

    /**减 */
    MINUS = 3,
}

/**装备追加词条属性 随机规则 */
export enum EquipAddType {
    /**无权重随机一个*/
    NORMAL = 1,
}

/**装备掉落规则 */
export enum EDropType {
    /**随机一个*/
    ONE = 1,
    /**全部按概率随机*/
    ALL = 2,
}

/**英雄类型 */
export enum EHeroType {

    /**普通英雄 */
    NORMAL = 1,

    /**主角英雄 */
    LEAD = 2,
}

/**道具类型 */
export enum EItemType {

    /**普通道具 */
    NORMAL = 1,

    /**货币 */
    MONEY = 2,

    /**技能 */
    SKILL = 3,

    /**夺宝大作战 */
    PIRATE_SHIP = 4,

    //异兽碎片
    RARE_MST = 5,

    //称号道具
    TITLE = 7,

    //时装道具
    FASHION = 8,
}

/**
 * 行动类型
 * 日志类型  
 * 注意事项：因为要写入数据库，所有一旦上线，不要再改动数值，只能往后添加，否则日志类型查询会混乱
*/
export enum EActType {
    /**登录 */
    LOGIN = 1,

    /**关卡战斗*/
    FIGHT_GAMELEVELS,

    /**激活英雄技能槽位 */
    SKILL_ACTIVE_POS,

    /**技能激活 */
    SKILL_ACTIVE,

    /**技能升级 */
    SKILL_LEVEL_UP,

    /**技能穿戴 */
    SKILL_SETUP,

    /**技能卸下 */
    SKILL_SETDOWN,

    /**装备穿戴 */
    EQUIP_SETUP,

    /**装备卸下 */
    EQUIP_SETDOWN,

    /**装备一键换装 */
    EQUIP_AUTOSETUP,

    /**装备出售 */
    EQUIP_SELL,

    /**装备一键出售 */
    EQUIP_QUICKSELL,

    /**装备部位强化 */
    HERO_EQUIP_POSUP,

    /**装备全身部位强化 */
    HERO_ALL_EQUIP_POSUP,

    /**非主角英雄升级 */
    HERO_LVUP,

    /**开启装备宝箱 */
    BOX_OPEN_EBOX,

    /**装备宝箱升级 */
    BOX_LVUP_EBOX,

    /**使用道具加速锻造CD时间 */
    BOX_QUICKEN_EBOXCD,

    /**检测宝箱是否cd时间结束 */
    BOX_CHECK_LVUP_EBOX,

    /**开启技能宝箱 */
    BOX_OPEN_SBOX,

    /**获取邮件列表 */
    EMAIL_GETDATA,

    /**已读邮件 */
    EMAIL_READ,

    /**一键已读邮件*/
    EMAIL_AUTOREAD,

    /**领取邮件附件 */
    EMAIL_RECEIVE,

    /**一键领取邮件附件 */
    EMAIL_AUTORECEIVE,

    /**删除邮件 */
    EMAIL_DELETE,

    /**一键删除邮件 */
    EMAIL_AUTODELETE,

    /**发送邮件 */
    EMAIL_SEND,

    /**获取挂机累计时间奖励 */
    TIME_AWARD_GET,

    /**获取挂机快速时间奖励 */
    TIME_AWARD_GET_QUICK,

    /**精英关卡挑战*/
    FIGHT_ELITE_LEVELS,

    /**获取主线任务奖励*/
    TASK_MAIN_GETAWARD,

    /**获取每日任务奖励*/
    TASK_DAILY_GETAWARD,

    /**出售临时对比装备*/
    EBOX_SELL_TMPEQUIP,
    /**存储临时对比装备*/
    EBOX_SAVE_TMPEQUIP,
    /**替换临时存储装备*/
    EBOX_SETUP_TMPEQUIP,

    /**获取每日宝箱任务奖励*/
    TASK_DAILYBOX_GETAWARD,

    /**获取每日有礼奖励*/
    WELFARE_DAILY_AWARD,
    /**获取等级奖励*/
    WELFARE_LEVEL_AWARD,

    /**获取积天豪礼累充奖励*/
    WELFARE_PAID_DAYS_AWARD,
    /**获取积天豪礼每日奖励*/
    WELFARE_PD_DAILY_AWARD,

    /**购买商品*/
    SHOP_BUY_ITEM,
    /**付费购买商品*/
    SHOP_PAY_BUY_ITEM,

    /**领取月卡每日奖励 */
    MONTHCARD_GET_AWARD,

    /**领取等级基金奖励 */
    FUND_LEVEL_GET_AWARD,

    /**领取锻造基金奖励 */
    FUND_EBOX_GET_AWARD,

    /**观看广告减少锻造升级CD时间 */
    BOX_ADV_QUICKEN_EBOXCD,

    /**勋章升级 */
    MEDAL_UPLEVEL,

    /**竞技场 */
    ARENA_FIGHT,

    /**夺宝大作战初始化 */
    PS_INIT,

    /**夺宝大作战更新数据 */
    PS_UPDATE,

    /**夺宝大作战行动 */
    PS_GO_ACT,

    /**每日重置请求 */
    GET_RESET_DAILY,

    /**夺宝大作战-领取宝藏福利奖励 */
    PS_GET_WELFARE_AWARD,

    /**夺宝大作战-炮弹升级 */
    PS_SELL_LVUP,

    /**夺宝大作战-每日奖励 */
    PS_DAILY_AWARD,

    /**夺宝大作战-赛季奖励 */
    PS_S_AWARD,

    /**夺宝大作战-获取排行榜数据 */
    PS_GET_RANK,

    /**每日重置 */
    DAILY_RESET,

    /**竞技场,挑战界面 */
    ARENA_SHOW,

    /**GM 命令 */
    GM_CMD,

    /**主角英雄升级 */
    HERO_MAIN_LVUP,

    /**精英关卡扫荡 */
    FIGHT_SWEEP,

    /**后台发放充值商品 */
    BE_SEND_CSHOP,

    /**后台修改角色封禁状态 */
    UPDATE_ROLESTATUS,

    /**排行榜 */
    RANK_LIST,

    /**累充礼包 */
    RECHARGE_GIFT,

    /**角色更新头像 */
    ROLE_UPICO,

    /**食果 */
    EAT_FRUIT,

    /**深渊巨龙挑战*/
    FIGHT_ABYSS_DRAGON,

    /**领取深渊巨龙伤害奖励*/
    AD_DAMAGEAWARD,

    /**每日奖励*/
    DAILY_AWARD,

    /**获取深渊巨龙排行榜*/
    GET_ADRANK,

    /**获取钻石挂机快速时间奖励 */
    TIME_AWARD_DIAMOND_INFO,

    /**佣兵进阶 */
    UPGRADE,

    /**后台修改服务器状态 */
    BE_CHANGE_SERVER_STATUS,

    /**获取佣兵进阶任务奖励*/
    TASK_UPGRADE_GETAWARD,

    /**后台通知-合服*/
    BE_MERGE_SERVER,

    /**光环升级*/
    AUREOLEUP,
    /**光环激活*/
    AUREOLEACT,
    /**光环使用*/
    AUREOLEUSE,

    /**魔渊挑战*/
    DEMON_ABYSS_FIGHT,

    /**魔渊每日奖励*/
    DEMON_ABYSS_DAILY_AWARDS,

    /**魔渊领取成就奖励*/
    DEMON_ABYSS_GET_AWARDS,

    /**佣兵寻宝-激活*/
    MERCENARY_ACT,
    /**佣兵寻宝-赠送升级*/
    MERCENARY_Up,

    /**一键开启改维护 */
    BE_AUTO_MAINTAINS_SERVER,

    /**一键维护改开启 */
    BE_AUTO_OPEN_SERVER,

    /**佣兵切磋*/
    MERCENARY_FIGHT,

    /**佣兵寻宝*/
    MERCENARY_GO,

    /**佣兵更新数据*/
    MERCENARY_UPDATA,

    /**领取月卡每日奖励 */
    FOREVERCARD_GET_AWARD,

    //异兽
    RARE_MONSTER,
    RARE_MONSTER_FIGHT,
    RARE_MONSTER_CHANGE,
    RARE_MONSTER_PARK,
    RARE_MONSTER_SUIT,

    /**魔渊每日付费购买*/
    DEMON_ABYSS_DAILY_BUYITEM,

    /**角斗场（王者争霸） */
    WRESTLE_PK,
    WRESTLE_CHANGE,
    WRESTLE_CARD,

    /**查找角色 */
    BE_FIND_ROLES,

    /**系统开放领取奖励 */
    SYS_OPEN_AWARD,

    /**后台获取聊天日志 */
    BE_GET_CHAT_LOG,

    TITLE_ACTIVE,
    TITLE_DRESS,
    TITLE_UNDRESS,

    FASHION_ACTIVE,
    FASHION_DRESS,
    FASHION_UNDRESS,

    /**后台设置跨服ID */
    BE_SET_CROSSSERVER_ID,

    /**后台创建跨服服务器 */
    BE_CREATE_CROSS_SERVER,

    /**后台删除跨服服务器 */
    BE_DELETE_CROSS_SERVER,

    /**获取开服福利任务奖励*/
    TASK_OPEN_WERFARE_GETAWARD,

    /**获取开服福利积分奖励*/
    GET_OPEN_WERFARE_POINT_AWARD,

    /**寻宝*/
    BOX_OPEN_XUNBAO,
    /**寻宝领取奖励*/
    XUNBAO_AWARD,

    //公会
    GUILD,
    GUILD_CREATE,
    GUILD_JOIN,
    GUILD_LEAVE,
    GUILD_CHANGE,
    GUILD_CHANGE_LEADER,

    //猜拳
    CQ_UP,

    //技能图鉴
    SKILL_SUIT,

    //公会活跃领取奖励
    GUILD_AWARD,
    TASK_GUILD_GETAWARD,
    
    /**获取关卡任务奖励*/
    TASK_LEVEL_GETAWARD,
}

/**
 * 邮件状态
 */
export enum EEmailState {

    /**未读 */
    UNREAD = 0,

    /**已读 */
    READ = 1,

    /**已领取 */
    RECEIVED = 2,

    /**已删除 */
    Deleted = 3,
}

/**
 * 任务类型
 */
export enum ETaskType {

    /**主线 */
    MAIN = 0,

    /**每日 */
    DAILY = 1,

    /**进阶 */
    UPGRADE = 2,

    /**隐藏 */
    HIDE = 3,

    /**开服福利 */
    OPEN_WELFARE = 4,

    /**公会任务 */
    GUILD = 5,

    /**关卡任务 */
    LEVEL = 6,
}

/**
 * 任务目标触发计数类型
 */
export enum ETaskTriggerType {
    /**在执行任务中才开始记录临时计数 */
    EXECUTING = 0,

    /**角色创建后一直总是记录计数*/
    ALWAYS = 1,
}

/**关联角色数据字段类型*/
export enum ETaskDataType {
    /**无效 */
    NONE = 0,

    /**关联主线关卡ID */
    GANME_LEVELS = 1,

    /**关联精英关卡ID */
    ELITE_LEVELS = 2,

    /**关联装备宝箱等级 */
    EBOX_LV = 3,

    /**勋章等级 */
    MEDAL_LV = 4,

    /**英雄等级 */
    HERO_LV = 5,

    /**英雄等阶 */
    GRADE_LV = 6,

    /**累积充值 */
    CHARGE_TOTAL_NUM = 7,

    /**每日充值 */
    CHARGE_DAIAY_NUM = 8,
    
    /**夺宝击沉X只船 */
    PS_KILL_SHIP = 9,

    /**挑战X层魔渊 */
    DEMON_ABYSS_LV = 10,

    /**深渊巨龙X伤害 */
    DAM_AEMON_ABYSS = 11,

    /**光环X等级 */
    FINISH_AUREOLE_LV = 12,

    /**激活异兽X数量 */
    RARE_MONSTER_NUM = 13,
}

/**
 * 任务状态
 */
export enum ETaskState {
    /**未领取 */
    NOT_RECEIVE = 0,
    /**已领取 */
    RECEIVED = 1,
}

/**商品购买支付类型 */
export enum EShopPayType {

    /**充值购买 */
    RECHARGE = 0,

    /**游戏货币 或者 道具 */
    GAME_MONEY_ITEM = 1,
}

/**商品免费类型 */
export enum EShopFreeType {

    /**充值购买 */
    RECHARGE = 0,

    /**游戏货币 或者 道具 */
    GAME_MONEY_ITEM = 1,
}


/**游戏系统系统状态 类型*/
export enum EStatusTimeType {
    /**永久持有 */
    FOREVER = 0,

    /**时间限制 */
    TIME_LIMIT = 1,
}

/**计算叠加类型 类型*/
export enum EStatusCPType {
    /**计数 */
    COUNT = 0,

    /**开关 */
    SWITCH = 1,
}


/**夺宝大作战 行动类型*/
export enum EPSActType {
    /**移动到新格子 要扣去一个 普通骰子/幸运骰子 道具*/
    MOVE_CELL,

    /**每移动5次 随机一个新道具到格子上 */
    RANDOM_ADD_CELLITEM,

    /**
     * 除了 TableGameConfig.ps_item_double_damage 是BUFF 其他都会添加到背包
     */
    /**获得格子上的道具 格子上的道具删除*/
    ADD_CELL_ITEM,

    /**发射炮弹 */
    FIRE_SHELL,

    /**添加BUFF */
    ADD_BUFF,

    /**执行 BUFF*/
    TRIGGER_BUFF,

    /**删除BUFF */
    REMOVE_BUFF,

    /**切换到 新的海盗船ID 重置战斗信息 弹出获得奖励 切换新的海盗船动画*/
    NEXT_SHIP,

    /**已经打完全部海盗船 活动全部结束了 客户端 弹出获得奖励 海盗船的血重置为0 清空BUFF*/
    OVER,
}

/**夺宝大作战 活动状态*/
export enum EPSStatus {

    /**runing */
    RUNING,

    /**切换到下一个 */
    NEXT_SHIP,

    /**活动结束*/
    OVER,
}

/**竞技场挑战日志状态 */
export enum EArenaSatate {
    /**普通 */
    NORMAL = 0,

    /**可删除 */
    DELETED = 1,
}

/**运行模式 */
export enum EGameRunState {
    /**普通 */
    NORMAL = 0,

    /**测试 */
    TEST = 1,
}

/**角色状态 */
export enum EGameRoleStatus {
    /**正常 */
    NORMAL = 0,

    /**封禁状态 禁止登录 禁止聊天*/
    DISABLE = 1,

    /**禁言 禁止聊天*/
    MUTED = 2,
}


/**排行榜类型 */
export enum EGameRankType {
    /**等级排行榜 */
    LEVEL = 0,
    /**精英排行榜 */
    ELITE = 1,
    /**竞技排行榜 */
    ARENA = 2,
    /**深渊巨龙 */
    ABYSS_DRAGON = 3,
    /**魔渊 */
    DEMONABYSS = 4,
    /**王者角斗 */
    WRESTLE = 5,
    /**跨服-竞技场 */
    CROSS_ARENA = 6,
    /**竞技排行榜 新战斗模式 数据另存 */
    ARENA2 = 7,
    /**跨服-竞技场 新战斗模式 数据另存*/
    CROSS_ARENA2 = 8,



    /**竞技场 -赛季排行*/
    SEASON_ARENA = 1002,
    /**跨服-竞技场 -赛季排行*/
    SEASON_CROSS_ARENA = 1006,
}


/**关卡类型*/
export enum EGameLevelType {
    /**普通 */
    NORMAL = 1,

    /**精英 */
    ELITE = 2,

    /**深渊巨龙 */
    ABYSS_DRAGON = 3,

    /**进阶关卡 */
    Upgrade = 4,

    /**魔渊 */
    Demon_ABYSS = 5,
}

/**聊天类型 */
export enum EChatType {

    /**全服聊天 */
    Server = 1,

    /**公会聊天 */
    Guild = 2,
}

/**服务器类型 */
export enum EServerType {

    /**本服 */
    LOCAL = 0,

    /**跨服 */
    CROSS = 1,
}

/**公会职位 */
export enum EGuildPost {

    /**会长 */
    LEADER = 1,

    /**成员 */
    MEMBER = 5,
}

export enum CQType {
    /**石头 */
    STONE = 1,
    /**剪刀 */
    FORFEX = 2,
    /**布 */
    CLOTH = 3,
}
