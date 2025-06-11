/**获取 福利系统-每日有礼 奖励 */
export class GetWelFareDailyAwardDto {}

/**获取 福利系统-等级奖励 奖励 */
export class GetWelFareLevelAwardDto {}

/**获取 福利系统-积天豪礼 奖励 */
export class GetWelFarePaidDaysAwardDto {
    /**true:每日免费礼包奖励领取，false：获取积天豪礼累充奖励 一键领取所有可以领取的奖励 */
    isDaily:boolean;
}