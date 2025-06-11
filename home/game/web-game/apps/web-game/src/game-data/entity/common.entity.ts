import { ApiProperty } from "@nestjs/swagger";
import { EActType, EChatType } from "../../config/game-enum";
import { TableGameConfig } from "../../config/gameTable/TableGameConfig";
import { cTools } from "../../game-lib/tools";
import { RoleCommonEntity } from "./arena.entity";
import { EquipEntityRecord } from "./equip.entity";
import { HeroEntity } from "./hero.entity";
import { ItemsRecord } from "./item.entity";
import { PirateShipRoleEntity } from "./pirateShip.entity";
import { ReDayInfo } from "./roleinfo.entity";
import { BuyItemTagRecord } from "./shop.entity";
import { TaskDailyEntity, TaskGuildEntity } from "./task.entity";
import { WelfareDaily, WelfarePaidDays } from "./welfare.entity";

//隔天每日重置触发会发送
export class SetDailyEntity {
    /*挂机系统-快速挂机每日次数 */
    timeAward_dailyNum?: number = TableGameConfig.time_award_quicknum;

    /**每日任务重置 */
    taskDaiy?: TaskDailyEntity;

    /**公会任务重置 */
    taskGuild?: TaskGuildEntity;

    /**重置 每日活跃点道具/夺宝大作战道具赛季重置*/
    reSetItem?: ItemsRecord = {};

    /**福利-每日有礼 */
    welfareDaily?: WelfareDaily;

    /**福利-积天豪礼 */
    welfarePaidDays?: WelfarePaidDays;

    /**状态信息 */
    status?: StatusRecord;

    /**商品-每日购买限制标记 */
    dailyTag?: BuyItemTagRecord;

    /**商品-总购买标记 */
    alwayTag?: BuyItemTagRecord;

    /**月卡-每日礼包领取标记*/
    monsthCard_daily?: boolean;
    /**终身卡-每日礼包领取标记*/
    foreverCard_daily?: boolean;

    /**夺宝大作战新赛季数据 */
    pirateShip?: PirateShipRoleEntity;

    /**重置关卡扫荡 已废弃 */
    elitesweepcount?: number;

    /**每日重置信息 变量集合 */
    reDayInfo?: ReDayInfo;

    /**累充礼包重置信息（根据TableGameConfig.recharge_gift_rest 配置） */
    rechargeGift?: Record<number, number>;

    /**角斗每日挑战数重置 */
    wrestle_daynum: number;
}

//新系统开放 系统ID   系统初始化数据
export type NewSystem = Record<number, any>

export class RoleAddExp {
    @ApiProperty({ description: '此次获得的总经验' })
    addExp?: number;
    @ApiProperty({ description: '新的主角当前经验' })
    newExp?: number;
    @ApiProperty({ description: '新的主角等级' })
    newLevel?: number;

    @ApiProperty({ description: '新的主角英雄数据 英雄ID 和英雄总属性会更新' })
    newHero?: HeroEntity;

    @ApiProperty({ description: '解锁新的英雄' })
    newActiveHeros?: HeroEntity[];

    /**新系统开放 [系统ID]={} 系统初始化数据结构 */
    newSystem?: NewSystem;

    //英雄升级后 新的临时装备对比英雄ID
    //newTmpEquipHero?: number;

    /**英雄升级后 新的临时开出来的 多个对比装备 */
    newTmpEquips?: EquipEntityRecord;

}

/**状态结构 id 过期时间/永久持有 1 */
export type StatusRecord = Record<number, Date | number | string>

/**特权结构 id 持有激活数值  激活层数 */
export type PrivilegeRecord = Record<number, number>

/**通过结构 <number, number>*/
export type GRecordNN = Record<number, number>


export class LogEntity {
    userid: string;
    roleid: string;
    logtime: string | Date = cTools.newSaveLocalDate();
    type: EActType;
    req: string;
}

/**服务器ID  角色信息*/
export type FindReRoles = Record<number, FindRoles>
export class FindRoles {
    //roleid: string;
    name: string;
    lv: number;
}

export type ChatLogEntity = {
    id?: number
    serverid: number
    type: EChatType
    sender: string
    /**公会聊天：公会ID 私聊：玩家ID */
    target?: string
    msg: string
    /**发送者详细信息 */
    info: RoleCommonEntity
    createdAt?: Date
    needSave?: boolean
}

export type JwtEntity = {
    /**roleid */
    id: string
    userid: string
    serverid: number
    name: string
}