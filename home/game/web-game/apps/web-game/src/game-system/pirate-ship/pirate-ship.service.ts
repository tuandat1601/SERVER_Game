import { Body, Injectable, Request } from '@nestjs/common';
import { clone, min } from 'lodash';
import { gameConst } from '../../config/game-const';
import { EActType, EPSStatus, EPSActType } from '../../config/game-enum';
import { TableGameConfig } from '../../config/gameTable/TableGameConfig';
import { TableGameSys } from '../../config/gameTable/TableGameSys';
import { TablePirateShip } from '../../config/gameTable/TablePirateShip';
import { TablePirateShipCell } from '../../config/gameTable/TablePirateShipCell';
import { TablePirateShipShell } from '../../config/gameTable/TablePirateShipShell';
import { TablePirateShipWelfare } from '../../config/gameTable/TablePirateShipWelfare';
import { TablePirateShipItems } from '../../config/gameTable/TablePirateShipItems';
import { TableStatus } from '../../config/gameTable/TableStatus';
import { languageConfig } from '../../config/language/language';
import { GameConfigService } from '../../game-config/game-config.service';
import { RESChangeMsg, RESPSGetRankMsg, RESPSGetWelFareAwardMsg, RESPSGoActMsg, RESPSSellLvUpMsg, RESPSUpdateDateMsg, RESPSFreshMsg } from '../../game-data/entity/msg.entity';
import { PirateShipRoleEntity, PSActEntity, PSBuffEntity, PSFightEntity } from '../../game-data/entity/pirateShip.entity';
import { GameDataService, GetRoleALLInfoDto } from '../../game-data/gamedata.service';
import { RoleKeyDto } from '../../game-data/role/dto/role-key.dto';
import { cTools } from '../../game-lib/tools';
import { cGameCommon, RetRoleALLInfo } from '../game-common';
import { cGameServer } from '../game-server';
import { cItemBag } from '../item/item-bag';
import { PSGetRankDto, PSGetWelFareAwardDto, PSGoActDto, PSSellLvUpDto, PSUpdateDateDto } from './dto/pirate-ship.dto';
import { RoleSubInfoEntity } from '../../game-data/entity/roleinfo.entity';

@Injectable()
export class PirateShipService {

    constructor(private readonly gameDataService: GameDataService,
    ) { }

    /**
     * 更新新的信息
     * @param req 
     * @param psUpdateDateDto 
     * @returns 
     */
    async psUpdateDate(@Request() req: any, @Body() psUpdateDateDto: PSUpdateDateDto) {

        let roleKeyDto: RoleKeyDto = { id: req.user.id, serverid: req.user.serverid };

        let retMsg: RESPSUpdateDateMsg = new RESPSUpdateDateMsg();
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
        if (!cGameCommon.isOpenSystem(retRoleALLInfo, TableGameSys.pirateShip)) {
            retMsg.msg = languageConfig.tip.not_open_system;
            return retMsg;
        }

        //是否在有效时间内
        if (!cTools.checkSystemActTime(TableGameSys.pirateShip)) {
            retMsg.msg = languageConfig.tip.errortime_system;
            return retMsg;
        }

        let pirateShip = retRoleALLInfo.roleSubInfo.pirateShip;
        if (!pirateShip) {
            retMsg.msg = languageConfig.tip.error_system_data;
            return;
        }

        let cur_num = retRoleALLInfo.roleItem[TableGameConfig.ps_item_ndice] = retRoleALLInfo.roleItem[TableGameConfig.ps_item_ndice] || 0;
        if (cur_num < TableGameConfig.ps_dice_max && pirateShip.adddice_time) {
            let dif_min = cTools.GetDateMinutesDiff(new Date(pirateShip.adddice_time), new Date());
            if (dif_min >= TableGameConfig.ps_add_dicetime) {
                let add_num = Math.floor(dif_min / TableGameConfig.ps_add_dicetime);

                if (cur_num + add_num > TableGameConfig.ps_dice_max) {
                    add_num = TableGameConfig.ps_dice_max - cur_num;
                    delete retRoleALLInfo.roleSubInfo.pirateShip.adddice_time;
                }
                else {
                    //没回满 记录没超过1回复的时间
                    let last_min = dif_min % TableGameConfig.ps_add_dicetime;
                    let cur_data = new Date();
                    cur_data.setMinutes(cur_data.getMinutes() - last_min);
                    retRoleALLInfo.roleSubInfo.pirateShip.adddice_time = cTools.newLocalDateString(cur_data);
                }

                let add_items = {};
                add_items[TableGameConfig.ps_item_ndice] = add_num;
                let dropDataEntity = await cGameCommon.addItem(roleKeyDto, add_items, this.gameDataService);
                cGameCommon.hanleDropMsg(dropDataEntity, retMsg);

            }
        }

        if (retRoleALLInfo.roleSubInfo.pirateShip.adddice_time) {
            retMsg.adddice_time = pirateShip.adddice_time;
        }

        await this.gameDataService.updateRoleInfo(roleKeyDto, { info: retRoleALLInfo.roleSubInfo });

        languageConfig.setActTypeSuccess(EActType.PS_UPDATE, retMsg);
        return retMsg;
    }

    /**是否激活下一个海盗船 如果激活后面的战斗行动取消 */
    checkOverShip(pirateShip: PirateShipRoleEntity, psActList: PSActEntity[], isOver: boolean = true) {

        if (pirateShip.fightInfo.hp > 0) {
            return EPSStatus.RUNING;
        }

        let table_data = TablePirateShip.getTable();
        let max_num = Object.keys(table_data).length;
        let cur_act: PSActEntity;

        pirateShip.killNum += 1;
        //击沉奖励显示
        let cur_ship_table = new TablePirateShip(pirateShip.shipId);
        if (true) {
            cur_act = new PSActEntity(EPSActType.NEXT_SHIP);
            if (isOver) cur_act.additmes = cur_ship_table.award;
            delete pirateShip.fightInfo;
            pirateShip.shipId = Number(cTools.randRecordByWeight(table_data));
            pirateShip.fightInfo = new PSFightEntity(pirateShip.shipId);
            cur_act.new_shipId = pirateShip.shipId;
            cur_act.new_fightInfo = pirateShip.fightInfo;
            psActList.push(cur_act);
            return EPSStatus.NEXT_SHIP;
        }
        else {
            pirateShip.fightInfo.hp = 0;
            cur_act = new PSActEntity(EPSActType.OVER);
            cur_act.additmes = cur_ship_table.award;
            psActList.push(cur_act);
            return EPSStatus.OVER;
        }

    }

    /**
     * 是否双倍伤害
     * @param pirateShip 
     * @returns 
     */
    checkDoubleDamage(pirateShip: PirateShipRoleEntity) {

        if (!pirateShip || !pirateShip.fightInfo || !pirateShip.fightInfo.buff) {
            return 1;
        }

        if (pirateShip.fightInfo.buff.length == 0) {
            return 1;
        }

        let buff_ayr = pirateShip.fightInfo.buff;
        for (let index = 0; index < buff_ayr.length; index++) {
            let ps_buff = buff_ayr[index];
            if (ps_buff.type != TableGameConfig.ps_item_double_damage) { continue; }
            if (!ps_buff.once) { continue; }
            ps_buff.once = false;
            return 2;
        }

        return 1;
    }

    /**
     * 每行动5次 随机产生一个新的道具
     * @param pirateShip 
     * @param psActList 
     * @returns 
     */
    randomCellItem(pirateShip: PirateShipRoleEntity, psActList: PSActEntity[]) {

        if (!pirateShip || !psActList) { return; }

        //计算可随机的道具ID
        let cur_roll_items = clone(gameConst.sp_roll_item_once);
        let counts: any = {}
        for (const key in pirateShip.posList) {
            if (Object.prototype.hasOwnProperty.call(pirateShip.posList, key)) {
                const item_id = pirateShip.posList[key];
                if (gameConst.sp_roll_item_once.indexOf(Number(item_id)) !== -1) {
                    cur_roll_items = cur_roll_items.filter(itemid => itemid !== Number(item_id));
                }
                if (counts[item_id]) {
                    counts[item_id]++
                } else {
                    counts[item_id] = 1
                }
            }
        }
        let item_more = TableGameConfig.ps_roll_item_more;
        for (let index = 0; index < item_more.length; index++) {
            const element = item_more[index];
            let length = element.n - (counts[element.i] || 0)
            for (let index = 0; index < length; index++) {
                cur_roll_items.push(Number(element.i))
            }
        }

        // console.log('----->>>',cur_roll_items)
        if (cur_roll_items.length == 0) { return; }

        let table_empty_pos = this.gameDataService.getGameConfigService().getPSEmptyPoslist();
        let cur_empty_ary = [];
        //计算空的格子ID集合
        for (const key in table_empty_pos) {
            if (Object.prototype.hasOwnProperty.call(table_empty_pos, key)) {
                //格子上有道具
                if (pirateShip.posList[key] > 0) { continue; }
                //不能随机到自己的新坐标
                if (pirateShip.pos === Number(key)) { continue; }
                cur_empty_ary.push(key);
            }
        }

        //随机格子ID
        if (cur_empty_ary.length == 0) { return; }
        let cur_idx = Math.floor(Math.random() * cur_empty_ary.length);
        let new_item_pos = cur_empty_ary[cur_idx];

        //随机道具ID
        let item_id_idx = Math.floor(Math.random() * cur_roll_items.length);
        let new_item_id = cur_roll_items[item_id_idx];

        pirateShip.posList = pirateShip.posList || {};
        pirateShip.posList[new_item_pos] = new_item_id;
        let cur_act = new PSActEntity(EPSActType.RANDOM_ADD_CELLITEM);
        cur_act.newpos_itemid = {};
        cur_act.newpos_itemid[new_item_pos] = new_item_id;
        psActList.push(cur_act);

    }

    setShipDamage(damage: number, pirateShip: PirateShipRoleEntity, act: PSActEntity, retMsg: RESPSGoActMsg, dam_itemid: number) {

        let isDoubleDam = this.checkDoubleDamage(pirateShip);
        let total_dam = damage * isDoubleDam;
        pirateShip.fightInfo.hp -= total_dam;
        if (pirateShip.fightInfo.hp < 0) {pirateShip.fightInfo.hp = 0;}
        pirateShip.damage += total_dam;
        act.setDamage(total_dam, dam_itemid);
        if (total_dam > 0) {
            retMsg.taskCount = retMsg.taskCount || 0;
            retMsg.taskCount += total_dam;
        }
        return this.checkOverShip(pirateShip, retMsg.psActList);
    }

    async haneleShipAward(cur_status: number, cur_ship_id: number, roleKeyDto: RoleKeyDto, retMsg: RESPSGoActMsg, roleSubInfo: RoleSubInfoEntity) {
        //结算海盗船 奖励
        if (cur_status === EPSStatus.NEXT_SHIP || cur_status === EPSStatus.OVER) {
            let cur_ship_table = new TablePirateShip(cur_ship_id)
            let dropDataEntity = await cGameCommon.addItem(roleKeyDto, cur_ship_table.award, this.gameDataService);
            cGameCommon.hanleDropMsg(dropDataEntity, retMsg);
            // //佣兵激活条件
            // let actinfo = roleSubInfo.mercenary?.actinfo
            // if (actinfo && actinfo.pn !== undefined) {
            //     actinfo.pn++;
            // }
        }
    }

    /**
     * 玩家行动
     * @param req 
     * @param psGoActDto 
     * @returns 
     */
    async psGoAct(@Request() req: any, @Body() psGoActDto: PSGoActDto) {
        let roleKeyDto: RoleKeyDto = { id: req.user.id, serverid: req.user.serverid };

        let retMsg: RESPSGoActMsg = new RESPSGoActMsg();

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

        //系统是否开放
        if (!cGameCommon.isOpenSystem(retRoleALLInfo, TableGameSys.pirateShip)) {
            retMsg.msg = languageConfig.tip.not_open_system;
            return retMsg;
        }

        //是否在有效时间内
        if (!cTools.checkSystemActTime(TableGameSys.pirateShip)) {
            retMsg.msg = languageConfig.tip.errortime_system;
            return retMsg;
        }

        //系统数据是否正常
        let pirateShip = retRoleALLInfo.roleSubInfo.pirateShip;
        if (!pirateShip) {
            retMsg.msg = languageConfig.tip.error_system_data;
            return retMsg;
        }

        //是否已经打完全部的海盗船
        let table_data = TablePirateShip.getTable();
        let max_num = Object.keys(table_data).length;
        if (pirateShip.fightInfo.hp <= 0 && pirateShip.shipId >= max_num) {
            retMsg.msg = "已打完全部的海盗船";
            return retMsg;
        }

        //骰子是否足够
        let costItem = {}
        if (psGoActDto.ldice > 0) {

            //骰子范围是否合法
            // TableGameConfig.ps_act_pos_rang[1] + TableGameConfig.ps_act_pos_rang[0]
            if (psGoActDto.ldice < TableGameConfig.ps_act_pos_rang[0]
                || psGoActDto.ldice > TableGameConfig.ps_act_pos_rang[1]) {
                retMsg.msg = "幸运骰子点数超过了正常范围";
                return retMsg;
            }
            //幸运骰子
            costItem[TableGameConfig.ps_item_ldice] = 1;
        }
        else {
            //普通骰子
            costItem[TableGameConfig.ps_item_ndice] = 1;
        }
        cItemBag.costItem(retRoleALLInfo.roleItem, costItem, retMsg);
        if (!retMsg.ok) { return retMsg; }


        //随机行走距离
        let dis = 0;
        if (psGoActDto.ldice > 0) {
            //幸运骰子
            dis = psGoActDto.ldice;
        }
        else {
            //普通骰子
            dis = Math.floor(Math.random() * TableGameConfig.ps_act_pos_rang[1] + TableGameConfig.ps_act_pos_rang[0]);
        }
        let cell_list = TablePirateShipCell.getTable();
        let cell_max = Object.keys(cell_list).length;
        pirateShip.pos += dis;
        if (pirateShip.pos !== cell_max) {
            pirateShip.pos = pirateShip.pos % cell_max;
        }


        //表里的格子配置
        let table_pos_list = this.gameDataService.getGameConfigService().getPSPosList();

        //匹配格子事件
        //配置表
        let pos_type = table_pos_list[pirateShip.pos];
        if (pos_type === undefined) {
            retMsg.msg = "格子数据异常pos:" + pirateShip.pos;
            return retMsg;
        }
        //新随机出来的格子事件
        if (pos_type === 0 && pirateShip.posList[pirateShip.pos] != 0) {
            pos_type = pirateShip.posList[pirateShip.pos];
        }

        //保存已扣去的道具数量
        await this.gameDataService.updateRoleItem(roleKeyDto, retRoleALLInfo.roleItem);
        //保存当前的海盗船ID
        let cur_ship_id = pirateShip.shipId;

        retMsg.psActList = [];

        //小于最大数量开始恢复骰子
        if (retRoleALLInfo.roleItem[TableGameConfig.ps_item_ndice] < TableGameConfig.ps_dice_max) {
            if (!pirateShip.adddice_time) {
                pirateShip.adddice_time = cTools.newLocalDateString();
            }
        }

        //移动事件
        let cur_act = new PSActEntity(EPSActType.MOVE_CELL);
        cur_act.newpos = pirateShip.pos;
        cur_act.change_energy = dis;
        retMsg.psActList.push(cur_act);

        let cur_status = EPSStatus.RUNING;
        let is_have_dam = false;
        //执行格子事件
        if (pos_type != 0) {
            let cur_act: PSActEntity;
            if (pos_type === TableGameConfig.ps_item_nshell || pos_type === TableGameConfig.ps_item_bshell || pos_type === TableGameConfig.ps_item_tshell) {

                cur_act = new PSActEntity(EPSActType.FIRE_SHELL);
                cur_act.damage_itemid = pos_type;
                retMsg.psActList.push(cur_act);
                let cur_data1 = this.gameDataService.getGameConfigService().getPsShellData(pos_type, pirateShip.shellInfo[pos_type]);
                let cur_data = new TablePirateShipShell(cur_data1.id);

                //是否有直害
                if (cur_data.damage > 0) {
                    is_have_dam = true;
                    cur_status = this.setShipDamage(cur_data.damage, pirateShip, cur_act, retMsg, pos_type);
                    retRoleALLInfo.roleSubInfo.pirateShip.fightInfo = pirateShip.fightInfo;
                    await this.haneleShipAward(cur_status, cur_ship_id, roleKeyDto, retMsg, retRoleALLInfo.roleSubInfo);
                }
                //如果有dot伤害或者over伤害 则添加BUFF
                if (cur_status === EPSStatus.RUNING && (cur_data.dot > 0 || cur_data.over > 0)) {
                    cur_act = new PSActEntity(EPSActType.ADD_BUFF);
                    retMsg.psActList.push(cur_act);
                    pirateShip.fightInfo.buff_idtag++;
                    let b_buff = new PSBuffEntity(pos_type, pirateShip.fightInfo.buff_idtag);
                    b_buff.lv = pirateShip.shellInfo[pos_type];
                    b_buff.count = cur_data.time;
                    cur_act.add_buff = b_buff
                    pirateShip.fightInfo.buff.push(b_buff);
                }
            }
            // else if (pos_type === TableGameConfig.ps_item_ndice || pos_type === TableGameConfig.ps_item_ldice || pos_type === TableGameConfig.ps_item_upshell
            //     || pos_type === TableGameConfig.ps_item_double_damage || pos_type === TableGameConfig.ps_item_energy) {
            else if (
                gameConst.sp_roll_item_once.indexOf(Number(pos_type)) !== -1
            ) {
                cur_act = new PSActEntity(EPSActType.ADD_CELL_ITEM);
                retMsg.psActList.push(cur_act);

                delete pirateShip.posList[pirateShip.pos];

                let add_num = 1;
                let is_addbag = true;
                const ps_items = TablePirateShipItems.getTable()
                for (const key in ps_items) {
                    if (Object.prototype.hasOwnProperty.call(ps_items, key)) {
                        const element = ps_items[key];
                        if (Number(key) === pos_type) {
                            add_num = Math.floor(Math.random() * (element.max - element.min) + element.min);
                            break;
                        }

                    }
                }
                if (pos_type === TableGameConfig.ps_item_energy) {
                    is_addbag = false;
                    cur_act.change_energy = add_num;
                    pirateShip.fireEnergy += cur_act.change_energy;
                }
                else if (pos_type === TableGameConfig.ps_item_double_damage) {
                    is_addbag = false;
                    //添加BUFF
                    cur_act = new PSActEntity(EPSActType.ADD_BUFF);
                    retMsg.psActList.push(cur_act);
                    pirateShip.fightInfo.buff_idtag++;
                    let b_buff = new PSBuffEntity(TableGameConfig.ps_item_double_damage, pirateShip.fightInfo.buff_idtag);
                    b_buff.count = 1;
                    b_buff.once = true;
                    cur_act.add_buff = b_buff
                    pirateShip.fightInfo.buff.push(b_buff);
                }

                if (is_addbag) {
                    cur_act.additmes = {};
                    cur_act.additmes[pos_type] = cur_act.additmes[pos_type] || 0;
                    cur_act.additmes[pos_type] = add_num;
                    //添加道具到背包
                    let dropDataEntity = await cGameCommon.addItem(roleKeyDto, cur_act.additmes, this.gameDataService);
                    cGameCommon.hanleDropMsg(dropDataEntity, retMsg);
                }

            }
        }

        //能量炮计算
        pirateShip.fireEnergy += dis;
        if (cur_status !== EPSStatus.OVER && pirateShip.fireEnergy >= TableGameConfig.ps_fire_energy_max) {
            let cur_act = new PSActEntity(EPSActType.FIRE_SHELL);
            cur_act.damage_itemid = TableGameConfig.ps_item_energy;
            retMsg.psActList.push(cur_act);

            //扣去能量
            pirateShip.fireEnergy -= TableGameConfig.ps_fire_energy_max;
            cur_act.change_energy = -TableGameConfig.ps_fire_energy_max;

            //普通弹药伤害
            const cur_data = this.gameDataService.getGameConfigService().getPsShellData(TableGameConfig.ps_item_nshell, pirateShip.shellInfo[TableGameConfig.ps_item_nshell]);
            cur_status = this.setShipDamage(cur_data.damage, pirateShip, cur_act, retMsg, TableGameConfig.ps_item_energy);
            retRoleALLInfo.roleSubInfo.pirateShip.fightInfo = pirateShip.fightInfo;
            await this.haneleShipAward(cur_status, cur_ship_id, roleKeyDto, retMsg, retRoleALLInfo.roleSubInfo);
            is_have_dam = true;
        }


        if (cur_status !== EPSStatus.OVER) {
            //BUFF 伤害
            let buff_ayr = pirateShip.fightInfo.buff;
            let remove_buff_ids = [];
            for (let index = 0; index < buff_ayr.length; index++) {
                let ps_buff = buff_ayr[index];
                let cur_data: any;

                if (cur_status === EPSStatus.OVER) { break; }
                //燃烧弹
                if (ps_buff.type === TableGameConfig.ps_item_bshell) {
                    let cur_act = new PSActEntity(EPSActType.TRIGGER_BUFF);
                    retMsg.psActList.push(cur_act);
                    cur_data = this.gameDataService.getGameConfigService().getPsShellData(TableGameConfig.ps_item_bshell, pirateShip.shellInfo[TableGameConfig.ps_item_bshell]);
                    cur_status = this.setShipDamage(cur_data.dot, pirateShip, cur_act, retMsg, TableGameConfig.ps_item_bshell);
                    retRoleALLInfo.roleSubInfo.pirateShip.fightInfo = pirateShip.fightInfo;
                    await this.haneleShipAward(cur_status, cur_ship_id, roleKeyDto, retMsg, retRoleALLInfo.roleSubInfo);
                    is_have_dam = true;
                }

                //回合结算
                if (!ps_buff.once) { ps_buff.count--; }

                //BUFF 是否要删除
                if (ps_buff.count >= 1) { continue; }

                //触发-定时炸弹
                if (ps_buff.type === TableGameConfig.ps_item_tshell) {
                    let cur_act = new PSActEntity(EPSActType.TRIGGER_BUFF);
                    retMsg.psActList.push(cur_act);
                    cur_data = this.gameDataService.getGameConfigService().getPsShellData(TableGameConfig.ps_item_tshell, pirateShip.shellInfo[TableGameConfig.ps_item_tshell]);
                    cur_status = this.setShipDamage(cur_data.over, pirateShip, cur_act, retMsg, TableGameConfig.ps_item_tshell);
                    retRoleALLInfo.roleSubInfo.pirateShip.fightInfo = pirateShip.fightInfo;
                    await this.haneleShipAward(cur_status, cur_ship_id, roleKeyDto, retMsg, retRoleALLInfo.roleSubInfo);
                    is_have_dam = true;
                }

                //记录删除的BUFF
                remove_buff_ids.push(ps_buff.id);

            }

            //删除BUFF
            if (cur_status === EPSStatus.OVER || remove_buff_ids.length > 0) {
                for (let index = 0; index < remove_buff_ids.length; index++) {
                    let buff_id = remove_buff_ids[index];
                    let idx = pirateShip.fightInfo.buff.findIndex(d => d.id === buff_id);
                    pirateShip.fightInfo.buff.splice(idx, 1);
                }
                let cur_act = new PSActEntity(EPSActType.REMOVE_BUFF);
                cur_act.remove_buff = remove_buff_ids;
                retMsg.psActList.push(cur_act);
            }

            if (cur_status !== EPSStatus.OVER) {
                //行动计数
                pirateShip.act_count = pirateShip.act_count || 0;
                pirateShip.act_count++;
                //每5次后随机一次道具
                if (pirateShip.act_count > 0 && pirateShip.act_count % TableGameConfig.ps_act_count == 0) {
                    this.randomCellItem(pirateShip, retMsg.psActList);
                }
            }
        }

        //修改排行榜
        if (is_have_dam) {
            cGameServer.changePSRank(retRoleALLInfo);
            await this.gameDataService.updateSververPSRank(roleKeyDto.serverid, retRoleALLInfo.serverInfo.info);
        }

        if (cur_status === EPSStatus.NEXT_SHIP || cur_status === EPSStatus.OVER) {
            retMsg.killNum = retRoleALLInfo.roleSubInfo.pirateShip.killNum;
        }

        await this.gameDataService.updateRoleInfo(roleKeyDto, { info: retRoleALLInfo.roleSubInfo });
        //新坐标位置
        //pirateShip.pos
        //获得道具行为
        //战斗行为
        if (retMsg.taskCount === undefined) {
            retMsg.taskCount = 1;
        }

        languageConfig.setActTypeSuccess(EActType.PS_GO_ACT, retMsg);
        return retMsg;

    }

    /**
     * 领取宝藏奖励
     * @param req 
     * @param psGetWelFareAwardDto 
     * @returns 
     */
    async psGetWelFareAward(@Request() req: any, @Body() psGetWelFareAwardDto: PSGetWelFareAwardDto) {
        let roleKeyDto: RoleKeyDto = { id: req.user.id, serverid: req.user.serverid };

        let retMsg: RESPSGetWelFareAwardMsg = new RESPSGetWelFareAwardMsg();

        let getRoleALLInfoDto = new GetRoleALLInfoDto(roleKeyDto);
        getRoleALLInfoDto.need_roleInfo = true;

        //获取角色信息
        let retRoleALLInfo: RetRoleALLInfo = await this.gameDataService.getRoleAllInfo(getRoleALLInfoDto);
        if (!retRoleALLInfo.isHaveData()) {
            retMsg.msg = retRoleALLInfo.getRetMsg();
            return retMsg;
        }
        //系统是否开放
        if (!cGameCommon.isOpenSystem(retRoleALLInfo, TableGameSys.pirateShip)) {
            retMsg.msg = languageConfig.tip.not_open_system;
            return retMsg;
        }
        let roleSubInfo = retRoleALLInfo.roleSubInfo;
        if (roleSubInfo.pirateShip === undefined) {
            retMsg.msg = languageConfig.tip.error_system_data;
            return retMsg;
        }

        //是否已购买宝藏福利
        let is_h_awards = false;
        if (cGameCommon.isHaveStatus(retRoleALLInfo.roleInfo, TableStatus.ps_welfare)) {
            is_h_awards = true;
        }


        let welfare_lv = roleSubInfo.pirateShip.welfare_lv || 0;
        let welfare_Hlv = roleSubInfo.pirateShip.welfare_Hlv || 0;

        let table_data = TablePirateShipWelfare.getTable();
        let last_needlv = welfare_lv;
        let last_needHlv = welfare_Hlv;
        let drops = [];
        let cur_killNum = roleSubInfo.pirateShip.killNum;

        // //计算已打过的ID
        // if (roleSubInfo.pirateShip.fightInfo && roleSubInfo.pirateShip.fightInfo.hp > 0) {
        //     cur_killNum--;
        // }

        //买过宝藏额外加海盗船击沉数
        if (is_h_awards) {
            cur_killNum += TableGameConfig.ps_welfare_add;
        }

        for (const lvid in table_data) {
            if (Object.prototype.hasOwnProperty.call(table_data, lvid)) {
                //need_num 等级改成数量
                const need_num = Number(lvid)
                if (cur_killNum < need_num) { continue; }

                let cur_table_data = new TablePirateShipWelfare(Number(lvid));
                if (welfare_lv < need_num) {
                    last_needlv = need_num;
                    drops = drops.concat(cur_table_data.drop1);
                }

                if (is_h_awards && welfare_Hlv < need_num) {
                    last_needHlv = need_num;
                    drops = drops.concat(cur_table_data.drop2);
                }
            }
        }

        if (drops.length === 0) {
            retMsg.msg = "没有奖励可领取";
            return retMsg;
        }

        //修改数据
        roleSubInfo.pirateShip.welfare_lv = last_needlv;
        retMsg.welfare_lv = last_needlv;

        roleSubInfo.pirateShip.welfare_Hlv = last_needHlv;
        retMsg.welfare_Hlv = last_needHlv;

        //发放道具奖励
        let dropDataEntity = await cGameCommon.addItemByDrop(roleKeyDto, drops, this.gameDataService);
        cGameCommon.hanleDropMsg(dropDataEntity, retMsg);

        //保存数据
        await this.gameDataService.updateRoleInfo(roleKeyDto, retRoleALLInfo.roleInfo);

        languageConfig.setActTypeSuccess(EActType.PS_GET_WELFARE_AWARD, retMsg);
        return retMsg;
    }

    /**
     * 炮弹升级
     * @param req 
     * @param psSellLvUpDto 
     */
    async psSellLvUpDto(@Request() req: any, @Body() psSellLvUpDto: PSSellLvUpDto) {

        let roleKeyDto: RoleKeyDto = { id: req.user.id, serverid: req.user.serverid };

        let retMsg: RESPSSellLvUpMsg = new RESPSSellLvUpMsg();

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
        if (!cGameCommon.isOpenSystem(retRoleALLInfo, TableGameSys.pirateShip)) {
            retMsg.msg = languageConfig.tip.not_open_system;
            return retMsg;
        }
        let roleSubInfo = retRoleALLInfo.roleSubInfo;
        if (roleSubInfo.pirateShip === undefined) {
            retMsg.msg = languageConfig.tip.error_system_data;
            return retMsg;
        }

        let pirateShip = roleSubInfo.pirateShip;
        let cur_shell_lv = pirateShip.shellInfo[psSellLvUpDto.shell_itemid];
        let cur_shell_table = this.gameDataService.getGameConfigService().getPsShellData(psSellLvUpDto.shell_itemid, cur_shell_lv);
        if (!cur_shell_table) {
            retMsg.msg = `TablePirateShipShell is error  shllitemid:${psSellLvUpDto.shell_itemid} lv:${cur_shell_lv}`;
            return retMsg;
        }

        let next_shell_table = this.gameDataService.getGameConfigService().getPsShellData(psSellLvUpDto.shell_itemid, cur_shell_lv);
        if (!next_shell_table) {
            retMsg.msg = `等级已满`;
            return retMsg;
        }

        //道具是否足够
        if (cur_shell_table.cost && Object.keys(cur_shell_table.cost).length > 0) {
            cItemBag.costItem(retRoleALLInfo.roleItem, cur_shell_table.cost, retMsg);
        }

        if (!retMsg.ok) { return retMsg; }

        await this.gameDataService.updateRoleItem(roleKeyDto, retRoleALLInfo.roleItem);

        pirateShip.shellInfo[psSellLvUpDto.shell_itemid]++;

        await this.gameDataService.updateRoleInfo(roleKeyDto, { info: roleSubInfo });
        retMsg.shellInfo = pirateShip.shellInfo;
        languageConfig.setActTypeSuccess(EActType.PS_SELL_LVUP, retMsg);
        return retMsg;
    }

    /**
     * 获取排行榜数据
     * @param req 
     * @param psGetRankDto 
     */
    async psGetRank(@Request() req: any, @Body() psGetRankDto: PSGetRankDto) {

        let roleKeyDto: RoleKeyDto = { id: req.user.id, serverid: req.user.serverid };

        let retMsg: RESPSGetRankMsg = new RESPSGetRankMsg();

        let getRoleALLInfoDto = new GetRoleALLInfoDto(roleKeyDto);
        getRoleALLInfoDto.need_roleInfo = true;

        //获取角色信息
        let retRoleALLInfo: RetRoleALLInfo = await this.gameDataService.getRoleAllInfo(getRoleALLInfoDto);
        if (!retRoleALLInfo.isHaveData()) {
            retMsg.msg = retRoleALLInfo.getRetMsg();
            return retMsg;
        }
        //系统是否开放
        if (!cGameCommon.isOpenSystem(retRoleALLInfo, TableGameSys.pirateShip)) {
            retMsg.msg = languageConfig.tip.not_open_system;
            return retMsg;
        }
        let roleSubInfo = retRoleALLInfo.roleSubInfo;
        if (roleSubInfo.pirateShip === undefined) {
            retMsg.msg = languageConfig.tip.error_system_data;
            return retMsg;
        }

        if (!retRoleALLInfo.serverInfo.info || !retRoleALLInfo.serverInfo.info.pirateShip) {
            retMsg.msg = languageConfig.tip.error_system_serverdata;
            return retMsg;
        }

        let pirateShip = roleSubInfo.pirateShip;
        let server_pirateShip = retRoleALLInfo.serverInfo.info.pirateShip;
        pirateShip.rank = cGameCommon.getPSRank(roleKeyDto.id, server_pirateShip.rank);

        retMsg.selfrank = pirateShip.rank;
        retMsg.rank = server_pirateShip.rank;

        await this.gameDataService.updateRoleInfo(roleKeyDto, { info: retRoleALLInfo.roleSubInfo });
        languageConfig.setActTypeSuccess(EActType.PS_GET_RANK, retMsg);

        return retMsg;
    }

    /**
     * 刷新海盗船
     * @param req 
     */
    async psFresh(@Request() req: any) {

        let roleKeyDto: RoleKeyDto = { id: req.user.id, serverid: req.user.serverid };

        let retMsg: RESPSFreshMsg = new RESPSFreshMsg();

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
        if (!cGameCommon.isOpenSystem(retRoleALLInfo, TableGameSys.pirateShip)) {
            retMsg.msg = languageConfig.tip.not_open_system;
            return retMsg;
        }
        let roleSubInfo = retRoleALLInfo.roleSubInfo;
        if (roleSubInfo.pirateShip === undefined) {
            retMsg.msg = languageConfig.tip.error_system_data;
            return retMsg;
        }
        cItemBag.costItem(retRoleALLInfo.roleItem, TableGameConfig.dbfresh_cost, retMsg);
        if (!retMsg.ok) { return retMsg; }
        let pirateShip = roleSubInfo.pirateShip;
        pirateShip.fightInfo.hp = 0;
        retMsg.psActList = [];
        this.checkOverShip(pirateShip, retMsg.psActList, false);
        await this.gameDataService.updateRoleInfo(roleKeyDto, { info: retRoleALLInfo.roleSubInfo });
        await this.gameDataService.updateRoleItem(roleKeyDto, retRoleALLInfo.roleItem);
        languageConfig.setActTypeSuccess(EActType.PS_GO_ACT, retMsg);

        return retMsg;
    }

}
