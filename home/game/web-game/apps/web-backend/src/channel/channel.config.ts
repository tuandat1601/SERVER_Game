import MD5 from "apps/web-game/src/game-lib/md5";
import { channelAppEntity, GameEntity } from "../entity/game.entity";
import { SDKLoginCheckDto } from "./channel/entities/channel.entity";
import { FywechatPaymenDto } from "./fywechat/dto/fywechat.dto";

export const SecretKey_UserLoginKey = `ydgameUserLoginKey5acd4cc4e`;
export const SecretKey_PlayerSeverLoginKey = `ydgamePlayerSever5acd44e`;

/**渠道类型 */
export enum EChannelType {
    Test = "test",
    /**游龙包含TAPTAP */
    YouLong = "youlong",
    YL_TapTap = "yltaptap",
    /**奇葩SDK */
    QiPa = "qipa",
    /**泊然SDK 翡钥渠道  围攻大菠萝*/
    BR_SDK = "brsdk",
    /**翡钥微信SDK */
    FY_WeChat = "FYWeChat"
};


export type ChannelData = {
    name: string
    remark: string
    checkUrl: string
}

export type ChannelConfigRecord = Record<string, ChannelData>

export const ChannelConfigs: ChannelConfigRecord = {
    [EChannelType.Test]: {
        name: "测试渠道",
        remark: EChannelType.Test + "_",
        checkUrl: "123"
    },
    [EChannelType.YouLong]: {
        name: "游龙",
        remark: EChannelType.YouLong + "_",
        checkUrl: "https://ylhuoapi.hicnhm.com/cp/user/check"
    },
    [EChannelType.YL_TapTap]: {
        name: "游龙taptap",
        remark: EChannelType.YL_TapTap + "_",
        checkUrl: "https://ylhuoapi.hicnhm.com/cp/user/check"
    },
    [EChannelType.QiPa]: {
        name: "奇葩SDK",
        remark: EChannelType.QiPa + "_",
        checkUrl: "https://supersdk.7pa.com/login/checkuserinfo"
    },
    [EChannelType.BR_SDK]: {
        name: "泊然SDK",
        remark: EChannelType.BR_SDK + "_",
        checkUrl: "http://user.api.6075.com/game/verify/token"
    },
    [EChannelType.FY_WeChat]: {
        name: "翡钥SDK微信",
        remark: EChannelType.FY_WeChat + "_",
        checkUrl: "http://user.api.6075.com/game/verify/token"
    }
}

/**奇葩自动返利 道具默认钻石 */
export const rebate_item = 1002;

export class ChannelFun {

    async verifySDKLogin(sdkLoginCheckDto: SDKLoginCheckDto) { return false }

}

export function getGameUserID(cur_channel_config: ChannelData, channelUserId: string) {

    return `${cur_channel_config.remark}${channelUserId}`;
}


export function fywechatSignData(data: FywechatPaymenDto, key: string): string {
    // 去掉 sign 参数  
    delete data.sign;
    delete data.extend;

    // 按键名升序排序  
    const sortedData = Object.entries(data).sort();

    // 拼接字符串  
    //const queryString = sortedData.map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`).join('&');
    const queryString = sortedData.map(([k, v]) => `${k}=${v}`).join('&');
    // 添加 key 并生成 MD5 签名  
    const str = `${queryString}${key}`;

    return new MD5().hex_md5(str).toLowerCase();
}

// // 使用示例  
// const data = {
//     param1: 'value1',
//     param2: 'value2',
//     // sign: 'oldSign', // 如果有旧的签名，它应该在这里被移除  
// };
// const key = 'yourSecretKey';
// const signature = signData(data, key);
// console.log(signature); // 输出签名
