import { check } from "prettier";
import { EActType, ETaskDataType, ETaskTriggerType, ETaskType } from "../../config/game-enum";
import { TableGameConfig } from "../../config/gameTable/TableGameConfig";
import { TableGameHero } from "../../config/gameTable/TableGameHero";
import { TableMedalUplevel } from "../../config/gameTable/TableMedalUplevel";
import { TableRoleUpgrade } from "../../config/gameTable/TableRoleUpgrade";
import { TableTask } from "../../config/gameTable/TableTask";
import { TableTaskTarget } from "../../config/gameTable/TableTaskTarget";
import { TableTaskTargetType } from "../../config/gameTable/TableTaskTargetType";
import { OpenWelfareEntity, RoleInfoEntity } from "../../game-data/entity/roleinfo.entity";
import { TaskDailyEntity, TaskEntity, TaskExInfoEntity, TaskGuildEntity, TaskMainEntity } from "../../game-data/entity/task.entity";
import { cGameCommon, RetRoleALLInfo } from "../game-common";

export class RetUpdateTask {

    /**是否有更新任务累计标记 有就有存储内存数据*/
    isUpdateTag: boolean = false;

    /**主线任务是否有更新 */
    isUpdateTaskMain: boolean = false;

    /**关卡任务是否有更新 */
    isUpdateTaskLevel: boolean = false;

    /**每日任务是否有更新 */
    isUpdateTaskDaily: boolean = false;

    /**公会任务是否有更新 */
    isUpdateTaskGuild: boolean = false;


    /**进阶任务是否有更新 */
    isUpdateTaskUpgrade: boolean = false;

    /**开服福利任务是否有更新 */
    isUpdateOpenWelfare: boolean = false;

    getIsUpdate() {
        return this.isUpdateTag || this.isUpdateTaskMain || this.isUpdateTaskDaily || this.isUpdateTaskUpgrade || this.isUpdateOpenWelfare || this.isUpdateTaskGuild;
    }
}

export const cTaskSystem = {

    /**
     * 初始化主线任务
     * @param roleinfo 
     * @returns 
     */
    initTaskMain(retRoleALLInfo: RetRoleALLInfo) {

        if (!retRoleALLInfo.isHaveData()) { return; }

        let taskMain = new TaskMainEntity();

        let taskId = TableGameConfig.init_task_main;

        taskMain.curEntity = cTaskSystem.newTaskEntity(taskId, retRoleALLInfo);

        return taskMain;
    },

    /**
     * 初始化关卡任务
     * @param roleinfo 
     * @returns 
     */
    initTaskLevel(retRoleALLInfo: RetRoleALLInfo) {

        if (!retRoleALLInfo.isHaveData()) { return; }
        let roleSubInfo = retRoleALLInfo.roleSubInfo
        roleSubInfo.TaskLevel = new TaskMainEntity();

        let taskId = TableGameConfig.init_task_level;

        roleSubInfo.TaskLevel.curEntity = cTaskSystem.newTaskEntity(taskId, retRoleALLInfo);

    },

    /**
     * 初始化每日任务
     * @param roleinfo 
     */
    initTaskDaily(retRoleALLInfo: RetRoleALLInfo) {

        if (!retRoleALLInfo.isHaveData()) { return; }
        let roleSubInfo = retRoleALLInfo.roleSubInfo

        if (roleSubInfo.taskDaily) {
            delete roleSubInfo.taskDaily;
        }

        roleSubInfo.taskDaily = new TaskDailyEntity();

        let task_data = TableTask.getTable()
        for (const taskid in task_data) {
            if (Object.prototype.hasOwnProperty.call(task_data, taskid)) {
                const cur_data = task_data[taskid];
                if (cur_data.type != ETaskType.DAILY) { continue; }
                let taskid_int = Number(taskid);
                roleSubInfo.taskDaily.tasklist[taskid_int] = cTaskSystem.newTaskEntity(taskid_int, retRoleALLInfo);
            }
        }

    },

    /**初始化/重置 进阶任务 */
    initTaskUpgrade(retRoleALLInfo: RetRoleALLInfo) {

        if (!retRoleALLInfo.isHaveData()) { return; }
        let roleSubInfo = retRoleALLInfo.roleSubInfo

        if (!roleSubInfo.upgrade) {
            return;
        }

        if (roleSubInfo.taskUpgrade) {
            delete roleSubInfo.taskUpgrade;
        }
        roleSubInfo.taskUpgrade = [];

        if (!TableRoleUpgrade.checkHave(roleSubInfo.upgrade)) {
            return;
        }

        let task_ary = TableRoleUpgrade.getVal(roleSubInfo.upgrade, TableRoleUpgrade.field_task);

        for (let index = 0; index < task_ary.length; index++) {
            const task_id = task_ary[index];
            let cut_task = cTaskSystem.newTaskEntity(task_id, retRoleALLInfo);
            if (cut_task) {
                roleSubInfo.taskUpgrade.push(cut_task);
            }
        }

    },

    /**初始化 隐藏任务 */
    initTaskHide(retRoleALLInfo: RetRoleALLInfo) {

        if (!retRoleALLInfo.isHaveData()) { return; }
        let roleSubInfo = retRoleALLInfo.roleSubInfo

        if (roleSubInfo.taskHide) {
            delete roleSubInfo.taskHide;
        }
        roleSubInfo.taskHide = [];

        const htCfg = TableGameConfig.hide_task;
        for (let index = 0; index < htCfg.length; index++) {
            const task_id = htCfg[index];
            let cut_task = cTaskSystem.newTaskEntity(task_id, retRoleALLInfo);
            if (cut_task) {
                roleSubInfo.taskHide.push(cut_task);
            }
        }
    },


    /**
     * 初始化开服福利任务
     * @param roleinfo 
     */
    initOpenWelfare(retRoleALLInfo: RetRoleALLInfo) {

        if (!retRoleALLInfo.isHaveData()) { return; }
        let roleSubInfo = retRoleALLInfo.roleSubInfo

        roleSubInfo.openWelfare = new OpenWelfareEntity();

        let task_data = TableTask.getTable();
        for (const taskid in task_data) {
            if (Object.prototype.hasOwnProperty.call(task_data, taskid)) {
                const cur_data = task_data[taskid];
                if (cur_data.type != ETaskType.OPEN_WELFARE) { continue; }
                let taskid_int = Number(taskid);
                roleSubInfo.openWelfare.tasklist[taskid_int] = cTaskSystem.newTaskEntity(taskid_int, retRoleALLInfo);
            }
        }

    },


    initTaskGuild(retRoleALLInfo: RetRoleALLInfo) {

        if (!retRoleALLInfo.isHaveData()) { return; }
        let roleSubInfo = retRoleALLInfo.roleSubInfo

        if (roleSubInfo.taskGuild) {
            delete roleSubInfo.taskGuild;
        }

        roleSubInfo.taskGuild = new TaskGuildEntity();

        let task_data = TableTask.getTable()
        for (const taskid in task_data) {
            if (Object.prototype.hasOwnProperty.call(task_data, taskid)) {
                const cur_data = task_data[taskid];
                if (cur_data.type != ETaskType.GUILD) { continue; }
                let taskid_int = Number(taskid);
                roleSubInfo.taskGuild.tasklist[taskid_int] = cTaskSystem.newTaskEntity(taskid_int, retRoleALLInfo);
            }
        }

    },

    /**
     * 创建任务实体
     * @param taskId 
     * @param roleinfo 
     * @returns 
     */
    newTaskEntity(taskId: number, retRoleALLInfo: RetRoleALLInfo) {

        if (!TableTask.checkHave(taskId)) { return; }

        if (!retRoleALLInfo.isHaveData()) { return; }

        let roleSubInfo = retRoleALLInfo.roleSubInfo;

        let curEntity = new TaskEntity();
        curEntity.id = taskId;

        let tableTask = new TableTask(taskId);

        curEntity.count = {};
        for (let index = 0; index < tableTask.target.length; index++) {
            const target_id = tableTask.target[index];
            curEntity.count[target_id] = 0;

            let target_table = new TableTaskTarget(target_id);
            if (!TableTaskTargetType.checkHave(target_table.type)) { continue; }
            let target_type_table = new TableTaskTargetType(target_table.type);

            if (target_type_table.datatype !== ETaskDataType.NONE) {
                let new_count = cTaskSystem.isTaskDataTypeOk(target_type_table.datatype, retRoleALLInfo, target_table);
                curEntity.count[target_id] = new_count;
                continue;
            }

            if (target_type_table.triggertype === ETaskTriggerType.ALWAYS) {
                curEntity.count[target_table.id] = Math.min(roleSubInfo.taskTargetTag[target_table.type], target_table.val);
                continue;
            }

            if (target_type_table.id === TableTaskTargetType.skill_setup) {
                //已经佩戴过的技能也算
                if (!retRoleALLInfo.roleHero) { continue; }
                let new_count = 0;
                for (const key in retRoleALLInfo.roleHero) {
                    if (Object.prototype.hasOwnProperty.call(retRoleALLInfo.roleHero, key)) {
                        const heroEntity = retRoleALLInfo.roleHero[key];
                        if (!heroEntity.skill) { continue; }
                        for (const skillkey in heroEntity.skill) {
                            if (Object.prototype.hasOwnProperty.call(heroEntity.skill, skillkey)) {
                                if (Number(skillkey) <= 0) { continue; }
                                new_count += 1;
                            }
                        }
                    }
                }
                curEntity.count[target_id] = Math.min(target_table.val, new_count);
            }

        }

        return curEntity;
    },

    /**
   * 任务是否完成
   * @param taskEntity 
   * @returns 
   */
    taskIsFinish(taskEntity: TaskEntity) {

        if (taskEntity === undefined || taskEntity.count === undefined) {
            return false;
        }

        for (const targetId in taskEntity.count) {
            if (Object.prototype.hasOwnProperty.call(taskEntity.count, targetId)) {
                let int_targetId = Number(targetId);
                if (!TableTaskTarget.checkHave(int_targetId)) {
                    return false;
                }
                //根据任务目标表 查需要的目标次数
                const max_count = TableTaskTarget.getVal(int_targetId, TableTaskTarget.field_val);
                const cur_count = taskEntity.count[targetId];
                if (cur_count < max_count) {
                    return false;
                }
            }
        }

        return true;
    },

    /**进阶任务是否完成 */
    taskUpgradeIsFinish(taskUpgrade: TaskEntity[]) {
        if (!taskUpgrade || taskUpgrade.length == 0) {
            return false;
        }

        for (let index = 0; index < taskUpgrade.length; index++) {
            let task_entity = taskUpgrade[index];
            let is_finsh = this.taskIsFinish(task_entity);
            if (!is_finsh) { return false; }
        }

        return true;
    },


    /**
     * 初始化任务全局累计计数
     * @param roleinfo 
     * @returns 
     */
    initTaskTargetType(retRoleALLInfo: RetRoleALLInfo) {

        if (!retRoleALLInfo.isHaveData()) { return; }

        retRoleALLInfo.roleSubInfo.taskTargetTag = retRoleALLInfo.roleSubInfo.taskTargetTag || {}
        const target_table = TableTaskTargetType.getTable();
        for (const targetType in target_table) {
            if (Object.prototype.hasOwnProperty.call(target_table, targetType)) {
                const cur_table = new TableTaskTargetType(Number(targetType));
                if (cur_table.triggertype !== ETaskTriggerType.ALWAYS) { continue; }
                if (cur_table.act == undefined) { continue; }
                retRoleALLInfo.roleSubInfo.taskTargetTag[Number(targetType)] = 0;
            }
        }

    },

    /**
     * 更新任务计数
     * @param eActType 
     * @param roleinfo 
     * @param isFinish 玩家行为是否要执行完成才计算
     * @returns 
     */
    updateTaskTag(eActType: EActType, retRoleALLInfo: RetRoleALLInfo, isFinish: boolean, taskCount: number, exinfo: TaskExInfoEntity) {

        retRoleALLInfo.need_roleInfo = true;
        retRoleALLInfo.need_roleHero = true;
        if (!retRoleALLInfo || !retRoleALLInfo.isHaveData()) {
            return new RetUpdateTask();
        }

        let roleSubInfo = retRoleALLInfo.roleSubInfo;

        let retUpdateTask: RetUpdateTask = new RetUpdateTask();
        //检测更新永久累计次数
        const target_table = TableTaskTargetType.getTable();
        for (const targetType in target_table) {
            if (Object.prototype.hasOwnProperty.call(target_table, targetType)) {

                const cur_table = new TableTaskTargetType(Number(targetType));
                if (cur_table.triggertype !== ETaskTriggerType.ALWAYS) { continue; }
                let cur_isFinish = cur_table.isfinish === 1 ? true : false;
                //是否需要完成执行业务
                if (cur_isFinish === true && !isFinish) { continue; }
                if (cur_table.act == undefined) { continue; }
                roleSubInfo.taskTargetTag[Number(targetType)] = roleSubInfo.taskTargetTag[Number(targetType)] || 0;
                for (let index = 0; index < cur_table.act.length; index++) {
                    const cur_type = cur_table.act[index];
                    if (cur_type !== eActType) { continue; }
                    //只要触发就计算
                    roleSubInfo.taskTargetTag = roleSubInfo.taskTargetTag || {};
                    let new_taskCount = taskCount;
                    if (cur_type === EActType.PS_GO_ACT) {
                        if (TableTaskTargetType.ps_damage === cur_table.id) {
                            if (taskCount === 1) {
                                continue;
                            }
                        }
                        else {
                            new_taskCount = 1;
                        }
                    }

                    roleSubInfo.taskTargetTag[Number(targetType)] += new_taskCount;
                    retUpdateTask.isUpdateTag = true;
                    //一种行动类型只算一次计数
                    break;
                }
            }
        }

        //主线任务
        if (roleSubInfo.taskMain && roleSubInfo.taskMain.curEntity) {
            retUpdateTask.isUpdateTaskMain = cTaskSystem.checkTaskEntity(roleSubInfo.taskMain.curEntity, eActType, retRoleALLInfo, isFinish, taskCount, exinfo);
            if (exinfo.roleAddExp && exinfo.roleAddExp.newHero) {
                let is_update_main = cTaskSystem.checkTaskEntity(roleSubInfo.taskMain.curEntity, EActType.HERO_MAIN_LVUP, retRoleALLInfo, isFinish, taskCount, exinfo);
                if (is_update_main) {
                    retUpdateTask.isUpdateTaskMain = is_update_main;
                }
            }
        }

        //关卡任务
        if (roleSubInfo.TaskLevel && roleSubInfo.TaskLevel.curEntity) {
            retUpdateTask.isUpdateTaskLevel = cTaskSystem.checkTaskEntity(roleSubInfo.TaskLevel.curEntity, eActType, retRoleALLInfo, isFinish, taskCount, exinfo);
        }

        //日常任务
        if (roleSubInfo.taskDaily) {
            let cur_tasklist = roleSubInfo.taskDaily.tasklist;
            for (const taskid in cur_tasklist) {
                if (Object.prototype.hasOwnProperty.call(cur_tasklist, taskid)) {
                    let taskEntity = cur_tasklist[taskid];
                    let is_update = cTaskSystem.checkTaskEntity(taskEntity, eActType, retRoleALLInfo, isFinish, taskCount, exinfo);
                    if (is_update && !retUpdateTask.isUpdateTaskDaily) {
                        retUpdateTask.isUpdateTaskDaily = is_update;
                    }
                    if (exinfo.roleAddExp && exinfo.roleAddExp.newHero) {
                        is_update = cTaskSystem.checkTaskEntity(taskEntity, EActType.HERO_MAIN_LVUP, retRoleALLInfo, isFinish, taskCount, exinfo);
                        if (is_update && !retUpdateTask.isUpdateTaskDaily) {
                            retUpdateTask.isUpdateTaskDaily = is_update;
                        }
                    }

                }
            }

        }

        //公会任务
        if (roleSubInfo.taskGuild) {
            let cur_tasklist = roleSubInfo.taskGuild.tasklist;
            for (const taskid in cur_tasklist) {
                if (Object.prototype.hasOwnProperty.call(cur_tasklist, taskid)) {
                    let taskEntity = cur_tasklist[taskid];
                    let is_update = cTaskSystem.checkTaskEntity(taskEntity, eActType, retRoleALLInfo, isFinish, taskCount, exinfo);
                    if (is_update && !retUpdateTask.isUpdateTaskGuild) {
                        retUpdateTask.isUpdateTaskGuild = is_update;
                    }
                    if (exinfo.roleAddExp && exinfo.roleAddExp.newHero) {
                        is_update = cTaskSystem.checkTaskEntity(taskEntity, EActType.HERO_MAIN_LVUP, retRoleALLInfo, isFinish, taskCount, exinfo);
                        if (is_update && !retUpdateTask.isUpdateTaskGuild) {
                            retUpdateTask.isUpdateTaskGuild = is_update;
                        }
                    }

                }
            }

        }

        //进阶任务
        if (roleSubInfo.taskUpgrade && roleSubInfo.taskUpgrade.length > 0) {
            for (let index = 0; index < roleSubInfo.taskUpgrade.length; index++) {
                let taskEntity = roleSubInfo.taskUpgrade[index];
                let is_update = cTaskSystem.checkTaskEntity(taskEntity, eActType, retRoleALLInfo, isFinish, taskCount, exinfo);
                if (is_update && !retUpdateTask.isUpdateTaskUpgrade) {
                    retUpdateTask.isUpdateTaskUpgrade = is_update;
                }
                if (exinfo.roleAddExp && exinfo.roleAddExp.newHero) {
                    is_update = cTaskSystem.checkTaskEntity(taskEntity, EActType.HERO_MAIN_LVUP, retRoleALLInfo, isFinish, taskCount, exinfo);
                    if (is_update && !retUpdateTask.isUpdateTaskUpgrade) {
                        retUpdateTask.isUpdateTaskUpgrade = is_update;
                    }
                }
            }
        }

        //隐藏任务
        if (roleSubInfo.taskHide && roleSubInfo.taskHide.length > 0) {
            for (let index = 0; index < roleSubInfo.taskHide.length; index++) {
                let taskEntity = roleSubInfo.taskHide[index];
                let is_update = cTaskSystem.checkTaskEntity(taskEntity, eActType, retRoleALLInfo, isFinish, taskCount, exinfo);

                if (exinfo.roleAddExp && exinfo.roleAddExp.newHero) {
                    is_update = cTaskSystem.checkTaskEntity(taskEntity, EActType.HERO_MAIN_LVUP, retRoleALLInfo, isFinish, taskCount, exinfo);

                }
            }
        }

        //开服福利任务
        if (roleSubInfo.openWelfare && roleSubInfo.openWelfare.tasklist) {
            let cur_tasklist = roleSubInfo.openWelfare.tasklist;
            for (const taskid in cur_tasklist) {
                if (Object.prototype.hasOwnProperty.call(cur_tasklist, taskid)) {
                    let taskEntity = cur_tasklist[taskid];
                    let is_update = cTaskSystem.checkTaskEntity(taskEntity, eActType, retRoleALLInfo, isFinish, taskCount, exinfo);
                    if (is_update && !retUpdateTask.isUpdateOpenWelfare) {
                        retUpdateTask.isUpdateOpenWelfare = is_update;
                    }
                    if (exinfo.roleAddExp && exinfo.roleAddExp.newHero) {
                        is_update = cTaskSystem.checkTaskEntity(taskEntity, EActType.HERO_MAIN_LVUP, retRoleALLInfo, isFinish, taskCount, exinfo);
                        if (is_update && !retUpdateTask.isUpdateOpenWelfare) {
                            retUpdateTask.isUpdateOpenWelfare = is_update;
                        }
                    }

                }
            }

        }

        return retUpdateTask;
    },

    checkTaskEntity(taskEntity: TaskEntity, eActType: EActType, retRoleALLInfo: RetRoleALLInfo, isFinish: boolean, taskCount: number, exinfo: TaskExInfoEntity) {

        if (!retRoleALLInfo.isHaveData() || !taskEntity) {
            return false;
        }

        if (!TableTask.checkHave(taskEntity.id)) {
            return false;
        }

        let is_update = false;
        let roleSubInfo = retRoleALLInfo.roleSubInfo;
        //更新任务计数
        for (const targetId in taskEntity.count) {
            if (Object.prototype.hasOwnProperty.call(taskEntity.count, targetId)) {
                let int_targetId = Number(targetId);
                if (!TableTaskTarget.checkHave(int_targetId)) {
                    continue;
                }

                let target_table = new TableTaskTarget(int_targetId);
                //已完成的跳过
                const cur_count = taskEntity.count[int_targetId];
                if (cur_count >= target_table.val) { continue; }
                if (!TableTaskTargetType.checkHave(target_table.type)) { continue; }

                let target_type_table = new TableTaskTargetType(target_table.type);
                if (target_type_table.act == undefined) { continue; }
                let cur_isFinish = target_type_table.isfinish === 1 ? true : false;
                //是否需要完成执行业务
                if (cur_isFinish === true && !isFinish) { continue; }

                if (target_type_table.datatype !== ETaskDataType.NONE) {
                    for (let index = 0; index < target_type_table.act.length; index++) {
                        const cur_type = target_type_table.act[index];
                        if (cur_type !== eActType) { continue; }
                        let new_count = cTaskSystem.isTaskDataTypeOk(target_type_table.datatype, retRoleALLInfo, target_table);
                        if (new_count === 0) { continue; }
                        if (taskEntity.count[target_table.id] === new_count) { continue; }
                        taskEntity.count[target_table.id] = new_count;
                        is_update = true;
                    }
                    continue;
                }

                if (target_type_table.triggertype === ETaskTriggerType.EXECUTING) {
                    //临时计数  
                    for (let index = 0; index < target_type_table.act.length; index++) {
                        const cur_type = target_type_table.act[index];
                        if (cur_type !== eActType) { continue; }
                        let new_task_count = taskCount;
                        if (target_table.val2 !== 0) {
                            new_task_count = cTaskSystem.isTaskVal2Ok(target_table, exinfo);
                            if (!new_task_count) { continue; }
                        }

                        if (cur_type === EActType.PS_GO_ACT) {
                            if (TableTaskTargetType.ps_damage === target_type_table.id) {
                                if (taskCount === 1) {
                                    continue;
                                }
                            }
                            else {
                                new_task_count = 1;
                            }
                        }

                        taskEntity.count[target_table.id] += new_task_count;
                        is_update = true;
                    }
                    continue;
                }

                if (target_type_table.triggertype === ETaskTriggerType.ALWAYS) {
                    //永久累计计数
                    for (let index = 0; index < target_type_table.act.length; index++) {
                        const cur_type = target_type_table.act[index];
                        if (cur_type !== eActType) { continue; }
                        //同步参数
                        taskEntity.count[target_table.id] = roleSubInfo.taskTargetTag[target_table.type];
                        is_update = true;
                    }
                    continue;
                }

            }
        }


        return is_update;
    },

    /**扩展类型 是否符合计数条件*/
    isTaskVal2Ok(target_table: TableTaskTarget, exinfo: TaskExInfoEntity) {

        //任务计数
        let task_count: number = 0;
        //获得道具
        if (target_table.type === TableTaskTargetType.add_item) {
            if (!exinfo.additem || Object.keys(exinfo.additem).length == 0) { return task_count; }

            for (const itemkey in exinfo.additem) {
                if (Object.prototype.hasOwnProperty.call(exinfo.additem, itemkey)) {
                    if (target_table.val2 === Number(itemkey)) {
                        task_count += exinfo.additem[itemkey];
                        break;
                    }
                }
            }
            return task_count;
        }

        //指定英雄升级次数
        if (target_table.type === TableTaskTargetType.hero_lv) {

            let main_hero_id = TableGameConfig.initRole[0];
            let main_hero_table = new TableGameHero(Number(main_hero_id));
            let cur_hero_table: TableGameHero;
            if (target_table.val2 === main_hero_table.group) {
                //是否是主角英雄
                if (!exinfo.roleAddExp) { return task_count; }
                if (!exinfo.roleAddExp.newHero) { return task_count; }
                if (!TableGameHero.checkHave(exinfo.roleAddExp.newHero.id)) {
                    return task_count;
                }
                cur_hero_table = new TableGameHero(exinfo.roleAddExp.newHero.id);
            }
            else {

                //因为之前已经有了英雄升级筛选 所以肯定是英雄升级类型回复的hero
                if (!exinfo.lvup_hero) { return task_count; }
                if (!TableGameHero.checkHave(exinfo.lvup_hero.id)) {
                    return task_count;
                }
                cur_hero_table = new TableGameHero(exinfo.lvup_hero.id);
            }


            if (target_table.val2 === cur_hero_table.group) {
                task_count = 1;
            }
            return task_count;
        }

        //购买商品
        if (target_table.type === TableTaskTargetType.shop_buy) {

            if (!exinfo.buy_shopid) { return task_count; }

            for (let index = 0; index < target_table.val2.length; index++) {
                const shopid = target_table.val2[index];
                if (shopid === exinfo.buy_shopid) {
                    task_count = 1;
                    break;
                }
            }
            return task_count;
        }

        if (exinfo.sell_equip_num != undefined && target_table.type === TableTaskTargetType.sell_equip_num) {
            task_count = exinfo.sell_equip_num;
            return task_count;
        }

        return task_count;

    },

    isTaskDataTypeOk(datatype: ETaskDataType, retRoleALLInfo: RetRoleALLInfo, tableTaskTarget: TableTaskTarget) {

        if (datatype === ETaskDataType.NONE) {
            return 0;
        }

        if (!retRoleALLInfo.checkData(true, true)) {
            return 0;
        }

        let roleSubInfo = retRoleALLInfo.roleSubInfo
        let rval: any
        switch (datatype) {
            case ETaskDataType.GANME_LEVELS:
                if (retRoleALLInfo.roleInfo.gamelevels >= tableTaskTarget.val) {
                    return tableTaskTarget.val;
                }
                else {
                    return 0;
                }
            case ETaskDataType.ELITE_LEVELS:
                if (roleSubInfo.elitelevels === undefined) { return 0; }

                if (roleSubInfo.elitelevels >= tableTaskTarget.val) {
                    return tableTaskTarget.val;
                }
                else {
                    return 0;
                }

            case ETaskDataType.EBOX_LV:
                if (roleSubInfo.ebox === undefined) { return 0; }
                if (roleSubInfo.ebox.lv >= tableTaskTarget.val) {
                    return tableTaskTarget.val;
                }
                else {
                    return roleSubInfo.ebox.lv;
                }
            case ETaskDataType.MEDAL_LV:
                if (roleSubInfo.medalInfo === undefined) {
                    return 0
                }

                if (!TableMedalUplevel.checkHave(roleSubInfo.medalInfo.mid)) {
                    return 0;
                }
                let medal_table = new TableMedalUplevel(roleSubInfo.medalInfo.mid);
                if (medal_table.lv >= tableTaskTarget.val) {
                    return tableTaskTarget.val;
                }
                else {
                    return medal_table.lv;
                }
            case ETaskDataType.HERO_LV:
                if (!retRoleALLInfo.roleHero) { return 0 }

                for (const heroid in retRoleALLInfo.roleHero) {
                    if (Object.prototype.hasOwnProperty.call(retRoleALLInfo.roleHero, heroid)) {
                        if (!TableGameHero.checkHave(Number(heroid))) { continue };
                        let table_hero = new TableGameHero(Number(heroid));
                        if (tableTaskTarget.val2 !== table_hero.group) { continue };
                        if (table_hero.lv >= tableTaskTarget.val) {
                            return tableTaskTarget.val;
                        }
                        else {
                            return table_hero.lv;
                        }
                    }
                }
                return 0;
            case ETaskDataType.GRADE_LV:
                let grade = retRoleALLInfo.roleInfo?.info?.upgrade || 0;
                if (grade >= tableTaskTarget.val) {
                    return tableTaskTarget.val;
                }
                else {
                    return 0;
                }
            case ETaskDataType.CHARGE_TOTAL_NUM:
                let cur_num = retRoleALLInfo.roleInfo.info?.rechargeInfo.totalAmounts
                if (cur_num >= tableTaskTarget.val) {
                    return tableTaskTarget.val;
                }
                else {
                    return cur_num;
                }
            case ETaskDataType.PS_KILL_SHIP:
                let num = roleSubInfo.pirateShip?.killNum ?? 0
                return num >= tableTaskTarget.val ? tableTaskTarget.val : num;
            case ETaskDataType.DEMON_ABYSS_LV:
                let lv = roleSubInfo.demonAbyss?.da_levels ?? 0
                return (lv > 0 ? lv - 50000 : 0);
            case ETaskDataType.DAM_AEMON_ABYSS:
                rval = roleSubInfo.reDayInfo?.ad_damage ?? 0
                return rval
            case ETaskDataType.FINISH_AUREOLE_LV:
                rval = roleSubInfo.aureole?.id ?? 0
                return rval % 1000
            case ETaskDataType.RARE_MONSTER_NUM:
                rval = roleSubInfo.raremst?.id?.length ?? 0
                return rval
            default:
                break;
        }

        return 0

    },
}