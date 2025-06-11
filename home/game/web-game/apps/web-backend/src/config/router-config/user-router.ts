import { EBRouterRank } from "../../backend-enum";


export const userRouter = {
    path: "/system",
    meta: {
        title: "系统管理",
        icon: "setting",
        rank: EBRouterRank.userRouter
    },
    children: [
        {
            path: "/system/user/index",
            name: "UserLisr",
            meta: {
                title: "用户管理",
                icon: "flUser",
                roles: ["admin"],
                showParent: true
            }
        },{
            path: "/system/role/index",
            name: "Role",
            meta: {
                title: "角色管理",
                icon: "role",
                roles: ["admin"],
                showParent: true
            }
        }
    ]
};