import { PrismaClient } from '@prisma/client3';
import MD5 from './md5';
const prisma = new PrismaClient();

//npx prisma db seed
//ts-node prisma/seed3.ts --
export function newSaveLocalDate(datavar: Date = undefined) {
    let data: Date = datavar || new Date();
    data.setHours(data.getHours() + 8);
    return data;
}

export const userlists = [
    {
        username: 'admin',
        nickname: '管理员',
        password: new MD5().hex_md5("sourcegamevn").toLowerCase(),
        roles: ["admin", "gameAdmin"],
        auths: ["admin"],
        status: "normal",
        createdAt: new Date(),
        //  updatedAt: newSaveLocalDate(),
    },
];


export const games1 = {
    name: "荒野锤音",
    secretkey: "HY_FY01_CSKEY",
    sku: "HY_FY01_CS",
    serverNF: "荒野锤音-",
    whitelist: [],
    blacklist: [],
    gameUrl: ["http://192.168.200.129:891/ln1/"],
    info: {
        /**聊天节点IP 数组 */
        chatIPs: ["http://192.168.200.129:4501/"]
    },
    channels: [
        {
            /**唯一ID 单个游戏下重复  为了支持同一个游戏下 可能存在多个相同渠道包*/
            channelAppId: 1,
            /**渠道类型 */
            channelType: "test",
            /**渠道 应用名称 */
            appName: "荒野锤音",
            /**渠道 APPID */
            appId: 888,
            /**渠道 APPKEY */
            appKey: "appKey123",
            /**验证 密钥 */
            serverKey: "serverKey123",
            /**用户协议URL */
            user_policy_url: "http://hy.1dao99.com:900/docs/WY_CS_1/yonghuxieyi.html",
            /**隐私协议URL */
            privacy_policy_url: "http://hy.1dao99.com:900/docs/WY_CS_1/yinsixieyi.html",
            /**公告 */
            notice: [
                {
                    name: "公告1标题",
                    rank: 1,
                    dec: "公告1内容"
                },
                {
                    name: "公告2标题",
                    rank: 2,
                    dec: "公告2内容"
                }
            ],
            payMentSwitch: true
        },
    ]
}

// export const games2 = {
//     name: "荒野开发测试",
//     secretkey: "hy_dev_key",
//     sku: "HY_DEV_1",
//     serverNF: "荒野开发测试-",
//     whitelist: [],
//     blacklist: [],
//     gameUrl: ["http://192.168.0.57:888/ln2/"],
//     info: {
//         /**聊天节点IP 数组 */
//         chatIPs: ["http://192.168.0.57:4501/", "http://192.168.0.57:4502/"]
//     },
//     channels: [
//         {
//             /**唯一ID 单个游戏下重复  为了支持同一个游戏下 可能存在多个相同渠道包*/
//             channelAppId: 1,
//             /**渠道类型 */
//             channelType: "test",
//             /**渠道 应用名称 */
//             appName: "荒野测试",
//             /**渠道 APPID */
//             appId: 888,
//             /**渠道 APPKEY */
//             appKey: "appKey123",
//             /**验证 密钥 */
//             serverKey: "serverKey123",
//             /**用户协议URL */
//             user_policy_url: "http://hy.1dao99.com:900/docs/WY_CS_1/yonghuxieyi.html",
//             /**隐私协议URL */
//             privacy_policy_url: "http://hy.1dao99.com:900/docs/WY_CS_1/yinsixieyi.html",
//             /**公告 */
//             notice: [
//                 {
//                     name: "公告1标题",
//                     rank: 1,
//                     dec: "公告1内容"
//                 },
//                 {
//                     name: "公告2标题",
//                     rank: 2,
//                     dec: "公告2内容"
//                 }
//             ],
//             payMentSwitch: true
//         },
//         {
//             /**唯一ID 单个游戏下重复  为了支持同一个游戏下 可能存在多个相同渠道包*/
//             channelAppId: 2,
//             /**渠道类型 */
//             channelType: "youlong",
//             /**渠道 应用名称 */
//             appName: "荒野测试",
//             /**渠道 APPID */
//             appId: 1,
//             /**渠道 APPKEY */
//             appKey: "appKey123",
//             /**验证 密钥 */
//             serverKey: "serverKey123",
//             /**用户协议URL */
//             user_policy_url: "http://hy.1dao99.com:900/docs/WY_CS_1/yonghuxieyi.html",
//             /**隐私协议URL */
//             privacy_policy_url: "http://hy.1dao99.com:900/docs/WY_CS_1/yinsixieyi.html",
//             /**公告 */
//             notice: [
//                 {
//                     name: "公告1标题",
//                     rank: 1,
//                     dec: "公告1内容"
//                 },
//                 {
//                     name: "公告2标题",
//                     rank: 2,
//                     dec: "公告2内容"
//                 }
//             ],
//             payMentSwitch: true
//         }
//     ]
// }

async function main() {
    // Do stuff
    await prisma.user.createMany({
        data: userlists
    })

    await prisma.games.create(
        {
            data: Object.assign(games1, {
                channels: <any>games1.channels
            })
        }
    )

    // await prisma.games.create(
    //     {
    //         data: Object.assign(games2, {
    //             channels: <any>games2.channels
    //         })
    //     }
    // )

    // await prisma.channel.createMany(
    //     {
    //         data: [
    //             {
    //                 name: "测试渠道",
    //                 remark: "test_"
    //             },
    //             {
    //                 name: "游龙taptap",
    //                 remark: "yltaptap_"
    //             }
    //         ]
    //     }
    // )

    await prisma.servers.createMany(
        {
            data: [
                {
                    gameId: 1,
                    serverId: 1,
                    zoneId: 1,
                    name: "",
                    channels: [1, 2],
                    gameUrl: "http://192.168.200.129:891/ln1/",
                    chatIP: "http://192.168.200.129:4501",
                    status: "Open",
                    workload: "Smooth",
                    isNew: 1,
                    info: {},
                    openTime: newSaveLocalDate()
                },
                // {
                //     gameId: 2,
                //     serverId: 1,
                //     zoneId: 1,
                //     name: "",
                //     channels: [1, 2],
                //     gameUrl: "http://192.168.0.57:888/ln2/",
                //     chatIP: "http://192.168.0.57:4501",
                //     status: "Open",
                //     workload: "Smooth",
                //     isNew: 1,
                //     info: {},
                //     openTime: newSaveLocalDate()
                // }
            ]
        }
    )

    await prisma.zones.create(
        {
            data: {
                name: "战区一",
                gameId: 1
            }
        }
    )


}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
