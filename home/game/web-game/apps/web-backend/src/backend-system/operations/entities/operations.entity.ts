import { IsInt } from "class-validator";

export class OperationsEnance { }



export class CodeInfoEnance {
    id?: number;
    gameid: number;
    codename: string;
    //奖励邮件id
    emailid: number;
    //长度
    len: number;
    //是否是通用码 通用码只生成一个 0 独码  1通用
    universal: number;
    //重复激活次数
    repe: number;
    //使用
    isuse: number;
    //有效时间
    endtime: string;
    // createdAt: Date;
    // updatedAt: Date;
    // game_code_used    game_code_used[]
    // game_comcode_used game_comcode_used[]

}
export class GetCodeadminEnance {
    gameid?: number;
}

export class CodeUsedEnance {
    id?: number;
    // codeinfo   game_code_info @relation(fields: [codeinfoId], references: [id])
    codeinfoId: number;
    gameId: number;
    //游戏角色ID
    roleId: string;
    //生成的激活码
    code: string;
    //是否已经用过 0没有 1已经使用
    used?: number;
    //激活使用时间
    actTime: string;

}