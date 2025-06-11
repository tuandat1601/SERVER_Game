import { HttpService } from '@nestjs/axios';
import { Body, Injectable } from '@nestjs/common';
import { PrismaBackendDBService } from 'apps/web-game/src/game-lib/prisma/prisma.backend.service';
import { cTools } from 'apps/web-game/src/game-lib/tools';
import { cloneDeep } from 'lodash';
import { map } from 'rxjs';
import { EBActType, EBCodeUniversal, EBOutCodeType } from '../../backend-enum';
import { languageConfig } from '../../config/language/language';
import { BackendDataService } from '../../data/backend-data/backend-data.service';
import { BEServerInfoEntity } from '../../entity/server.entity';
import { CodeAdminResult, GameDate2Result, GameDateEntity, GameDateResult, GenCodeResult, OutCodeResult } from '../../result/result';
import { BESendEmailDto } from '../games-mgr/dto/games-mgr.dto';
import { GamesMgrService } from '../games-mgr/games-mgr.service';
import { BEGameData2Type, CodeEmailDto, CodeInfoDto, DelCodeadminDto, DelCodeEmailDto, GameData2Dto, GameDataDto, GenCodeDto, GenComCodeDto, GetCodeInfoDto, OutCodeDto, UseCodeDto } from './dto/operations.dto';
import { CodeInfoEnance, CodeUsedEnance, GetCodeadminEnance } from './entities/operations.entity';

@Injectable()
export class OperationsService {
    constructor(
        private readonly backendDate: BackendDataService,
        private readonly gamesMgrService: GamesMgrService,
        // private readonly httpService: HttpService
        // private readonly prismaBackendDB: PrismaBackendDBService,
    ) {

    }
    /**--------------------激活码-------------------------------------------------------------------------------------------------------*/
    generateActivationCode(length: number): string {
        // const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let code = '';
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            code += characters[randomIndex];
        }
        return code;
    }

    generateActivationCodes(quantity: number, length: number): string[] {
        const codes: string[] = [];
        for (let i = 0; i < quantity; i++) {
            const code = this.generateActivationCode(length);
            if (!codes.includes(code)) {
                codes.push(code);
            }
        }
        return codes;
    }

    async gencode(genCodeDto: GenCodeDto) {
        let result = new GenCodeResult();
        const quantity = genCodeDto.quantity;
        // const length = genCodeDto.length;
        const infoId = genCodeDto.id;
        if (!infoId) {
            return result;
        }
        let infovar = await this.backendDate.getCodeLength(infoId)
        if ((!infovar) && (!infovar.len)) {
            return result;
        }
        // const activationCodes = this.generateActivationCodes(genCodeDto.quantity, genCodeDto.length);
        let codeData: any[] = [];
        let codes: string[] = [];
        let outCodeDto: OutCodeDto = {
            gameid: infovar.gameId,
            type: EBOutCodeType.All
        }
        const db_codes = await this.backendDate.getAllCodeUsedData(outCodeDto);
        for (let index = 0; index < db_codes.length; index++) {
            const element = db_codes[index];
            codes.push(element.code);
        }
        let com_codes = [];
        // console.log('codes > ',codes)
        for (let i = 0; i < quantity; i++) {
            let codeUsed: CodeUsedEnance = {
                codeinfoId: infoId,
                gameId: infovar.gameId,
                //游戏角色ID
                roleId: '',
                //生成的激活码
                code: '',
                //是否已经用过 0没有 1已经使用
                used: 0,
                //激活使用时间
                actTime: cTools.newLocalDateString(),
            }

            const code = this.generateActivationCode(infovar.len);
            if (!codes.includes(code) && !com_codes.includes(code)) {
                codes.push(code);
                codeUsed.code = code;
                codeData.push(codeUsed);
            }
        }
        // console.log(codes);
        await this.backendDate.saveCodeUsedData(codeData)
        languageConfig.setSuccess(EBActType.GenCode, result);
        return result;
    }

    async gencomcode(genCodeDto: GenComCodeDto) {
        let result = new GenCodeResult();
        const quantity = 1;//genCodeDto.quantity;
        let prismaBackendDB = this.backendDate.getPrismaBackendDB();
        // const length = genCodeDto.length;
        const infoId = genCodeDto.id;
        if (!infoId) {
            return result;
        }
        let code_db_ret = await prismaBackendDB.game_code_used.findFirst({
            where: {
                code: genCodeDto.code
            }
        })
        if (code_db_ret) {
            result.msg = '激活码已存在'
            return result;
        }
        let infovar = await this.backendDate.getCodeLength(infoId)
        if ((!infovar)) {// && (!infovar.len)
            result.msg = '游戏不存在'
            return result;
        }
        let codeData: any[] = [];
        const codes: string[] = [];
        for (let i = 0; i < quantity; i++) {
            let codeUsed: CodeUsedEnance = {
                codeinfoId: infoId,
                gameId: infovar.gameId,
                //游戏角色ID
                roleId: '',
                //生成的激活码
                code: '',
                // //是否已经用过 0没有 1已经使用 3 通码
                used: EBOutCodeType.Com,
                //激活使用时间
                actTime: cTools.newLocalDateString(),
            }

            const code = genCodeDto.code //this.generateActivationCode(infovar.len);
            if (!codes.includes(code)) {
                codes.push(code);
                codeUsed.code = code;
                codeData.push(codeUsed);
            }
        }
        // console.log(codes);
        // await this.backendDate.saveComCodeUsedData(codeData);
        let create_ret = await prismaBackendDB.game_code_used.createMany({
            data: codeData,
        })
        if (!create_ret) {
            result.msg = '通用激活码新增失败'
            return result;
        }
        languageConfig.setSuccess(EBActType.GenCode, result);
        result.msg = '通用激活码新增成功'
        return result;
    }

    async outcode(outCodeDto: OutCodeDto) {
        let result = new OutCodeResult();
        let prismaBackendDB = this.backendDate.getPrismaBackendDB();
        // if (outCodeDto.cinfoid) {
        //     result.data = await prismaBackendDB.game_code_used.findMany({
        //         where: {
        //             gameId: outCodeDto.gameid,
        //             codeinfoId: outCodeDto.cinfoid,
        //             used: {
        //                 in: [EBOutCodeType.Unused, EBOutCodeType.Used, EBOutCodeType.Com],
        //             },
        //         }
        //     })
        // } 
        // else 
        {
            const ret = await this.backendDate.getCodeUsedData(outCodeDto);
            result.data = ret.ret;
            // result.count = ret.count;
        }
        languageConfig.setSuccess(EBActType.GenCode, result);
        return result;
    }
    async outcomcode(outCodeDto: OutCodeDto) {
        let result = new OutCodeResult();
        const ret = await this.backendDate.getComCodeUsedData(outCodeDto);
        result.data = ret;
        languageConfig.setSuccess(EBActType.GenCode, result);
        return result;
    }

    async usecode(useCodeDto: UseCodeDto) {
        let result = new OutCodeResult();//邮件
        if (!useCodeDto.serverid) {
            result.msg = '服务器id err'
            return result;
        }
        let prismaBackendDB = this.backendDate.getPrismaBackendDB();
        //查gameID
        let games_ret = await prismaBackendDB.games.findFirst({
            where: {
                sku: useCodeDto.sku
            }
        })
        if (!games_ret) {
            result.msg = '无效激活码2'
            return result;
        }
        let gameid = games_ret.id;
        //获取管理信息
        const info_ret = await this.backendDate.getEmailId({
            gameid: gameid,
            code: useCodeDto.code
        });
        if (!info_ret) {
            result.msg = '无效激活码1'
            return result;
        } else {
            if ((info_ret.endTime).getTime() < (new Date).getTime()) {
                result.msg = '激活码已过期'
                return result;
            }
        }
        let iscomcode = false;
        //查激活码表
        const used_ret = await prismaBackendDB.game_code_used.findFirst({
            where: {
                code: useCodeDto.code,
                gameId: gameid,
                // used: EBOutCodeType.com
            }
        })
        if (!used_ret) {
            result.msg = '无效激活码'
            return result;
        } else {
            if (used_ret.used == EBOutCodeType.Com && info_ret.universal == EBCodeUniversal.Com) {
                iscomcode = true
                const comcode_ret = await prismaBackendDB.game_comcode_used.findMany({
                    where: {
                        gameId: gameid,
                        roleId: String(useCodeDto.roleid),
                        codeinfoId: info_ret.id
                    }
                })
                if (comcode_ret.length >= info_ret.repe) {
                    result.msg = '通码使用次数过多'
                    return result;
                }
            }
            else {
                const code_ret = await prismaBackendDB.game_code_used.findMany({
                    where: {
                        gameId: gameid,
                        roleId: String(useCodeDto.roleid),
                        codeinfoId: info_ret.id
                    }
                })
                if (code_ret.length >= info_ret.repe) {
                    result.msg = '使用次数过多'
                    return result;
                }
            }
            if (used_ret.used == EBOutCodeType.Used) {
                result.msg = '激活码已使用'
                return result;
            }
        }
        //获取邮件信息
        const retCED = await this.backendDate.getunCodeEmailData(info_ret.emailId);
        if (!retCED) {
            result.msg = '邮件配置错误'
            return result;
        }
        // console.log('---retCED>>', retCED)
        // const url = "http://192.168.0.122:888/ln2/email/sendEmail";    // HTTP/1.1
        // const data = {
        //     "key": "123",
        //     "sender": "backend",// "system",
        //     "owner": useCodeDto.roleid, //"27057642024997",
        //     "serverid": useCodeDto.gameid, //1,
        //     "title": retCED.title, //"cs1",
        //     "content": retCED.content, //"cs1一二三四五六七八九十一二三四五六七八九十",
        //     "items": retCED.items  //[{ "i": 1002, "n": 1 }] // 
        // };
        // const response = await this.httpService.post(url, data, { headers: { 'Content-Type': "application/json" } }).pipe(map(require=>require.data));
        // let ret_data = await this.backendDate.sendHttpPost(url, data);
        let beSendEmailDto: BESendEmailDto = {
            "serverid": useCodeDto.serverid,//retCED.serverId,//1,
            "gameId": gameid,//retCED.gameId,//2
            "key": "123",
            "sender": "system",
            "owner": String(useCodeDto.roleid),
            "title": retCED.title,
            "content": retCED.content,
            "items": retCED.items
        }
        let send_ret = await this.gamesMgrService.sendEmail({}, beSendEmailDto);
        // console.log(send_ret)
        if (send_ret.success) {
            if (iscomcode) {
                let codeUsed: CodeUsedEnance = {
                    codeinfoId: info_ret.id,
                    gameId: gameid,
                    //游戏角色ID
                    roleId: String(useCodeDto.roleid),
                    //生成的激活码
                    code: useCodeDto.code,
                    //激活使用时间
                    actTime: cTools.newLocalDateString(),
                }
                await prismaBackendDB.game_comcode_used.create({
                    data: codeUsed
                })
            }
            else {
                await this.backendDate.updataCodeData({
                    code: useCodeDto.code,
                    used: EBOutCodeType.Used,
                    roleId: String(useCodeDto.roleid),
                })
            }
            languageConfig.setSuccess(EBActType.UserCode, result);
        } else {
            result.msg = send_ret.msg;
        }

        return result;
    }


    /**--------------------激活码管理-------------------------------------------------------------------------------------------------------*/
    async addcodeadmin(codeInfoDto: CodeInfoDto) {
        let result = new CodeAdminResult();
        result.data = [];
        let codeInfoEnance = new CodeInfoEnance();
        Object.assign(codeInfoEnance, codeInfoDto, {
            isuse: 0,
            endtime: codeInfoDto.endTime || cTools.newLocalDateString(),
        })
        // console.log(cTools.newLocalDateString())
        // console.log('-----------------', codeInfoEnance)
        const ret = await this.backendDate.addCodeInfoData(codeInfoEnance);
        result.data.push(ret);
        languageConfig.setSuccess(EBActType.CodeAdmin, result);
        return result;
    }

    async delcodeadmin(delCodeadminDto: DelCodeadminDto) {
        let result = new CodeAdminResult();
        result.data = [];
        const ret = await this.backendDate.delcodeadminData(delCodeadminDto);
        if (!ret) {
            return result;
        }
        result.data.push(ret);
        languageConfig.setSuccess(EBActType.CodeAdmin, result);
        return result;
    }

    async updatecodeadmin(codeInfoDto: CodeInfoDto) {
        // console.log('>>',codeInfoDto)
        let result = new CodeAdminResult();
        result.data = [];
        let codeInfoEnance = new CodeInfoEnance();
        Object.assign(codeInfoEnance, codeInfoDto, {
            // isuse: 0,
            // endtime: codeInfoDto.endTime || cTools.newLocalDateString(),
        })
        // console.log('=>',codeInfoEnance)
        const ret = await this.backendDate.updateCodeInfoData(codeInfoEnance);
        result.data.push(ret);
        languageConfig.setSuccess(EBActType.CodeAdmin, result);
        return result;
    }

    async getcodeadmin(getcodeInfoDto: GetCodeInfoDto) {
        let result = new CodeAdminResult();
        let getCodeadminEnance = new GetCodeadminEnance();
        if (getcodeInfoDto.gameid > 0) getCodeadminEnance.gameid = getcodeInfoDto.gameid;
        const ret = await this.backendDate.getCodeInfoData(getCodeadminEnance);
        for (let index = 0; index < ret.length; index++) {
            let element = ret[index];
            element.endTime = (cTools.newTransformToUTCZDate(element.endTime));
            element.createdAt = (cTools.newTransformToUTCZDate(element.createdAt));
            element.updatedAt = (cTools.newTransformToUTCZDate(element.updatedAt));
        }
        result.data = ret;
        // console.log(ret)
        languageConfig.setSuccess(EBActType.CodeAdmin, result);
        return result;
    }

    async addcodeemail(codeEmailDto: CodeEmailDto) {
        let result = new CodeAdminResult();
        const ret = await this.backendDate.addCodeEmailData(codeEmailDto);
        // result.data = ret;
        // console.log(ret)
        languageConfig.setSuccess(EBActType.CodeAdmin, result);
        return result;
    }

    async getcodeemail() {
        let result = new CodeAdminResult();
        let prismaBackendDB = this.backendDate.getPrismaBackendDB();
        let ret = await prismaBackendDB.code_email_award.findMany({})
        result.data = ret;
        // console.log(ret)
        languageConfig.setSuccess(EBActType.CodeAdmin, result);
        return result;
    }

    async delCodeEmail(delCodeEmailDto: DelCodeEmailDto) {
        let prismaBackendDB = this.backendDate.getPrismaBackendDB();
        let result = new CodeAdminResult();
        result.data = [];
        let ret = await prismaBackendDB.code_email_award.delete({
            where: {
                id: delCodeEmailDto.id,
            }
        })
        if (!ret) {
            return result;
        }
        result.data.push(ret);
        languageConfig.setSuccess(EBActType.CodeAdmin, result);
        return result;
    }


    async gameDate(@Body() gameDateDto: GameDataDto) {

        let prismaBackendDB = this.backendDate.getPrismaBackendDB();
        let result = new GameDateResult();

        let game_data = await prismaBackendDB.games.findUnique(
            {
                where: {
                    id: gameDateDto.gameid
                }
            }
        )

        if (!game_data) {
            result.msg = "游戏不存在"
            return result;
        }

        result.data = new GameDateEntity();

        //总用户
        result.data.total_user = await prismaBackendDB.game_backend_user.count(
            {
                where: {
                    gameId: gameDateDto.gameid,
                }
            }
        );


        //今日新增
        let min_time = new Date();
        min_time.setHours(8, 0, 0, 0);

        let max_time = new Date();
        max_time.setHours(8 + 24, 0, 0, 0);

        result.data.today_user = await prismaBackendDB.game_backend_user.count(
            {
                where: {
                    gameId: gameDateDto.gameid,
                    createdAt: {
                        gte: min_time,
                        lte: max_time
                    }
                }
            }
        );

        //总充值
        let ret_data1 = await prismaBackendDB.orders.aggregate(
            {
                where: {
                    gameId: gameDateDto.gameid,
                    paid: 1
                },
                _sum: {
                    paidAmount: true
                }
            }
        )
        result.data.total_amount = ret_data1._sum.paidAmount || 0;

        //今日充值
        let ret_data2 = await prismaBackendDB.orders.aggregate(
            {
                where: {
                    gameId: gameDateDto.gameid,
                    paid: 1,
                    createdAt: {
                        gte: min_time,
                        lte: max_time
                    }
                },
                _sum: {
                    paidAmount: true
                }
            }
        )
        result.data.today_amount = ret_data2._sum.paidAmount || 0;

        result.data.arpu = result.data.total_amount / result.data.total_user;
        result.data.arpu = Number(Number(result.data.arpu).toFixed(2)) || 0;
        languageConfig.setSuccess(EBActType.GameData1, result);
        return result;

    }

    async gameDate2(@Body() gameDate2Dto: GameData2Dto) {

        let result = new GameDate2Result();
        let prismaBackendDB = this.backendDate.getPrismaBackendDB();


        let game_data = await prismaBackendDB.games.findUnique(
            {
                where: {
                    id: gameDate2Dto.gameid
                }
            }
        )

        if (!game_data) {
            result.msg = "游戏不存在"
            return result;
        }

        if (gameDate2Dto.serverid > 0) {
            let server_ret = await prismaBackendDB.servers.findFirst(
                {
                    where: {
                        gameId: gameDate2Dto.gameid,
                        serverId: gameDate2Dto.serverid
                    }
                }
            )

            if (!server_ret) {
                result.msg = "该游戏服务器不存在";
                return result;
            }

            if (!server_ret.info) {
                result.msg = "该游戏服务器INFO 不存在";
                return result;
            }

            let serverinfo: BEServerInfoEntity = <unknown>server_ret.info

            if (serverinfo.mainsId) {
                result.msg = "该游戏服务器已被合服";
                return result;
            }
        }


        //根据gameurl 获取 gameDBUrl
        let gameDBUrl = process.env.GAMEDB_URL;
        console.log("gameDBUrl:", gameDBUrl);

        //根据gameDBUrl 创建prisma对象
        const prismaGameDBService = this.backendDate.createPrismaGameDBService(gameDBUrl);
        //根据prisma对象 查找数据   

        let whereCondition = {
            serverid: gameDate2Dto.serverid,
            rolelevel: {
                lte: 1,
                gte: 2,
            },
            gamelevels: {
                lte: 1,
                gte: 2,
            },
        }

        if (gameDate2Dto.serverid <= 0) {
            delete whereCondition.serverid;
        }

        if (gameDate2Dto.type == BEGameData2Type.ROLE_LEVEL) {
            delete whereCondition.gamelevels;
        }
        else if (gameDate2Dto.type == BEGameData2Type.GAME_LEVEL) {
            delete whereCondition.rolelevel;
        }
        else {
            result.msg = "没有该查询类型 type:" + gameDate2Dto.type;
            return result;
        }

        let curQueries: string | any[] = [];

        for (let index = 0; index < gameDate2Dto.range.length; index++) {
            const element = gameDate2Dto.range[index];
            if (gameDate2Dto.type == BEGameData2Type.ROLE_LEVEL) {
                whereCondition.rolelevel.lte = element.max;
                whereCondition.rolelevel.gte = element.min;
            }
            else if (gameDate2Dto.type == BEGameData2Type.GAME_LEVEL) {
                whereCondition.gamelevels.lte = element.max;
                whereCondition.gamelevels.gte = element.min;
            }

            let new_whereCondition = cloneDeep(whereCondition);
            let cur_ret = prismaGameDBService.roleInfo.count({
                where: new_whereCondition
            })
            curQueries.push(cur_ret);
        }

        let all_ret = await prismaGameDBService.$transaction(curQueries);

        result.data = all_ret;
        languageConfig.setSuccess(EBActType.GameData2, result);
        return result;
    }

}
