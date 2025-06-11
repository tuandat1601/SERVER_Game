
/**福利-每日有礼*/
export class WelfareDaily {

    /**已领取累积天数 */
    receivedDays: number = 0;

    /**今日是否已领取 */
    todayReceived: Boolean = false;
}

/**福利-积天豪礼 */
export class WelfarePaidDays {

    /**已领取累积充值天数 */
    receivedPaidDays: number = 0;

    /**今日是否已领取 每日免费礼包*/
    dailyReceived: Boolean = false;
}