
import { EBRouterRank } from "../../backend-enum";
import { RouteConfigsTable } from "./router-type";

let cur_rank = EBRouterRank.activateCodeRouter;

export const activateCodeRouter: RouteConfigsTable = {
    path: "/activateCode",
    meta: {
        title: "激活码管理",
        icon: "activity-source",
        //icon:"icon-park:activity-source",
        rank: cur_rank
    },
    children: [
        {
            path: "/activateCode/activateCode-Email/index",
            name: "activateEmail",
            meta: {
                title: "激活码邮件",
                roles: ["admin", "gameAdmin"]
            }
        },
        {
            path: "/activateCode/activateCode-list/index",
            name: "activateCodeList",
            meta: {
                title: "激活码管理",
                roles: ["admin", "gameAdmin"]
            }
        },
        {
            path: "/activateCode/activateCode-use/index",
            name: "activateCodeListUse",
            meta: {
                title: "激活码查询",
                roles: ["admin", "gameAdmin","service"]
            }
        },
        {
            path: "/activateCode/activateCode-common-use/index",
            name: "activateComCodeList",
            meta: {
                title: "激活码使用",
                roles: ["admin", "gameAdmin"]
            }
        }
        
    ]
};