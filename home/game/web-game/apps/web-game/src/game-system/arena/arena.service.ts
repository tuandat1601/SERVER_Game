import { Injectable, Request } from '@nestjs/common';
import { CQType, EActType, EArenaSatate, EFightResults, EFightType, EGameRankType, EObjtype, EServerType } from '../../config/game-enum';
import { TableGameConfig } from '../../config/gameTable/TableGameConfig';
import { TableGameSys } from '../../config/gameTable/TableGameSys';
import { TableRobotRole } from '../../config/gameTable/TableRobotRole';
import { languageConfig } from '../../config/language/language';
import { ArenaEntity, ArenaFightInfo, ArenaInfo, ArenaLogEntity, ArenaServerInfo, RoleCommonEntity, ServerArenaRankRecord } from '../../game-data/entity/arena.entity';
import { CQResult, RESArenaFightData2Msg, RESArenaFightDataMsg, RESArenaShowMsg, RESFightCommonInfo, RESRoleInfoShowMsg } from '../../game-data/entity/msg.entity';
import { GameDataService, GetRoleALLInfoDto } from '../../game-data/gamedata.service';
import { RoleKeyDto } from '../../game-data/role/dto/role-key.dto';
import { cGameCommon, RetRoleALLInfo } from '../game-common';
import { ArenaDto, ArenaRoleinfoDto } from './dto/arena.dto';
import { TableGameItem } from '../../config/gameTable/TableGameItem';
import { cItemBag } from '../item/item-bag';
import { clone, cloneDeep } from 'lodash';
import { cpHero } from '../hero/hero-cpattr';
import { cTools } from '../../game-lib/tools';
import { FightService } from '../fight/fight.service';
import { ArenaFight2Dto, ArenaFightDto } from '../fight/dto/game-fight.dto';
import { gameConst } from '../../config/game-const';
import { FightReqEntity } from '../../game-data/entity/fight.entity';
import { Tablecaiquan } from '../../config/gameTable/Tablecaiquan';
import { GameRankRecord } from '../../game-data/entity/rank.entity';
import { cFightSystem, loadRoleInfo } from '../fight/fight-system';
import { RoleSubInfoEntity } from '../../game-data/entity/roleinfo.entity';

@Injectable()
export class ArenaService {
    constructor(
        private readonly gameDataService: GameDataService,
        private readonly fightService: FightService
    ) { }


    /**检查 */
    async Check(dto: any, retRoleALLInfo: RetRoleALLInfo, roleKeyDto: RoleKeyDto) {
        let d: any = { msg: 'ok' }
        if (dto.flag === EServerType.CROSS) {
            d.kf = true
            d.sys = TableGameSys.arenaKF
            d.info = retRoleALLInfo.roleSubInfo.arenaInfoKf
            d.show_cost = TableGameConfig.arena_show_cost_kf
            d.show_num = TableGameConfig.arena_show_num_kf
            d.nowar_cd = TableGameConfig.arena_nowar_cd_kf
            d.base_jf = TableGameConfig.arena_base_kf
            d.challenge_cost = TableGameConfig.arena_challenge_cost_kf
            d.challenge_getitem = TableGameConfig.arena_challenge_getitem_kf
            d.RankType = EGameRankType.CROSS_ARENA
            d.FightType = EFightType.ARENA_KF
            d.RankData = await this.gameDataService.getServerRankByType(retRoleALLInfo.serverInfo.info.crossServerId, d.RankType,);

            d.crossServerId = retRoleALLInfo.serverInfo.info?.crossServerId
            if (!d.crossServerId) {
                d.msg = languageConfig.tip.error_system_serverdata;
            }
            d.cross_arenaInfo = await this.gameDataService.getArenaServerInfo(d.crossServerId);
            d.seasonid = d.cross_arenaInfo?.season
        } else {
            d.kf = false
            d.sys = TableGameSys.arena
            d.info = retRoleALLInfo.roleSubInfo.arenaInfo
            d.show_cost = TableGameConfig.arena_show_cost
            d.show_num = TableGameConfig.arena_show_num
            d.nowar_cd = TableGameConfig.arena_nowar_cd
            d.base_jf = TableGameConfig.arena_base
            d.challenge_cost = TableGameConfig.arena_challenge_cost
            d.challenge_getitem = TableGameConfig.arena_challenge_getitem
            if (dto.mode) {//新战斗模式
                d.isOne = true
                d.RankType = EGameRankType.ARENA2
                d.FightType = EFightType.ARENA2
                d.RankData = await this.gameDataService.getServerRankByType(roleKeyDto.serverid, d.RankType);
            } else {
                d.RankType = EGameRankType.ARENA
                d.FightType = EFightType.ARENA
                d.RankData = await this.gameDataService.getSeverArenaRank(roleKeyDto.serverid);

            }

            if (!retRoleALLInfo.serverInfo.info?.arenaData) {
                d.msg = languageConfig.tip.error_system_serverdata;
            }
            d.seasonid = retRoleALLInfo.serverInfo.info?.arenaData?.season
        }
        //"系统是否开放"
        if (!cGameCommon.isOpenSystem(retRoleALLInfo, d.sys)) {
            d.msg = languageConfig.tip.not_open_system
        }
        //是否在有效时间内
        else if (!cTools.checkSystemActTime(d.sys)) {
            d.msg = languageConfig.tip.errortime_system;
        }
        //是否有数据
        else if (d.info === undefined) {
            d.msg = languageConfig.tip.error_system_data;
        }

        return d
    }

    uPshow(id: string, ck: any) {

        let show: any[] = [];
        let wcount = 0
        let ids: any = []
        ids.push(id)
        let SveRank = ck.RankData
        let sectionPoint: any[] = []  //区间数据
        let sectionPoint2: any[] = []  //区间数据
        const point = ck.info.point;
        for (const key in SveRank) {
            if (Object.prototype.hasOwnProperty.call(SveRank, key)) {
                const element = SveRank[key];
                let foepoint = 1000
                if (ck.kf || ck.isOne) {
                    foepoint = element.val;
                } else {
                    foepoint = element.p;
                }
                if (foepoint < point + 500 && foepoint > point - 300) {
                    sectionPoint.push(element);
                }
                if (foepoint < point + 1000 && foepoint > point - 500) {
                    sectionPoint2.push(element);
                }
            }
        }
        function loadData(pData: any[]) {
            let rn = Math.floor(Math.random() * pData.length)
            let needData = pData[rn];
            let rid = needData?.id
            if (ck.kf || ck.isOne) {
                rid = needData?.roleid
            }
            if (rid && ids.indexOf(rid) === -1) {
                ids.push(rid);
                show.push({ id: rid })   //, obj: EObjtype.HERO 
                return true;
            }
            return false;
        }
        do {
            let get: boolean = false;
            if (sectionPoint.length > 0) {
                get = loadData(sectionPoint);
            }
            if (!get && sectionPoint2.length > 0) {
                get = loadData(sectionPoint2);
            }
            const allPoint = Object.values(SveRank)
            if (!get && allPoint.length > 0) {
                get = loadData(allPoint);
            }
            if (!get) {
                const def = TableRobotRole.getTable()
                // let len = Object.values(def).length
                let dkey = Object.keys(def)
                let len = dkey.length
                let rn = Math.floor(Math.random() * len)
                let key = dkey[rn]
                if (Object.prototype.hasOwnProperty.call(def, key) && ids.indexOf(key) === -1) {
                    ids.push(key)
                    let d: ArenaEntity = {
                        id: key,
                        // obj: EObjtype.ROBOT,
                    };
                    show.push(d)

                }

            }

            wcount++;
        } while (show.length < ck.show_num && wcount < 99)
        return show
    }

    async show(@Request() req: any, arenaDto: ArenaDto) {
        let retMsg: RESArenaShowMsg = { ok: false, show: [] };
        // let retMsg: RESArenaShowMsg = new RESArenaShowMsg();
        let roleKeyDto: RoleKeyDto = { id: req.user.id, serverid: req.user.serverid };
        let getRoleALLInfoDto = new GetRoleALLInfoDto(roleKeyDto);
        getRoleALLInfoDto.need_roleInfo = true;
        getRoleALLInfoDto.need_roleItem = true;

        //获取角色信息
        let retRoleALLInfo: RetRoleALLInfo = await this.gameDataService.getRoleAllInfo(getRoleALLInfoDto);
        let ck = await this.Check(arenaDto, retRoleALLInfo, roleKeyDto)
        if (ck.msg !== 'ok') {
            retMsg.msg = ck.msg
            return retMsg;
        }
        //获取道具数据
        let roleItem = retRoleALLInfo.roleItem
        let roleInfo = retRoleALLInfo.roleInfo    //角色信息
        let showdata = ck.info.show;
        if (!showdata || showdata.length == 0 || arenaDto.type == 2) {
            if (arenaDto.type == 2) {
                //消耗道具
                let costitem = ck.show_cost
                retMsg.decitem = {};
                for (const key in costitem) {
                    if (Object.prototype.hasOwnProperty.call(costitem, key)) {
                        const itemid = Number(key)
                        const itemid_num = costitem[key];
                        if (!roleItem[itemid] || roleItem[itemid] < itemid_num) {
                            retMsg.msg = `[${TableGameItem.getVal(itemid, TableGameItem.field_name)}]不够`;
                            delete retMsg.decitem;
                            return retMsg;
                        }
                        cItemBag.decitem(roleItem, retMsg.decitem, itemid, itemid_num);
                    }
                }
            }
            retMsg.show = this.uPshow(req.user.id, ck)
        } else {
            retMsg.show = ck.info.show;
        }
        if (ck.kf) {
            roleInfo.info.arenaInfoKf.show = cloneDeep(retMsg.show); //克隆 clone
        } else {
            roleInfo.info.arenaInfo.show = cloneDeep(retMsg.show); //克隆 clone
        }
        for (const key in retMsg.show) {
            if (Object.prototype.hasOwnProperty.call(retMsg.show, key)) {
                let element = retMsg.show[key];
                if (Number(element.id) < gameConst.robot_max_id) {
                    const def = TableRobotRole.table[element.id]
                    if (def) {
                        element.p = Number(element.id);
                        element.n = def.name;
                        element.c = def.icon;
                        element.f = def.fight;
                        element.lv = def.lv;
                    }
                }
                else {
                    let arenaRank = ck.RankData //await this.gameDataService.getSeverArenaRank(req.user.serverid)
                    let data = arenaRank[element.id]
                    if (data) {
                        if (ck.kf || ck.isOne) {
                            element.p = data.val;
                            element.n = data.info.n;
                            element.c = data.info.c;
                            element.f = data.info.f;
                            element.lv = data.info.lv;
                            element.sid = data.serverid
                        }
                        else {
                            element.p = data.p;
                            element.n = data.n;
                            element.c = data.c;
                            element.f = data.f;
                            element.lv = data.lv;
                        }
                    }
                }
            }
        }

        await this.gameDataService.updateRoleInfo(roleKeyDto, roleInfo);
        await this.gameDataService.updateRoleItem(roleKeyDto, roleItem);
        languageConfig.setActTypeSuccess(EActType.ARENA_SHOW, retMsg);
        return retMsg
    }


    async rank(@Request() req: any, arenaDto: ArenaDto) {
        let retMsg: RESArenaShowMsg = { ok: false };
        let roleKeyDto: RoleKeyDto = { id: req.user.id, serverid: req.user.serverid };
        let getRoleALLInfoDto = new GetRoleALLInfoDto(roleKeyDto);
        getRoleALLInfoDto.need_roleInfo = true;

        //获取角色信息
        let retRoleALLInfo: RetRoleALLInfo = await this.gameDataService.getRoleAllInfo(getRoleALLInfoDto);
        if (!retRoleALLInfo.isHaveData()) {
            retMsg.msg = retRoleALLInfo.getRetMsg();
            return retMsg;
        }
        let ck = await this.Check(arenaDto, retRoleALLInfo, roleKeyDto)
        if (ck.msg !== 'ok') {
            retMsg.msg = ck.msg
            return retMsg;
        }


        //--------------------------------------------
        retMsg.rank = ck.RankData;
        retMsg.point = ck.info.point;
        retMsg.nowar = ck.info.nowar;
        languageConfig.setActTypeSuccess(EActType.ARENA_SHOW, retMsg);
        return retMsg
    }

    async arenalog(@Request() req: any, arenaDto: ArenaDto) {
        let retMsg: RESArenaShowMsg = { ok: false };
        let roleKeyDto: RoleKeyDto = { id: req.user.id, serverid: req.user.serverid };
        let getRoleALLInfoDto = new GetRoleALLInfoDto(roleKeyDto);
        getRoleALLInfoDto.need_roleInfo = true;

        //获取角色信息
        let retRoleALLInfo: RetRoleALLInfo = await this.gameDataService.getRoleAllInfo(getRoleALLInfoDto);
        if (!retRoleALLInfo.isHaveData()) {
            retMsg.msg = retRoleALLInfo.getRetMsg();
            return retMsg;
        }

        let ck = await this.Check(arenaDto, retRoleALLInfo, roleKeyDto)
        if (ck.msg !== 'ok') {
            retMsg.msg = ck.msg
            return retMsg;
        }
        if (ck.kf) {
            // let cross_arenaInfo: ArenaServerInfo = await this.gameDataService.getArenaServerInfo(ck.crossServerId);
            if (ck.seasonid && ck.crossServerId) {
                retMsg.log = await this.gameDataService.getRoleCrossArenaLog(ck.seasonid, ck.crossServerId, roleKeyDto);

            }
        } else {
            let serverInfo = retRoleALLInfo.serverInfo    //全服信息
            if (!serverInfo.info || !serverInfo.info.arenaData) {
                retMsg.msg = languageConfig.tip.error_system_serverdata;
                return retMsg;
            }
            //--------------------------------------------
            let arenaData = serverInfo.info.arenaData
            retMsg.log = await this.gameDataService.getRoleArenaLog(arenaData.season, roleKeyDto)
        }
        retMsg.log.forEach(v => v.id = Number(v.atkid));
        languageConfig.setActTypeSuccess(EActType.ARENA_SHOW, retMsg);
        return retMsg
    }


    async roleinfo(@Request() req: any, arenaDto: ArenaRoleinfoDto) {
        let retMsg: RESRoleInfoShowMsg = { ok: false };
        let roleKeyDto: RoleKeyDto = { id: req.user.id, serverid: req.user.serverid };
        let getRoleALLInfoDto = new GetRoleALLInfoDto(roleKeyDto);
        getRoleALLInfoDto.need_roleInfo = true;

        //获取角色信息
        let retRoleALLInfo: RetRoleALLInfo = await this.gameDataService.getRoleAllInfo(getRoleALLInfoDto);
        let roleSubInfo = retRoleALLInfo.roleSubInfo;
        if (!retRoleALLInfo.isHaveData()) {
            retMsg.msg = retRoleALLInfo.getRetMsg();
            return retMsg;
        }
        let ck = await this.Check(arenaDto, retRoleALLInfo, roleKeyDto)
        if (ck.msg !== 'ok') {
            retMsg.msg = ck.msg
            return retMsg;
        }
        //--------------------------------------------
        let SveRank = ck.RankData;
        let id = arenaDto.id
        if (id < gameConst.robot_max_id) {
            id = req.user.id;
            /*  //机器人暂时不显示信息
            let info: HerosRecord = {};
            const def = TableRobotRole.getVal(Number(arenaDto.id), TableRobotRole.field_robot)
            for (const key in def) {
                if (Object.prototype.hasOwnProperty.call(def, key)) {
                    const trid = def[key];
                    const th = TableRobotHero.table[trid]
                    if (th) {
                        let skill: SkillPosRecord = {}
                        for (let index = 0; index < th.skill.length; index++) {
                            const element = th.skill[index];
                            skill[index] = { sid: element }
                        }
                        // let equip: EquipPosRecord = {}
                        // for (let index = 0; index < th.skill.length; index++) {
                        //     const element = th.skill[index];
                        //     // equip[index] = { sid: element }
                        // }
                        let heroEntity: HeroEntity = {
                            // @ApiProperty({ description: '英雄ID' })
                            id: th.heroid,
                            // @ApiProperty({ description: '英雄技能' })
                            skill: skill,
                            // @ApiProperty({ example: "{[部位ID]:EquipEntity}",description: '英雄装备'})
                            // equip: equip,

                            // @ApiProperty({ description: '装备部位属性' })
                            // poslv?: PosLvRecord;

                            // @ApiProperty({ description: '当前血量 只存在内存中 用于关卡战斗' })
                            // curHP?: number;

                            // // @ApiProperty({ description: '装备总属性(用于计算英雄总属性)' })
                            // // eAttr?: HeroAttrRecord;

                            // // @ApiProperty({ description: '装备部位总属性(用于计算英雄总属性)' })
                            // // epAttr?: HeroAttrRecord;

                            // @ApiProperty({ description: '英雄基础总属性（不算百分比加成）=表属性（静态）+ 装备总属性（动态）+ 装备部位总属性（动态）' })
                            // attr?: HeroAttrRecord;

                            // @ApiProperty({ description: '英雄总属性=英雄基础总属性*百分比加成' })
                            // tAttr?: HeroAttrRecord;

                            // // @ApiProperty({ description: '英雄战力' })
                            fight: Math.floor(Math.random() * 20000) + 20000//机器人战力暂时随机
                        }
                        info[th.heroid] = heroEntity;
                    }

                }
            }
            retMsg.roleinfo = info;
            languageConfig.setActTypeSuccess(EActType.ARENA_SHOW, retMsg);
            */
        }
        else {
        }
        if (SveRank[id]) {
            let infos = SveRank[id];
            for (const key in infos.rh) {
                if (Object.prototype.hasOwnProperty.call(infos.rh, key)) {
                    let heroEntity = infos.rh[key];
                    cpHero.cpHeroAttr(heroEntity, roleSubInfo);
                }
            }
            retMsg.roleinfo = infos;
            languageConfig.setActTypeSuccess(EActType.ARENA_SHOW, retMsg);
        }
        return retMsg
    }

    async fight(@Request() req: any, arenaFightDto: ArenaFightDto) {
        const userid = Number(arenaFightDto.id)
        let usertype = (userid < gameConst.robot_max_id) ? EObjtype.ROBOT : EObjtype.HERO
        let roleKeyDto: RoleKeyDto = { id: req.user.id, serverid: req.user.serverid };

        let retMsg: RESArenaFightDataMsg = { ok: false };
        let getRoleALLInfoDto = new GetRoleALLInfoDto(roleKeyDto);
        getRoleALLInfoDto.need_roleInfo = true;
        getRoleALLInfoDto.need_roleItem = true;
        getRoleALLInfoDto.need_roleHero = true;

        //获取角色信息
        let retRoleALLInfo: RetRoleALLInfo = await this.gameDataService.getRoleAllInfo(getRoleALLInfoDto);
        if (!retRoleALLInfo.isHaveData()) {
            retMsg.msg = retRoleALLInfo.getRetMsg();
            return retMsg;
        }
        // let serverInfo = retRoleALLInfo.serverInfo   //全服信息
        let roleInfo = retRoleALLInfo.roleInfo       //角色信息
        let roleItem = retRoleALLInfo.roleItem       //道具信息
        let roleHero = retRoleALLInfo.roleHero       //英雄信息

        let ck = await this.Check(arenaFightDto, retRoleALLInfo, roleKeyDto)
        if (ck.msg !== 'ok') {
            retMsg.msg = ck.msg
            return retMsg;
        }
        let arenaRank = ck.RankData
        let arenainfo = ck.info

        let nowar = false;
        for (const key in arenainfo.nowar) {
            if (Object.prototype.hasOwnProperty.call(arenainfo.nowar, key)) {
                const time = arenainfo.nowar[key];
                let cur_t = new Date().getTime();
                if (cur_t > time + (ck.nowar_cd * 1000)) {
                    // arenainfo.nowar.splice(Number(key),1);
                    delete arenainfo.nowar[key]
                } else {
                    if (Number(key) == userid) {
                        nowar = true
                    }
                }
            }
        }
        //对方积分
        let foePoint = Number(userid)
        if (usertype == EObjtype.HERO) {
            if (nowar) {
                retMsg.msg = languageConfig.tip.nowar_cd;
                return retMsg;
            }
            foePoint = ck.kf ? arenaRank[String(userid)]?.val : arenaRank[String(userid)]?.p
            foePoint = foePoint || 1000;
        }
        //消耗
        // arenainfo.challenge = 1
        if (arenainfo.challenge > 0) {
            //是否有免费次数
            arenainfo.challenge--;
        } else {
            //消耗道具
            cItemBag.costItem(retRoleALLInfo.roleItem, ck.challenge_cost, retMsg);
            if (!retMsg.ok) { return retMsg; }
        }

        let cqid = arenaFightDto.cqid || 0;
        if (cqid && cqid > 0) {
            //猜拳
            retMsg.cqresult = new CQResult();
            retMsg.cqresult.cqid = cqid;
            let eid = cTools.randInt(CQType.STONE, CQType.CLOTH);
            retMsg.cqresult.enemy = eid;
            var win: number = 0;
            if (cqid == eid) {
                win = EFightResults.DRAW
            }
            else {
                if (cqid > eid) {
                    if (cqid == CQType.CLOTH && eid == CQType.STONE) {
                        win = EFightResults.LOST;
                    }
                    else {
                        win = EFightResults.WIN;
                    }
                }
                else {
                    if (eid == CQType.CLOTH && cqid == CQType.STONE) {
                        win = EFightResults.WIN;
                    }
                    else {
                        win = EFightResults.LOST;
                    }
                }
            }
            retMsg.cqresult.win = win
            let lv = retRoleALLInfo.roleInfo.info.cq?.lv[cqid];
            if (lv !== undefined) {
                retMsg.cqresult.skill = (new Tablecaiquan(cqid, lv)).skill;
            }
        }

        let fightReqEntity: FightReqEntity = {
            pos: 0, levels: ck.crossServerId,
            id: (userid),
        }
        //进行战斗
        let isok = await this.fightService.goFight(ck.FightType, roleKeyDto, roleInfo, fightReqEntity, roleHero, retMsg);
        if (!isok) {
            return retMsg;
        }
        let point = Math.floor((foePoint - arenainfo.point) / 50);
        const basepoint = ck.base_jf;
        //胜负处理
        let cur_point = 0
        let wincount = 0
        if (retMsg.results === EFightResults.WIN) {
            cur_point += basepoint + point;
            arenainfo.show = [];
            //加道具
            const getitem = ck.challenge_getitem
            retMsg.additem = {};
            for (const key in getitem) {
                const itemid = Number(key)
                const item_num = getitem[key];
                cItemBag.addItem(roleItem, retMsg.additem, itemid, item_num);
            }
            if (usertype == EObjtype.HERO) {
                //免战
                if (arenainfo.nowar == undefined) {
                    arenainfo.nowar = {};
                }
                arenainfo.nowar[userid] = new Date().getTime();
            }
            //佣兵激活条件
            let actinfo = retRoleALLInfo.roleSubInfo.mercenary?.actinfo
            if (actinfo && actinfo.an !== undefined) {
                actinfo.an++;
                wincount = actinfo.an
            }
        }
        else //if(retMsg.results === EFightResults.LOST)
        {
            cur_point -= basepoint + point;
        }
        if (arenaRank[String(req.user.id)]) {
            arenainfo.point = ck.kf ? arenaRank[String(req.user.id)].val : arenaRank[String(req.user.id)].p;
        }

        let arenaFightInfo: ArenaFightInfo = {
            wincount: wincount,
            /**自己的积分*/
            ourpoint: arenainfo.point,
            /**自己变化的积分*/
            ourchangepoint: cur_point,
            /**对方的积分*/
            foepoint: foePoint,
            /**对方变化的积分*/
            foechangepoint: -cur_point
        }
        retMsg.arenainfo = arenaFightInfo;

        arenainfo.point += cur_point
        if (usertype == EObjtype.HERO) {
            let roleCommonEntity: RoleCommonEntity = {
                n: roleInfo.info.name,
                lv: roleInfo.rolelevel,
                c: roleInfo.info.ico,
            }

            let arenaLogEntity: ArenaLogEntity = {
                // id?: number
                seasonid: ck.seasonid || arenainfo.season,
                serverid: roleKeyDto.serverid,
                roleid: String(userid),   //被攻击者
                atkid: roleKeyDto.id,    //攻击者 
                point: -cur_point,
                // time?: Date
                state: EArenaSatate.NORMAL,
                info: roleCommonEntity,
                // needsave?: boolean;
            }
            if (ck.kf) {
                arenaLogEntity.crossServerid = ck.crossServerId
                await this.gameDataService.sendRoleCrossArenaLog(arenaLogEntity);
            } else {
                await this.gameDataService.sendRoleArenaLog(arenaLogEntity);
            }
            let uroleKeyDto: any = { id: String(userid), serverid: roleKeyDto.serverid }

            let ugetRoleALLInfoDto = new GetRoleALLInfoDto(uroleKeyDto);
            ugetRoleALLInfoDto.need_roleInfo = true;
            ugetRoleALLInfoDto.need_roleHero = true;
            //获取被攻击角色信息
            let uretRoleALLInfo: RetRoleALLInfo = await this.gameDataService.getRoleAllInfo(ugetRoleALLInfoDto);
            let online = uretRoleALLInfo.isHaveData();
            // await this.gameDataService.changeSAreanRank(uroleKeyDto, -cur_point, arenaRank, online ? uretRoleALLInfo : null);
            if (online) {
                await this.gameDataService.changeServerRankByType(uretRoleALLInfo, ck.RankType, foePoint - cur_point);
            } else {
                let data = { roleid: uroleKeyDto.id, serverid: ck.crossServerId }
                await this.gameDataService.changeOthersServerRankByType(data, ck.RankType, foePoint - cur_point);
            }
        }

        await this.gameDataService.changeServerRankByType(retRoleALLInfo, ck.RankType, arenainfo.point);
        //
        await this.gameDataService.updateRoleInfo(roleKeyDto, roleInfo);
        await this.gameDataService.updateRoleHero(roleKeyDto, roleHero);
        await this.gameDataService.updateRoleItem(roleKeyDto, roleItem);

        languageConfig.setActTypeSuccess(EActType.ARENA_FIGHT, retMsg);
        return retMsg;

    }

    /**新上阵模式 */
    async fight2(@Request() req: any, dto: ArenaFight2Dto) {
        const userid = Number(dto.id)
        let usertype = (userid < gameConst.robot_max_id) ? EObjtype.ROBOT : EObjtype.HERO
        let roleKeyDto: RoleKeyDto = { id: req.user.id, serverid: req.user.serverid };

        let retMsg: RESArenaFightData2Msg = new RESArenaFightData2Msg();
        let getRoleALLInfoDto = new GetRoleALLInfoDto(roleKeyDto);
        getRoleALLInfoDto.need_roleInfo = true;
        getRoleALLInfoDto.need_roleItem = true;
        getRoleALLInfoDto.need_roleHero = true;

        //获取角色信息
        let retRoleALLInfo: RetRoleALLInfo = await this.gameDataService.getRoleAllInfo(getRoleALLInfoDto);
        if (!retRoleALLInfo.isHaveData()) {
            retMsg.msg = retRoleALLInfo.getRetMsg();
            return retMsg;
        }
        let roleInfo = retRoleALLInfo.roleInfo       //角色信息
        let roleItem = retRoleALLInfo.roleItem       //道具信息
        let roleHero = retRoleALLInfo.roleHero       //英雄信息

        let d = await this.Check({ flag: dto.flag, mode: true }, retRoleALLInfo, roleKeyDto)
        if (d.msg !== 'ok') {
            retMsg.msg = d.msg
            return retMsg;
        }
        if (!dto.fightGroup || dto.fightGroup.length !== roleInfo.info.fteam.length) {
            retMsg.msg = '出战队伍错误！'
            return retMsg;
        }
        let arenaRank: GameRankRecord = d.RankData
        let arenainfo: ArenaInfo = d.info

        let nowar = false;
        for (const key in arenainfo.nowar) {
            if (Object.prototype.hasOwnProperty.call(arenainfo.nowar, key)) {
                const time = arenainfo.nowar[key];
                let cur_t = new Date().getTime();
                if (cur_t > time + (d.nowar_cd * 1000)) {
                    delete arenainfo.nowar[key]
                } else if (Number(key) == userid) {
                    nowar = true
                }
            }
        }
        if (nowar) {
            retMsg.msg = languageConfig.tip.nowar_cd;
            return retMsg;
        }
        //消耗
        // arenainfo.challenge = 1
        if (arenainfo.challenge > 0) {
            //是否有免费次数
            arenainfo.challenge--;
        } else {
            //消耗道具
            cItemBag.costItem(roleItem, d.challenge_cost, retMsg);
            if (!retMsg.ok) { return retMsg; }
        }

        // let cqid = arenaFightDto.cqid || 0;
        // if (cqid && cqid > 0) {
        //     //猜拳
        //     retMsg.cqresult = new CQResult();
        //     retMsg.cqresult.cqid = cqid;
        //     let eid = cTools.randInt(CQType.STONE, CQType.CLOTH);
        //     retMsg.cqresult.enemy = eid;
        //     var win: number = 0;
        //     if (cqid == eid) {
        //         win = EFightResults.DRAW
        //     }
        //     else {
        //         if (cqid > eid) {
        //             if (cqid == CQType.CLOTH && eid == CQType.STONE) {
        //                 win = EFightResults.LOST;
        //             }
        //             else {
        //                 win = EFightResults.WIN;
        //             }
        //         }
        //         else {
        //             if (eid == CQType.CLOTH && cqid == CQType.STONE) {
        //                 win = EFightResults.WIN;
        //             }
        //             else {
        //                 win = EFightResults.LOST;
        //             }
        //         }
        //     }
        //     retMsg.cqresult.win = win
        //     let lv = retRoleALLInfo.roleInfo.info.cq[cqid];
        //     retMsg.cqresult.skill = (new Tablecaiquan(cqid, lv)).skill;
        // }

        let fight_hero_list: number[] = [];
        for (let index = 0; index < dto.fightGroup.length; index++) {
            const hero_group = dto.fightGroup[index];
            let is_have = cFightSystem.isHaveHeroByGroup(hero_group, roleHero, fight_hero_list);
            if (!is_have) {
                retMsg.msg = `英雄类型${hero_group}不存在`;
                return retMsg;
            }
        }

        /**循环战斗是否结束 */
        let is_over = false;
        /**战斗循环次数 */
        let count = 0;
        /**关卡战斗怪物配置 */
        //   const monster_team: number[][] = gameLevels_table.monster
        /**关卡节点最大数 */
        const max_pos = 3//monster_team.length;
        /**战斗可能发生的最多循环次数 */
        const max_count = max_pos + dto.fightGroup.length;
        /**当前关卡节点 */
        let new_pos = 0;

        retMsg.allfights = [];
        retMsg.isPass = false;
        roleInfo.info.fightGroup = dto.fightGroup;

        //初始化英雄血量
        cFightSystem.initFightHeroHP(roleHero, roleInfo);
        //初始化怪物血量
        roleInfo.info.fightMonsterHp = {};

        /**目标服务器id */
        let serverid = (d.kf ? d.crossServerId : roleKeyDto.serverid)
        //对方积分
        let foePoint = Number(userid)
        let Edata: any = {};
        if (usertype == EObjtype.HERO) {
            foePoint = arenaRank[String(userid)]?.val || 1000;
            await this.getEnemyInfo(serverid, String(userid), d.RankType, Edata)
            if (!Edata.roleHero || !Edata.roleSubInfo) {
                retMsg.msg = '对方数据有误';
                return retMsg;
            }
            Edata.isHero = true;
            roleInfo.info.fightMonsterHp = cFightSystem.initFightHeroHP(Edata.roleHero, { info: Edata.roleSubInfo });
        }

        while (!is_over) {
            let fightReqEntity: FightReqEntity = {
                pos: new_pos, levels: (d.kf ? d.crossServerId : roleKeyDto.serverid),
                id: (userid), edata: Edata
            }
            let cur_resFightCommonInfo = new RESFightCommonInfo();
            cur_resFightCommonInfo.glPos = new_pos;
            //进行战斗
            let isok = await this.fightService.goFight(d.FightType, roleKeyDto, roleInfo, fightReqEntity, roleHero, cur_resFightCommonInfo);
            if (!isok) {
                delete retMsg.allfights;
                retMsg.msg = clone(cur_resFightCommonInfo.msg);
                return retMsg;
            }

            delete cur_resFightCommonInfo.msg;
            delete cur_resFightCommonInfo.ok;
            retMsg.allfights.push(cur_resFightCommonInfo);

            //单个战斗小局胜负处理
            if (cur_resFightCommonInfo.results === EFightResults.WIN) {
                new_pos++;
                //初始化怪物血量
                // roleInfo.info.fightMonsterHp = {};
                //是否已通关 
                if (new_pos >= max_pos) {
                    //胜利
                    retMsg.isPass = true;
                    is_over = true;
                    break;
                }
            }
            else {

                //如果打平 设置英雄为战死
                if (cur_resFightCommonInfo.results === EFightResults.DRAW) {
                    //当前出战英雄血量重置为死亡
                    let cur_heroid = fight_hero_list.shift();
                    if (cur_heroid && roleHero[cur_heroid]) {
                        roleHero[cur_heroid].curHP = 0;
                    }
                }
                //是否失败
                if (cFightSystem.isAllOver(dto.fightGroup, roleHero)) {
                    is_over = true;
                    retMsg.isPass = false;
                    break;
                }
            }

            //异常处理
            count++;
            if (count > max_count) {
                is_over = true;
                retMsg.msg = "战斗过长异常";
                return retMsg;
            }

        }
        let point = Math.floor((foePoint - arenainfo.point) / 50);
        const basepoint = d.base_jf;
        //胜负处理
        let cur_point = 0
        let wincount = 0

        if (retMsg.isPass) {
            cur_point += basepoint + point;
            arenainfo.show = [];
            //加道具
            const getitem = d.challenge_getitem
            retMsg.additem = {};
            for (const key in getitem) {
                const itemid = Number(key)
                const item_num = getitem[key];
                cItemBag.addItem(roleItem, retMsg.additem, itemid, item_num);
            }
            if (usertype == EObjtype.HERO) {
                //免战
                if (arenainfo.nowar == undefined) {
                    arenainfo.nowar = {};
                }
                arenainfo.nowar[userid] = new Date().getTime();
            }
            // //佣兵激活条件
            // let actinfo = retRoleALLInfo.roleSubInfo.mercenary?.actinfo
            // if (actinfo && actinfo.an !== undefined) {
            //     actinfo.an++;
            //     wincount = actinfo.an
            // }
        }
        else //if(retMsg.results === EFightResults.LOST)
        {
            cur_point -= basepoint + point;
        }

        if (arenaRank[String(req.user.id)]) {
            arenainfo.point = arenaRank[String(req.user.id)].val;
        }

        let arenaFightInfo: ArenaFightInfo = {
            wincount: wincount,
            /**自己的积分*/
            ourpoint: arenainfo.point,
            /**自己变化的积分*/
            ourchangepoint: cur_point,
            /**对方的积分*/
            foepoint: foePoint,
            /**对方变化的积分*/
            foechangepoint: -cur_point
        }
        retMsg.arenainfo = arenaFightInfo;

        arenainfo.point += cur_point
        if (usertype == EObjtype.HERO) {
            let roleCommonEntity: RoleCommonEntity = {
                n: roleInfo.info.name,
                lv: roleInfo.rolelevel,
                c: roleInfo.info.ico,
            }

            let arenaLogEntity: ArenaLogEntity = {
                // id?: number
                seasonid: d.seasonid || arenainfo.season,
                serverid: roleKeyDto.serverid,
                roleid: String(userid),   //被攻击者
                atkid: roleKeyDto.id,    //攻击者 
                point: -cur_point,
                // time?: Date
                state: EArenaSatate.NORMAL,
                info: roleCommonEntity,
                // needsave?: boolean;
            }
            if (d.kf) {
                arenaLogEntity.crossServerid = d.crossServerId
                await this.gameDataService.sendRoleCrossArenaLog(arenaLogEntity);
            } else {
                await this.gameDataService.sendRoleArenaLog(arenaLogEntity);
            }
            let uroleKeyDto: any = { id: String(userid), serverid: roleKeyDto.serverid }

            let ugetRoleALLInfoDto = new GetRoleALLInfoDto(uroleKeyDto);
            ugetRoleALLInfoDto.need_roleInfo = true;
            ugetRoleALLInfoDto.need_roleHero = true;
            //获取被攻击角色信息
            let uretRoleALLInfo: RetRoleALLInfo = await this.gameDataService.getRoleAllInfo(ugetRoleALLInfoDto);
            let online = uretRoleALLInfo.isHaveData();
            // await this.gameDataService.changeSAreanRank(uroleKeyDto, -cur_point, arenaRank, online ? uretRoleALLInfo : null);
            if (online) {
                await this.gameDataService.changeServerRankByType(uretRoleALLInfo, d.RankType, foePoint - cur_point);
            } else {
                let data = { roleid: uroleKeyDto.id, serverid: d.crossServerId }
                await this.gameDataService.changeOthersServerRankByType(data, d.RankType, foePoint - cur_point);
            }
        }

        await this.gameDataService.changeServerRankByType(retRoleALLInfo, d.RankType, arenainfo.point);
        //

        delete retRoleALLInfo.roleInfo.info.fightGroup;
        delete retRoleALLInfo.roleInfo.info.fightMonsterHp;
        await this.gameDataService.updateRoleInfo(roleKeyDto, roleInfo);
        await this.gameDataService.updateRoleHero(roleKeyDto, roleHero);
        await this.gameDataService.updateRoleItem(roleKeyDto, roleItem);

        languageConfig.setActTypeSuccess(EActType.ARENA_FIGHT, retMsg);
        return retMsg;

    }

    async getEnemyInfo(serverid: number, strid: string, ranktype: EGameRankType, Edata: any) {

        let RankData = await this.gameDataService.getServerRankByType(serverid, ranktype);
        if (!RankData || !RankData[strid]) {
            return false
        }

        Edata = Edata || {}
        await this.gameDataService.setRankInfo(RankData[strid].serverid, strid, RankData, false)
        Edata.roleHero = RankData[strid].info.rh;
        Edata.roleSubInfo = new RoleSubInfoEntity();
        loadRoleInfo(Edata.roleSubInfo, RankData[strid].info);

        return true;
    }


}
