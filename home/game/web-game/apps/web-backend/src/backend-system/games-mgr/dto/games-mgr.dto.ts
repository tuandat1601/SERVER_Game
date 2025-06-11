import { ApiProperty } from "@nestjs/swagger";
import { EBServerStatus, EBServerWorkload } from "apps/web-backend/src/backend-enum";
import { BEGameInfoEntity, channelAppEntity, NoticeEntity } from "apps/web-backend/src/entity/game.entity";
import { EChatType } from "apps/web-game/src/config/game-enum";
import { SendEmailDto } from "apps/web-game/src/game-system/email/dto/email-system.dto";
import { IsArray, IsInt, IsOptional, IsString } from "class-validator";

export class BaseWebApi {
    /**后台验证专用 */
    /**时间验证参数 */
    time?: number

    /**验证密钥 */
    key?: string
}

export class CreateGameDto {

    /**名称 */
    @ApiProperty({ example: "荒野测试1", description: '游戏APP名' })
    @IsString()
    readonly name: string;

    /**验证密钥 */
    @ApiProperty({ example: "gkey", description: '验证密钥' })
    @IsString()
    readonly secretkey: string;

    /**标识 */
    @ApiProperty({ example: "WY_TEST1", description: '标识' })
    @IsString()
    readonly sku: string;

    /**服务器列表模版名称 */
    @ApiProperty({ example: "荒野测试-", description: '服务器列表模版名称' })
    @IsString()
    readonly serverNF: string;

    /**多个游戏节点URL地址*/
    @ApiProperty({ description: '游戏节点URL' })
    @IsArray()
    readonly gameUrl: string[];


    /**渠道配置 渠道参数 游戏公告*/
    @ApiProperty({ description: '渠道配置' })
    @IsArray()
    readonly channels: channelAppEntity[];

    @ApiProperty({ description: '服务器扩展信息' })
    @IsOptional()
    readonly info?: BEGameInfoEntity;

}

export class UpdateGameDto {

    /**id */
    @ApiProperty({ description: 'id' })
    @IsInt()
    readonly id: number;

    /**名称 */
    @ApiProperty({ example: "荒野测试1", description: '游戏APP名' })
    @IsString()
    @IsOptional()
    readonly name?: string;

    /**验证密钥 */
    @ApiProperty({ example: "gkey", description: '验证密钥' })
    @IsString()
    @IsOptional()
    readonly secretkey?: string;

    /**标识 */
    @ApiProperty({ example: "WY_TEST1", description: '标识' })
    @IsString()
    @IsOptional()
    readonly sku?: string;

    /**服务器列表模版名称 */
    @ApiProperty({ example: "荒野测试-", description: '服务器列表模版名称' })
    @IsString()
    @IsOptional()
    readonly serverNF?: string;

    /**多个游戏节点URL地址*/
    @ApiProperty({ description: '游戏节点URL' })
    @IsArray()
    @IsOptional()
    readonly gameUrl: string[];

    /**渠道配置 渠道参数 游戏公告*/
    @ApiProperty({ description: '渠道配置' })
    @IsArray()
    @IsOptional()
    readonly channels?: channelAppEntity[];

    @ApiProperty({ description: '白名单' })
    @IsArray()
    @IsOptional()
    readonly whitelist?: string[];

    @ApiProperty({ description: '黑名单' })
    @IsArray()
    @IsOptional()
    readonly blacklist?: string[];

    @ApiProperty({ description: '服务器扩展信息' })
    @IsOptional()
    readonly info?: BEGameInfoEntity;
}


export class UpdateNoticeDto {

    /**id */
    @ApiProperty({ description: 'id' })
    @IsInt()
    readonly gameId: number;

    /**渠道APP ID */
    @ApiProperty({ description: '渠道APP ID' })
    @IsInt()
    readonly channelAppId: number;

    /**渠道配置 渠道参数 游戏公告*/
    @ApiProperty({ description: '渠道配置' })
    /**公告 */
    readonly notice: NoticeEntity[];

}

export class DeleteGameDto {
    /**id */
    @ApiProperty({ description: 'id' })
    @IsInt()
    readonly id: number;
}

/**添加新的跨服 ID服务器自动从1添加*/
export class BECreateCrossServerDto extends BaseWebApi {

    /**id */
    @ApiProperty({ description: 'id' })
    @IsInt()
    readonly gameId: number;

    /**跨服节点URL地址*/
    @ApiProperty({ description: '跨服节点URL地址' })
    @IsString()
    readonly crossUrl: string;

    /**跨服ID 后台前端不用传递 服务器会自动从1开始添加*/
    @ApiProperty({ description: '跨服ID' })
    @IsInt()
    readonly crossServerId: number;
}

/**删除跨服 */
export class BEDeleteCrossServerDto extends BaseWebApi {

    /**id */
    @ApiProperty({ description: 'id' })
    @IsInt()
    readonly gameId: number;

    /**跨服ID 后台前端不用传递 服务器会自动从最后开始删除*/
    @ApiProperty({ description: '跨服ID' })
    @IsInt()
    readonly crossServerId: number;
}



/** -------------------渠道列表------------------------------ */
/**创建渠道配置 */
export class CreateChannelDto {

    /**渠道名称 */
    @ApiProperty({ example: "quick", description: '渠道名' })
    @IsString()
    readonly name: string;


    /**'渠道账号前缀 */
    @ApiProperty({ example: "quick_", description: '渠道账号前缀' })
    @IsString()
    readonly remark: string;

}


/**修改渠道配置 */
export class UpdateChannelDto {

    /**渠道ID */
    @ApiProperty({ example: "quick", description: '渠道名' })
    @IsInt()
    readonly id: number;


    /**渠道名称 */
    @ApiProperty({ example: "quick", description: '渠道名' })
    @IsString()
    @IsOptional()
    readonly name?: string;


    /**'渠道账号前缀 */
    @ApiProperty({ example: "quick_", description: '渠道账号前缀' })
    @IsString()
    @IsOptional()
    readonly remark?: string;
}

/**删除渠道配置 */
export class DeleteChannelDto {
    /**渠道ID */
    @ApiProperty({ example: "quick", description: '渠道名' })
    @IsInt()
    readonly id: number;
}


/** -------------------服务器列表------------------------------ */
/**获取服务器列表 */
export class GetServerListDto {
    /**游戏ID */
    @ApiProperty({ description: '游戏ID' })
    @IsInt()
    readonly gameId: number;
}

/**创建服务器配置 */
export class CreateServerDto extends BaseWebApi {
    @IsInt()
    readonly gameId: number
    /**战区ID */
    @IsInt()
    readonly zoneId: number
    /**服务器ID */
    @IsInt()
    readonly serverId: number

    @IsString()
    @IsOptional()
    readonly name?: string

    /**聊天节点地址 可选项 */
    @IsString()
    @IsOptional()
    readonly chatIP?: string

    /**渠道APP id */
    @IsArray()
    readonly channels: number[]
    /**游戏节点URL */
    @IsString()
    readonly gameUrl: string
    /**状态 */
    @IsString()
    readonly status: EBServerStatus
    /**流畅 繁忙 爆满 */
    @IsString()
    readonly workload: EBServerWorkload
    /**是否是新服 0不是 1是 */
    @IsInt()
    readonly isNew: number

    @IsString()
    /**开服时间 */
    readonly openTime: string

}

/**同步服务器配置到游戏服 */
export class UpdateToServerDto extends BaseWebApi {

    /**服务器ID 游戏ID 不能修改*/
    @IsInt()
    readonly gameId: number

    /**服务器ID 不能修改 */
    @IsInt()
    readonly serverId: number

    /**状态 */
    @IsString()
    @IsOptional()
    readonly status: EBServerStatus

    /**开服时间 */
    @IsString()
    @IsOptional()
    readonly openTime: string
}



/**修改服务器配置 */
export class UpdateServerDto extends BaseWebApi {

    /**服务器ID 游戏ID 不能修改*/
    @IsInt()
    readonly gameId: number

    /**服务器ID 不能修改 */
    @IsInt()
    readonly serverId: number

    /**战区ID */
    @IsInt()
    @IsOptional()
    readonly zoneId?: number

    @IsString()
    @IsOptional()
    readonly name?: string

    /**渠道APP id */
    @IsArray()
    @IsOptional()
    readonly channels?: number[]

    /**游戏节点URL */
    @IsString()
    @IsOptional()
    readonly gameUrl?: string

    /**状态 */
    @IsString()
    @IsOptional()
    readonly status?: EBServerStatus

    /**流畅 繁忙 爆满 */
    @IsString()
    @IsOptional()
    readonly workload?: EBServerWorkload

    /**是否是新服 0不是 1是 */
    @IsInt()
    @IsOptional()
    readonly isNew?: number

    /**开服时间 */
    @IsString()
    @IsOptional()
    readonly openTime?: string

    /**合服时间 */
    @IsString()
    @IsOptional()
    readonly mergeTime?: string
}

/**删除服务器配置 */
export class DeleteServerDto extends BaseWebApi {
    /**游戏ID */
    @ApiProperty({ description: '游戏ID' })
    @IsInt()
    readonly gameId: number;

    /**服务器ID */
    @ApiProperty({ description: '服务器ID' })
    @IsInt()
    readonly serverId: number;
}

/**修改服务器状态 */
export class ChangeServerStatusDto extends BaseWebApi {
    /**游戏ID */
    @ApiProperty({ description: '游戏ID' })
    @IsInt()
    gameId: number;

    /**状态 */
    @IsString()
    status: EBServerStatus


    /**服务器ID */
    @ApiProperty({ description: '服务器ID' })
    @IsArray()
    serverId: number[];
}

/**合服 */
export class MergeServerDto extends BaseWebApi {
    /**游戏ID */
    @ApiProperty({ description: '游戏ID' })
    @IsInt()
    readonly gameId: number;

    /**目标服务器ID */
    @ApiProperty({ description: '目标服务器ID' })
    @IsInt()
    readonly targetId: number;

    /**被合服服务器ID */
    @ApiProperty({ description: '被合服服务器ID' })
    @IsArray()
    readonly sourceId: number[];

    /**目标服务器 跨服ID
     * 后台服务器通知游戏服用
     * 后台前端不用传递这个数值
     */
    @IsOptional()
    targetCrossId?: number;
}

/**一键开启改维护 */
export class AutoMaintainServerDto extends BaseWebApi {
    /**游戏ID */
    @ApiProperty({ description: '游戏ID' })
    @IsInt()
    readonly gameId: number;
}

/**一键维护改开启 */
export class AutoOpenServerDto extends BaseWebApi {
    /**游戏ID */
    @ApiProperty({ description: '游戏ID' })
    @IsInt()
    readonly gameId: number;
}

/**修改服务器聊天IP */
export class BESetServerChatIPDto extends BaseWebApi {
    /**游戏ID */
    @ApiProperty({ description: '游戏ID' })
    @IsInt()
    gameId: number;

    /**服务器ID */
    @ApiProperty({ description: '服务器ID' })
    @IsInt()
    serverId: number;

    /**聊天节点 */
    @ApiProperty({ description: '聊天节点' })
    @IsString()
    chatIP: string;
}

/**设置服务器跨服ID */
export class BESetCrossServerIdDto extends BaseWebApi {
    /**游戏ID */
    @ApiProperty({ description: '游戏ID' })
    @IsInt()
    gameId: number;

    /**服务器ID */
    @ApiProperty({ description: '服务器ID' })
    @IsInt()
    serverId: number;

    /**跨服ID */
    @ApiProperty({ description: '跨服ID' })
    @IsInt()
    crossServerId: number;
}

/**设置自动开服 */
export class BESetAutoOpenServerDto extends BaseWebApi {
    /**游戏ID */
    @ApiProperty({ description: '游戏ID' })
    @IsInt()
    gameId: number;

    /**按注册量来自动开服模式 */
    autoOpenModel: boolean;

    /**按注册量来自动开服模式 注册账号数量 达到就自动开启下一个服务器 */
    autoVal: number;

    /**有效开服时间 0001-2300 每日 0点01分-23点00分 之间*/
    autoTime: string;
}

/**------------------------------------------------------------ */


/** -------------------战区列表------------------------------ */
/**获取战区列表 */
export class GetZoneListDto {
    /**游戏ID */
    @ApiProperty({ description: '游戏ID' })
    @IsInt()
    readonly gameId: number;
}

/**创建战区配置 */
export class CreateZoneDto {

    /**战区名称 */
    @ApiProperty({ example: "战区一", description: '战区名' })
    @IsString()
    readonly name: string;


    /**游戏ID */
    @ApiProperty({ description: '游戏ID' })
    @IsInt()
    readonly gameId: number;

}


/**修改战区配置 */
export class UpdateZoneDto {

    /**战区ID */
    @ApiProperty({ description: '战区' })
    @IsInt()
    readonly id: number;


    /**战区名称 */
    @ApiProperty({ example: "战区一", description: '战区名' })
    @IsString()
    readonly name: string;


    /**游戏ID */
    @ApiProperty({ description: '游戏ID' })
    @IsInt()
    readonly gameId: number;
}

/**删除战区配置 */
export class DeleteZoneDto {
    /**战区ID */
    @ApiProperty({ description: '战区' })
    @IsInt()
    readonly id: number;
}

/** -------------------游戏后台--------------------------- */
/**获取游戏公告 */
export class GetNoticeDto {
    /**游戏sku */
    @ApiProperty({ description: '游戏sku' })
    @IsString()
    readonly sku: string;

    /**渠道APP ID */
    @ApiProperty({ description: '渠道APP ID' })
    @IsInt()
    readonly channelAppId: number;
}

/** ----------------------------------------------------- */

/** -------------------游戏后台--------------------------- */
export class BESendEmailDto extends SendEmailDto {
    /**Game ID */
    @ApiProperty({ description: '游戏ID' })
    @IsInt()
    gameId: number;
}

export class BESendRechargeShopDto extends BaseWebApi {

    @ApiProperty({ description: '游戏ID' })
    @IsInt()
    readonly gameId: number;

    @ApiProperty({ description: '服务器ID' })
    @IsInt()
    readonly serverid: number;


    @ApiProperty({ description: '角色ID' })
    @IsString()
    readonly roleid: string;

    @ApiProperty({ description: '购买商品ID' })
    @IsInt()
    readonly shopid: number;

    @ApiProperty({ description: '购买商品数量 充值商品默认为1' })
    @IsInt()
    readonly num: number;
}


/**后台查找角色列表信息 */
export class BEFindRolesDto extends BaseWebApi {
    /**游戏标识 */
    @ApiProperty({ description: '游戏标识' })
    @IsString()
    readonly sku: string;

    /**渠道uid*/
    @ApiProperty({ description: '角色ID' })
    @IsString()
    readonly userId: string;
}

/**获取聊天记录 */
export class BEGetChatLogDto extends BaseWebApi {

    @ApiProperty({ description: '游戏ID' })
    @IsInt()
    readonly gameId: number;

    @ApiProperty({ description: '服务器ID' })
    @IsInt()
    readonly serverid: number;

    @ApiProperty({ description: '聊天类型' })
    @IsInt()
    readonly chattype: EChatType;
}

/** ----------------------------------------------------- */

