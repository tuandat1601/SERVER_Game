import { EBRouterRank } from "../../backend-enum";


export const permissionRouter = {
    path: "/permission",
    meta: {
        title: "权限管理",
        icon: "lollipop",
        rank: EBRouterRank.permissionRouter
    },
    children: [
        {
            path: "/permission/page/index",
            name: "PermissionPage",
            meta: {
                title: "页面权限",
                roles: ["admin", "common"]
            }
        },
        {
            path: "/permission/button/index",
            name: "PermissionButton",
            meta: {
                title: "按钮权限",
                roles: ["admin", "common"],
                auths: ["btn_add", "btn_edit", "btn_delete"]
            }
        }
    ]
};