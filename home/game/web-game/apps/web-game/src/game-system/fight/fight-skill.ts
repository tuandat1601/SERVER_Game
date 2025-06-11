import { EFightAct, EFightCamp, EFightResults, EFightState, EObjtype, ESkillType } from "../../config/game-enum";
import { TableGameAttr } from "../../config/gameTable/TableGameAttr";
import { TableGameConfig } from "../../config/gameTable/TableGameConfig";
import { TableGameSkill } from "../../config/gameTable/TableGameSkill";
import { FightActEntity, FightObjEntity } from "../../game-data/entity/fight.entity";
import { Logger } from "../../game-lib/log4js";
import { changeCurHp, cpAtkDamage, cpAttrPro } from "./fight-attr";
import { addBuff } from "./fight-buff";
import { checkFightState } from "./fight-state";
import { cpFightResults } from "./fight-system";

/**
 * 随机一个活着的目标
 * @param atkInfo 
 * @param fightObjs_pos 
 * @returns 
 */
export function getAtkTargetpos(atkInfo: FightObjEntity, fightObjs_pos: FightObjEntity[]) {

   //随机一个活着的目标
   let cur_fightCamp: EFightCamp = atkInfo.fightCamp

   if (checkFightState(EFightState.CONFUSION, atkInfo)) {
      cur_fightCamp = EFightCamp.NONE;
   }

   let target_pos = -1;
   let live_obj: number[] = [];
   for (const key in fightObjs_pos) {
      let cur_fightinfo: FightObjEntity = fightObjs_pos[key];
      if (cur_fightinfo && cur_fightinfo.objType !== EObjtype.RARE_MONSTER
         && cur_fightinfo.fightCamp != cur_fightCamp
         && cur_fightinfo.tAttr[TableGameAttr.curhp] > 0
         && cur_fightinfo.pos != atkInfo.pos
      ) {
         live_obj.push(cur_fightinfo.pos)
      }
   }

   if (live_obj.length > 0) {
      if (live_obj.length === 1) {
         target_pos = live_obj[0]
      }
      else {
         target_pos = live_obj[Math.floor(Math.random() * live_obj.length)];
      }
   }

   return target_pos;
}

/**
 * 普通攻击
 * @param atkInfo 
 * @param fightObjs_pos 
 * @param act_list 
 * @returns 
 */
export function executeAtkAct(roleid: string, atkInfo: FightObjEntity, fightObjs_pos: FightObjEntity[], act_list: FightActEntity[]) {

   if (atkInfo && atkInfo.objType == EObjtype.RARE_MONSTER) {
      return EFightResults.DRAW;
   }

   if (checkFightState(EFightState.NO_ATK, atkInfo)) {
      if (process.env.FIGHT_LOG == "TRUE") {
         Logger.fightlog(roleid, `[${atkInfo.data['name']}(${atkInfo.pos})] 由于负面BUFF 无法进行普通攻击`);
      }
      return EFightResults.DRAW;
   }

   //随机一个活着的目标
   let target_pos = getAtkTargetpos(atkInfo, fightObjs_pos);

   if (target_pos == -1) {
      return EFightResults.DRAW;
   }

   let target_info: FightObjEntity = fightObjs_pos[target_pos];

   //console.log("atk_pos:",atk_pos)
   let atk_act: FightActEntity = {
      t: EFightAct.ATK,
      ap: atkInfo.pos,
      tp: target_pos,
   }
   act_list.push(atk_act);


   let damage = cpAtkDamage(roleid, atkInfo, target_info, atk_act)

   atk_act.v = damage;

   if (process.env.FIGHT_LOG == "TRUE") {
      if (atk_act.miss) {
         Logger.fightlog(roleid, `[${atkInfo.data['name']}(${atkInfo.pos})] 对[${target_info.data['name']}(${target_pos})] 发动普通攻击 但对方闪避了伤害`)
      }
      else if (atk_act.no_damage) {
         Logger.fightlog(roleid, `[${atkInfo.data['name']}(${atkInfo.pos})] 对[${target_info.data['name']}(${target_pos})] 发动普通攻击 但对方免疫了伤害(剩余${target_info.state[EFightState.NO_DAMAGE]}次)`)
      }
      else {
         Logger.fightlog(roleid, `[${atkInfo.data['name']}(${atkInfo.pos})] 发动普通攻击 对[${target_info.data['name']}(${target_pos})]造成了${damage}点伤害(${target_info.tAttr[TableGameAttr.curhp] + damage})`)
      }
   }

   changeCurHp(roleid, target_info, damage);

   if (target_info.tAttr[TableGameAttr.curhp] <= 0) {

      // if (process.env.FIGHT_LOG == "TRUE") {
      //    Logger.fightlog(roleid, `${target_info.data['name']} 死亡`);
      // }

      //杀死单位 检查结果
      return cpFightResults(fightObjs_pos);
   }

   //追击技能
   executeSkillAct(roleid, ESkillType.APPEND, atkInfo, fightObjs_pos, act_list, target_pos);

   //是否能反击
   return executeAtkBack(roleid, target_info, atkInfo, act_list, fightObjs_pos);
}

/**
 * 反击
 * @param atkInfo 
 * @param defInfo 
 * @param act_list 
 * @returns 
 */
export function executeAtkBack(roleid: string, atkInfo: FightObjEntity, defInfo: FightObjEntity, act_list: FightActEntity[], fightObjs_pos: FightObjEntity[]) {

   if (atkInfo && atkInfo.objType == EObjtype.RARE_MONSTER) {
      return EFightResults.DRAW;
   }

   //是否能反击
   let atk_tattr = atkInfo.tAttr;

   if (!atk_tattr[TableGameAttr.aktBack_pro] || atk_tattr[TableGameAttr.aktBack_pro] <= 0) {
      return EFightResults.DRAW;
   }

   if (!cpAttrPro(atk_tattr[TableGameAttr.aktBack_pro], defInfo[TableGameAttr.dec_atkBack_pro])) {

      return EFightResults.DRAW;

   }

   if (checkFightState(EFightState.NO_ATKBACK, atkInfo)) {
      if (process.env.FIGHT_LOG == "TRUE") {
         Logger.fightlog(roleid, `[${atkInfo.data['name']}(${atkInfo.pos})] 由于负面BUFF 无法反击`);
      }

      return EFightResults.DRAW;
   }


   let target_pos = defInfo.pos;

   //console.log("atk_pos:",atk_pos)
   let atk_act: FightActEntity = {
      t: EFightAct.ATKBACK,
      ap: atkInfo.pos,
      tp: target_pos,
   }
   act_list.push(atk_act);

   let add_attr = {
      [TableGameAttr.atk_ratio]: atk_tattr[TableGameAttr.aktBack_per]
   }


   let damage = cpAtkDamage(roleid, atkInfo, defInfo, atk_act, add_attr)

   atk_act.v = damage;

   if (process.env.FIGHT_LOG == "TRUE") {
      if (atk_act.miss) {
         Logger.fightlog(roleid, `[反击][${atkInfo.data['name']}(${atkInfo.pos})] 对[${defInfo.data['name']}(${target_pos})] 发动反击 但对方闪避了伤害`)
      } else if (atk_act.no_damage) {
         Logger.fightlog(roleid, `[${atkInfo.data['name']}(${atkInfo.pos})] 对[${defInfo.data['name']}(${target_pos})] 发动反击 但对方免疫了伤害(剩余${defInfo.state[EFightState.NO_DAMAGE]}次)`)
      }
      else {
         Logger.fightlog(roleid, `[${atkInfo.data['name']}(${atkInfo.pos})] 发动反击 对[${defInfo.data['name']}(${target_pos})]造成了${damage}点伤害(${defInfo.tAttr[TableGameAttr.curhp] + damage})`)
      }
   }



   changeCurHp(roleid, defInfo, damage);

   if (defInfo.tAttr[TableGameAttr.curhp] <= 0) {

      // if (process.env.FIGHT_LOG == "TRUE") {
      //    Logger.fightlog(roleid, `${defInfo.data['name']} 死亡`);
      // }

      //杀死单位 检查结果
      return cpFightResults(fightObjs_pos);
   }

   return EFightResults.DRAW;
}

/**
 * 执行连击
 * @param atkInfo 
 * @param fightObjs_pos 
 * @param act_list 
 * @returns 
 */
export function executeDoubleAtkAct(roleid: string, atkInfo: FightObjEntity, fightObjs_pos: FightObjEntity[], act_list: FightActEntity[]) {

   if (atkInfo && atkInfo.objType == EObjtype.RARE_MONSTER) {
      return EFightResults.DRAW;
   }

   //随机一个活着的目标
   let target_pos = getAtkTargetpos(atkInfo, fightObjs_pos);

   if (target_pos == -1) {
      return EFightResults.DRAW;
   }

   let target_info: FightObjEntity = fightObjs_pos[target_pos];


   let akt_tattr = atkInfo.tAttr;
   let def_tattr = target_info.tAttr;

   if (!cpAttrPro(akt_tattr[TableGameAttr.douleAtk_pro], def_tattr[TableGameAttr.dec_doubleAtk_pro])) {
      return EFightResults.DRAW;
   }

   if (checkFightState(EFightState.NO_DOUBLEATK, atkInfo)) {

      if (process.env.FIGHT_LOG == "TRUE") {
         Logger.fightlog(roleid, `[${atkInfo.data['name']}(${atkInfo.pos})] 由于负面BUFF 无法进行连击`);
      }

      return EFightResults.DRAW;
   }


   let atk_act: FightActEntity = {
      t: EFightAct.DOUBLEATK,
      ap: atkInfo.pos,
      tp: target_pos,
   }
   act_list.push(atk_act);

   let doubleAtk_per = akt_tattr[TableGameAttr.doubleAtk_per] || 0;
   doubleAtk_per += TableGameConfig.init_doubleAtk_per;
   let add_attr = {
      [TableGameAttr.atk_ratio]: doubleAtk_per
   }

   let damage = cpAtkDamage(roleid, atkInfo, target_info, atk_act, add_attr)

   atk_act.v = damage;

   if (process.env.FIGHT_LOG == "TRUE") {
      if (atk_act.miss) {
         Logger.fightlog(roleid, `[${atkInfo.data['name']}(${atkInfo.pos})]  对[${target_info.data['name']}(${target_pos})] 发动连击 单对方闪避了伤害`)
      }
      else if (atk_act.no_damage) {
         Logger.fightlog(roleid, `[${atkInfo.data['name']}(${atkInfo.pos})] 对[${target_info.data['name']}(${target_pos})] 发动连击 但对方免疫了伤害(剩余${target_info.state[EFightState.NO_DAMAGE]}次)`)
      }
      else {
         Logger.fightlog(roleid, `[${atkInfo.data['name']}(${atkInfo.pos})] 发动连击 对[${target_info.data['name']}(${target_pos})]造成了${damage}点伤害(${target_info.tAttr[TableGameAttr.curhp] + damage})`)
      }
   }


   changeCurHp(roleid, target_info, damage);

   if (target_info.tAttr[TableGameAttr.curhp] <= 0) {

      // if (process.env.FIGHT_LOG == "TRUE") {
      //    Logger.fightlog(roleid, `${target_info.data['name']} 死亡`);
      // }
      //杀死单位 检查结果
      return cpFightResults(fightObjs_pos);
   }

   //追击技能
   executeSkillAct(roleid, ESkillType.APPEND, atkInfo, fightObjs_pos, act_list, target_pos);

   //是否能反击
   return executeAtkBack(roleid, target_info, atkInfo, act_list, fightObjs_pos);

}

/**
 * 根据技能类型 遍历释放对象所有技能
 * @param skilltype 
 * @param atkInfo 
 * @param fightObjs_pos 
 * @param act_list 
 * @returns 
 */
export function executeSkillAct(roleid: string, skilltype: ESkillType, atkInfo: FightObjEntity, fightObjs_pos: FightObjEntity[], act_list: FightActEntity[], targetPos: number = -1) {

   let cur_skills: number[] = atkInfo.skill;
   if (!cur_skills || cur_skills.length <= 0) {
      return;
   }

   for (let index = 0; index < cur_skills.length; index++) {
      const skillId = cur_skills[index];
      const cur_type = TableGameSkill.getVal(skillId, TableGameSkill.field_type);
      if (cur_type != skilltype) {
         continue;
      }

      cpSubSkillAct(roleid, skillId, atkInfo, fightObjs_pos, act_list, targetPos);

   }
}

/**
 * 单个技能释放
 * @param skillId 
 * @param atkInfo 
 * @param fightObjs_pos 
 * @param act_list 
 * @returns 
 */
export function cpSubSkillAct(roleid: string, skillId: number, atkInfo: FightObjEntity, fightObjs_pos: FightObjEntity[], act_list: FightActEntity[], targetPos: number = -1) {

   let skill_info = new TableGameSkill(skillId);

   if (!skill_info.buff || skill_info.buff.length <= 0) {
      return EFightResults.DRAW;
   }

   //是否能释放技能
   let add_pro = 0

   if (skill_info.type === ESkillType.APPEND) {
      add_pro = atkInfo.tAttr[TableGameAttr.add_apskill_pro] ? atkInfo.tAttr[TableGameAttr.add_apskill_pro] : 0;
   }
   else if (skill_info.type === ESkillType.ACTIVE) {
      add_pro = atkInfo.tAttr[TableGameAttr.add_askill_pro] ? atkInfo.tAttr[TableGameAttr.add_askill_pro] : 0;
   }


   if (!cpAttrPro(skill_info.probability + add_pro)) {
      return EFightResults.DRAW;
   }

   if (checkFightState(EFightState.NO_ASKILL, atkInfo) && skill_info.type === ESkillType.ACTIVE) {
      if (process.env.FIGHT_LOG == "TRUE") {
         Logger.fightlog(roleid, `[${atkInfo.data['name']}(${atkInfo.pos})] 由于负面BUFF 无法发动主动技能`);
      }
      return;
   }

   if (process.env.FIGHT_LOG == "TRUE") {
      if (skill_info.type === ESkillType.APPEND) {
         Logger.fightlog(roleid, `[${atkInfo.data['name']}(${atkInfo.pos})] 触发追击技能[${skill_info.name}]`);
      }
      else if (skill_info.type === ESkillType.ACTIVE) {
         Logger.fightlog(roleid, `[${atkInfo.data['name']}(${atkInfo.pos})] 发动主动技能[${skill_info.name}]`);
      }
      else if (skill_info.type === ESkillType.PASSIVE) {
         Logger.fightlog(roleid, `[${atkInfo.data['name']}(${atkInfo.pos})] 触发被动技能[${skill_info.name}]`);
      }
   }

   let actEntity = {
      t: EFightAct.SKILL,
      ap: atkInfo.pos,
      sid: skillId,
      sub: [],
   }

   act_list.push(actEntity);

   //add buff
   let buffs: number[] = skill_info.buff;
   for (let buffbuff_idx = 0; buffbuff_idx < buffs.length; buffbuff_idx++) {

      const buffid = buffs[buffbuff_idx];
      addBuff(roleid, buffid, atkInfo, fightObjs_pos, actEntity.sub, targetPos)

   }

}