import { ApiProperty } from "@nestjs/swagger";
import { OrderInfoEntity } from "apps/web-backend/src/channel/channel/entities/channel.entity";
import { IsInt, IsString } from "class-validator";

/**
 * 购买商品
 * 测试服支持 充值支付类型和游戏货币道具类型
 * 正式服仅能支持  游戏货币道具类型   
*/
export class BuyItemDto {

    @ApiProperty({ description: '购买商品ID' })
    @IsInt()
    readonly shopid: number;

    @ApiProperty({ description: '购买商品数量 充值商品默认为1' })
    @IsInt()
    readonly num: number;
}

/**
 * 后台专用 充值购买商品回调
 */
export class PayBuyItemDto {

    @ApiProperty({ description: '角色ID' })
    @IsString()
    roleid: string;

    @ApiProperty({ description: '服务器ID' })
    @IsInt()
    serverid: number;

    @ApiProperty({ description: '购买商品ID' })
    @IsInt()
    shopid: number;

    info?: OrderInfoEntity
}

/**
 * 后台专用 通知充值购买商品回调
 */
export class NotifyRechargePayShopDto {

    @ApiProperty({ description: '订单ID' })
    @IsInt()
    orderId: number;
}

/**
 * 获取月卡每日奖励
 */
export class GetMonthCardAwardDto { }

/**
 * 领取等级基金奖励
 */
export class FundLevelGetAwardDto { }

/**
* 领取锻造基金奖励
*/
export class FundEboxGetAwardDto { }

/**
* 领取累充礼包奖励
*/
export class RechargeGiftDto {

}
