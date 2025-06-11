import { Injectable } from '@nestjs/common';
import { cloneDeep } from 'lodash';
import { setEnvironmentData } from 'worker_threads';
import { EActType, EGuildPost } from '../../config/game-enum';
import { TableGameConfig } from '../../config/gameTable/TableGameConfig';
import { TableGameSys } from '../../config/gameTable/TableGameSys';
import { TableGuildLv } from '../../config/gameTable/TableGuildLv';
import { enconfig } from '../../config/language/en';
import { languageConfig } from '../../config/language/language';
import { RoleShowInfoRecord } from '../../game-data/entity/arena.entity';
import { RoleAddExp } from '../../game-data/entity/common.entity';
import { GuildEntity, GuildInfoEntity, guildLog, GuildRankinfo, GuildRoleinfo, mInfo } from '../../game-data/entity/guild.entity';
import { HerosRecord } from '../../game-data/entity/hero.entity';
import { RESCreateGuildMsg, RESGuildMsg, RESGuildRankMsg } from '../../game-data/entity/msg.entity';
import { RoleInfoEntity, RoleSubInfoEntity } from '../../game-data/entity/roleinfo.entity';
import { GameDataService, getGuildInfoHmKey, getGuildInfoKey, GetRoleALLInfoDto, getSRinfoKey, } from '../../game-data/gamedata.service';
import { RoleKeyDto } from '../../game-data/role/dto/role-key.dto';
import { Filter } from '../../game-lib/sensitiveword/filter';
import { cTools } from '../../game-lib/tools';
import { cGameCommon, RetRoleALLInfo } from '../game-common';
import { cGameServer } from '../game-server';
import { cItemBag } from '../item/item-bag';
import { changeDto, createDto, guildDto, joinDto, listDto, setLeaderDto } from './dto/guild.dto';

@Injectable()
export class GuildService {
    constructor(
        private readonly gameDataService: GameDataService,
    ) {
    }

    async init(req: any) {

        let d: any = { msg: 'ok' }
        d.roleKeyDto = { id: req.user.id, serverid: req.user.serverid };
        let getRoleALLInfoDto = new GetRoleALLInfoDto(d.roleKeyDto);
        getRoleALLInfoDto.need_roleInfo = true;
        getRoleALLInfoDto.need_roleHero = true;
        getRoleALLInfoDto.need_roleItem = true;
        //获取角色信息
        d.retRoleALLInfo = await this.gameDataService.getRoleAllInfo(getRoleALLInfoDto);
        if (!d.retRoleALLInfo.isHaveData()) {
            d.msg = d.retRoleALLInfo.getRetMsg();
        }
        else if (!cGameCommon.isOpenSystem(d.retRoleALLInfo, TableGameSys.guild)) {
            d.msg = languageConfig.tip.not_open_system;//系统是否开放
        }
        d.offline_day = TableGameConfig.guild_offline_day;
        d.await_time = TableGameConfig.guild_await_time;
        return d

    }

    ckStr(name: string) {
        let msg = 'ok'
        if (!name || name.trim() === '') {
            msg = '不能为空'
        }
        else if (name.length > TableGameConfig.guild_name_length) {
            msg = '长度不能超过' + TableGameConfig.guild_name_length
        }
        else {
            let ret = Filter.search(name)
            if (ret.success) {
                msg = '名称不合规';
            }
        }
        return msg;
    }

    async create(req: any, dto: createDto) {

        let retMsg: RESCreateGuildMsg = new RESCreateGuildMsg();
        let nMsg = this.ckStr(dto.name)
        if (nMsg !== 'ok') {
            retMsg.msg = nMsg
            return retMsg
        }
        let d = await this.init(req)
        if (d.msg != 'ok') {
            retMsg.msg = d.msg
            return retMsg
        }
        let roleInfo: RoleInfoEntity = d.retRoleALLInfo.roleInfo
        if (roleInfo.info.guild && roleInfo.info.guild.guildid !== '') {
            retMsg.msg = '已有公会，不能再创建'
            return retMsg
        }
        //道具是否足够
        let costitem = TableGameConfig.guild_costitem
        if (costitem && Object.keys(costitem).length > 0) {
            cItemBag.costItem(d.retRoleALLInfo.roleItem, costitem, retMsg);
            if (!retMsg.ok) { return retMsg; }
            await this.gameDataService.updateRoleItem(d.roleKeyDto, d.retRoleALLInfo.roleItem);
        }
        let serverid = req.user.serverid;
        const guildid = this.gameDataService.getEquipEID()
        let gameCacheService = this.gameDataService.getGameCacheService();
        // let allGuild: GuildEntity[] = await gameCacheService.getHash(getGuildInfoHmKey(serverid));
        let guild: GuildEntity = new GuildEntity()
        guild.guildid = guildid
        guild.serverid = serverid
        guild.name = dto.name
        guild.needSave = true
        let info: GuildInfoEntity = {
            /** 帮会等级*/
            level: 1,
            /** 帮会经验*/
            exp: 0,
            /** 旗帜*/
            flag: dto.flag,
            /** 成员*/
            member: [],
            /** 是否开放允许随时加入*/
            open: dto.open,
            /** 宣言*/
            desc: dto.desc,
            /** 公告*/
            notice: dto.notice,
            /** 动态日志*/
            log: [],
            /** 非正式成员*/
            unMember: [],
        }
        let minfo: mInfo = new mInfo(EGuildPost.LEADER, roleInfo, d.retRoleALLInfo.roleHero);

        info.member.push(minfo)
        info.log.push(new guildLog(roleInfo.info.name + enconfig.act_type[EActType.GUILD_CREATE]))
        guild.info = info;
        await gameCacheService.setHash(getGuildInfoHmKey(serverid), guildid, guild);

        roleInfo.info.guild = new GuildRoleinfo(guildid, (new Date().getTime()))
        //保存到内存
        await this.gameDataService.updateRoleInfo(d.roleKeyDto, roleInfo);
        retMsg.rguild = roleInfo.info.guild
        retMsg.sguild = guild
        let new_system = cGameCommon.checkOpenNewSystem(d.retRoleALLInfo);
        if (new_system) {
            retMsg.roleAddExp = new RoleAddExp();
            retMsg.roleAddExp.newSystem = new_system;
            await this.gameDataService.updateRoleInfo(d.roleKeyDto, roleInfo);
        }
        languageConfig.setActTypeSuccess(EActType.GUILD_CREATE, retMsg);
        
        return retMsg;



    }

    async join(req: any, dto: joinDto) {

        let retMsg: RESGuildMsg = new RESGuildMsg();
        let d = await this.init(req)
        if (d.msg != 'ok') {
            retMsg.msg = d.msg
            return retMsg
        }
        let roleInfo: RoleInfoEntity = d.retRoleALLInfo.roleInfo
        if (roleInfo.info.guild && roleInfo.info.guild.guildid !== '') {
            retMsg.msg = '已有公会，不能再加入'
            return retMsg
        }
        let leaveTime = roleInfo?.info?.guild?.leaveTime;
        let lt = Math.floor(((new Date()).getTime() - leaveTime) / 1000)
        if (leaveTime && lt < d.await_time) {
            retMsg.msg = '冷却时间还剩' + (d.await_time - lt) + '秒！'
            return retMsg
        }
        let serverid = req.user.serverid;
        let guildid = dto.gid;
        let gameCacheService = this.gameDataService.getGameCacheService();
        let guild: any;
        if (!guildid) {
            let all: GuildEntity[] = await gameCacheService.getHash(getGuildInfoHmKey(serverid)) || [];
            guild = all.find(item => {
                let tab = new TableGuildLv(item.info.level);
                return ((item.info.member.length < tab.limit) &&
                    (item.info.needlv ?? 0) <= roleInfo.rolelevel &&
                    item.info.open)
            });
            if (!guild) {
                retMsg.msg = '无可加入的公会'
                return retMsg
            }
            guildid = guild.guildid;
        }
        else {
            guild = await gameCacheService.getHash(getGuildInfoHmKey(serverid), guildid);
        }

        if (!guild) {
            retMsg.msg = '无此公会'
            return retMsg
        }
        if ((guild.info?.needlv ?? 0) > roleInfo.rolelevel) {
            retMsg.msg = '角色等级不足'
            return retMsg
        }
        let tab = new TableGuildLv(guild.info.level)
        if (guild.info.member.length >= tab.limit) {
            retMsg.msg = '人数已满'
            return retMsg
        }
        let minfo: mInfo = new mInfo(EGuildPost.MEMBER, roleInfo, d.retRoleALLInfo.roleHero);

        let log_str = ''
        if (guild.info.open) {
            guild.info.member.push(minfo)
            // guild.info.member = Array.from(new Set(guild.info.member))
            log_str = roleInfo.info.name + enconfig.act_type[EActType.GUILD_JOIN];

            roleInfo.info.guild = new GuildRoleinfo(guildid, (new Date().getTime()))
            //保存到内存
            await this.gameDataService.updateRoleInfo(d.roleKeyDto, roleInfo);
            retMsg.rguild = roleInfo.info.guild
            let new_system = cGameCommon.checkOpenNewSystem(d.retRoleALLInfo);
            if (new_system) {
                retMsg.roleAddExp = new RoleAddExp();
                retMsg.roleAddExp.newSystem = new_system;
                await this.gameDataService.updateRoleInfo(d.roleKeyDto, roleInfo);
            }
        }
        else {
            guild.info.unMember = guild.info.unMember || []
            let unMember: mInfo[] = guild.info.unMember;
            const unM: mInfo = unMember.find(item => item.id === roleInfo.info.roleid)
            if (unM) {
                retMsg.msg = '已申请过'
                return retMsg
            }
            guild.info.unMember.push(minfo)
            log_str = roleInfo.info.name + '申请加入公会，等待会长通过';

            let member: mInfo[] = guild.info.member || []
            let LMem = member.find(item => item.post === EGuildPost.LEADER)
            let LroleKeyDto: RoleKeyDto = { id: LMem.id, serverid: serverid }
            let LroleInfo: RoleInfoEntity = await this.gameDataService.getRoleInfo(LroleKeyDto)
            if (LroleInfo?.info) {
                LroleInfo.info.redDot = LroleInfo.info.redDot || {}
                LroleInfo.info.redDot[TableGameSys.guild] = true;
                await this.gameDataService.updateRoleInfo(LroleKeyDto, LroleInfo);
            }



        }
        guild.info.log.push(new guildLog(log_str))
        guild.needSave = true;
        await gameCacheService.setHash(getGuildInfoHmKey(serverid), guildid, guild);
        retMsg.sguild = cloneDeep(guild)
        languageConfig.setActTypeSuccess(EActType.GUILD_JOIN, retMsg);
        return retMsg;


    }

    async leave(req: any, dto: guildDto) {

        let retMsg: RESGuildMsg = new RESGuildMsg();
        let d = await this.init(req)
        if (d.msg != 'ok') {
            retMsg.msg = d.msg
            return retMsg
        }
        let roleInfo: RoleInfoEntity = d.retRoleALLInfo.roleInfo
        if (!roleInfo.info.guild || (roleInfo.info.guild && roleInfo.info.guild.guildid === '')) {
            retMsg.msg = '没有公会'
            return retMsg
        }
        let serverid = req.user.serverid;
        let rguild = roleInfo.info.guild
        const gid = rguild.guildid
        let gameCacheService = this.gameDataService.getGameCacheService();
        let guild: GuildEntity = await gameCacheService.getHash(getGuildInfoHmKey(serverid), gid);
        if (!guild) {
            retMsg.msg = '无此公会'
            return retMsg
        }
        let member: mInfo[] = guild.info.member
        let index = member.findIndex(item => item.id === roleInfo.info.roleid)
        if (index === -1) {
            retMsg.msg = '不在此公会'
            return retMsg
        }
        if (member[index].post === EGuildPost.LEADER) {
            retMsg.msg = '会长不能离开'
            return retMsg
        }
        member.splice(index, 1);
        guild.needSave = true;
        guild.info.log.push(new guildLog(roleInfo.info.name + enconfig.act_type[EActType.GUILD_LEAVE]))
        rguild.guildid = '';
        rguild.leaveTime = new Date().getTime();
        // guild.info.member = member;
        await gameCacheService.setHash(getGuildInfoHmKey(serverid), gid, guild);

        //保存到内存
        await this.gameDataService.updateRoleInfo(d.roleKeyDto, roleInfo);
        retMsg.rguild = roleInfo.info.guild
        retMsg.sguild = guild
        languageConfig.setActTypeSuccess(EActType.GUILD_LEAVE, retMsg);
        return retMsg;

    }

    async info(req: any, dto: guildDto) {

        let retMsg: RESGuildMsg = new RESGuildMsg();
        let d = await this.init(req)
        if (d.msg != 'ok') {
            retMsg.msg = d.msg
            return retMsg
        }

        let serverid = req.user.serverid;
        let gameCacheService = this.gameDataService.getGameCacheService();
        let roleInfo: RoleInfoEntity = d.retRoleALLInfo.roleInfo
        let rguild: GuildRoleinfo = roleInfo.info?.guild
        if (rguild && rguild.guildid) {
            let guild: GuildEntity = await gameCacheService.getHash(getGuildInfoHmKey(serverid), rguild.guildid);
            if (!guild) {
                delete roleInfo.info.guild;
                await this.gameDataService.updateRoleInfo(d.roleKeyDto, roleInfo);
            }
            else {
                retMsg.sguild = await this.setGInfo(guild, roleInfo, d.retRoleALLInfo.roleHero);
                if (!dto.flag) {
                    delete retMsg.sguild.info.log;
                }
                retMsg.rguild = rguild;
            }
        }
        else {
            let all: GuildEntity[] = await gameCacheService.getHash(getGuildInfoHmKey(serverid)) || []
            for (let index = 0; index < all.length; index++) {
                let element = all[index];
                let member = element.info.member;
                let Mindex = member.findIndex(item => item.id === roleInfo.info.roleid)
                if (Mindex !== -1) {
                    roleInfo.info.guild = new GuildRoleinfo(element.guildid, (new Date().getTime()))
                    retMsg.sguild = await this.setGInfo(element, roleInfo, d.retRoleALLInfo.roleHero)
                    if (!dto.flag) {
                        delete retMsg.sguild.info.log;
                    }
                    retMsg.rguild = roleInfo.info.guild;
                    await this.gameDataService.updateRoleInfo(d.roleKeyDto, roleInfo);
                    break;
                }

            }
        }


        languageConfig.setActTypeSuccess(EActType.GUILD, retMsg);
        return retMsg;

    }

    async setGInfo(guild: GuildEntity, roleInfo: RoleInfoEntity, roleHero: HerosRecord) {
        if (!guild || !roleInfo || !roleHero) {
            return guild;
        }

        let serverid = roleInfo.info.serverid
        let gameCacheService = this.gameDataService.getGameCacheService();
        let SR_data: RoleShowInfoRecord = await gameCacheService.getJSON(getSRinfoKey(serverid))
        if (!SR_data[roleInfo.info.roleid]) {
            SR_data = await this.gameDataService.addSeverRoleInfo(serverid, roleInfo, roleHero)
        }

        //处理动态日志
        guild.info.log = guild.info.log || []
        let log: any[] = guild.info.log;
        if (log.length > TableGameConfig.guild_log_num) {
            log.splice(0, log.length - TableGameConfig.guild_log_num);
            guild.needSave = true;
        }

        //处理成员信息
        let allfight = 0;
        let member: mInfo[] = guild.info.member;
        for (let index = 0; index < member.length; index++) {
            let element = member[index];
            if (!SR_data[element.id]) { continue }
            allfight += element.fight = SR_data[element.id].f;
            element.name = SR_data[element.id].n
            element.ico = SR_data[element.id].c
            element.llt = SR_data[element.id].llt
        }
        guild.info.af = allfight;
        await gameCacheService.setHash(getGuildInfoHmKey(serverid), guild.guildid, guild);
        return guild;

    }

    /**管理公会 */
    async change(req: any, dto: changeDto) {

        let retMsg: RESGuildMsg = new RESGuildMsg();
        let d = await this.init(req)
        if (d.msg != 'ok') {
            retMsg.msg = d.msg
            return retMsg
        }
        let roleInfo: RoleInfoEntity = d.retRoleALLInfo.roleInfo
        if (!roleInfo.info.guild || (roleInfo.info.guild && roleInfo.info.guild.guildid === '')) {
            retMsg.msg = '没有公会'
            return retMsg
        }
        let serverid = req.user.serverid;
        let rguild = roleInfo.info.guild
        const gid = rguild.guildid
        let gameCacheService = this.gameDataService.getGameCacheService();
        let guild: GuildEntity = await gameCacheService.getHash(getGuildInfoHmKey(serverid), gid);
        if (!guild) {
            retMsg.msg = '无此公会'
            return retMsg
        }
        let member: mInfo[] = guild.info.member
        let index = member.findIndex(item => item.id === roleInfo.info.roleid)
        if (index === -1) {
            retMsg.msg = '不在此公会'
            return retMsg
        }
        if (member[index].post !== EGuildPost.LEADER) {
            retMsg.msg = '不是会长不能修改'
            return retMsg
        }
        if (dto.name) {
            let nMsg = this.ckStr(dto.name)
            if (nMsg !== 'ok') {
                retMsg.msg = nMsg
                return retMsg
            }
            guild.name = dto.name;
        }
        if (dto.flag) {
            guild.info.flag = dto.flag;
        }
        if (dto.open !== undefined) {
            guild.info.open = dto.open;
        }
        if (dto.desc) {
            guild.info.desc = dto.desc;
        }
        if (dto.notice) {
            guild.info.notice = dto.notice;
        }
        if (dto.needlv) {
            guild.info.needlv = dto.needlv;
        }
        guild.needSave = true;
        guild.info.log.push(new guildLog(roleInfo.info.name + enconfig.act_type[EActType.GUILD_CHANGE]))
        await gameCacheService.setHash(getGuildInfoHmKey(serverid), gid, guild);
        retMsg.sguild = guild
        languageConfig.setActTypeSuccess(EActType.GUILD_CHANGE, retMsg);
        return retMsg;

    }

    /**解散公会 */
    async dissolve(req: any, dto: guildDto) {

        let retMsg: RESGuildMsg = new RESGuildMsg();
        let d = await this.init(req)
        if (d.msg != 'ok') {
            retMsg.msg = d.msg
            return retMsg
        }

        let serverid = req.user.serverid;
        let guildid: any;
        // if (!dto.flag) {
        let gameCacheService = this.gameDataService.getGameCacheService();
        let roleInfo: RoleInfoEntity = d.retRoleALLInfo.roleInfo
        guildid = roleInfo.info?.guild?.guildid;
        if (guildid) {
            let guild = await gameCacheService.getHash(getGuildInfoHmKey(serverid), guildid);
            if (!guild) {
                retMsg.msg = '无公会'
                return retMsg
            }
            let member: mInfo[] = guild.info.member
            let index = member.findIndex(item => item.id === roleInfo.info.roleid)
            if (index === -1) {
                retMsg.msg = '不在此公会'
                return retMsg
            }
            if (member[index].post !== EGuildPost.LEADER) {
                retMsg.msg = '不是会长不能解散'
                // return retMsg
            }
        } else {
            retMsg.msg = '解散失败'
            return retMsg
        }
        delete roleInfo.info.guild;
        await this.gameDataService.updateRoleInfo(d.roleKeyDto, roleInfo);
        // }
        // else {
        //    guildid = String(dto.flag)
        // }
        this.dissolveGuild(serverid, guildid)

        languageConfig.setActTypeSuccess(EActType.GUILD, retMsg);
        return retMsg;

    }

    async dissolveGuild(serverid: number, gid: string) {
        if (!serverid || !gid) { return }
        let gameCacheService = this.gameDataService.getGameCacheService();
        let prismaGameDB = this.gameDataService.getPrismaGameDB()
        await gameCacheService.hdel(getGuildInfoHmKey(serverid), gid);
        await prismaGameDB.guild.deleteMany({
            where: { guildid: gid },
        });

    }

    /**设置会长 */
    async setLeader(req: any, dto: setLeaderDto) {

        let retMsg: RESGuildMsg = new RESGuildMsg();
        let d = await this.init(req)
        if (d.msg != 'ok') {
            retMsg.msg = d.msg
            return retMsg
        }
        let roleInfo: RoleInfoEntity = d.retRoleALLInfo.roleInfo
        if (!roleInfo.info.guild || (roleInfo.info.guild && roleInfo.info.guild.guildid === '')) {
            retMsg.msg = '没有公会'
            return retMsg
        }
        let serverid = req.user.serverid;
        let rguild = roleInfo.info.guild
        const gid = rguild.guildid
        let gameCacheService = this.gameDataService.getGameCacheService();
        let guild: GuildEntity = await gameCacheService.getHash(getGuildInfoHmKey(serverid), gid);
        if (!guild) {
            retMsg.msg = '无公会'
            return retMsg
        }
        let member: mInfo[] = guild.info.member
        let log_str: string;
        if (dto.type === 2) {
            log_str = ' 申请会长 '

            retMsg.msg = log_str + enconfig.fail
            let leaderInfo = member.find(item => item.post === EGuildPost.LEADER)
            let myInfo = member.find(item => item.id === roleInfo.info.roleid)
            if (!leaderInfo || !myInfo) {
                return retMsg
            }
            let day = cTools.GetDateDayDiff((new Date(leaderInfo.llt)), (new Date))
            if (!day || day <= d.offline_day) {
                return retMsg
            }
            leaderInfo.post = EGuildPost.MEMBER;
            myInfo.post = EGuildPost.LEADER;
            log_str = myInfo.name + log_str + enconfig.success;
        }
        else {
            log_str = ' 转让会长 给：'
            let index = member.findIndex(item => item.id === roleInfo.info.roleid)
            let index2 = member.findIndex(item => item.id === dto.leader)
            if (index === -1 || index2 === -1) {
                retMsg.msg = '不在此公会'
                return retMsg
            }
            if (member[index].post !== EGuildPost.LEADER) {
                retMsg.msg = '不是会长不能转让'
                return retMsg
            }
            member[index].post = EGuildPost.MEMBER;
            member[index2].post = EGuildPost.LEADER;
            log_str = member[index].name + log_str + member[index2].name;
        }
        guild.needSave = true;
        guild.info.log.push(new guildLog(log_str));
        await gameCacheService.setHash(getGuildInfoHmKey(serverid), gid, guild);
        retMsg.sguild = guild
        languageConfig.setActTypeSuccess(EActType.GUILD_CHANGE_LEADER, retMsg);
        return retMsg;

    }

    /**排行榜 */
    async rank(req: any, dto: guildDto) {

        let retMsg: RESGuildRankMsg = new RESGuildRankMsg();
        let d = await this.init(req)
        if (d.msg != 'ok') {
            retMsg.msg = d.msg
            return retMsg
        }

        let serverid = req.user.serverid;
        let gameCacheService = this.gameDataService.getGameCacheService();
        let roleInfo: RoleInfoEntity = d.retRoleALLInfo.roleInfo
        // let rguild: GuildRoleinfo = roleInfo.info?.guild
        let sguild: GuildRankinfo[] = [];
        let all = await gameCacheService.getHash(getGuildInfoHmKey(serverid)) || [];
        all.sort((a: GuildEntity, b: GuildEntity) => {
            if (a?.info?.af === undefined) { return 1 }
            if (b?.info?.af === undefined) { return -1 }
            return (Number(b.info.af) - Number(a.info.af))
        })
        for (let index = 0; index < all.length; index++) {
            // delete all[index].info.log
            let guild: GuildEntity = all[index];
            let ginfo: GuildInfoEntity = guild.info;
            ginfo.rank = index + 1;

            await gameCacheService.setHash(getGuildInfoHmKey(serverid), guild.guildid, guild);

            // const member: mInfo = ginfo.member.find(item => item.post === EGuildPost.LEADER)
            // const unMember: mInfo = ginfo.unMember.find(item => item.id === roleInfo.info.roleid)
            // if (!member) { continue }
            // let tab = new TableGuildLv(ginfo.level)
            // let data: GuildRankinfo = {
            //     gid: guild.guildid,
            //     gname: guild.name,
            //     glv: ginfo.level,
            //     flag: ginfo.flag,
            //     af: ginfo.af || 0,
            //     leadername: member.name,
            //     cur: ginfo.member.length,
            //     limit: tab.limit,
            //     apply: (unMember ? true : false),
            //     rank: ginfo.rank,
            // }
            let data: GuildRankinfo = this.conInfo(guild, roleInfo.info.roleid)
            sguild.push(data);
            if (ginfo.member.find(item => item.id === roleInfo.info.roleid)) {
                retMsg.guild = data;
            }
        }

        // sguild.sort((a, b) => {
        //     if (a?.af === undefined) { return 1 }
        //     if (b?.af === undefined) { return -1 }
        //     return (Number(b.af) - Number(a.af))
        // })
        // for (let index = 0; index < sguild.length; index++) {
        //     let element = sguild[index];
        //     element.rank = index+1
        // }
        // retMsg.rguild = sguild  //info
        retMsg.sguild = sguild
        languageConfig.setActTypeSuccess(EActType.GUILD, retMsg);
        return retMsg;

    }

    /**简洁公会数据 */
    conInfo(guild: GuildEntity, roleid: string = '') {
        let ginfo: GuildInfoEntity = guild.info;
        const member: mInfo = ginfo.member.find(item => item.post === EGuildPost.LEADER)
        const unMember: mInfo = ginfo.unMember.find(item => item.id === roleid)
        // if (!member) { continue }
        let tab = new TableGuildLv(ginfo.level)
        let data: GuildRankinfo = {
            gid: guild.guildid,
            gname: guild.name,
            glv: ginfo.level,
            flag: ginfo.flag,
            af: ginfo.af || 0,
            leadername: member.name,
            cur: ginfo.member.length,
            limit: tab.limit,
            apply: (unMember ? true : false),
            rank: ginfo.rank,
        }
        return data;
    }

    /**会长处理-申请列表 */
    async applyList(req: any, dto: listDto) {

        let retMsg: RESGuildMsg = new RESGuildMsg();
        let d = await this.init(req)
        if (d.msg != 'ok') {
            retMsg.msg = d.msg
            return retMsg
        }
        let roleInfo: RoleInfoEntity = d.retRoleALLInfo.roleInfo
        if (!roleInfo.info.guild || (roleInfo.info.guild && roleInfo.info.guild.guildid === '')) {
            retMsg.msg = '没有公会'
            return retMsg
        }
        let serverid = req.user.serverid;
        let rguild = roleInfo.info.guild
        const gid = rguild.guildid
        let gameCacheService = this.gameDataService.getGameCacheService();
        let guild: GuildEntity = await gameCacheService.getHash(getGuildInfoHmKey(serverid), gid);
        if (!guild) {
            retMsg.msg = '无此公会'
            return retMsg
        }
        let member: mInfo[] = guild.info.member
        let index = member.findIndex(item => item.id === roleInfo.info.roleid)
        if (index === -1) {
            retMsg.msg = '不在此公会'
            return retMsg
        }
        if (member[index].post !== EGuildPost.LEADER) {
            retMsg.msg = '不是会长不能修改'
            return retMsg
        }
        let unMember: mInfo[] = guild.info.unMember
        if (!unMember) {
            retMsg.msg = '申请列表为空'
            return retMsg
        }
        let logStr = ' 通过 '
        let allG: GuildEntity[] = await gameCacheService.getHash(getGuildInfoHmKey(serverid)) || [];
        if (dto.index !== undefined && dto.index !== null) {
            let mData = unMember[dto.index]
            if (!mData) {
                retMsg.msg = '参数有误' + dto.index;
                return retMsg
            }
            unMember.splice(dto.index, 1);
            if (findMember(mData.id)) {
                guild.needSave = true;
                await gameCacheService.setHash(getGuildInfoHmKey(serverid), gid, guild);
                retMsg.msg = '该玩家已加入公会';
                return retMsg
            }
            member.push(mData);
            logStr = logStr + mData.name;
        }
        else {
            for (let index = 0; index < unMember.length; index++) {
                const mData = unMember[index];
                if (!findMember(mData.id)) {
                    member.push(mData);
                    logStr = logStr + mData.name;
                }
            }
            unMember = [];
        }

        function findMember(rid: string) {
            if (!rid) {
                return false
            }
            for (let index = 0; index < allG.length; index++) {
                const mem: mInfo[] = allG[index].info.member;
                let ret = mem.find(item => item.id === rid)
                if (ret !== undefined) {
                    return true;
                }

            }
            return false;
        }


        guild.needSave = true;
        guild.info.log.push(new guildLog(roleInfo.info.name + logStr + ' 入会 '))
        await gameCacheService.setHash(getGuildInfoHmKey(serverid), gid, guild);
        retMsg.sguild = guild
        languageConfig.setActTypeSuccess(EActType.GUILD_CHANGE, retMsg);
        return retMsg;

    }


    async getGuild(req: any, dto: joinDto) {

        let retMsg: RESGuildMsg = new RESGuildMsg();
        let d = await this.init(req)
        if (d.msg != 'ok') {
            retMsg.msg = d.msg
            return retMsg
        }

        let serverid = req.user.serverid;
        let gameCacheService = this.gameDataService.getGameCacheService();
        let guild: GuildEntity = await gameCacheService.getHash(getGuildInfoHmKey(serverid), dto.gid);
        if (!guild) {
            retMsg.msg = '无此公会'
            return retMsg
        }
        retMsg.sguild = await this.setGInfo(guild, d.retRoleALLInfo.roleInfo, d.retRoleALLInfo.roleHero);
        delete retMsg.sguild.info.log;
        languageConfig.setActTypeSuccess(EActType.GUILD, retMsg);
        return retMsg;

    }


    async search(req: any, dto: joinDto) {

        let retMsg: RESGuildRankMsg = new RESGuildRankMsg();
        let d = await this.init(req)
        if (d.msg != 'ok') {
            retMsg.msg = d.msg
            return retMsg
        }

        let roleInfo: RoleInfoEntity = d.retRoleALLInfo.roleInfo
        let serverid = req.user.serverid;
        let guildid = dto.gid;
        let gameCacheService = this.gameDataService.getGameCacheService();
        // let guild;
        let guild: GuildEntity = await gameCacheService.getHash(getGuildInfoHmKey(serverid), guildid);
        if (!guild) {
            let all: GuildEntity[] = await gameCacheService.getHash(getGuildInfoHmKey(serverid));
            if (!all) {
                retMsg.msg = '无公会'
                return retMsg
            }
            guild = all.find(item => {
                return ((item.name === guildid))//guildid 可能是公会名
            });
            if (!guild) {
                retMsg.msg = '无可加入的公会'
                return retMsg
            }
        }


        retMsg.guild = this.conInfo(guild)
        languageConfig.setActTypeSuccess(EActType.GUILD, retMsg);
        return retMsg;


    }



}
