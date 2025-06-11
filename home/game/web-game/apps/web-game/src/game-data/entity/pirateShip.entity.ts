import { ApiProperty } from "@nestjs/swagger";
import { EPSActType } from "../../config/game-enum";
import { TableGameConfig } from "../../config/gameTable/TableGameConfig";
import { TablePirateShip } from "../../config/gameTable/TablePirateShip";
import { cTools } from "../../game-lib/tools";
import { GRecordNN } from "./common.entity";
import { ItemsRecord } from "./item.entity";

export class PSBuffEntity {

    constructor(bufftype: number, id: number) {
        this.id = id;
        this.type = bufftype;
    }

    /**BUFF-唯一ID*/
    id: number;

    /**BUFF-道具类型（炮弹双倍等）*/
    type: number;

    /**等级 对应炮弹等级 算伤害用*/
    lv?: number;

    /**持续回合数 */
    count: number;

    /**持有无限回合 只生效一回合 */
    once?: boolean;
}

/**夺宝大作战 行动信息 */
export class PSActEntity {

    constructor(actType: EPSActType) {
        this.act = actType;
    }

    setDamage(damage: number, damage_itemid: number) {
        this.damage = damage;
        this.damage_itemid = damage_itemid;
    }

    /**行动类型*/
    act: EPSActType;

    /**移动格子到新坐标 */
    newpos?: number;

    /**每移动5次 随机产生的道具  格子ID，道具ID */
    newpos_itemid?: GRecordNN;

    /**能量变化 大于0:移动了多少格子加多少能量 小于0:发送能量炮击后减去 */
    change_energy: number;

    /**获得格子上的道具*/
    additmes?: ItemsRecord;

    /**新的海盗船ID */
    new_shipId?: number;

    /**对海盗船伤害 */
    damage?: number;

    /**对海盗船造成伤害的道具ID 或 炮弹类型ID*/
    damage_itemid?: number;

    /**添加BUFF */
    add_buff?: PSBuffEntity;

    /**删除BUFF 唯一ID*/
    remove_buff?: number[];

    /**新的战斗信息 EPSActType.NEXT_SHIP 切换到下一个海盗船的时候会发*/
    new_fightInfo?: PSFightEntity;
}

export class PSFightEntity {

    constructor(shipId: number) {
        this.hp = TablePirateShip.getVal(shipId, TablePirateShip.field_hp);
        this.buff = [];
    }

    /**当前海盗船剩余血量 */
    hp: number = 0;

    /**海盗船BUFF信息 */
    buff: PSBuffEntity[];

    /**BUFF 唯一ID 增长计数*/
    buff_idtag = 1;
}

/**夺宝大作战 */
export class PirateShipRoleEntity {

    constructor(season: number, sTime: string) {

        this.shipId = 1;
        this.fightInfo = new PSFightEntity(this.shipId);
        this.shellInfo = {};
        this.shellInfo[TableGameConfig.ps_item_nshell] = 1;
        this.shellInfo[TableGameConfig.ps_item_bshell] = 1;
        this.shellInfo[TableGameConfig.ps_item_tshell] = 1;
        this.rankDAT = cTools.newLocalDate0String();
        this.season = season;
        this.sTime = sTime;
        this.killNum = 0;
    }

    /**开启时间 */
    @ApiProperty({ description: '开启时间' })
    sTime: string;

    /**赛季id */
    @ApiProperty({ description: '赛季id' })
    season: number = 1;


    /**玩家格子坐标 */
    @ApiProperty({ description: '玩家格子坐标' })
    pos: number = 1;

    /**玩家排行 */
    @ApiProperty({ description: '玩家排行' })
    rank: number = TableGameConfig.ps_rank_max + 1;

    /**行动计数 */
    @ApiProperty({ description: '行动计数 每5次随机一次道具' })
    act_count: number = 0;

    /**玩家格子数组 */
    @ApiProperty({ description: '玩家格子坐标' })
    posList: Record<number, number> = {};

    /**骰子恢复时间标记 */
    @ApiProperty({ description: '骰子恢复时间标记' })
    adddice_time?: string;

    /**对海盗船总伤害 */
    @ApiProperty({ description: '对海盗船总伤害' })
    damage: number = 0;

    /**当前海盗船ID */
    @ApiProperty({ description: '当前海盗船ID' })
    shipId: number;

    /**炮弹等级信息 */
    @ApiProperty({ description: '炮弹等级信息 <炮弹类型itemid,炮弹等级>' })
    shellInfo: Record<number, number>

    /**炮击能量 达到上限就炮击一次*/
    @ApiProperty({ description: '炮击能量 达到上限就炮击一次' })
    fireEnergy: number = 0;

    /**战斗信息 */
    @ApiProperty({ description: '战斗信息' })
    fightInfo: PSFightEntity;

    /**已领取过的宝藏福利普通奖励等级 */
    @ApiProperty({ description: '已领取过的宝藏福利普通奖励等级' })
    welfare_lv: number = 0;

    /**已领取过的宝藏福利高级奖励等级 */
    @ApiProperty({ description: '已领取过的宝藏福利高级奖励等级' })
    welfare_Hlv: number = 0;

    /**击杀数量 */
    killNum: number = 0;

    /**已领取的每日排行奖励时间 */
    @ApiProperty({ description: '已领取的每日排行奖励时间' })
    rankDAT: string | Date;
}

export class SPSRankEntity {
    /**role id */
    id: string;
    /**昵称 */
    n?: string;
    /**战力 */
    f?: string;
    /**伤害 */
    d?: string;
    /**头像id */
    c?: string;
    /**入榜时间 */
    t?: string | Date = cTools.newSaveLocalDate();
}

/**夺宝大作战 服务器数据 */
export class SPirateShipEntity {
    /**开启时间 */
    @ApiProperty({ description: '开启时间' })
    sTime: string = cTools.newLocalDate0String();

    /**赛季id */
    @ApiProperty({ description: '赛季id' })
    season: number = 1;

    /**当前赛季排名 */
    rank: SPSRankEntity[] = [];

    /**上赛季排名 */
    lrank: SPSRankEntity[] = [];

    /**上赛季id */
    @ApiProperty({ description: '上赛季id' })
    lseason: number = 0;
}








