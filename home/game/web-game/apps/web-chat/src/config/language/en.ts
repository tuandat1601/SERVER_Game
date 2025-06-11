import { WSRetMsg } from "../../common/server-response-wrapper";
import { WSEMsgType } from "../../common/ws-enum";

export const wsEnconfig = {

    act_type: {
        [WSEMsgType.Connect]: "连接",
        [WSEMsgType.Send_ServerChat]: "发送全服聊天",
        [WSEMsgType.Send_GuildChat]: "发送公会聊天",
        [WSEMsgType.Ret_ServerChat]: "推送全服聊天消息",
        [WSEMsgType.Ret_GuildChat]: "推送公会聊天消息",
        [WSEMsgType.Ret_LastChatlog]: "推送最近聊天记录",
    },

    success: "成功",
    fail: "失败",

    setSuccess(retMsg: WSRetMsg) {
        let str = wsEnconfig.act_type[retMsg.type] || retMsg.type
        retMsg.ok = true;
        retMsg.msg = str + wsEnconfig.success;
    },

    /**
    * 操作失败
    * @param eActType 
    * @returns 
    */
    setFail(retMsg: WSRetMsg) {
        let str = wsEnconfig.act_type[retMsg.type] || retMsg.type
        retMsg.ok = false;
        retMsg.msg = str + wsEnconfig.fail;
    },

}