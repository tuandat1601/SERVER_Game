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
import { TableFashion } from '../../config/gameTable/TableFashion';
import { FashionEntity, RoleInfoEntity } from '../../game-data/entity/roleinfo.entity';
import {FashionActiveDTO, FashionDressDTO, FashionUndressDTO} from './dto/fashion.dto';
import {RESFashionActiveMsg, RESFashionDressMsg, RESFashionUndressMsg, FashionMsg} from '../../game-data/entity/msg.entity';
import { TableGameItem } from '../../config/gameTable/TableGameItem';
import { ItemsRecord } from '../../game-data/entity/item.entity';
import { TableGameHero } from '../../config/gameTable/TableGameHero';

export class FashionResult {
    roleKeyDto: RoleKeyDto;
    retMsg : any;
    roleALLInfo: RetRoleALLInfo;
    tag: boolean = true;

    async set(gameDataService: GameDataService, userid: string, serverid: number, msg:any, id:number, need_role:boolean = false,need_hero:boolean = false, need_item:boolean = false){
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
        if (!cGameCommon.isOpenSystem(this.roleALLInfo, TableGameSys.change)) {
            this.retMsg.msg = languageConfig.tip.not_open_system;
            this.tag = false;
            return this;
        }
        if (!TableFashion.checkHave(id)){
            this.retMsg.msg = "没有配置数据";
            this.tag = false;
            return this;
        }
        return this;
    }
}

@Injectable()
export class FashionService {
    constructor(private readonly gameDataService: GameDataService,) {}

    async active(@Request() req: any, @Body() dto: FashionActiveDTO) {
        return;
        let result = await (new FashionResult()).set(this.gameDataService, req.user.id, req.user.serverid, new RESFashionActiveMsg(), dto.id, true, true, true);
        if (!result.tag) { return result.retMsg; }

        let fashion = result.roleALLInfo.roleInfo.info.fashion;
        if (fashion.id[dto.id] != undefined){
            result.retMsg.msg = "时装已经激活";
            return result.retMsg;
        }
        let data = new TableFashion(dto.id);
        let costitem = {};
        costitem[dto.id] = 1
        cItemBag.costItem(result.roleALLInfo.roleItem, costitem, result.retMsg);
        if (!result.retMsg.ok) {return result.retMsg;}
        fashion.id[dto.id] = (data.time > 0) ? (Date.now()+1000*data.time) : 0;
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
        result.retMsg.fashion = fashion;
        languageConfig.setActTypeSuccess(EActType.FASHION_ACTIVE, result.retMsg);
    	return result.retMsg;
  	}
    
    async dress(@Request() req: any, @Body() dto: FashionDressDTO) {
        let result = await (new FashionResult()).set(this.gameDataService, req.user.id, req.user.serverid, new RESFashionDressMsg(), dto.id, true, true);
        if (!result.tag) { return result.retMsg; }
        
        let fashion = result.roleALLInfo.roleInfo.info.fashion;
        if (fashion.id[dto.id] == undefined){
            result.retMsg.msg = "时装没有激活";
            return result.retMsg;
        }
        if (!TableGameHero.checkHave(dto.heroid || 0)){
            result.retMsg.msg = "错误的英雄参数";
            return result.retMsg;
        }
        let hdata = new TableGameHero(dto.heroid);
        let data = new TableFashion(dto.id);
        if (data.group != hdata.group){
            result.retMsg.msg = "不属于该角色的时装";
            return result.retMsg;
        }
        let roleHero = result.roleALLInfo.roleHero
        if (!Object.prototype.hasOwnProperty.call(roleHero, dto.heroid)){
            result.retMsg.msg = "错误的英雄";
            return result.retMsg;
        }
        if (roleHero[dto.heroid].fashion == dto.id) {
            result.retMsg.msg = "已经穿戴时装";
            return result.retMsg;
        }
        roleHero[dto.heroid].fashion = dto.id
        result.retMsg.hero = result.retMsg.hero || {};
        for (const heroid in roleHero) {
            if (Object.prototype.hasOwnProperty.call(roleHero, heroid)) {
                result.retMsg.hero[heroid] = cloneDeep(roleHero[heroid]);
            }
        }
        await this.gameDataService.updateRoleInfo(result.roleKeyDto, result.roleALLInfo.roleInfo);
        await this.gameDataService.updateRoleHero(result.roleKeyDto, result.roleALLInfo.roleHero);
        result.retMsg.id = dto.id;
        result.retMsg.heroid = dto.heroid;
        languageConfig.setActTypeSuccess(EActType.FASHION_DRESS, result.retMsg);
    	return result.retMsg;
  	}

    async undress(@Request() req: any, @Body() dto: FashionUndressDTO) {
        let result = await (new FashionResult()).set(this.gameDataService, req.user.id, req.user.serverid, new RESFashionUndressMsg(), dto.id, true, true);
        if (!result.tag) { return result.retMsg; }

        let fashion = result.roleALLInfo.roleInfo.info.fashion;
        if (fashion.id[dto.id] == undefined){
            result.retMsg.msg = "时装没有激活";
            return result.retMsg;
        }
        let roleHero = result.roleALLInfo.roleHero
        if (!Object.prototype.hasOwnProperty.call(roleHero, dto.heroid)){
            result.retMsg.msg = "错误的英雄";
            return result.retMsg;
        }
        if (roleHero[dto.heroid].fashion == 0) {
            result.retMsg.msg = "没有穿戴时装";
            return result.retMsg;
        }
        roleHero[dto.heroid].fashion = 0;
        result.retMsg.hero = result.retMsg.hero || {};
        for (const heroid in roleHero) {
            if (Object.prototype.hasOwnProperty.call(roleHero, heroid)) {
                result.retMsg.hero[heroid] = cloneDeep(roleHero[heroid]);
            }
        }
        await this.gameDataService.updateRoleInfo(result.roleKeyDto, result.roleALLInfo.roleInfo);
        await this.gameDataService.updateRoleHero(result.roleKeyDto, result.roleALLInfo.roleHero);
        result.retMsg.id = dto.id;
        result.retMsg.heroid = dto.heroid;
        languageConfig.setActTypeSuccess(EActType.FASHION_UNDRESS, result.retMsg);
    	return result.retMsg;
  	}

    static itemAutoActive(roleALLInfo: RetRoleALLInfo, additem: ItemsRecord, decitem: ItemsRecord) {
        let update = false;
        let actid = [];
        let fashion = roleALLInfo.roleInfo.info.fashion;
        for (let itemid in additem) {
            let fid = Number(itemid);
            if (TableGameItem.checkHave(fid) && TableFashion.checkHave(fid)){
                let data = new TableFashion(fid);
                let now = Date.now();
                let flag = (fashion.id[fid] == undefined) || (fashion.id[fid] > 0);
                if (flag){
                    cItemBag.decitem(roleALLInfo.roleItem, decitem, fid, 1);
                    let diff = (fashion.id[fid] && fashion.id[fid] > 0) ? (fashion.id[fid]-now) : 0;
                    if (diff < 0) diff = 0;
                    fashion.id[fid] = (data.time > 0) ? (now+1000*data.time+diff) : 0;
                    update = true;
                    actid.push(fid);
                }
            }
        }
        if (update) {
            let msg = new FashionMsg();
            msg.id = actid;
            let roleHero = roleALLInfo.roleHero
            msg.hero = msg.hero || {};
            for (const heroid in roleHero) {
                if (Object.prototype.hasOwnProperty.call(roleHero, heroid)) {
                    cpHero.cpHeroAttr(roleHero[heroid], roleALLInfo.roleInfo.info)
                    msg.hero = msg.hero || {};
                    msg.hero[heroid] = cloneDeep(roleHero[heroid]);
                }
            }
            msg.fashion = fashion;
            roleALLInfo.roleInfo.info.fashion = fashion;
            return msg;
        }
        return undefined;
    }

    static expired(roleALLInfo: RetRoleALLInfo) {
        let update =false;
        let fashion = roleALLInfo.roleInfo.info.fashion;
        let del = [];
        let now = Date.now();
        for (const [k, v] of Object.entries(fashion.id)){
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
                fashion.id[i] = undefined;
            }
        }
        if (update) {
            let expired = new FashionMsg();
            expired.id = del;
            let roleHero = roleALLInfo.roleHero;
            expired.hero = expired.hero || {};
            for (const heroid in roleHero) {
                if (Object.prototype.hasOwnProperty.call(roleHero, heroid)) {
                    cpHero.cpHeroAttr(roleHero[heroid], roleALLInfo.roleInfo.info)
                    if (roleHero[heroid].fashion > 0 && del.indexOf(roleHero[heroid].fashion) != -1){
                        roleHero[heroid].fashion = 0;
                    }
                    expired.hero[heroid] = cloneDeep(roleHero[heroid]);
                }
            }
            expired.fashion = fashion;
            roleALLInfo.roleInfo.info.fashion = fashion;
            return expired;
        }
        return undefined; 
    }
}
