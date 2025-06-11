import { IsInt, IsString } from "class-validator"

/**游龙渠道支付回调 */
export class BRSdkPaymentDto {
    /**由平台提供 */
    //@IsString()
    appId: string

    /**玩家id（平台唯一）【该字段进行了urlencode】 */
    //@IsString()
    userId: string

    /**玩家充值服务器ID，即客户端SDK支付接口传递参数【该字段进行了urlencode】*/
    //@IsString()
    serverId: string

    /**玩家充值角色ID，即客户端SDK支付接口传递参数【该字段进行了urlencode】 */
    //@IsString()
    roleId: string

    /**由SDK平台生成【该字段进行了urlencode】*/
    //@IsString()
    orderNum: string

    /**订单金额，单位：分。游戏服务器必须根据SDK平台回调的金额值进行校验并下发相应价值的虚拟货币。 */
    //@IsInt()
    orderMoneyFen: string

    /**透传参数，SDK支付接口参数，SDK服务器不做处理，直接返回，可存放游戏厂商的订单号。【该字段进行了urlencode】 
     * 订单ID
    */
    //@IsString()
    extInfo: string

    /**充值结果,1表示充值成功，可为玩家添加游戏币*/
    //@IsInt()
    status: string

    /**
     * 签名校验=MD5(appId+userId+serverId+roleId+orderNum+orderMoneyFen+extInfo+status+serverKey)
     * 注意：校验sign的时候涉及urlencode的字段不要进行urldecode
     */
    //@IsString()
    sign: string
}