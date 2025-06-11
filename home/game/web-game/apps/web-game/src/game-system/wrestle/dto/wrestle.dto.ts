import { IsInt } from "class-validator"

export class WrestleDto {
    /**对战第n轮 */
    @IsInt()
    turns: number
    /**我方站位顺序 */
    posorder:number[]=[]
    // /**当前我方出战位置 */
    // opos: number
    // /**当前敌方出战位置 */
    // epos: number

}

export class WrestleChgDto {

}
export class WrestleGetDto {

    /**表id */
    @IsInt()
    id: number
}
export class WrestleCardDto {
    /**英雄id */
    heroid:number
    /**装备卡集 */
    cards:number[]
}