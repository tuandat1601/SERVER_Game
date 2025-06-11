import { Injectable } from '@nestjs/common';
import { cloneDeep } from 'lodash';
import { EActType } from '../../config/game-enum';
import { TableAureole } from '../../config/gameTable/TableAureole';
import { TableGameConfig } from '../../config/gameTable/TableGameConfig';
import { TableGameSys } from '../../config/gameTable/TableGameSys';
import { languageConfig } from '../../config/language/language';
import { RESAureoleUpMsg } from '../../game-data/entity/msg.entity';
import { GameDataService, GetRoleALLInfoDto } from '../../game-data/gamedata.service';
import { RoleKeyDto } from '../../game-data/role/dto/role-key.dto';
import { cGameCommon, RetRoleALLInfo } from '../game-common';
import { cpHero } from '../hero/hero-cpattr';
import { cItemBag } from '../item/item-bag';
import { AureoleDto } from './dto/aureole.dto';

@Injectable()
export class AureoleService {
    constructor(
        private readonly gameDataService: GameDataService,
    ) {
    }
    async up(req: any) {
        let roleKeyDto: RoleKeyDto = { id: req.user.id, serverid: req.user.serverid };

        let retMsg: RESAureoleUpMsg = new RESAureoleUpMsg();
        let getRoleALLInfoDto = new GetRoleALLInfoDto(roleKeyDto);
        getRoleALLInfoDto.need_roleInfo = true;
        getRoleALLInfoDto.need_roleHero = true;
        getRoleALLInfoDto.need_roleItem = true;

        //获取角色信息
        let retRoleALLInfo: RetRoleALLInfo = await this.gameDataService.getRoleAllInfo(getRoleALLInfoDto);
        if (!retRoleALLInfo.isHaveData()) {
            retMsg.msg = retRoleALLInfo.getRetMsg();
            return retMsg;
        }
        //系统是否开放
        if (!cGameCommon.isOpenSystem(retRoleALLInfo, TableGameSys.aureole)) {
            retMsg.msg = languageConfig.tip.not_open_system;
            return retMsg;
        }
        let aureole = retRoleALLInfo.roleSubInfo.aureole
        if (!aureole) {
            retMsg.msg = languageConfig.tip.error_system_data;
            return retMsg;
        }

        let tab = new TableAureole(aureole.id)
        if (!tab) {
            retMsg.msg = 'TableAureole err!';
            return retMsg;
        }
        if (tab.nextid == 0) {
            retMsg.msg = '已满级';
            return retMsg;
        }
        let ntab = new TableAureole(tab.nextid)
        if (ntab && (ntab.rank > retRoleALLInfo.roleSubInfo?.upgrade ?? 0)) {
            retMsg.msg = '光环等阶不能高于佣兵等阶';
            return retMsg;
        }

        cItemBag.costItem(retRoleALLInfo.roleItem, tab.costitem, retMsg);
        if (!retMsg.ok) { return retMsg; }

        aureole.id = tab.nextid;
        retMsg.aureole = aureole;
        //属性
        for (const heroid in retRoleALLInfo.roleHero) {
            if (Object.prototype.hasOwnProperty.call(retRoleALLInfo.roleHero, heroid)) {
                const heroEntity = retRoleALLInfo.roleHero[heroid];
                heroEntity.id = Number(heroid)
                cpHero.cpHeroAttr(heroEntity, retRoleALLInfo.roleInfo.info)
                retMsg.hero = retMsg.hero || {};
                retMsg.hero[heroid] = cloneDeep(heroEntity);
            }
        }
        retRoleALLInfo.roleHero = cloneDeep(retMsg.hero);
        await this.gameDataService.updateRoleHero(roleKeyDto, retRoleALLInfo.roleHero);
        await this.gameDataService.updateRoleInfo(roleKeyDto, retRoleALLInfo.roleInfo);
        await this.gameDataService.updateRoleItem(roleKeyDto, retRoleALLInfo.roleItem);

        languageConfig.setActTypeSuccess(EActType.AUREOLEUP, retMsg);

        return retMsg;
    }

    async act(req: any, aureoleDto: AureoleDto) {
        let roleKeyDto: RoleKeyDto = { id: req.user.id, serverid: req.user.serverid };

        let retMsg: RESAureoleUpMsg = new RESAureoleUpMsg();
        let getRoleALLInfoDto = new GetRoleALLInfoDto(roleKeyDto);
        getRoleALLInfoDto.need_roleInfo = true;
        getRoleALLInfoDto.need_roleHero = true;
        getRoleALLInfoDto.need_roleItem = true;

        //获取角色信息
        let retRoleALLInfo: RetRoleALLInfo = await this.gameDataService.getRoleAllInfo(getRoleALLInfoDto);
        if (!retRoleALLInfo.isHaveData()) {
            retMsg.msg = retRoleALLInfo.getRetMsg();
            return retMsg;
        }
        //系统是否开放
        if (!cGameCommon.isOpenSystem(retRoleALLInfo, TableGameSys.aureole)) {
            retMsg.msg = languageConfig.tip.not_open_system;
            return retMsg;
        }
        let aureole = retRoleALLInfo.roleSubInfo.aureole
        if (!aureole) {
            retMsg.msg = languageConfig.tip.error_system_data;
            return retMsg;
        }
        if (aureole.act.includes(aureoleDto.type)) {
            retMsg.msg = '重复激活';
            return retMsg;
        }
        let tab = new TableAureole(aureole.id)
        if (!tab) {
            retMsg.msg = 'TableAureole err!';
            return retMsg;
        }
        let rank = tab.rank;
        let lv = tab.lv;
        // let t_type = TableGameConfig.aureole_type;
        // if (!t_type.includes(aureoleDto.type)) {
        //     retMsg.msg = '没有此类型';
        //     return retMsg;
        // }

        let atab = TableAureole.getTable();
        let actid = 0;
        let actcostitem = {}
        for (const key in atab) {
            if (Object.prototype.hasOwnProperty.call(atab, key)) {
                const d = atab[key];
                if (d.rank == rank && d.lv == lv && d.type == aureoleDto.type) {
                    actid = Number(key);
                    actcostitem = d.actcostitem;
                    break;
                }

            }
        }
        if (actid === 0 || actid === undefined) {
            retMsg.msg = '类型错误';
            return retMsg;
        }


        cItemBag.costItem(retRoleALLInfo.roleItem, actcostitem, retMsg);
        if (!retMsg.ok) { return retMsg; }

        aureole.id = actid;
        aureole.act.push(aureoleDto.type)

        retMsg.aureole = aureole;
        //属性
        for (const heroid in retRoleALLInfo.roleHero) {
            if (Object.prototype.hasOwnProperty.call(retRoleALLInfo.roleHero, heroid)) {
                const heroEntity = retRoleALLInfo.roleHero[heroid];
                heroEntity.id = Number(heroid)
                cpHero.cpHeroAttr(heroEntity, retRoleALLInfo.roleInfo.info)
                retMsg.hero = retMsg.hero || {};
                retMsg.hero[heroid] = cloneDeep(heroEntity);
            }
        }
        retRoleALLInfo.roleHero = cloneDeep(retMsg.hero);
        await this.gameDataService.updateRoleHero(roleKeyDto, retRoleALLInfo.roleHero);
        await this.gameDataService.updateRoleInfo(roleKeyDto, retRoleALLInfo.roleInfo);
        await this.gameDataService.updateRoleItem(roleKeyDto, retRoleALLInfo.roleItem);
        languageConfig.setActTypeSuccess(EActType.AUREOLEACT, retMsg);

        return retMsg;
    }

    async use(req: any, aureoleDto: AureoleDto) {
        let roleKeyDto: RoleKeyDto = { id: req.user.id, serverid: req.user.serverid };

        let retMsg: RESAureoleUpMsg = new RESAureoleUpMsg();
        let getRoleALLInfoDto = new GetRoleALLInfoDto(roleKeyDto);
        getRoleALLInfoDto.need_roleInfo = true;
        getRoleALLInfoDto.need_roleHero = true;
        getRoleALLInfoDto.need_roleItem = true;

        //获取角色信息
        let retRoleALLInfo: RetRoleALLInfo = await this.gameDataService.getRoleAllInfo(getRoleALLInfoDto);
        if (!retRoleALLInfo.isHaveData()) {
            retMsg.msg = retRoleALLInfo.getRetMsg();
            return retMsg;
        }
        //系统是否开放
        if (!cGameCommon.isOpenSystem(retRoleALLInfo, TableGameSys.aureole)) {
            retMsg.msg = languageConfig.tip.not_open_system;
            return retMsg;
        }
        let aureole = retRoleALLInfo.roleSubInfo.aureole
        if (!aureole) {
            retMsg.msg = languageConfig.tip.error_system_data;
            return retMsg;
        }
        if (!aureole.act.includes(aureoleDto.type)) {
            retMsg.msg = '未激活';
            return retMsg;
        }
        let tab = new TableAureole(aureole.id)
        if (!tab) {
            retMsg.msg = 'TableAureole err!';
            return retMsg;
        }
        let rank = tab.rank;
        let lv = tab.lv;
        let atab = TableAureole.getTable();
        let useid = 0;
        for (const key in atab) {
            if (Object.prototype.hasOwnProperty.call(atab, key)) {
                const d = atab[key];
                if (d.rank == rank && d.lv == lv && d.type == aureoleDto.type) {
                    useid = Number(key);
                    break;
                }

            }
        }
        if (useid === 0 || useid === undefined) {
            retMsg.msg = '类型错误';
            return retMsg;
        }


        aureole.id = useid;
        retMsg.aureole = aureole;
        //属性
        for (const heroid in retRoleALLInfo.roleHero) {
            if (Object.prototype.hasOwnProperty.call(retRoleALLInfo.roleHero, heroid)) {
                const heroEntity = retRoleALLInfo.roleHero[heroid];
                heroEntity.id = Number(heroid)
                cpHero.cpHeroAttr(heroEntity, retRoleALLInfo.roleInfo.info)
                retMsg.hero = retMsg.hero || {};
                retMsg.hero[heroid] = cloneDeep(heroEntity);
            }
        }
        retRoleALLInfo.roleHero = cloneDeep(retMsg.hero);
        await this.gameDataService.updateRoleHero(roleKeyDto, retRoleALLInfo.roleHero);
        await this.gameDataService.updateRoleInfo(roleKeyDto, retRoleALLInfo.roleInfo);
        // await this.gameDataService.updateRoleItem(roleKeyDto, retRoleALLInfo.roleItem);
        languageConfig.setActTypeSuccess(EActType.AUREOLEUSE, retMsg);

        return retMsg;
    }








}
