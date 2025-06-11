import { Injectable } from '@nestjs/common';
import { JsonUtil } from "./JsonUtil";
import { loadAllJsonTS } from "../config/gameTable/LoadAllJsonTs";
import { TableGameEquip } from '../config/gameTable/TableGameEquip';
import { TableGameItem } from '../config/gameTable/TableGameItem';
import { EItemType, ETaskType } from '../config/game-enum';
import { TableTask } from '../config/gameTable/TableTask';
import { TablePirateShipCell } from '../config/gameTable/TablePirateShipCell';
import { TablePirateShipShell } from '../config/gameTable/TablePirateShipShell';
import { TableGameSkill } from '../config/gameTable/TableGameSkill';
import { kMaxLength } from 'buffer';

@Injectable()
export class GameConfigService {

    private equipDataByLv: Record<number, any[]>
    private skillDataByQuality: Record<number, any[]>
    /**每日任务 */
    private taskDaily: Record<number, any[]>
    /**开服福利任务 */
    private taskOpenWelfare: Record<number, any[]>

    /**夺宝大作战 格子配置数据 */
    private psPoslist: Record<number, number>
    /**夺宝大作战 根据表配置 计算出的空格子集合列表  格子ID ,1*/
    private psEmptyPoslist: Record<number, number>

    /**夺宝大作战 炮弹配置 */
    private psShellByType: Record<number, any>;
    //异兽碎片
    private raremstItems: Record<number, number[]> = {};

    //技能组
    private skillGroup: Record<number, number[]> = {};
    constructor() {
        this.loadAllJson()
    }

    async loadAllJson() {

        console.log("===========loadAllJson 开始加载数据表=============")
        await loadAllJsonTS();

        // var gameAttr = JsonUtil.get("GameAttr");
        // var gameHero = JsonUtil.get("GameHero");
        // console.log('gameAttr.hp',gameAttr.hp)
        // console.log('gameHero.hp',gameHero['1001'].hp)
        // var total_attr:any = {}
        // var hero_att:any = gameHero['1001']
        // for (const key in hero_att) {
        //     console.log("key:",key);
        //     console.log("var:",hero_att[key]);
        // }
        //var init_hero = TableGameConfig.getVal(TableGameConfig.initRole,TableGameConfig.field_info)
        //console.log("init_hero:",init_hero[0]);

        let equip_data = TableGameEquip.getTable()
        this.equipDataByLv = {}
        for (const equipId in equip_data) {
            if (Object.prototype.hasOwnProperty.call(equip_data, equipId)) {
                const data = equip_data[equipId];

                if (!this.equipDataByLv[data.level]) {
                    this.equipDataByLv[data.level] = [];
                }
                data.id = equipId
                this.equipDataByLv[data.level].push(data);
            }
        }
        //console.log(this.equipDataByLv)

        let item_data = TableGameItem.getTable()
        this.skillDataByQuality = {}
        for (const itemId in item_data) {
            if (Object.prototype.hasOwnProperty.call(item_data, itemId)) {
                const data = item_data[itemId];

                if (data.type == EItemType.SKILL) {
                    if (!this.skillDataByQuality[data.quality]) {
                        this.skillDataByQuality[data.quality] = [];
                    }
                    data.id = itemId
                    this.skillDataByQuality[data.quality].push(data);
                }
                if (data.type == EItemType.RARE_MST) {
                    if (this.raremstItems[data.quality] == undefined) {
                        this.raremstItems[data.quality] = [];
                    }
                    this.raremstItems[data.quality].push(Number(itemId));
                }

            }
        }
        //console.log(this.skillDataByQuality)

        let task_data = TableTask.getTable();
        this.taskDaily = {}
        this.taskOpenWelfare = {}
        for (const taskid in task_data) {
            if (Object.prototype.hasOwnProperty.call(task_data, taskid)) {
                const cur_data = task_data[taskid];
                cur_data.id = Number(taskid);

                if (cur_data.type == ETaskType.DAILY) {
                    this.taskDaily[cur_data.id] = cur_data;
                }
                else if (cur_data.type == ETaskType.OPEN_WELFARE) {
                    this.taskOpenWelfare[cur_data.id] = cur_data;
                }

            }
        }

        //夺宝大作战
        let psPoslist = TablePirateShipCell.getTable();
        this.psPoslist = {};
        this.psEmptyPoslist = {};
        for (const key in psPoslist) {
            if (Object.prototype.hasOwnProperty.call(psPoslist, key)) {
                const cur_data = psPoslist[key];
                this.psPoslist[key] = cur_data.itemtype;
                if (cur_data.itemtype === 0) {
                    this.psEmptyPoslist[key] = 1;
                }
            }
        }

        let psShelTable = TablePirateShipShell.getTable();
        this.psShellByType = {}
        for (const key in psShelTable) {
            if (Object.prototype.hasOwnProperty.call(psShelTable, key)) {
                const cur_data = psShelTable[key];
                cur_data.id = key;
                this.psShellByType[cur_data.type] = this.psShellByType[cur_data.type] || {};
                this.psShellByType[cur_data.type][cur_data.lv] = cur_data;
            }
        }

        for (const k in TableGameSkill.getTable()) {
            let d = new TableGameSkill(Number(k));
            let g = this.skillGroup[d.group] || [];
            g.push(d.id);
            this.skillGroup[d.group] = g;
        }
        for (const k in this.skillGroup) {
            this.skillGroup[Number(k)].sort((a, b) => a - b);
        }
    }

    getPSEmptyPoslist() {
        return this.psEmptyPoslist;
    }

    getPSPosList() {
        return this.psPoslist;
    }

    getPsShellByType(sType: number) {
        return this.psShellByType[sType];
    }

    getPsShellData(sType: number, lv: number) {

        if (!this.psShellByType[sType] || !this.psShellByType[sType][lv]) {
            return null;
        }
        return this.psShellByType[sType][lv];
    }

    /**获取所有每日任务 */
    getTaskDaily() {
        return this.taskDaily;
    }

    /**获取所有开服福利任务 */
    getTaskOpenWelfare() {
        return this.taskOpenWelfare;
    }

    getEquipsAryByLv(level: number) {
        return this.equipDataByLv[level];
    }

    getSkillsByQuality(quality: number) {
        return this.skillDataByQuality[quality];
    }

    getRareMonterItem() {
        return this.raremstItems;
    }

    getSkillGroup() {
        return this.skillGroup;
    }

    getGameJson(tableName: string) {
        return JsonUtil.get(tableName);
    }

}
