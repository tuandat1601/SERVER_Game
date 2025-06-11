import { ESkillActive } from "../../config/game-enum";

export type SkillEntityRecord = Record<number, SkillEntity>

export class SkillPosEntity {
    //激活状态
    //st:ESkillActive;
    //技能ID
    sid?:number;
}

export class SkillEntity {
    //绑定英雄ID
    //hid?:number;
}

//技能系统
export class SkillSystemEntity {
    //技能列表
    list?:SkillEntityRecord;
    suit?:number[];
}

/**
 * "skill_pos_0": {
        "cost": {
            "1001": 200,
            "1002": 100
        },
        "needlv": 10,
        "key": "skill_pos_0"
    },
 */
export class SkillPosCostEntity{
    cost:Record<number,number>
    needlv:number
}


