export type BuyItemTagRecord = Record<number, number>

/**购买道具标记 只有在商品表里 填了每日限制 或 永久限制才会有记录 */
export class BuyItemTag {
    /**每日购买标记 */
    dailyTag: BuyItemTagRecord = {};
    /**总购买标记 */
    alwayTag: BuyItemTagRecord = {};
    /**首次双倍标记 */
    doubleTag: BuyItemTagRecord = {};
    /**购买时间标记 */
    timeTag: BuyItemTagRecord = {};
}

export class RechargeShop {
    /**月卡 每日奖励领取标记 */
    monsthCard_daily?: boolean;
    /**终身卡 每日奖励领取标记 */
    foreverCard_daily?: boolean;

    /**等级基金 已经领取过的普通奖励等级标记 */
    fundLevel_Lv?: number;
    /**等级基金 已经领取过的高级奖励等级标记 */
    fundLevel_HLv?: number;

    /**锻造基金 已经领取过的普通奖励等级标记 */
    fundEbox_Lv?: number;
    /**锻造基金 已经领取过的高级奖励等级标记 */
    fundEbox_HLv?: number;
}