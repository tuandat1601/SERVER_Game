import { EBActType } from "../../backend-enum";
import { BaseResult } from "../../result/result";

export const enconfig = {

    act_type: {
        [EBActType.Login]: "登录",
        [EBActType.GetAsyncRoutes]: "获取动态路由",
        [EBActType.RefreshToken]: "刷新token",
        [EBActType.GenCode]: "生成激活码",
        [EBActType.CodeAdmin]: "管理激活码",


        [EBActType.GetUserList]: "获取后台账号列表",
        [EBActType.CreateUser]: "创建后台账号",
        [EBActType.UpdateUser]: "修改后台账号",
        [EBActType.DeleteUser]: "删除后台账号",

        [EBActType.GetGameList]: "获取游戏平台列表",
        [EBActType.CreateGame]: "创建游戏平台",
        [EBActType.UpdateGame]: "修改游戏平台",
        [EBActType.DeleteGame]: "删除游戏平台",

        [EBActType.GetChannelList]: "获取渠道列表",
        [EBActType.CreateChannel]: "创建渠道",
        [EBActType.UpdateChannel]: "修改渠道",
        [EBActType.DeleteChannel]: "删除渠道",

        [EBActType.GetServerList]: "获取服务器列表",
        [EBActType.CreateServer]: "创建服务器",
        [EBActType.UpdateServer]: "修改服务器",
        [EBActType.DeleteServer]: "删除服务器",

        [EBActType.GetZoneList]: "获取战区列表",
        [EBActType.CreateZone]: "创建战区",
        [EBActType.UpdateZone]: "修改战区",
        [EBActType.DeleteZone]: "删除战区",

        [EBActType.GetNotice]: "获取公告",
        [EBActType.SDKLoginAuth]: "SDK账号登录验证",
        [EBActType.ServerLoginAuth]: "玩家选服登录验证",
        [EBActType.GetOrder]: "获取订单",
        [EBActType.CPaymentRet]: "渠道充值回调",

        [EBActType.SendEmail]: "发邮件",
        [EBActType.SendCShop]: "发充值商品",

        [EBActType.GetRechargeInfo]: "获取充值订单",
        [EBActType.GetRechargeRank]: "获取充值订单排行榜",

        [EBActType.UpdateRoleStatus]: "修改角色封禁状态",
        [EBActType.UserCode]: "使用激活码",

        [EBActType.CRebateRet]: "渠道自动返利",
        [EBActType.CActiceRet]: "渠道活动道具接口调用",

        [EBActType.MergeServer]: "合服",
        [EBActType.AutoMaintainServer]: "一键开启改维护",
        [EBActType.AutoOpenServer]: "一键维护改开启",

        [EBActType.setServerChatIP]: "设置服务器聊天节点",

        [EBActType.getChatLog]: "获取聊天记录",

        [EBActType.createCrossServer]: "创建跨服",
        [EBActType.deleteCrossServer]: "删除跨服",
        [EBActType.setCrossServerId]: "设置服务器跨服ID",

        [EBActType.SetAutoOpenServer]: "设置自动开服",

        [EBActType.GameData1]: "游戏充值统计",
        [EBActType.GameData2]: "游戏等级关卡分布统计",
    },

    success: "成功",
    fail: "失败",

    tips: {
        no_find_game: "游戏不存在",
        no_find_server: "该游戏服务器不存在"
    },

    /**
    * 操作成功
    * @param eActType 
    * @returns 
    */
    getSuccessMsg(ebActType: EBActType) {
        let str = enconfig.act_type[ebActType] || ebActType
        return str + enconfig.success;
    },

    setSuccess(ebActType: EBActType, retMsg: BaseResult) {
        retMsg.success = true;
        retMsg.srctype = ebActType;
        retMsg.msg = enconfig.getSuccessMsg(ebActType);
    },

    /**
    * 操作失败
    * @param eActType 
    * @returns 
    */
    setFail(eActType: EBActType, retMsg: BaseResult) {
        let str = enconfig.act_type[eActType] || eActType
        retMsg.success = false;
        retMsg.srctype = eActType;
        retMsg.msg = str + enconfig.fail;
    },

}