import { Body, Delete, Injectable, Request } from '@nestjs/common';
import { RoleItem } from '@prisma/client1';
import { cloneDeep } from 'lodash';
import { EActType, EHeroType } from '../../config/game-enum';
import { TableGameConfig } from '../../config/gameTable/TableGameConfig';
import { TableGameEquipPos } from '../../config/gameTable/TableGameEquipPos';
import { TableGameEquipPosAttr } from '../../config/gameTable/TableGameEquipPosAttr';
import { TableGameEquipPosLv } from '../../config/gameTable/TableGameEquipPosLv';
import { TableGameHero } from '../../config/gameTable/TableGameHero';
import { TableGameItem } from '../../config/gameTable/TableGameItem';
import { TableGameRoleIco } from '../../config/gameTable/TableGameRoleIco';
import { languageConfig } from '../../config/language/language';
import { HerosRecord } from '../../game-data/entity/hero.entity';
import { ItemsRecord } from '../../game-data/entity/item.entity';
import { RESEquipPosMsg, RESHeroLvUpMsg, RESRoleIcoMsg, RESRoleNameMsg } from '../../game-data/entity/msg.entity';
import { RoleInfoEntity } from '../../game-data/entity/roleinfo.entity';
import { GameDataService, GetRoleALLInfoDto } from '../../game-data/gamedata.service';
import { RoleKeyDto } from '../../game-data/role/dto/role-key.dto';
import { Filter } from '../../game-lib/sensitiveword/filter';
import { RetRoleALLInfo } from '../game-common';
import { cGameServer } from '../game-server';
import { cItemBag } from '../item/item-bag';
import { cpHero } from './hero-cpattr';
import { AllEquipPosUpDto, EquipPosUpDto, HeroLvUpDto, RoleUpIcoDto, RoleUpNameDto } from './hero-dto';
import { syshero } from './hero-lvup';

@Injectable()
export class HeroService {

    constructor(
        private readonly gameDataService: GameDataService
    ) {

    }

    async equipPosUp(@Request() req: any, @Body() equipPosUpDto: EquipPosUpDto) {
        let roleKeyDto: RoleKeyDto = { id: req.user.id, serverid: req.user.serverid };
        let RESEquipMsg: RESEquipPosMsg = { ok: false, msg: "no" }

        let rolehero = await this.gameDataService.getRoleHero(roleKeyDto);
        if (!rolehero || !rolehero.info) {
            RESEquipMsg.msg = "rolehero is null"
            return RESEquipMsg;
        }
        let heroInfo = <HerosRecord><unknown>rolehero.info;
        if (!heroInfo[equipPosUpDto.hid]) {
            RESEquipMsg.msg = "没有该英雄"
            return RESEquipMsg;
        }

        let cur_heroEntity = heroInfo[equipPosUpDto.hid];
        if (!TableGameEquipPos.table[equipPosUpDto.pos]) {
            RESEquipMsg.msg = "没有该部位"
            return RESEquipMsg;
        }

        let curPosLv = cur_heroEntity?.poslv && cur_heroEntity?.poslv[equipPosUpDto.pos] ? cur_heroEntity?.poslv[equipPosUpDto.pos] : 0;
        let nextPosLv = curPosLv + 1;
        if (!TableGameEquipPosLv.table[nextPosLv]) {
            RESEquipMsg.msg = Object.keys(TableGameEquipPosLv.table).length < nextPosLv ? "该部位已经满级" : "没有升级表数据"
            return RESEquipMsg;
        }

        let equipPos = new TableGameEquipPos(equipPosUpDto.pos)
        let equipPosAttrId = TableGameEquipPosLv.getVal(nextPosLv, equipPos.strKey)
        if (!TableGameEquipPosAttr.table[equipPosAttrId]) {
            RESEquipMsg.msg = "没有属性表数据"
            return RESEquipMsg;
        }
        let pos_attrs = new TableGameEquipPosAttr(equipPosAttrId);
        //获取道具数据
        let item_info = await this.gameDataService.getRoleItem(roleKeyDto);
        if (!item_info || !item_info.info) {
            RESEquipMsg.msg = 'RoleItem is null';
            return RESEquipMsg;
        }

        let roleIemBag: ItemsRecord = <ItemsRecord><unknown>(item_info.info)
        RESEquipMsg.decitem = {};
        for (const key in pos_attrs.cost) {
            if (Object.prototype.hasOwnProperty.call(pos_attrs.cost, key)) {
                const itemid = Number(key)
                const itemid_num = pos_attrs.cost[key];
                if (!roleIemBag[itemid] || roleIemBag[itemid] < itemid_num) {
                    RESEquipMsg.msg = `[${TableGameItem.getVal(itemid, TableGameItem.field_name)}]不够`;
                    return RESEquipMsg;
                }
                cItemBag.decitem(roleIemBag, RESEquipMsg.decitem, itemid, itemid_num);
            }
        }

        if (!cur_heroEntity?.poslv) { cur_heroEntity.poslv = {} }
        cur_heroEntity.poslv[equipPosUpDto.pos] = nextPosLv;
        cur_heroEntity.id = equipPosUpDto.hid;
        var roleInfo: RoleInfoEntity = await this.gameDataService.getRoleInfo(roleKeyDto);
        cpHero.cpHeroAttr(cur_heroEntity, roleInfo.info)
        RESEquipMsg.hero = cloneDeep(cur_heroEntity)
        delete cur_heroEntity.id;
        RESEquipMsg.ok = true;
        RESEquipMsg.msg = languageConfig.actTypeSuccess(EActType.HERO_EQUIP_POSUP);
        RESEquipMsg.srctype = EActType.HERO_EQUIP_POSUP;
        await this.gameDataService.updateRoleHero(roleKeyDto, heroInfo)
        await this.gameDataService.updateRoleItem(roleKeyDto, roleIemBag)
        return RESEquipMsg;
    }

    async allEquipPosUp(@Request() req: any, @Body() allEquipPosUpDto: AllEquipPosUpDto) {

        let roleKeyDto: RoleKeyDto = { id: req.user.id, serverid: req.user.serverid };
        let RESEquipMsg: RESEquipPosMsg = { ok: false, msg: "no" }
        let rolehero = await this.gameDataService.getRoleHero(roleKeyDto);
        if (!rolehero || !rolehero.info) {
            RESEquipMsg.msg = "rolehero is null"
            return RESEquipMsg;
        }
        let heroInfo = <HerosRecord><unknown>rolehero.info;
        if (!heroInfo[allEquipPosUpDto.hid]) {
            RESEquipMsg.msg = "没有该英雄"
            return RESEquipMsg;
        }
        let cur_heroEntity = heroInfo[allEquipPosUpDto.hid];
        //获取道具数据
        let item_info = await this.gameDataService.getRoleItem(roleKeyDto);
        if (!item_info || !item_info.info) {
            RESEquipMsg.msg = 'RoleItem is null';
            return RESEquipMsg;
        }

        let roleIemBag: ItemsRecord = <ItemsRecord><unknown>(item_info.info)
        let equip_pos_tables = TableGameEquipPos.getTable()
        RESEquipMsg.decitem = {}

        /**升级次数 */
        let pos_up_count = 0;
        let cost_msg = "";
        //遍历所有部位
        for (const key in equip_pos_tables) {
            if (Object.prototype.hasOwnProperty.call(equip_pos_tables, key)) {
                const pos_data = equip_pos_tables[key];
                const cur_pos = Number(key)
                const equipPos = new TableGameEquipPos(cur_pos)

                let curPosLv = cur_heroEntity?.poslv && cur_heroEntity?.poslv[equipPos.id] ? cur_heroEntity?.poslv[equipPos.id] : 0;
                let nextPosLv = curPosLv + 1;

                if (!TableGameEquipPosLv.table[nextPosLv]) { continue; }
                let equipPosAttrId = TableGameEquipPosLv.getVal(nextPosLv, equipPos.strKey)
                if (!TableGameEquipPosAttr.table[equipPosAttrId]) { continue; }
                let pos_attrs = new TableGameEquipPosAttr(equipPosAttrId);
                let is_cost_ok = false;
                let decitem = {}
                //检测需要的道具是否足够
                for (const key in pos_attrs.cost) {
                    if (Object.prototype.hasOwnProperty.call(pos_attrs.cost, key)) {
                        const itemid = Number(key)
                        const itemid_num = pos_attrs.cost[key];
                        if (!roleIemBag[itemid] || roleIemBag[itemid] < itemid_num) {
                            is_cost_ok = false;
                            if (cost_msg === "") {
                                let item_name = TableGameItem.getVal(Number(itemid), TableGameItem.field_name) || itemid;
                                cost_msg = `${item_name + languageConfig.tip.not_enough}`;
                            }
                            break;
                        }
                        decitem[itemid] = decitem[itemid] || 0;
                        decitem[itemid] += itemid_num;
                        is_cost_ok = true;
                    }
                }

                //该部位 是否能升级
                if (is_cost_ok) {
                    for (const key in decitem) {
                        if (Object.prototype.hasOwnProperty.call(decitem, key)) {
                            const itemid = Number(key)
                            const itemid_num = decitem[key];
                            cItemBag.decitem(roleIemBag, RESEquipMsg.decitem, itemid, itemid_num);
                        }
                    }
                    cur_heroEntity.poslv = cur_heroEntity.poslv || {}
                    cur_heroEntity.poslv[equipPos.id] = nextPosLv;
                    pos_up_count += 1;
                }

            }
        }

        if (Object.keys(RESEquipMsg.decitem).length == 0) {
            RESEquipMsg.msg = cost_msg;
            delete RESEquipMsg.decitem;
            return RESEquipMsg;
        }

        //重新计算英雄属性
        cur_heroEntity.id = allEquipPosUpDto.hid;
        var roleInfo: RoleInfoEntity = await this.gameDataService.getRoleInfo(roleKeyDto)
        cpHero.cpHeroAttr(cur_heroEntity, roleInfo.info)
        RESEquipMsg.hero = cloneDeep(cur_heroEntity)
        delete cur_heroEntity.id;
        RESEquipMsg.ok = true;
        RESEquipMsg.srctype = EActType.HERO_ALL_EQUIP_POSUP;
        RESEquipMsg.msg = languageConfig.actTypeSuccess(EActType.HERO_ALL_EQUIP_POSUP);
        RESEquipMsg.taskCount = pos_up_count;

        await this.gameDataService.updateRoleHero(roleKeyDto, heroInfo)
        await this.gameDataService.updateRoleItem(roleKeyDto, roleIemBag)

        return RESEquipMsg;
    }


    async heroLvUp(@Request() req: any, @Body() heroLvUpDto: HeroLvUpDto) {

        let roleKeyDto: RoleKeyDto = { id: req.user.id, serverid: req.user.serverid };
        let respMsg: RESHeroLvUpMsg = { ok: false, msg: "no" }

        let rolehero = await this.gameDataService.getRoleHero(roleKeyDto);
        if (!rolehero || !rolehero.info) {
            respMsg.msg = "rolehero is null"
            return respMsg;
        }

        var roleInfo: RoleInfoEntity = await this.gameDataService.getRoleInfo(roleKeyDto)
        if (!roleInfo || !roleInfo.info) {
            respMsg.msg = 'roleInfo is null';
            return respMsg;
        }


        let heroInfo = <HerosRecord><unknown>rolehero.info;
        if (!heroInfo[heroLvUpDto.hid]) {
            respMsg.msg = "没有该英雄"
            return respMsg;
        }

        let heroEntity = heroInfo[heroLvUpDto.hid];
        if (!TableGameHero.checkHave(heroLvUpDto.hid)) {
            respMsg.msg = "没有该英雄表数据 id:" + heroLvUpDto.hid;
            return respMsg;
        }

        const heroTable = new TableGameHero(heroLvUpDto.hid);
        if (heroTable.type === EHeroType.LEAD) {
            respMsg.msg = "主角英雄无法升级";
            return respMsg;
        }

        if (heroTable.nextid === 0 || heroTable.lv >= TableGameConfig.role_lv_max) {
            respMsg.msg = "英雄已满级";
            return respMsg;
        }

        if (heroTable.lv >= roleInfo.rolelevel) {
            respMsg.msg = "英雄等级不能超过主角等级";
            return respMsg;
        }

        if (!TableGameHero.checkHave(heroTable.nextid)) {
            respMsg.msg = "没有该下一级英雄表数据 id:" + heroTable.nextid;
            return respMsg;
        }

        //获取道具数据
        let item_info: RoleItem = await this.gameDataService.getRoleItem(roleKeyDto);
        if (!item_info || !item_info.info) {
            respMsg.msg = 'RoleItem is null';
            return respMsg;
        }

        let roleItemBag: ItemsRecord = <ItemsRecord><unknown>(item_info.info)
        respMsg.decitem = {}
        for (const key in heroTable.costitem) {
            if (Object.prototype.hasOwnProperty.call(heroTable.costitem, key)) {
                const itemid = Number(key)
                const itemid_num = heroTable.costitem[key];
                if (!roleItemBag[itemid] || roleItemBag[itemid] < itemid_num) {
                    respMsg.msg = `[${TableGameItem.getVal(itemid, TableGameItem.field_name)}]不够`;
                    delete respMsg.decitem;
                    return respMsg;
                }
                cItemBag.decitem(roleItemBag, respMsg.decitem, itemid, itemid_num);
            }
        }

        if (roleInfo.info?.tmpEquips && Object.keys(roleInfo.info.tmpEquips).length > 0) {
            let is_update_tmp = false;
            for (const key in roleInfo.info.tmpEquips) {
                if (Object.prototype.hasOwnProperty.call(roleInfo.info.tmpEquips, key)) {
                    let element = roleInfo.info.tmpEquips[key];
                    if (element.tmphid === heroLvUpDto.hid) {
                        element.tmphid = heroTable.nextid;
                        is_update_tmp = true;
                    }
                }
            }

            if (is_update_tmp) {
                respMsg.newTmpEquips = roleInfo.info?.tmpEquips;
            }
        }

        heroEntity.id = heroTable.nextid
        heroInfo[heroTable.nextid] = heroEntity;
        cpHero.cpHeroAttr(heroEntity, roleInfo.info);
        delete heroInfo[heroLvUpDto.hid];

        //出战队伍更换
        //获取上阵英雄

        if (roleInfo.info?.fteam) {
            let fteam = roleInfo.info.fteam
            for (let idx = 0; idx < fteam.length; idx++) {
                let heroid = fteam[idx];
                if (heroid === heroTable.id) {
                    fteam[idx] = heroTable.nextid;
                    break;
                }
            }
        }

        respMsg.hero = cloneDeep(heroEntity);
        //delete heroEntity.id
        await this.gameDataService.updateRoleHero(roleKeyDto, heroInfo);
        await this.gameDataService.updateRoleItem(roleKeyDto, roleItemBag);
        await this.gameDataService.updateRoleInfo(roleKeyDto, roleInfo);

        respMsg.ok = true;
        respMsg.srctype = EActType.HERO_LVUP;
        respMsg.msg = languageConfig.actTypeSuccess(EActType.HERO_LVUP);
        return respMsg;
    }

    /**
     * 角色头像
     * @param req 
     * @param roleUpIcoDto 
     */
    async roleUpico(req: any, roleUpIcoDto: RoleUpIcoDto) {
        let roleKeyDto: RoleKeyDto = { id: req.user.id, serverid: req.user.serverid };
        let respMsg: RESRoleIcoMsg = { ok: false, msg: "no" }
        var roleInfo: RoleInfoEntity = await this.gameDataService.getRoleInfo(roleKeyDto)
        if (!roleInfo || !roleInfo.info) {
            respMsg.msg = 'roleInfo is null';
            return respMsg;
        }
        const riTable = new TableGameRoleIco(roleUpIcoDto.ico);
        if (!riTable) {
            respMsg.msg = "无效头像";
            return respMsg;
        }
        roleInfo.info.ico = roleUpIcoDto.ico;
        await this.gameDataService.updateRoleInfo(roleKeyDto, roleInfo);

        //换夺宝头像
        let getRoleALLInfoDto = new GetRoleALLInfoDto(roleKeyDto);
        let retRoleALLInfo: RetRoleALLInfo = await this.gameDataService.getRoleAllInfo(getRoleALLInfoDto);
        if (retRoleALLInfo.isHaveData()) {
            let upd = { ico: roleUpIcoDto.ico }
            cGameServer.changePSRankIco(retRoleALLInfo, req.user.id, upd);
            await this.gameDataService.updateSververPSRank(roleKeyDto.serverid, retRoleALLInfo.serverInfo.info);
        }

        respMsg.ico = roleUpIcoDto.ico
        respMsg.ok = true;
        respMsg.srctype = EActType.ROLE_UPICO;
        respMsg.msg = '更新头像成功';
        return respMsg;
    }

    /**
     * 角色名称
     * @param req 
     * @param roleUpIcoDto 
     */
    async roleUpname(req: any, dto: RoleUpNameDto) {
        let roleKeyDto: RoleKeyDto = { id: req.user.id, serverid: req.user.serverid };
        let respMsg: RESRoleNameMsg = { ok: false, msg: "no" }
        let getRoleALLInfoDto = new GetRoleALLInfoDto(roleKeyDto);
        getRoleALLInfoDto.need_roleInfo = true;
        getRoleALLInfoDto.need_roleItem = true;
        let retRoleALLInfo: RetRoleALLInfo = await this.gameDataService.getRoleAllInfo(getRoleALLInfoDto);
        if (!retRoleALLInfo.isHaveData()) {
            respMsg.msg = retRoleALLInfo.getRetMsg();
            return respMsg;
        }

        let tab = TableGameConfig.game_rolename
        if (dto.name.length > tab.l) {
            respMsg.msg = '名称太长';
            return respMsg;
        }
        let ret = Filter.search(dto.name)
        if (ret.success) {
            respMsg.msg = '名称不合规';
            return respMsg;
        }

        let roleItemBag: ItemsRecord = retRoleALLInfo.roleItem
        respMsg.decitem = {};
        if (!roleItemBag[tab.i] || roleItemBag[tab.i] < tab.n) {
            respMsg.msg = `[${TableGameItem.getVal(tab.i, TableGameItem.field_name)}]不够`;
            delete respMsg.decitem;
            return respMsg;
        }

        cItemBag.decitem(roleItemBag, respMsg.decitem, tab.i, tab.n);

        retRoleALLInfo.roleInfo.info.name = dto.name;
        let role = await this.gameDataService.getRole(roleKeyDto);
        if (role) {
            role.name = dto.name;
            await this.gameDataService.updateRole(role)
        }
        await this.gameDataService.updateRoleInfo(roleKeyDto, retRoleALLInfo.roleInfo);
        await this.gameDataService.updateRoleItem(roleKeyDto, retRoleALLInfo.roleItem);
        //换夺宝头像
        cGameServer.changePSRankIco(retRoleALLInfo, req.user.id, { name: dto.name });
        await this.gameDataService.updateSververPSRank(roleKeyDto.serverid, retRoleALLInfo.serverInfo.info);

        respMsg.name = dto.name
        respMsg.ok = true;
        respMsg.srctype = EActType.ROLE_UPICO;
        respMsg.msg = '更新名称成功';
        return respMsg;
    }
}
