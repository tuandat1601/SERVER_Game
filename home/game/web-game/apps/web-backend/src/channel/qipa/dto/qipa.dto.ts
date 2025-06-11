import { IsOptional } from "class-validator";

/**奇葩SDK支付回调 */
export class QiPaPaymentDto {
    /**	平台订单号 */
    order_sn: string;

    /**商品名（签名需URLENCODE） */
    good_name: string;

    /**游戏订单号 */
    game_order_sn: string

    /**用户ID【登录效验super_user_id】 */
    uuid: string

    /**支付金额（元）（原价） */
    pay_money: number

    /**游戏ID */
    game_id: string

    /**服务器ID */
    service_id: string

    /**服务器名（签名需URLENCODE） */
    service_name: string

    /**角色id */
    role_id: string

    /**角色名（签名需URLENCODE） */
    role_name: string

    /**时间戳 */
    time: number

    /**支付状态 1 成功 0 失败 */
    pay_status: number

    /**代金券 金额(元)（韩版：优惠券=原价-折扣价）（不参与签名） */
    coupon_amount: number

    /**扩展参数（签名需URLENCODE） */
    remark: string

    /**签名 */
    sign: string

    /**是否测试订单 1是，0否（不参与签名） */
    is_test: number
}


/**奇葩SDK 自动返利 调用参数*/
export class QiPaRebateDto {

    /**返利类型 1、单笔返利 */
    rebate_type: number;

    /**返利模式【不参与签名】 1：日常返利 2：周末返利 3:节假日返利 */
    @IsOptional()
    rebate_mode?: number;

    /**返利编号 唯一 判断是否重复发放 */
    rebate_no: number;

    /**游戏订单 */
    game_order_no: string;

    /**用户唯一标识（发行的userId） */
    user_id: string;

    /**当前订单支付金额（人民币，单位：元） */
    pay_money: string;

    /**返利福利（游戏虚拟币），按游戏内充值的来，例如：元宝或金币或钻石，充值返什么，邮件发送 */
    gold: number;

    /**游戏ID 由我方产品提供 */
    game_id: number;

    /**游戏ID 游戏服务器ID */
    service_id: string;

    /**角色ID（研发角色id） */
    role_id: string;

    /**角色名称，php的url编码会把星号*转为%2A，java、C#的则保留，发行是java，不要把*编码成%2A */
    role_name: string;

    /**13位时间戳 */
    time: string;

    /**签名SIGN sign=md5(rebate_type+rebate_no+game_order_no（URL编码）+user_id（URL编码）+pay_money+gold+game_id+service_id（URL编码）+role_id（URL编码）+time+key)
     * key 由我们产品提供，参数值拼接，不要+号，加号表示参数值拼接，签名错误请打印加密前拼接串与我们对比*/
    sign: string;
}

/**奇葩SDK 活动道具 调用参数*/
export class QiPaActiveDto {

    /**活动序号(判断唯一 不做重复发放) */
    active_id: number

    /**研发自己的游戏ID */
    cp_gameId: number

    /**区服ID (需要校验角色id与服务器id是否匹配) */
    server_id: string

    /**渠道游戏ID */
    game_id: number

    /**0 免费 1 付费 */
    is_freee: number

    /**价值：默认0 单位：元(用户后期的结算付费需记录) */
    money: number

    /**代金券 金额(元)（不参与签名） */
    coupon_amount: number

    /**邮件标题 */
    title: string

    /**邮件内容 */
    content: string

    /**角色ID (研发上报的角色ID) */
    player_id: string

    /**发放物品 固定格式 例如： [{"mid":"110","amount":10,"bind":1,"type":4},{"mid":"120","amount":10,"bind":1,"type":4}]
     * mid :道具物品ID amount:数量 bind: 是否绑定/是否可以交易 type 物品类型 需研发提供道具列表配置
     */
    item: string

    /**订单ID 付费道具订单号存储使用 非付费为activity_id 返利需要验证订单号可以使用该订单号，研发返利验证订单号可以使用这个来识别道具商城订单。 */
    order_id: string

    /**用户ID 用户唯一标识 */
    user_id: string

    /**不是必填项 研发自定义分组ID 付费 订单才有 不参与签名 */
    cp_gift_group: string

    /**测试订单 1 是 0 否 不参与签名 */
    is_test: string

    /**签名：md5(active_id+is_freee+money+title+content+player_id+server_id+key)注：key 研发提供 参数值拼接 不要+号 加号表示参数值拼接 sign不区分大小写 */
    sign: string
}