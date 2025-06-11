import { Body, Injectable, Request } from '@nestjs/common';
import { kMaxLength } from 'buffer';
import { clone, cloneDeep } from 'lodash';
import { gameConst } from '../../config/game-const';
import { EActType } from '../../config/game-enum';
import { TableGameConfig } from '../../config/gameTable/TableGameConfig';
import { TableGameEBoxLv } from '../../config/gameTable/TableGameEBoxLv';
import { TableGameEquip } from '../../config/gameTable/TableGameEquip';
import { TableGameEquipQuality } from '../../config/gameTable/TableGameEquipQuality';
import { TableGameItem } from '../../config/gameTable/TableGameItem';
import { TableGameSBoxLv } from '../../config/gameTable/TableGameSBoxLv';
import { TableGameSkillQuality } from '../../config/gameTable/TableGameSkillQuality';
import { TableGameSys } from '../../config/gameTable/TableGameSys';
import { TableOpenBoxAttr } from '../../config/gameTable/TableOpenBoxAttr';
import { TablePrivilegeType } from '../../config/gameTable/TablePrivilegeType';
import { TableTask } from '../../config/gameTable/TableTask';
import { TableXunBaoAward } from '../../config/gameTable/TableXunBaoAward';
import { languageConfig } from '../../config/language/language';
import { EBoxEntity, SBoxEntity } from '../../game-data/entity/ebox.entity';
import { EquipEntityRecord } from '../../game-data/entity/equip.entity';
import { HerosRecord } from '../../game-data/entity/hero.entity';
import { ItemsRecord } from '../../game-data/entity/item.entity';
import { REMsg, RESCheckLvUpEBoxMsg, RESLvUpEBoxMsg, RESOpenEBoxMsg, RESOpenSBoxMsg, RESQuickenEBoxCDMsg, RESSaveTmpEquipMsg, RESSellTmpEquipMsg, RESSetUpTmpEquipMsg, RESXBAwardMsg } from '../../game-data/entity/msg.entity';
import { RoleInfoEntity, RoleSubInfoEntity } from '../../game-data/entity/roleinfo.entity';
import { TaskEntity } from '../../game-data/entity/task.entity';
import { GameDataService, GetRoleALLInfoDto } from '../../game-data/gamedata.service';
import { RoleKeyDto } from '../../game-data/role/dto/role-key.dto';
import { Logger } from '../../game-lib/log4js';
import { cEquipSystem } from '../equip/equip-system';
import { cGameCommon, RetRoleALLInfo } from '../game-common';
import { cpHero } from '../hero/hero-cpattr';
import { syshero } from '../hero/hero-lvup';
import { cItemBag } from '../item/item-bag';
import { cTaskSystem } from '../task/task-sytem';
import { OpenEBoxDto, OpenSBoxDto, QuickenEBoxCDDto, SaveTmpEquipDto, SellTmpEquipDto, SetUpTmpEquipDto, XBAwardDto } from './dto/box.dto';

@Injectable()
export class BoxService {

  constructor(
    private readonly gameDataService: GameDataService,
  ) {

  }

  /**
   * 开启装备宝箱
   * @param req 
   * @param openEBoxDto 
   * @returns 
   */
  async openEBox(@Request() req: any, @Body() openEBoxDto: OpenEBoxDto) {
    let type = openEBoxDto.type || 0;
    let auto_save = (type == 1) ? true : openEBoxDto.autoSave;
    let roleKeyDto: RoleKeyDto = { id: req.user.id, serverid: req.user.serverid };
    let RESMsg: RESOpenEBoxMsg = new RESOpenEBoxMsg();
    RESMsg.ok = false;
    RESMsg.msg = "no";
    RESMsg.type = type;

    // if (openEBoxDto.num > 10) {
    //   RESMsg.msg = '开启数量超过10';
    //   return RESMsg;
    // }
    let open_num = openEBoxDto.openNum || 1;

    let getRoleALLInfoDto = new GetRoleALLInfoDto(roleKeyDto);
    getRoleALLInfoDto.need_roleInfo = true;
    getRoleALLInfoDto.need_roleHero = true;
    //获取角色信息
    let retRoleALLInfo: RetRoleALLInfo = await this.gameDataService.getRoleAllInfo(getRoleALLInfoDto);
    if (!retRoleALLInfo.isHaveData()) {
      RESMsg.msg = retRoleALLInfo.getRetMsg();
      return RESMsg;
    }


    //获取道具数据
    let item_info = await this.gameDataService.getRoleItem(roleKeyDto);
    if (!item_info || !item_info.info) {
      RESMsg.msg = 'RoleItem is null';
      return RESMsg;
    }

    let roleIemBag: ItemsRecord = <ItemsRecord><unknown>(item_info.info)
    let roleEquip = await this.gameDataService.getRoleEquip(roleKeyDto);
    if (!roleEquip || !roleEquip.info) {
      RESMsg.msg = 'roleEquip is null';
      return RESMsg;
    }

    let equipBagRecord = <EquipEntityRecord><unknown>roleEquip.info;
    let equip_num = Object.keys(equipBagRecord).length;

    /** 装备背包剩余数量 */
    let equip_bag_num = TableGameConfig.equip_bag_max - equip_num;
    if (equip_bag_num <= 0) { //openEBoxDto.autoOpen && auto_save && 
      RESMsg.msg = '装备背包已满,出售后再试';
      return RESMsg;
    }

    if (open_num > equip_bag_num) {
      RESMsg.msg = '装备背包剩余格子不够';
      return RESMsg;
    }
    let itemid = TableGameConfig.itemid_ebox;
    let itemnum = open_num;
    let xbox = retRoleALLInfo.roleInfo.info.xbox;
    let idx = -1;
    if (type == 1) {
      if (xbox == undefined) {
        RESMsg.msg = '系统没有开启';
        return RESMsg;
      }
      if (!(open_num == 1 || open_num == 10)) {
        RESMsg.msg = '寻宝次数参数错误';
        return RESMsg;
      }
      let cfg = TableGameConfig.xb_limit_times;
      for (let i = 0; i < cfg.length; i++) {
        let diff = cfg[i] - (xbox.times[i] || 0);
        if (diff > 0) {
          if (diff < open_num) {
            RESMsg.msg = '寻宝次数不足';
            return RESMsg;
          }
          idx = i;
          break;
        }
      }
      idx = (idx == -1) ? cfg.length - 1 : idx;
      let cost = TableGameConfig.xb_costs[idx][open_num];
      itemid = Number(Object.keys(cost).at(0));
      itemnum = Number(Object.values(cost).at(0));
    }
    if (!roleIemBag[itemid] || roleIemBag[itemid] < itemnum) {
      let item_name = TableGameItem.getVal(Number(itemid), TableGameItem.field_name) || itemid;
      RESMsg.msg = `${item_name + languageConfig.tip.not_enough}`;
      return RESMsg;
    }

    let roleInfo: RoleInfoEntity = await this.gameDataService.getRoleInfo(roleKeyDto)
    if (!roleInfo || !roleInfo.info) {
      RESMsg.msg = 'roleInfo is null';
      return RESMsg;
    }


    if (roleInfo.info?.tmpEquips && Object.keys(roleInfo.info.tmpEquips).length > 0) {
      RESMsg.msg = '请先处理当前对比装备';
      return RESMsg;
    }

    let eBoxEntity: EBoxEntity = retRoleALLInfo.roleInfo.info.ebox;

    if (!TableGameEBoxLv.getVal(eBoxEntity.lv, TableGameEBoxLv.field_spe_count)) {
      RESMsg.msg = 'TableGameEBoxLv data is null by lv:' + eBoxEntity.lv;
      return RESMsg;
    }

    //判断多次打开是否满足等级要求
    let is_can_open = (type == 1) ? true : false;
    if (!is_can_open) {
      let num_config = TableGameConfig.ebox_numcfg;
      for (const key in num_config) {
        if (Object.prototype.hasOwnProperty.call(num_config, key)) {
          let cur_num = Number(key);
          const costInfo = num_config[key];

          if (cur_num === open_num) {
            if (retRoleALLInfo.roleSubInfo.ebox.lv < costInfo.lv) {
              RESMsg.msg = `锻造等级不够,需要${costInfo.lv}级`;
              return RESMsg;
            }
            else {
              is_can_open = true;
            }
          }

        }
      }
    }

    if (!is_can_open) {
      RESMsg.msg = '打开次数配置错误';
      return RESMsg;
    }

    let rolehero = await this.gameDataService.getRoleHero(roleKeyDto);
    if (!rolehero || !rolehero.info) {
      RESMsg.msg = "rolehero is null";
      return RESMsg;
    }


    let heroInfo = <HerosRecord><unknown>rolehero.info;
    let tableGameEBoxLv = new TableGameEBoxLv(eBoxEntity.lv);
    /**开出来的新装备 */
    let addEquip: EquipEntityRecord = {}
    //开始随机装备
    for (let index = 0; index < open_num; index++) {

      let cur_quality = 1;
      let speCount = eBoxEntity.speCount;
      if (type == 1) {
        xbox.total++;
        xbox.times[idx] = (xbox.times[idx] || 0) + 1;
        speCount = xbox.speCount;
      }
      if (speCount >= tableGameEBoxLv.spe_count) {
        //保底品质
        cur_quality = tableGameEBoxLv.spe_quality;
        speCount = 0;
      }
      else {
        //随机品质
        let equip_quality = TableGameEquipQuality.getTable()
        let total_val = 0;
        let random_data = [];
        for (const quality_id in equip_quality) {
          if (Object.prototype.hasOwnProperty.call(equip_quality, quality_id)) {

            if (tableGameEBoxLv["quality_" + quality_id]) {
              let var_data = {
                min_pro: total_val,
                max_pro: total_val + tableGameEBoxLv["quality_" + quality_id],
                quality_id: quality_id
              }
              total_val += tableGameEBoxLv["quality_" + quality_id];
              random_data.push(var_data)
            }

          }
        }

        let random = Math.floor(Math.random() * total_val);
        for (let index = 0; index < random_data.length; index++) {
          const cur_rdata = random_data[index];
          if (cur_rdata.min_pro < random && random <= cur_rdata.max_pro) {
            cur_quality = Number(cur_rdata.quality_id)
            break;
          }
        }
        speCount++;
      }
      if (type == 1)
        xbox.speCount = speCount;
      else
        eBoxEntity.speCount = speCount;

      //随机等级
      const ebox_addlv = TableGameConfig.ebox_addlv;
      let addlv = 0;
      let addlv_randomData = [];
      let addlv_total_pro = 0;

      if (type == 1) {
        let ulv = retRoleALLInfo.roleInfo.info.upgrade || 0;
        if (ulv > 0)
          addlv = TableGameConfig.xb_addlv[ulv] || 0;
      }
      else {
        for (let index = 0; index < ebox_addlv.length; index++) {
          const data = ebox_addlv[index];
          let var_data = {
            min_pro: addlv_total_pro,
            max_pro: addlv_total_pro + data[gameConst.table_pro],
            addlv: data[gameConst.table_val]
          }
          addlv_randomData.push(var_data)
          addlv_total_pro += data[gameConst.table_pro];
        }

        let lv_random = Math.floor(Math.random() * addlv_total_pro)
        for (let index = 0; index < addlv_randomData.length; index++) {
          const data = addlv_randomData[index];
          if (data.min_pro < lv_random && lv_random <= data.max_pro) {
            addlv = data.addlv
            break;
          }
        }
      }

      //随机装备ID
      let new_level = addlv + roleInfo.rolelevel;
      new_level = Math.max(1, new_level);
      new_level = Math.min(new_level, TableGameConfig.role_lv_max);

      const equips = this.gameDataService.getGameConfigService().getEquipsAryByLv(new_level);
      if (!equips) {
        RESMsg.msg = 'getEquipsAryByLv equips is null new_level:' + new_level;
        return RESMsg;
      }

      let random_var = Math.floor(Math.random() * equips.length);
      const equip_data = equips[random_var];

      //新装备
      let new_equipEntity = this.gameDataService.createEquip(equip_data.id, cur_quality);
      //跟谁对比
      let equip_pos = TableGameEquip.getVal(new_equipEntity.id, TableGameEquip.field_pos);
      let tmp_hero_id = syshero.getLowHeroByEquipPos(heroInfo, equip_pos);
      new_equipEntity.tmphid = tmp_hero_id;
      if (type == 0) {
        //记录对比装备
        retRoleALLInfo.roleInfo.info.tmpEquips = retRoleALLInfo.roleInfo.info.tmpEquips || {};
        retRoleALLInfo.roleInfo.info.tmpEquips[new_equipEntity.eid] = new_equipEntity;
      }
      addEquip[new_equipEntity.eid] = new_equipEntity;
    }

    RESMsg.decitem = {}
    cItemBag.decitem(roleIemBag, RESMsg.decitem, itemid, itemnum);

    if (type == 0) { RESMsg.addTmpEquip = clone(addEquip); }

    //自动出售判断
    let sell_exp = 0;
    if (openEBoxDto.autoOpen) {

      RESMsg.decTmpEquip = [];
      RESMsg.decEquipInfo = {};
      RESMsg.additem = {};
      for (const key in addEquip) {
        if (Object.prototype.hasOwnProperty.call(addEquip, key)) {

          const equip_entity = addEquip[key];
          if (!equip_entity) { continue; }
          let is_fight = false;
          //战力满足直接停止自动锻造
          if (openEBoxDto.fightUp && equip_entity.tmphid != undefined) {
            let cur_fight = cEquipSystem.cpEquipFightPoint(equip_entity);
            //对比英雄 对应 槽位 装备战斗力
            let tmp_hero_id = equip_entity.tmphid;
            let low_equips_fightpoint = 0;
            let equip_pos = TableGameEquip.getVal(equip_entity.id, TableGameEquip.field_pos);
            if (heroInfo[tmp_hero_id] && heroInfo[tmp_hero_id].equip && heroInfo[tmp_hero_id].equip[equip_pos]) {
              low_equips_fightpoint = cEquipSystem.cpEquipFightPoint(heroInfo[tmp_hero_id].equip[equip_pos]);
            }
            is_fight = cur_fight > low_equips_fightpoint;
            if (type == 0 && is_fight) {
              //Logger.access(`tmp_hero_id:${tmp_hero_id} equip_pos:${equip_pos} cur_fight:${cur_fight} low_equips_fightpoint:${low_equips_fightpoint}`);
              continue;
            }
          }

          //品质是否勾选并且品质满足条件
          //openEBoxDto.sellLv 为0 代表没勾选
          let is_q_can = (openEBoxDto.sellLv !== 0 && equip_entity.qid >= openEBoxDto.sellLv);
          //是否勾选了属性
          let is_select_attr = openEBoxDto.ckattr1 || openEBoxDto.attr2;


          function autoSave() {
            if (type == 0) {
              delete retRoleALLInfo.roleInfo.info.tmpEquips[equip_entity.eid];
              delete RESMsg.addTmpEquip[equip_entity.eid];
            }
            RESMsg.addEquip = RESMsg.addEquip || {};
            RESMsg.addEquip[equip_entity.eid] = equip_entity;
            equipBagRecord[equip_entity.eid] = equip_entity;
          }
          if (is_fight && auto_save) {
            autoSave();
            continue;
          }
          //检测是否满足选属性条件
          function isCanAttr() {
            //没有勾选
            if (!is_select_attr) { return false }

            //没有附加
            // if (!equip_entity.add) { return false }

            const add = equip_entity.add;
            const a1 = openEBoxDto.attr1 || 0;
            const a2 = openEBoxDto.attr2 || 0;
            const a3 = openEBoxDto.attr3 || 0;
            const a4 = openEBoxDto.attr4 || 0;
            const tab = TableOpenBoxAttr.getTable()
            function findAttr(type: number, data: any) {
              return true;
              // for (const key in tab) {
              //   if (Object.prototype.hasOwnProperty.call(tab, key)) {
              //     const element = tab[key];
              //     if (element.type == type && data && data[element.numid]) {
              //       return true;
              //     }
              //   }
              // }
              // return false;
            }
            function cKforgeAttr(i: number) {
              if (add && add[i]) {
                if (openEBoxDto.ckattr1) {//判断属性词条1
                  let ck1: boolean = false;
                  if (a1 == 0) { ck1 = findAttr(1, add[i]) }
                  else if (add[i][a1]) { ck1 = true }
                  let ck2: boolean = false;
                  if (a2 == 0) { ck2 = findAttr(2, add[i]) }
                  else if (add[i][a2]) { ck2 = true }
                  if (ck1 && ck2) { return true; }
                }
                if (openEBoxDto.ckattr2) {//判断属性词条2
                  let ck3: boolean = false;
                  if (a3 == 0) { ck3 = findAttr(1, add[i]) }
                  else if (add[i][a3]) { ck3 = true }
                  let ck4: boolean = false;
                  if (a4 == 0) { ck4 = findAttr(2, add[i]) }
                  else if (add[i][a4]) { ck4 = true }
                  if (ck3 && ck4) { return true; }
                }
              }
              else {
                if ((openEBoxDto.ckattr1) && (a1 == 0 && a2 == 0)) { return true; }
                if ((openEBoxDto.ckattr2) && (a3 == 0 && a4 == 0)) { return true; }
              }
              return false;
            }
            //选属性是否满足
            return cKforgeAttr(1) || cKforgeAttr(2);
          }



          //品质[√] 属性[×] 存仓库[×]
          if (is_q_can && !is_select_attr && !auto_save) { continue; }

          //选属性是否满足条件
          let is_attr_can = isCanAttr();

          //品质[√] 属性[√] 存仓库[×]
          if (is_q_can && is_select_attr && !auto_save) {
            //满足勾选属性条件 停止自动锻造
            if (is_attr_can) { continue; }
          }
          //品质[√] 属性[×] 存仓库[√]
          else if (is_q_can && !is_select_attr && auto_save) {
            autoSave();
            continue;
          }
          //品质[√] 属性[√] 存仓库[√]
          else if (is_q_can && is_select_attr && is_attr_can && auto_save) {
            autoSave();
            continue;
          }

          let sell_item = TableGameEquip.getVal(equip_entity.id, TableGameEquip.field_sell)
          if (!sell_item) { continue; }
          sell_exp += TableGameEquip.getVal(equip_entity.id, TableGameEquip.field_exp)
          for (const idx in sell_item) {
            if (Object.prototype.hasOwnProperty.call(sell_item, idx)) {
              const sell_data = sell_item[idx];
              //console.log(sell_data);
              const itemid = sell_data[gameConst.table_id];
              const item_num = sell_data[gameConst.table_num];
              cItemBag.addItem(roleIemBag, RESMsg.additem, itemid, item_num);
            }
          }
          if (type == 0) {
            RESMsg.decTmpEquip.push(key);
            RESMsg.decEquipInfo[key] = equip_entity;
          }
        }
      }

      //删除装备
      if (RESMsg.decTmpEquip.length > 0) {
        for (let index = 0; index < RESMsg.decTmpEquip.length; index++) {
          const eid = RESMsg.decTmpEquip[index];
          if (retRoleALLInfo.roleInfo.info?.tmpEquips && retRoleALLInfo.roleInfo.info.tmpEquips[eid]) {
            delete retRoleALLInfo.roleInfo.info.tmpEquips[eid];
          }
        }
      }
      else {
        //没有装备卖出
        delete RESMsg.decTmpEquip;
        delete RESMsg.decEquipInfo;
        if (Object.entries(RESMsg.additem).length == 0) { delete RESMsg.additem; }
      }

    }
    else {
      if (type == 1) {
        for (const key in addEquip) {
          if (Object.prototype.hasOwnProperty.call(addEquip, key)) {

            const equip_entity = addEquip[key];
            if (!equip_entity) { continue; }

            RESMsg.addEquip = RESMsg.addEquip || {};
            RESMsg.addEquip[equip_entity.eid] = equip_entity;
            equipBagRecord[equip_entity.eid] = equip_entity;
          }
        }
      }
    }
    // await this.gameDataService.updateRoleItem(roleKeyDto, roleIemBag);
    await this.getTaskHideAward(roleKeyDto, retRoleALLInfo, RESMsg);

    if (sell_exp && sell_exp > 0) {
      RESMsg.roleAddExp = syshero.leadheroAddExp(retRoleALLInfo, retRoleALLInfo.roleHero, sell_exp);
      await this.gameDataService.updateRoleInfo(roleKeyDto, retRoleALLInfo.roleInfo);
      await this.gameDataService.updateRoleHero(roleKeyDto, retRoleALLInfo.roleHero);
    }
    else {
      await this.gameDataService.updateRoleInfo(roleKeyDto, { info: retRoleALLInfo.roleInfo.info });
    }

    if (RESMsg.addEquip) {
      await this.gameDataService.updateRoleEquip(roleKeyDto, equipBagRecord);
    }

    await this.gameDataService.updateAddRoleItem(roleKeyDto, RESMsg);



    RESMsg.ok = true;
    RESMsg.srctype = EActType.BOX_OPEN_EBOX;
    RESMsg.msg = languageConfig.actTypeSuccess(EActType.BOX_OPEN_EBOX);
    RESMsg.taskCount = open_num;
    if (type == 1) {
      RESMsg.xbox = xbox;
      RESMsg.srctype = EActType.BOX_OPEN_XUNBAO;
      RESMsg.msg = languageConfig.actTypeSuccess(EActType.BOX_OPEN_XUNBAO);
    }
    return RESMsg;
  }

  /**
   * 领取进阶任务奖励
   * @param req 
   * @param getTaskGradeAwardDto 
   */
  async getTaskHideAward(roleKeyDto: RoleKeyDto, retRoleALLInfo: RetRoleALLInfo, reMsg: RESOpenEBoxMsg) {
    if (!retRoleALLInfo.isHaveData()) {
      return;
    }
    let taskHide = retRoleALLInfo.roleSubInfo.taskHide
    if (taskHide === undefined || !taskHide) {
      return;
    }
    let cur_taskEntity: TaskEntity;
    for (let index = 0; index < taskHide.length; index++) {
      cur_taskEntity = taskHide[index];
      // console.log('->',cur_taskEntity)
      if (cTaskSystem.taskIsFinish(cur_taskEntity)) {
        let finish_task_entity = new TableTask(cur_taskEntity.id);
        //道具奖励
        if (finish_task_entity.drop && finish_task_entity.drop.length > 0) {
          let dropDataEntity = await cGameCommon.addItemByDrop(roleKeyDto, finish_task_entity.drop, this.gameDataService, 1, false);
          cGameCommon.hanleDropMsg(dropDataEntity, reMsg);
        }
        for (const targetId in cur_taskEntity.count) {
          cur_taskEntity.count[targetId] = 0;
        }
      }
    }
    return;
  }

  async sellTmpEquip(@Request() req: any, @Body() sellTmpEquipDto: SellTmpEquipDto) {

    let roleKeyDto: RoleKeyDto = { id: req.user.id, serverid: req.user.serverid };
    let RESMsg: RESSellTmpEquipMsg = { ok: false, msg: "null" }

    let getRoleALLInfoDto = new GetRoleALLInfoDto(roleKeyDto);
    getRoleALLInfoDto.need_roleInfo = true;
    getRoleALLInfoDto.need_roleHero = true;
    //获取角色信息
    let retRoleALLInfo: RetRoleALLInfo = await this.gameDataService.getRoleAllInfo(getRoleALLInfoDto);
    if (!retRoleALLInfo.isHaveData()) {
      RESMsg.msg = retRoleALLInfo.getRetMsg();
      return RESMsg;
    }

    let roleInfo: RoleInfoEntity = await this.gameDataService.getRoleInfo(roleKeyDto)
    if (!roleInfo || !roleInfo.info) {
      RESMsg.msg = 'roleInfo is null';
      return RESMsg;
    }

    if (!roleInfo.info?.tmpEquips || !roleInfo.info.tmpEquips[sellTmpEquipDto.eid]) {
      RESMsg.msg = '没有该装备';
      return RESMsg;
    }

    //获取道具数据
    let item_info = await this.gameDataService.getRoleItem(roleKeyDto);
    if (!item_info || !item_info.info) {
      RESMsg.msg = 'RoleItem is null';
      return RESMsg;
    }

    let roleSubInfoEntity: RoleSubInfoEntity = roleInfo.info;
    let roleIemBag: ItemsRecord = <ItemsRecord><unknown>(item_info.info)

    let cur_tmpEquip = roleSubInfoEntity.tmpEquips[sellTmpEquipDto.eid];
    let sell_item = TableGameEquip.getVal(cur_tmpEquip.id, TableGameEquip.field_sell)
    if (!sell_item) {
      RESMsg.msg = 'sell_item is null equipid:' + cur_tmpEquip.id;
      return RESMsg;
    }

    delete cur_tmpEquip.tmphid;

    let sell_exp = TableGameEquip.getVal(cur_tmpEquip.id, TableGameEquip.field_exp)

    RESMsg.decTmpEquip = [];
    RESMsg.decEquipInfo = {};
    RESMsg.additem = {};

    for (const idx in sell_item) {
      if (Object.prototype.hasOwnProperty.call(sell_item, idx)) {
        const sell_data = sell_item[idx];
        //console.log(sell_data);
        const itemid = sell_data[gameConst.table_id];
        const item_num = sell_data[gameConst.table_num];
        cItemBag.addItem(roleIemBag, RESMsg.additem, itemid, item_num);
      }
    }

    RESMsg.decTmpEquip.push(cur_tmpEquip.eid);
    RESMsg.decEquipInfo[cur_tmpEquip.eid] = cur_tmpEquip;

    delete retRoleALLInfo.roleInfo.info.tmpEquips[sellTmpEquipDto.eid];


    if (sell_exp && sell_exp > 0) {
      RESMsg.roleAddExp = syshero.leadheroAddExp(retRoleALLInfo, retRoleALLInfo.roleHero, sell_exp);
      await this.gameDataService.updateRoleInfo(roleKeyDto, retRoleALLInfo.roleInfo);
      await this.gameDataService.updateRoleHero(roleKeyDto, retRoleALLInfo.roleHero);
    }
    else {
      await this.gameDataService.updateRoleInfo(roleKeyDto, { info: retRoleALLInfo.roleInfo.info });
    }

    //await this.gameDataService.updateRoleEquip(roleKeyDto, equipBagRecord);
    await this.gameDataService.updateAddRoleItem(roleKeyDto, RESMsg);
    //await this.gameDataService.updateRoleItem(roleKeyDto, roleIemBag);

    RESMsg.ok = true;
    RESMsg.srctype = EActType.EBOX_SELL_TMPEQUIP;
    RESMsg.msg = languageConfig.actTypeSuccess(RESMsg.srctype);
    return RESMsg;
  }

  async saveTmpEquip(@Request() req: any, @Body() saveTmpEquipDto: SaveTmpEquipDto) {

    let roleKeyDto: RoleKeyDto = { id: req.user.id, serverid: req.user.serverid };
    let RESMsg: RESSaveTmpEquipMsg = { ok: false, msg: "null" }

    let roleInfo: RoleInfoEntity = await this.gameDataService.getRoleInfo(roleKeyDto)
    if (!roleInfo || !roleInfo.info) {
      RESMsg.msg = 'roleInfo is null';
      return RESMsg;
    }

    if (!roleInfo.info?.tmpEquips || !roleInfo.info.tmpEquips[saveTmpEquipDto.eid]) {
      RESMsg.msg = '没有该装备';
      return RESMsg;
    }

    let roleEquip = await this.gameDataService.getRoleEquip(roleKeyDto);
    if (!roleEquip || !roleEquip.info) {
      RESMsg.msg = 'roleEquip is null';
      return RESMsg;
    }

    let cur_tmpEquip = roleInfo.info.tmpEquips[saveTmpEquipDto.eid];
    delete cur_tmpEquip.tmphid;

    let equipBagRecord = <EquipEntityRecord><unknown>roleEquip.info;

    RESMsg.decTmpEquip = [];
    RESMsg.decEquipInfo = {};

    RESMsg.decTmpEquip.push(cur_tmpEquip.eid);
    RESMsg.decEquipInfo[cur_tmpEquip.eid] = cur_tmpEquip;

    RESMsg.addEquip = {}
    RESMsg.addEquip[cur_tmpEquip.eid] = cur_tmpEquip;
    equipBagRecord[cur_tmpEquip.eid] = clone(cur_tmpEquip)
    delete roleInfo.info.tmpEquips[cur_tmpEquip.eid];

    await this.gameDataService.updateRoleInfo(roleKeyDto, { info: roleInfo.info });
    await this.gameDataService.updateRoleEquip(roleKeyDto, equipBagRecord);

    RESMsg.ok = true;
    RESMsg.srctype = EActType.EBOX_SAVE_TMPEQUIP;
    RESMsg.msg = languageConfig.actTypeSuccess(RESMsg.srctype);
    return RESMsg;
  }

  async setUpTmpEquip(@Request() req: any, @Body() setUpTmpEquipDto: SetUpTmpEquipDto) {

    let roleKeyDto: RoleKeyDto = { id: req.user.id, serverid: req.user.serverid };
    let RESMsg: RESSetUpTmpEquipMsg = { ok: false, msg: "null" }

    let roleInfo: RoleInfoEntity = await this.gameDataService.getRoleInfo(roleKeyDto)
    if (!roleInfo || !roleInfo.info) {
      RESMsg.msg = 'roleInfo is null';
      return RESMsg;
    }

    if (!roleInfo.info?.tmpEquips || !roleInfo.info.tmpEquips[setUpTmpEquipDto.eid]) {
      RESMsg.msg = '没有该装备';
      return RESMsg;
    }


    let roleEquip = await this.gameDataService.getRoleEquip(roleKeyDto);
    if (!roleEquip || !roleEquip.info) {
      RESMsg.msg = 'roleEquip is null';
      return RESMsg;
    }

    let equipBagRecord = <EquipEntityRecord><unknown>roleEquip.info;

    let rolehero = await this.gameDataService.getRoleHero(roleKeyDto);
    if (!rolehero || !rolehero.info) {
      RESMsg.msg = "rolehero is null";
      return RESMsg;
    }


    let cur_tmpEquip = roleInfo.info.tmpEquips[setUpTmpEquipDto.eid];


    let heroInfo = <HerosRecord><unknown>rolehero.info;
    let equip_pos = TableGameEquip.getVal(cur_tmpEquip.id, TableGameEquip.field_pos);
    let cur_tmpEquipHero: number;
    if (cur_tmpEquip.tmphid) {
      cur_tmpEquipHero = cur_tmpEquip.tmphid;
    }
    else {
      cur_tmpEquipHero = syshero.getLowHeroByEquipPos(heroInfo, equip_pos);
    }

    if (!heroInfo[cur_tmpEquipHero]) {
      RESMsg.msg = "cur_tmpEquipHero is null";
      return RESMsg;
    }

    delete cur_tmpEquip.tmphid;

    let cur_heroEntity = heroInfo[cur_tmpEquipHero];
    cur_heroEntity.equip = cur_heroEntity.equip || {};

    if (!cur_heroEntity.equip[equip_pos]) {
      cur_heroEntity.equip[equip_pos] = cur_tmpEquip;
    }
    else {
      let last_eid = cur_heroEntity.equip[equip_pos].eid;
      equipBagRecord[last_eid] = cur_heroEntity.equip[equip_pos];

      cur_heroEntity.equip[equip_pos] = cur_tmpEquip;

      await this.gameDataService.updateRoleEquip(roleKeyDto, equipBagRecord);
    }

    cur_heroEntity.id = cur_tmpEquipHero;
    cpHero.cpHeroAttr(cur_heroEntity, roleInfo.info);
    RESMsg.hero = cloneDeep(cur_heroEntity);

    RESMsg.decTmpEquip = [];
    RESMsg.decTmpEquip.push(cur_tmpEquip.eid);
    RESMsg.decEquipInfo = {};
    RESMsg.decEquipInfo[cur_tmpEquip.eid] = cur_tmpEquip;

    delete roleInfo.info.tmpEquips[cur_tmpEquip.eid];

    await this.gameDataService.updateRoleHero(roleKeyDto, heroInfo);
    await this.gameDataService.updateRoleInfo(roleKeyDto, { info: roleInfo.info });


    languageConfig.setActTypeSuccess(EActType.EBOX_SETUP_TMPEQUIP, RESMsg);

    return RESMsg;

  }


  /**
   * 装备宝箱升级
   * @param req 
   * @returns 
   */
  async lvUpEBox(@Request() req: any) {
    let roleKeyDto: RoleKeyDto = { id: req.user.id, serverid: req.user.serverid };
    let RESMsg: RESLvUpEBoxMsg = { ok: false, msg: "no" }
    let roleInfo: RoleInfoEntity = await this.gameDataService.getRoleInfo(roleKeyDto)
    if (!roleInfo || !roleInfo.info) {
      RESMsg.msg = 'roleInfo is null';
      return RESMsg;
    }

    let roleSubInfoEntity: RoleSubInfoEntity = roleInfo.info;
    let eBoxEntity: EBoxEntity = roleSubInfoEntity.ebox;
    if (!TableGameEBoxLv.getVal(eBoxEntity.lv + 1, TableGameEBoxLv.field_spe_count)) {
      RESMsg.msg = '装备宝箱已满级';
      return RESMsg;
    }

    if (eBoxEntity?.cd && eBoxEntity?.cd > 0) {
      const now = Date.now();
      if (eBoxEntity?.cd - now > 0) {
        RESMsg.msg = '装备宝箱升级CD时间中！还需：' + Math.floor((eBoxEntity?.cd - now) / 1000) + "秒";
        RESMsg.eBoxEntity = eBoxEntity;
        delete RESMsg.eBoxEntity.speCount;
        return RESMsg;
      }
      RESMsg.msg = '装备宝箱升级CD时间中！';
      RESMsg.eBoxEntity = eBoxEntity;
      delete RESMsg.eBoxEntity.speCount;
      return RESMsg;
    }

    let tableGameEBoxLv = new TableGameEBoxLv(eBoxEntity.lv);
    //获取道具数据
    let item_info = await this.gameDataService.getRoleItem(roleKeyDto);
    if (!item_info || !item_info.info) {
      RESMsg.msg = 'RoleItem is null';
      return RESMsg;
    }

    let roleIemBag: ItemsRecord = <ItemsRecord><unknown>(item_info.info)
    if (!roleIemBag[tableGameEBoxLv.up_item] || roleIemBag[tableGameEBoxLv.up_item] < tableGameEBoxLv.up_price) {
      let item_name = TableGameItem.getVal(tableGameEBoxLv.up_item, TableGameItem.field_name);
      item_name = item_name ? item_name : tableGameEBoxLv.up_item
      RESMsg.msg = `${item_name + languageConfig.tip.not_enough}`;;
      return RESMsg;
    }

    //扣钱升级所需道具
    RESMsg.decitem = {}
    cItemBag.decitem(roleIemBag, RESMsg.decitem, tableGameEBoxLv.up_item, tableGameEBoxLv.up_price);

    //增加次数
    if (!eBoxEntity?.lvUpCount) {
      eBoxEntity.lvUpCount = 1
    }
    else {
      eBoxEntity.lvUpCount++;
    }

    //是否满足升级次数
    if (eBoxEntity.lvUpCount >= tableGameEBoxLv.up_num) {
      delete eBoxEntity.lvUpCount;
      eBoxEntity.cd = Date.now() + tableGameEBoxLv.up_cd * 1000;
    }

    await this.gameDataService.updateRoleInfo(roleKeyDto, { info: roleSubInfoEntity });
    //await this.gameDataService.updateRoleItem(roleKeyDto, roleIemBag);
    await this.gameDataService.updateAddRoleItem(roleKeyDto, RESMsg);


    RESMsg.ok = true;
    RESMsg.srctype = EActType.BOX_LVUP_EBOX;
    RESMsg.msg = languageConfig.actTypeSuccess(EActType.BOX_LVUP_EBOX);
    RESMsg.eBoxEntity = eBoxEntity;
    delete RESMsg.eBoxEntity.speCount;
    return RESMsg;
  }

  /**
   * 加速装备宝箱升级CD
   * @param req 
   */
  async quickenEBoxCD(@Request() req: any, @Body() quickenEBoxCDDto: QuickenEBoxCDDto) {

    let roleKeyDto: RoleKeyDto = { id: req.user.id, serverid: req.user.serverid };
    let RESMsg: RESQuickenEBoxCDMsg = { ok: false, msg: "no" }
    let roleInfo: RoleInfoEntity = await this.gameDataService.getRoleInfo(roleKeyDto)
    if (!roleInfo || !roleInfo.info) {
      RESMsg.msg = 'roleInfo is null';
      return RESMsg;
    }

    let roleSubInfoEntity: RoleSubInfoEntity = roleInfo.info;
    let eBoxEntity: EBoxEntity = roleSubInfoEntity.ebox;
    if (!eBoxEntity?.cd) {
      RESMsg.msg = '装备宝箱不在升级CD时间中';
      RESMsg.eBoxEntity = eBoxEntity;
      delete RESMsg.eBoxEntity.speCount;
      return RESMsg;
    }

    const timestamp = Math.floor((new Date).getTime() / 1000)//时间戳
    const now = Date.now();
    const dif_time = eBoxEntity.cd - now;
    if (dif_time <= 0) {
      RESMsg.msg = '装备宝箱升级CD时间已结束！';
      RESMsg.eBoxEntity = eBoxEntity;
      delete RESMsg.eBoxEntity.speCount;
      return RESMsg;
    }

    //获取道具数据
    let item_info = await this.gameDataService.getRoleItem(roleKeyDto);
    if (!item_info || !item_info.info) {
      RESMsg.msg = 'RoleItem is null';
      return RESMsg;
    }
    let roleIemBag: ItemsRecord = <ItemsRecord><unknown>(item_info.info)

    if (quickenEBoxCDDto.isadv) {

      if (!cGameCommon.getIsHavePrivilege(roleInfo, TablePrivilegeType.free_advertising)) {
        if (!roleSubInfoEntity.adverts) {
          RESMsg.msg = '请先观看广告后再使用';
          return RESMsg;
        }
      }

      roleSubInfoEntity.adverts = false;
      eBoxEntity.cd -= TableGameConfig.ebox_adv_quicken_cd * 1000;
      RESMsg.srctype = EActType.BOX_ADV_QUICKEN_EBOXCD;
    }
    else {
      let costType = TableGameConfig.itemid_quicken_cd;
      let costNum = quickenEBoxCDDto.num;
      const cost = TableGameConfig.boxup_skip_cd;
      if (quickenEBoxCDDto.diamond && cost) {
        costType = cost.i;
        costNum = cost.n;

        if (eBoxEntity.interval && eBoxEntity.interval + cost.t > timestamp) {
          RESMsg.msg = '间隔时间不足';
          return RESMsg;
        }
      }
      if (!roleIemBag[costType] || roleIemBag[costType] < costNum) {
        let item_name = TableGameItem.getVal(costType, TableGameItem.field_name);
        item_name = item_name || costType
        RESMsg.msg = `${item_name + languageConfig.tip.not_enough}`;
        RESMsg.eBoxEntity = eBoxEntity;
        delete RESMsg.eBoxEntity.speCount;
        return RESMsg;
      }

      let total_num = 0;
      if (quickenEBoxCDDto.diamond) {
        total_num = costNum;
        eBoxEntity.cd -= TableGameConfig.ebox_adv_quicken_cd * 1000;
        eBoxEntity.interval = timestamp;
      }
      else {
        let cost_num = Math.ceil(dif_time / (TableGameConfig.val_quicken_cd * 1000));
        total_num = Math.min(cost_num, quickenEBoxCDDto.num);
        eBoxEntity.cd -= total_num * (TableGameConfig.val_quicken_cd * 1000);
      }
      //扣去道具
      RESMsg.decitem = {};
      cItemBag.decitem(roleIemBag, RESMsg.decitem, costType, total_num);
      //await this.gameDataService.updateRoleItem(roleKeyDto, roleIemBag);
      await this.gameDataService.updateAddRoleItem(roleKeyDto, RESMsg);
      RESMsg.srctype = EActType.BOX_QUICKEN_EBOXCD;
    }


    await this.gameDataService.updateRoleInfo(roleKeyDto, { info: roleSubInfoEntity });

    languageConfig.setActTypeSuccess(RESMsg.srctype, RESMsg);
    RESMsg.eBoxEntity = eBoxEntity;
    delete RESMsg.eBoxEntity.speCount;
    return RESMsg;

  }
  /**
   * 检测升级是否成功
   * @param req 
   */
  async checkLvUpEBox(@Request() req: any) {

    let roleKeyDto: RoleKeyDto = { id: req.user.id, serverid: req.user.serverid };
    let RESMsg: RESCheckLvUpEBoxMsg = { ok: false, msg: "no" }
    let roleInfo: RoleInfoEntity = await this.gameDataService.getRoleInfo(roleKeyDto)
    if (!roleInfo || !roleInfo.info) {
      RESMsg.msg = 'roleInfo is null';
      return RESMsg;
    }

    let roleSubInfoEntity: RoleSubInfoEntity = roleInfo.info;
    let eBoxEntity: EBoxEntity = roleSubInfoEntity.ebox;
    if (!TableGameEBoxLv.getVal(eBoxEntity.lv + 1, TableGameEBoxLv.field_spe_count)) {
      RESMsg.msg = '装备宝箱已满级';
      return RESMsg;
    }

    if (!eBoxEntity?.cd) {
      RESMsg.msg = '装备宝箱没有在升级CD时间中！';
      RESMsg.eBoxEntity = eBoxEntity;
      delete RESMsg.eBoxEntity.speCount;
      return RESMsg;
    }

    const now = Date.now();
    if (eBoxEntity?.cd - now > 0) {
      RESMsg.msg = '装备宝箱升级CD时间中！还需：' + Math.floor((eBoxEntity?.cd - now) / 1000) + "秒";
      RESMsg.eBoxEntity = eBoxEntity;
      delete RESMsg.eBoxEntity.speCount;
      return RESMsg;
    }

    delete eBoxEntity.cd;
    eBoxEntity.lv++;
    await this.gameDataService.updateRoleInfo(roleKeyDto, { info: roleSubInfoEntity });


    RESMsg.ok = true;
    RESMsg.srctype = EActType.BOX_CHECK_LVUP_EBOX;
    RESMsg.msg = languageConfig.actTypeSuccess(EActType.BOX_CHECK_LVUP_EBOX);
    RESMsg.eBoxEntity = eBoxEntity;
    delete RESMsg.eBoxEntity.speCount;
    return RESMsg;
  }

  /**
  * 开启技能宝箱
  * @param req k
  * @param openEBoxDto 
  * @returns 
  */
  async openSBox(@Request() req: any, @Body() openSBoxDto: OpenSBoxDto) {
    let roleKeyDto: RoleKeyDto = { id: req.user.id, serverid: req.user.serverid };
    let RESMsg: RESOpenSBoxMsg = { ok: false, msg: "no" }
    if (openSBoxDto.num > 10) {
      RESMsg.msg = '开启数量超过10';
      return RESMsg;
    }

    //获取道具数据
    let item_info = await this.gameDataService.getRoleItem(roleKeyDto);
    if (!item_info || !item_info.info) {
      RESMsg.msg = 'RoleItem is null';
      return RESMsg;
    }
    let roleIemBag: ItemsRecord = <ItemsRecord><unknown>(item_info.info)
    const cost = TableGameConfig.open_sbox_cost;
    let costnum = 0;
    let costtype = cost.i || TableGameConfig.moneyId_diamond;
    let sboxnum = roleIemBag[TableGameConfig.itemid_sbox] || 0
    let diamondnum = roleIemBag[costtype] || 0
    let costsboxnum = openSBoxDto.num;
    if (sboxnum < openSBoxDto.num) {
      costsboxnum = sboxnum;
      costnum = (openSBoxDto.num - sboxnum) * cost.n;
      if (diamondnum < costnum) {
        RESMsg.msg = '道具数量不够';
        return RESMsg;
      }
    }

    if (!TableGameSBoxLv.getVal(1, TableGameSBoxLv.field_spe_count)) {
      RESMsg.msg = 'TableGameSBoxLv is null';
      return RESMsg;
    }

    let roleInfo: RoleInfoEntity = await this.gameDataService.getRoleInfo(roleKeyDto)
    if (!roleInfo || !roleInfo.info) {
      RESMsg.msg = 'roleInfo is null';
      return RESMsg;
    }

    let roleSubInfoEntity: RoleSubInfoEntity = roleInfo.info;
    let sBoxEntity: SBoxEntity = roleSubInfoEntity.sbox;
    let tableGameSBoxLv = new TableGameSBoxLv(1);

    //开始随机
    RESMsg.additem = {}
    //开始随机技能
    for (let index = 0; index < openSBoxDto.num; index++) {

      let cur_quality = 1;
      let cur_qualitynum = tableGameSBoxLv.count;
      if (sBoxEntity.speCount >= tableGameSBoxLv.spe_count) {
        //保底品质
        cur_quality = tableGameSBoxLv.spe_quality;
        //保底清空
        sBoxEntity.speCount = 0;
      }
      else {
        //随机品质
        let skill_quality = TableGameSkillQuality.getTable()
        let total_val = 0;
        let random_data = [];
        for (const quality_id in skill_quality) {
          if (Object.prototype.hasOwnProperty.call(skill_quality, quality_id)) {

            let prob = tableGameSBoxLv["quality_" + quality_id]
            if (prob) {
              let var_data = {
                min_pro: total_val,
                max_pro: total_val + prob,
                quality_id: quality_id,
                getnum: 1
              }
              total_val += prob
              random_data.push(var_data)
            }

            prob = tableGameSBoxLv["quality_" + String(Number(quality_id) + 1)]
            if (prob) {
              let var_data = {
                min_pro: total_val,
                max_pro: total_val + prob,
                quality_id: quality_id,
                getnum: tableGameSBoxLv.count
              }
              total_val += prob
              random_data.push(var_data)
            }
          }
        }

        let random = Math.floor(Math.random() * total_val);
        for (let index = 0; index < random_data.length; index++) {
          const cur_rdata = random_data[index];
          if (cur_rdata.min_pro < random && random <= cur_rdata.max_pro) {
            cur_quality = Number(cur_rdata.quality_id)
            cur_qualitynum = cur_rdata.getnum
            break;
          }
        }
        sBoxEntity.speCount++;
      }

      //从道具表里随机技能道具
      let skills = this.gameDataService.getGameConfigService().getSkillsByQuality(cur_quality);
      if (!skills) {
        RESMsg.msg = 'getSkillsByQuality skills is null cur_quality:' + cur_quality;
        delete RESMsg.additem;
        return RESMsg;
      }

      const skill_data = skills[Math.floor(Math.random() * skills.length)];
      cItemBag.addItem(roleIemBag, RESMsg.additem, skill_data.id, cur_qualitynum);
    }

    //扣去技能宝箱
    RESMsg.decitem = {}
    if (costsboxnum > 0) {
      cItemBag.decitem(roleIemBag, RESMsg.decitem, TableGameConfig.itemid_sbox, costsboxnum);
    }
    if (costnum > 0) {
      cItemBag.decitem(roleIemBag, RESMsg.decitem, costtype, costnum);
    }
    //自动出售配置
    if (Object.keys(openSBoxDto.sellcfg).length > 0) {

      for (const key in RESMsg.additem) {
        if (Object.prototype.hasOwnProperty.call(RESMsg.additem, key)) {
          const item_id = Number(key);
          const quality_id = TableGameItem.getVal(item_id, TableGameItem.field_quality);
          if (!openSBoxDto.sellcfg[quality_id]) { continue; }

          const item_num = RESMsg.additem[key];
          RESMsg.decitem[item_id] = RESMsg.decitem[item_id] || 0;
          roleIemBag[item_id] = roleIemBag[item_id] || 0;

          //自动-售出道具
          cItemBag.decitem(roleIemBag, RESMsg.decitem, item_id, item_num);

          //添加售出道具后获得的道具
          let sell_item = TableGameItem.getVal(item_id, TableGameItem.field_sell)
          if (!sell_item) { continue; }

          for (const idx in sell_item) {
            if (Object.prototype.hasOwnProperty.call(sell_item, idx)) {
              const sell_data = sell_item[idx];
              const add_itemid = sell_data[gameConst.table_id];
              const add_item_num = sell_data[gameConst.table_num] * item_num;
              cItemBag.addItem(roleIemBag, RESMsg.additem, add_itemid, add_item_num);
            }
          }
        }
      }

    }

    await this.gameDataService.updateAddRoleItem(roleKeyDto, RESMsg);
    //await this.gameDataService.updateRoleItem(roleKeyDto, roleIemBag);
    await this.gameDataService.updateRoleInfo(roleKeyDto, { info: roleSubInfoEntity })


    RESMsg.ok = true;
    RESMsg.srctype = EActType.BOX_OPEN_SBOX;
    RESMsg.msg = languageConfig.actTypeSuccess(EActType.BOX_OPEN_SBOX);
    RESMsg.taskCount = openSBoxDto.num;
    RESMsg.speCount = sBoxEntity.speCount;
    return RESMsg;
  }

  async xunbaoAward(@Request() req: any, @Body() dto: XBAwardDto) {
    let roleKeyDto: RoleKeyDto = { id: req.user.id, serverid: req.user.serverid };
    let retMsg = new RESXBAwardMsg();
    let getRoleALLInfoDto = new GetRoleALLInfoDto(roleKeyDto);
    getRoleALLInfoDto.need_roleInfo = true;
    let retRoleALLInfo: RetRoleALLInfo = await this.gameDataService.getRoleAllInfo(getRoleALLInfoDto);
    if (!retRoleALLInfo.isHaveData()) {
      retMsg.msg = retRoleALLInfo.getRetMsg();
      return retMsg;
    }

    let data: any;
    let datas = TableXunBaoAward.getTable();
    for (let k in datas) {
      let d = datas[Number(k)];
      if (d.times == dto.times) {
        data = d;
        break
      }
    }
    if (!data) {
      retMsg.msg = "参数错误";
      return retMsg;
    }

    if (!data.drop || data.drop.length == 0) {
      retMsg.msg = "没有配置奖励";
      return retMsg;
    }

    if (!cGameCommon.isOpenSystem(retRoleALLInfo, TableGameSys.xunbao)) {
      retMsg.msg = languageConfig.tip.not_open_system;
      return retMsg;
    }
    let xbox = retRoleALLInfo.roleInfo.info.xbox;
    if (xbox.award.indexOf(dto.times) != -1) {
      retMsg.msg = "奖励已领取";
      return retMsg;
    }
    if (xbox.total < dto.times){
      retMsg.msg = "寻宝次数不足";
      return retMsg;
    }
    //道具奖励
    if (data.drop && data.drop.length > 0) {
      let dropDataEntity = await cGameCommon.addItemByDrop(roleKeyDto, data.drop, this.gameDataService);
      cGameCommon.hanleDropMsg(dropDataEntity, retMsg);
    }
    xbox.award.push(dto.times);
    retMsg.xbox = xbox;
    retMsg.times = dto.times;
    await this.gameDataService.updateRoleInfo(roleKeyDto, retRoleALLInfo.roleInfo);
    languageConfig.setActTypeSuccess(EActType.XUNBAO_AWARD, retMsg);
    return retMsg;
  }
}
