import { ApiProperty } from "@nestjs/swagger";
import { EFightResults, EActType } from "../../config/game-enum";
import { ChatLogEntity, FindReRoles, PrivilegeRecord, RoleAddExp, SetDailyEntity, StatusRecord } from "./common.entity";
import { EBoxEntity, XBoxEntity } from "./ebox.entity";
import { EmailAry } from "./email.entity";
import { EquipEntityRecord, EquipEntity } from "./equip.entity";
import { FightCampEntity, FightObjEntity, FightRoundsEntity } from "./fight.entity";
import { HeroEntity, HerosRecord } from "./hero.entity";
import { ItemsRecord } from "./item.entity";
import { PSActEntity, SPSRankEntity } from "./pirateShip.entity";
import { MedalInfo } from "./medal.entity";
import { RoleEntity } from "./role.entity";
import { AureoleInfo, ReDayInfo, RedDotRecord, RoleInfoEntity, RoleRechargeInfo, MercenaryDataEntity, RareMonsterEntity, TitleEntity, FashionEntity, CQEntity } from "./roleinfo.entity";
import { BuyItemTag } from "./shop.entity";
import { newTaskEntity, TaskMainEntity } from "./task.entity";
import { WelfareDaily, WelfarePaidDays } from "./welfare.entity";
import { ArenaLogEntity, ArenaEntity, ServerArenaRankRecord, ArenaFightInfo, RoleShowInfoEntity } from "./arena.entity";
import internal from "stream";
import { GameRankRecord } from "./rank.entity";
import { WrestleEntity } from "../../game-system/wrestle/entities/wrestle.entity";
import { GuildEntity, GuildRankinfo, GuildRoleinfo } from "./guild.entity";

/**猜拳结果 */
export class CQResult {
    cqid: number;
    enemy: number; //对手猜拳id
    win: number; //1:赢 2:平 3:输
    skill: number;
}

/**服务器专用 不会给客户端 */
export class REServerMsg {

    //操作类型 任务和日志
    srctype?: EActType;

    /**任务计数 没有或默认都为1 */
    taskCount?: number;
}
export class REMsg extends REServerMsg {
    //业务是否成功
    ok: boolean = false;

    //小红点 gamesys 表里有系统ID 布尔值true/false 代表是否有小红点 跟业务成功与否都会发送
    redDot?: RedDotRecord;

    //更新game token  跟业务成功与否都会发送
    newGt?: string;

    //触发隔天重置
    daily?: SetDailyEntity

    //提示 
    msg?: string = "null";

    //角色升级
    roleAddExp?: RoleAddExp;

    //任务更新
    newTask?: newTaskEntity;

    //称号过期
    expiredTitle?: TitleMsg;
    //称号激活
    attiveTitle?: TitleMsg;

    //时装过期
    expiredFashion?: FashionMsg;
    //称号激活
    attiveFashion?: FashionMsg;

    //开服福利同积分刷新
    openWelfareTPoint?: number;
}

export class RESChangeMsg extends REMsg {
    /**获得新道具 */
    additem?: ItemsRecord;
    /**扣去道具 */
    decitem?: ItemsRecord;

    /**当前道具背包数据 */
    newitem?: ItemsRecord;

    /**获得新装备 进背包 */
    addEquip?: EquipEntityRecord;

    /**扣去装备 EID 数组 */
    decEquip?: string[];

    /**获得临时装备 */
    addTmpEquip?: EquipEntityRecord;

    /**删除临时装备 EID 数组 */
    decTmpEquip?: string[];

    /**服务器 用于写日志 */
    decEquipInfo?: any;
}

/**
 * 登录消息
 */
export class RESLoginMsg extends REMsg {
    @ApiProperty({ description: '角色基础数据' })
    role?: RoleEntity;

    @ApiProperty({ example: "{1000:HeroEntity", description: '英雄信息' })
    hero?: HerosRecord;

    @ApiProperty({ example: "Record<string（唯一ID）, EquipEntity>", description: '装备背包' })
    equipbag?: EquipEntityRecord;

    @ApiProperty({ description: '角色游戏信息' })
    info?: RoleInfoEntity;

    @ApiProperty({ example: "{1001:100,1002:200}", description: '角色道具信息' })
    item?: ItemsRecord;

    @ApiProperty({ description: '未获取奖励的订单ID数组' })
    orderIds?: number[];

    @ApiProperty({ description: '是否是首次创角' })
    isCreateRole?: boolean;

    /**开服时间 */
    @ApiProperty({ description: '开服时间' })
    openServerTime?: string;
}


export class RESFightCommonInfo extends RESChangeMsg {
    /**战斗胜负结果 */
    @ApiProperty({ enum: EFightResults, enumName: "EFightResults", description: '战斗胜负结果' })
    results?: EFightResults;

    /**战斗对象列表 */
    @ApiProperty({ description: '战斗对象列表' })
    objInfo?: FightObjEntity[];

    /**回合数据 */
    @ApiProperty({ description: '回合数据' })
    rounds?: FightRoundsEntity[];

    /**阵营数据 */
    @ApiProperty({ description: '阵营数据' })
    campdata?: FightCampEntity;

    /**猜拳结果 */
    @ApiProperty({ description: '猜拳结果' })
    cqresult?: CQResult;

    /**关卡节点 */
    @ApiProperty({ description: '游戏关卡节点' })
    glPos?: number;
}

/**
 * 关卡战斗
 */
export class RESFightDataMsg extends RESFightCommonInfo {

    @ApiProperty({ description: '新的关卡战斗节点' })
    newpos?: number;

    @ApiProperty({ description: '竞技场积分信息' })
    arenainfo?: ArenaFightInfo;
}

/**
 * 关卡战斗2
 * 新模式 玩家一个一个上阵
 */
export class RESFightData2Msg extends RESChangeMsg {

    /**所有战斗结果 */
    @ApiProperty({ description: '所有战斗结果' })
    allfights: RESFightCommonInfo[];

    /**是否已经通关 */
    @ApiProperty({ description: '是否已经通关' })
    isPass: boolean;
}

/**
 * 竞技战斗
 */
export class RESArenaFightDataMsg extends RESFightCommonInfo {

    @ApiProperty({ description: '竞技场积分信息' })
    arenainfo?: ArenaFightInfo;

    @ApiProperty({ description: '排行榜' })
    rank?: ServerArenaRankRecord;
}
/**
 * 竞技战斗
 */
export class RESArenaFightData2Msg extends RESChangeMsg {

    /**所有战斗结果 */
    @ApiProperty({ description: '所有战斗结果' })
    allfights: RESFightCommonInfo[];

    /**是否已经通关 */
    @ApiProperty({ description: '是否已经通关' })
    isPass: boolean;
    
    @ApiProperty({ description: '竞技场积分信息' })
    arenainfo?: ArenaFightInfo;

    @ApiProperty({ description: '排行榜' })
    rank?: ServerArenaRankRecord;
}

/**魔渊挑战 */
export class DemonAbyssFightMsg extends RESFightCommonInfo {
    @ApiProperty({ description: '新的关卡战斗节点' })
    newpos?: number;

    @ApiProperty({ description: '新的魔渊层数（已打过的关卡ID）' })
    /**魔渊层数（已打过的关卡ID） */
    newlevels?: number;
}


/**领取魔渊每日奖励 */
export class DemonAbyssDailyAwardsMsg extends RESChangeMsg {
    /**魔渊每日奖励标记 */
    da_awards?: boolean;
}

/**魔渊每日付费购买道具 */
export class DemonAbyssDailyBuyItemMsg extends RESChangeMsg {
    /**魔渊每日奖励标记 */
    da_buytag?: number;
}

/**领取魔渊成就奖励 */
export class DemonAbyssGetAwardsMsg extends RESChangeMsg {
    /*魔渊成就奖励标记（已领取过成就奖励的标记） */
    da_awards_tag?: number;
}


/**
 * 深渊巨龙挑战
 */
export class RESAbyssDragonMsg extends RESFightCommonInfo {

    /**总伤害值 */
    @ApiProperty({ description: '总伤害值' })
    damage?: number;

}

/**
 * 领取深渊巨龙伤害奖励
 */
export class RESADDamageAwardMsg extends RESChangeMsg {
    /**深渊巨龙每日伤害奖励 已领取的最高档位标记*/
    ad_awardTag?: number;
}

/**
 * 获取深渊巨龙排行榜奖励
 */
export class RESGetADRankMsg extends RESChangeMsg {
    @ApiProperty({ description: '排行榜' })
    rank?: GameRankRecord;
}


export class RESSweepMsg extends RESChangeMsg {
    @ApiProperty({ description: '扫荡次数' })
    count?: number;
}


export class RESSkillMsg extends RESChangeMsg {
    //data?: any;
    /**英雄属性 */
    hero?: HeroEntity
}

export class RESSkillSuitMsg extends RESChangeMsg {
    id: number = 0; //共鸣id
    suit?: number[];
    hero?: HerosRecord;
}

/**
 * 装备 装上/卸下
 */
export class RESEquipMsg extends REMsg {
    //英雄属性
    hero?: HeroEntity
}

/**
 * 装备 装上/卸下
 */
export class RESEquipAutoSetUpMsg extends RESChangeMsg {
    //英雄属性
    hero?: HeroEntity
}

/**
 * 装备部位强化
 */
export class RESEquipPosMsg extends RESChangeMsg {
    //英雄属性
    hero?: HeroEntity
}

/**
 * 英雄升级
 */
export class RESHeroLvUpMsg extends RESChangeMsg {
    //英雄属性
    hero?: HeroEntity;

    /**英雄升级后 新的临时开出来的 多个对比装备 */
    newTmpEquips?: EquipEntityRecord;
}

/**
 * 出售装备
 */
export class RESSELLEquipMsg extends RESChangeMsg {

}


/**
 * 开启装备箱子
 */
export class RESOpenEBoxMsg extends RESChangeMsg {
    /**临时开出来的装备对比英雄ID */
    //tmpEquipHero?: number;
    type: number; //类型 0:锻造 1:寻宝
    xbox: XBoxEntity; //寻宝数据
}

/**
 * 出售临时对比装备
 */
export class RESSellTmpEquipMsg extends RESChangeMsg {

}
/**
 * 存储临时对比装备
 */
export class RESSaveTmpEquipMsg extends RESChangeMsg {

}

/**
 * 替换临时装备
 */
export class RESSetUpTmpEquipMsg extends RESChangeMsg {
    //英雄属性
    hero?: HeroEntity
}


/**
 * 升级装备箱子
 */
export class RESLvUpEBoxMsg extends RESChangeMsg {
    //装备宝箱
    eBoxEntity?: EBoxEntity
}

/**
 * 加速装备宝箱升级CD
 */
export class RESQuickenEBoxCDMsg extends RESChangeMsg {
    //装备宝箱
    eBoxEntity?: EBoxEntity
}


/**
 * 检测装备箱子升级是否成功
 */
export class RESCheckLvUpEBoxMsg extends REMsg {
    //装备宝箱
    eBoxEntity?: EBoxEntity
}

/**
 * 开启技能宝箱
 */
export class RESOpenSBoxMsg extends RESChangeMsg {
    /**当前保底次数 */
    speCount?: number;
}

/**
 * 寻宝奖励
 */
export class RESXBAwardMsg extends RESChangeMsg {
    times: number;
    xbox: XBoxEntity; //寻宝数据
}


/**
 * 获取邮件列表
 */
export class RESGetEmailMsg extends REMsg {
    emails?: EmailAry
}


/**
 * 领取邮件附件
 */
export class RESReceiveEmailMsg extends RESChangeMsg {

}


/** 获取挂机累计奖励*/
export class RESGetTimeAwardMsg extends RESChangeMsg {

    /**新的开始 累计时间 */
    startTime?: string;
}

/** 获取每日额外快速挂机奖励 */
export class RESGetQuickTimeAwardMsg extends RESChangeMsg {
    dailyNum?: number;
    diamond?: number;
}

// /** 获取每日额外快速挂机奖励 */
// export class RESDiamondTimeAwardMsg extends RESChangeMsg {
//     dailyNum?: number
// }

/** 获取主线任务奖励 */
export class RESGetTaskMainAwardMsg extends RESChangeMsg {

}

/** 获取每日任务奖励 */
export class RESGetTaskDailyAwardMsg extends RESChangeMsg {

}

/** 获取每日任务宝箱奖励 */
export class RESGetTaskDailyBoxAwardMsg extends RESChangeMsg {

}


/** 获取每日任务宝箱奖励 */
export class RESGetWelFareDailyAwardMsg extends RESChangeMsg {
    welfareDaily?: WelfareDaily;
}

/** 获取等级奖励 */
export class RESGetWelFareLevelAwardMsg extends RESChangeMsg {
    welfareLevel?: number;
}

/** 获取积天豪礼奖励 */
export class RESGetWelFarePaidDaysAwardMsg extends RESChangeMsg {
    welfarePaidDays?: WelfarePaidDays;
}

/** 购买商品*/
export class RESBuyItemMsg extends RESChangeMsg {
    buyItemTag?: BuyItemTag;
    /**状态信息 */
    status?: StatusRecord;
    /**特权信息 */
    privilege?: PrivilegeRecord;
    /**购买的商品ID 任务专用 */
    ts_buy_shopid?: number;

    /**超过6元的充值信息更新 */
    roleRechargeInfo?: RoleRechargeInfo;
}

/** 领取月卡每日奖励*/
export class RESGetMonthCardAwardMsg extends RESChangeMsg {

}


/** 领取等级基金奖励*/
export class RESFundLevelGetAwardMsg extends RESChangeMsg {
    /**等级基金 已经领取过的普通奖励等级标记 */
    fundLevel_Lv?: number;
    /**等级基金 已经领取过的高级奖励等级标记 */
    fundLevel_HLv?: Number;
}

/** 领取锻造基金奖励*/
export class RESFundEboxGetAwardMsg extends RESChangeMsg {
    /**锻造基金 已经领取过的普通奖励等级标记 */
    fundEbox_Lv?: number;
    /**锻造基金 已经领取过的高级奖励等级标记 */
    fundEbox_HLv?: number;
}

/** 勋章制作*/
export class RESMedalUpLevelMsg extends RESChangeMsg {
    /**勋章制作 等级 */
    // medal_Rank?:number;
    // medal_Lv?:number;
    info?: MedalInfo;
    herolist?: HerosRecord;
    baoji?: boolean;
}


/** 夺宝大作战 更新信息 骰子恢复请求*/
export class RESPSUpdateDateMsg extends RESChangeMsg {
    /**add item */
    adddice_time?: string;
}

/** 夺宝大作战 行动一次*/
export class RESPSGoActMsg extends RESChangeMsg {
    psActList?: PSActEntity[];
    /**击杀数量 击杀过后刷新*/
    killNum?: number;
}

/** 夺宝大作战 刷新海盗船*/
export class RESPSFreshMsg extends RESChangeMsg {
    psActList?: PSActEntity[];
}

/** 夺宝大作战-领取宝藏奖励*/
export class RESPSGetWelFareAwardMsg extends RESChangeMsg {

    /**已领取过的宝藏福利普通奖励等级 */
    @ApiProperty({ description: '已领取过的宝藏福利普通奖励等级' })
    welfare_lv?: number;

    /**已领取过的宝藏福利高级奖励等级 */
    @ApiProperty({ description: '已领取过的宝藏福利高级奖励等级' })
    welfare_Hlv?: number;
}

/** 夺宝大作战 炮弹升级*/
export class RESPSSellLvUpMsg extends RESChangeMsg {
    /**炮弹等级信息 */
    @ApiProperty({ description: '炮弹等级信息 <炮弹类型itemid,炮弹等级>' })
    shellInfo: Record<number, number>
}

/** 竞技场-挑战界面*/
export class RESArenaShowMsg extends RESChangeMsg {
    /**积分 */
    @ApiProperty({ description: '积分' })
    point?: number;
    /**排行榜信息 */
    @ApiProperty({ description: '排行榜' })
    rank?: ServerArenaRankRecord | GameRankRecord;
    /**挑战界面 */
    @ApiProperty({ description: '挑战界面' })
    show?: ArenaEntity[];
    /**日志界面 */
    @ApiProperty({ description: '日志界面' })
    log?: ArenaLogEntity[];
    /**角色界面 */
    @ApiProperty({ description: '角色界面' })
    roleinfo?: HerosRecord;
    /** 免战CD */
    @ApiProperty({ description: '免战玩家ID,时间' })
    nowar?: Record<number, number>;
}
/** 夺宝大作战 炮弹升级*/
export class RESPSGetRankMsg extends RESChangeMsg {
    /**排行榜信息 */
    @ApiProperty({ description: '排行榜' })
    rank: SPSRankEntity[];

    /**自己排名 */
    @ApiProperty({ description: '自己排名' })
    selfrank: number
}

/** 排行榜界面*/
export class RESRankShowMsg extends RESChangeMsg {
    @ApiProperty({ description: '自己值' })
    val?: number;
    @ApiProperty({ description: '自己排名' })
    rank?: number;
    /**排行榜信息 */
    @ApiProperty({ description: '排行榜' })
    ranklist?: GameRankRecord;
}

/** 世界排行榜界面*/
export class RESAllRankShowMsg extends RESChangeMsg {
    data: any
}

/** 角色界面*/
export class RESRoleInfoShowMsg extends RESChangeMsg {
    @ApiProperty({ description: '角色界面' })
    roleinfo?: RoleShowInfoEntity;
}

/** 领取累充礼包奖励*/
export class RESRechargeGiftMsg extends RESChangeMsg {
    /**累积充值礼包 领取标记
   * <number, number> =  <累充金额档位, 领取标记：1>
   * rechargeGift 为空，代表没有领取过任何累充档位奖励
   * 对应的金额档位没有数据，代表这个档位的金额没有领过
   * {[6]:1}  代表6元累充，已经领取
   * 记录每个金额领取记录，是为了防止策划加入新金额后导致记录混乱
   * */
    rechargeGift?: Record<number, number>
}
/** 角色头像*/
export class RESRoleIcoMsg extends RESChangeMsg {

    /**头像id */
    @ApiProperty({ description: '头像id' })
    ico?: string
}

/** 角色名称*/
export class RESRoleNameMsg extends RESChangeMsg {

    /**头像id */
    @ApiProperty({ description: '名称' })
    name?: string
}
/** 吃水果*/
export class RESEatFruitMsg extends RESChangeMsg {
    @ApiProperty({ description: '英雄信息' })
    hero?: HeroEntity
}

/** 佣兵进阶*/
export class RESUpgradeMsg extends RESFightCommonInfo {
    @ApiProperty({ description: '进阶信息' })
    grade?: number;
}


/** 获取佣兵进阶任务奖励 */
export class RESGetTaskGradeAwardMsg extends RESChangeMsg {

}

/** 光环升级 */
export class RESAureoleUpMsg extends RESChangeMsg {
    @ApiProperty({ example: "{1000:HeroEntity", description: '英雄信息' })
    hero?: HerosRecord;
    aureole?: AureoleInfo;
}

/** 佣兵 */
export class RESMercenaryMsg extends RESChangeMsg {
    @ApiProperty({ example: "{1000:HeroEntity", description: '英雄信息' })
    hero?: HerosRecord;
    mercenary?: MercenaryDataEntity;
    //遇见
    meet?: any[];
    goid?: number;
    flag_time?: string;
}

/** 佣兵切磋*/
export class RESMercenaryPkMsg extends RESFightCommonInfo {
    // hero?: HerosRecord;
    mercenary?: MercenaryDataEntity;
}

export class RESRaremonsterLevelUpMsg extends RESChangeMsg {
    id: number;
    nextId: number = 0;
    hero?: HerosRecord;
    raremst?: RareMonsterEntity;
}

export class RESRaremonsterFightMsg extends RESChangeMsg {
    raremst?: RareMonsterEntity;
}

export class RESRaremonsterChangeMsg extends RESChangeMsg {
    raremst?: RareMonsterEntity;
}

export class RESRaremonsterLotteryMsg extends RESChangeMsg {
    times: number = 0; //次数
    raremst?: RareMonsterEntity;
    items: Record<number, number>[] = [];
}

export class RESRaremonsterSuitMsg extends RESChangeMsg {
    id: number = 0; //共鸣id
    raremst?: RareMonsterEntity;
    hero?: HerosRecord;
}

/** 角斗PK*/
export class RESWrestlePKMsg extends RESFightCommonInfo {
    /**角斗 */
    wrestle?: WrestleEntity;
    turns?: number;
    hero?: HerosRecord;
}


/** 角斗更换对手*/
export class RESWrestleChgMsg extends RESChangeMsg {

    /**第几组参加比赛 */
    pkgroup: number;
}

/** 获取升阶奖励*/
export class RESWrestleGetMsg extends RESChangeMsg {
    /**已经领取的奖励 */
    isget?: number[]
}

/** 角斗卡*/
export class RESWrestleCardMsg extends RESChangeMsg {
    cards: number[]

}

export class RESFindRolesMsg extends REMsg {
    /**下标为服务器ID */
    roles?: FindReRoles;
}

export class RESSysOpenAwardMsg extends RESChangeMsg {
    sysOpenAward?: number[];
}

export class RESGetChatLogMsg extends REMsg {
    /**服务器聊天记录 */
    chatlog?: ChatLogEntity[];
}

//激活称号
export class RESTitleActiveMsg extends RESChangeMsg {
    id: number;
    title?: TitleEntity;
    hero?: HerosRecord;
}

//穿戴称号
export class RESTitleDressMsg extends RESChangeMsg {
    id: number;
    title?: TitleEntity;
}

//卸下称号
export class RESTitleUndressMsg extends RESChangeMsg {
    id: number;
    title?: TitleEntity;
}

//过期称号
export class RESTitleExpiredsMsg extends RESChangeMsg {

}

//称号消息
export class TitleMsg {
    id: number[]; //激活或到期称号
    title?: TitleEntity;
    hero?: HerosRecord;
}

//激活时装
export class RESFashionActiveMsg extends RESChangeMsg {
    id: number;
    fashion?: FashionEntity;
    hero?: HerosRecord;
}

//穿戴时装
export class RESFashionDressMsg extends RESChangeMsg {
    id: number;
    heroid: number;
    hero?: HerosRecord;
}

//卸下时装
export class RESFashionUndressMsg extends RESChangeMsg {
    id: number;
    heroid: number;
    hero?: HerosRecord;
}

//时装称号
export class RESFashionExpiredsMsg extends RESChangeMsg {

}

//时装消息
export class FashionMsg {
    id: number[]; //激活或到期时装
    fashion?: FashionEntity;
    hero?: HerosRecord;
}

/** 获取任务奖励 */
export class RESGetTaskAwardMsg extends RESChangeMsg {

}

/** 获取开服福利积分奖励 */
export class RESGetOpenWelfareAwardMsg extends RESChangeMsg {
    /**开服福利积分奖励已领取档位ID */
    received?: number = 0;
}

/** 获取公会任务奖励 */
export class RESGuildTaskAwardMsg extends RESChangeMsg {
    liveness:number; //公会每日活跃
}

/** 获取公会活跃度奖励 */
export class RESGuildLivenessAwardMsg extends RESChangeMsg {
    /**领取公会活跃度奖励 */
    id?: number = 0;
    received?: number[];
}

/** 创建公会*/
export class RESCreateGuildMsg extends RESChangeMsg {
    rguild?: GuildRoleinfo;
    sguild?: GuildEntity;
}
/** 加入公会*/
export class RESGuildMsg extends RESChangeMsg {
    rguild?: GuildRoleinfo;
    sguild?: GuildEntity;
}
/** 排行*/
export class RESGuildRankMsg extends RESChangeMsg {
    /**所有排行数据 */
    sguild?: GuildRankinfo[];
    /**你所在公会数据 */
    guild?: GuildRankinfo;
}
export class RESCQLevelUpMsg extends RESChangeMsg {
    id: number;
    cq: CQEntity;
}

