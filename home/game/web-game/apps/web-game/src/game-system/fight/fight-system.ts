import { EFightCamp, EFightResults, EFightType, EGameRankType, EObjtype, ESkillActive } from "../../config/game-enum";
import { TableGameAttr } from "../../config/gameTable/TableGameAttr";
import { TableGameConfig } from "../../config/gameTable/TableGameConfig";
import { TableGameHero } from "../../config/gameTable/TableGameHero";
import { TableGameLevels } from "../../config/gameTable/TableGameLevels";
import { TableGameMonster } from "../../config/gameTable/TableGameMonster";
import { FightReqEntity, FightObjEntity, CampInfoEntity, FightCampEntity, WrestleCampEntity } from "../../game-data/entity/fight.entity";
import { HeroEntity, HerosRecord, SkillPosRecord } from "../../game-data/entity/hero.entity";
import { RoleInfoEntity, RoleSubInfoEntity } from "../../game-data/entity/roleinfo.entity";
import { Logger } from "../../game-lib/log4js";
import { cpHero } from "../hero/hero-cpattr";
import { TableRobotRole } from "../../config/gameTable/TableRobotRole";
import { TableRobotHero } from "../../config/gameTable/TableRobotHero";
import { TableMedalUplevel } from "../../config/gameTable/TableMedalUplevel";
import { TableGameEquip } from "../../config/gameTable/TableGameEquip";
import { TableGameEquipPosAttr } from "../../config/gameTable/TableGameEquipPosAttr";
import { MedalInfo } from "../../game-data/entity/medal.entity";
import { ArenaEntity, RoleShowInfoEntity, ServerArenaRankRecord } from "../../game-data/entity/arena.entity";
import { TableWrestleLevel } from "../../config/gameTable/TableWrestleLevel";
import { RESFightCommonInfo } from "../../game-data/entity/msg.entity";
import { TableRareMonster } from "../../config/gameTable/TableRareMonster";
import { gameConst } from "../../config/game-const";
import { WrestleEntity } from "../wrestle/entities/wrestle.entity";
import { cTools } from "../../game-lib/tools";
import { cloneDeep } from "lodash";
import { EquipPosRecord } from "../../game-data/entity/equip.entity";



export function cpFightResults(fightData: FightObjEntity[]) {

   //console.log("cpFightResults fightData:",fightData);
   let live_obj_our: number[] = [];
   let live_obj1_enemy: number[] = [];
   for (const key in fightData) {
      let curInfo: FightObjEntity = fightData[key];

      if (!curInfo) {
         if (cTools.getTestModel()) {
            Logger.error("cpFightResults fightData:", fightData);
         }
         continue;
      }

      if (!curInfo.tAttr) {
         if (cTools.getTestModel()) {
            Logger.error("cpFightResults curInfo:", curInfo);
            Logger.error("cpFightResults fightData:", fightData);
         }
         continue;
      }

      if (curInfo.tAttr[TableGameAttr.curhp] == undefined) {
         //Logger.error("cpFightResults curInfo.tAttr:", curInfo.tAttr);
         continue;
      }

      if (curInfo.objType === EObjtype.RARE_MONSTER) {
         continue;
      }

      if (curInfo && curInfo.tAttr && curInfo.tAttr[TableGameAttr.curhp] && curInfo.tAttr[TableGameAttr.curhp] > 0) {
         if (curInfo.fightCamp == EFightCamp.OUR) {
            live_obj_our.push(curInfo.pos)
         }
         else if (curInfo.fightCamp == EFightCamp.ENEMY) {
            live_obj1_enemy.push(curInfo.pos)
         }
      }
   }

   //console.log("live_obj_our.length:",live_obj_our.length);
   //console.log("live_obj1_enemy.length:",live_obj1_enemy.length);
   if (live_obj_our.length <= 0) {
      return EFightResults.LOST;
   }

   if (live_obj1_enemy.length <= 0) {
      return EFightResults.WIN;
   }

   return EFightResults.DRAW;
}

//获取玩家自己的出战属性
export async function getOurFightData(fight_type: EFightType, fightObjs_speed: FightObjEntity[], fightObjs_pos: FightObjEntity[], fightTeam: number[], heroList: HerosRecord, fightPos: number, roleInfo: RoleInfoEntity) {

   //获取上阵英雄
   //计算玩家英雄属性

   const attr_arry = TableGameAttr.getTable()
   //console.log("let:",attr_arry);
   for (const key1 in fightTeam) {

      const heroid = fightTeam[key1];
      //是否拥有这个英雄
      if (!heroList[heroid]) { continue; }

      //console.log("heroid:",heroid)
      const cur_hero_table = new TableGameHero(Number(heroid))
      if (!cur_hero_table) { continue; }

      let hero_entity: HeroEntity = heroList[heroid]
      hero_entity.id = heroid;

      if (fight_type === EFightType.GANME_LEVELS
         || fight_type === EFightType.Demon_ABYSS) {
         //不是第一个关卡的节点 检查英雄血量
         //如果不在内存里失效 或者 小于等于0 不能出战
         if (fightPos != 0 && (!hero_entity?.curHP || hero_entity?.curHP <= 0)) {
            continue;
         }
      }
      else if (fight_type === EFightType.GANME_LEVELS2
         || fight_type === EFightType.ARENA2
         || fight_type === EFightType.ARENA_KF2
      ) {
         if (!hero_entity?.curHP || hero_entity?.curHP <= 0) {
            continue;
         }
      }

      let skill_posAry: SkillPosRecord = hero_entity.skill
      let skills: number[] = [];
      for (const idx in skill_posAry) {
         if (Object.prototype.hasOwnProperty.call(skill_posAry, idx)) {
            const value = skill_posAry[idx];
            if (value && value.sid) {
               skills.push(value.sid)
            }
         }
      }

      let base_attr = cpHero.cpHeroAttr(hero_entity, roleInfo.info);
      if (!base_attr) {
         let error_str = "英雄表里没有该英雄 id:" + hero_entity.id;
         Logger.error(error_str);
         return error_str;
      }

      let fightInfo: FightObjEntity = {
         id: heroid,
         pos: Number(key1),
         fightCamp: EFightCamp.OUR,
         objType: EObjtype.HERO,
         data: cur_hero_table,
         skill: skills,
         buff: [],
         state: [],
         attr: base_attr,
         bAttr: {},
         tAttr: hero_entity.tAttr,
         fashion: hero_entity.fashion,
      }


      if (fight_type === EFightType.GANME_LEVELS || fight_type === EFightType.Demon_ABYSS) {
         if (fightPos === 0) {
            hero_entity.curHP = fightInfo.tAttr[TableGameAttr.hp];
            fightInfo.tAttr[TableGameAttr.curhp] = fightInfo.tAttr[TableGameAttr.hp];
         }
         else {
            fightInfo.tAttr[TableGameAttr.curhp] = hero_entity.curHP;
         }
      }
      else if (fight_type === EFightType.GANME_LEVELS2
         || fight_type === EFightType.ARENA2
         || fight_type === EFightType.ARENA_KF2
      ) {
         fightInfo.tAttr[TableGameAttr.curhp] = hero_entity.curHP;
      }
      else {
         fightInfo.tAttr[TableGameAttr.curhp] = fightInfo.tAttr[TableGameAttr.hp];
      }

      fightObjs_pos[Number(key1)] = fightInfo;
      fightObjs_speed.push(fightInfo);
      //console.log("fightInfo:",fightInfo);
   }
   return "ok";
}

//计算关卡怪物属性
export async function getGLMonterFightData(fight_type: EFightType, fightReqEntity: FightReqEntity, fightObjs_speed: FightObjEntity[], fightObjs_pos: FightObjEntity[], roleInfo: RoleInfoEntity) {

   //获取战斗关卡 怪物上阵内容
   const monster_team = TableGameLevels.getVal(fightReqEntity.levels, TableGameLevels.field_monster)

   if (!monster_team) {
      return { data: null, msg: "monster_team is null" };
   }

   //console.log("monster_team:",monster_team)

   if (fightReqEntity.pos + 1 > monster_team.length) {
      return { data: null, msg: "monster_team_pos is null" };
   }

   const monster_team_pos: number[] = monster_team[fightReqEntity.pos];
   //console.log("monster_team_pos:",monster_team_pos)
   //console.log("monster_team_pos.length:",monster_team_pos.length)

   if (monster_team_pos.length > TableGameConfig.val_fightNum) {

      return { data: null, msg: "monster_team num exceeds range maxnum:" + TableGameConfig.val_fightNum };
   }

   const attr_arry = TableGameAttr.getTable()

   //计算怪物属性
   for (let index = 0; index < monster_team_pos.length; index++) {

      let mon_pos = TableGameConfig.val_fightNum + index;
      const monster_id = Number(monster_team_pos[index]);

      //console.log("monster_id:",monster_id);
      const cur_monster = new TableGameMonster(monster_id)

      if (!cur_monster) {
         continue;
      }

      let fightInfo: FightObjEntity = {
         id: monster_id,
         pos: mon_pos,
         fightCamp: EFightCamp.ENEMY,
         objType: EObjtype.MONSTER,
         data: cur_monster,
         skill: cur_monster.skills,
         attr: {},
         bAttr: {},
         tAttr: {},
         buff: [],
         state: [],
      };



      for (const key in attr_arry) {
         //console.log("key:",key);
         //console.log("let:",attr_arry[key]);

         //计算表属性
         //console.log("cur_monster:",cur_monster);
         let str_key = attr_arry[key][TableGameAttr.field_strKey];
         if (!cur_monster[str_key]) {
            continue;
         }

         //console.log("cur_monster[str_key]:",cur_monster[str_key]);

         if (!fightInfo.attr[key]) {
            fightInfo.attr[key] = 0;
         }

         if (!fightInfo.tAttr[key]) {
            fightInfo.tAttr[key] = 0;
         }

         fightInfo.attr[key] += cur_monster[str_key];
         fightInfo.tAttr[key] += cur_monster[str_key];
         //console.log("cur_monster[str_key]:",cur_monster[str_key]);
      }


      //计算加成属性
      for (const key in fightInfo.tAttr) {

         if (TableGameAttr.getVal(Number(key), TableGameAttr.field_rate) === TableGameAttr.N) {
            continue;
         }

         if (Object.prototype.hasOwnProperty.call(fightInfo.tAttr, key)) {
            cpHero.cpTotalAttr(fightInfo, Number(key))
         }
      }

      if (fight_type === EFightType.GANME_LEVELS2) {

         roleInfo.info.fightMonsterHp = roleInfo.info.fightMonsterHp || {};
         if (roleInfo.info.fightMonsterHp[mon_pos] == undefined) {
            //第一次战斗记录血量
            fightInfo.tAttr[TableGameAttr.curhp] = fightInfo.tAttr[TableGameAttr.hp];
            roleInfo.info.fightMonsterHp[mon_pos] = fightInfo.tAttr[TableGameAttr.hp];
         }
         else {
            //有血量记录
            fightInfo.tAttr[TableGameAttr.curhp] = roleInfo.info.fightMonsterHp[mon_pos];
         }
      }
      else {
         fightInfo.tAttr[TableGameAttr.curhp] = fightInfo.tAttr[TableGameAttr.hp];
      }

      fightObjs_pos[mon_pos] = fightInfo;
      fightObjs_speed.push(fightInfo);
      //console.log("getGLMonterFightData fightInfo:",fightInfo);
   }

   //console.log("enemy_fight_data:",fightObjs_pos)
   //console.log("getGLMonterFightData fightObjs_pos:",fightObjs_pos);
   return { data: fightObjs_pos, msg: "ok" }

}

//计算竞技场敌方角色属性
export async function getArenaPlayerFightData2(roleShowInfoEntity: RoleShowInfoEntity, fightObjs_speed: FightObjEntity[], fightObjs_pos: FightObjEntity[], cqskill: number = 0) {

   if (!roleShowInfoEntity) {
      return 'roleShowInfoEntity is null'
   }
   const roleHero = roleShowInfoEntity.rh
   // Camp.enemy = new CampInfoEntity()
   // Camp.enemy.aureole = roleShowInfoEntity.gh;
   // if (roleShowInfoEntity.raremst && roleShowInfoEntity.raremst.fight) {
   //    Camp.enemy.rareMonster = roleShowInfoEntity.raremst.fight[roleShowInfoEntity.raremst.use] //roleShowInfoEntity.rmon;
   //    initRareMonsterObj(EFightCamp.ENEMY, Camp.enemy.rareMonster, fightObjs_speed, fightObjs_pos);
   // }

   let index = 0
   for (const key in roleHero) {
      if (Object.prototype.hasOwnProperty.call(roleHero, key)) {
         const element = roleHero[key];
         if (!element) {
            continue;
         }
         if (element.id === undefined) {
            element.id = Number(key);
         }
         let mon_pos = TableGameConfig.val_fightNum + index;
         index++;

         const cur_hero_table = new TableGameHero(Number(key))
         if (!cur_hero_table) {
            continue;
         }
         let hero_entity: HeroEntity = element;
         let roleinfo = new RoleSubInfoEntity;
         loadRoleInfo(roleinfo, roleShowInfoEntity);
         let base_attr = cpHero.cpHeroAttr(hero_entity, roleinfo);
         let skills: number[] = [];
         for (const idx in hero_entity.skill) {
            if (Object.prototype.hasOwnProperty.call(hero_entity.skill, idx)) {
               const value = hero_entity.skill[idx];
               if (value && value.sid) {
                  skills.push(value.sid)
               }
            }
         }
         let fightInfo: FightObjEntity = {
            id: Number(key),
            pos: mon_pos,
            fightCamp: EFightCamp.ENEMY,
            objType: EObjtype.HERO,
            data: cur_hero_table,
            skill: skills,
            buff: [],
            state: [],
            attr: base_attr,
            bAttr: {},
            tAttr: hero_entity.tAttr,
            fashion: hero_entity.fashion,
         }
         if (cqskill > 0) { fightInfo.skill.push(cqskill); }
         if (fightInfo.tAttr && fightInfo.tAttr[TableGameAttr.hp]) {
            fightInfo.tAttr[TableGameAttr.curhp] = fightInfo.tAttr[TableGameAttr.hp];
         }
         else {
            continue;
         }
         fightObjs_pos[mon_pos] = fightInfo;
         fightObjs_speed.push(fightInfo);
      }
   }

   return 'ok'
}

export function initEnemyCampInfo(Camp_enemy: CampInfoEntity, data: any, fightObjs_speed: FightObjEntity[], fightObjs_pos: FightObjEntity[]) {
   if (Camp_enemy && data) {
      Camp_enemy.aureole = data.gh;

      if (data.raremst && data.raremst.fight && data.raremst.use !== undefined) {
         Camp_enemy.rareMonster = data.raremst.fight[data.raremst.use]
         initRareMonsterObj(EFightCamp.ENEMY, Camp_enemy.rareMonster, fightObjs_speed, fightObjs_pos);
      }
   }
}

//计算竞技场敌方角色属性
export async function getArenaPlayerFightData(id: number, SveRank: ServerArenaRankRecord, fightObjs_speed: FightObjEntity[], fightObjs_pos: FightObjEntity[], cqskill: number = 0) {

   if (!(SveRank && SveRank[id])) {
      return 'arenaData is null'
   }
   const roleHero = SveRank[id].rh
   // if (Camp_enemy) {
   //    Camp_enemy.aureole = SveRank[id].gh;
   //    if (SveRank[id].raremst && SveRank[id].raremst.fight) {
   //       Camp_enemy.rareMonster = SveRank[id].raremst.fight[SveRank[id].raremst.use] //roleShowInfoEntity.rmon;
   //       initRareMonsterObj(EFightCamp.ENEMY, Camp_enemy.rareMonster, fightObjs_speed, fightObjs_pos);
   //    }
   // }
   let index = 0
   for (const key in roleHero) {
      if (Object.prototype.hasOwnProperty.call(roleHero, key)) {
         const element = roleHero[key];
         if (!element) {
            continue;
         }
         if (element.id === undefined) {
            element.id = Number(key);
         }
         let mon_pos = TableGameConfig.val_fightNum + index;
         index++;

         const cur_hero_table = new TableGameHero(Number(key))
         if (!cur_hero_table) {
            continue;
         }
         let hero_entity: HeroEntity = element;
         let roleinfo = new RoleSubInfoEntity;
         loadRoleInfo(roleinfo, SveRank[id]);
         let base_attr = cpHero.cpHeroAttr(hero_entity, roleinfo);
         let skills: number[] = [];
         for (const idx in hero_entity.skill) {
            if (Object.prototype.hasOwnProperty.call(hero_entity.skill, idx)) {
               const value = hero_entity.skill[idx];
               if (value && value.sid) {
                  skills.push(value.sid)
               }
            }
         }
         let fightInfo: FightObjEntity = {
            id: Number(key),
            pos: mon_pos,
            fightCamp: EFightCamp.ENEMY,
            objType: EObjtype.HERO,
            data: cur_hero_table,
            skill: skills,
            buff: [],
            state: [],
            attr: base_attr,
            bAttr: {},
            tAttr: hero_entity.tAttr,
            fashion: hero_entity.fashion,
         }
         if (cqskill > 0) { fightInfo.skill.push(cqskill); }
         if (fightInfo.tAttr && fightInfo.tAttr[TableGameAttr.hp]) {
            fightInfo.tAttr[TableGameAttr.curhp] = fightInfo.tAttr[TableGameAttr.hp];
         }
         else {
            continue;
         }
         fightObjs_pos[mon_pos] = fightInfo;
         fightObjs_speed.push(fightInfo);
      }
   }

   return 'ok'
}

//计算竞技场敌方机器人属性
export async function getArenaRobotFightData(fightReqEntity: FightReqEntity, fightObjs_speed: FightObjEntity[], fightObjs_pos: FightObjEntity[], fight_type: EFightType, roleInfo: RoleInfoEntity = null, cqskill: number = 0) {

   const medalid = TableRobotRole.getVal(fightReqEntity.id, TableRobotRole.field_medal)
   let Medal_table = new TableMedalUplevel(medalid)
   const robot_team = TableRobotRole.getVal(fightReqEntity.id, TableRobotRole.field_robot)
   if (!robot_team) {
      return "robot_team is null";
   }

   if (robot_team.length > TableGameConfig.val_fightNum) {

      return "robot_team num exceeds range maxnum:" + TableGameConfig.val_fightNum;
   }

   const attr_arry = TableGameAttr.getTable()

   //计算属性
   for (let index = 0; index < robot_team.length; index++) {

      let pos = TableGameConfig.val_fightNum + index;
      const robot_id = robot_team[index];
      const cur_robot = new TableRobotHero(robot_id)
      if (!cur_robot) {
         continue;
      }
      const cur_hero_table = new TableGameHero(Number(cur_robot.heroid))
      if (!cur_hero_table) {
         continue;
      }
      if (fight_type === EFightType.ARENA2) {
         pos = TableGameConfig.val_fightNum
         if (fightReqEntity.pos !== index) {
            continue;
         }
      }
      let fightInfo: FightObjEntity = {
         id: Number(cur_robot.heroid),//robot_id,
         pos: pos,
         fightCamp: EFightCamp.ENEMY,
         objType: EObjtype.HERO,//EObjtype.ROBOT,
         data: cur_hero_table,
         skill: cloneDeep(cur_robot.skill),
         attr: {},
         bAttr: {},
         tAttr: {},
         buff: [],
         state: [],
      };
      if (cqskill > 0) { fightInfo.skill.push(cqskill); }
      fightObjs_pos[pos] = fightInfo;
      fightObjs_speed.push(fightInfo);

      for (const key in attr_arry) {
         //计算表属性
         let str_key = attr_arry[key][TableGameAttr.field_strKey];
         if (!cur_hero_table[str_key]) {
            continue;
         }
         if (!fightInfo.attr[key]) {
            fightInfo.attr[key] = 0;
         }
         if (!fightInfo.tAttr[key]) {
            fightInfo.tAttr[key] = 0;
         }
         //角色属性
         calc_attr(cur_hero_table[str_key])
         //勋章属性
         if (Medal_table && Medal_table[str_key]) {
            calc_attr(Medal_table[str_key])
         }
         //装备属性
         if (cur_robot.equip && cur_robot.equip.length > 0) {
            for (const ekey in cur_robot.equip) {
               if (Object.prototype.hasOwnProperty.call(cur_robot.equip, ekey)) {
                  const equipid = cur_robot.equip[ekey];
                  const cur_equip = new TableGameEquip(equipid)
                  if (cur_equip[str_key]) {
                     calc_attr(cur_equip[str_key])
                  }
               }
            }
         }
         //装备位强化属性
         if (cur_robot.poslv && cur_robot.poslv.length > 0) {
            for (const pos in cur_robot.poslv) {
               if (Object.prototype.hasOwnProperty.call(cur_robot.poslv, pos)) {
                  const lv = cur_robot.poslv[pos];
                  const cur_poslv = new TableGameEquipPosAttr(lv)
                  if (cur_poslv[str_key]) {
                     calc_attr(cur_poslv[str_key])
                  }
               }
            }
         }
         function calc_attr(attr: number) {//计算属性
            fightInfo.attr[key] += attr;
            fightInfo.tAttr[key] += attr;
         }
      }

      //计算加成属性
      for (const key in fightInfo.tAttr) {

         if (TableGameAttr.getVal(Number(key), TableGameAttr.field_rate) === TableGameAttr.N) {
            continue;
         }

         if (Object.prototype.hasOwnProperty.call(fightInfo.tAttr, key)) {
            cpHero.cpTotalAttr(fightInfo, Number(key))
         }
      }
      if (fight_type === EFightType.ARENA2 && roleInfo?.info?.fightMonsterHp) {
         if ((roleInfo.info.fightMonsterHp[fightInfo.id] ?? 0) > 0) {
            fightInfo.tAttr[TableGameAttr.curhp] = roleInfo.info.fightMonsterHp[fightInfo.id];
         }
         else {
            roleInfo.info.fightMonsterHp[fightInfo.id] = fightInfo.tAttr[TableGameAttr.hp];
            fightInfo.tAttr[TableGameAttr.curhp] = fightInfo.tAttr[TableGameAttr.hp];
         }
         return "ok";
      }
      else {
         fightInfo.tAttr[TableGameAttr.curhp] = fightInfo.tAttr[TableGameAttr.hp];
      }
   }

   //console.log("enemy_fight_data:",fightObjs_pos)
   return "ok";
}

/***
 * 加载数据
 */
export function loadRoleInfo(roleinfo: RoleSubInfoEntity, data: ArenaEntity) {
   //勋章
   roleinfo.medalInfo = new MedalInfo;
   roleinfo.medalInfo.mid = data.m;
   //等阶
   roleinfo.upgrade = data.lg;
   //光环
   roleinfo.aureole = data.gh;
   //异兽
   roleinfo.raremst = data.raremst;
   //角斗
   if (data.wid && data.wid > 0) {
      roleinfo.wrestle = new WrestleEntity()
      roleinfo.wrestle.id = data.wid;
   }
   //称号
   roleinfo.title = data.titleE
   //时装
   roleinfo.fashion = data.fashion
   /**技能系统 */
   roleinfo.skill = data.skill

}

/**角斗我方出战 */
export async function getOurPKFightData(heroList: HerosRecord, roleInfo: RoleInfoEntity, fight_roundsAry: FightObjEntity[], fight_data: FightObjEntity[], retMsg: RESFightCommonInfo, dto: FightReqEntity) {
   //获取上阵英雄
   let roleSubInfo: RoleSubInfoEntity = <RoleSubInfoEntity>(roleInfo.info);
   let opos = roleSubInfo.wrestle?.fight?.opos
   if (opos === undefined) {
      return false
   }
   let posorder = roleSubInfo.wrestle?.fight?.posorder
   if (posorder === undefined) {
      return false
   }
   let heroid = roleSubInfo.fteam[posorder[opos]];
   if (!heroid) {
      retMsg.msg = "fightopos " + opos;
      return false;
   }
   if (!heroList[heroid]) {
      return false;
   }
   for (const key in heroList) {
      const cur_hero_table = new TableGameHero(Number(key))
      if (!cur_hero_table) {
         return false;
      }
      if (Object.prototype.hasOwnProperty.call(heroList, key)) {
         let hero_entity: HeroEntity = heroList[key];
         // let hero_entity: HeroEntity = heroList[heroid]
         hero_entity.id = Number(key);
         let skill_posAry: SkillPosRecord = hero_entity.skill
         let skills: number[] = [];
         for (const idx in skill_posAry) {
            if (Object.prototype.hasOwnProperty.call(skill_posAry, idx)) {
               const value = skill_posAry[idx];
               if (value && value.sid) {
                  skills.push(value.sid)
               }
            }
         }
         let base_attr = cpHero.cpHeroAttr(hero_entity, roleInfo.info, true, true);
         if (!base_attr) {
            return false;
         }
         /**战斗位置 */
         let fpos = 0
         let fightInfo: FightObjEntity = {
            id: heroid,
            pos: fpos,
            fightCamp: EFightCamp.OUR,
            objType: EObjtype.HERO,
            data: cur_hero_table,
            skill: skills,
            buff: [],
            state: [],
            attr: base_attr,
            bAttr: {},
            tAttr: hero_entity.tAttr,
            fashion: hero_entity.fashion,
         }
         if (dto.pos === 0) { //!hero_entity.curHP || hero_entity.curHP <= 0 || 
            hero_entity.curHP = fightInfo.tAttr[TableGameAttr.hp];
            fightInfo.tAttr[TableGameAttr.curhp] = fightInfo.tAttr[TableGameAttr.hp];
         }
         if (key === String(heroid)) {
            fightInfo.tAttr[TableGameAttr.curhp] = hero_entity.curHP
            fight_data[fpos] = fightInfo;
            fight_roundsAry[fpos] = fightInfo;
         }

      }
   }

   return true;
}

/**角斗敌方出战 */
export async function getEnemyPKFightData(roleInfo: RoleInfoEntity, fight_roundsAry: FightObjEntity[], fight_data: FightObjEntity[], retMsg: RESFightCommonInfo, dto: FightReqEntity, Camp_enemy: CampInfoEntity) {

   const attr_arry = TableGameAttr.getTable()
   let wrestle = roleInfo.info.wrestle;
   let camp = new WrestleCampEntity()
   const monster_team = TableWrestleLevel.getVal(dto.levels, TableGameLevels.field_monster)
   let epos = wrestle?.fight?.epos
   if (epos === undefined) {
      return false
   }
   camp.order = monster_team[wrestle.fight.daynum][wrestle.fight.pkgroup]
   camp.pos = epos
   if (camp.order.length <= 0) {
      return false
   }
   if (Camp_enemy) {
      Camp_enemy.wrestl = camp
   }
   for (let index = 0; index < camp.order.length; index++) {
      let monster_id = camp.order[index];

      const cur_monster = new TableGameMonster(monster_id)
      if (!cur_monster) {
         return false;
      }

      let fpos = TableGameConfig.val_fightNum
      let fightInfo: FightObjEntity = {
         id: monster_id,
         pos: fpos,
         fightCamp: EFightCamp.ENEMY,
         objType: EObjtype.MONSTER,
         data: cur_monster,
         skill: cur_monster.skills,
         attr: {},
         bAttr: {},
         tAttr: {},
         buff: [],
         state: [],
      };

      for (const key in attr_arry) {
         //计算表属性
         let str_key = attr_arry[key][TableGameAttr.field_strKey];
         if (!cur_monster[str_key]) {
            continue;
         }
         if (!fightInfo.attr[key]) {
            fightInfo.attr[key] = 0;
         }
         if (!fightInfo.tAttr[key]) {
            fightInfo.tAttr[key] = 0;
         }
         fightInfo.attr[key] += cur_monster[str_key];
         fightInfo.tAttr[key] += cur_monster[str_key];
         //console.log("cur_monster[str_key]:",cur_monster[str_key]);
      }
      //计算加成属性
      for (const key in fightInfo.tAttr) {
         if (TableGameAttr.getVal(Number(key), TableGameAttr.field_rate) === TableGameAttr.N) {
            continue;
         }
         if (Object.prototype.hasOwnProperty.call(fightInfo.tAttr, key)) {
            cpHero.cpTotalAttr(fightInfo, Number(key))
         }
      }

      if (dto.pos === 0) {
         wrestle.fight.monhp[index] = fightInfo.tAttr[TableGameAttr.hp];
         fightInfo.tAttr[TableGameAttr.curhp] = fightInfo.tAttr[TableGameAttr.hp];
      }
      if (index == epos) {
         fightInfo.tAttr[TableGameAttr.curhp] = wrestle.fight.monhp[index]
         fight_data[fpos] = fightInfo;
         fight_roundsAry[fpos] = fightInfo;
      }


   }
   //////////////////////////////////////


   return true;
}

export function initPlayerCampInfo(roleInfo: RoleInfoEntity, campInfoEntity: CampInfoEntity, fightObjs_speed: FightObjEntity[], fightObjs_pos: FightObjEntity[], fight_type: EFightType, cqskill: number = 0) {

   //光环
   if (roleInfo.info.aureole) {
      campInfoEntity.aureole = roleInfo.info.aureole;
   }

   //异兽
   if (fight_type !== EFightType.WRESTLE && roleInfo.info.raremst && roleInfo.info.raremst.fight && roleInfo.info.raremst.use != undefined && roleInfo.info.raremst.fight[roleInfo.info.raremst.use]) {
      let raremst = roleInfo.info.raremst;
      campInfoEntity.rareMonster = raremst.fight[raremst.use];

      initRareMonsterObj(EFightCamp.OUR, campInfoEntity.rareMonster, fightObjs_speed, fightObjs_pos);

   }

   if (cqskill > 0) {
      for (let k in fightObjs_pos) {
         let fobj = fightObjs_pos[Number(k)];
         if (fobj.objType == EObjtype.HERO) {
            fobj.skill.push(cqskill);
         }
      }
   }

   if (fight_type == EFightType.WRESTLE) {
      if (roleInfo.info.wrestle) {
         let fight = roleInfo.info.wrestle.fight
         if (fight) {
            campInfoEntity.wrestl = {
               order: fight.posorder,
               pos: fight.opos
            }
         }
      }
   }
}


export function initRareMonsterObj(fightCamp: EFightCamp, rareMonster: number[], fightObjs_speed: FightObjEntity[], fightObjs_pos: FightObjEntity[]) {

   if (!rareMonster) { return }

   for (let index = 0; index < rareMonster.length; index++) {
      const rareMonsterId = rareMonster[index];

      if (!TableRareMonster.checkHave(rareMonsterId)) { continue; }

      let cur_table = new TableRareMonster(rareMonsterId);

      let start_pos = gameConst.rareMonster_our_pos;
      if (fightCamp === EFightCamp.ENEMY) {
         start_pos = gameConst.rareMonster_entmy_pos;
      }

      let init_speed = gameConst.rareMonster_our_speed;
      if (fightCamp === EFightCamp.ENEMY) {
         init_speed = gameConst.rareMonster_entmy_speed;
      }

      let init_skill: number[] = [];
      if (cur_table.skill) {
         init_skill.push(cur_table.skill);
      }

      let cur_pos = start_pos + index;

      let init_attr = {};
      init_attr[TableGameAttr.atkspeed] = init_speed;
      init_attr[TableGameAttr.curhp] = 1;
      init_attr[TableGameAttr.hp] = 1;

      let fightInfo: FightObjEntity = {
         id: rareMonsterId,
         pos: cur_pos,
         fightCamp: fightCamp,
         objType: EObjtype.RARE_MONSTER,
         data: cur_table,
         skill: init_skill,
         buff: [],
         state: [],
         attr: {},
         bAttr: init_attr,
         tAttr: init_attr,
      }

      fightObjs_pos[cur_pos] = fightInfo;
      fightObjs_speed.push(fightInfo);

   }
}


export const cFightSystem = {

   isHaveHeroByGroup(hero_group: number, heroList: HerosRecord, fight_hero_list: number[]) {
      for (const heroid in heroList) {
         if (Object.prototype.hasOwnProperty.call(heroList, heroid)) {
            let heroid_int = Number(heroid)
            if (TableGameHero.checkHave(heroid_int)) {
               let cur_hero_table = new TableGameHero(heroid_int);
               if (cur_hero_table.group === Number(hero_group)) {
                  fight_hero_list.push(heroid_int);
                  return true;
               }
            }
         }
      }

      return false;
   },

   isAllOver(fightGroup: number[], heroList: HerosRecord) {

      for (let index = 0; index < fightGroup.length; index++) {
         const hero_group = fightGroup[index];
         for (const heroid in heroList) {
            if (Object.prototype.hasOwnProperty.call(heroList, heroid)) {
               let heroid_int = Number(heroid)
               if (TableGameHero.checkHave(heroid_int)) {
                  let cur_hero_table = new TableGameHero(heroid_int);
                  if (cur_hero_table.group === Number(hero_group)) {
                     if (heroList[heroid].curHP > 0) {
                        return false;
                     }
                  }
               }
            }
         }

      }

      return true;
   },

   getFightTeam(fightGroup: number[], heroList: HerosRecord) {

      let fightTeam: number[] = [];

      if (!fightGroup || !heroList) {
         return fightTeam;
      }

      for (let index = 0; index < fightGroup.length; index++) {
         const hero_group = fightGroup[index];
         for (const heroid in heroList) {
            if (Object.prototype.hasOwnProperty.call(heroList, heroid)) {
               let heroid_int = Number(heroid)
               if (TableGameHero.checkHave(heroid_int)) {
                  let cur_hero_table = new TableGameHero(heroid_int);
                  if (cur_hero_table.group === Number(hero_group)) {
                     if (heroList[heroid].curHP > 0) {
                        fightTeam.push(heroid_int);
                        return fightTeam;
                     }
                  }
               }
            }
         }

      }

      return fightTeam;
   },

   initFightHeroHP(heroList: HerosRecord, roleInfo: RoleInfoEntity) {
      //初始化英雄血量
      let hp = {}
      for (const heroid in heroList) {
         if (Object.prototype.hasOwnProperty.call(heroList, heroid)) {
            let hero_entity = heroList[heroid];
            hero_entity.id = Number(heroid);
            cpHero.cpHeroAttr(hero_entity, roleInfo.info);
            hero_entity.curHP = hero_entity.tAttr[TableGameAttr.hp];
            hp[Number(heroid)] = hero_entity.tAttr[TableGameAttr.hp];
         }
      }
      return hp;
   }

}


//计算竞技场敌方角色属性 一个出场 1v1
export async function getEnemyFightData(fight_type: EFightType, fightObjs_speed: FightObjEntity[], fightObjs_pos: FightObjEntity[], fightReqEntity: FightReqEntity, roleInfo: RoleInfoEntity, retMsg: RESFightCommonInfo) {

   let roleHero: HerosRecord = fightReqEntity?.edata?.roleHero
   let roleSubInfo = fightReqEntity?.edata?.roleSubInfo
   if (!roleHero || !roleSubInfo) {
      return false
   }


   for (const key in roleHero) {
      if (Object.prototype.hasOwnProperty.call(roleHero, key)) {
         const element = roleHero[key];
         if (!element) {
            continue;
         }
         if (element.id === undefined) {
            element.id = Number(key);
         }
         let mon_pos = TableGameConfig.val_fightNum

         const cur_hero_table = new TableGameHero(Number(key))
         if (!cur_hero_table) {
            continue;
         }
         let hero_entity: HeroEntity = element;
         let base_attr = cpHero.cpHeroAttr(hero_entity, roleSubInfo);
         let skills: number[] = [];
         for (const idx in hero_entity.skill) {
            if (Object.prototype.hasOwnProperty.call(hero_entity.skill, idx)) {
               const value = hero_entity.skill[idx];
               if (value && value.sid) {
                  skills.push(value.sid)
               }
            }
         }
         let fightInfo: FightObjEntity = {
            id: Number(key),
            pos: mon_pos,
            fightCamp: EFightCamp.ENEMY,
            objType: EObjtype.HERO,
            data: cur_hero_table,
            skill: skills,
            buff: [],
            state: [],
            attr: base_attr,
            bAttr: {},
            tAttr: hero_entity.tAttr,
            fashion: hero_entity.fashion,
         }
         // if (cqskill > 0) { fightInfo.skill.push(cqskill); }
         let curHP = roleInfo.info.fightMonsterHp[fightInfo.id] || 0
         if (fightInfo.tAttr && curHP > 0) {

            fightInfo.tAttr[TableGameAttr.curhp] = curHP;
            fightObjs_pos[mon_pos] = fightInfo;
            fightObjs_speed.push(fightInfo);
            return true
         }
      }
   }

   return false;
}

/**机器人信息 */
export function getRobotinfo(id: number) {
   // let info: HerosRecord = {};
   let infos = new RoleShowInfoEntity();
   const defRole = new TableRobotRole(Number(id))

   if (!defRole) return infos;
   infos.c = defRole.icon;
   infos.lv = defRole.lv;
   infos.n = defRole.name;
   let def = defRole.robot
   for (const key in def) {
      if (Object.prototype.hasOwnProperty.call(def, key)) {
         const trid = def[key];
         const th = TableRobotHero.table[trid]
         if (th) {
            let skill: SkillPosRecord = {}
            for (let index = 0; index < th.skill.length; index++) {
               const element = th.skill[index];
               skill[index] = { sid: element }
            }
            let equip: EquipPosRecord = {}
            for (let index = 0; index < th.equip.length; index++) {
               const element = th.equip[index];
               equip[index + 1] = {
                  id: element,
                  qid: 3,
                  bper: 25,
               }
            }
            let tran = Math.floor(Math.random() * 1000)
            let heroEntity: HeroEntity = {
               id: th.heroid,
               skill: skill,
               equip: equip,
               tAttr: { 2: 3000 + tran, 3: 5000 + tran, 4: 10000 + tran },
               fight: Math.floor(Math.random() * 20000) + 20000
            }
            infos.rh = infos.rh || {}
            infos.rh[th.heroid] = heroEntity;
         }

      }
   }
   return infos;

}