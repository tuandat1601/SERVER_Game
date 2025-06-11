import { ApiProperty } from "@nestjs/swagger";
import { EmailItemsEntity } from "apps/web-game/src/game-data/entity/email.entity";
import { IsInt, IsString } from "class-validator";

/**设置开服天数 并强制重置服务器每日状态*/
export class GMServerStartDaysDto {
    @IsInt()
    readonly days: number;
}

/**设置登录天数 重新登录 */
export class GMChangeLoginDto {
    @IsInt()
    readonly days: number;
}

/**设置夺宝大作战-赛季已开始天数*/
export class GMPSStartDaysDto {
    @IsInt()
    readonly days: number;
}

/**设置添加角色经验*/
export class GMAddRoleExpDto {
    @IsInt()
    readonly exp: number;
}

/**发邮件*/
export class GMSendEmailDto {
    @ApiProperty({ description: '附件' })
    readonly items: EmailItemsEntity[] | any;
}

/**设置竞技场-赛季结束*/
export class GMArenaSeasonEndDto {
    // days: number;
    flag?:number
}


/**完成主线任务*/
export class GMFinishTaskDto {

}

//领取系统开放奖励
export class GetSysOpenAwardDto {
    @IsInt()
    sysId: number;
 }