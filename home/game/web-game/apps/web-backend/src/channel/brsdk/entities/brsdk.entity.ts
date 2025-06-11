export class BRSdkRet {
    code: number
    msg: string
    data: number
}

export const BRSdkErrorCode = {
    1: "验证成功,json data返回相关玩家信息",
    1001: "sign校验失败",
    2001: "appId不存在,请检查大小写与传递方式",
    2002: "服务器内部错误",
    3001: "token错误,请核对准确是否为客户端SDK登录返回的内容",
    3002: "token错误,请核对准确是否为客户端SDK登录返回的内容",
    3003: "token错误,请核对准确是否为客户端SDK登录返回的内容",
    3004: "token错误,注意检查客户端SDK的游戏参数与服务器的参数是否一致",
    3005: "token错误,请核对准确是否为客户端SDK登录返回的内容",
    3008: "token已过有效期,注意token在每一次登录会改变",
}