import { Injectable, Request } from '@nestjs/common';
import { RoleHero, RoleItem } from '@prisma/client1';
import { cloneDeep } from 'lodash';
import { EActType, ESkillActive } from '../../config/game-enum';
import { TableGameConfig } from '../../config/gameTable/TableGameConfig';
import { TableGameItem } from '../../config/gameTable/TableGameItem';
import { TableGameSkill } from '../../config/gameTable/TableGameSkill';
import { languageConfig } from '../../config/language/language';
import { HeroEntity, HerosRecord } from '../../game-data/entity/hero.entity';
import { ItemsRecord } from '../../game-data/entity/item.entity';
import { RESSkillMsg, RESSkillSuitMsg } from '../../game-data/entity/msg.entity';
import { RoleInfoEntity, RoleSubInfoEntity } from '../../game-data/entity/roleinfo.entity';
import { SkillEntity, SkillEntityRecord, SkillPosCostEntity, SkillPosEntity } from '../../game-data/entity/skill.entity';
import { GameDataService } from '../../game-data/gamedata.service';
import { RoleKeyDto } from '../../game-data/role/dto/role-key.dto';
import { cpHero } from '../hero/hero-cpattr';
import { cItemBag } from '../item/item-bag';
import { ActiveSkillDto, LvUpSkillDto, SetUpSkillDto, SkillSuitDTO } from './dto/skill-system.dto';
import { TableSkillSuit } from '../../config/gameTable/TableSkillSuit';

@Injectable()
export class SkillService {

  constructor(
    private readonly gameDataService: GameDataService
  ) {

  }

  /**
   * 激活英雄技能槽位
   * @param req 
   * @param activeSkillDto 
   * @returns 
   */
  async active(@Request() req: any, activeSkillDto: ActiveSkillDto) {

    let roleKeyDto: RoleKeyDto = {
      id: req.user.id,
      serverid: req.user.serverid
    };

    let RESSkillMsg: RESSkillMsg = {
      ok: false,
      msg: "null"
    }

    //获取英雄数据
    let roleHero: RoleHero = await this.gameDataService.getRoleHero(roleKeyDto)
    if (!roleHero) {
      RESSkillMsg.msg = 'hero is null';
      return RESSkillMsg;
    }


    let heroInfo: HerosRecord = <HerosRecord><unknown>roleHero.info;

    if (!heroInfo || !heroInfo[activeSkillDto.heroid]) {
      RESSkillMsg.msg = 'hero is null';
      return RESSkillMsg;
    }

    let heroEntity: HeroEntity = heroInfo[activeSkillDto.heroid];

    if (!heroEntity.skill) {
      RESSkillMsg.msg = 'hero skill is null';
      return RESSkillMsg;
    }

    let skillPosEntity: SkillPosEntity;
    if (heroEntity.skill[activeSkillDto.pos]) {
      RESSkillMsg.msg = languageConfig.skill.pos_actived;
      return RESSkillMsg;
    }

    if (!heroEntity.skill[activeSkillDto.pos]) {
      skillPosEntity = {}
      heroEntity.skill[activeSkillDto.pos] = skillPosEntity
    }

    //获取开启需要的数据
    let cost_items = TableGameConfig["skill_pos_" + activeSkillDto.pos]

    if (!cost_items) {
      RESSkillMsg.msg = 'cost items is nil';
      return RESSkillMsg;
    }

    let skillPosCostEntity: SkillPosCostEntity = cost_items;

    //等级是否足够
    let roleInfo: RoleInfoEntity = await this.gameDataService.getRoleInfo(roleKeyDto)
    if (!roleInfo || !roleInfo.rolelevel) {
      RESSkillMsg.msg = 'roleInfo is null';
      return RESSkillMsg;
    }

    if (roleInfo.rolelevel < skillPosCostEntity.needlv) {

      RESSkillMsg.msg = languageConfig.tip.level_not_enough;
      return RESSkillMsg;
    }

    //道具是否足够
    let item_info = await this.gameDataService.getRoleItem(roleKeyDto);

    if (!item_info || !item_info.info) {
      RESSkillMsg.msg = 'RoleItem is null';
      return RESSkillMsg;
    }

    let roleItemBag: ItemsRecord = <ItemsRecord><unknown>(item_info.info)
    RESSkillMsg.decitem = {};
    for (const cidx in skillPosCostEntity.cost) {
      if (Object.prototype.hasOwnProperty.call(skillPosCostEntity.cost, cidx)) {
        const cost_num = skillPosCostEntity.cost[cidx];
        if (!cost_num || roleItemBag[cidx] < cost_num) {
          RESSkillMsg.msg = `[${TableGameItem.getVal(Number(cidx), TableGameItem.field_name) + languageConfig.tip.not_enough}]`;
          return RESSkillMsg;
        }

        cItemBag.decitem(roleItemBag, RESSkillMsg.decitem, Number(cidx), cost_num);

      }
    }

    await this.gameDataService.updateRoleHero(roleKeyDto, heroInfo)
    await this.gameDataService.updateRoleItem(roleKeyDto, roleItemBag);

    RESSkillMsg.ok = true;
    RESSkillMsg.msg = languageConfig.actTypeSuccess(EActType.SKILL_ACTIVE_POS);
    RESSkillMsg.srctype = EActType.SKILL_ACTIVE_POS;
    return RESSkillMsg;
  }

  /**
   * 技能升级
   * @param req 
   * @param lvUpSkillDto 
   * @returns 
   */
  async lvup(@Request() req: any, lvUpSkillDto: LvUpSkillDto) {

    let roleKeyDto: RoleKeyDto = {
      id: req.user.id,
      serverid: req.user.serverid
    };


    let RESSkillMsg: RESSkillMsg = {
      ok: false,
      msg: "null"
    }

    if (!TableGameSkill.getVal(lvUpSkillDto.sid, TableGameSkill.field_level)) {
      RESSkillMsg.msg = `TableGameSkill skill_table_data(${lvUpSkillDto.sid}) is null`;
      return RESSkillMsg;
    }

    let skill_table_data = new TableGameSkill(lvUpSkillDto.sid);


    //获取技能系统信息
    let roleInfo = await this.gameDataService.getRoleInfo(roleKeyDto);

    let roleSubInfoEntity: RoleSubInfoEntity = <RoleSubInfoEntity><unknown>roleInfo.info;

    if (!roleSubInfoEntity.skill || !roleSubInfoEntity.skill.list) {
      RESSkillMsg.msg = 'skill is null';
      return RESSkillMsg;
    }

    let skill_list: SkillEntityRecord = roleSubInfoEntity.skill.list;

    if (skill_list[skill_table_data.id] && skill_table_data.nextId === 0) {
      RESSkillMsg.msg = languageConfig.skill.max_level;
      return RESSkillMsg;
    }

    //当前是否已经有该组别的技能了
    if (!skill_list[skill_table_data.id]) {
      for (const sid in skill_list) {
        if (Object.prototype.hasOwnProperty.call(skill_list, sid)) {
          let group = TableGameSkill.getVal(Number(sid), TableGameSkill.field_group)
          if (group === skill_table_data.group) {
            RESSkillMsg.msg = languageConfig.skill.haved_by_group;
            return RESSkillMsg;
          }
        }
      }
    }


    let next_skill_data: TableGameSkill;
    if (skill_list[skill_table_data.id] && skill_table_data.nextId != 0) {
      if (!TableGameSkill.getVal(skill_table_data.nextId, TableGameSkill.field_level)) {
        RESSkillMsg.msg = `TableGameSkill skill_table_data(${skill_table_data.nextId}) is null`;
        return RESSkillMsg;
      }
      next_skill_data = new TableGameSkill(skill_table_data.nextId);
    }

    if (!skill_list[skill_table_data.id] && skill_table_data.level != 1) {
      RESSkillMsg.msg = languageConfig.skill.active_fail;
      return RESSkillMsg;
    }

    let upskill_cost = skill_list[skill_table_data.id] ? next_skill_data.cost : skill_table_data.cost

    //获取道具数据
    let item_info: RoleItem = await this.gameDataService.getRoleItem(roleKeyDto);

    if (!item_info || !item_info.info) {
      RESSkillMsg.msg = 'RoleItem is null';
      return RESSkillMsg;
    }

    let roleItemBag: ItemsRecord = <ItemsRecord><unknown>(item_info.info)
    RESSkillMsg.decitem = {};
    for (const key in upskill_cost) {
      if (Object.prototype.hasOwnProperty.call(upskill_cost, key)) {
        const itemid = Number(key)
        const itemid_num = upskill_cost[key];
        if (!roleItemBag[itemid] || roleItemBag[itemid] < itemid_num) {
          RESSkillMsg.msg = `[${TableGameItem.getVal(itemid, TableGameItem.field_name)}]不够`;
          delete RESSkillMsg.decitem;
          return RESSkillMsg;
        }

        cItemBag.decitem(roleItemBag, RESSkillMsg.decitem, itemid, itemid_num);

      }
    }

    let new_skillEntity: SkillEntity = {
    }

    if (skill_list[skill_table_data.id] == undefined) {
      skill_list[skill_table_data.id] = new_skillEntity
      RESSkillMsg.srctype = EActType.SKILL_ACTIVE;
    }
    else {

      RESSkillMsg.srctype = EActType.SKILL_LEVEL_UP;

      skill_list[skill_table_data.nextId] = new_skillEntity;
      delete skill_list[skill_table_data.id];


      let roleHero: RoleHero = await this.gameDataService.getRoleHero(roleKeyDto)
      if (!roleHero) {
        RESSkillMsg.msg = 'hero is null';
        return RESSkillMsg;
      }

      let heroInfo: HerosRecord = <HerosRecord><unknown>roleHero.info;
      let is_update_ok = false;
      for (const heroid in heroInfo) {
        if (Object.prototype.hasOwnProperty.call(heroInfo, heroid)) {
          let heroEntity = heroInfo[heroid];
          if (!heroEntity?.skill) {
            continue;
          }
          for (const posidx in heroEntity.skill) {
            if (Object.prototype.hasOwnProperty.call(heroEntity.skill, posidx)) {
              let skillEntity = heroEntity.skill[posidx]
              if (skillEntity.sid === skill_table_data.id) {
                is_update_ok = true;
                skillEntity.sid = skill_table_data.nextId;

                heroEntity.id = Number(heroid);
                cpHero.cpHeroAttr(heroEntity, roleInfo.info);
                RESSkillMsg.hero = cloneDeep(heroEntity);
                break;
              }
            }
          }

          if (is_update_ok) {
            break;
          }
        }
      }

      if (is_update_ok) {
        await this.gameDataService.updateRoleHero(roleKeyDto, heroInfo)
      }
    }


    await this.gameDataService.updateRoleInfo(roleKeyDto, { info: roleInfo.info })
    await this.gameDataService.updateRoleItem(roleKeyDto, roleItemBag);

    RESSkillMsg.ok = true;
    RESSkillMsg.msg = languageConfig.actTypeSuccess(RESSkillMsg.srctype);

    return RESSkillMsg;
  }

  /**
   * 技能装备/卸下
   * @param req 
   * @param setUpSkillDto 
   * @returns 
   */
  async setup(@Request() req: any, setUpSkillDto: SetUpSkillDto) {

    let RESSkillMsg: RESSkillMsg = {
      ok: false,
      msg: "null"
    }

    if (setUpSkillDto.pos == 0) {
      RESSkillMsg.msg = languageConfig.skill.tianfu_skill_no;
      return RESSkillMsg;
    }

    //检查技能是否合法
    let skill_table_data = new TableGameSkill(setUpSkillDto.sid);

    if (!skill_table_data) {
      RESSkillMsg.msg = `TableGameSkill skill_table_data(${setUpSkillDto.sid}) is null`;
      return RESSkillMsg;
    }

    let roleKeyDto: RoleKeyDto = {
      id: req.user.id,
      serverid: req.user.serverid
    };




    //获取英雄数据
    let roleHero: RoleHero = await this.gameDataService.getRoleHero(roleKeyDto)
    if (!roleHero) {
      RESSkillMsg.msg = 'hero is null';
      return RESSkillMsg;
    }


    let heroInfo: HerosRecord = <HerosRecord><unknown>roleHero.info;
    if (!heroInfo || !heroInfo[setUpSkillDto.heroid]) {
      RESSkillMsg.msg = languageConfig.hero.not_have;
      return RESSkillMsg;
    }

    let heroEntity: HeroEntity = heroInfo[setUpSkillDto.heroid];

    if (!heroEntity.skill) {
      RESSkillMsg.msg = 'hero skill is null';
      return RESSkillMsg;
    }

    let skillPosEntity: SkillPosEntity;
    if (!heroEntity.skill[setUpSkillDto.pos]) {

      RESSkillMsg.msg = languageConfig.skill.pos_no_actived;
      return RESSkillMsg;
    }

    skillPosEntity = heroEntity.skill[setUpSkillDto.pos];

    if (setUpSkillDto.setUp && skillPosEntity.sid) {
      RESSkillMsg.msg = languageConfig.skill.pos_haved_skill;
      return RESSkillMsg;
    }

    if (!setUpSkillDto.setUp && !skillPosEntity.sid) {
      RESSkillMsg.msg = languageConfig.skill.pos_not_haved_skill;
      return RESSkillMsg;
    }

    if (!setUpSkillDto.setUp && skillPosEntity.sid != setUpSkillDto.sid) {
      RESSkillMsg.msg = languageConfig.skill.setdown_error_id;
      return RESSkillMsg;
    }

    //获取技能系统数据
    let roleInfo = await this.gameDataService.getRoleInfo(roleKeyDto);
    let roleSubInfoEntity: RoleSubInfoEntity = <RoleSubInfoEntity><unknown>roleInfo.info;

    if (!roleSubInfoEntity.skill || !roleSubInfoEntity.skill.list) {
      RESSkillMsg.msg = 'skill is null';
      return RESSkillMsg;
    }

    let skill_list: SkillEntityRecord = roleSubInfoEntity.skill.list;
    if (!skill_list[skill_table_data.id]) {
      RESSkillMsg.msg = languageConfig.skill.not_have;
      return RESSkillMsg;
    }

    if (setUpSkillDto.setUp) {
      for (const heroid in heroInfo) {
        if (Object.prototype.hasOwnProperty.call(heroInfo, heroid)) {
          let heroEntity = heroInfo[heroid];
          if (!heroEntity?.skill) {
            continue;
          }
          for (const posidx in heroEntity.skill) {
            if (Object.prototype.hasOwnProperty.call(heroEntity.skill, posidx)) {
              let skillEntity = heroEntity.skill[posidx]
              if (skillEntity.sid === setUpSkillDto.sid) {
                RESSkillMsg.msg = languageConfig.skill.already_setup;
                return RESSkillMsg;
              }
            }
          }
        }
      }
    }


    if (setUpSkillDto.setUp) {
      skillPosEntity.sid = skill_table_data.id;
      RESSkillMsg.srctype = EActType.SKILL_SETUP;
    }
    else {
      delete skillPosEntity.sid;
      RESSkillMsg.srctype = EActType.SKILL_SETDOWN;
    }

    heroEntity.id = setUpSkillDto.heroid;
    cpHero.cpHeroAttr(heroEntity, roleInfo.info);
    RESSkillMsg.hero = cloneDeep(heroEntity);

    await this.gameDataService.updateRoleHero(roleKeyDto, heroInfo)
    await this.gameDataService.updateRoleInfo(roleKeyDto, { info: roleInfo.info })

    RESSkillMsg.ok = true;
    RESSkillMsg.msg = languageConfig.actTypeSuccess(RESSkillMsg.srctype);

    return RESSkillMsg;
  }

  async suit(@Request() req: any, dto: SkillSuitDTO) {
    let roleKeyDto: RoleKeyDto = { id: req.user.id, serverid: req.user.serverid };
    let retMsg = new RESSkillSuitMsg();

    //获取技能系统信息
    let roleInfo = await this.gameDataService.getRoleInfo(roleKeyDto);

    let roleSubInfoEntity: RoleSubInfoEntity = <RoleSubInfoEntity><unknown>roleInfo.info;
    if (!roleSubInfoEntity.skill || !roleSubInfoEntity.skill.list) {
      retMsg.msg = 'skill is null';
      return retMsg;
    }

    let skill_list: SkillEntityRecord = roleSubInfoEntity.skill.list;
    let suit = roleSubInfoEntity.skill.suit || [];
    let id = 0;
    let sids = [];
    for (let sid in TableSkillSuit.getTable()) {
      let d = new TableSkillSuit(Number(sid));
      if (d.group == dto.group) {
        sids.push(Number(sid));
      }
    }
    sids.sort((a, b) => a - b);
    let suitindex = -1;
    for (let i = 0; i < suit.length; i++) {
      let index = sids.indexOf(suit[i]);
      if (index != -1) {
        if (index == sids.length - 1) {
          retMsg.msg = '已经没有可激活的';
          return retMsg;
        }
        id = sids[index + 1];
        suitindex = i;
        break;
      }
    }
    if (id == 0) { id = sids[0]; }

    let data = new TableSkillSuit(Number(id));
    let skg = this.gameDataService.getGameConfigService().getSkillGroup();
    for (let sid of data.skillid) {
      let d = new TableGameSkill(sid);
      let sg = skg[d.group];
      let index = sg.indexOf(sid);
      let flag = false;
      for (let i = index; i < sg.length; i++) {
        if (skill_list[sg[i]]) {
          flag = true;
          break;
        }
      }
      if (!flag) {
        retMsg.msg = '激活条件不满足';
        return retMsg;
      }
    }
    if (suitindex == -1) {
      suit.push(id);
    }
    else {
      suit.splice(suitindex, 1, id);
    }
    roleSubInfoEntity.skill.suit = suit;
    let roleHero: RoleHero = await this.gameDataService.getRoleHero(roleKeyDto)
    if (roleHero){
      let heroInfo: HerosRecord = <HerosRecord><unknown>roleHero.info;
      if (heroInfo) {
        retMsg.hero = retMsg.hero || {};
        for (const heroid in heroInfo) {
          if (Object.prototype.hasOwnProperty.call(heroInfo, heroid)) {
            cpHero.cpHeroAttr(heroInfo[heroid], roleSubInfoEntity)
            retMsg.hero[heroid] = cloneDeep(heroInfo[heroid]);
          }
        }
      }
    }
    
    await this.gameDataService.updateRoleInfo(roleKeyDto, { info: roleInfo.info })
    retMsg.id = id;
    retMsg.suit = suit;
    languageConfig.setActTypeSuccess(EActType.SKILL_SUIT, retMsg);
    return retMsg;
  }
}
