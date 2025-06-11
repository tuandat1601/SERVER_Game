
import { EBRouterRank } from "../../backend-enum";
import { RouteConfigsTable } from "./router-type";

let cur_rank = EBRouterRank.customerServiceRouter;

export const customerServiceRouter: RouteConfigsTable = {
    path: "/customerService",
    meta: {
        title: "客服管理",
        icon: "customer",
        //icon:"icon-park:customer",
        rank: cur_rank
    },
    children: [
        {
            path: "/customerService/mail/index",
            name: "mail",
            meta: {
                title: "邮件",
                roles: ["admin", "gameAdmin","operations","service"]
            }
        },
        {
            path: "/customerService/recharge/index",
            name: "recharge",
            meta: {
                title: "充值订单",
                roles: ["admin", "gameAdmin","operations"]
            }
        },
        {
            path: "/customerService/sendRechargeShop/index",
            name: "sendRechargeShop",
            meta: {
                title: "发充值",
                roles: ["admin", "gameAdmin","operations"]
            }
        },
        {
            path: "/customerService/reward/index",
            name: "reward",
            meta: {
                title: "聊天日志",
                roles: ["admin", "gameAdmin","operations"]
            }
        },
        {
            path: "/customerService/goods/index",
            name: "goods",
            meta: {
                title: "玩家状态",
                roles: ["admin", "gameAdmin","operations","service"]
            }
        }
    ]
};