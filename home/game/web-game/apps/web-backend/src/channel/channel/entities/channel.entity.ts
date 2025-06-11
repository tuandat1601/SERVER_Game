import { ServerEntity } from "apps/web-backend/src/entity/server.entity";
import { BaseResult } from "apps/web-backend/src/result/result";
import { FindReRoles } from "apps/web-game/src/game-data/entity/common.entity";

export class SDKLoginCheckDto {
    app_id: string
    app_key: string
    server_key: string
    mem_id: string
    user_token: string
    checkUrl: string
    sdkLoginAuthResult: SDKLoginAuthResult
}

export class ZoneEntity {
    id: number;
    name: string;
}

export class SDKLoginAuthEntity {

    //选服务器登录验证token
    serverLoginToken: string;
    /**服务器模版名称serverNF-serverid */
    serverNF: string;
    /**服务器列表 */
    server: ServerEntity[];
    /**用户协议URL */
    user_policy_url: string;
    /**隐私协议URL */
    privacy_policy_url: string;
    /**战区列表 */
    zones: ZoneEntity[];
    /**角色列表信息 */
    roles: FindReRoles;
}

export class SDKLoginAuthResult extends BaseResult {
    data: SDKLoginAuthEntity;
}

export class ServerLoginAuthEntity {
    //游戏登录验证JWT
    gameLoginToken: string;

    /**游戏gameUrl */
    gameUrl: String;

    /**聊天节点地址 */
    chatIP: string;
}

export class ServerLoginAuthResult extends BaseResult {
    data: ServerLoginAuthEntity;
}


export class OrderEntity {
    /**订单ID */
    orderId: number;
}


export class GetOrderResult extends BaseResult {
    data: OrderEntity;
}

export class OrderInfoEntity {
    /**自定义商品选择商品的数组下标 */
    diyShopIndex?: number[];
}


export enum ChannelPaymentRet {
    SUCCESS = "SUCCESS",
    FAILURE = "FAILURE",
}

export enum ChannelPaymentRet1 {
    SUCCESS = 200,
    FAILURE = 0,
}

export enum ChannelPaymentRet2 {
    SUCCESS = 0,
    FAILURE = 1,
}