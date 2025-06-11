import { forEach } from "lodash";
import { TableAureole } from "../../config/gameTable/TableAureole";
import { TableFruitSys } from "../../config/gameTable/TableFruitSys";
import { TableGameAttr } from "../../config/gameTable/TableGameAttr";
import { TableGameEquip } from "../../config/gameTable/TableGameEquip";
import { TableGameEquipPos } from "../../config/gameTable/TableGameEquipPos";
import { TableGameEquipPosAttr } from "../../config/gameTable/TableGameEquipPosAttr";
import { TableGameEquipPosLv } from "../../config/gameTable/TableGameEquipPosLv";
import { TableGameHero } from "../../config/gameTable/TableGameHero";
import { TableMedalUplevel } from "../../config/gameTable/TableMedalUplevel";
import { TableMercenaryLV } from "../../config/gameTable/TableMercenaryLV";
import { TableRareMonster } from "../../config/gameTable/TableRareMonster";
import { TableRareMonsterSuit } from "../../config/gameTable/TableRareMonsterSuit";
import { TableRoleUpgrade } from "../../config/gameTable/TableRoleUpgrade";
import { TableTitle } from "../../config/gameTable/TableTitle";
import { TableFashion } from "../../config/gameTable/TableFashion";
import { TableWrestleCard } from "../../config/gameTable/TableWrestleCard";
import { TableWrestleLevel } from "../../config/gameTable/TableWrestleLevel";
import { HeroEntity } from "../../game-data/entity/hero.entity";
import { RoleSubInfoEntity } from "../../game-data/entity/roleinfo.entity";
import { cEquipSystem } from "../equip/equip-system";
import { cGameCommon } from "../game-common";
import { TableGameSkill } from "../../config/gameTable/TableGameSkill";
import { TableSkillSuit } from "../../config/gameTable/TableSkillSuit";


export const cpHero = {

    cpTotalAttr: function (fightEntity: any, attrKey: number) {

        fightEntity.tAttr = fightEntity.tAttr || {}

        var total_attr = fightEntity.tAttr
        var buff_attr = fightEntity.bAttr || null;

        total_attr[attrKey] = cpHero.cpBaseAttr(total_attr, fightEntity.attr, buff_attr, attrKey);

        //计算关联属性
        var effect_key = TableGameAttr.getVal(attrKey, TableGameAttr.field_effect);
        if (effect_key && effect_key != TableGameAttr.N) {
            //console.log("cpTotalAttr effect_key:", effect_key)
            cpHero.cpTotalAttr(fightEntity, effect_key)
            //console.log("cpTotalAttr 计算关联属性 fightEntity:",fightEntity);
        }
    },

    cpBaseAttr: function (total_attr: any, attr: any, buff_attr: any, attrKey: number) {

        var total_val = 0;
        //先算上基础属性
        total_val = attr && attr[attrKey] || 0;
        //console.log("cpTotalAttr 先算上基础属性 total_val:",total_val);

        //算BUFF属性
        if (buff_attr && Object.keys(buff_attr).length > 0) {
            for (const battr_key in buff_attr) {
                if (Object.prototype.hasOwnProperty.call(buff_attr, battr_key)) {

                    if (Number(battr_key) != attrKey) { continue; }

                    const val_list: any = buff_attr[battr_key];
                    for (const key in val_list) {
                        if (Object.prototype.hasOwnProperty.call(val_list, key)) {
                            const val = val_list[key];
                            total_val += val;
                        }
                    }
                }
            }
        }

        //算加成属性（val = var + var*x）
        var rate_key = TableGameAttr.getVal(attrKey, TableGameAttr.field_rate)
        if (rate_key != TableGameAttr.N && total_attr[rate_key]) {
            //console.log("cpTotalAttr rate_key:",rate_key)
            total_val = total_val + Math.floor((total_val * total_attr[rate_key] / 10000))
            //console.log("cpTotalAttr 算加成属性 total_val:",total_val);
        }

        //算比例属性（val = var*x）
        // var ratio_key = TableGameAttr.getVal(attrKey,TableGameAttr.field_ratio)
        // if (ratio_key != TableGameAttr.N &&　total_attr[ratio_key]) {
        //     //console.log("cpTotalAttr ratio_key:",ratio_key)
        //     total_val = Math.floor(total_val*total_attr[ratio_key]/10000)
        //     //console.log("cpTotalAttr 算比例属性（val total_val:",total_val);
        // }

        return total_val;
    },

    cpHeroAttr: function (heroEntity: HeroEntity, roleinfo: RoleSubInfoEntity, isCpTAttr: boolean = true, isPK: boolean = false) {

        if (!TableGameHero.table[heroEntity.id]) { return; }

        const attr_arry = TableGameAttr.getTable()
        const cur_hero_table = new TableGameHero(Number(heroEntity.id))
        var equip_attr = {}
        //装备属性
        if (heroEntity.equip) {
            for (const key in heroEntity.equip) {
                if (Object.prototype.hasOwnProperty.call(heroEntity.equip, key)) {
                    const equip_entity = heroEntity.equip[key];
                    let cur_attr = cEquipSystem.cpEquipAttr(equip_entity);
                    for (const numkey in cur_attr) {
                        equip_attr[numkey] = equip_attr[numkey] || 0;
                        equip_attr[numkey] += cur_attr[numkey];
                    }
                }
            }
        }

        //装备部位强化属性
        let equipPosAttr = {}
        if (heroEntity.poslv) {
            for (const posid in heroEntity.poslv) {
                if (Object.prototype.hasOwnProperty.call(heroEntity.poslv, posid)) {

                    const pos_lv = heroEntity.poslv[posid];
                    if (!TableGameEquipPos.table[posid]) { continue; }
                    if (!TableGameEquipPosLv.table[pos_lv]) { continue; }

                    let equipPos = new TableGameEquipPos(Number(posid))
                    let equipPosAttrId = TableGameEquipPosLv.getVal(pos_lv, equipPos.strKey)
                    if (!TableGameEquipPosAttr.table[equipPosAttrId]) { continue; }

                    let pos_attrs = new TableGameEquipPosAttr(equipPosAttrId);
                    calAttr(equipPosAttr, pos_attrs)
                }
            }
        }

        //勋章属性
        let medalAttr = {}
        if (roleinfo.medalInfo && roleinfo.medalInfo.mid > 0) {
            let attrs = new TableMedalUplevel(roleinfo.medalInfo.mid)
            calAttr(medalAttr, attrs)
        }

        //食果属性
        var fruit_attr = {}
        if (heroEntity.fruit) {
            for (const fid in heroEntity.fruit) {
                if (Object.prototype.hasOwnProperty.call(heroEntity.fruit, fid)) {
                    const count = heroEntity.fruit[fid] || 0;
                    if (count <= 0) { continue; }
                    let fdata = new TableFruitSys(Number(fid));
                    calAttr(fruit_attr, fdata, count)
                }
            }
        }

        //等阶属性
        let upgradeAttr = {}
        if (roleinfo.upgrade && roleinfo.upgrade > 0) {
            let attrs = new TableRoleUpgrade(roleinfo.upgrade)
            calAttr(upgradeAttr, attrs)
        }

        //光环属性
        let aureoleAttr = {}
        if (roleinfo.aureole && roleinfo.aureole.id) {
            let attrs = new TableAureole(roleinfo.aureole.id)
            calAttr(aureoleAttr, attrs)
        }

        //佣兵属性
        let mercenaryAttr = {}
        if (roleinfo.mercenary?.mlv) {
            for (const key in roleinfo.mercenary.mlv) {
                if (Object.prototype.hasOwnProperty.call(roleinfo.mercenary.mlv, key)) {
                    const element = roleinfo.mercenary.mlv[key];
                    let attrs = new TableMercenaryLV(element.id)
                    calAttr(mercenaryAttr, attrs)
                }
            }
        }

        //异兽增加属性
        let raremstAttr = {};
        if (roleinfo.raremst) {
            for (const key of roleinfo.raremst.id) {
                if (TableRareMonster.checkHave(key)) {
                    let attrs = new TableRareMonster(Number(key));
                    calAttr(raremstAttr, attrs);
                }
            }
            for (const key of roleinfo.raremst.suit) {
                if (TableRareMonsterSuit.checkHave(key)) {
                    let attrs = new TableRareMonsterSuit(Number(key));
                    calAttr(raremstAttr, attrs);
                }
            }
        }
        //角斗属性
        let wrestleAttr = {}
        if (roleinfo.wrestle) {
            if (roleinfo.wrestle.id) {
                let attrs = new TableWrestleLevel(roleinfo.wrestle.id)
                calAttr(wrestleAttr, attrs)
            }
            if (isPK && heroEntity.pkcards) {
                for (let index = 0; index < heroEntity.pkcards.length; index++) {
                    const id = heroEntity.pkcards[index];
                    let attrs = new TableWrestleCard(id)
                    calAttr(wrestleAttr, attrs)
                }
            }
        }

        let titleAttr = {};
        if (roleinfo.title) {
            for (const key in roleinfo.title.id) {
                if (TableTitle.checkHave(Number(key))) {
                    let attrs = new TableTitle(Number(key));
                    calAttr(titleAttr, attrs);
                }
            }
        }

        let fashionAttr = {};
        if (roleinfo.fashion) {
            for (const key in roleinfo.fashion.id) {
                if (TableFashion.checkHave(Number(key))) {
                    let attrs = new TableFashion(Number(key));
                    if (attrs.group == cur_hero_table.group) {
                        calAttr(fashionAttr, attrs);
                    }
                }
            }
        }

        /**技能升级属性 */
        let skill_lv_Attr = {};
        if (heroEntity.skill) {
            for (const key in heroEntity.skill) {
                if (Object.prototype.hasOwnProperty.call(heroEntity.skill, key)) {
                    const skillPosEntity = heroEntity.skill[key];
                    if (!TableGameSkill.checkHave(skillPosEntity.sid)) { continue; }
                    let table_skill = new TableGameSkill(skillPosEntity.sid);
                    calAttr(skill_lv_Attr, table_skill);
                }
            }
        }

        let skill_suit_attr = {};
        if (roleinfo.skill?.suit) {
            for (const id of roleinfo.skill.suit) {
                if (TableSkillSuit.checkHave(id)) {
                    let data = new TableSkillSuit(id);
                    calAttr(skill_suit_attr, data);
                }
            }
        }

        /**计算属性
         * tAttr 目标属性
         * cAttr 配置表属性
         */
        function calAttr(tAttr: any, cAttr: any, count: number = 1) {
            for (const numkey in attr_arry) {
                const str_key = attr_arry[numkey][TableGameAttr.field_strKey];
                if (!cAttr[str_key]) { continue; }
                tAttr[numkey] = tAttr[numkey] || 0;
                tAttr[numkey] += cAttr[str_key] * count;
            }
        }
        heroEntity.attr = {};
        heroEntity.tAttr = {};

        //遍历所有属性
        for (const key in attr_arry) {
            //console.log("key:",key);
            //console.log("var:",attr_arry[key]);
            //计算英雄表属性
            var str_key = attr_arry[key][TableGameAttr.field_strKey];

            if (cur_hero_table[str_key]) {
                heroEntity.attr[key] = heroEntity.attr[key] || 0;
                heroEntity.tAttr[key] = heroEntity.tAttr[key] || 0;
                heroEntity.attr[key] += cur_hero_table[str_key];
                heroEntity.tAttr[key] += cur_hero_table[str_key];
                //console.log("cur_hero_table[str_key]:",cur_hero_table[str_key]);
            }

            //计算英雄装备属性
            cpHero.CalcAttl(equip_attr, key, heroEntity)

            //计算英雄装备部位属性
            cpHero.CalcAttl(equipPosAttr, key, heroEntity)

            //计算英雄勋章属性
            cpHero.CalcAttl(medalAttr, key, heroEntity)

            //计算英雄食果属性
            cpHero.CalcAttl(fruit_attr, key, heroEntity)

            //计算佣兵等阶属性
            cpHero.CalcAttl(upgradeAttr, key, heroEntity)

            //计算光环属性
            cpHero.CalcAttl(aureoleAttr, key, heroEntity)

            //计算佣兵寻宝属性
            cpHero.CalcAttl(mercenaryAttr, key, heroEntity)

            //计算异兽属性
            cpHero.CalcAttl(raremstAttr, key, heroEntity);

            //计算角斗属性
            cpHero.CalcAttl(wrestleAttr, key, heroEntity);

            //计算称号属性
            cpHero.CalcAttl(titleAttr, key, heroEntity);

            //计算时装属性
            cpHero.CalcAttl(fashionAttr, key, heroEntity);

            //计算佩戴的技能升级属性
            //console.warn("skill_lv_Attr:", skill_lv_Attr);
            cpHero.CalcAttl(skill_lv_Attr, key, heroEntity);

            //计算技能属性
            cpHero.CalcAttl(skill_suit_attr, key, heroEntity);
        }

        if (isCpTAttr) {
            for (const key in heroEntity.tAttr) {
                if (TableGameAttr.getVal(Number(key), TableGameAttr.field_rate) === TableGameAttr.N) { continue; }

                if (Object.prototype.hasOwnProperty.call(heroEntity.tAttr, key)) {
                    cpHero.cpTotalAttr(heroEntity, Number(key));
                }
            }
        }
        heroEntity.fight = cGameCommon.cpFightPoint(heroEntity.tAttr);
        var attr = {}
        attr = heroEntity.attr
        delete heroEntity.attr;
        return attr;
    },

    //计算英雄属性
    CalcAttl: function (Attr: any, key: string, heroEntity: HeroEntity) {
        // console.log(Attr,key)
        if (Attr[key]) {
            heroEntity.attr[key] = heroEntity.attr[key] || 0;
            heroEntity.tAttr[key] = heroEntity.tAttr[key] || 0;
            heroEntity.attr[key] += Attr[key]
            heroEntity.tAttr[key] += Attr[key]
        }
    },


}

