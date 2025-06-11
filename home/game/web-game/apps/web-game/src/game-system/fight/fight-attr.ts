import { EFightState } from "../../config/game-enum";
import { TableGameAttr } from "../../config/gameTable/TableGameAttr";
import { TableGameConfig } from "../../config/gameTable/TableGameConfig";
import { FightActEntity, FightObjEntity } from "../../game-data/entity/fight.entity";
import { Logger } from "../../game-lib/log4js";
import { checkFightState } from "./fight-state";

export function changeCurHp(roleid: string, fightEntity: FightObjEntity, changeHp: number) {

    if (changeHp == 0) {
        return;
    }

    let curhp = fightEntity.tAttr[TableGameAttr.curhp]
    curhp += changeHp
    curhp = Math.max(0, curhp)
    curhp = Math.min(curhp, fightEntity.tAttr[TableGameAttr.hp])

    fightEntity.tAttr[TableGameAttr.curhp] = curhp

    if (curhp <= 0) {
        if (process.env.FIGHT_LOG == "TRUE") {
            Logger.fightlog(roleid, `[${fightEntity.data['name']}(${fightEntity.pos})] 战死`);
        }
    }
}

export function cpAtkDamage(roleid: string, atkEntity: FightObjEntity, defEntity: FightObjEntity, actEntity: FightActEntity, atkAddAttr: any = {}) {

    let atk_tattr = atkEntity.tAttr;
    let def_tattr = defEntity.tAttr;

    if (cpAttrPro(def_tattr[TableGameAttr.miss], atk_tattr[TableGameAttr.dec_miss])) {

        if (checkFightState(EFightState.NO_MISS, defEntity)) {
            if (process.env.FIGHT_LOG == "TRUE") {
                Logger.fightlog(roleid, `[${defEntity.data['name']}(${defEntity.pos})] 由于负面BUFF 无法闪避`);
            }
        }
        else {
            actEntity.miss = true;
            return 0;
        }
    }

    if (checkFightState(EFightState.NO_DAMAGE, defEntity)) {
        actEntity.no_damage = true;
        return 0;
    }

    let atk: number = atk_tattr[TableGameAttr.atk] ? atk_tattr[TableGameAttr.atk] : 0;
    let def: number = def_tattr[TableGameAttr.def] ? def_tattr[TableGameAttr.def] : 0;

    //攻击乘区
    if (atkAddAttr[TableGameAttr.atk_ratio] != undefined && atkAddAttr[TableGameAttr.atk_ratio] > 0) {
        atk = cpAttrRateVal(atk, atkAddAttr[TableGameAttr.atk_ratio]);
    }

    let damage = atk - def

    //console.log("d:",damage)
    //暴击
    if (cpAttrPro(atk_tattr[TableGameAttr.criticalAtk_pro], def_tattr[TableGameAttr.dec_criticalAtk_pro])) {
        actEntity.crite = true;
        let criticalAtk_per = atk_tattr[TableGameAttr.criticalAtk_per] || 0;
        criticalAtk_per += TableGameConfig.init_criticalAtk_per;
        let add_criticalDamage = atk_tattr[TableGameAttr.add_criticalDamage] || 0;
        let dec_criticalDamage = def_tattr[TableGameAttr.dec_criticalDamage] || 0;

        damage = cpAttrRateVal(damage, criticalAtk_per, add_criticalDamage, dec_criticalDamage);
    }
    //console.log("d:",damage)
    //附加伤害
    if (atk_tattr[TableGameAttr.add_damage]) {
        damage += atk_tattr[TableGameAttr.add_damage];
    }

    //额外附加伤害
    if (atkAddAttr[TableGameAttr.add_damage]) {
        damage += atkAddAttr[TableGameAttr.add_damage];
    }
    //console.log("d:",damage)
    //最终伤害 增加/减免
    let add_damage_rate = atk_tattr[TableGameAttr.add_damage_rate] || 0;
    let dec_damage_rate = def_tattr[TableGameAttr.dec_damage_rate] || 0;

    if (add_damage_rate > 0 || dec_damage_rate > 0) {

        let dif = add_damage_rate - dec_damage_rate;
        if (dif < 0) {
            //伤害减免生效最多75%
            dif = Math.abs(dif);
            dif = Math.min(dif, 7500);
            dif = dif * -1;
        }
        damage = damage + Math.floor(damage * dif / 10000);
        //damage = cpAttrPulsVal(damage, 0, add_damage_rate, dec_damage_rate);
    }

    //console.log("d:",damage)

    damage = Math.max(damage, 1)
    damage *= -1
    return damage;
}

/**
 * 计算概率
 * @param pro 
 * @param decPro 
 * @returns 
 */
export function cpAttrPro(pro: number, decPro: number = 0) {

    pro = pro ? pro : 0;
    decPro = decPro ? decPro : 0;

    let cur_pro = pro - decPro;

    if (cur_pro <= 0) {
        return false
    }

    if (Math.floor(Math.random() * 10000) <= cur_pro) {
        return true
    }
    return false
}

/**
 * Math.floor(val*(rate + addRate - decRate)/10000)
 * @param val 
 * @param rate 
 * @param addRate 
 * @param decRate 
 * @returns 
 */
export function cpAttrRateVal(val: number, rate: number, addRate: number = 0, decRate: number = 0) {

    let new_val = Math.floor(val * (rate + addRate - decRate) / 10000);

    return new_val;

}

/**
 * val + Math.floor(val*(rate + addRate - decRate)/10000)
 * @param val 
 * @param rate 
 * @param addRate 
 * @param decRate 
 * @returns 
 */
export function cpAttrPulsVal(val: number, rate: number, addRate: number = 0, decRate: number = 0) {

    let new_val = val + Math.floor(val * (rate + addRate - decRate) / 10000);

    return new_val;

}