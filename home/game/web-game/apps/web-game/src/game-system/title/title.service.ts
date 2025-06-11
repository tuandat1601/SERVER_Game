import { Body, Injectable, Request } from '@nestjs/common';
import { EActType } from '../../config/game-enum';
import { TableGameConfig } from '../../config/gameTable/TableGameConfig';
import { TableGameSys } from '../../config/gameTable/TableGameSys';
import { cGameCommon, RetRoleALLInfo } from '../game-common';
import { RoleKeyDto } from '../../game-data/role/dto/role-key.dto';
import { cItemBag } from '../item/item-bag';
import { languageConfig } from '../../config/language/language';
import { cpHero } from '../hero/hero-cpattr';
import { clone, cloneDeep } from 'lodash';
import { cTools } from '../../game-lib/tools';
import { GameDataService, GetRoleALLInfoDto } from '../../game-data/gamedata.service';
import { TableTitle } from '../../config/gameTable/TableTitle';
import { TitleEntity, RoleInfoEntity } from '../../game-data/entity/roleinfo.entity';

import {TitleActiveDTO, TitleDressDTO, TitleUndressDTO} from './dto/title.dto';
import {RESTitleActiveMsg, RESTitleDressMsg, RESTitleUndressMsg, TitleMsg} from '../../game-data/entity/msg.entity';
import { ItemsRecord } from '../../game-data/entity/item.entity';
import { TableGameItem } from '../../config/gameTable/TableGameItem';


export class TitleResult {
    roleKeyDto: RoleKeyDto;
    retMsg : any;
    roleALLInfo: RetRoleALLInfo;
    tag: boolean = true;

    async set(gameDataService: GameDataService, userid: string, serverid: number, msg:any, titleId:number, need_role:boolean = false,need_hero:boolean = false, need_item:boolean = false){
        this.roleKeyDto =  { id: userid, serverid: serverid };
        this.retMsg = msg;
        let getRoleALLInfoDto = new GetRoleALLInfoDto(this.roleKeyDto);
        getRoleALLInfoDto.need_roleInfo = need_role;
        getRoleALLInfoDto.need_roleHero = need_hero;
        getRoleALLInfoDto.need_roleItem = need_item;
        this.roleALLInfo = await gameDataService.getRoleAllInfo(getRoleALLInfoDto);
        if (!this.roleALLInfo.isHaveData()) {
            this.retMsg.msg = this.roleALLInfo.getRetMsg();
            this.tag = false;
            return this;
        }
        //系统是否开放
        if (!cGameCommon.isOpenSystem(this.roleALLInfo, TableGameSys.title)) {
            this.retMsg.msg = languageConfig.tip.not_open_system;
            this.tag = false;
            return this;
        }
        if (!TableTitle.checkHave(titleId)){
            this.retMsg.msg = "称号没有配置数据";
            this.tag = false;
            return this;
        }
        return this;
    }
}

@Injectable()
export class TitleService {
    constructor(private readonly gameDataService: GameDataService,) {}

    async active(@Request() req: any, @Body() dto: TitleActiveDTO) {
        return;
        let result = await (new TitleResult()).set(this.gameDataService, req.user.id, req.user.serverid, new RESTitleActiveMsg(), dto.id, true, true, true);
        if (!result.tag) { return result.retMsg; }

        let title = result.roleALLInfo.roleInfo.info.title;
        if (title.id[dto.id] != undefined){
            result.retMsg.msg = "称号已经激活";
            return result.retMsg;
        }
        let data = new TableTitle(dto.id);
        let costitem = {};
        costitem[dto.id] = 1;
        cItemBag.costItem(result.roleALLInfo.roleItem, costitem, result.retMsg);
        if (!result.retMsg.ok) {return result.retMsg;}
        title.id[dto.id] = (data.time > 0) ? (Date.now()+1000*data.time) : 0;
        let roleHero = result.roleALLInfo.roleHero
        result.retMsg.hero = result.retMsg.hero || {};
        for (const heroid in roleHero) {
            if (Object.prototype.hasOwnProperty.call(roleHero, heroid)) {
                cpHero.cpHeroAttr(roleHero[heroid], result.roleALLInfo.roleInfo.info)
                result.retMsg.hero[heroid] = cloneDeep(roleHero[heroid]);
            }
        }
        await this.gameDataService.updateRoleInfo(result.roleKeyDto, result.roleALLInfo.roleInfo);
        await this.gameDataService.updateRoleItem(result.roleKeyDto, result.roleALLInfo.roleItem);
        result.retMsg.id = dto.id;
        result.retMsg.title = title;
        languageConfig.setActTypeSuccess(EActType.TITLE_ACTIVE, result.retMsg);
    	return result.retMsg;
  	}
    
    async dress(@Request() req: any, @Body() dto: TitleDressDTO) {
        let result = await (new TitleResult()).set(this.gameDataService, req.user.id, req.user.serverid, new RESTitleDressMsg(), dto.id, true);
        if (!result.tag) { return result.retMsg; }
        
        let title = result.roleALLInfo.roleInfo.info.title;
        if (title.id[dto.id] == undefined){
            result.retMsg.msg = "称号没有激活";
            return result.retMsg;
        }

        if (dto.id == title.show){
            result.retMsg.msg = "称号已经穿戴";
            return result.retMsg;
        }
        title.show = dto.id;
        await this.gameDataService.updateRoleInfo(result.roleKeyDto, result.roleALLInfo.roleInfo);
        result.retMsg.id = dto.id;
        result.retMsg.title = title;
        languageConfig.setActTypeSuccess(EActType.TITLE_DRESS, result.retMsg);
    	return result.retMsg;
  	}

    async undress(@Request() req: any, @Body() dto: TitleUndressDTO) {
        let result = await (new TitleResult()).set(this.gameDataService, req.user.id, req.user.serverid, new RESTitleUndressMsg(), dto.id, true);
        if (!result.tag) { return result.retMsg; }

        let title = result.roleALLInfo.roleInfo.info.title;
        if (title.id[dto.id] == undefined){
            result.retMsg.msg = "称号没有激活";
            return result.retMsg;
        }
        if (dto.id != title.show){
            result.retMsg.msg = "称号没有穿戴";
            return result.retMsg;
        }
        title.show = 0;
        await this.gameDataService.updateRoleInfo(result.roleKeyDto, result.roleALLInfo.roleInfo);
        result.retMsg.id = dto.id;
        result.retMsg.title = title;
        languageConfig.setActTypeSuccess(EActType.TITLE_UNDRESS, result.retMsg);
    	return result.retMsg;
  	}

    static itemAutoActive(roleALLInfo: RetRoleALLInfo, additem: ItemsRecord, decitem: ItemsRecord) {
        let update = false;
        let actid:number[] = [];
        let title = roleALLInfo.roleInfo.info.title;
        for (let itemid in additem) {
            let tid = Number(itemid);
            if (TableGameItem.checkHave(tid) && TableTitle.checkHave(tid)){
                let data = new TableTitle(tid);
                let now = Date.now();
                let flag = (title.id[tid] == undefined) || (title.id[tid] > 0);
                if (flag){
                    cItemBag.decitem(roleALLInfo.roleItem, decitem, tid, 1);
                    let diff = (title.id[tid] && title.id[tid] > 0) ? (title.id[tid]-now) : 0;
                    if (diff < 0) diff = 0;
                    title.id[tid] = (data.time > 0) ? (now+1000*data.time+diff) : 0;
                    update = true;
                    actid.push(tid);
                }
            }
        }
        if (update) {
            let tmsg = new TitleMsg();
            tmsg.id = actid;
            let roleHero = roleALLInfo.roleHero
            tmsg.hero = tmsg.hero || {};
            for (const heroid in roleHero) {
                if (Object.prototype.hasOwnProperty.call(roleHero, heroid)) {
                    cpHero.cpHeroAttr(roleHero[heroid], roleALLInfo.roleInfo.info)
                    tmsg.hero = tmsg.hero || {};
                    tmsg.hero[heroid] = cloneDeep(roleHero[heroid]);
                }
            }
            tmsg.title = title;
            roleALLInfo.roleInfo.info.title = title;
            return tmsg;
        }
        return undefined;
    }

    static expired(roleALLInfo: RetRoleALLInfo) {
        let update = false;
        let title = roleALLInfo.roleInfo.info.title;
        let del = [];
        let now = Date.now();
        for (const [k, v] of Object.entries(title.id)){
            if (v > 0) {
                let diff = now - v;
                if ( diff >= -5000){
                    del.push(k);
                }
            }
        }
        if (del.length > 0){
            update = true;
            for (let i of del) {
                title.id[i] = undefined;
                if (i == title.show) {
                    title.show = 0;
                }
            }
        }
        if (update) {
            let expired = new TitleMsg();
            expired.id = del;
            let roleHero = roleALLInfo.roleHero;
            expired.hero = expired.hero || {};
            for (const heroid in roleHero) {
                if (Object.prototype.hasOwnProperty.call(roleHero, heroid)) {
                    cpHero.cpHeroAttr(roleHero[heroid], roleALLInfo.roleInfo.info)
                    expired.hero[heroid] = cloneDeep(roleHero[heroid]);
                }
            }
            expired.title = title;
            roleALLInfo.roleInfo.info.title = title;
            return expired;
        }
        
        return undefined; 
    }
}
