import { ChatLogEntity } from "apps/web-game/src/game-data/entity/common.entity";
import { WSEMsgType } from "./ws-enum";

export interface ServerResponseWrapper {
    /**
    * 服务端返回码
    */
    code: string,
    /**
    * 错误信息（如有，例如返回码非成功码）
    */
    errorMessage?: string,
    /**
    * 返回数据（如有）
    */
    data?: WSRetMsg
}

/**回复客户端信息结构 */
export class WSRetMsg {

    constructor(type: WSEMsgType) {
        this.type = type;
    }

    ok: boolean = false;
    msg: string = "null";
    type: WSEMsgType;
}

/**最近聊天记录*/
export class WSRetLastChatLog extends WSRetMsg {

    /**全服最近聊天记录 */
    schatlist?: ChatLogEntity[];

    /**工会最近聊天记录 */
    gchatlist?: ChatLogEntity[];
}

/**聊天消息结构 */
export class WSRetChat extends WSRetMsg {

    chatLogEntity: ChatLogEntity;
}