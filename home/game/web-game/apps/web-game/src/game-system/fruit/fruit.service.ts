import { Injectable } from '@nestjs/common';
import { RESEatFruitMsg } from '../../game-data/entity/msg.entity';
import { GameDataService, GetRoleALLInfoDto } from '../../game-data/gamedata.service';
import { RoleKeyDto } from '../../game-data/role/dto/role-key.dto';
import { cGameCommon, RetRoleALLInfo } from '../game-common';
import { RoleHero, RoleItem } from '@prisma/client1';
import { TableGameItem } from '../../config/gameTable/TableGameItem';
import { cItemBag } from '../item/item-bag';
import { EActType } from '../../config/game-enum';
import { languageConfig } from '../../config/language/language';
import { cpHero } from '../hero/hero-cpattr';
import { TableGameSys } from '../../config/gameTable/TableGameSys';
import { AllEatFruitDto, EatFruitDto } from './dto/fruit.dto';
import { TableFruitSys } from '../../config/gameTable/TableFruitSys';
import { cloneDeep } from 'lodash';
import { TableGameHero } from '../../config/gameTable/TableGameHero';

@Injectable()
export class FruitService {

    constructor(
        private readonly gameDataService: GameDataService,
    ) { }

    async eat(req: any, eatFruitDto: EatFruitDto) {

        let roleKeyDto: RoleKeyDto = { id: req.user.id, serverid: req.user.serverid };
        let retMsg: RESEatFruitMsg = new RESEatFruitMsg();
        let getRoleALLInfoDto = new GetRoleALLInfoDto(roleKeyDto);
        getRoleALLInfoDto.need_roleInfo = true;
        getRoleALLInfoDto.need_roleHero = true;
        getRoleALLInfoDto.need_roleItem = true;
        let retRoleALLInfo: RetRoleALLInfo = await this.gameDataService.getRoleAllInfo(getRoleALLInfoDto);
        if (!retRoleALLInfo.isHaveData()) {
            retMsg.msg = retRoleALLInfo.getRetMsg();
            return retMsg;
        }
        //系统是否开放
        if (!cGameCommon.isOpenSystem(retRoleALLInfo, TableGameSys.eat_fruit)) {
            retMsg.msg = languageConfig.tip.not_open_system;
            return retMsg;
        }
        let roleHero = retRoleALLInfo.roleHero
        let roleInfo = retRoleALLInfo.roleInfo
        let roleItem = retRoleALLInfo.roleItem
        let cur_hero = roleHero[eatFruitDto.hid];
        if (!cur_hero) {
            retMsg.msg = "没有该英雄"
            return retMsg;
        }
        let ftab = new TableFruitSys(eatFruitDto.fid)
        if (!ftab) {
            retMsg.msg = "表id错误"
            return retMsg;
        }
        let tab_hero = new TableGameHero(eatFruitDto.hid)
        if (tab_hero.lv < ftab.openlv) {
            retMsg.msg = "等级不足"
            return retMsg;
        }
        let max_num = tab_hero.lv * ftab.base - ftab.amend;
        cur_hero.fruit = cur_hero.fruit || {}
        cur_hero.fruit[ftab.id] = cur_hero.fruit[ftab.id] || 0;
        if (max_num <= cur_hero.fruit[ftab.id]) {
            retMsg.msg = "已达上限"
            return retMsg;
        }

        //扣道具
        const itemid = ftab.itemid
        const itemid_num = 1
        retMsg.decitem = {};
        if (!roleItem[itemid] || roleItem[itemid] < itemid_num) {
            retMsg.msg = `[${TableGameItem.getVal(itemid, TableGameItem.field_name)}]不够`;
            delete retMsg.decitem;
            return retMsg;
        }
        cItemBag.decitem(roleItem, retMsg.decitem, itemid, itemid_num);

        //记录
        cur_hero.fruit[ftab.id] += itemid_num;
        //属性

        // for (const heroid in roleHero) {
        //     if (Object.prototype.hasOwnProperty.call(roleHero, heroid)) {
        //         const heroEntity = roleHero[heroid];
        //         heroEntity.id = Number(heroid)
        //         cpHero.cpHeroAttr(heroEntity, roleInfo.info)
        //         retMsg.herolist = retMsg.herolist || {};
        //         retMsg.herolist[heroid] = cloneDeep(heroEntity)
        //     }
        // }
        cur_hero.id = eatFruitDto.hid;
        cpHero.cpHeroAttr(cur_hero, roleInfo.info)
        retMsg.hero = cloneDeep(cur_hero)

        //设置保存标记
        // await this.gameDataService.updateRoleInfo(roleKeyDto, roleInfo);
        await this.gameDataService.updateRoleHero(roleKeyDto, roleHero)
        await this.gameDataService.updateRoleItem(roleKeyDto, roleItem);
        languageConfig.setActTypeSuccess(EActType.EAT_FRUIT, retMsg);
        return retMsg;
    }


    async eatall(req: any, eatFruitDto: AllEatFruitDto) {

        let roleKeyDto: RoleKeyDto = { id: req.user.id, serverid: req.user.serverid };
        let retMsg: RESEatFruitMsg = new RESEatFruitMsg();
        let getRoleALLInfoDto = new GetRoleALLInfoDto(roleKeyDto);
        getRoleALLInfoDto.need_roleInfo = true;
        getRoleALLInfoDto.need_roleHero = true;
        getRoleALLInfoDto.need_roleItem = true;
        let retRoleALLInfo: RetRoleALLInfo = await this.gameDataService.getRoleAllInfo(getRoleALLInfoDto);
        if (!retRoleALLInfo.isHaveData()) {
            retMsg.msg = retRoleALLInfo.getRetMsg();
            return retMsg;
        }
        //系统是否开放
        if (!cGameCommon.isOpenSystem(retRoleALLInfo, TableGameSys.eat_fruit)) {
            retMsg.msg = languageConfig.tip.not_open_system;
            return retMsg;
        }
        let roleHero = retRoleALLInfo.roleHero
        let roleInfo = retRoleALLInfo.roleInfo
        let roleItem = retRoleALLInfo.roleItem
        let cur_hero = roleHero[eatFruitDto.hid];
        if (!cur_hero) {
            retMsg.msg = "没有该英雄"
            return retMsg;
        }
        
        let tab_hero = new TableGameHero(eatFruitDto.hid)
        let ftab = TableFruitSys.getTable()
        let eatok: boolean = false;
        retMsg.decitem = {};
        for (const key in ftab) {
            if (Object.prototype.hasOwnProperty.call(ftab, key)) {
                const data = ftab[key];
                let fid = Number(key);
                let itemid = data.itemid;
                const Ritemid_num = roleItem[itemid]
                if (!Ritemid_num) {
                    continue;
                }
                if (tab_hero.lv < data.openlv) {
                    continue;
                }
                //使用数量
                let max_num = tab_hero.lv * data.base - data.amend;
                cur_hero.fruit = cur_hero.fruit || {}
                cur_hero.fruit[fid] = cur_hero.fruit[fid] || 0;
                let limit_num = max_num - cur_hero.fruit[fid]; //限制数量
                let itemid_num = Math.min(Ritemid_num, limit_num)
                if (itemid_num <= 0) {
                    continue;
                }
                //扣道具
                if (!roleItem[itemid] || roleItem[itemid] < itemid_num) {
                    retMsg.msg = `[${TableGameItem.getVal(itemid, TableGameItem.field_name)}]不够`;
                    delete retMsg.decitem;
                    return retMsg;
                }
                cItemBag.decitem(roleItem, retMsg.decitem, itemid, itemid_num);

                //记录
                cur_hero.fruit[fid] += itemid_num;
                eatok = true;
            }
        }

        if (eatok) {
            //属性
            // for (const heroid in roleHero) {
            //     if (Object.prototype.hasOwnProperty.call(roleHero, heroid)) {
            //         const heroEntity = roleHero[heroid];
            //         heroEntity.id = Number(heroid)
            //         cpHero.cpHeroAttr(heroEntity, roleInfo.info)
            //         retMsg.herolist = retMsg.herolist || {};
            //         retMsg.herolist[heroid] = cloneDeep(heroEntity)
            //     }
            // }
            cur_hero.id = eatFruitDto.hid;
            cpHero.cpHeroAttr(cur_hero, roleInfo.info)
            retMsg.hero = cloneDeep(cur_hero)
            //设置保存标记
            await this.gameDataService.updateRoleHero(roleKeyDto, roleHero)
            await this.gameDataService.updateRoleItem(roleKeyDto, roleItem);
            languageConfig.setActTypeSuccess(EActType.EAT_FRUIT, retMsg);
        } else {
            retMsg.msg = "没有食果"
        }
        return retMsg;
    }




}
