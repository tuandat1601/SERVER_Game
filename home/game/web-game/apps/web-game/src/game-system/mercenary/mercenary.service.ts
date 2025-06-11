import { Injectable } from '@nestjs/common';
import { cloneDeep } from 'lodash';
import { EActType, EFightResults, EFightType } from '../../config/game-enum';
import { TableGameConfig } from '../../config/gameTable/TableGameConfig';
import { TableGameLevels } from '../../config/gameTable/TableGameLevels';
import { TableGameSys } from '../../config/gameTable/TableGameSys';
import { TableMercenaryAct } from '../../config/gameTable/TableMercenaryAct';
import { TableMercenaryFight } from '../../config/gameTable/TableMercenaryFight';
import { TableMercenaryGo } from '../../config/gameTable/TableMercenaryGo';
import { TableMercenaryLV } from '../../config/gameTable/TableMercenaryLV';
import { languageConfig } from '../../config/language/language';
import { RESMercenaryMsg, RESMercenaryPkMsg } from '../../game-data/entity/msg.entity';
import { MercenaryLvEntity, RoleSubInfoEntity } from '../../game-data/entity/roleinfo.entity';
import { GameDataService, GetRoleALLInfoDto } from '../../game-data/gamedata.service';
import { RoleKeyDto } from '../../game-data/role/dto/role-key.dto';
import { cTools } from '../../game-lib/tools';
import { FightService } from '../fight/fight.service';
import { cGameCommon, RetRoleALLInfo } from '../game-common';
import { cpHero } from '../hero/hero-cpattr';
import { cItemBag } from '../item/item-bag';
import { MercenaryActDto, MercenaryDto, MercenarygoDto } from './dto/mercenary.dto';

@Injectable()
export class MercenaryService {
    constructor(private readonly gameDataService: GameDataService,
        private readonly fightService: FightService,) { }

    async act(req: any, dto: MercenaryActDto) {
        let roleKeyDto: RoleKeyDto = { id: req.user.id, serverid: req.user.serverid };

        let retMsg: RESMercenaryMsg = new RESMercenaryMsg();
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
        if (!cGameCommon.isOpenSystem(retRoleALLInfo, TableGameSys.mercenary)) {
            retMsg.msg = languageConfig.tip.not_open_system;
            return retMsg;
        }
        let mercenary = retRoleALLInfo.roleSubInfo.mercenary
        let mlv = mercenary?.mlv
        if (!mercenary || !mlv) {
            retMsg.msg = languageConfig.tip.error_system_data;
            return retMsg;
        }
        if (mlv[dto.type]) {
            retMsg.msg = '重复激活';
            return retMsg;
        }
        let tab = new TableMercenaryAct(dto.type)
        if ((tab.id ?? 0) === 0) {
            return retMsg;
        }
        // //-----------------激活条件-----------------------
        /**铁匠铺等级达到n级 */
        if (tab.boxlv > 0) {
            let n = retRoleALLInfo.roleSubInfo?.ebox?.lv || 0
            if (n < tab.boxlv) {
                retMsg.msg = '铁匠铺等级不足';
                return retMsg;
            }
        }
        /**击毁n条海盗船 */
        if (tab.shipnum > 0) {
            // let n = mercenary?.actinfo?.pn || 0
            let n = retRoleALLInfo.roleSubInfo?.pirateShip?.killNum || 0
            if (n < tab.shipnum) {
                retMsg.msg = '击毁海盗船不足';
                return retMsg;
            }
        }
        /**竞技场获胜n场 */
        if (tab.arena_winnum > 0) {
            let n = mercenary?.actinfo?.an || 0
            if (n < tab.arena_winnum) {
                retMsg.msg = '竞技场获胜不足';
                return retMsg;
            }
        }
        /**精英副本n层 */
        if (tab.elitelv > 0) {
            let n = retRoleALLInfo.roleSubInfo?.elitelevels || 0
            if (n < tab.elitelv) {
                retMsg.msg = '通关精英副本不足';
                return retMsg;
            }
        }
        /**挑战魔龙伤害达到n */
        if (tab.damage > 0) {
            let n = mercenary?.actinfo?.dam || 0
            if (n < tab.damage) {
                retMsg.msg = '挑战魔龙伤害不足';
                return retMsg;
            }
        }
        //----------------------------------------
        mlv[dto.type] = new MercenaryLvEntity(tab.id, tab.fid);
        retMsg.mercenary = mercenary;
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
        languageConfig.setActTypeSuccess(EActType.MERCENARY_ACT, retMsg);

        return retMsg;
    }

    async up(req: any, dto: MercenaryDto) {
        let roleKeyDto: RoleKeyDto = { id: req.user.id, serverid: req.user.serverid };

        let retMsg: RESMercenaryMsg = new RESMercenaryMsg();
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
        if (!cGameCommon.isOpenSystem(retRoleALLInfo, TableGameSys.mercenary)) {
            retMsg.msg = languageConfig.tip.not_open_system;
            return retMsg;
        }
        let mercenary = retRoleALLInfo.roleSubInfo.mercenary
        if (!mercenary) {
            retMsg.msg = languageConfig.tip.error_system_data;
            return retMsg;
        }
        let cur_mer = mercenary?.mlv[dto.type];
        if (!cur_mer) {
            retMsg.msg = '未激活';
            return retMsg;
        }
        let tab = new TableMercenaryLV(cur_mer.id)
        if (tab.type !== dto.type) {
            return retMsg;
        }
        if (tab.nextid === 0) {
            retMsg.msg = '已满级';
            return retMsg;
        }
        //-------------------消耗-------------------
        let addexp = 0
        let Bag = retRoleALLInfo.roleItem;
        let getexp = 0
        for (const key in tab.cost) {
            if (Object.prototype.hasOwnProperty.call(tab.cost, key)) {
                if (Number(key) == dto.itemid) {
                    getexp = tab.cost[key];
                }
            }
        }

        let min_num = Math.min(Bag[dto.itemid], dto.count)
        let costItem = {}
        costItem[dto.itemid] = min_num;
        cItemBag.costItem(retRoleALLInfo.roleItem, costItem, retMsg);
        if (!retMsg.ok) { return retMsg; }
        addexp = min_num * getexp;

        if ((addexp ?? 0) === 0) {
            return retMsg;
        }
        //----------------升级----------------------
        cur_mer.exp += addexp;
        let isup = this.changeLv(cur_mer);
        // let isloop: boolean = false;
        // do {
        //     isloop = false;
        //     let curtab = new TableMercenaryLV(cur_mer.id)
        //     if (cur_mer.exp >= curtab.exp && curtab.nextid !== 0) {
        //         cur_mer.exp -= curtab.exp;
        //         isloop = true;
        //         isup = true;
        //         cur_mer.id = curtab.nextid;
        //     }
        // } while (isloop);
        // // mercenary.mlv[dto.type] = cur_mer;
        retMsg.mercenary = mercenary;
        if (isup) {
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
        }
        //--------------------------------------
        await this.gameDataService.updateRoleInfo(roleKeyDto, retRoleALLInfo.roleInfo);
        await this.gameDataService.updateRoleItem(roleKeyDto, retRoleALLInfo.roleItem);
        languageConfig.setActTypeSuccess(EActType.MERCENARY_Up, retMsg);

        return retMsg;
    }
    /**
     * 佣兵改变等级
     * @param cur_mer 
     */
    changeLv(cur_mer: MercenaryLvEntity) {
        let isloop: boolean = false;
        let isup: boolean = false;
        do {
            isloop = false;
            let curtab = new TableMercenaryLV(cur_mer.id)
            if (cur_mer.exp >= curtab.exp && curtab.nextid !== 0) {
                cur_mer.exp -= curtab.exp;
                isloop = true;
                isup = true;
                cur_mer.id = curtab.nextid;
            }
        } while (isloop);
        return isup;
    }

    /**切磋 */
    async pk(req: any, dto: MercenaryActDto) {

        let roleKeyDto: RoleKeyDto = { id: req.user.id, serverid: req.user.serverid };

        let retMsg: RESMercenaryPkMsg = new RESMercenaryPkMsg();

        let getRoleALLInfoDto = new GetRoleALLInfoDto(roleKeyDto);
        getRoleALLInfoDto.need_roleInfo = true;
        getRoleALLInfoDto.need_roleHero = true;
        //获取角色信息
        let retRoleALLInfo: RetRoleALLInfo = await this.gameDataService.getRoleAllInfo(getRoleALLInfoDto);
        if (!retRoleALLInfo.isHaveData()) {
            retMsg.msg = retRoleALLInfo.getRetMsg();
            return retMsg;
        }
        if (!cGameCommon.isOpenSystem(retRoleALLInfo, TableGameSys.mercenary)) {
            retMsg.msg = languageConfig.tip.not_open_system;
            return retMsg;//系统是否开放
        }
        let mercenary = retRoleALLInfo.roleSubInfo.mercenary
        if (!mercenary) {
            retMsg.msg = languageConfig.tip.error_system_data;
            return retMsg;
        }
        let cur_m = mercenary?.mlv[dto.type];
        let fid = cur_m?.fid
        let mid = cur_m?.id
        if (!fid) { //包含  undefined null  0
            retMsg.msg = '无效战斗';
            return retMsg;
        }
        let tab = new TableMercenaryFight(fid)
        let mlv = TableMercenaryLV.getVal(mid, TableMercenaryLV.field_lv)
        if (tab && tab.mlv > 0 && tab.mlv > mlv) {
            retMsg.msg = '佣兵等级不足';
            return retMsg;
        }
        if (tab && tab.rlv > 0 && tab.rlv > retRoleALLInfo.roleInfo.rolelevel) {
            retMsg.msg = '角色等级不足';
            return retMsg;
        }
        //进行战斗
        let isok = await this.fightService.goFight(EFightType.Mercenary, roleKeyDto, retRoleALLInfo.roleInfo, { levels: fid, pos: 0 }, retRoleALLInfo.roleHero, retMsg);
        if (!isok) { return retMsg; }

        if (retMsg.results === EFightResults.WIN) {  //战斗赢了
            //道具奖励
            let gltab = new TableGameLevels(fid)
            if (gltab.drop && gltab.drop.length > 0) {
                let dropDataEntity = await cGameCommon.addItemByDrop(roleKeyDto, gltab.drop, this.gameDataService);
                cGameCommon.hanleDropMsg(dropDataEntity, retMsg);
            }
            mercenary.mlv[dto.type].fid = gltab.nextid;
        }
        retMsg.mercenary = mercenary;
        languageConfig.setActTypeSuccess(EActType.MERCENARY_FIGHT, retMsg);

        await this.gameDataService.updateRoleInfo(roleKeyDto, retRoleALLInfo.roleInfo);


        return retMsg;

    }

    /**寻宝 */
    async go(req: any, dto: MercenarygoDto) {

        dto.count = dto.count || 1;
        let roleKeyDto: RoleKeyDto = { id: req.user.id, serverid: req.user.serverid };

        let retMsg: RESMercenaryMsg = new RESMercenaryMsg();

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
        if (!cGameCommon.isOpenSystem(retRoleALLInfo, TableGameSys.mercenary)) {
            retMsg.msg = languageConfig.tip.not_open_system;
            return retMsg;//系统是否开放
        }
        let mercenary = retRoleALLInfo.roleSubInfo.mercenary
        if (!mercenary) {
            retMsg.msg = languageConfig.tip.error_system_data;
            return retMsg;
        }

        //消耗
        let itemid = TableGameConfig.mercenary_data?.itemid
        if (itemid) {
            let costItem = {}
            costItem[itemid] = dto.count;
            cItemBag.costItem(retRoleALLInfo.roleItem, costItem, retMsg);
            if (!retMsg.ok) { return retMsg; }
            await this.gameDataService.updateRoleItem(roleKeyDto, retRoleALLInfo.roleItem);
        }
        let count = cloneDeep(dto.count);
        let isup = false;
        let tab = TableMercenaryGo.getTable()
        let keys = Object.keys(tab)
        do {
            count--;
            let randkeys = keys[Math.floor(Math.random() * keys.length)]
            let data: TableMercenaryGo = tab[randkeys]
            let drop = data.drop
            //道具奖励
            if (drop && drop.length > 0) {
                let dropDataEntity = await cGameCommon.addItemByDrop(roleKeyDto, drop, this.gameDataService);
                cGameCommon.hanleDropMsg(dropDataEntity, retMsg);
            }
            //遇见仙友
            let mlv = mercenary.mlv
            for (let index = 0; index < data.prob.length; index++) {
                const element = data.prob[index];
                let rank = Math.floor(Math.random() * 10000)
                if (mlv[element.t] && rank < element.p) {
                    mlv[element.t].exp += (element.e || 1);
                    this.changeLv(mlv[element.t]);
                    retMsg.meet = retMsg.meet || []
                    retMsg.meet.push(element.t)
                    isup = true;
                }
            }
            if (isup) {
                retMsg.mercenary = mercenary
            }
            retMsg.goid = Number(randkeys)
        } while (count > 0)
        //小于最大数量开始恢复骰子
        if (retRoleALLInfo.roleItem[itemid] < TableGameConfig.mercenary_max) {
            if (!mercenary.flag_time) {
                mercenary.flag_time = cTools.newLocalDateString();
                retMsg.flag_time = mercenary.flag_time;
            }
        }
        languageConfig.setActTypeSuccess(EActType.MERCENARY_GO, retMsg);
        await this.gameDataService.updateRoleInfo(roleKeyDto, retRoleALLInfo.roleInfo);
        retMsg.taskCount = dto.count
        return retMsg;

    }

    /**
     * 更新新的信息
     * @param req 
     * @param psUpdateDateDto 
     * @returns 
     */
    async upData(req: any) {

        let roleKeyDto: RoleKeyDto = { id: req.user.id, serverid: req.user.serverid };

        let retMsg: RESMercenaryMsg = new RESMercenaryMsg();
        let getRoleALLInfoDto = new GetRoleALLInfoDto(roleKeyDto);
        getRoleALLInfoDto.need_roleInfo = true;
        getRoleALLInfoDto.need_roleItem = true;
        //获取角色信息
        let retRoleALLInfo: RetRoleALLInfo = await this.gameDataService.getRoleAllInfo(getRoleALLInfoDto);
        if (!retRoleALLInfo.isHaveData()) {
            retMsg.msg = retRoleALLInfo.getRetMsg();
            return retMsg;
        }

        //系统是否开放
        if (!cGameCommon.isOpenSystem(retRoleALLInfo, TableGameSys.mercenary)) {
            retMsg.msg = languageConfig.tip.not_open_system;
            return retMsg;
        }

        let mercenary = retRoleALLInfo.roleSubInfo.mercenary
        if (!mercenary) {
            retMsg.msg = languageConfig.tip.error_system_data;
            return retMsg;
        }
        let itemid = TableGameConfig.mercenary_data?.itemid
        let cur_num = retRoleALLInfo.roleItem[itemid] = retRoleALLInfo.roleItem[itemid] || 0;
        if (cur_num < TableGameConfig.mercenary_max && mercenary.flag_time) {
            let dif_min = cTools.GetDateMinutesDiff(new Date(mercenary.flag_time), new Date());
            if (dif_min >= TableGameConfig.mercenary_time) {
                let add_num = Math.floor(dif_min / TableGameConfig.mercenary_time);

                if (cur_num + add_num > TableGameConfig.mercenary_max) {
                    add_num = TableGameConfig.mercenary_max - cur_num;
                    delete mercenary.flag_time;
                }
                else {
                    //没回满 记录没超过1回复的时间
                    let last_min = dif_min % TableGameConfig.mercenary_time;
                    let cur_data = new Date();
                    cur_data.setMinutes(cur_data.getMinutes() - last_min);
                    mercenary.flag_time = cTools.newLocalDateString(cur_data);
                }

                let add_items = {};
                add_items[itemid] = add_num;
                let dropDataEntity = await cGameCommon.addItem(roleKeyDto, add_items, this.gameDataService);
                cGameCommon.hanleDropMsg(dropDataEntity, retMsg);

            }
        }

        if (mercenary.flag_time) {
            // retMsg.mercenary = mercenary;
            retMsg.flag_time = mercenary.flag_time;
        }

        await this.gameDataService.updateRoleInfo(roleKeyDto, { info: retRoleALLInfo.roleSubInfo });

        languageConfig.setActTypeSuccess(EActType.MERCENARY_UPDATA, retMsg);
        return retMsg;
    }

}
