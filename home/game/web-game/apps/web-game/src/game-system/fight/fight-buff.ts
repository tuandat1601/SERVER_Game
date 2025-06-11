import { EBuffRoundsType, EBuffTargetType, EBuffTrigger, EBuffType, EBuffUpType, EComputeType, EFightAct, EFightState, EFormula, EObjtype, ESkillActive, ESkillType } from "../../config/game-enum";
import { TableGameAttr } from "../../config/gameTable/TableGameAttr";
import { TableGameBuff } from "../../config/gameTable/TableGameBuff";
import { TableGameSkill } from "../../config/gameTable/TableGameSkill";
import { BuffEntity, FightActEntity, FightObjEntity } from "../../game-data/entity/fight.entity";
import { Logger } from "../../game-lib/log4js";
import { cpHero } from "../hero/hero-cpattr";
import { changeCurHp, cpAtkDamage, cpAttrPro } from "./fight-attr";
import { checkFightState } from "./fight-state";

/**
 * 添加BUFF
 * @param buffid 
 * @param atkInfo 
 * @param fightObjs_pos 
 * @param act_list 
 * @param targetPos 
 * @returns 
 */
export function addBuff(roleid: string, buffid: number, atkInfo: FightObjEntity, fightObjs_pos: FightObjEntity[], act_list: FightActEntity[], targetPos: number = -1) {

    if (!TableGameBuff.checkHave(buffid)) {
        Logger.error("buff is null by TableGameBuff buffid:" + buffid);
        return;
    }

    /**表数据 */
    let add_buff_data = new TableGameBuff(buffid);

    //添加概率
    if (!cpAttrPro(add_buff_data.addpro)) {
        return
    }

    //获取添加目标
    let target_posAry: number[] = [];

    //有指定目标
    if (targetPos != -1 && add_buff_data.target == EBuffTargetType.ENEMY) {
        target_posAry.push(targetPos)
    }
    else {

        let cur_targe_ttype = add_buff_data.target;

        //是否是混乱攻击模式
        if (checkFightState(EFightState.CONFUSION, atkInfo)) {
            cur_targe_ttype = EBuffTargetType.NONE;
        }

        switch (cur_targe_ttype) {
            case EBuffTargetType.NONE:
                for (const key in fightObjs_pos) {
                    let curInfo: FightObjEntity = fightObjs_pos[key];
                    if (curInfo && curInfo.objType !== EObjtype.RARE_MONSTER && curInfo.tAttr[TableGameAttr.curhp] > 0
                        && (curInfo.pos === atkInfo.pos && add_buff_data.type == EBuffType.ADD)
                    ) {
                        target_posAry.push(curInfo.pos)
                    }
                }
                break;
            case EBuffTargetType.SELF:
                target_posAry.push(atkInfo.pos)
                break;
            case EBuffTargetType.OUR:

                for (const key in fightObjs_pos) {
                    let curInfo: FightObjEntity = fightObjs_pos[key];
                    if (curInfo && curInfo.objType !== EObjtype.RARE_MONSTER
                        && curInfo.fightCamp === atkInfo.fightCamp
                        && curInfo.tAttr[TableGameAttr.curhp] > 0
                    ) {
                        target_posAry.push(curInfo.pos)
                    }
                }
                break;
            case EBuffTargetType.ENEMY:
                for (const key in fightObjs_pos) {
                    let curInfo: FightObjEntity = fightObjs_pos[key];
                    if (curInfo && curInfo.objType !== EObjtype.RARE_MONSTER && curInfo.fightCamp != atkInfo.fightCamp && curInfo.tAttr[TableGameAttr.curhp] > 0) {
                        target_posAry.push(curInfo.pos)
                    }
                }
                break;
            case EBuffTargetType.OUR_MIN_HP:

                let min_hp_pos = -1;
                let min_hp = 0;
                for (const key in fightObjs_pos) {
                    let curInfo: FightObjEntity = fightObjs_pos[key];
                    if (curInfo && curInfo.objType !== EObjtype.RARE_MONSTER && curInfo.fightCamp === atkInfo.fightCamp && curInfo.tAttr[TableGameAttr.curhp] > 0) {
                        if (min_hp == 0 || curInfo.tAttr[TableGameAttr.curhp] < min_hp) {
                            min_hp = curInfo.tAttr[TableGameAttr.curhp];
                            min_hp_pos = curInfo.pos;
                        }
                    }
                }
                if (min_hp_pos != -1) {
                    target_posAry.push(min_hp_pos)
                }
                break;
            default:
                break;
        }
    }




    if (target_posAry.length > add_buff_data.tNum) {
        while (target_posAry.length > add_buff_data.tNum) {
            let random_let = Math.floor(Math.random() * target_posAry.length);
            target_posAry.splice(random_let, 1);
        }
    }

    for (let targetpos_idx = 0; targetpos_idx < target_posAry.length; targetpos_idx++) {
        const targetpos = target_posAry[targetpos_idx];
        let targetinfo = fightObjs_pos[targetpos];
        if (!targetinfo) { continue }

        if (checkFightState(EFightState.NO_DBUFF, targetinfo) && add_buff_data.type === EBuffType.DEC) {

            if (process.env.FIGHT_LOG == "TRUE") {
                Logger.fightlog(roleid, `[${targetinfo.data['name']}(${targetinfo.pos})] 由于免疫负面BUFF 免疫${add_buff_data.name}`);
            }
            continue;
        }

        let add_buffEntity: BuffEntity = {
            id: buffid,
            data: add_buff_data,
            rounds: add_buff_data.rounds,
        }

        let target_buffs: BuffEntity[] = targetinfo.buff;
        //覆盖逻辑
        let delete_buffid = 0;
        let delete_idx = -1;
        let have_buff_utype_add = false;
        if (add_buff_data.type != EBuffType.DAMAGE && target_buffs.length > 0) {

            for (let buff_idx = 0; buff_idx < target_buffs.length; buff_idx++) {

                let buff: BuffEntity = target_buffs[buff_idx];
                if (buff && buff.data && buff.data.group === add_buff_data.group) {

                    if (add_buff_data.utype == EBuffUpType.LV) {
                        //同系列覆盖
                        if (add_buff_data.level >= buff.data.level) {
                            //删除要覆盖的BUFF
                            delete_buffid = buff.data.id;
                            delete_idx = buff_idx;
                            break;
                        }
                    }
                    else if (add_buff_data.utype == EBuffUpType.ADD) {
                        buff.rounds = add_buff_data.rounds;
                        have_buff_utype_add = true;
                        break;
                    }
                    else {
                        break;
                    }

                }
            }

        }

        let add_act: FightActEntity = {
            t: EFightAct.ADDBUFF,
            ap: atkInfo.pos,
            tp: targetinfo.pos,
            bid: buffid,
        }

        if (delete_buffid != 0) {
            add_act.t = EFightAct.UPBUFF
            //删除BUFF
            removeBuff(delete_buffid, targetinfo, act_list, delete_idx)
        }

        act_list.push(add_act);

        //添加BUFF到 BUFF队列
        if (add_buff_data.trigger != EBuffTrigger.ADD
            || (add_buff_data.type != EBuffType.DAMAGE && add_buff_data.caAttr != TableGameAttr.curhp)) {

            //叠加覆盖 不用重复加BUFF到队列
            if (add_buff_data.utype == EBuffUpType.ADD && have_buff_utype_add) {

            }
            else {
                target_buffs.push(add_buffEntity);
            }

            if (process.env.FIGHT_LOG == "TRUE") {
                if (delete_buffid != 0) {
                    Logger.fightlog(roleid, `对[${targetinfo.data['name']}(${targetinfo.pos})] 添加了BUFF[${add_buff_data.name}](覆盖刷新) 持续[${add_buff_data.rounds}]回合`)
                }
                else if (add_buff_data.utype == EBuffUpType.ADD) {

                    if (have_buff_utype_add) {
                        Logger.fightlog(roleid, `对[${targetinfo.data['name']}(${targetinfo.pos})] 添加了叠加BUFF[${add_buff_data.name}](覆盖叠加) 持续[${add_buff_data.rounds}]回合`)
                    }
                    else {
                        Logger.fightlog(roleid, `对[${targetinfo.data['name']}(${targetinfo.pos})] 添加了叠加BUFF[${add_buff_data.name}] 持续[${add_buff_data.rounds}]回合`)
                    }
                }
                else {
                    Logger.fightlog(roleid, `对[${targetinfo.data['name']}(${targetinfo.pos})] 添加了BUFF[${add_buff_data.name}] 持续[${add_buff_data.rounds}]回合`)
                }
            }
        }


        // ADD BUFF 属性修改和状态修改
        cpAddBuffAS(roleid, atkInfo, targetinfo, add_buffEntity, add_act);

        //BUFF里 添加新BUFF
        if (add_buff_data.buffs && add_buff_data.buffs.length > 0) {
            atkInfo.tmp = {};
            atkInfo.tmp[buffid] = true;
            for (let index = 0; index < add_buff_data.buffs.length; index++) {
                const sub_buffid = add_buff_data.buffs[index];

                //执行历史列表里是否有过记录  防止死循环
                if (atkInfo.tmp[sub_buffid]) { continue; }

                if (!atkInfo.tmp[sub_buffid]) {
                    atkInfo.tmp[sub_buffid] = true;
                }

                addBuff(roleid, sub_buffid, atkInfo, fightObjs_pos, act_list);
            }
        }
    }
}

/**
 * 移除BUFF
 * @param buffId 
 * @param fightEntity 
 * @param add_act 
 * @param delete_idx 
 * @returns 
 */
export function removeBuff(buffId: number, fightEntity: FightObjEntity, add_act: FightActEntity[], delete_idx: number = -1) {

    let buff_ary = fightEntity.buff;

    if (!buff_ary || buff_ary.length <= 0) {
        return;
    }

    if (delete_idx == -1) {
        for (let buff_idx = 0; buff_idx < buff_ary.length; buff_idx++) {

            let buff: BuffEntity = buff_ary[buff_idx];
            if (buff.data.id === buffId) {
                delete_idx = buff_idx;
                break
            }
        }
    }

    if (delete_idx == -1) {
        return;
    }

    //BUFF 列表里删除
    buff_ary.splice(delete_idx, 1);


    let actInfo: FightActEntity = {
        t: EFightAct.REMOVEBUFF,
        bid: buffId,
        ap: fightEntity.pos,
    }
    add_act.push(actInfo)

    //移除属性计算
    let add_buff_data = new TableGameBuff(buffId);

    if (add_buff_data.caAttr != TableGameAttr.N && fightEntity.bAttr && fightEntity.bAttr[add_buff_data.caAttr]) {

        if (fightEntity.bAttr[add_buff_data.caAttr][buffId]) {

            if (add_buff_data.caAttr === TableGameAttr.curhp || add_buff_data.caAttr === TableGameAttr.hp) {
                actInfo.v = fightEntity.bAttr[add_buff_data.caAttr][buffId];
            }

            fightEntity.bAttr[add_buff_data.caAttr][buffId] = 0;
            fightEntity.bAttr[add_buff_data.caAttr][buffId] = null;
        }

    }

    //移除状态计算
    if (add_buff_data.caState.length > 0) {
        actInfo.st = {};
        for (let index = 0; index < add_buff_data.caState.length; index++) {
            const cur_state = add_buff_data.caState[index];

            const state_num = add_buff_data.stateNum[index];
            let set_state_num = 1;
            if (state_num > 0) {
                set_state_num = state_num;
            }

            if (fightEntity.state[cur_state]) {
                fightEntity.state[cur_state] -= set_state_num;

                actInfo.st[cur_state] = -1 * set_state_num;

                if (fightEntity.state[cur_state] <= 0) {
                    fightEntity.state[cur_state] = 0;
                    fightEntity.state[cur_state] = null;
                }
            }
        }

    }
}


/**
 * 计算ADD BUFF行为时  属性和状态
 * @param actInfo 
 * @param targetInfo 
 * @param buffEntity 
 * @param fightAct 
 * @returns 
 */
export function cpAddBuffAS(roleid: string, actInfo: FightObjEntity, targetInfo: FightObjEntity, buffEntity: BuffEntity, fightAct: FightActEntity) {

    if (!buffEntity || !buffEntity.data) {
        return;
    }

    let add_buff_data: TableGameBuff = buffEntity.data;

    if (actInfo.tAttr[TableGameAttr.curhp] <= 0) {
        return;
    }

    if (targetInfo.tAttr[TableGameAttr.curhp] <= 0) {
        return;
    }

    //计算对象类型
    let cp_entity: FightObjEntity;
    if (add_buff_data.cpType === EComputeType.SENDER) {
        cp_entity = actInfo;
    }
    else if (add_buff_data.cpType === EComputeType.TARGET) {
        cp_entity = targetInfo;
    }

    //改变目标对象类型
    let ca_entity: FightObjEntity;
    if (add_buff_data.caType === EComputeType.SENDER) {
        ca_entity = actInfo;
    }
    else if (add_buff_data.caType === EComputeType.TARGET) {
        ca_entity = targetInfo;
    }

    //状态改变计算
    if (add_buff_data.caState.length > 0) {
        fightAct.st = {};
        for (let index = 0; index < add_buff_data.caState.length; index++) {
            const cur_state = add_buff_data.caState[index];
            const state_num = add_buff_data.stateNum[index];
            let set_state_num = 1;
            if (state_num > 0) {
                set_state_num = state_num;
            }

            if (!ca_entity.state[cur_state]) {
                ca_entity.state[cur_state] = set_state_num;
            }
            else {
                ca_entity.state[cur_state] += set_state_num;
            }

            fightAct.st[cur_state] = set_state_num;

        }

    }

    let cpMulVal = 0;
    //倍率计算
    if (add_buff_data.cpType != EComputeType.NONE && add_buff_data.cpAttr != TableGameAttr.N && add_buff_data.cpMul != 0) {
        let cpAttr_let = cp_entity.tAttr[add_buff_data.cpAttr];
        cpMulVal = Math.floor(cpAttr_let * add_buff_data.cpMul / 10000);
    }

    //属性改变计算
    if (add_buff_data.caAttr == TableGameAttr.N || add_buff_data.formula == EFormula.NONE) {
        return;
    }

    let change_val: number = 0;
    //不同公式计算方式不同
    if (add_buff_data.formula === EFormula.ATKCP) {

        let add_mul = 0

        if (fightAct.t === EFightAct.SKILL && fightAct.sid) {
            let skill_type = TableGameSkill.getVal(fightAct.sid, TableGameSkill.field_type);

            if (skill_type === ESkillType.ACTIVE) {
                add_mul = actInfo.tAttr[TableGameAttr.add_askill_dam] ? actInfo.tAttr[TableGameAttr.add_askill_dam] : 0;
            } else if (skill_type === ESkillType.APPEND) {
                add_mul = actInfo.tAttr[TableGameAttr.add_apskill_dam] ? actInfo.tAttr[TableGameAttr.add_apskill_dam] : 0;
            }
        }

        let add_attr: any = {
            [TableGameAttr.atk_ratio]: add_buff_data.cpMul + add_mul,
            [TableGameAttr.add_damage]: add_buff_data.cpVal,
        }

        change_val = cpAtkDamage(roleid, actInfo, targetInfo, fightAct, add_attr)
    }
    else if (add_buff_data.formula === EFormula.ADD) {

        change_val += cpMulVal + add_buff_data.cpVal;

        if (add_buff_data.caAttr === TableGameAttr.curhp) {

            let add_hp_mul = actInfo.tAttr[TableGameAttr.add_hp_per] ? actInfo.tAttr[TableGameAttr.add_hp_per] : 0;
            change_val = change_val + Math.floor(change_val * add_hp_mul / 10000);
        }

    } else if (add_buff_data.formula === EFormula.MINUS) {
        change_val -= cpMulVal + add_buff_data.cpVal;
    }

    //添加后立即生效的  及时计算属性修改
    //BUFF添加 时候 触发BUFF效果
    if (add_buff_data.trigger === EBuffTrigger.ADD) {

        if (add_buff_data.type === EBuffType.DAMAGE || add_buff_data.caAttr === TableGameAttr.curhp) {

            if (process.env.FIGHT_LOG == "TRUE") {
                if (add_buff_data.formula === EFormula.MINUS || add_buff_data.formula === EFormula.ATKCP) {

                    if (fightAct.miss) {
                        Logger.fightlog(roleid, `[${ca_entity.data['name']} 闪避了伤害`)
                    }
                    else if (fightAct.no_damage) {
                        Logger.fightlog(roleid, `[${ca_entity.data['name']} 免疫了伤害(剩余${ca_entity.state[EFightState.NO_DAMAGE]}次)`)
                    }
                    else {
                        Logger.fightlog(roleid, `对[${ca_entity.data['name']}(${ca_entity.pos})]造成了${change_val}点伤害(${ca_entity.tAttr[TableGameAttr.curhp] + change_val})`)
                    }
                }
                else if (add_buff_data.formula === EFormula.ADD) {
                    Logger.fightlog(roleid, `对[${ca_entity.data['name']}(${ca_entity.pos})] 恢复了${change_val}(${ca_entity.tAttr[TableGameAttr.curhp]}/${ca_entity.tAttr[TableGameAttr.hp]})生命`)
                }
            }

            if (change_val != 0) {
                changeCurHp(roleid, ca_entity, change_val);
                fightAct.v = change_val;
            }
        }
        else {

            if (change_val == 0) { return; }

            if (ca_entity.bAttr[add_buff_data.caAttr] == undefined) {
                ca_entity.bAttr[add_buff_data.caAttr] = {}
            }

            if (process.env.FIGHT_LOG == "TRUE") {
                let change_val_str = "减";
                if (change_val > 0) {
                    change_val_str = "加";
                }
                let att_name = "" + add_buff_data.caAttr;
                if (TableGameAttr.checkHave(add_buff_data.caAttr)) {
                    att_name = new TableGameAttr(add_buff_data.caAttr).name;
                }
                Logger.fightlog(roleid, `对[${ca_entity.data['name']}(${ca_entity.pos})] 属性：${att_name}(${add_buff_data.caAttr})  ${change_val_str}:${change_val}`);
            }

            if (add_buff_data.utype === EBuffUpType.ADD) {
                ca_entity.bAttr[add_buff_data.caAttr][add_buff_data.id] = ca_entity.bAttr[add_buff_data.caAttr][add_buff_data.id] || 0;
                ca_entity.bAttr[add_buff_data.caAttr][add_buff_data.id] += change_val;
            }
            else {
                ca_entity.bAttr[add_buff_data.caAttr][add_buff_data.id] = change_val;
            }

            //重新计算总属性
            cpHero.cpTotalAttr(ca_entity, add_buff_data.caAttr);
        }
    }
    else {

        // if (add_buff_data.caAttr === TableGameAttr.curhp) {
        //     Logger.fightlog(roleid, `ADD BUFF VAR 对[BUFFID:${add_buff_data.id}][${ca_entity.data['name']}(${ca_entity.pos})] ${add_buff_data.caAttr}  ${change_val}`);
        // }
        buffEntity.val = change_val;
    }
}

/**
 * 对已经生效的BUFF 根据不同条件来执行BUFF效果
 * @param trigger 
 * @param targetInfo 
 * @param buffEntity 
 * @param fightAct 
 * @returns 
 */
export function triggerBuff(roleid: string, trigger: EBuffTrigger, targetInfo: FightObjEntity, buffEntity: BuffEntity, fightAct: FightActEntity) {

    if (!buffEntity || !buffEntity.data) {
        return;
    }

    let add_buff_data: TableGameBuff = buffEntity.data;

    if (trigger != add_buff_data.trigger) {
        return;
    }

    if (targetInfo.tAttr[TableGameAttr.curhp] <= 0) {
        return;
    }

    let change_val = 0;
    //BUFF 拥有后 符合条件触发
    if (buffEntity.val != 0) {
        change_val = buffEntity.val
    }


    if (add_buff_data.caAttr === TableGameAttr.curhp) {
        if (add_buff_data.formula === EFormula.MINUS || add_buff_data.formula === EFormula.ATKCP) {
            if (checkFightState(EFightState.NO_DAMAGE, targetInfo)) {
                change_val = 0
                fightAct.no_damage = true;
                if (process.env.FIGHT_LOG == "TRUE") {
                    Logger.fightlog(roleid, `[${targetInfo.data['name']} 触发了BUFF[${buffEntity.data.name}](剩余${buffEntity.rounds}回合) 由于免疫伤害BUFF 免疫了伤害(剩余${targetInfo.state[EFightState.NO_DAMAGE]}次)`);
                }

            }
            else {
                if (process.env.FIGHT_LOG == "TRUE") {
                    Logger.fightlog(roleid, `[${targetInfo.data['name']} (${targetInfo.pos})] 触发了BUFF[${buffEntity.data.name}](剩余${buffEntity.rounds}回合) 造成了${change_val} 点伤害(${targetInfo.tAttr[TableGameAttr.curhp] + change_val})`);
                }
            }
        }
        changeCurHp(roleid, targetInfo, change_val);
        if (add_buff_data.formula === EFormula.ADD) {

            if (process.env.FIGHT_LOG == "TRUE") {
                Logger.fightlog(roleid, `[${targetInfo.data['name']}(${targetInfo.pos})] 触发了BUFF[${buffEntity.data.name}](剩余${buffEntity.rounds}回合)  恢复了${change_val}(${targetInfo.tAttr[TableGameAttr.curhp]}/${targetInfo.tAttr[TableGameAttr.hp]})生命`);
            }
        }
        fightAct.v = change_val;
    }
    else {

        if (targetInfo.bAttr[add_buff_data.caAttr] == undefined) {
            targetInfo.bAttr[add_buff_data.caAttr] = {}
        }

        if (process.env.FIGHT_LOG == "TRUE") {
            Logger.fightlog(roleid, `[${targetInfo.data['name']} 触发了BUFF[${buffEntity.data.name}] [${add_buff_data.caAttr}]:change_val `);
        }


        targetInfo.bAttr[add_buff_data.caAttr][add_buff_data.id] = change_val
        //重新计算总属性
        cpHero.cpTotalAttr(targetInfo, add_buff_data.caAttr);
    }

}

/**
 * 执行符合trigger 条件的BUFF执行
 * @param trigger 
 * @param actInfo 
 * @param fightdata 
 * @param actlist 
 * @returns 
 */
export function executeBuff(roleid: string, trigger: EBuffTrigger, targetEntity: FightObjEntity, actlist: FightActEntity[]) {

    if (!targetEntity || !targetEntity.buff) {
        return
    }

    let buff_ary = targetEntity.buff;

    if (buff_ary.length <= 0) {
        return;
    }

    let remove_buff: BuffEntity[] = [];

    for (let index = 0; index < buff_ary.length; index++) {
        let buffEntity: BuffEntity = buff_ary[index];

        if (buffEntity.data.rdType === EBuffRoundsType.TMP && trigger === EBuffTrigger.REND) {
            buffEntity.rounds -= 1;
            if (process.env.FIGHT_LOG == "TRUE") {
                Logger.fightlog(roleid, `[${targetEntity.data['name']} BUFF[${buffEntity.data.name}] (剩余回合${buffEntity.rounds})`);
            }

        }

        if (buffEntity.rounds <= 0) {
            //删除BUFF
            if (buffEntity.data.rdType === EBuffRoundsType.TMP && trigger === EBuffTrigger.REND) {
                remove_buff.push(buffEntity);
            }
            continue;
        }

        if (trigger != buffEntity.data.trigger) {
            continue;
        }

        let fightAct: FightActEntity = {
            bid: buffEntity.id,
            t: EFightAct.TRIGGER_BUFF,
            ap: targetEntity.pos,
        }
        actlist.push(fightAct);

        triggerBuff(roleid, trigger, targetEntity, buffEntity, fightAct);
    }

    if (trigger != EBuffTrigger.REND) {
        return;
    }

    //回合结束 删除BUFF
    for (let index = 0; index < remove_buff.length; index++) {
        let buffEntity: BuffEntity = remove_buff[index];
        let data_idx = buff_ary.indexOf(buffEntity);

        if (process.env.FIGHT_LOG == "TRUE") {
            Logger.fightlog(roleid, `[${targetEntity.data['name']}  移除了BUFF[${buffEntity.data.name}] `);
        }
        removeBuff(buffEntity.id, targetEntity, actlist, data_idx)
    }

}

export function executeAllBuff(roleid: string, trigger: EBuffTrigger, fightObjs_pos: FightObjEntity[], actlist: FightActEntity[]) {

    for (let index = 0; index < fightObjs_pos.length; index++) {
        let actInfo: FightObjEntity = fightObjs_pos[index];
        if (!actInfo || !actInfo.id) { continue; }

        if (actInfo.tAttr[TableGameAttr.curhp] <= 0) { continue; }

        if (actInfo.objType === EObjtype.RARE_MONSTER) { continue; }

        executeBuff(roleid, trigger, actInfo, actlist);
    }
}