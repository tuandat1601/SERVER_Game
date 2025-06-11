import { Body, Injectable, Request } from '@nestjs/common';
import { TableGameAttr } from '../../config/gameTable/TableGameAttr';
import { TableGameConfig } from '../../config/gameTable/TableGameConfig';
import { GameDataService, GetRoleALLInfoDto } from '../../game-data/gamedata.service';
import { RoleKeyDto } from '../../game-data/role/dto/role-key.dto';
import { AbyssDragonFightDto, ADDamageAwardDto, AllRankDto, ArenaFightDto, DemonAbyssDailyAwardsDto, DemonAbyssDailyBuyItemDto, DemonAbyssFightDto, DemonAbyssGetAwardsDto, EliteFightDto, GameLevelsFight2Dto, GameLevelsFightDto, GetADRankDto, RankDto, RoleShowDto } from './dto/game-fight.dto';
import { EBuffTrigger, EFightResults, EFightState, EObjtype, ESkillType, EActType, EFightType, EArenaSatate, EFightCamp, EGameRankType } from '../../config/game-enum';
import { executeAtkAct, executeDoubleAtkAct, executeSkillAct } from './fight-skill';
import { cpFightResults, getGLMonterFightData, getArenaRobotFightData, getOurFightData, getArenaPlayerFightData, getOurPKFightData, getEnemyPKFightData, initPlayerCampInfo, getArenaPlayerFightData2, loadRoleInfo, initEnemyCampInfo, cFightSystem, getEnemyFightData, getRobotinfo } from './fight-system';
import { executeAllBuff, executeBuff } from './fight-buff';
import { checkFightState } from './fight-state';
import { FightActEntity, FightReqEntity, FightObjEntity, FightRoundsEntity, FightCampEntity, CampInfoEntity } from '../../game-data/entity/fight.entity';
import { HeroEntity, HerosRecord } from '../../game-data/entity/hero.entity';
import { TableGameLevels } from '../../config/gameTable/TableGameLevels';
import { RoleInfoEntity, RoleSubInfoEntity } from '../../game-data/entity/roleinfo.entity';
import { DemonAbyssDailyAwardsMsg, DemonAbyssDailyBuyItemMsg, DemonAbyssFightMsg, DemonAbyssGetAwardsMsg, RESAbyssDragonMsg, RESADDamageAwardMsg, RESAllRankShowMsg, RESArenaFightDataMsg, RESFightCommonInfo, RESFightData2Msg, RESFightDataMsg, RESGetADRankMsg, RESRankShowMsg, RESRoleInfoShowMsg, RESSweepMsg } from '../../game-data/entity/msg.entity';
import { syshero } from '../hero/hero-lvup';
import { Logger } from '../../game-lib/log4js';
import { languageConfig } from '../../config/language/language';
import { cGameCommon, RetRoleALLInfo } from '../game-common';
import { DropDataEntity } from '../../game-data/entity/drop.entity';
import { RoleAddExp } from '../../game-data/entity/common.entity';
import { TableGameSys } from '../../config/gameTable/TableGameSys';
import { ArenaLogEntity, RoleCommonEntity, ServerArenaRankRecord, ArenaFightInfo, RoleShowInfoEntity } from '../../game-data/entity/arena.entity';
import { TableGameItem } from '../../config/gameTable/TableGameItem';
import { cItemBag } from '../item/item-bag';
import { TableGameLevelSweep } from '../../config/gameTable/TableGameLevelSweep';
import { ItemsRecord } from '../../game-data/entity/item.entity';
import { cTools } from '../../game-lib/tools';
import { cpHero } from '../hero/hero-cpattr';
import { TableAbyssDragonDamageAward } from '../../config/gameTable/TableAbyssDragonDamageAward';
import { clone, cloneDeep } from 'lodash';
import { TableDemonAbyssAchieveAward } from '../../config/gameTable/TableDemonAbyssAchieveAward';
import { gameConst } from '../../config/game-const';
import { cTaskSystem } from '../task/task-sytem';
import { TableTask } from '../../config/gameTable/TableTask';


@Injectable()
export class FightService {

   constructor(
      private readonly gameDataService: GameDataService,
   ) {

   }

   /**
    * 获取玩家出战队伍信息
    */
   async getPlayerTeamInfo(fight_type: EFightType, heroList: HerosRecord, roleInfo: RoleInfoEntity, fightObjs_speed: FightObjEntity[], fightObjs_pos: FightObjEntity[], fightPos: number, retMsg: RESFightCommonInfo) {

      /** 上阵人数限制 */
      const fightTeam_maxNum = TableGameConfig.val_fightNum;

      //获取上阵英雄
      let roleSubInfo: RoleSubInfoEntity = <RoleSubInfoEntity>(roleInfo.info);
      let fightTeam = roleSubInfo.fteam;

      //新战斗
      if (fight_type === EFightType.GANME_LEVELS2
         || fight_type === EFightType.ARENA2
         || fight_type === EFightType.ARENA_KF2
      ) {
         fightTeam = cFightSystem.getFightTeam(roleInfo.info.fightGroup, heroList);
      }

      if (!fightTeam || fightTeam.length <= 0) {
         retMsg.msg = "无出战英雄";
         return false;
      }

      if (Object.keys(fightTeam).length > fightTeam_maxNum) {
         retMsg.msg = "出战英雄超过上限 当前上限:" + fightTeam_maxNum;
         return false;
      }



      // console.log('fightObjs_pos >',fightObjs_pos)
      // console.log('fightTeam >',fightTeam)

      /** 玩家出战队伍数据 */
      let msg = await getOurFightData(fight_type, fightObjs_speed, fightObjs_pos, fightTeam, heroList, fightPos, roleInfo);

      // console.log('fightObjs_pos >>',fightObjs_pos)
      // console.log('fightTeam >>',fightTeam)
      if (msg !== "ok") {
         retMsg.msg = msg ? msg : "player team data is error";
         return false;
      }

      if (Object.keys(fightObjs_pos).length <= 0) {
         retMsg.msg = "player team hero is null";
         return false;
      }

      return true;
   }

   async goFight(fight_type: EFightType, roleKeyDto: RoleKeyDto, roleInfo: RoleInfoEntity, fightReqEntity: FightReqEntity, heroList: HerosRecord, retMsg: RESFightCommonInfo) {

      /** 初始化战斗数据 */
      //按速度排序的数组
      let fightObjs_speed: FightObjEntity[] = new Array(TableGameConfig.val_fightNum * 2)
      //按POS为索引的数据对象 
      let fightObjs_pos: FightObjEntity[] = [];
      let is_ok = false;
      //初始化我们出战英雄数据
      if (fight_type == EFightType.WRESTLE) {//角斗
         is_ok = await getOurPKFightData(heroList, roleInfo, fightObjs_speed, fightObjs_pos, retMsg, fightReqEntity);
      } else {
         is_ok = await this.getPlayerTeamInfo(fight_type, heroList, roleInfo, fightObjs_speed, fightObjs_pos, fightReqEntity.pos, retMsg);
      }

      if (!is_ok) { return false; }
      let ourcqskill = 0;
      let enmeycqskill = 0;
      if (retMsg.cqresult) {
         if (retMsg.cqresult?.win == EFightResults.WIN) {
            ourcqskill = retMsg.cqresult?.skill;
         }
         else if (retMsg.cqresult?.win == EFightResults.LOST) {
            enmeycqskill = ourcqskill = retMsg.cqresult?.skill;
         }
      }
      let campdata: FightCampEntity = {};
      campdata.our = new CampInfoEntity();
      initPlayerCampInfo(roleInfo, campdata.our, fightObjs_speed, fightObjs_pos, fight_type, ourcqskill);
      campdata.enemy = new CampInfoEntity()

      if (fight_type == EFightType.ARENA || fight_type == EFightType.ARENA_KF) {
         //竞技场
         let msg = '';
         if (fightReqEntity.id && fightReqEntity.id > gameConst.robot_max_id) {
            if (fight_type == EFightType.ARENA) {
               let SveRank = await this.gameDataService.getSeverArenaRank(roleKeyDto.serverid);
               if (SveRank) {
                  msg = await getArenaPlayerFightData(fightReqEntity.id, SveRank, fightObjs_speed, fightObjs_pos, enmeycqskill);
                  initEnemyCampInfo(campdata.enemy, SveRank[fightReqEntity.id], fightObjs_speed, fightObjs_pos);
               }
            } else {
               let RankData = await this.gameDataService.getServerRankByType(fightReqEntity.levels, EGameRankType.CROSS_ARENA,);
               if (!RankData) { return false }
               let strid = String(fightReqEntity.id)
               await this.gameDataService.setRankInfo(RankData[strid].serverid, strid, RankData, false)
               let roleShowInfoEntity: RoleShowInfoEntity = RankData[strid]?.info
               if (roleShowInfoEntity) {
                  msg = await getArenaPlayerFightData2(roleShowInfoEntity, fightObjs_speed, fightObjs_pos, enmeycqskill);
                  initEnemyCampInfo(campdata.enemy, roleShowInfoEntity, fightObjs_speed, fightObjs_pos);
               }
            }

         } else {
            msg = await getArenaRobotFightData(fightReqEntity, fightObjs_speed, fightObjs_pos, fight_type, roleInfo, enmeycqskill);
         }
         if (msg !== "ok") {
            retMsg.msg = msg ? msg : 'ArenaServerInfo is null';
            return false;
         }
      }
      else if (fight_type == EFightType.WRESTLE) {
         //角斗PK
         is_ok = await getEnemyPKFightData(roleInfo, fightObjs_speed, fightObjs_pos, retMsg, fightReqEntity, campdata.enemy);
         if (!is_ok) {
            return false;
         }
      }
      else if (fight_type === EFightType.ARENA2 || fight_type === EFightType.ARENA_KF2) {
         if (fightReqEntity?.edata?.isHero) {
            if (!await getEnemyFightData(fight_type, fightObjs_speed, fightObjs_pos, fightReqEntity, roleInfo, retMsg)) {
               return false;
            }
         }
         else {
            if (await getArenaRobotFightData(fightReqEntity, fightObjs_speed, fightObjs_pos, fight_type, roleInfo, enmeycqskill) !== 'ok') {
               return false;
            }
         }
      }
      else {
         /** 关卡-怪物队伍属性数据 */
         let enemy_data: { data: any; msg: any; }
         enemy_data = await getGLMonterFightData(fight_type, fightReqEntity, fightObjs_speed, fightObjs_pos, roleInfo);
         if (enemy_data.data == null) {
            retMsg.msg = enemy_data.msg ? enemy_data.msg : `TableGameLevels data is error level:${fightReqEntity.levels} pos:${fightReqEntity.pos} `;
            return false;
         }
      }

      // console.log('fightObjs_pos >>>',fightObjs_pos)

      delete fightReqEntity.edata;

      //开始战斗
      //按速度排序
      //console.log("fightObjs_speed:",fightObjs_speed)
      fightObjs_speed.sort(function (a, b) {

         if (!a || !a.tAttr[TableGameAttr.atkspeed]) {
            return 1;
         }

         if (!b || !b.tAttr[TableGameAttr.atkspeed]) {
            return -1;
         }

         return b.tAttr[TableGameAttr.atkspeed] - a.tAttr[TableGameAttr.atkspeed];
      });

      if (process.env.FIGHT_LOG == "TRUE") {
         Logger.figtStart(roleKeyDto.id);
         Logger.fightlog(roleKeyDto.id, roleKeyDto, fightReqEntity);
         Logger.fightlog(roleKeyDto.id, "fightObjs_speed:", fightObjs_speed);
      }

      /** 最大回合数 */
      const max_fightRounds = TableGameConfig.val_maxRounds;
      //console.log("max_fightRounds:",max_fightRounds)

      /** 当前回合数 */
      let rounds = 0;
      /** 战斗结果 */
      let fight_results: number = EFightResults.DRAW;
      /** 战斗回合数据 */
      let fightRoundsEntityAry: FightRoundsEntity[] = [];

      //开始回合战斗
      for (rounds = 0; rounds <= max_fightRounds; rounds++) {

         if (fight_results != EFightResults.DRAW) { break; }

         /** 每回合行动队列 */
         let act_list: FightActEntity[] = [];
         /** 当前回合数据 */
         let cur_fightRounds: FightRoundsEntity = {
            rounds: rounds,
            acts: act_list,
         }

         fightRoundsEntityAry.push(cur_fightRounds)

         //战前回合
         if (rounds === 0) {
            if (process.env.FIGHT_LOG == "TRUE") {
               Logger.fightlog(roleKeyDto.id, "=====战前准备回合=====");
            }
            //只触发战前回合技能和BUFF
            for (let index = 0; index < fightObjs_speed.length; index++) {
               //console.log("index:",index)
               let actInfo: FightObjEntity = fightObjs_speed[index];
               if (!actInfo || !actInfo.id) { continue; }
               if (actInfo.tAttr[TableGameAttr.curhp] <= 0) { continue; }
               executeSkillAct(roleKeyDto.id, ESkillType.PASSIVE, actInfo, fightObjs_pos, act_list);
            }
            continue;
         }

         if (process.env.FIGHT_LOG == "TRUE") {
            Logger.fightlog(roleKeyDto.id, `=====第${rounds}回合开始=====`);
         }

         //每回合开始重新排序速度
         fightObjs_speed.sort(function (a, b) {

            if (!a || !a.tAttr[TableGameAttr.atkspeed]) {
               return 1;
            }

            if (!b || !b.tAttr[TableGameAttr.atkspeed]) {
               return -1;
            }

            return b.tAttr[TableGameAttr.atkspeed] - a.tAttr[TableGameAttr.atkspeed];
         });

         //回合前计算效果
         //计算BUFF效果
         executeAllBuff(roleKeyDto.id, EBuffTrigger.RSTART, fightObjs_speed, act_list);
         fight_results = cpFightResults(fightObjs_pos);
         if (fight_results != EFightResults.DRAW) { break; }

         //回合中 战斗单位开始行动 技能和普通攻击
         for (let index = 0; index < fightObjs_speed.length; index++) {

            let actInfo: FightObjEntity = fightObjs_speed[index];
            if (!actInfo || !actInfo.id) { continue; }

            if (actInfo.tAttr[TableGameAttr.curhp] <= 0) { continue; }

            //console.log(`${index}号位 ${actInfo.data['name']} 行动`)
            //行动开始
            executeBuff(roleKeyDto.id, EBuffTrigger.ACTSTART, actInfo, act_list);
            fight_results = cpFightResults(fightObjs_pos);
            if (fight_results != EFightResults.DRAW) {
               break;
            }

            //是否能行动
            if (checkFightState(EFightState.NO_ACT, actInfo)) {
               if (process.env.FIGHT_LOG == "TRUE") {
                  Logger.fightlog(roleKeyDto.id, `[${actInfo.data['name']}(${actInfo.pos})] 由于负面状态 无法行动`);
               }
               continue;
            }

            if (checkFightState(EFightState.CONFUSION, actInfo)) {
               if (process.env.FIGHT_LOG == "TRUE") {
                  Logger.fightlog(roleKeyDto.id, `[${actInfo.data['name']}(${actInfo.pos})] 由于混乱状态 开始进行无差别攻击`);
               }
            }

            //主动技能
            executeSkillAct(roleKeyDto.id, ESkillType.ACTIVE, actInfo, fightObjs_pos, act_list);
            fight_results = cpFightResults(fightObjs_pos);
            if (fight_results != EFightResults.DRAW) {
               break;
            }

            //普通攻击
            executeAtkAct(roleKeyDto.id, actInfo, fightObjs_pos, act_list);
            fight_results = cpFightResults(fightObjs_pos);
            if (fight_results != EFightResults.DRAW) {
               break;
            }

            //是否触发连击
            executeDoubleAtkAct(roleKeyDto.id, actInfo, fightObjs_pos, act_list);
            fight_results = cpFightResults(fightObjs_pos);
            if (fight_results != EFightResults.DRAW) {
               break;
            }

            //行动结束
            executeBuff(roleKeyDto.id, EBuffTrigger.ACTEND, actInfo, act_list);
            fight_results = cpFightResults(fightObjs_pos);
            if (fight_results != EFightResults.DRAW) {
               break;
            }

         }

         //回合后计算效果
         //计算BUFF效果
         //回合结束
         executeAllBuff(roleKeyDto.id, EBuffTrigger.REND, fightObjs_speed, act_list);
         if (process.env.FIGHT_LOG == "TRUE") {
            Logger.fightlog(roleKeyDto.id, `=====第${rounds}回合结束=====`);
         }

         fight_results = cpFightResults(fightObjs_pos);
         if (fight_results != EFightResults.DRAW) { break; }

         if (rounds >= max_fightRounds) { break; }
      }


      //战斗结束
      if (process.env.FIGHT_LOG == "TRUE") {
         Logger.fightlog(roleKeyDto.id, `第${rounds}回合 战斗结束`)
         Logger.fightlog(roleKeyDto.id, `,战斗结果：`, fight_results);
         if (fight_results === EFightResults.WIN) {
            Logger.fightlog(roleKeyDto.id, `战斗胜利`);
         } else if (fight_results === EFightResults.LOST) {
            Logger.fightlog(roleKeyDto.id, `战斗失败`);
         } else if (fight_results === EFightResults.DRAW) {
            Logger.fightlog(roleKeyDto.id, `平局`);
         }
         Logger.fightEnd(roleKeyDto.id);
      }

      //回复消息结构
      let obj_info: FightObjEntity[] = [];
      for (let index = 0; index < fightObjs_speed.length; index++) {
         let curInfo = fightObjs_speed[index]
         if (curInfo && curInfo.id) {
            obj_info[index] = {
               id: curInfo.id,
               pos: curInfo.pos,
               fightCamp: curInfo.fightCamp,
               objType: curInfo.objType,
               skill: curInfo.skill,
               tAttr: curInfo.tAttr,
               fashion: curInfo.fashion,
            }

            //英雄血量处理  关卡战斗要记录血量
            if (curInfo.objType === EObjtype.HERO &&
               (fight_type === EFightType.GANME_LEVELS
                  || fight_type === EFightType.WRESTLE
                  || fight_type === EFightType.Demon_ABYSS
                  || fight_type === EFightType.GANME_LEVELS2)
            ) {
               let fight_over_hp = obj_info[index].tAttr[TableGameAttr.curhp];
               obj_info[index].tAttr[TableGameAttr.curhp] = heroList[curInfo.id].curHP;
               heroList[curInfo.id].curHP = fight_over_hp;
            }
            else if (curInfo.objType === EObjtype.MONSTER && fight_type === EFightType.WRESTLE) {
               let data = roleInfo.info.wrestle.fight
               let fight_over_hp = obj_info[index].tAttr[TableGameAttr.curhp];
               obj_info[index].tAttr[TableGameAttr.curhp] = data.monhp[data.epos]
               data.monhp[data.epos] = fight_over_hp;
            }
            else if (curInfo.objType === EObjtype.MONSTER && fight_type === EFightType.GANME_LEVELS2 && fight_results !== EFightResults.WIN) {

               let fight_over_hp = clone(obj_info[index].tAttr[TableGameAttr.curhp]);
               //发给客户端初始生命
               obj_info[index].tAttr[TableGameAttr.curhp] = clone(roleInfo.info.fightMonsterHp[obj_info[index].pos]);
               //记录战后剩余生命
               roleInfo.info.fightMonsterHp[obj_info[index].pos] = fight_over_hp;
            }
            else if (fight_type === EFightType.ARENA2) {
               if (curInfo.objType === EObjtype.HERO) {
                  let fight_over_hp = clone(obj_info[index].tAttr[TableGameAttr.curhp]);
                  if (curInfo.fightCamp === EFightCamp.OUR) {
                     obj_info[index].tAttr[TableGameAttr.curhp] = heroList[curInfo.id].curHP;
                     heroList[curInfo.id].curHP = fight_over_hp;
                  }
                  else if (roleInfo.info.fightMonsterHp) {
                     obj_info[index].tAttr[TableGameAttr.curhp] = clone(roleInfo.info.fightMonsterHp[curInfo.id]);
                     roleInfo.info.fightMonsterHp[curInfo.id] = clone(fight_over_hp);
                  }
               }
               else {
                  let fight_over_hp = clone(obj_info[index].tAttr[TableGameAttr.curhp]);
                  obj_info[index].tAttr[TableGameAttr.curhp] = roleInfo.info.fightMonsterHp[curInfo.id] || 0
                  roleInfo.info.fightMonsterHp[curInfo.id] = fight_over_hp
               }
            }
            else {
               obj_info[index].tAttr[TableGameAttr.curhp] = obj_info[index].tAttr[TableGameAttr.hp]
            }

         }
      }

      roleInfo.info.lastFightType = fight_type;
      retMsg.results = fight_results
      retMsg.objInfo = obj_info
      retMsg.rounds = fightRoundsEntityAry
      retMsg.campdata = campdata
      return true;
   }

   /**
    * 关卡战斗
    * @param req 
    * @param glFightDto 
    * @returns 
    */
   async gamelevels(@Request() req: any, glFightDto: GameLevelsFightDto) {

      let roleKeyDto: RoleKeyDto = { id: req.user.id, serverid: req.user.serverid };
      let retMsg: RESFightDataMsg = new RESFightDataMsg();

      let getRoleALLInfoDto = new GetRoleALLInfoDto(roleKeyDto);
      getRoleALLInfoDto.need_roleInfo = true;
      getRoleALLInfoDto.need_roleHero = true;
      //获取角色信息
      let retRoleALLInfo: RetRoleALLInfo = await this.gameDataService.getRoleAllInfo(getRoleALLInfoDto);
      if (!retRoleALLInfo.isHaveData()) {
         retMsg.msg = retRoleALLInfo.getRetMsg();
         return retMsg;
      }

      let roleInfo: RoleInfoEntity = retRoleALLInfo.roleInfo;
      if (roleInfo.gamelevels === 0) {
         if (glFightDto.gamelevels !== TableGameConfig.init_gamelevels) {
            retMsg.msg = "无效的关卡";
            return retMsg;
         }
      }

      if (!TableGameLevels.checkHave(glFightDto.gamelevels)) {
         retMsg.msg = "无效的关卡";
         return retMsg;
      }
      const gameLevels_table = new TableGameLevels(glFightDto.gamelevels);

      if (glFightDto.gamelevels <= roleInfo.gamelevels) {
         retMsg.msg = "不能挑战已通过的关卡";
         return retMsg;
      }

      if (roleInfo.gamelevels !== 0) {
         if (!TableGameLevels.checkHave(roleInfo.gamelevels)) {
            retMsg.msg = "关卡数据错误";
            return retMsg;
         }
         const last_gameLevels_table = new TableGameLevels(roleInfo.gamelevels);
         if (glFightDto.gamelevels > last_gameLevels_table.nextid) {
            retMsg.msg = "该关卡未解锁";
            return retMsg;
         }
      }

      if (glFightDto.pos != 0) {
         if (!roleInfo?.glpos || glFightDto.pos != roleInfo.glpos) {
            retMsg.msg = "无效的战斗节点";
            return retMsg;
         }
      }

      if (retRoleALLInfo.roleSubInfo.lastFightType != undefined) {
         //切换战斗模式后必须从0节点开始打
         if (retRoleALLInfo.roleSubInfo.lastFightType != EFightType.GANME_LEVELS && glFightDto.pos != 0) {
            retMsg.msg = "非法的战斗节点请求";
            return retMsg;
         }
      }

      if ((gameLevels_table.need_grade ?? 0) > 0) {
         if ((roleInfo.info.upgrade ?? 0) < gameLevels_table.need_grade) {
            let cur_sys_table = new TableGameSys(TableGameSys.upgrade);
            let sys_name = cur_sys_table?.name || '进阶';
            retMsg.msg = sys_name + "不满足";
            return retMsg;
         }
      }


      //进行战斗
      let isok = await this.goFight(EFightType.GANME_LEVELS, roleKeyDto, roleInfo, { levels: glFightDto.gamelevels, pos: glFightDto.pos }, retRoleALLInfo.roleHero, retMsg);

      if (!isok) {
         return retMsg;
      }

      //胜负处理
      let new_pos = glFightDto.pos;
      let roleAddExp: RoleAddExp;

      if (retMsg.results === EFightResults.WIN) {

         const monster_team: number[][] = gameLevels_table.monster
         //console.log("monster_team:",monster_team)

         const max_pos = monster_team.length;
         new_pos += 1;
         if (new_pos + 1 > max_pos) {
            //下一关
            roleAddExp = syshero.leadheroAddExp(retRoleALLInfo, retRoleALLInfo.roleHero, gameLevels_table.exp);
            retRoleALLInfo.roleInfo.gamelevels = glFightDto.gamelevels;
            new_pos = 0;
            //掉落处理
            // let drop_data: DropDataEntity = await this.gameLevelsDrop(roleKeyDto, glFightDto.gamelevels);
            let cfg = new TableGameLevels(glFightDto.gamelevels)
            let drops: number[] = cfg.drop
            let drops2: number[] = cfg.drop2
            if (drops) {
               if (drops2.length > 0) {
                  drops = drops.concat(drops2)
               }
               let drop_data: DropDataEntity = await cGameCommon.addItemByDrop(roleKeyDto, drops, this.gameDataService);
               cGameCommon.hanleDropMsg(drop_data, retMsg);
            }
            await this.gameDataService.changeServerRankByType(retRoleALLInfo, EGameRankType.LEVEL, glFightDto.gamelevels);
         }

      }
      else {
         new_pos = 0;
      }
      //console.log("bbbb heroList:",heroList);

      retMsg.roleAddExp = roleAddExp;

      //保存到内存
      retRoleALLInfo.roleInfo.glpos = new_pos;
      await this.gameDataService.updateRoleInfo(roleKeyDto, retRoleALLInfo.roleInfo);
      await this.gameDataService.updateRoleHero(roleKeyDto, retRoleALLInfo.roleHero);

      retMsg.newpos = new_pos;
      retMsg.ok = true;
      retMsg.srctype = EActType.FIGHT_GAMELEVELS;
      retMsg.msg = languageConfig.actTypeSuccess(retMsg.srctype);
      return retMsg;
   }


   /**
    * 关卡战斗2 出战英雄一个一个的出阵
    * @param req 
    * @param glFightDto 
    * @returns 
    */
   async gamelevels2(@Request() req: any, glFightDto: GameLevelsFight2Dto) {

      let roleKeyDto: RoleKeyDto = { id: req.user.id, serverid: req.user.serverid };
      let retMsg: RESFightData2Msg = new RESFightData2Msg();

      let getRoleALLInfoDto = new GetRoleALLInfoDto(roleKeyDto);
      getRoleALLInfoDto.need_roleInfo = true;
      getRoleALLInfoDto.need_roleHero = true;
      //获取角色信息
      let retRoleALLInfo: RetRoleALLInfo = await this.gameDataService.getRoleAllInfo(getRoleALLInfoDto);
      if (!retRoleALLInfo.isHaveData()) {
         retMsg.msg = retRoleALLInfo.getRetMsg();
         return retMsg;
      }

      let roleInfo: RoleInfoEntity = retRoleALLInfo.roleInfo;
      if (roleInfo.gamelevels === 0) {
         if (glFightDto.gamelevels !== TableGameConfig.init_gamelevels) {
            retMsg.msg = "无效的关卡";
            return retMsg;
         }
      }

      if (!TableGameLevels.checkHave(glFightDto.gamelevels)) {
         retMsg.msg = "无效的关卡";
         return retMsg;
      }
      const gameLevels_table = new TableGameLevels(glFightDto.gamelevels);

      if (glFightDto.gamelevels <= roleInfo.gamelevels) {
         retMsg.msg = "不能挑战已通过的关卡";
         return retMsg;
      }

      if (roleInfo.gamelevels !== 0) {
         if (!TableGameLevels.checkHave(roleInfo.gamelevels)) {
            retMsg.msg = "关卡数据错误";
            return retMsg;
         }
         const last_gameLevels_table = new TableGameLevels(roleInfo.gamelevels);
         if (glFightDto.gamelevels > last_gameLevels_table.nextid) {
            retMsg.msg = "该关卡未解锁";
            return retMsg;
         }
      }

      let fight_hero_list: number[] = [];
      for (let index = 0; index < glFightDto.fightGroup.length; index++) {
         const hero_group = glFightDto.fightGroup[index];
         let is_have = cFightSystem.isHaveHeroByGroup(hero_group, retRoleALLInfo.roleHero, fight_hero_list);
         if (!is_have) {
            retMsg.msg = `英雄类型${hero_group}不存在`;
            return retMsg;
         }
      }

      if ((gameLevels_table.need_grade ?? 0) > 0) {
         if ((roleInfo.info.upgrade ?? 0) < gameLevels_table.need_grade) {
            let cur_sys_table = new TableGameSys(TableGameSys.upgrade);
            let sys_name = cur_sys_table?.name || '进阶';
            retMsg.msg = sys_name + "不满足";
            return retMsg;
         }
      }


      /**循环战斗是否结束 */
      let is_over = false;
      /**战斗循环次数 */
      let count = 0;
      /**关卡战斗怪物配置 */
      const monster_team: number[][] = gameLevels_table.monster
      /**关卡节点最大数 */
      const max_pos = monster_team.length;
      /**战斗可能发生的最多循环次数 */
      const max_count = monster_team.length + glFightDto.fightGroup.length;
      /**当前关卡节点 */
      let new_pos = 0;

      retMsg.allfights = [];
      retMsg.isPass = false;
      roleInfo.info.fightGroup = glFightDto.fightGroup;

      //初始化英雄血量
      cFightSystem.initFightHeroHP(retRoleALLInfo.roleHero, retRoleALLInfo.roleInfo);
      //初始化怪物血量
      retRoleALLInfo.roleInfo.info.fightMonsterHp = {};

      while (!is_over) {

         let cur_resFightCommonInfo = new RESFightCommonInfo();
         cur_resFightCommonInfo.glPos = new_pos;
         //进行战斗
         let isok = await this.goFight(EFightType.GANME_LEVELS2, roleKeyDto, roleInfo, { levels: glFightDto.gamelevels, pos: new_pos }, retRoleALLInfo.roleHero, cur_resFightCommonInfo);

         //战斗是否发生异常
         if (!isok) {
            delete retMsg.allfights;
            retMsg.msg = clone(cur_resFightCommonInfo.msg);
            delete cur_resFightCommonInfo.msg;
            delete cur_resFightCommonInfo.ok;
            return retMsg;
         }

         delete cur_resFightCommonInfo.msg;
         delete cur_resFightCommonInfo.ok;
         retMsg.allfights.push(cur_resFightCommonInfo);

         //单个战斗小局胜负处理
         if (cur_resFightCommonInfo.results === EFightResults.WIN) {
            new_pos++;
            //初始化怪物血量
            retRoleALLInfo.roleInfo.info.fightMonsterHp = {};
            //是否已通关 
            if (new_pos >= max_pos) {
               //胜利
               retMsg.isPass = true;
               is_over = true;
               break;
            }
         }
         else {

            //如果打平 设置英雄为战死
            if (cur_resFightCommonInfo.results === EFightResults.DRAW) {
               //当前出战英雄血量重置为死亡
               let cur_heroid = fight_hero_list.shift();
               if (cur_heroid && retRoleALLInfo.roleHero[cur_heroid]) {
                  retRoleALLInfo.roleHero[cur_heroid].curHP = 0;
               }
            }
            //是否失败
            if (cFightSystem.isAllOver(glFightDto.fightGroup, retRoleALLInfo.roleHero)) {
               is_over = true;
               retMsg.isPass = false;
               break;
            }
         }

         //异常处理
         count++;
         if (count > max_count) {
            is_over = true;
            retMsg.msg = "战斗过长异常";
            return retMsg;
         }
      }



      //胜负处理
      let roleAddExp: RoleAddExp;
      if (retMsg.isPass) {
         //下一关
         roleAddExp = syshero.leadheroAddExp(retRoleALLInfo, retRoleALLInfo.roleHero, gameLevels_table.exp);
         retRoleALLInfo.roleInfo.gamelevels = glFightDto.gamelevels;
         //掉落处理
         let drop_data: DropDataEntity = await this.gameLevelsDrop(roleKeyDto, glFightDto.gamelevels);
         cGameCommon.hanleDropMsg(drop_data, retMsg);
         await this.gameDataService.changeServerRankByType(retRoleALLInfo, EGameRankType.LEVEL, glFightDto.gamelevels);
      }

      retMsg.roleAddExp = roleAddExp;
      //保存到内存
      //retRoleALLInfo.roleInfo.glpos = new_pos;
      delete retRoleALLInfo.roleInfo.info.fightGroup;
      delete retRoleALLInfo.roleInfo.info.fightMonsterHp;
      await this.gameDataService.updateRoleInfo(roleKeyDto, retRoleALLInfo.roleInfo);
      await this.gameDataService.updateRoleHero(roleKeyDto, retRoleALLInfo.roleHero);


      languageConfig.setActTypeSuccess(EActType.FIGHT_GAMELEVELS, retMsg);
      return retMsg;
   }

   async elitefight(@Request() req: any, eliteFightDto: EliteFightDto) {

      let roleKeyDto: RoleKeyDto = { id: req.user.id, serverid: req.user.serverid };

      let retMsg: RESFightDataMsg = new RESFightDataMsg();

      let getRoleALLInfoDto = new GetRoleALLInfoDto(roleKeyDto);
      getRoleALLInfoDto.need_roleInfo = true;
      getRoleALLInfoDto.need_roleHero = true;

      //获取角色信息
      let retRoleALLInfo: RetRoleALLInfo = await this.gameDataService.getRoleAllInfo(getRoleALLInfoDto);
      if (!retRoleALLInfo.isHaveData()) {
         retMsg.msg = retRoleALLInfo.getRetMsg();
         return retMsg;
      }

      let roleInfo: RoleInfoEntity = retRoleALLInfo.roleInfo;

      if (!cGameCommon.isOpenSystem(retRoleALLInfo, TableGameSys.elitelevels)) {
         retMsg.msg = "系统暂未开放";
         return retMsg;
      }

      if (roleInfo.info.elitelevels === 0) {
         if (eliteFightDto.elitelevels !== TableGameConfig.init_elitelevels) {
            retMsg.msg = "无效的精英关卡";
            return retMsg;
         }
      }

      if (!TableGameLevels.checkHave(eliteFightDto.elitelevels)) {
         retMsg.msg = "无效的精英关卡";
         return retMsg;
      }
      const elitelevels_table = new TableGameLevels(eliteFightDto.elitelevels);

      if (eliteFightDto.elitelevels <= roleInfo.info.elitelevels) {
         retMsg.msg = "不能挑战已通过的精英关卡";
         return retMsg;
      }

      if (roleInfo.info.elitelevels !== 0) {
         if (!TableGameLevels.checkHave(roleInfo.info.elitelevels)) {
            retMsg.msg = "精英关卡数据错误";
            return retMsg;
         }
         //获取战斗关卡
         const last_elitelevels_table = new TableGameLevels(roleInfo.info.elitelevels);
         if (last_elitelevels_table.nextid === 0) {
            retMsg.msg = "该精英关卡暂未开放";
            return retMsg;
         }

         if (eliteFightDto.elitelevels > last_elitelevels_table.nextid) {
            retMsg.msg = "该精英关卡未解锁";
            return retMsg;
         }
      }

      if ((elitelevels_table.need_grade ?? 0) > 0) {
         if ((roleInfo.info.upgrade ?? 0) < elitelevels_table.need_grade) {
            let cur_sys_table = new TableGameSys(TableGameSys.upgrade);
            let sys_name = cur_sys_table?.name || '进阶';
            retMsg.msg = sys_name + "不满足";
            return retMsg;
         }
      }

      //进行战斗
      await this.goFight(EFightType.ELITE, roleKeyDto, roleInfo, { levels: eliteFightDto.elitelevels, pos: 0 }, retRoleALLInfo.roleHero, retMsg);
      //胜负处理
      let roleAddExp: RoleAddExp;
      if (retMsg.results === EFightResults.WIN) {

         //下一关
         retRoleALLInfo.roleInfo.info.elitelevels = eliteFightDto.elitelevels;
         //新的关卡 加经验
         roleAddExp = syshero.leadheroAddExp(retRoleALLInfo, retRoleALLInfo.roleHero, elitelevels_table.exp);
         //掉落处理
         let drop_data: DropDataEntity = await this.gameLevelsDrop(roleKeyDto, eliteFightDto.elitelevels);
         cGameCommon.hanleDropMsg(drop_data, retMsg);
         if (eliteFightDto.elitelevels >= TableGameConfig.el_rank_open) {
            await this.gameDataService.changeServerRankByType(retRoleALLInfo, EGameRankType.ELITE, eliteFightDto.elitelevels);
         }
      }

      retMsg.roleAddExp = roleAddExp;
      //保存到内存
      await this.gameDataService.updateRoleInfo(roleKeyDto, retRoleALLInfo.roleInfo);
      await this.gameDataService.updateRoleHero(roleKeyDto, retRoleALLInfo.roleHero);

      retMsg.ok = true;
      retMsg.srctype = EActType.FIGHT_ELITE_LEVELS;
      retMsg.msg = languageConfig.actTypeSuccess(retMsg.srctype);
      return retMsg;

   }

   async gameLevelsDrop(roleKeyDto: RoleKeyDto, gamelevels: number) {

      let drops: number[] = TableGameLevels.getVal(gamelevels, TableGameLevels.field_drop);
      if (!drops) { return; }
      return cGameCommon.addItemByDrop(roleKeyDto, drops, this.gameDataService);
   }

   async arenafight(@Request() req: any, arenaFightDto: ArenaFightDto) {
      const userid = Number(arenaFightDto.id)
      let usertype = (userid < gameConst.robot_max_id) ? EObjtype.ROBOT : EObjtype.HERO
      let roleKeyDto: RoleKeyDto = { id: req.user.id, serverid: req.user.serverid };

      let retMsg: RESArenaFightDataMsg = { ok: false };
      //是否在有效时间内
      if (!cTools.checkSystemActTime(TableGameSys.arena)) {
         retMsg.msg = languageConfig.tip.errortime_system;
         return retMsg;
      }
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
      // let serverInfo = retRoleALLInfo.serverInfo   //全服信息
      let roleInfo = retRoleALLInfo.roleInfo       //角色信息
      let roleItem = retRoleALLInfo.roleItem       //道具信息
      let roleHero = retRoleALLInfo.roleHero       //英雄信息
      //全服排行
      let arenaRank = await this.gameDataService.getSeverArenaRank(req.user.serverid) || {}

      let arenainfo = roleInfo.info.arenaInfo
      if (!cGameCommon.isOpenSystem(retRoleALLInfo, TableGameSys.arena)) {
         retMsg.msg = languageConfig.tip.not_open_system;
         return retMsg;
      }
      let nowar = false;
      for (const key in arenainfo.nowar) {
         if (Object.prototype.hasOwnProperty.call(arenainfo.nowar, key)) {
            const time = arenainfo.nowar[key];
            let cur_t = new Date().getTime();
            if (cur_t > time + (TableGameConfig.arena_nowar_cd * 1000)) {
               // arenainfo.nowar.splice(Number(key),1);
               delete arenainfo.nowar[key]
            } else {
               if (Number(key) == userid) {
                  nowar = true
               }
            }
         }
      }
      //积分
      let foePoint = Number(userid)
      if (usertype == EObjtype.HERO) {
         if (nowar) {
            retMsg.msg = languageConfig.tip.nowar_cd;
            return retMsg;
         }
         foePoint = arenaRank[userid]?.p || 1000;
      }

      if (arenainfo.challenge > 0) {
         //是否有免费次数
         arenainfo.challenge--;
      } else {
         //消耗道具
         const costitem = TableGameConfig.arena_challenge_cost
         retMsg.decitem = {};
         for (const key in costitem) {
            if (Object.prototype.hasOwnProperty.call(costitem, key)) {
               const itemid = Number(key)
               const itemid_num = costitem[key];
               if (!roleItem[itemid] || roleItem[itemid] < itemid_num) {
                  retMsg.msg = `[${TableGameItem.getVal(itemid, TableGameItem.field_name)}]不足`;
                  delete retMsg.decitem;
                  return retMsg;
               }
               cItemBag.decitem(roleItem, retMsg.decitem, itemid, itemid_num);
            }
         }

      }

      let fightReqEntity: FightReqEntity = {
         pos: 0, levels: 0,
         id: (userid),
      }
      //进行战斗
      let isok = await this.goFight(EFightType.ARENA, roleKeyDto, roleInfo, fightReqEntity, roleHero, retMsg);
      if (!isok) {
         return retMsg;
      }
      let point = Math.floor((foePoint - arenainfo.point) / 50);
      const basepoint = TableGameConfig.arena_base;
      //胜负处理
      // let roleAddExp: RoleAddExp;
      let cur_point = 0
      let wincount = 0
      if (retMsg.results === EFightResults.WIN) {
         cur_point += basepoint + point;
         arenainfo.show = [];
         //加道具
         const getitem = TableGameConfig.arena_challenge_getitem
         retMsg.additem = {};
         for (const key in getitem) {
            const itemid = Number(key)
            const item_num = getitem[key];
            cItemBag.addItem(roleItem, retMsg.additem, itemid, item_num);
         }
         if (usertype == EObjtype.HERO) {
            //免战
            if (arenainfo.nowar == undefined) {
               arenainfo.nowar = {};
            }
            arenainfo.nowar[userid] = new Date().getTime();
         }
         //佣兵激活条件
         let actinfo = retRoleALLInfo.roleSubInfo.mercenary?.actinfo
         if (actinfo && actinfo.an !== undefined) {
            actinfo.an++;
            wincount = actinfo.an
         }
      }
      else //if(retMsg.results === EFightResults.LOST)
      {
         cur_point -= basepoint + point;
      }
      if (arenaRank[req.user.id]) {
         arenainfo.point = arenaRank[req.user.id].p;
      }

      let arenaFightInfo: ArenaFightInfo = {
         wincount: wincount,
         /**自己的积分*/
         ourpoint: arenainfo.point,
         /**自己变化的积分*/
         ourchangepoint: cur_point,
         /**对方的积分*/
         foepoint: foePoint,
         /**对方变化的积分*/
         foechangepoint: -cur_point
      }
      retMsg.arenainfo = arenaFightInfo;

      arenainfo.point += cur_point
      if (usertype == EObjtype.HERO) {
         let roleCommonEntity: RoleCommonEntity = {
            n: roleInfo.info.name,
            lv: roleInfo.rolelevel,
            c: roleInfo.info.ico,
         }

         let arenaLogEntity: ArenaLogEntity = {
            // id?: number
            seasonid: retRoleALLInfo.serverInfo?.info?.arenaData?.season || arenainfo.season,
            serverid: roleKeyDto.serverid,
            roleid: String(userid),   //被攻击者
            atkid: roleKeyDto.id,    //攻击者 
            point: -cur_point,
            // time?: Date
            state: EArenaSatate.NORMAL,
            info: roleCommonEntity,//RoleCommonEntity | any
            // needsave?: boolean;
         }
         await this.gameDataService.sendRoleArenaLog(arenaLogEntity);
         let uroleKeyDto: any = { id: String(userid), serverid: roleKeyDto.serverid }

         let ugetRoleALLInfoDto = new GetRoleALLInfoDto(uroleKeyDto);
         ugetRoleALLInfoDto.need_roleInfo = true;
         ugetRoleALLInfoDto.need_roleHero = true;
         //获取被攻击角色信息
         let uretRoleALLInfo: RetRoleALLInfo = await this.gameDataService.getRoleAllInfo(ugetRoleALLInfoDto);
         let online = uretRoleALLInfo.isHaveData();
         await this.gameDataService.changeSAreanRank(uroleKeyDto, -cur_point, arenaRank, online ? uretRoleALLInfo : null);
      }
      function rank_sort(arenaRank: ServerArenaRankRecord) {
         // 将 rank 转换为数组并排序
         let sortedRank = Object.entries(arenaRank)
            .sort((a, b) => b[1].p - a[1].p)
            .reduce((obj, [key, value], index) => {
               value.r = index + 1;
               obj[key] = value;
               return obj;
            }, {} as ServerArenaRankRecord);
         // console.log('>>',sortedRank)
         return sortedRank;
      }

      //改变自己的排行
      await this.gameDataService.changeSAreanRank(roleKeyDto, cur_point, arenaRank, retRoleALLInfo);

      let aRankData = rank_sort(arenaRank);
      arenainfo.rank = aRankData[req.user.id].r;
      // retMsg.rank = aRankData;
      //保存全服排行榜
      await this.gameDataService.updateServerAreanRank(req.user.serverid, aRankData)
      await this.gameDataService.updateRoleInfo(roleKeyDto, roleInfo);
      await this.gameDataService.updateRoleHero(roleKeyDto, roleHero);
      await this.gameDataService.updateRoleItem(roleKeyDto, roleItem);

      languageConfig.setActTypeSuccess(EActType.ARENA_FIGHT, retMsg);
      return retMsg;

   }

   async elitesweep(@Request() req: any, eliteFightDto: EliteFightDto) {

      let roleKeyDto: RoleKeyDto = { id: req.user.id, serverid: req.user.serverid };

      let retMsg: RESSweepMsg = new RESSweepMsg();

      let getRoleALLInfoDto = new GetRoleALLInfoDto(roleKeyDto);
      getRoleALLInfoDto.need_roleInfo = true;
      getRoleALLInfoDto.need_roleItem = true;

      //获取角色信息
      let retRoleALLInfo: RetRoleALLInfo = await this.gameDataService.getRoleAllInfo(getRoleALLInfoDto);
      if (!retRoleALLInfo.isHaveData()) {
         retMsg.msg = retRoleALLInfo.getRetMsg();
         return retMsg;
      }

      let roleInfo: RoleInfoEntity = retRoleALLInfo.roleInfo;
      let roleItem: ItemsRecord = retRoleALLInfo.roleItem       //道具信息

      if (roleInfo.info.elitelevels != eliteFightDto.elitelevels) {
         retMsg.msg = "无效的精英关卡";
         return retMsg;
      }

      if (!TableGameLevelSweep.checkHave(eliteFightDto.elitelevels)) {
         retMsg.msg = "无效的精英关卡";
         return retMsg;
      }
      const Sweep_table = new TableGameLevelSweep(eliteFightDto.elitelevels);
      let count = roleInfo.info.reDayInfo.elitesweepcount;
      const csot = Sweep_table['costitem_' + count]
      if (count > 0) {
         if (!csot) {
            retMsg.msg = "无效的精英关卡扫荡";
            return retMsg;
         }
         else {
            retMsg.decitem = {};
            for (const key in csot) {
               if (Object.prototype.hasOwnProperty.call(csot, key)) {
                  const itemid = Number(key)
                  const itemid_num = csot[key];
                  if (!roleItem[itemid] || roleItem[itemid] < itemid_num) {
                     retMsg.msg = `[${TableGameItem.getVal(itemid, TableGameItem.field_name)}]不足`;
                     delete retMsg.decitem;
                     return retMsg;
                  }
                  cItemBag.decitem(roleItem, retMsg.decitem, itemid, itemid_num);
               }
            }
         }
      }
      await this.gameDataService.updateRoleItem(roleKeyDto, roleItem);
      //掉落处理
      let drop_data: DropDataEntity = await cGameCommon.addItemByDrop(roleKeyDto, Sweep_table.drop, this.gameDataService);
      if (!drop_data) { return; }
      cGameCommon.hanleDropMsg(drop_data, retMsg);
      retMsg.count = ++count;
      roleInfo.info.reDayInfo.elitesweepcount = count;
      //保存
      await this.gameDataService.updateRoleInfo(roleKeyDto, roleInfo);

      languageConfig.setActTypeSuccess(EActType.FIGHT_SWEEP, retMsg);
      return retMsg;

   }
   async allrank(@Request() req: any, dto: AllRankDto) {
      let retMsg: RESAllRankShowMsg = { ok: false, data: {} };
      let roleKeyDto: RoleKeyDto = { id: req.user.id, serverid: req.user.serverid };
      let getRoleALLInfoDto = new GetRoleALLInfoDto(roleKeyDto);
      getRoleALLInfoDto.need_roleInfo = true;

      //获取角色信息
      let retRoleALLInfo: RetRoleALLInfo = await this.gameDataService.getRoleAllInfo(getRoleALLInfoDto);
      if (!retRoleALLInfo.isHaveData()) {
         retMsg.msg = retRoleALLInfo.getRetMsg();
         return retMsg;
      }

      //--------------------------------------------
      for (let index = 0; index < dto.type.length; index++) {
         const type = dto.type[index];
         let ranklist = await this.gameDataService.getServerRankByType(roleKeyDto.serverid, type);
         for (const key in ranklist) {
            if (Object.prototype.hasOwnProperty.call(ranklist, key)) {
               const element = ranklist[key];
               if (element.info.r == 1) {
                  retMsg.data[type] = {
                     name: element.info.n,
                     ico: element.info.c,
                     fight: element.info.f
                  }
                  break;
               }
            }
         }
      }

      languageConfig.setActTypeSuccess(EActType.RANK_LIST, retMsg);
      return retMsg
   }

   async glrank(@Request() req: any, dto: RankDto) {
      let retMsg: RESRankShowMsg = { ok: false };
      // let retMsg: RESArenaShowMsg = new RESArenaShowMsg();
      let roleKeyDto: RoleKeyDto = { id: req.user.id, serverid: req.user.serverid };
      let getRoleALLInfoDto = new GetRoleALLInfoDto(roleKeyDto);
      getRoleALLInfoDto.need_roleInfo = true;

      //获取角色信息
      let retRoleALLInfo: RetRoleALLInfo = await this.gameDataService.getRoleAllInfo(getRoleALLInfoDto);
      if (!retRoleALLInfo.isHaveData()) {
         retMsg.msg = retRoleALLInfo.getRetMsg();
         return retMsg;
      }
      if (!cGameCommon.isOpenSystem(retRoleALLInfo, TableGameSys.gamelevels)) {
         retMsg.msg = languageConfig.tip.not_open_system    //"系统暂未开放";
         return retMsg;
      }

      //--------------------------------------------
      let ranktype = dto.type ? dto.type : EGameRankType.LEVEL
      let ranklist = await this.gameDataService.getServerRankByType(roleKeyDto.serverid, ranktype);
      let rankshowmax = this.gameDataService.getServerRankShowMax(ranktype);
      retMsg.ranklist = {};
      let count = 0;
      for (const key in ranklist) {
         if (Object.prototype.hasOwnProperty.call(ranklist, key)) {
            count++;
            if (count > rankshowmax) { break; }
            retMsg.ranklist[key] = ranklist[key];
         }
      }
      retMsg.val = ranklist[String(req.user.id)]?.val;
      retMsg.rank = ranklist[String(req.user.id)]?.info?.r;
      languageConfig.setActTypeSuccess(EActType.RANK_LIST, retMsg);
      return retMsg
   }

   async roleinfo(@Request() req: any, roleShowDto: RoleShowDto) {
      let retMsg: RESRoleInfoShowMsg = { ok: false };
      let serverid = roleShowDto.serverid || req.user.serverid
      let roleid = roleShowDto.id
      let infos: any;
      if (Number(roleid) < gameConst.robot_max_id) {
         infos = getRobotinfo(Number(roleid));
      }
      else {
         let SRinfo = await this.gameDataService.getSeverRoleInfo(serverid)
         infos = new RoleShowInfoEntity();
         if (SRinfo && SRinfo[roleid]) {
            infos = SRinfo[roleid];
            for (const key in infos.rh) {
               let roleSubInfo = new RoleSubInfoEntity;
               loadRoleInfo(roleSubInfo, infos);
               if (Object.prototype.hasOwnProperty.call(infos.rh, key)) {
                  let heroEntity = infos.rh[key];
                  heroEntity.id = Number(key);
                  cpHero.cpHeroAttr(heroEntity, roleSubInfo);
               }
            }

         }
      }
      retMsg.roleinfo = infos;
      languageConfig.setActTypeSuccess(EActType.ARENA_SHOW, retMsg);
      retMsg.msg = '角色界面展示';
      return retMsg
   }


   cpEmtyDamage(act_entity: FightActEntity, retMsg: RESAbyssDragonMsg) {

      if (!act_entity || !act_entity.tp || !act_entity.v || act_entity.v > 0) {
         return;
      }
      let obj = retMsg.objInfo.find(obj => { return obj.pos === act_entity.tp })
      if (obj.fightCamp !== EFightCamp.ENEMY) {
         return;
      }
      retMsg.damage += Math.abs(act_entity.v);
   }

   /**
    * 深渊巨龙
    * @param req 
    * @param abyssDragonFightDto 
    * @returns 
    */
   async abyssDragon(@Request() req: any, @Body() abyssDragonFightDto: AbyssDragonFightDto) {

      let roleKeyDto: RoleKeyDto = { id: req.user.id, serverid: req.user.serverid };
      let retMsg: RESAbyssDragonMsg = new RESAbyssDragonMsg();

      let getRoleALLInfoDto = new GetRoleALLInfoDto(roleKeyDto);
      getRoleALLInfoDto.need_roleInfo = true;
      getRoleALLInfoDto.need_roleHero = true;
      //获取角色信息
      let retRoleALLInfo: RetRoleALLInfo = await this.gameDataService.getRoleAllInfo(getRoleALLInfoDto);
      if (!retRoleALLInfo.isHaveData()) {
         retMsg.msg = retRoleALLInfo.getRetMsg();
         return retMsg;
      }

      //进行战斗
      let isok = await this.goFight(EFightType.ABYSS_DRAGON, roleKeyDto, retRoleALLInfo.roleInfo, { levels: TableGameConfig.abyss_dragon_levels, pos: 0 }, retRoleALLInfo.roleHero, retMsg);
      if (!isok) { return retMsg; }

      //计算总伤害
      retMsg.damage = 0;
      if (retMsg.rounds) {
         for (const key in retMsg.rounds) {
            if (Object.prototype.hasOwnProperty.call(retMsg.rounds, key)) {
               const fightRoundsEntity = retMsg.rounds[key];
               for (let index = 0; index < fightRoundsEntity.acts.length; index++) {
                  const fightActEntity = fightRoundsEntity.acts[index];
                  this.cpEmtyDamage(fightActEntity, retMsg);

                  if (!fightActEntity?.sub) { continue; }

                  for (let idx1 = 0; idx1 < fightActEntity.sub.length; idx1++) {
                     const sub1_fightActEntity = fightActEntity.sub[idx1];
                     this.cpEmtyDamage(sub1_fightActEntity, retMsg);

                     if (!sub1_fightActEntity?.sub) { continue; }
                     for (let idx2 = 0; idx2 < sub1_fightActEntity.sub.length; idx2++) {
                        const sub2_fightActEntity = sub1_fightActEntity.sub[idx2];
                        this.cpEmtyDamage(sub2_fightActEntity, retMsg);
                     }
                  }
               }
            }
         }
      }

      //最新记录
      if (retMsg.damage > retRoleALLInfo.roleSubInfo.reDayInfo.ad_damage) {
         retRoleALLInfo.roleSubInfo.reDayInfo.ad_damage = retMsg.damage;
         //佣兵激活条件
         let actinfo = retRoleALLInfo.roleSubInfo.mercenary?.actinfo
         if (actinfo && actinfo.dam < retMsg.damage) {
            actinfo.dam = retMsg.damage;
         }
         //保存到内存
         await this.gameDataService.updateRoleInfo(roleKeyDto, { info: retRoleALLInfo.roleSubInfo });
         //修改排行榜数据
         await this.gameDataService.changeServerRankByType(retRoleALLInfo, EGameRankType.ABYSS_DRAGON, retMsg.damage);
      }

      languageConfig.setActTypeSuccess(EActType.FIGHT_ABYSS_DRAGON, retMsg);
      return retMsg;
   }

   /**
    * 领取深渊巨龙伤害奖励
    * @param req 
    * @param adDamageAwardDto 
    */
   async adDamageAward(@Request() req: any, @Body() adDamageAwardDto: ADDamageAwardDto) {

      let roleKeyDto: RoleKeyDto = { id: req.user.id, serverid: req.user.serverid };
      let retMsg: RESADDamageAwardMsg = new RESADDamageAwardMsg();

      let getRoleALLInfoDto = new GetRoleALLInfoDto(roleKeyDto);
      getRoleALLInfoDto.need_roleInfo = true;

      //获取角色信息
      let retRoleALLInfo: RetRoleALLInfo = await this.gameDataService.getRoleAllInfo(getRoleALLInfoDto);
      if (!retRoleALLInfo.isHaveData()) {
         retMsg.msg = retRoleALLInfo.getRetMsg();
         return retMsg;
      }

      //系统是否开放
      if (!cGameCommon.isOpenSystem(retRoleALLInfo, TableGameSys.abyss_dragon)) {
         retMsg.msg = languageConfig.tip.not_open_system;
         return retMsg;
      }

      let table_data = TableAbyssDragonDamageAward.getTable();

      let drops = [];
      let totalDamage = retRoleALLInfo.roleSubInfo.reDayInfo.ad_damage || 0;
      for (const damageId in table_data) {
         if (Object.prototype.hasOwnProperty.call(table_data, damageId)) {
            const need_damage = Number(damageId)
            if (totalDamage < need_damage) { continue; }

            if (retRoleALLInfo.roleSubInfo.reDayInfo.ad_awardTag >= need_damage) {
               continue;
            }

            let cur_table_data = new TableAbyssDragonDamageAward(need_damage);
            drops = drops.concat(cur_table_data.drop1);
            retRoleALLInfo.roleSubInfo.reDayInfo.ad_awardTag = need_damage;
         }
      }

      if (drops.length === 0) {
         retMsg.msg = "没有奖励可领取";
         return retMsg;
      }

      //发放道具奖励
      let dropDataEntity = await cGameCommon.addItemByDrop(roleKeyDto, drops, this.gameDataService);
      cGameCommon.hanleDropMsg(dropDataEntity, retMsg);

      retMsg.ad_awardTag = retRoleALLInfo.roleSubInfo.reDayInfo.ad_awardTag;
      //保存数据
      await this.gameDataService.updateRoleInfo(roleKeyDto, { info: retRoleALLInfo.roleSubInfo });

      languageConfig.setActTypeSuccess(EActType.AD_DAMAGEAWARD, retMsg);
      return retMsg;

   }

   async getADRank(@Request() req: any, @Body() getADRankDto: GetADRankDto) {

      let roleKeyDto: RoleKeyDto = { id: req.user.id, serverid: req.user.serverid };
      let rank = await this.gameDataService.getServerRankByType(roleKeyDto.serverid, EGameRankType.ABYSS_DRAGON);
      let resGetADRankMsg = new RESGetADRankMsg();

      if (!rank) {
         resGetADRankMsg.msg = "rank data is null";
         return resGetADRankMsg;
      }

      let count = 0;
      resGetADRankMsg.rank = {};
      for (const key in rank) {
         if (Object.prototype.hasOwnProperty.call(rank, key)) {
            count++;
            if (count > TableGameConfig.abyss_dragon_rank_showmax) { break; }
            let cur_rank = rank[key];
            resGetADRankMsg.rank[cur_rank.roleid] = cur_rank;
         }
      }

      languageConfig.setActTypeSuccess(EActType.GET_ADRANK, resGetADRankMsg);
      return resGetADRankMsg;
   }

   /**
    * 魔渊挑战
    * @param req 
    * @param demonAbyssFightDto 
    * @returns 
    */
   async demonAbyssFight(@Request() req: any, @Body() demonAbyssFightDto: DemonAbyssFightDto) {

      let roleKeyDto: RoleKeyDto = { id: req.user.id, serverid: req.user.serverid };
      let retMsg: DemonAbyssFightMsg = new DemonAbyssFightMsg();

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

      if (!retRoleALLInfo.roleSubInfo.demonAbyss) {
         retMsg.msg = `魔渊系统数据异常`;
         return retMsg;
      }

      //系统是否开放
      if (!cGameCommon.isOpenSystem(retRoleALLInfo, TableGameSys.demon_abyss)) {
         retMsg.msg = languageConfig.tip.not_open_system;
         return retMsg;
      }


      let demonAbyssEntity = retRoleALLInfo.roleSubInfo.demonAbyss;

      //关卡ID确定
      let cur_levels = demonAbyssEntity.da_levels
      if (cur_levels == 0) {
         cur_levels = TableGameConfig.demon_abyss_init_levels;
      }

      if (!TableGameLevels.checkHave(cur_levels)) {
         retMsg.msg = `魔渊关卡${cur_levels}不存在`;
         return retMsg;
      }



      if (demonAbyssFightDto.da_pos != 0) {
         if (demonAbyssEntity.da_pos == undefined || demonAbyssFightDto.da_pos != demonAbyssEntity.da_pos) {
            retMsg.msg = "无效的战斗节点";
            return retMsg;
         }
      }

      if (retRoleALLInfo.roleSubInfo.lastFightType != undefined) {
         //切换战斗模式后必须从0节点开始打
         if (retRoleALLInfo.roleSubInfo.lastFightType != EFightType.Demon_ABYSS && demonAbyssFightDto.da_pos != 0) {
            retMsg.msg = "非法的战斗节点请求";
            return retMsg;
         }
      }

      //失败过需要扣去道具
      if (demonAbyssEntity.da_fight_lost && demonAbyssFightDto.da_pos == 0) {

         //道具是否足够
         if (TableGameConfig.demon_abyss_costitem && Object.keys(TableGameConfig.demon_abyss_costitem).length > 0) {
            cItemBag.costItem(retRoleALLInfo.roleItem, TableGameConfig.demon_abyss_costitem, retMsg);
         }

         if (!retMsg.ok) { return retMsg; }

         //保存已扣去的道具数量
         await this.gameDataService.updateRoleItem(roleKeyDto, retRoleALLInfo.roleItem);
      }




      //进行战斗
      let isok = await this.goFight(EFightType.Demon_ABYSS, roleKeyDto, retRoleALLInfo.roleInfo, { levels: cur_levels, pos: demonAbyssFightDto.da_pos }, retRoleALLInfo.roleHero, retMsg);

      if (!isok) {
         return retMsg;
      }

      let gameLevels_table = new TableGameLevels(cur_levels);

      //胜负处理
      let new_pos = demonAbyssFightDto.da_pos;
      let roleAddExp: RoleAddExp;
      if (retMsg.results === EFightResults.WIN) {

         const monster_team: number[][] = gameLevels_table.monster
         //console.log("monster_team:",monster_team)

         const max_pos = monster_team.length;
         new_pos += 1;
         if (new_pos + 1 > max_pos) {
            //下一关
            if (gameLevels_table.exp > 0) {
               roleAddExp = syshero.leadheroAddExp(retRoleALLInfo, retRoleALLInfo.roleHero, gameLevels_table.exp);
            }

            let next_levels = 0;
            if (retRoleALLInfo.roleSubInfo.demonAbyss.da_levels == 0) {
               //第一关
               next_levels = cur_levels;
            }
            else {
               if (gameLevels_table.nextid == 0 || !TableGameLevels.checkHave(gameLevels_table.nextid)) {
                  //最后一关 或者是 没有合法的关卡
                  next_levels = cur_levels;
               }
               else {
                  next_levels = gameLevels_table.nextid;
                  if (next_levels >= TableGameConfig.da_rank_open) {
                     //修改排行榜数据
                     await this.gameDataService.changeServerRankByType(retRoleALLInfo, EGameRankType.DEMONABYSS, next_levels);
                  }
               }

            }

            retRoleALLInfo.roleSubInfo.demonAbyss.da_fight_lost = false;
            retRoleALLInfo.roleSubInfo.demonAbyss.da_levels = next_levels;
            retMsg.newlevels = next_levels;

            new_pos = 0;
            //掉落处理
            let drop_data: DropDataEntity = await this.gameLevelsDrop(roleKeyDto, cur_levels);
            cGameCommon.hanleDropMsg(drop_data, retMsg);
         }

      }
      else {
         new_pos = 0;
         retRoleALLInfo.roleSubInfo.demonAbyss.da_fight_lost = true;
      }

      //保存到内存
      retMsg.roleAddExp = roleAddExp;
      retMsg.newpos = new_pos;

      retRoleALLInfo.roleSubInfo.demonAbyss.da_pos = new_pos;

      await this.gameDataService.updateRoleInfo(roleKeyDto, retRoleALLInfo.roleInfo);
      await this.gameDataService.updateRoleHero(roleKeyDto, retRoleALLInfo.roleHero);


      languageConfig.setActTypeSuccess(EActType.DEMON_ABYSS_FIGHT, retMsg);
      return retMsg;

   }

   /**
    * 魔渊每日奖励
    * @param req 
    * @param demonAbyssDailyAwardsDto 
    * @returns 
    */
   async demonAbyssDailyAwards(@Request() req: any, @Body() demonAbyssDailyAwardsDto: DemonAbyssDailyAwardsDto) {

      let roleKeyDto: RoleKeyDto = { id: req.user.id, serverid: req.user.serverid };
      let retMsg: DemonAbyssDailyAwardsMsg = new DemonAbyssDailyAwardsMsg();

      let getRoleALLInfoDto = new GetRoleALLInfoDto(roleKeyDto);
      getRoleALLInfoDto.need_roleInfo = true;
      getRoleALLInfoDto.need_roleItem = true;

      //获取角色信息
      let retRoleALLInfo: RetRoleALLInfo = await this.gameDataService.getRoleAllInfo(getRoleALLInfoDto);
      if (!retRoleALLInfo.isHaveData()) {
         retMsg.msg = retRoleALLInfo.getRetMsg();
         return retMsg;
      }

      if (!retRoleALLInfo.roleSubInfo.demonAbyss) {
         retMsg.msg = `魔渊系统数据异常`;
         return retMsg;
      }

      if (retRoleALLInfo.roleSubInfo.demonAbyss.da_levels <= 0) {
         retMsg.msg = `通关第一关后才能领取`;
         return retMsg;
      }

      //系统是否开放
      if (!cGameCommon.isOpenSystem(retRoleALLInfo, TableGameSys.demon_abyss)) {
         retMsg.msg = languageConfig.tip.not_open_system;
         return retMsg;
      }

      //是否已经领取过
      if (retRoleALLInfo.roleSubInfo.reDayInfo.da_awards) {
         retMsg.msg = languageConfig.tip.received_rewards;
         return retMsg;
      }

      //标记修改
      retRoleALLInfo.roleSubInfo.reDayInfo.da_awards = true;
      retMsg.da_awards = true;
      //奖励配置
      let award_item = cloneDeep(TableGameConfig.demon_abyss_daiy_awards);

      //每N层多加X个
      let add_info = TableGameConfig.demon_abyss_daiy_addnum;
      let cur_levels = retRoleALLInfo.roleSubInfo.demonAbyss.da_levels - TableGameConfig.demon_abyss_init_levels + 1;
      let addnum = Math.floor(cur_levels / add_info.levels);
      if (addnum >= 1) {
         for (const key in award_item) {
            if (Object.prototype.hasOwnProperty.call(award_item, key)) {
               award_item[key] += add_info.add * addnum;
            }
         }
      }

      //修改道具数据
      let dropDataEntity = await cGameCommon.addItem(roleKeyDto, award_item, this.gameDataService);
      cGameCommon.hanleDropMsg(dropDataEntity, retMsg);

      await this.gameDataService.updateRoleInfo(roleKeyDto, { info: retRoleALLInfo.roleSubInfo });

      languageConfig.setActTypeSuccess(EActType.DEMON_ABYSS_DAILY_AWARDS, retMsg);
      return retMsg;

   }


   /**
    * 魔渊每日付费购买道具
    * @param req 
    * @param demonAbyssDailyAwardsDto 
    * @returns 
    */
   async demonAbyssDailyBuyItem(@Request() req: any, @Body() demonAbyssDailyAwardsDto: DemonAbyssDailyBuyItemDto) {
      let roleKeyDto: RoleKeyDto = { id: req.user.id, serverid: req.user.serverid };
      let retMsg: DemonAbyssDailyBuyItemMsg = new DemonAbyssDailyBuyItemMsg();

      let getRoleALLInfoDto = new GetRoleALLInfoDto(roleKeyDto);
      getRoleALLInfoDto.need_roleInfo = true;
      getRoleALLInfoDto.need_roleItem = true;

      //获取角色信息
      let retRoleALLInfo: RetRoleALLInfo = await this.gameDataService.getRoleAllInfo(getRoleALLInfoDto);
      if (!retRoleALLInfo.isHaveData()) {
         retMsg.msg = retRoleALLInfo.getRetMsg();
         return retMsg;
      }

      if (!retRoleALLInfo.roleSubInfo.demonAbyss) {
         retMsg.msg = `魔渊系统数据异常`;
         return retMsg;
      }

      if (retRoleALLInfo.roleSubInfo.demonAbyss.da_levels <= 0) {
         retMsg.msg = `通关第一关后才能购买`;
         return retMsg;
      }

      //系统是否开放
      if (!cGameCommon.isOpenSystem(retRoleALLInfo, TableGameSys.demon_abyss)) {
         retMsg.msg = languageConfig.tip.not_open_system;
         return retMsg;
      }



      if (!TableGameConfig.demon_abyss_shop) {
         retMsg.msg = `购买配置异常`;
         return retMsg;
      }


      let cur_shops = TableGameConfig.demon_abyss_shop;
      if (retRoleALLInfo.roleSubInfo.reDayInfo.da_buytag >= cur_shops.length) {
         retMsg.msg = `已经超过购买次数上限`;
         return retMsg;
      }

      let costItem = cur_shops[retRoleALLInfo.roleSubInfo.reDayInfo.da_buytag];
      cItemBag.costItem(retRoleALLInfo.roleItem, costItem, retMsg);

      if (!retMsg.ok) { return retMsg; }

      //标记修改
      retRoleALLInfo.roleSubInfo.reDayInfo.da_buytag++;
      retMsg.da_buytag = retRoleALLInfo.roleSubInfo.reDayInfo.da_buytag;

      //奖励基础配置
      let award_item = cloneDeep(TableGameConfig.demon_abyss_daiy_awards);

      //每N层多加X个
      let add_info = TableGameConfig.demon_abyss_daiy_addnum;
      let cur_levels = retRoleALLInfo.roleSubInfo.demonAbyss.da_levels - TableGameConfig.demon_abyss_init_levels + 1;
      let addnum = Math.floor(cur_levels / add_info.levels);
      if (addnum >= 1) {
         for (const key in award_item) {
            if (Object.prototype.hasOwnProperty.call(award_item, key)) {
               award_item[key] += add_info.add * addnum;
            }
         }
      }

      //发送奖励
      let dropDataEntity = await cGameCommon.addItem(roleKeyDto, award_item, this.gameDataService, 1, false);
      cGameCommon.hanleDropMsg(dropDataEntity, retMsg);
      //保存数据
      await this.gameDataService.updateRoleInfo(roleKeyDto, { info: retRoleALLInfo.roleSubInfo });
      await this.gameDataService.updateAddRoleItem(roleKeyDto, retMsg);

      languageConfig.setActTypeSuccess(EActType.DEMON_ABYSS_DAILY_BUYITEM, retMsg);
      return retMsg;
   }

   /**
    * 魔渊成就奖励
    * @param req 
    * @param demonAbyssGetAwardsDto 
    * @returns 
    */
   async demonAbyssGetAwards(@Request() req: any, @Body() demonAbyssGetAwardsDto: DemonAbyssGetAwardsDto) {
      let roleKeyDto: RoleKeyDto = { id: req.user.id, serverid: req.user.serverid };
      let retMsg: DemonAbyssGetAwardsMsg = new DemonAbyssGetAwardsMsg();

      let getRoleALLInfoDto = new GetRoleALLInfoDto(roleKeyDto);
      getRoleALLInfoDto.need_roleInfo = true;
      getRoleALLInfoDto.need_roleItem = true;

      //获取角色信息
      let retRoleALLInfo: RetRoleALLInfo = await this.gameDataService.getRoleAllInfo(getRoleALLInfoDto);
      if (!retRoleALLInfo.isHaveData()) {
         retMsg.msg = retRoleALLInfo.getRetMsg();
         return retMsg;
      }

      if (!retRoleALLInfo.roleSubInfo.demonAbyss) {
         retMsg.msg = `魔渊系统数据异常`;
         return retMsg;
      }

      //系统是否开放
      if (!cGameCommon.isOpenSystem(retRoleALLInfo, TableGameSys.demon_abyss)) {
         retMsg.msg = languageConfig.tip.not_open_system;
         return retMsg;
      }

      let table_data = TableDemonAbyssAchieveAward.getTable();

      let drops = [];
      let cur_levels = retRoleALLInfo.roleSubInfo.demonAbyss.da_levels || 0;
      for (const levels in table_data) {
         if (Object.prototype.hasOwnProperty.call(table_data, levels)) {
            const need_levels = Number(levels)
            if (cur_levels < need_levels) { continue; }

            if (retRoleALLInfo.roleSubInfo.demonAbyss.da_awards_tag >= need_levels) {
               continue;
            }

            let cur_table_data = new TableDemonAbyssAchieveAward(need_levels);
            drops = drops.concat(cur_table_data.drop1);
            retRoleALLInfo.roleSubInfo.demonAbyss.da_awards_tag = need_levels;
         }
      }

      if (drops.length === 0) {
         retMsg.msg = "没有奖励可领取";
         return retMsg;
      }

      //发放道具奖励
      let dropDataEntity = await cGameCommon.addItemByDrop(roleKeyDto, drops, this.gameDataService);
      cGameCommon.hanleDropMsg(dropDataEntity, retMsg);

      retMsg.da_awards_tag = retRoleALLInfo.roleSubInfo.demonAbyss.da_awards_tag;
      //保存数据
      await this.gameDataService.updateRoleInfo(roleKeyDto, { info: retRoleALLInfo.roleSubInfo });

      languageConfig.setActTypeSuccess(EActType.DEMON_ABYSS_GET_AWARDS, retMsg);
      return retMsg;
   }
}
