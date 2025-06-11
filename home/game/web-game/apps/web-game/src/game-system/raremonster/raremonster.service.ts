import { Body, Injectable, Request } from '@nestjs/common';
import { Logger } from 'apps/web-game/src/game-lib/log4js';
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
import { TableRareMonsterSuit } from '../../config/gameTable/TableRareMonsterSuit';
import { TableRareMonster } from '../../config/gameTable/TableRareMonster';
import { TableRareMonsterPark } from '../../config/gameTable/TableRareMonsterPark';
import { RareMonsterEntity, RoleInfoEntity } from '../../game-data/entity/roleinfo.entity';

import {RaremonsterLevelUpDTO, 
    RaremonsterFightDTO, 
    RaremonsterChangeDTO, 
    RaremonsterSuitDTO,
    RaremonsterLotteryDTO} from './dto/raremonster.dto';
  import { RESRaremonsterLevelUpMsg, 
    RESRaremonsterFightMsg,  
    RESRaremonsterChangeMsg, 
    RESRaremonsterSuitMsg,
    RESRaremonsterLotteryMsg} from '../../game-data/entity/msg.entity';
import internal from 'stream';

@Injectable()
export class RaremonsterService {
    private protectId: number = 0;
    private protectCount: number = 0;
    private parkId: number[] = [];
    private weights: number[] = [];
    private suitGroup: Record<number, Record<number, number>> = {};
    constructor(private readonly gameDataService: GameDataService,) { }

    private getParkData(){
        if(this.parkId.length == 0) {
            let tab = TableRareMonsterPark.getTable();
            for (const key in tab){
                let id = Number(key);
                let d = tab[id];
                if (d.maxCount > 0){
                    this.protectId = id;
                    this.protectCount = d.maxCount;
                } 
                this.parkId.push(id);
                this.weights.push(d.weight);
            }
        }
    }

    private getSuitData() {
        if (Object.keys(this.suitGroup).length == 0){
            let stab = TableRareMonsterSuit.getTable();
            for (const key in stab) {
                let id = Number(key);
                let d = stab[id];
                if (this.suitGroup[d.group] == undefined){
                    this.suitGroup[d.group] = {};
                }
                this.suitGroup[d.group][d.level] = id;
            }
        }
    }

    async isOpen(roleKeyDto: RoleKeyDto, retMsg: any, need_role:boolean=false,need_hero:boolean=false, need_item:boolean=false) {
        let getRoleALLInfoDto = new GetRoleALLInfoDto(roleKeyDto);
        getRoleALLInfoDto.need_roleInfo = need_role;
        getRoleALLInfoDto.need_roleHero = need_hero;
        getRoleALLInfoDto.need_roleItem = need_item;
        let retRoleALLInfo: RetRoleALLInfo = await this.gameDataService.getRoleAllInfo(getRoleALLInfoDto);
        if (!retRoleALLInfo.isHaveData()) {
            retMsg.msg = retRoleALLInfo.getRetMsg();
            return;
        }
        //系统是否开放
        if (!cGameCommon.isOpenSystem(retRoleALLInfo, TableGameSys.raremonster)) {
            retMsg.msg = languageConfig.tip.not_open_system;
            return;
        }
        return retRoleALLInfo;
    }

    async levelUp(@Request() req: any, @Body() reqbody: RaremonsterLevelUpDTO) {
        let roleKeyDto: RoleKeyDto = { id: req.user.id, serverid: req.user.serverid };
        let retMsg: RESRaremonsterLevelUpMsg = { id : reqbody.id, nextId : 0, ok: false, msg: "no" }
        let retRoleALLInfo: RetRoleALLInfo = await this.isOpen(roleKeyDto, retMsg, true, true, true);
        if (retMsg.msg != "no") {
            return retMsg;
        }
        if (!TableRareMonster.checkHave(reqbody.id)) {
            retMsg.msg = "没有配置数据";
            return retMsg;
        }
        let data = new TableRareMonster(reqbody.id)
        if (data.nextid == 0) {
            retMsg.msg = "已经升到最高等级";
            return retMsg;
        }
        let raremst = retRoleALLInfo.roleInfo.info.raremst;
        var index:number = raremst.id.indexOf(reqbody.id);
        if (index != -1){
            retMsg.nextId = data.nextid;
            data = new TableRareMonster(retMsg.nextId);
        }
        else{
            if (raremst.id.indexOf(data.nextid) != -1){
                retMsg.msg = `参数错误${reqbody.id}`;
                return retMsg;
            }
            for (const id of raremst.id){
                let d = new TableRareMonster(id);
                if (data.group == d.group){
                    retMsg.msg = `参数错误${reqbody.id}`;
                    return retMsg;
                }
            }
        }
        let roleHero = retRoleALLInfo.roleHero;
        let roleItem = retRoleALLInfo.roleItem;
        cItemBag.costItem(roleItem, data.costitem, retMsg);
        if (!retMsg.ok) {return retMsg;}
        if (index == -1){
            raremst.id.push(reqbody.id);
        }
        else{
            raremst.id.splice(index, 1, retMsg.nextId);
        }
        //替换上阵的异兽
        for (var i = 0; i < raremst.fight.length; i++){
            let idx = raremst.fight[i].indexOf(reqbody.id);
            if ( idx >= 0){
                raremst.fight[i].splice(idx, 1, retMsg.nextId);
            }
        }
        
        retMsg.hero = retMsg.hero || {};
        for (const heroid in roleHero) {
            if (Object.prototype.hasOwnProperty.call(roleHero, heroid)) {
                cpHero.cpHeroAttr(roleHero[heroid], retRoleALLInfo.roleInfo.info)
                retMsg.hero[heroid] = cloneDeep(roleHero[heroid]);
            }
        }
        retMsg.raremst = raremst;
        //设置保存标记
        await this.gameDataService.updateRoleInfo(roleKeyDto, retRoleALLInfo.roleInfo);
        await this.gameDataService.updateRoleItem(roleKeyDto, roleItem);
        languageConfig.setActTypeSuccess(EActType.RARE_MONSTER, retMsg);
        return retMsg;
    }

    async fight(@Request() req: any, @Body() reqbody: RaremonsterFightDTO) {
        let roleKeyDto: RoleKeyDto = { id: req.user.id, serverid: req.user.serverid };
        let retMsg: RESRaremonsterFightMsg = {ok: false, msg: "no" };
        let retRoleALLInfo: RetRoleALLInfo = await this.isOpen(roleKeyDto, retMsg, true);
        if (retMsg.msg != "no") {
            return retMsg;
        }
        let raremst = retRoleALLInfo.roleInfo.info.raremst;
        if (reqbody.team >= raremst.fight.length){
            retMsg.msg = "上阵分组错误";
            return retMsg;
        }
        
        let len = reqbody.id.length;
        if (len != raremst.fight[reqbody.team].length){
            retMsg.msg = "上阵数据错误";
            return retMsg;
        }
        for (let i = 0; i < len; i++ ){
            let rid = reqbody.id[i];
            if (rid > 0){
                if (raremst.id.indexOf(rid) == -1){
                    retMsg.msg = "上阵的异兽有未激活的异兽";
                    return retMsg;
                }
                if (reqbody.id.lastIndexOf(rid) != i){
                    retMsg.msg = "同一个异兽上阵不同的位置";
                    return retMsg;
                }
                if (retRoleALLInfo.roleInfo.rolelevel < TableGameConfig.raremst_fight_unlock[i]){
                    retMsg.msg = `主角等级达到Lv·${TableGameConfig.raremst_fight_unlock[i]}才能解锁`;
                    return retMsg;
                }
            }
        }
        raremst.fight[reqbody.team] = reqbody.id;
        retMsg.raremst = raremst;
        await this.gameDataService.updateRoleInfo(roleKeyDto, retRoleALLInfo.roleInfo);
        languageConfig.setActTypeSuccess(EActType.RARE_MONSTER_FIGHT, retMsg);
        return retMsg;
    }

    async change(@Request() req: any, @Body() reqbody: RaremonsterChangeDTO) {
        let roleKeyDto: RoleKeyDto = { id: req.user.id, serverid: req.user.serverid };
        let retMsg: RESRaremonsterChangeMsg = {ok: false, msg: "no" };
        let retRoleALLInfo: RetRoleALLInfo = await this.isOpen(roleKeyDto, retMsg, true);
        if (retMsg.msg != "no") {
            return retMsg;
        }
        let raremst = retRoleALLInfo.roleInfo.info.raremst;
        if (reqbody.team >= raremst.fight.length){
            retMsg.msg = "上阵分组错误";
            return retMsg;
        }
        raremst.use = reqbody.team;
        retMsg.raremst = raremst;
        await this.gameDataService.updateRoleInfo(roleKeyDto, retRoleALLInfo.roleInfo);
        languageConfig.setActTypeSuccess(EActType.RARE_MONSTER_CHANGE, retMsg);
        return retMsg;
    }

    async lottery(@Request() req: any, @Body() reqbody: RaremonsterLotteryDTO) {
        this.getParkData();
        let roleKeyDto: RoleKeyDto = { id: req.user.id, serverid: req.user.serverid };
        let retMsg: RESRaremonsterLotteryMsg = new RESRaremonsterLotteryMsg();
        let retRoleALLInfo: RetRoleALLInfo = await this.isOpen(roleKeyDto, retMsg, true, false, true);
        if (retMsg.msg != "null") {
            return retMsg;
        }
        let roleItem = retRoleALLInfo.roleItem;
        let subinfo = retRoleALLInfo.roleInfo.info
        let raremst = subinfo.raremst;
        let times = reqbody.times;
        let daynum = subinfo.reDayInfo.raremst_daily || 0;
        if (daynum == 0){
            times -= 1;
        }
        if (times > 0){
            let costitem = TableGameConfig.raremst_costitem;
            cItemBag.costItem(roleItem, costitem, retMsg, times);
            if (!retMsg.ok) {
                let costmoney = TableGameConfig.raremst_costmoney;
                let money = 0;
                let moneyNum = 0;
                for (const m in costmoney) {
                    money = Number(m);
                    moneyNum = costmoney[m];
                }
                let itemId = 0;
                let itemNum = 0;
                for (const cid in costitem) {
                    itemId = Number(cid);
                    itemNum = costitem[cid];
                }
                let price = Math.floor(moneyNum/itemNum);
                let num = roleItem[itemId] || 0;
                let diff = itemNum*times - num;
                let cost: Record<number, number> = {};
                cost[money] = diff*price;
                if (num > 0) cost[itemId] = num;
                cItemBag.costItem(roleItem, cost, retMsg);
                if (!retMsg.ok) {
                    return retMsg;
                }
            }
        }
        let idattr : number[] = [];
        let num = raremst.num || 0;
        for (let i = 0; i < reqbody.times; i++){
            num += 1;
            if (num == this.protectCount){
                num = 0;
                idattr.push(this.protectId);
            }
            else{
                let idx = cTools.randByWeight(this.weights);
                idattr.push(this.parkId[idx]);
            }
        }
        raremst.num = num;
        subinfo.reDayInfo.raremst_daily = daynum + reqbody.times;
        retMsg.additem  = {};
        let items = this.gameDataService.getGameConfigService().getRareMonterItem();
        for ( let pid of idattr) {
            let d = new TableRareMonsterPark(pid);
            if (items[d.quality] != undefined) {
                let idx = cTools.randInt(1, items[d.quality].length);
                let itemId = items[d.quality][idx-1]
                retMsg.items.push({[itemId]:d.num});
                cItemBag.addItem(roleItem, retMsg.additem, itemId, d.num);
            }
        }
        retMsg.raremst = raremst;
        retMsg.times = reqbody.times;
        await this.gameDataService.updateRoleInfo(roleKeyDto, retRoleALLInfo.roleInfo);
        await this.gameDataService.updateRoleItem(roleKeyDto, roleItem);
        languageConfig.setActTypeSuccess(EActType.RARE_MONSTER_PARK, retMsg);
        return retMsg;
    }

    async suit(@Request() req: any, @Body() reqbody: RaremonsterSuitDTO) {
        this.getSuitData();
        let roleKeyDto: RoleKeyDto = { id: req.user.id, serverid: req.user.serverid };
        let retMsg: RESRaremonsterSuitMsg = new RESRaremonsterSuitMsg();
        let retRoleALLInfo: RetRoleALLInfo = await this.isOpen(roleKeyDto, retMsg, true, true);
        if (retMsg.msg != "null") {
            return retMsg;
        }
        if (this.suitGroup[reqbody.group] == undefined){
            retMsg.msg = "参数错误";
            return retMsg;
        }
        //计算共鸣
        let raremst = retRoleALLInfo.roleInfo.info.raremst;
        let mg : Record<number, number> = {};
        for(let id of raremst.id) {
            let md = new TableRareMonster(id);
            mg[md.group] = md.lv;
        }
        let index = -1;
        let id = this.suitGroup[reqbody.group][1];
        for (let i = 0; i < raremst.suit.length; i++) {
            let sid = raremst.suit[i]
            if (TableRareMonsterSuit.checkHave(sid)){
                let d = new TableRareMonsterSuit(sid);
                if (d.group == reqbody.group) {
                    index = i;
                    let tempId = this.suitGroup[reqbody.group][d.level+1];
                    if (tempId == undefined){
                        retMsg.msg = "已经是最高等级了";
                        return retMsg;
                    }
                    id = tempId;
                    break;
                }
            }
        }
        
        let mtab = TableRareMonster.getTable();
        let g : Record<number, number[]> = {};
        for (const key in mtab) {
            let id = Number(key);
            let d = mtab[id];
            if(mg[d.group] != undefined){
                if (g[d.group] == undefined) 
                    g[d.group] = [];
                if(d.lv <= mg[d.group])
                    g[d.group].push(id);
            }
        }
        
        let data = new TableRareMonsterSuit(id);
        var flag : boolean = true;
        for (let rid of data.mid){
            if (raremst.id.indexOf(rid) == -1){
                let md = new TableRareMonster(rid);
                let gattr = g[md.group];
                if (gattr == undefined || gattr.indexOf(rid) == -1){
                    flag = false;
                    break;
                }
            }
        }
        if(flag){
            if (index == -1) 
                raremst.suit.push(id);
            else {
                raremst.suit.splice(index, 1, id);
            }  
            let roleHero = retRoleALLInfo.roleHero;
            retMsg.hero = retMsg.hero || {};
            for (const heroid in roleHero) {
                if (Object.prototype.hasOwnProperty.call(roleHero, heroid)) {
                    cpHero.cpHeroAttr(roleHero[heroid], retRoleALLInfo.roleInfo.info)
                    retMsg.hero[heroid] = cloneDeep(roleHero[heroid]);
                }
            }
            retMsg.raremst = raremst;
            retMsg.id = id;
            await this.gameDataService.updateRoleInfo(roleKeyDto, retRoleALLInfo.roleInfo);
            languageConfig.setActTypeSuccess(EActType.RARE_MONSTER_SUIT, retMsg);
        } else {
            retMsg.msg = "升级条件不满足";
        }
        return retMsg;
    }

    static getSkill(roleInfo: RoleInfoEntity, skill_list : number[]) {
        let raremst = roleInfo.info.raremst;
        if (raremst == undefined)
            return;
        for (let mid of raremst.fight[raremst.use]){
            let d = new TableRareMonster(mid);
            if (d != undefined && d.skill > 0){
                skill_list.push(d.skill);
            }
        }
    }

    
}
