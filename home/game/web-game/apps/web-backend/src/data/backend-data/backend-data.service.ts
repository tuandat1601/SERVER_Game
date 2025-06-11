import { HttpService } from '@nestjs/axios';
import { Body, Injectable, Request } from '@nestjs/common';
import { webApiConstants } from 'apps/web-game/src/common/auth/constants';
import { GameConfigService } from 'apps/web-game/src/game-config/game-config.service';
import { GameCacheService } from 'apps/web-game/src/game-lib/gamecache/gamecache.service';
import { Logger } from 'apps/web-game/src/game-lib/log4js';
import MD5 from 'apps/web-game/src/game-lib/md5';
import { PrismaBackendDBService } from 'apps/web-game/src/game-lib/prisma/prisma.backend.service';
import { cTools } from 'apps/web-game/src/game-lib/tools';
import { lastValueFrom } from 'rxjs';
import { EBActType, EBOutCodeType, EBServerStatus, EBServerWorkload } from '../../backend-enum';
import { ChangeServerStatusDto, CreateServerDto } from '../../backend-system/games-mgr/dto/games-mgr.dto';
import { CodeEmailDto, DelCodeadminDto, OutCodeDto, UseCodeDto } from '../../backend-system/operations/dto/operations.dto';
import { CodeInfoEnance, GetCodeadminEnance } from '../../backend-system/operations/entities/operations.entity';
import { CHttpOptions } from '../../config/common.config';
import { BEGameInfoEntity, GameEntity } from '../../entity/game.entity';
import { ServerEntity } from '../../entity/server.entity';
import { UserEntity } from '../../entity/user.entity';
import * as xlsx from 'xlsx';
import { CreateServerResult } from '../../result/result';
import { cloneDeep } from 'lodash';
import { languageConfig } from '../../config/language/language';
import { PrismaGameDBService } from 'apps/web-game/src/game-lib/prisma/prisma.gamedb.service';

const SAVE_TIME = 60 * 60;
const def_timeout = 60; //60 秒的 防御缓存穿透

let BE_SKU = process.env.BE_SKU;

//redis集中到期
export function getRandomSaveTime() {
    return SAVE_TIME + Math.floor(Math.random() * 5 * 60);
}

//待处理 redis key 表格化
export function rKey_User_Data(user: UserEntity) {
    //return roleKeyDto.id + '_role_' + roleKeyDto.serverid;
    return `${BE_SKU}_${user.username}_user`;
}

export function rKey_User_JWT(user: UserEntity) {
    //return roleKeyDto.id + '_role_' + roleKeyDto.serverid;
    return `${BE_SKU}_${user.username}_user_jwt`;
}

export function rKey_serverloginkey(gameid: number, changeRemark: string, channelUserId: string) {
    //return roleKeyDto.id + '_role_' + roleKeyDto.serverid;
    return `${BE_SKU}_${gameid + changeRemark + channelUserId}_loginkey`;
}

@Injectable()
export class BackendDataService {

    /**自动开服的游戏集合 */
    private autoOpenGInfo: Record<number, BEGameInfoEntity>;
    private autoOpenServerNum: Record<number, number>
    constructor(
        private readonly gameCacheService: GameCacheService,
        private readonly prismaBackendDB: PrismaBackendDBService,
        private readonly gameConfigService: GameConfigService,
        private readonly httpService: HttpService
    ) {
        this.autoOpenGInfo = {}
        this.autoOpenServerNum = {}
    }

    getPrismaBackendDB() {
        return this.prismaBackendDB;
    }

    getGameCacheService() {
        return this.gameCacheService;
    }

    getGameConfigService() {
        return this.gameConfigService;
    }

    getHttpServiceService() {
        return this.httpService;
    }

    createPrismaGameDBService(dbUrl: string) {

        if (!dbUrl) {
            return;
        }

        const prismaGameDBService: PrismaGameDBService = new PrismaGameDBService({
            datasources: {
                db: {
                    url: dbUrl,
                },
            },
        });

        return prismaGameDBService;
    }

    async initBackendData() {

        this.autoOpenGInfo = {};
        this.autoOpenServerNum = {};
        let ret = await this.prismaBackendDB.games.findMany();
        for (let index = 0; index < ret.length; index++) {
            const element = ret[index];
            if (!element.info) { continue; }
            let curInfo = <BEGameInfoEntity><unknown>element.info;
            if (curInfo.autoOpenModel) {
                this.autoOpenGInfo[element.id] = curInfo;
            }
        }

        console.log("initBackendData");
        console.log("autoOpenGInfo:", this.autoOpenGInfo);
    }

    getAutoOpenGInfo() {
        return this.autoOpenGInfo;
    }

    async updateAutoOpenSeverNum(gameId: number) {

        let serverids = await this.prismaBackendDB.servers.findMany(
            {
                where: {
                    gameId: gameId,
                },
                orderBy: { serverId: "desc" },
                take: 1
            }
        )

        if (serverids.length == 0) {
            return;
        }

        let cur_serverInfo = <ServerEntity><unknown>serverids[serverids.length - 1];

        let cur_serverUser_num = await this.prismaBackendDB.loginServerLog.count(
            {
                where: {
                    gameId: gameId,
                    serverId: cur_serverInfo.serverId
                }
            }
        )

        return cur_serverUser_num;
    }

    async autoOpenServer(gameId: number) {
        let serverids = await this.prismaBackendDB.servers.findMany(
            {
                where: {
                    gameId: gameId,
                    status: EBServerStatus.Open
                },
                orderBy: { serverId: "desc" },
                take: 1
            }
        )

        if (serverids.length == 0) {
            return;
        }

        let cur_serverInfo = <ServerEntity><unknown>serverids[serverids.length - 1];

        let createServerDto: CreateServerDto = {
            gameId: cur_serverInfo.gameId,
            zoneId: cur_serverInfo.zoneId,
            serverId: cur_serverInfo.serverId + 1,
            chatIP: cur_serverInfo.chatIP,
            channels: cur_serverInfo.channels,
            gameUrl: cur_serverInfo.gameUrl,
            status: EBServerStatus.WaitOpen,
            workload: EBServerWorkload.Smooth,
            isNew: 1,
            openTime: cTools.newLocalDateString()
        }

        let ret = await this.createServer({}, createServerDto);
        console.log("autoOpenServer ret:", ret)
        if (ret.success) {

        }
    }

    /**
     * 检测自动开服
     * @returns 
     */
    async checkAutoOpenServer() {
        let gameInfo = this.autoOpenGInfo;

        if (!gameInfo || Object.keys(gameInfo).length == 0) {
            return;
        }

        for (const gameId in gameInfo) {
            if (Object.prototype.hasOwnProperty.call(gameInfo, gameId)) {
                let cur_gameInfo = gameInfo[gameId];
                if (!cur_gameInfo.autoOpenModel) { continue; }

                if (!cTools.checkActTime(cur_gameInfo.autoTime)) { continue; }

                this.autoOpenServerNum[gameId] = await this.updateAutoOpenSeverNum(Number(gameId));

                if (this.autoOpenServerNum[gameId] < cur_gameInfo.autoVal) { continue; }

                //开服
                await this.autoOpenServer(Number(gameId));
            }
        }

    }


    async createServer(@Request() req: any, @Body() createServerDto: CreateServerDto) {
        let createServerResult = new CreateServerResult();

        let prismaBackendDB = this.getPrismaBackendDB();

        let old_ret = await prismaBackendDB.servers.findFirst(
            {
                where: {
                    gameId: createServerDto.gameId,
                    serverId: createServerDto.serverId
                }
            }
        )

        if (old_ret) {
            createServerResult.msg = "该游戏服务器已存在";
            return createServerResult
        }

        //通知游戏服验证
        let openTime_str = String(new Date(createServerDto.openTime).getTime());
        let createServerDto1 = Object.assign({}, cloneDeep(createServerDto), {
            openTime: openTime_str
        })
        createServerDto1.time = new Date().getTime();
        let sgin = `${createServerDto1.gameId}${createServerDto1.serverId}${createServerDto1.openTime}${createServerDto1.status}${webApiConstants.secret}${createServerDto1.time}`;
        let sgin_md5 = new MD5().hex_md5(sgin).toLowerCase();
        createServerDto1.key = sgin_md5;
        let url = createServerDto.gameUrl + "/game-common/createServer";
        let ret_pos = await this.sendHttpPost(url, createServerDto1)

        if (!ret_pos.data.ok) {
            createServerResult.msg = ret_pos.data.msg || "游戏服创建失败";
            return createServerResult
        }

        let cur_time = cTools.newLocalDateString();

        let save_obj = Object.assign({}, createServerDto, {
            channels: <any>createServerDto.channels,
            openTime: cTools.newTransformToUTC8Date(Number(openTime_str)),
        })


        let new_ret = await prismaBackendDB.servers.create(
            {
                data: save_obj
            }
        )

        if (new_ret) {
            createServerResult.data = Object.assign({}, createServerDto, {
                openTime: cTools.newLocalDateString(new Date(Number(openTime_str))),
                createdAt: cur_time,
                updatedAt: cur_time
            })
            languageConfig.setSuccess(EBActType.CreateServer, createServerResult);
        }

        return createServerResult;
    }


    /**
     * 获取用户数据
     * @param userEntity 用户参数
     * @param isFDB 是否从数据库里拉取
     * @returns 
     */
    async getUserData(userEntity: UserEntity, isFDB: boolean = false) {

        if (!userEntity || !userEntity.username) { return }

        let user_info: UserEntity = await this.gameCacheService.getJSON(rKey_User_Data(userEntity));
        if (!user_info && isFDB) {
            let user_db = await this.prismaBackendDB.user.findUnique(
                {
                    where: {
                        username: userEntity.username
                    }
                }
            )

            if (!user_db) { return; }

            user_info = Object.assign(
                user_db, {
                roles: <any>user_db.roles,
                auths: <any>user_db.auths,
                info: <any>user_db.info,
                createdAt: cTools.newLocalDateString(user_db.createdAt),
                updatedAt: undefined,
            })

            await this.updateUserData(user_info);
        }
        return user_info;
    }

    /**
     * 用户数据保存到内存
     * @param userEntity 
     * @returns 
     */
    async updateUserData(userEntity: UserEntity) {

        if (!userEntity || !userEntity.username) { return }

        await this.gameCacheService.setJSON(rKey_User_Data(userEntity), userEntity);
    }

    /**
     * 用户数据保存到数据库
     * @param userEntity 
     * @returns 
     */
    async createUserData(userEntity: UserEntity) {

        if (!userEntity || !userEntity.username) { return }

        let ret = await this.prismaBackendDB.user.create(
            {
                data: {
                    username: userEntity.username,
                    nickname: userEntity.nickname,
                    password: userEntity.password,
                    roles: userEntity.roles,
                    auths: userEntity.auths,
                    info: <any>userEntity.info,
                    status: userEntity.status,
                    createdAt: cTools.newSaveLocalDate(new Date(userEntity.createdAt)),
                    updatedAt: cTools.newSaveLocalDate(),
                }
            }
        )

        if (!ret) {
            console.error("createUserData is error");
        }
        else {
            await this.updateUserData(userEntity);
        }

    }

    /**
     * 用户数据保存到数据库
     * @param userEntity 
     * @returns 
     */
    async saveUserData(userEntity: UserEntity) {

        if (!userEntity || !userEntity.username) { return }

        let user_data: UserEntity = await this.gameCacheService.getJSON(rKey_User_Data(userEntity));

        if (!user_data || !user_data.username) { return }

        let ret = await this.prismaBackendDB.user.update(
            {
                where: {
                    username: user_data.username
                },
                data: Object.assign({}, user_data, {
                    info: <any>user_data.info,
                    createdAt: cTools.newSaveLocalDate(new Date(user_data.createdAt)),
                    updatedAt: cTools.newSaveLocalDate(),
                })
            }
        )

        if (!ret) {
            console.error("saveUserData is error");
        }

    }

    async deleteUserData(userEntity: UserEntity) {
        if (!userEntity || !userEntity.username) { return }
        await this.gameCacheService.del(rKey_User_Data(userEntity));
        let ret = await this.prismaBackendDB.user.delete(
            {
                where: {
                    username: userEntity.username
                }
            }
        )
        if (!ret) {
            console.error("deleteUserData is error");
        }
    }

    /**
     * 激活码配置-数据保存到数据库
     * @param codeInfoEnance 
     * @returns 
     */
    async addCodeInfoData(codeInfoEnance: CodeInfoEnance) {

        if (!codeInfoEnance) { return }

        let ret = await this.prismaBackendDB.game_code_info.create(
            {
                data: {
                    gameId: codeInfoEnance.gameid,
                    codeName: codeInfoEnance.codename,
                    emailId: codeInfoEnance.emailid,
                    len: codeInfoEnance.len,
                    universal: codeInfoEnance.universal,
                    repe: codeInfoEnance.repe,
                    isuse: codeInfoEnance.isuse,
                    endTime: cTools.newSaveLocalDate(new Date(codeInfoEnance.endtime)), //
                    createdAt: cTools.newSaveLocalDate(),
                    updatedAt: cTools.newSaveLocalDate(),
                    // game_code_used    game_code_used[]
                    // game_comcode_used game_comcode_used[]
                }
            }
        )

        if (!ret) {
            console.error("addCodeInfoData is error");
        }
        return ret;
    }

    /**
     * 激活码配置-数据更新到数据库
     * @param codeInfoEnance 
     * @returns 
     */
    async updateCodeInfoData(codeInfoEnance: CodeInfoEnance) {

        if (!codeInfoEnance) { return }

        let ret = await this.prismaBackendDB.game_code_info.update(
            {
                where: {
                    id: codeInfoEnance.id
                },
                data: {
                    gameId: codeInfoEnance.gameid,
                    codeName: codeInfoEnance.codename,
                    emailId: codeInfoEnance.emailid,
                    len: codeInfoEnance.len,
                    universal: codeInfoEnance.universal,
                    repe: codeInfoEnance.repe,
                    isuse: codeInfoEnance.isuse,
                    endTime: cTools.newSaveLocalDate(new Date(codeInfoEnance.endtime)), //
                    // createdAt: cTools.newSaveLocalDate(),
                    updatedAt: cTools.newSaveLocalDate(),
                    // game_code_used    game_code_used[]
                    // game_comcode_used game_comcode_used[]
                }
            }
        )

        if (!ret) {
            console.error("addCodeInfoData is error");
        }
        return ret;
    }

    /**
     * 激活码配置-删除数据
     * @param codeInfoEnance 
     * @returns 
     */
    async delcodeadminData(delCodeadminDto: DelCodeadminDto) {

        //------------------
        await this.prismaBackendDB.game_code_used.deleteMany({
            where: {
                codeinfoId: delCodeadminDto.id,
            }
        })
        await this.prismaBackendDB.game_comcode_used.deleteMany({
            where: {
                codeinfoId: delCodeadminDto.id,
            }
        })
        //------------------
        let ret = await this.prismaBackendDB.game_code_info.delete({
            where: {
                id: delCodeadminDto.id,
            }
        })

        if (!ret) {
            console.error("delcodeadminData is error");
        }
        return ret;
    }

    /**
     * 激活码配置-获取数据
     * @param codeInfoEnance 
     * @returns 
     */
    async getCodeInfoData(getCodeadminEnance: GetCodeadminEnance) {
        let whereCondition = {};
        if (getCodeadminEnance.gameid) {
            whereCondition = {
                gameId: getCodeadminEnance.gameid
            };
        }
        let ret = await this.prismaBackendDB.game_code_info.findMany({
            where: whereCondition
        })

        if (!ret) {
            console.error("getCodeInfoData is error");
        }
        return ret;
    }


    async getEmailId(data: any) {
        let whereCondition = {
            gameId: data.gameid,
            game_code_used: {
                some: {
                    code: data.code,
                }
            }
        };

        let ret = await this.prismaBackendDB.game_code_info.findFirst({
            where: whereCondition,

        })

        // if (!ret) {
        //     console.error("getEmailId is error");
        // }
        return ret;
    }
    async checkCodeData(data: any) {
        let whereCondition = {
            code: data.code,
            used: data.used,
        };

        let ret = await this.prismaBackendDB.game_code_used.findFirst({
            where: whereCondition,

        })

        // if (!ret) {
        //     console.error("checkCodeData is error");
        // }
        return ret;
    }

    async updataCodeData(data: any) {

        let ret = await this.prismaBackendDB.game_code_used.updateMany({
            where: {
                code: data.code,
            },
            data: {
                used: data.used,
                roleId: data.roleId,
            },
        })

        if (!ret) {
            console.error("updataCodeData is error");
        }
        return ret;
    }

    /**
    * 激活码-获取数据
    * @param codeInfoEnance 
    * @returns 
    */
    async getCodeUsedData(outCodeDto: OutCodeDto) {
        let whereUsed = [];
        if (outCodeDto.type == EBOutCodeType.All) {
            whereUsed = [EBOutCodeType.Unused, EBOutCodeType.Used, EBOutCodeType.Com]
        } else {
            whereUsed = [outCodeDto.type]
        }
        let page = outCodeDto.page || 1;
        let pageSize = outCodeDto.pagesize || 100;
        let whereCondition = {
            codeinfoId: outCodeDto.cinfoid,
            gameId: outCodeDto.gameid,
            used: {
                in: whereUsed,
            }
        };

        let ret = await this.prismaBackendDB.game_code_used.findMany({
            where: whereCondition,
            skip: (page - 1) * pageSize,
            take: pageSize,
        })
        if (!ret) {
            console.error("getCodeInfoData is error");
        }
        // let count = await this.prismaBackendDB.game_code_used.count({
        //     where: whereCondition,
        // })
        let data = {
            ret: ret,
            count: ret.length   //count
        }
        return data;
    }
    /**
    * 激活码-获取全部数据
    * @param codeInfoEnance 
    * @returns 
    */
    async getAllCodeUsedData(outCodeDto: OutCodeDto) {
        let whereUsed = [];
        if (outCodeDto.type == EBOutCodeType.All) {
            whereUsed = [EBOutCodeType.Unused, EBOutCodeType.Used, EBOutCodeType.Com]
        } else {
            whereUsed = [outCodeDto.type]
        }
        let whereCondition = {
            gameId: outCodeDto.gameid,
            used: {
                in: whereUsed,
            }
        };

        let ret = await this.prismaBackendDB.game_code_used.findMany({
            where: whereCondition,
        })
        if (!ret) {
            console.error("getCodeInfoData is error");
        }
        return ret;
    }
    async getComCodeUsedData(outCodeDto: OutCodeDto) {

        let whereCondition = {
            // codeinfo: {
            //     gameId: outCodeDto.gameid,
            // },
            gameId: outCodeDto.gameid,
        };
        let ret = await this.prismaBackendDB.game_comcode_used.findMany({
            where: whereCondition
        })

        if (!ret) {
            console.error("getComCodeUsedData is error");
        }
        return ret;
    }
    /**
     * 创建游戏表
     * @param game 
     * @returns 
     */
    async createGame(game: GameEntity) {
        let ret = await this.prismaBackendDB.games.create(
            {
                data: {
                    name: game.name,
                    secretkey: game.secretkey,
                    sku: game.sku,
                    serverNF: game.serverNF,
                    gameUrl: <any>game.gameUrl,
                    channels: <any>game.channels,
                    whitelist: <any>game.whitelist,
                    blacklist: <any>game.blacklist,
                    info: <any>game.info,
                    createdAt: cTools.newLocalDateString(new Date(game.createdAt))
                }
            }
        )


        if (!ret) {
            console.error("createGame is error");
        }
        return ret;
    }

    /**
     * 获取单个游戏表
     * @param gameid 
     * @returns 
     */
    async getGameDataById(gameid: number) {

        let ret = await this.prismaBackendDB.games.findUnique(
            {
                where: {
                    id: gameid
                }
            }
        )

        if (!ret) {
            //console.error("findUnique is error");
        }

        return ret;
    }

    /**
     * 获取单个游戏表
     * @param gameid 
     * @returns 
     */
    async getGameDataBySku(sku: string) {

        let ret = await this.prismaBackendDB.games.findFirst(
            {
                where: {
                    sku: sku
                }
            }
        )

        if (!ret) {
            //console.error("getGameDataBySku is error");
        }

        return ret;
    }


    /**
     * 获取游戏列表
     */
    async getGamesList() {
        let ret = await this.prismaBackendDB.games.findMany();
        return ret;
    }

    setAutoOpenGame(game: GameEntity) {
        if (!this.autoOpenGInfo) {
            this.autoOpenGInfo = {}
            this.autoOpenServerNum = {}
        }

        if (!game.info) {
            delete this.autoOpenGInfo[game.id];
            delete this.autoOpenServerNum[game.id];
            return
        }


        let autoOpenGInfo: BEGameInfoEntity = game.info;
        if (!autoOpenGInfo.autoOpenModel) {
            delete this.autoOpenGInfo[game.id];
            delete this.autoOpenServerNum[game.id];
            return
        }

        this.autoOpenGInfo[game.id] = game.info;

        console.log("setAutoOpenGame this.autoOpenGInfo:", this.autoOpenGInfo);
    }

    async updateGame(game: GameEntity) {

        this.setAutoOpenGame(game);

        let ret = await this.prismaBackendDB.games.update(
            {
                where: {
                    id: game.id
                },
                data: {
                    name: game.name ? game.name : undefined,
                    secretkey: game.secretkey ? game.secretkey : undefined,
                    sku: game.sku ? game.sku : undefined,
                    serverNF: game.serverNF ? game.serverNF : undefined,
                    gameUrl: game.gameUrl ? <any>game.gameUrl : undefined,
                    channels: game.channels ? <any>game.channels : undefined,
                    whitelist: game.whitelist ? <any>game.whitelist : undefined,
                    blacklist: game.blacklist ? <any>game.blacklist : undefined,
                    info: game.info ? <any>game.info : undefined,
                }
            }
        );
        return ret;
    }

    async deleteGame(game: GameEntity) {

        let ret = await this.prismaBackendDB.games.delete(
            {
                where: {
                    id: game.id
                }
            }
        );
        return ret;
    }

    /**
     * 激活码-数据保存到数据库
     * @param datacode 
     * @returns 
     */
    async saveCodeUsedData(datacode: any[]) {

        if (!datacode) { return }

        let ret = await this.prismaBackendDB.game_code_used.createMany(
            {
                data: datacode,
            }
        )

        if (!ret) {
            console.error("saveCodeUsedData is error");
        }
        return ret;
    }

    async saveComCodeUsedData(datacode: any[]) {

        if (!datacode) { return }

        let ret = await this.prismaBackendDB.game_comcode_used.createMany(
            {
                data: datacode,
            }
        )

        if (!ret) {
            console.error("saveCodeUsedData is error");
        }
        return ret;
    }

    async getCodeLength(id: number) {

        if (!id) { return }
        let ret = await this.prismaBackendDB.game_code_info.findUnique(
            {
                where: {
                    id: id,
                }
            }
        )

        if (!ret) {
            //console.error("getCodeLength is error");
        }
        return ret;
    }

    async addCodeEmailData(codeEmailDto: CodeEmailDto) {

        if (!codeEmailDto) { return }
        let ret = await this.prismaBackendDB.code_email_award.create(
            {
                data: {
                    serverId: codeEmailDto.serverid,
                    gameId: codeEmailDto.gameid,
                    title: codeEmailDto.title,
                    content: codeEmailDto.content,
                    items: codeEmailDto.items,
                }
            }
        )
        if (!ret) {
            console.error("getCodeLength is error");
        }
        return ret;
    }

    async getunCodeEmailData(id: number) {
        if (!id) { return }
        let ret = await this.prismaBackendDB.code_email_award.findUnique(
            {
                where: {
                    id: id,
                }
            }
        )
        if (!ret) {
            //console.error("getunCodeEmailData is error");
        }
        return ret;
    }

    async sendHttpPost(url: string, data: any, cHttpOptions: any = CHttpOptions) {

        if (cTools.getTestModel()) {
            Logger.log("sendHttpPost url:", url)
            Logger.log("sendHttpPost data:", data)
        }

        try {
            const ret_data = await lastValueFrom(
                this.httpService.post(url, data, cHttpOptions)
            );

            if (cTools.getTestModel()) {
                Logger.log("sendHttpPost url:", url)
                Logger.log("sendHttpPost ret_data.data:", ret_data.data)
            }
            //Logger.log("sendHttpPost:", ret_data.data)
            return ret_data.data;

        } catch (error) {
            Logger.error("sendHttpPost error:", error.message);
            let error_ret = { data: { ok: false, msg: "sendHttpPost error" } }
            error_ret.data.msg = error.message || "sendHttpPost error";
            return error_ret
        }
    }


    async checkServerIsOpen(gameid: number) {

        //有多少满足条件的待开服
        let waitOpen_server = await this.prismaBackendDB.servers.findMany(
            {
                where: {
                    gameId: gameid,
                    status: EBServerStatus.WaitOpen,
                    openTime: {
                        lte: cTools.newTransformToUTC8Date()
                    }
                }
            }
        )



        //把时间已到的待开服修改为开启状态
        let update = await this.prismaBackendDB.servers.updateMany(
            {
                where: {
                    gameId: gameid,
                    status: EBServerStatus.WaitOpen,
                    openTime: {
                        lte: cTools.newTransformToUTC8Date()
                    }
                },
                data: {
                    status: EBServerStatus.Open
                }
            }
        )

        //通知游戏服
        if (waitOpen_server.length > 0 && update.count > 0) {

            let serverId_ary = [];
            let gameUrls = {}
            for (let index = 0; index < waitOpen_server.length; index++) {
                const element = waitOpen_server[index];
                serverId_ary.push(element.serverId);
                if (!gameUrls[element.gameUrl]) {
                    gameUrls[element.gameUrl] = true
                }
            }

            //通知游戏服验证
            let changeServerStatusDto: ChangeServerStatusDto = {
                gameId: gameid,
                status: EBServerStatus.Open,
                serverId: serverId_ary
            }
            changeServerStatusDto.time = new Date().getTime();
            let sgin = `${changeServerStatusDto.gameId}${changeServerStatusDto.serverId}${webApiConstants.secret}${changeServerStatusDto.status}${changeServerStatusDto.time}`;
            let sgin_md5 = new MD5().hex_md5(sgin).toLowerCase();
            changeServerStatusDto.key = sgin_md5;


            for (const key in gameUrls) {
                if (Object.prototype.hasOwnProperty.call(gameUrls, key)) {
                    let cur_gameUrl = key;
                    let url = cur_gameUrl + "/game-common/changeServerStatus";
                    let ret_pos = await this.sendHttpPost(url, changeServerStatusDto);
                }
            }
        }

    }

    getBEMainServerId(server: any, originServerid: number) {

        if (!server || !server.info || !server.info.mainsId) {
            return originServerid;
        }

        let serverEntity: ServerEntity = <unknown>server;
        if (serverEntity.info && serverEntity.info.mainsId) {
            return serverEntity.info.mainsId;
        }

        return originServerid;
    }

    getShopData(shopid: number, sku: string) {
        let load_path = "apps/web-backend/src/config/game-shop/" + sku + "/Shop.xlsx";
        // let load_path1 = "../../config/game-shop/" + "HY_CS_1" + "/Shop.json";
        // let Json_Shop1 = await import("./apps/web-backend/src/config/game-shop/" + "HY_CS_1" + "/Shop.json");
        // 读取Excel文件
        const workbook = xlsx.readFile(load_path);

        // 获取第一个工作表
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const Json_Shop = xlsx.utils.sheet_to_json(worksheet, {
            header: ["id", "name", "showtype", "paytype", "price", "cost", "free", "adverts", "timelimit",
                "dailylimit", "alwayslimit", "double", "drop", "exp", "addstatus", "systemid", "coststatus",
                "hidetime", "hidebuynum", "enable", "showPrice", "diyshop"], range: 5
        });

        let shop_info: any;

        for (let index = 0; index < Json_Shop.length; index++) {
            const element = <any>Json_Shop[index];
            if (element.id != undefined && Number(element.id) === shopid) {
                shop_info = element;
                break;
            }
        }

        return shop_info;
    }

    getDiyShopData(shopid: number, sku: string) {
        let load_path = "apps/web-backend/src/config/game-shop/" + sku + "/DiyShop.xlsx";
        // 读取Excel文件
        const workbook = xlsx.readFile(load_path);

        // 获取第一个工作表
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const Json_Shop = xlsx.utils.sheet_to_json(worksheet, {
            header: ["id", "name", "num", "items"], range: 5
        });

        let shop_info: any;

        for (let index = 0; index < Json_Shop.length; index++) {
            const element = <any>Json_Shop[index];
            if (element.id != undefined && Number(element.id) === shopid) {
                shop_info = element;
                break;
            }
        }

        return shop_info;
    }
}


