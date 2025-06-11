import { Injectable } from "@nestjs/common";
import { MergeServerDto } from "apps/web-backend/src/backend-system/games-mgr/dto/games-mgr.dto";
import { gameConst } from "../config/game-const";
import { EActType } from "../config/game-enum";
import { languageConfig } from "../config/language/language";
import { Logger } from "../game-lib/log4js";
import { cTools } from "../game-lib/tools";
import { cGameServer } from "../game-system/game-server";
import { REMsg } from "./entity/msg.entity";
import { ServerSubInfoEntity } from "./entity/server-info.entity";
import { GameDataService, getServerADRankKey, getServerArenaRankKey, getServerERankKey, getServerInfoKey, getServerLRankKey } from "./gamedata.service";

@Injectable()
export class GameMergeService {

    constructor(
        private readonly gameDataService: GameDataService,
    ) {

    }

    /**
     * 合服处理
     * @param mergeServerDto 
     * @returns 
     */
    async mergeServer(mergeServerDto: MergeServerDto) {

        //方案1
        //关闭登陆和数据库节点

        //方案2 以后优化
        //合服开始后 先执行 关服逻辑
        //关服逻辑 停止玩家操作 保存玩家数据 保存全服数据 
        //合服结束后 初始化服务器
        let retMsg = new REMsg();

        let targetServerId = mergeServerDto.targetId;
        let sourceServerId = mergeServerDto.sourceId;
        let all_serverids = sourceServerId.concat([targetServerId]);

        //await this.gameDataService.onDestroy(all_serverids);

        let prismaGameDB = this.gameDataService.getPrismaGameDB();

        //目标服务器处理
        //修改重置信息
        let target_serverInfo = await prismaGameDB.serverInfo.findFirst({
            where: {
                serverid: targetServerId
            }
        });

        if (!target_serverInfo) {
            retMsg.msg = "target_serverInfo is null";
            return retMsg;
        }

        let t_serverInfoEntity = <ServerSubInfoEntity><unknown>target_serverInfo.info;
        t_serverInfoEntity.mergeTime = cTools.newLocalDateString();
        t_serverInfoEntity.mergeNum = t_serverInfoEntity.mergeNum || 0;
        t_serverInfoEntity.mergeNum += 1;
        t_serverInfoEntity.mergeServer = t_serverInfoEntity.mergeServer || [];
        t_serverInfoEntity.mergeServer = t_serverInfoEntity.mergeServer.concat(sourceServerId);

        //重置 夺宝大作战
        delete t_serverInfoEntity.pirateShip;
        //重置 竞技场
        delete t_serverInfoEntity.arenaData;
        delete t_serverInfoEntity.WrestleData;
        cGameServer.checkOpenNewSystem(t_serverInfoEntity);

        //保存
        await prismaGameDB.serverInfo.update({
            where: {
                id: target_serverInfo.id
            },
            data: {
                info: <any>t_serverInfoEntity,
                updatedAt: cTools.newSaveLocalDate(),
            }
        });



        //删除
        Logger.log("mergeServer all_serverids:");
        Logger.log(all_serverids);
        await prismaGameDB.arenaLog.deleteMany(
            {
                where: {
                    serverid: {
                        in: all_serverids
                    }
                }
            }
        )

        await prismaGameDB.arenaRank.deleteMany(
            {
                where: {
                    serverid: {
                        in: all_serverids
                    }
                }
            }
        )

        await prismaGameDB.gameRank.deleteMany(
            {
                where: {
                    serverid: {
                        in: all_serverids
                    }
                }
            }
        )

        await prismaGameDB.serverInfo.deleteMany(
            {
                where: {
                    serverid: {
                        in: sourceServerId
                    }
                }
            }
        )

        await prismaGameDB.chatLog.deleteMany(
            {
                where: {
                    serverid: {
                        in: sourceServerId
                    }
                }
            }
        )

        //修改
        await prismaGameDB.crossArenaLog.updateMany(
            {
                where: {
                    serverid: {
                        in: sourceServerId
                    }
                },
                data: {
                    serverid: targetServerId,
                    crossServerid: mergeServerDto.targetCrossId
                }
            }
        )

        await prismaGameDB.email.updateMany(
            {
                where: {
                    serverid: {
                        in: sourceServerId
                    },
                    owner: {
                        not: gameConst.email_globalTag
                    }
                },
                data: {
                    serverid: targetServerId
                }
            }
        )

        //角色信息特殊处理 一服一个角色 合服后一个账号也要通过不同服务器ID 找不同的角色登录
        await prismaGameDB.roleInfo.updateMany(
            {
                where: {
                    serverid: {
                        in: sourceServerId
                    }
                },
                data: {
                    serverid: targetServerId,
                    merge: 1
                }

            }
        )

        await prismaGameDB.roleInfo.updateMany(
            {
                where: {
                    serverid: {
                        in: targetServerId
                    }
                },
                data: {
                    merge: 1
                }

            }
        )

        await prismaGameDB.role.updateMany(
            {
                where: {
                    serverid: {
                        in: sourceServerId
                    }
                },
                data: {
                    serverid: targetServerId
                }

            }
        )

        await prismaGameDB.roleEquip.updateMany(
            {
                where: {
                    serverid: {
                        in: sourceServerId
                    }
                },
                data: {
                    serverid: targetServerId
                }

            }
        )

        await prismaGameDB.roleHero.updateMany(
            {
                where: {
                    serverid: {
                        in: sourceServerId
                    }
                },
                data: {
                    serverid: targetServerId
                }

            }
        )

        await prismaGameDB.roleItem.updateMany(
            {
                where: {
                    serverid: {
                        in: sourceServerId
                    }
                },
                data: {
                    serverid: targetServerId
                }

            }
        )

        await prismaGameDB.crossArenaLog.updateMany(
            {
                where: {
                    serverid: {
                        in: sourceServerId
                    }
                },
                data: {
                    serverid: targetServerId
                }
            }
        )

        //公会
        await prismaGameDB.guild.updateMany(
            {
                where: {
                    serverid: {
                        in: sourceServerId
                    }
                },
                data: {
                    serverid: targetServerId,
                    crossServerid: mergeServerDto.targetCrossId
                }
            }
        )


        //重置合服信息
        //await this.gameDataService.initMergeServerInfo();
        //await this.gameDataService.initServerInfo([targetServerId]);
        languageConfig.setActTypeSuccess(EActType.BE_MERGE_SERVER, retMsg);
        return retMsg;
    }
}