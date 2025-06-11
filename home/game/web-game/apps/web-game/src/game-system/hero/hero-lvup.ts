import { cloneDeep } from "lodash";
import { EHeroType } from "../../config/game-enum";
import { TableGameConfig } from "../../config/gameTable/TableGameConfig";
import { TableGameHero } from "../../config/gameTable/TableGameHero";
import { TableRoleUpgrade } from "../../config/gameTable/TableRoleUpgrade";
import { RoleAddExp } from "../../game-data/entity/common.entity";
import { HeroEntity, HerosRecord, HeroStateRecord } from "../../game-data/entity/hero.entity";
import { RoleInfoEntity } from "../../game-data/entity/roleinfo.entity";
import { SkillEntity, SkillPosEntity } from "../../game-data/entity/skill.entity";
import { Logger } from "../../game-lib/log4js";
import { cEquipSystem } from "../equip/equip-system";
import { cGameCommon, RetRoleALLInfo } from "../game-common";
import { cpHero } from "./hero-cpattr";

export const syshero = {

    /**
     * 获取主角英雄ID
     * @param heroList 
     */
    getLeadHeroId(heroList: HerosRecord) {
        for (const heroid in heroList) {
            if (Object.prototype.hasOwnProperty.call(heroList, heroid)) {
                let heroEntity = heroList[heroid];
                let cur_heroid = Number(heroid);
                if (!TableGameHero.checkHave(cur_heroid)) { continue; }

                if (TableGameHero.getVal(cur_heroid, TableGameHero.field_type) === EHeroType.LEAD) {
                    return cur_heroid;
                }

            }
        }

        return -1;
    },

    /**
     * 从英雄列表里找出 指定部位装备战力最低的英雄
     * @param heroList 
     * @param equipPos 
     */
    getLowHeroByEquipPos(heroList: HerosRecord, equipPos: number) {

        let low_hero = -1;
        let low_fight_point = -1;
        let cur_fight_point = 0;
        for (const heroid in heroList) {
            if (Object.prototype.hasOwnProperty.call(heroList, heroid)) {
                let heroEntity = heroList[heroid];
                heroEntity.id = Number(heroid);
                cur_fight_point = 0;

                if (heroEntity.equip && heroEntity.equip[equipPos]) {
                    let cur_equip = heroEntity.equip[equipPos];
                    cur_fight_point = cEquipSystem.cpEquipFightPoint(cur_equip);
                }

                if (low_fight_point == -1) {
                    low_fight_point = cur_fight_point;
                    low_hero = heroEntity.id;
                }
                else if (cur_fight_point < low_fight_point) {
                    low_fight_point = cur_fight_point;
                    low_hero = heroEntity.id;
                }

            }
        }

        return low_hero;

    },

    /**
     * 主角英雄升级
     * @param roleInfo 
     * @param heroList 
     * @param addexp 
     * @returns 
     */
    leadheroAddExp: function (retRoleALLInfo: RetRoleALLInfo, heroList: HerosRecord, addexp: number) {

        let ret: RoleAddExp = {}

        if (!retRoleALLInfo.isHaveData()) {
            return null;
        }

        if (retRoleALLInfo.roleInfo.rolelevel >= TableGameConfig.role_lv_max) {
            return null;
        }


        retRoleALLInfo.roleInfo.exp += addexp;
        ret.newExp = retRoleALLInfo.roleInfo.exp;
        ret.addExp = addexp;

        //是否能升级
        let lead_heroTable: TableGameHero;
        let last_heroId: number = 0;
        let lead_heroEntity: HeroEntity;
        let active_heroEntityList: HeroEntity[];

        for (const heroid in heroList) {
            if (Object.prototype.hasOwnProperty.call(heroList, heroid)) {
                let heroEntity = heroList[heroid];
                heroEntity.id = Number(heroid)
                let hero_type = TableGameHero.getVal(heroEntity.id, TableGameHero.field_type);
                if (hero_type === EHeroType.LEAD) {
                    lead_heroEntity = heroEntity;
                    last_heroId = Number(heroid);
                    break;
                }
            }
        }

        if (!lead_heroEntity) {
            Logger.error("leadheroAddExp lead_heroEntity is null")
            return ret;
        }

        lead_heroTable = new TableGameHero(lead_heroEntity.id);
        if (retRoleALLInfo.roleInfo.exp < lead_heroTable.costexp) {
            return ret;
        }

        if (lead_heroTable.nextid === 0) {
            return ret;
        }

        let lg = retRoleALLInfo.roleInfo.info?.upgrade || 1;
        let limt_lv = TableRoleUpgrade.getVal(lg, TableRoleUpgrade.field_maxLevel)
        if (lead_heroTable.lv >= limt_lv) {
            return ret;
        }
        // if (retRoleALLInfo.roleInfo.info?.upgrade < lead_heroTable.needgrade) {
        //     return ret;
        // }

        let uplv = 0;
        let new_lead_heroTable: TableGameHero = lead_heroTable;
        while (retRoleALLInfo.roleInfo.exp >= new_lead_heroTable.costexp) {
            retRoleALLInfo.roleInfo.exp -= new_lead_heroTable.costexp;
            uplv++;

            if (new_lead_heroTable.nextid === 0) {
                break;
            }

            if (!TableGameHero.getVal(new_lead_heroTable.nextid, TableGameHero.field_lv)) {
                Logger.error(`TableGameHero data is null heroid:${new_lead_heroTable.nextid}`);
                break;
            }

            new_lead_heroTable = new TableGameHero(new_lead_heroTable.nextid);
        }

        //console.log("uplv:", uplv)
        //角色等级
        retRoleALLInfo.roleInfo.rolelevel += uplv;
        ret.newExp = retRoleALLInfo.roleInfo.exp;
        ret.newLevel = retRoleALLInfo.roleInfo.rolelevel;

        //英雄升级
        //console.log("AAAA heroList:", heroList)

        //更换对比英雄ID
        if (retRoleALLInfo.roleInfo.info?.tmpEquips && Object.keys(retRoleALLInfo.roleInfo.info.tmpEquips).length > 0) {
            let is_update_tmp = false;
            for (const key in retRoleALLInfo.roleInfo.info.tmpEquips) {
                if (Object.prototype.hasOwnProperty.call(retRoleALLInfo.roleInfo.info.tmpEquips, key)) {
                    let element = retRoleALLInfo.roleInfo.info.tmpEquips[key];
                    if (element.tmphid === lead_heroEntity.id) {
                        element.tmphid = new_lead_heroTable.id;
                        is_update_tmp = true;
                    }
                }
            }

            if (is_update_tmp) {
                ret.newTmpEquips = retRoleALLInfo.roleInfo.info?.tmpEquips;
            }
        }


        lead_heroEntity.id = new_lead_heroTable.id;
        heroList[new_lead_heroTable.id] = lead_heroEntity;
        cpHero.cpHeroAttr(lead_heroEntity, retRoleALLInfo.roleInfo.info);
        delete heroList[last_heroId];

        //出战队伍更换
        if (retRoleALLInfo.roleInfo.info?.fteam) {
            let fteam = retRoleALLInfo.roleInfo.info.fteam
            for (let idx = 0; idx < fteam.length; idx++) {
                let heroid = fteam[idx];
                if (heroid === last_heroId) {
                    fteam[idx] = new_lead_heroTable.id;
                    break;
                }
            }
        }
        //console.log("BBBB heroList:", heroList)

        let hero_group = {};
        for (const heroid in heroList) {
            if (Object.prototype.hasOwnProperty.call(heroList, heroid)) {
                let group = TableGameHero.getVal(Number(heroid), TableGameHero.field_group);
                hero_group[group] = true;
            }
        }
        //是否解锁新的英雄
        let heroListSate: HeroStateRecord = retRoleALLInfo.roleInfo.info.heroState;
        let active_herolist = TableGameConfig.heroList;
        for (const heroid in heroListSate) {
            if (Object.prototype.hasOwnProperty.call(heroListSate, heroid)) {

                if (heroListSate[heroid]) { continue; }

                for (let index = 0; index < active_herolist.length; index++) {
                    const element = active_herolist[index];
                    if (!element) { continue; }
                    if (element.id !== Number(heroid)) { continue; }
                    let needlv = element.needlv;
                    if (retRoleALLInfo.roleInfo.rolelevel >= needlv) {
                        if (heroList[element.id] != undefined) { continue; }
                        //屏蔽同系列的英雄
                        let group = TableGameHero.getVal(Number(heroid), TableGameHero.field_group);
                        if (hero_group[group]) { continue; }

                        heroListSate[heroid] = true;
                        //创建新英雄
                        let hero_entity: HeroEntity = syshero.createHero(Number(heroid));

                        //同步技能
                        let tianfu_skill = TableGameHero.getVal(Number(heroid), TableGameHero.field_skill);
                        if (retRoleALLInfo.roleInfo.info.skill.list[tianfu_skill] != undefined) {
                            Logger.error(`创建新英雄[${heroid}] 天赋技能【${tianfu_skill}】已在技能列表里`);
                        }
                        else {
                            retRoleALLInfo.roleInfo.info.skill.list[tianfu_skill] = {}
                        }

                        cpHero.cpHeroAttr(hero_entity, retRoleALLInfo.roleInfo.info);
                        //新英雄插入英雄列表
                        heroList[hero_entity.id] = hero_entity;
                        retRoleALLInfo.roleInfo.info.fteam.push(hero_entity.id);
                        active_heroEntityList = active_heroEntityList || [];
                        active_heroEntityList.push(cloneDeep(hero_entity));
                    }
                }
            }
        }



        if (lead_heroEntity) {
            ret.newHero = cloneDeep(lead_heroEntity);
        }

        if (active_heroEntityList) {
            ret.newActiveHeros = active_heroEntityList;
        }

        let new_system = cGameCommon.checkOpenNewSystem(retRoleALLInfo);
        //是否有新系统开放
        if (new_system) {
            ret.newSystem = new_system;
        }

        return ret;
    },

    cloneHeroEntity: function (heroEntity: HeroEntity) {

        let new_heroEntity: HeroEntity = {
            id: heroEntity?.id ? heroEntity.id : undefined,
            skill: heroEntity?.skill ? heroEntity.skill : undefined,
            poslv: heroEntity?.poslv ? heroEntity.poslv : undefined,
            equip: heroEntity?.equip ? heroEntity.equip : undefined,
            tAttr: heroEntity?.tAttr ? heroEntity.tAttr : undefined,
            fight: heroEntity?.fight ? heroEntity.fight : undefined,
        }

        return new_heroEntity;
    },

    createHero: function (heroid: number) {
        let tianfu_skill = TableGameHero.getVal(heroid, TableGameHero.field_skill);

        if (!tianfu_skill) {
            Logger.error("createHero 该英雄不存在 id:" + heroid);
            return null;
        }

        let skill_pos: SkillPosEntity = {
            sid: tianfu_skill
        }

        let hero_entity: HeroEntity = {
            id: heroid,
            skill: {}
        }

        hero_entity.skill[0] = skill_pos;

        return hero_entity;
    }
}