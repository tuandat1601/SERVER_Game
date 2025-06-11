
import { EBRouterRank } from "../../backend-enum";
import { RouteConfigsTable } from "./router-type";

let cur_rank = EBRouterRank.devOpsRouter;

export const devOpsRouter: RouteConfigsTable = {
    path: "/devOps",
    meta: {
        title: "游戏数据",
        icon: "optional",
        //icon:"icon-park:optional",
        rank: cur_rank
    },
    children: [
        {
            path: "/devOps/realtime-data/index",
            name: "realtime",
            meta: {
                title: "充值统计",
                roles: ["admin", "gameAdmin","operations","service","common"]
            }
        },
        {
            path: "/devOps/data-analysis/index",
            name: "dataAnalysis",
            meta: {
                title: "数据分析",
                roles: ["admin", "gameAdmin","operations","service","common"]
            }
        },
    ]
};