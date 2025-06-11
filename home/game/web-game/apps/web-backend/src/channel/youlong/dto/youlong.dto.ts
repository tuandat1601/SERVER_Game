import { IsString } from "class-validator"

/**游龙渠道支付回调 */
export class YouLongPaymentDto {
    /**游戏ID */
    @IsString()
    app_id: string

    /**游戏传入的外部订单号。服务器会根据这个订单号生成对应的平台订单号，请保证每笔订单传入的订单号的唯一性。URLencodeing */
    @IsString()
    cp_order_id: string

    /**玩家ID ?*/
    @IsString()
    mem_id: string

    /**平台订单号 */
    @IsString()
    order_id: string

    /**平台订单状态 1 未支付 2成功支付 3支付失败 */
    @IsString()
    order_status: string

    /**订单下单时间 时间戳, Unix timestamp */
    @IsString()
    pay_time: string

    /**商品idURLencodeing */
    @IsString()
    product_id: string

    /**商品名称 URLencodeing*/
    @IsString()
    product_name: string

    /*商品价格(元);保留两位小数URLencodeing*/
    @IsString()
    product_price: string

    /*MD5 签名*/
    @IsString()
    sign: string

    /*透传参数 CP下单时的原样放回 URLencodeing*/
    @IsString()
    ext: string
}