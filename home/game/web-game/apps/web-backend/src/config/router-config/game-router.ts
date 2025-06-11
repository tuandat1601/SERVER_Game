
import { EBRouterRank } from "../../backend-enum";
import { RouteConfigsTable } from "./router-type";

//export const gameRouter = new RouteConfigsTable();
let cur_rank = EBRouterRank.gameRouter;

export const gameRouter: RouteConfigsTable = {
    path: "/game",
    meta: {
        title: "游戏管理",
        icon: "gameIcon",
        //icon:"icon-park:game",
        rank: cur_rank
    },
    children: [
        {
            path: "/game/game-list/index",
            name: "GameList",
            meta: {
                title: "游戏列表",
                roles: ["admin", "gameAdmin"]
            }
        },
        {
            path: "/game/game-server-list/index",
            name: "GameServerList",
            meta: {
                title: "游戏服务器列表",
                roles: ["admin", "gameAdmin"]
            }
        },        
        {
            path: "/game/game-channel-list/index",
            name: "gameChannelList",
            meta: {
                title: "游戏渠道列表",
                roles: ["admin", "gameAdmin"]
            }
        },
        {
            path: "/game/notice-list/index",
            name: "NoticeList",
            meta: {
                title: "游戏公告列表",
                roles: ["admin", "gameAdmin","operations","service"]
            }
        },
        {
            path: "/game/channel-list/index",
            name: "ChannelList",
            meta: {
                title: "渠道配置列表",
                roles: ["admin", "gameAdmin"]
            }
        },        
        {
            path: "/game/zone-list/index",
            name: "GameZoneList",
            meta: {
                title: "游戏战区列表",
                roles: ["admin", "gameAdmin"]
            }
        },
        {
            path: "/game/crossServer-list/index",
            name: "GameCrossServerList",
            meta: {
                title: "游戏跨服列表",
                roles: ["admin", "gameAdmin"]
            }
        },
        {
            path: "/game/urlManage/index",
            name: "GameURLManage",
            meta: {
                title: "游戏URL管理",
                roles: ["admin", "gameAdmin"]
            }
        },
        {
            path: "/game/chatManage/index",
            name: "GameChatManage",
            meta: {
                title: "游戏聊天节点管理",
                roles: ["admin", "gameAdmin"]
            }
        },
        {
            path: "/game/whitelist/index",
            name: "GameWhitelist",
            meta: {
                title: "游戏白名单",
                roles: ["admin", "gameAdmin","operations","service"]
            }
        },
        {
            path: "/game/blacklist/index",
            name: "GameBlacklist",
            meta: {
                title: "游戏黑名单",
                roles: ["admin", "gameAdmin","operations","service"]
            }
        },
        {
            path: "/game/game-fold-list/index",
            name: "GameFoldList",
            meta: {
                title: "游戏折叠展示列表",
                roles: ["admin", "gameAdmin","operations","service"]
            }
        }
    ]
};