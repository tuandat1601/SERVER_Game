import { TableGameConfig } from "../../config/gameTable/TableGameConfig";
import { cTools } from "../../game-lib/tools"

export class TimeAwardEntity {

    /**累计开始时间 上限TableGameConfig.time_award_max 小时 */
    startTime?:string = cTools.newLocalDateString();

    /**每日快速挂机奖励剩余次数 每日次数：TableGameConfig.time_award_quicknum */
    dailyNum:number = TableGameConfig.time_award_quicknum;
}