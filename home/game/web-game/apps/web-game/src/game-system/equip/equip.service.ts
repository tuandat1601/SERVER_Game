import { Body, Injectable, Request } from '@nestjs/common';
import { cloneDeep } from 'lodash';
import { SnowflakeIdv1 } from 'simple-flakeid';
import { gameConst } from '../../config/game-const';
import { EActType, EquipAddType } from '../../config/game-enum';
import { TableGameConfig } from '../../config/gameTable/TableGameConfig';
import { TableGameEquip } from '../../config/gameTable/TableGameEquip';
import { TableGameEquipAdd } from '../../config/gameTable/TableGameEquipAdd';
import { TableGameEquipPos } from '../../config/gameTable/TableGameEquipPos';
import { TableGameEquipQuality } from '../../config/gameTable/TableGameEquipQuality';
import { TableGameItem } from '../../config/gameTable/TableGameItem';
import { languageConfig } from '../../config/language/language';
import { RoleAddExp } from '../../game-data/entity/common.entity';
import { DropEntity } from '../../game-data/entity/drop.entity';
import { EquipAddRecord, EquipEntityRecord, EquipEntity } from '../../game-data/entity/equip.entity';
import { HerosRecord } from '../../game-data/entity/hero.entity';
import { ItemsRecord } from '../../game-data/entity/item.entity';
import { RESEquipAutoSetUpMsg, RESEquipMsg, RESSELLEquipMsg } from '../../game-data/entity/msg.entity';
import { RoleInfoEntity } from '../../game-data/entity/roleinfo.entity';
import { GameDataService, GetRoleALLInfoDto } from '../../game-data/gamedata.service';
import { RoleKeyDto } from '../../game-data/role/dto/role-key.dto';
import { Logger } from '../../game-lib/log4js';
import { RetRoleALLInfo } from '../game-common';
import { cpHero } from '../hero/hero-cpattr';
import { syshero } from '../hero/hero-lvup';
import { cItemBag } from '../item/item-bag';
import { EquipAutoSetUpDto, EquipSellDto, EquipSetUpDto, QuickEquipSellDto } from './dto/equip.dto';
import { cEquipSystem } from './equip-system';

@Injectable()
export class EquipService {


  constructor(
    private readonly gameDataService: GameDataService
  ) {
  }

  /**
   * 随机获取词条属性
   * @param addId 词条ID
   * @returns "{"i":24,"v":1000}"
   */
  randomEquipAddAttr(addId: number) {

    let random_val = null
    let equip_add_table = new TableGameEquipAdd(addId);
    if (equip_add_table.rolltype == EquipAddType.NORMAL) {
      let attr_ary: any[] = equip_add_table.attr;
      random_val = attr_ary[Math.floor(Math.random() * attr_ary.length)];
      return random_val;
    }
    return random_val;
  }

  /**
   * 创建一个装备
   * @param equipId 装备ID
   * @param quality 品质
   */
  createEquip(equipId: number, quality: number) {
    return this.gameDataService.createEquip(equipId, quality);
  }



  /**
   * 装备强度排序
   * @param EquipEntityA 
   * @param EquipEntityB 
   * @returns 
   */
  compareEquip(EquipEntityA: EquipEntity, EquipEntityB: EquipEntity) {

    /*
    const a_equiplv = TableGameEquip.getVal(EquipEntityA.id, TableGameEquip.field_level);
    const b_equiplv = TableGameEquip.getVal(EquipEntityB.id, TableGameEquip.field_level);

    if (a_equiplv > b_equiplv) { return false; }
    if (EquipEntityA.qid > EquipEntityB.qid) { return false; }
    if (a_equiplv == b_equiplv && EquipEntityA.qid == EquipEntityB.qid) { return false; }
    */
    
    if(cEquipSystem.cpEquipFightPoint(EquipEntityA) >= cEquipSystem.cpEquipFightPoint(EquipEntityB)){
      return false;
    }
    return true;
  }

  /**
   * 装备一键换装
   * @param req 
   * @param equipAutoSetUpDto 
   * @returns 
   */
  async autoSetup(@Request() req: any, @Body() equipAutoSetUpDto: EquipAutoSetUpDto) {

    let roleKeyDto: RoleKeyDto = { id: req.user.id, serverid: req.user.serverid };

    let RESEquipMsg: RESEquipAutoSetUpMsg = { ok: false, msg: "no" };

    let rolehero = await this.gameDataService.getRoleHero(roleKeyDto);
    if (!rolehero || !rolehero.info) {
      RESEquipMsg.msg = "rolehero is null";
      return RESEquipMsg;
    }
    let heroInfo = <HerosRecord><unknown>rolehero.info;
    if (!heroInfo[equipAutoSetUpDto.hid]) {
      RESEquipMsg.msg = languageConfig.hero.not_have;
      return RESEquipMsg;
    }
    let cur_heroEntity = heroInfo[equipAutoSetUpDto.hid];

    let roleEquip = await this.gameDataService.getRoleEquip(roleKeyDto);
    if (!roleEquip || !roleEquip.info) {
      RESEquipMsg.msg = "RoleEquip is null";
      return RESEquipMsg;
    }
    let equipBagRecord = <EquipEntityRecord><unknown>roleEquip.info;
    if (Object.keys(equipBagRecord).length == 0) {
      RESEquipMsg.msg = languageConfig.equip.emptybag;
      return RESEquipMsg;
    }

    cur_heroEntity.equip = cur_heroEntity.equip || {};
    let equips_up: EquipEntityRecord = {}
    for (const key in equipBagRecord) {
      if (Object.prototype.hasOwnProperty.call(equipBagRecord, key)) {
        const equipEntity = equipBagRecord[key];
        const eid = key;
        const equip_pos = TableGameEquip.getVal(equipEntity.id, TableGameEquip.field_pos);

        //空部位 先选一个装备穿上
        if (!cur_heroEntity.equip[equip_pos] && !equips_up[equip_pos]) {
          equips_up[equip_pos] = equipEntity;
          equips_up[equip_pos].eid = eid;
          continue;
        }

        //已有比身上装备更强的装备了
        if (equips_up[equip_pos]) {
          if (!this.compareEquip(equips_up[equip_pos], equipEntity)) { continue; }
          delete equips_up[equip_pos].eid;
          equips_up[equip_pos] = equipEntity;
          equips_up[equip_pos].eid = eid;
          continue;
        }

        //对比英雄身上装备
        if (!this.compareEquip(cur_heroEntity.equip[equip_pos], equipEntity)) { continue; }
        if (equips_up[equip_pos]) { delete equips_up[equip_pos].eid; }
        equips_up[equip_pos] = equipEntity;
        equips_up[equip_pos].eid = eid;
      }
    }

    if (Object.keys(equips_up).length == 0) {
      RESEquipMsg.msg = languageConfig.equip.no_change;
      return RESEquipMsg;
    }

    //穿戴装备 卸下装备
    RESEquipMsg.decEquip = [];
    RESEquipMsg.decEquipInfo = {};
    for (const key in equips_up) {
      if (Object.prototype.hasOwnProperty.call(equips_up, key)) {
        const equipEntity: EquipEntity = equips_up[key];

        //删除背包里的装备
        delete equipBagRecord[equipEntity.eid];
        RESEquipMsg.decEquip.push(equipEntity.eid);
        RESEquipMsg.decEquipInfo[equipEntity.eid] = equipEntity;

        const equip_pos = TableGameEquip.getVal(equipEntity.id, TableGameEquip.field_pos);
        if (cur_heroEntity.equip[equip_pos]) {
          //卸下装备
          RESEquipMsg.addEquip = RESEquipMsg.addEquip || {};
          equipBagRecord[cur_heroEntity.equip[equip_pos].eid] = cur_heroEntity.equip[equip_pos];
          RESEquipMsg.addEquip[cur_heroEntity.equip[equip_pos].eid] = cur_heroEntity.equip[equip_pos];
          delete equipBagRecord[cur_heroEntity.equip[equip_pos].eid].eid;
        }
        //穿戴装备
        cur_heroEntity.equip[equip_pos] = equipEntity;
      }
    }

    cur_heroEntity.id = equipAutoSetUpDto.hid;
    var roleInfo: RoleInfoEntity = await this.gameDataService.getRoleInfo(roleKeyDto);
    cpHero.cpHeroAttr(cur_heroEntity, roleInfo.info);
    RESEquipMsg.hero = cloneDeep(cur_heroEntity);
    delete cur_heroEntity.id;

    await this.gameDataService.updateRoleHero(roleKeyDto, heroInfo);
    await this.gameDataService.updateRoleEquip(roleKeyDto, equipBagRecord);

    RESEquipMsg.ok = true;
    RESEquipMsg.msg = languageConfig.actTypeSuccess(EActType.EQUIP_AUTOSETUP);
    RESEquipMsg.srctype = EActType.EQUIP_AUTOSETUP;
    return RESEquipMsg;
  }

  /**
   * 装备穿戴/卸下
   * @param req 
   * @param equipSetUpDto 
   * @returns 
   */
  async setup(@Request() req: any, @Body() equipSetUpDto: EquipSetUpDto) {

    let roleKeyDto: RoleKeyDto = { id: req.user.id, serverid: req.user.serverid };
    let RESEquipMsg: RESEquipMsg = { ok: false, msg: "no" }

    let rolehero = await this.gameDataService.getRoleHero(roleKeyDto);
    if (!rolehero || !rolehero.info) {
      RESEquipMsg.msg = "rolehero is null";
      return RESEquipMsg;
    }
    let heroInfo = <HerosRecord><unknown>rolehero.info;
    if (!heroInfo[equipSetUpDto.hid]) {
      RESEquipMsg.msg = "没有该英雄";
      return RESEquipMsg;
    }
    let cur_heroEntity = heroInfo[equipSetUpDto.hid];
    if (!TableGameEquipPos.table[equipSetUpDto.pos]) {
      RESEquipMsg.msg = "没有该部位";
      return RESEquipMsg;
    }

    if (!equipSetUpDto.setUp) {
      if (!cur_heroEntity.equip || !cur_heroEntity.equip[equipSetUpDto.pos]) {
        RESEquipMsg.msg = "英雄该部位上没有此装备"
        return RESEquipMsg;
      }

      if (cur_heroEntity.equip[equipSetUpDto.pos].eid != equipSetUpDto.eid) {
        RESEquipMsg.msg = "装备唯一ID错误";
        return RESEquipMsg;
      }
    }

    let roleEquip = await this.gameDataService.getRoleEquip(roleKeyDto);
    if (!roleEquip || !roleEquip.info) {
      RESEquipMsg.msg = "RoleEquip is null";
      return RESEquipMsg;
    }
    let equipBagRecord = <EquipEntityRecord><unknown>roleEquip.info;

    if (equipSetUpDto.setUp && !equipBagRecord[equipSetUpDto.eid]) {
      RESEquipMsg.msg = "背包里没有此装备";
      return RESEquipMsg;
    }

    if (equipSetUpDto.setUp && !TableGameEquip.getVal(equipBagRecord[equipSetUpDto.eid].id, TableGameEquip.field_pos)) {
      RESEquipMsg.msg = "装备表里没有该装备";
      return RESEquipMsg;
    }

    if (equipSetUpDto.setUp && TableGameEquip.getVal(equipBagRecord[equipSetUpDto.eid].id, TableGameEquip.field_pos) != equipSetUpDto.pos) {
      RESEquipMsg.msg = "装备部位错误";
      return RESEquipMsg;
    }

    let cur_equipEntity: EquipEntity;
    if (equipSetUpDto.setUp) {

      cur_heroEntity.equip = cur_heroEntity.equip || {};
      cur_equipEntity = equipBagRecord[equipSetUpDto.eid];
      cur_equipEntity.eid = equipSetUpDto.eid;
      delete equipBagRecord[equipSetUpDto.eid];

      if (cur_heroEntity.equip[equipSetUpDto.pos]) {
        equipBagRecord[cur_heroEntity.equip[equipSetUpDto.pos].eid] = cur_heroEntity.equip[equipSetUpDto.pos];
        delete equipBagRecord[cur_heroEntity.equip[equipSetUpDto.pos].eid].eid;
      }

      cur_heroEntity.equip[equipSetUpDto.pos] = cur_equipEntity;
      RESEquipMsg.srctype = EActType.EQUIP_SETUP;
    }
    else {
      cur_equipEntity = cur_heroEntity.equip[equipSetUpDto.pos];
      delete cur_equipEntity.eid;
      delete cur_heroEntity.equip[equipSetUpDto.pos];
      equipBagRecord[equipSetUpDto.eid] = cur_equipEntity;
      RESEquipMsg.srctype = EActType.EQUIP_SETDOWN;
    }

    cur_heroEntity.id = equipSetUpDto.hid;
    var roleInfo: RoleInfoEntity = await this.gameDataService.getRoleInfo(roleKeyDto);
    cpHero.cpHeroAttr(cur_heroEntity, roleInfo.info);
    RESEquipMsg.hero = cloneDeep(cur_heroEntity);
    delete cur_heroEntity.id;

    await this.gameDataService.updateRoleHero(roleKeyDto, heroInfo);
    await this.gameDataService.updateRoleEquip(roleKeyDto, equipBagRecord);
    RESEquipMsg.msg = languageConfig.actTypeSuccess(RESEquipMsg.srctype);
    RESEquipMsg.ok = true;
    return RESEquipMsg;
  }

  /**
   * 装备出售
   * @param req 
   * @param euipSellDto 
   * @returns 
   */
  async sell(@Request() req: any, @Body() euipSellDto: EquipSellDto) {

    let roleKeyDto: RoleKeyDto = { id: req.user.id, serverid: req.user.serverid };
    let RESMsg: RESSELLEquipMsg = { ok: false, msg: "no" }

    let getRoleALLInfoDto = new GetRoleALLInfoDto(roleKeyDto);
    getRoleALLInfoDto.need_roleInfo = true;
    getRoleALLInfoDto.need_roleHero = true;
    //获取角色信息
    let retRoleALLInfo: RetRoleALLInfo = await this.gameDataService.getRoleAllInfo(getRoleALLInfoDto);
    if (!retRoleALLInfo.isHaveData()) {
      RESMsg.msg = retRoleALLInfo.getRetMsg();
      return RESMsg;
    }

    let roleEquip = await this.gameDataService.getRoleEquip(roleKeyDto);
    if (!roleEquip || !roleEquip.info) {
      RESMsg.msg = "rolehero is null";
      return RESMsg;
    }
    let equipBagRecord = <EquipEntityRecord><unknown>roleEquip.info;

    if (!equipBagRecord[euipSellDto.eid]) {
      RESMsg.msg = "背包里没有此装备";
      return RESMsg;
    }

    if (!TableGameEquip.getVal(equipBagRecord[euipSellDto.eid].id, TableGameEquip.field_pos)) {
      RESMsg.msg = "装备表里没有该装备";
      return RESMsg;
    }

    let sell_item = TableGameEquip.getVal(equipBagRecord[euipSellDto.eid].id, TableGameEquip.field_sell)
    if (!sell_item) {
      RESMsg.msg = 'sell_item is null';
      return RESMsg;
    }

    let sell_exp = TableGameEquip.getVal(equipBagRecord[euipSellDto.eid].id, TableGameEquip.field_exp)

    //获取道具数据
    let item_info = await this.gameDataService.getRoleItem(roleKeyDto);
    if (!item_info || !item_info.info) {
      RESMsg.msg = 'RoleItem is null';
      return RESMsg;
    }
    let roleIemBag: ItemsRecord = <ItemsRecord><unknown>(item_info.info)
    //删除装备
    RESMsg.decEquip = [];
    RESMsg.decEquipInfo = {};
    RESMsg.decEquip.push(euipSellDto.eid);
    RESMsg.decEquipInfo[euipSellDto.eid] = equipBagRecord[euipSellDto.eid];
    delete equipBagRecord[euipSellDto.eid];

    RESMsg.additem = {}
    for (const idx in sell_item) {
      if (Object.prototype.hasOwnProperty.call(sell_item, idx)) {
        const data = sell_item[idx];
        const itemid = data[gameConst.table_id];
        const item_num = data[gameConst.table_num];
        cItemBag.addItem(roleIemBag, RESMsg.additem, itemid, item_num);
      }
    }

    if (sell_exp) {
      RESMsg.roleAddExp = syshero.leadheroAddExp(retRoleALLInfo, retRoleALLInfo.roleHero, sell_exp);
      await this.gameDataService.updateRoleInfo(roleKeyDto, retRoleALLInfo.roleInfo);
      await this.gameDataService.updateRoleHero(roleKeyDto, retRoleALLInfo.roleHero);
    }

    await this.gameDataService.updateRoleEquip(roleKeyDto, equipBagRecord);
    await this.gameDataService.updateAddRoleItem(roleKeyDto, RESMsg);


    RESMsg.ok = true;
    RESMsg.msg = languageConfig.actTypeSuccess(EActType.EQUIP_SELL);
    RESMsg.srctype = EActType.EQUIP_SELL;
    return RESMsg;
  }

  /**
   * 
   * @param req 
   * @param quickEquipSellDto 
   * @returns 
   */
  async quickSell(@Request() req: any, @Body() quickEquipSellDto: QuickEquipSellDto) {

    let roleKeyDto: RoleKeyDto = { id: req.user.id, serverid: req.user.serverid };
    let RESMsg: RESSELLEquipMsg = { ok: false, msg: "no" }

    let getRoleALLInfoDto = new GetRoleALLInfoDto(roleKeyDto);
    getRoleALLInfoDto.need_roleInfo = true;
    getRoleALLInfoDto.need_roleHero = true;
    //获取角色信息
    let retRoleALLInfo: RetRoleALLInfo = await this.gameDataService.getRoleAllInfo(getRoleALLInfoDto);
    if (!retRoleALLInfo.isHaveData()) {
      RESMsg.msg = retRoleALLInfo.getRetMsg();
      return RESMsg;
    }


    let roleEquip = await this.gameDataService.getRoleEquip(roleKeyDto);
    if (!roleEquip || !roleEquip.info) {
      RESMsg.msg = "rolehero is null";
      return RESMsg;
    }
    let equipBagRecord = <EquipEntityRecord><unknown>roleEquip.info;

    //获取道具数据
    let item_info = await this.gameDataService.getRoleItem(roleKeyDto);
    if (!item_info || !item_info.info) {
      RESMsg.msg = 'RoleItem is null';
      return RESMsg;
    }
    let roleIemBag: ItemsRecord = <ItemsRecord><unknown>(item_info.info)

    RESMsg.decEquip = [];
    RESMsg.decEquipInfo = {};
    RESMsg.additem = {};
    let sell_exp = 0;
    for (const key in equipBagRecord) {
      if (Object.prototype.hasOwnProperty.call(equipBagRecord, key)) {
        const equip_entity = equipBagRecord[key];
        if (!equip_entity || !quickEquipSellDto.data[equip_entity.qid]) { continue; }

        let sell_item = TableGameEquip.getVal(equip_entity.id, TableGameEquip.field_sell)
        if (!sell_item) { continue; }

        for (const idx in sell_item) {
          if (Object.prototype.hasOwnProperty.call(sell_item, idx)) {
            const sell_data = sell_item[idx];
            //console.log(sell_data);
            const itemid = sell_data[gameConst.table_id];
            const item_num = sell_data[gameConst.table_num];
            cItemBag.addItem(roleIemBag, RESMsg.additem, itemid, item_num);
          }
        }

        sell_exp += TableGameEquip.getVal(equip_entity.id, TableGameEquip.field_exp);

        RESMsg.decEquip.push(key);
        RESMsg.decEquipInfo[key] = equip_entity;
      }
    }

    if (RESMsg.decEquip.length == 0) {
      RESMsg.msg = '没有可出售的装备';
      delete RESMsg.decEquip;
      delete RESMsg.additem;
      return RESMsg;
    }
    //console.log(RESMsg.decEquip)
    //删除装备
    for (let index = 0; index < RESMsg.decEquip.length; index++) {
      const eid = RESMsg.decEquip[index];
      delete equipBagRecord[eid];
    }
    
    if (sell_exp > 0) {
      RESMsg.roleAddExp = syshero.leadheroAddExp(retRoleALLInfo, retRoleALLInfo.roleHero, sell_exp);
      await this.gameDataService.updateRoleInfo(roleKeyDto, retRoleALLInfo.roleInfo);
      await this.gameDataService.updateRoleHero(roleKeyDto, retRoleALLInfo.roleHero);
    }
    
    RESMsg.ok = true;
    RESMsg.msg = languageConfig.actTypeSuccess(EActType.EQUIP_QUICKSELL);
    RESMsg.srctype = EActType.EQUIP_QUICKSELL;

    await this.gameDataService.updateRoleEquip(roleKeyDto, equipBagRecord);
    await this.gameDataService.updateAddRoleItem(roleKeyDto, RESMsg);

    return RESMsg;
  }
}
