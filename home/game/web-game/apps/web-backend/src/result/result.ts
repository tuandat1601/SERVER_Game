import { ChatLogEntity } from "apps/web-game/src/game-data/entity/common.entity";
import { EBActType } from "../backend-enum";
import { RechargeInfoEntity } from "../backend-system/customer-service/entities/customer-service.entity";
import { ChannelConfigRecord } from "../channel/channel.config";
import { GameEntity, NoticeEntity, ZoneEntity } from "../entity/game.entity";
import { ServerEntity } from "../entity/server.entity";
import { UserEntity } from "../entity/user.entity";

export class BaseResult {
    success: boolean = false;
    msg: string = "请求成功";
    srctype?: EBActType;
}

export class UserResultSubInfo extends UserEntity {
    /** `token` */
    accessToken?: string;
    /** 用于调用刷新`accessToken`的接口时所需的`token` */
    refreshToken?: string;
    /** `accessToken`的过期时间（格式'xxxx/xx/xx xx:xx:xx'） */
    expires?: string;
}

export class UserResult extends BaseResult {
    data?: UserResultSubInfo
};

export class GetUserListResult extends BaseResult {
    data?: any[];
};


export class RouterResult extends BaseResult {
    data?: any[];
};

//激活码生成
export class GenCodeResult extends BaseResult {
    data?: any[];
};
export class OutCodeResult extends BaseResult {
    data?: any[];
    count?: number
};
//激活码管理
export class CodeAdminResult extends BaseResult {
    data?: any[];
};

export class GameResult extends BaseResult {
    data?: GameEntity
};

export class GetGameListResult extends BaseResult {
    data?: any[]
};

/**获取渠道列表 */
export class GetChannelResult extends BaseResult {
    data?: ChannelConfigRecord;
};


// /**创建渠道配置 */
// export class CreateChannelResult extends BaseResult {
//     data?: ChannelEntity;
// }


// /**修改渠道配置 */
// export class UpdateChannelResult extends BaseResult {
//     data?: ChannelEntity;
// }

/**删除渠道配置 */
export class DeleteChannelResult extends BaseResult { }


/**--------------------服务器列表--------------------------- */
/**获取服务器列表 */
export class GetServerResult extends BaseResult {
    data?: ServerEntity[]
};


/**创建服务器配置 */
export class CreateServerResult extends BaseResult {
    data?: ServerEntity;
}


/**修改服务器配置 */
export class UpdateServerResult extends BaseResult {
    data?: ServerEntity;
}

/**删除服务器配置 */
export class DeleteServerResult extends BaseResult { }

/**合服 */
export class MergeServerResult extends BaseResult { }

/**设置游戏服聊天节点 */
export class SetServerChatIPResult extends BaseResult {
    data?: ServerEntity;
}


/**设置自动开服 */
export class SetSetAutoOpenServerResult extends BaseResult {
    data?: GameEntity;
}

/**------------------------------------------------------- */

/**-----------------------战区------------------------------- */
/**获取战区列表 */
export class GetZoneResult extends BaseResult {
    data?: any[]
};


/**创建战区配置 */
export class CreateZoneResult extends BaseResult {
    data?: ZoneEntity;
}


/**修改战区配置 */
export class UpdateZoneResult extends BaseResult {
    data?: ZoneEntity;
}

/**删除战区配置 */
export class DeleteZoneResult extends BaseResult { }
/**------------------------------------------------------- */

/**获取公告 */
export class GetNoticeResult extends BaseResult {
    data?: NoticeEntity[];
}


//获取充值订单信息
export class RechargeInfoResult extends BaseResult {
    data?: RechargeInfoEntity;
};


export class GameDateEntity {

    /**总注册用户 */
    total_user: number;
    /**今日注册用户 */
    today_user: number;

    /**总充值 */
    total_amount: number;
    /**今日充值 */
    today_amount: number;

    //每用户平均收入
    //ARPU = total_user/total_amount
    arpu: number;

};

//游戏数据总览
export class GameDateResult extends BaseResult {
    data?: GameDateEntity;
};

/**奇葩SDK 返回参数 */
export class QiPaPayResult extends BaseResult {
    code: number;
    data?: string;
}

/**翡钥微信SDK-支付回复 */
export class FyWechatResult extends BaseResult {
    code: number;
}

/**获取聊天记录 */
export class BEGetChatLogResult extends BaseResult {
    data: ChatLogEntity[];
}

//游戏数据2 等级分布 关卡分布
export class GameDate2Result extends BaseResult {
    data?: number[];
};