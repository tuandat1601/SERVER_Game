import { ApiProperty } from "@nestjs/swagger";
import { TableGameConfig } from "apps/web-game/src/config/gameTable/TableGameConfig";
import { cTools } from "apps/web-game/src/game-lib/tools";

export class WrestleEntity {
    /**赛事id */
    season: number = 1;
    /**经验 */
    exp: number = 0;
    /**表id */
    id: number = 1;
    /**战斗信息 */
    fight?: WrestleFightEntity;
    /**已经领取的奖励 */
    isget?: number[];
    
}

export class WrestleFightEntity {

    /**当日挑战次数 */
    daynum: number = 0;
    /**第几组参加比赛 */
    pkgroup: number = 0;
    /**对战第n轮 */
    turns: number = 0
    /**怪剩余血量 */
    monhp: number[] = [];
    /**当前我方站位顺序 */
    posorder: number[] = []
    /**当前我方出战位置 */
    opos: number = 0
    /**当前敌方出战位置 */
    epos: number = 0
    /**连胜计数 */
    wincount: number = 0
}

/**公共王者数据*/
export class WrestleServerInfo {
    /**开启时间 */
    @ApiProperty({ description: '开启时间' })
    sTime: string = cTools.newLocalDate0String();
    /**赛季id */
    @ApiProperty({ description: '赛季id' })
    season: number = 1;
    @ApiProperty({ description: '上赛季排行' })
    lrank: string[] = []
  }