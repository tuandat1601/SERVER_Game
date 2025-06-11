import { gameRouter } from "./game-router";
import { permissionRouter } from "./permission-router";
import { userRouter } from "./user-router";
import { activateCodeRouter } from "./activateCode-router";
import { customerServiceRouter } from "./customerService-router";
import { devOpsRouter } from "./devOps-router";


export const router_all = [permissionRouter, gameRouter, userRouter,activateCodeRouter,customerServiceRouter,devOpsRouter]

