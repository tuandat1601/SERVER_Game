import { Injectable } from '@nestjs/common';
import { TableMedalUplevel } from '../../config/gameTable/TableMedalUplevel';
import { ItemsRecord } from '../../game-data/entity/item.entity';
import { RESMedalUpLevelMsg } from '../../game-data/entity/msg.entity';
import { GameDataService, GetRoleALLInfoDto } from '../../game-data/gamedata.service';
import { RoleKeyDto } from '../../game-data/role/dto/role-key.dto';
import { cGameCommon, RetRoleALLInfo } from '../game-common';
import { LvUpMedalDto } from './dto/medal.dto';
import { RoleHero, RoleItem } from '@prisma/client1';
import { TableGameItem } from '../../config/gameTable/TableGameItem';
import { cItemBag } from '../item/item-bag';
import { EActType } from '../../config/game-enum';
import { languageConfig } from '../../config/language/language';
import { cpHero } from '../hero/hero-cpattr';
import { syshero } from '../hero/hero-lvup';
import { MedalInfo } from '../../game-data/entity/medal.entity';
import { TablePrivilegeType } from '../../config/gameTable/TablePrivilegeType';
import { TableGameSys } from '../../config/gameTable/TableGameSys';
import { cloneDeep } from 'lodash';

@Injectable()
export class MedalService {
    constructor(
        private readonly gameDataService: GameDataService,
    ) {
    }

    async lvup(req: any, dto: LvUpMedalDto) {

        // console.log('gameLoginDto', lvUpMedalDto);
        let roleKeyDto: RoleKeyDto = { id: req.user.id, serverid: req.user.serverid };

        let retMsg: RESMedalUpLevelMsg = new RESMedalUpLevelMsg();
        retMsg.baoji = false;
        let getRoleALLInfoDto = new GetRoleALLInfoDto(roleKeyDto);
        getRoleALLInfoDto.need_roleInfo = true;
        getRoleALLInfoDto.need_roleHero = true;

        //获取角色信息
        let retRoleALLInfo: RetRoleALLInfo = await this.gameDataService.getRoleAllInfo(getRoleALLInfoDto);
        if (!retRoleALLInfo.isHaveData()) {
            retMsg.msg = retRoleALLInfo.getRetMsg();
            return retMsg;
        }
        // retMsg.ok = true;
        // retMsg.medal_Lv = 1
        if (retRoleALLInfo.roleSubInfo.medalInfo === undefined) {
            retMsg.msg = ' 系统未开放！'
            return retMsg;
        }
        let medalInfo = retRoleALLInfo.roleSubInfo.medalInfo
        if (!TableMedalUplevel.checkHave(medalInfo.mid)) {
            retMsg.msg = '数据不存在! ';
            return retMsg;
        }
        if (medalInfo.mid == Object.keys(TableMedalUplevel.table).length) {
            retMsg.msg = '已满级! ';
            return retMsg;
        }
        // console.log('medal_data', medal_data);

        //获取道具数据
        let item_info: RoleItem = await this.gameDataService.getRoleItem(roleKeyDto);
        let roleItemBag: ItemsRecord = <ItemsRecord><unknown>(item_info.info)
        retMsg.decitem = {};
        let isloop = true
        let count = 0
        do {
            //消耗道具
            let medal_data = new TableMedalUplevel(medalInfo.mid)
            let costitem = medal_data.costitem
            for (const key in costitem) {
                if (Object.prototype.hasOwnProperty.call(costitem, key)) {
                    const itemid = Number(key)
                    const itemid_num = costitem[key];
                    if (!roleItemBag[itemid] || roleItemBag[itemid] < itemid_num) {
                        isloop = false;
                        if (count > 0) {
                            break;
                        }
                        retMsg.msg = `[${TableGameItem.getVal(itemid, TableGameItem.field_name)}]不够`;
                        delete retMsg.decitem;
                        return retMsg;
                    }

                    cItemBag.decitem(roleItemBag, retMsg.decitem, itemid, itemid_num);

                }
            }
            if (isloop) {
                count++;
                //增加基础经验
                medalInfo.exp += medal_data.baseexp;
                //增加额外经验
                if (cGameCommon.getIsHavePrivilege(retRoleALLInfo.roleInfo, TablePrivilegeType.add_medal_exp)) {
                    medalInfo.exp += cGameCommon.getPrivilegeVal(retRoleALLInfo.roleSubInfo, TableGameSys.medal, TablePrivilegeType.add_medal_exp);
                }
                //增加暴击经验
                if (Math.floor(Math.random() * 10000) <= medal_data.critprob) {
                    medalInfo.exp += medal_data.critexp;
                    retMsg.baoji = true;
                }
                if (medalInfo.exp >= medal_data.costexp) {
                    medalInfo.mid++;
                    medalInfo.exp = 0;
                }
            }
            if (medalInfo.mid == Object.keys(TableMedalUplevel.table).length) {
                isloop = false;
            }
        } while (isloop && dto.all)
        //属性
        for (const heroid in retRoleALLInfo.roleHero) {
            if (Object.prototype.hasOwnProperty.call(retRoleALLInfo.roleHero, heroid)) {
                const heroEntity = retRoleALLInfo.roleHero[heroid];
                heroEntity.id = Number(heroid)
                cpHero.cpHeroAttr(heroEntity, retRoleALLInfo.roleInfo.info)
                retMsg.herolist = retMsg.herolist || {};
                retMsg.herolist[heroid] = cloneDeep(heroEntity);
            }
        }

        retMsg.info = retMsg.info || new MedalInfo;
        retMsg.info = medalInfo
        //设置保存标记
        await this.gameDataService.updateRoleHero(roleKeyDto, retRoleALLInfo.roleHero);
        await this.gameDataService.updateRoleInfo(roleKeyDto, retRoleALLInfo.roleInfo);
        await this.gameDataService.updateRoleItem(roleKeyDto, roleItemBag);

        languageConfig.setActTypeSuccess(EActType.MEDAL_UPLEVEL, retMsg);

        return retMsg;
    }
}
