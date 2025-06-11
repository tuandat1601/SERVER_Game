import { ApiProperty } from "@nestjs/swagger";
import { IsInt } from "class-validator";

/**
 * 更新UI信息 骰子恢复请求
 */
export class PSUpdateDateDto { }

/**
 * 玩家行动一次
 */
export class PSGoActDto {
    /**>0 代表使用幸运骰子选择的点数 =0 代表使用普通骰子 */
    ldice: number;
}

/**
 * 领取宝藏福利奖励
 */
export class PSGetWelFareAwardDto { }

/**
 * 炮弹升级
 */
export class PSSellLvUpDto {
    /**炮弹类型 对应GameConfig 里的三种炮弹ITEM ID定义 */
    shell_itemid: number;
}

/**
 * 获取排行榜
 */
export class PSGetRankDto { }

/**
 * 刷新海盗船
 */
export class PSFreshDto { }
