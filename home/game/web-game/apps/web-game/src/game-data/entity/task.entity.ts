import { ETaskState } from "../../config/game-enum";
import { TableGameConfig } from "../../config/gameTable/TableGameConfig";
import { TableTask } from "../../config/gameTable/TableTask";
import { RoleAddExp } from "./common.entity";
import { HeroEntity } from "./hero.entity";
import { ItemsRecord } from "./item.entity";

/**任务目标累计计数  <任务目标类型ID,累计计数> */
export type TaskTargetTagRecord = Record<number, number>

/**任务结构体 */
export class TaskEntity {
    /**任务ID */
    id: number;
    /**当前计数 <目标ID,当前计算>*/
    count: Record<number, number> = {};

    state: ETaskState = ETaskState.NOT_RECEIVE;
}

export class TaskMainEntity {
    /**已完成最新的主线任务ID */
    lastId: number = 0;

    /**当前主线任务结构 没有就是未开启系统 或者是已经完成最后的主线 等待新的添加 */
    curEntity?: TaskEntity
}

/**每日任务 */
export class TaskDailyEntity {
    /**任务ID 任务实体 */
    tasklist: Record<number, TaskEntity> = {};

    /**每日宝箱已领取档位ID */
    received: number = 0;
}

/**公会任务 */
export class TaskGuildEntity {
    /**任务ID 任务实体 */
    tasklist: Record<number, TaskEntity> = {};
    received: number[] = [];
}


/**回复消息更新 新任务 */
export class newTaskEntity {
    /**主线任务 */
    newTaskMain?: TaskMainEntity;
    /**关卡任务 */
    newTaskLevel?: TaskMainEntity;
    /**日常任务 */
    newTaskDaily?: TaskDailyEntity;
    /**进阶任务 */
    newTaskUpgrade?: TaskEntity[];

    /**开服福利任务 */
    newTaskOpenWelfare?: Record<number, TaskEntity>
    
    /**公会任务 */
    newTaskGuild?: TaskGuildEntity;
}

/**任务 扩展信息 */
export class TaskExInfoEntity {
    additem?: ItemsRecord;
    roleAddExp?: RoleAddExp;
    /**升级英雄新对象 */
    lvup_hero?: HeroEntity;
    /**购买商品ID */
    buy_shopid?: number;
    /**出售装备数量 */
    sell_equip_num?: number;
}
