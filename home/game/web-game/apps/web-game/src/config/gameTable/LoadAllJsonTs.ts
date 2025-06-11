import { JsonUtil } from "../../game-config/JsonUtil";

//导入 深渊巨龙-伤害奖励表 TS类
import { TableAbyssDragonDamageAward } from "./TableAbyssDragonDamageAward";
        
//导入 深渊巨龙-每日排行奖励表 TS类
import { TableAbyssDragonRankAward } from "./TableAbyssDragonRankAward";
        
//导入 竞技场-每日排名奖励表 TS类
import { TableArenaDailyRank } from "./TableArenaDailyRank";
        
//导入 竞技场-每日排名奖励表 TS类
import { TableArenaDailyRank_kf } from "./TableArenaDailyRank_kf";
        
//导入 竞技场-赛季奖励表 TS类
import { TableArenaSeasonRank } from "./TableArenaSeasonRank";
        
//导入 竞技场-赛季奖励表 TS类
import { TableArenaSeasonRank_kf } from "./TableArenaSeasonRank_kf";
        
//导入 光环表 TS类
import { TableAureole } from "./TableAureole";
        
//导入 魔渊-成就奖励表 TS类
import { TableDemonAbyssAchieveAward } from "./TableDemonAbyssAchieveAward";
        
//导入 自定义商品表 TS类
import { TableDiyShop } from "./TableDiyShop";
        
//导入 时装 TS类
import { TableFashion } from "./TableFashion";
        
//导入 水果表 TS类
import { TableFruitSys } from "./TableFruitSys";
        
//导入 锻造等级基金表 TS类
import { TableFundEboxAward } from "./TableFundEboxAward";
        
//导入 等级基金表 TS类
import { TableFundLevelAward } from "./TableFundLevelAward";
        
//导入 属性表 TS类
import { TableGameAttr } from "./TableGameAttr";
        
//导入 BUFF表 TS类
import { TableGameBuff } from "./TableGameBuff";
        
//导入 掉落表 TS类
import { TableGameDrop } from "./TableGameDrop";
        
//导入 装备宝箱等级表 TS类
import { TableGameEBoxLv } from "./TableGameEBoxLv";
        
//导入 装备表 TS类
import { TableGameEquip } from "./TableGameEquip";
        
//导入 装备附加词条表 TS类
import { TableGameEquipAdd } from "./TableGameEquipAdd";
        
//导入 装备部位表 TS类
import { TableGameEquipPos } from "./TableGameEquipPos";
        
//导入 部位属性 TS类
import { TableGameEquipPosAttr } from "./TableGameEquipPosAttr";
        
//导入 部位等级 TS类
import { TableGameEquipPosLv } from "./TableGameEquipPosLv";
        
//导入 装备品质表 TS类
import { TableGameEquipQuality } from "./TableGameEquipQuality";
        
//导入 英雄表 TS类
import { TableGameHero } from "./TableGameHero";
        
//导入 道具表 TS类
import { TableGameItem } from "./TableGameItem";
        
//导入 关卡表 TS类
import { TableGameLevelSweep } from "./TableGameLevelSweep";
        
//导入 关卡表 TS类
import { TableGameLevels } from "./TableGameLevels";
        
//导入 怪物表 TS类
import { TableGameMonster } from "./TableGameMonster";
        
//导入 系统头像表 TS类
import { TableGameRoleIco } from "./TableGameRoleIco";
        
//导入 技能宝箱等级表 TS类
import { TableGameSBoxLv } from "./TableGameSBoxLv";
        
//导入 技能表 TS类
import { TableGameSkill } from "./TableGameSkill";
        
//导入 技能品质表 TS类
import { TableGameSkillQuality } from "./TableGameSkillQuality";
        
//导入 游戏系统配置表 TS类
import { TableGameSys } from "./TableGameSys";
        
//导入 公会等级 TS类
import { TableGuildLv } from "./TableGuildLv";
        
//导入 游戏系统配置表 TS类
import { TableGuildTaskAward } from "./TableGuildTaskAward";
        
//导入 勋章表 TS类
import { TableMedalUplevel } from "./TableMedalUplevel";
        
//导入 佣兵激活表 TS类
import { TableMercenaryAct } from "./TableMercenaryAct";
        
//导入 佣兵切磋表 TS类
import { TableMercenaryFight } from "./TableMercenaryFight";
        
//导入 佣兵游历表 TS类
import { TableMercenaryGo } from "./TableMercenaryGo";
        
//导入 佣兵升级表 TS类
import { TableMercenaryLV } from "./TableMercenaryLV";
        
//导入 表ID TS类
import { TableOpenBoxAttr } from "./TableOpenBoxAttr";
        
//导入 开服福利积分奖励表 TS类
import { TableOpenWelfareAward } from "./TableOpenWelfareAward";
        
//导入 夺宝大作战-海盗船表 TS类
import { TablePirateShip } from "./TablePirateShip";
        
//导入 夺宝大作战格子表 TS类
import { TablePirateShipCell } from "./TablePirateShipCell";
        
//导入 夺宝大作战-每日排名奖励表 TS类
import { TablePirateShipDailyRank } from "./TablePirateShipDailyRank";
        
//导入 夺宝道具表 TS类
import { TablePirateShipItems } from "./TablePirateShipItems";
        
//导入 夺宝大作战-赛季奖励表 TS类
import { TablePirateShipSeasonRank } from "./TablePirateShipSeasonRank";
        
//导入 夺宝大作战-炮弹表 TS类
import { TablePirateShipShell } from "./TablePirateShipShell";
        
//导入 夺宝大作战-宝藏福利 TS类
import { TablePirateShipWelfare } from "./TablePirateShipWelfare";
        
//导入 特权类型表 TS类
import { TablePrivilegeConfig } from "./TablePrivilegeConfig";
        
//导入 特权类型表 TS类
import { TablePrivilegeType } from "./TablePrivilegeType";
        
//导入 排名奖励表 TS类
import { TableRankAwardGL } from "./TableRankAwardGL";
        
//导入 排名奖励表 TS类
import { TableRankAwards } from "./TableRankAwards";
        
//导入 异兽 TS类
import { TableRareMonster } from "./TableRareMonster";
        
//导入 异兽园 TS类
import { TableRareMonsterPark } from "./TableRareMonsterPark";
        
//导入 异兽共鸣 TS类
import { TableRareMonsterSuit } from "./TableRareMonsterSuit";
        
//导入 累积充值礼包 TS类
import { TableRechargeGift } from "./TableRechargeGift";
        
//导入 机器人英雄表 TS类
import { TableRobotHero } from "./TableRobotHero";
        
//导入 机器人角色表 TS类
import { TableRobotRole } from "./TableRobotRole";
        
//导入 序号 TS类
import { TableRoleName } from "./TableRoleName";
        
//导入 进阶表 TS类
import { TableRoleUpgrade } from "./TableRoleUpgrade";
        
//导入 商品表 TS类
import { TableShop } from "./TableShop";
        
//导入 技能共鸣 TS类
import { TableSkillSuit } from "./TableSkillSuit";
        
//导入 持续状态表 TS类
import { TableStatus } from "./TableStatus";
        
//导入 任务表 TS类
import { TableTask } from "./TableTask";
        
//导入 每日任务宝箱奖励表 TS类
import { TableTaskDailyAward } from "./TableTaskDailyAward";
        
//导入 任务表目标表 TS类
import { TableTaskTarget } from "./TableTaskTarget";
        
//导入 任务表目标类型表 TS类
import { TableTaskTargetType } from "./TableTaskTargetType";
        
//导入 提升实力 TS类
import { TableTisheng } from "./TableTisheng";
        
//导入 称号 TS类
import { TableTitle } from "./TableTitle";
        
//导入 福利-每日有礼表 TS类
import { TableWelfareDailyAward } from "./TableWelfareDailyAward";
        
//导入 福利-等级奖励表 TS类
import { TableWelfareLevelAward } from "./TableWelfareLevelAward";
        
//导入 福利-积天豪礼表 TS类
import { TableWelfarePaidDaysAward } from "./TableWelfarePaidDaysAward";
        
//导入 角斗属性卡表 TS类
import { TableWrestleCard } from "./TableWrestleCard";
        
//导入 角斗关卡表 TS类
import { TableWrestleLevel } from "./TableWrestleLevel";
        
//导入 角斗关卡表 TS类
import { TableWrestlexians } from "./TableWrestlexians";
        
//导入 游戏系统配置表 TS类
import { TableXunBaoAward } from "./TableXunBaoAward";
        
//导入 猜拳 TS类
import { Tablecaiquan } from "./Tablecaiquan";
        

export async function loadAllJsonTS(){
    
    let all_table_list = [];
    
    //深渊巨龙-伤害奖励表
    all_table_list.push("AbyssDragonDamageAward");
    //深渊巨龙-每日排行奖励表
    all_table_list.push("AbyssDragonRankAward");
    //竞技场-每日排名奖励表
    all_table_list.push("ArenaDailyRank");
    //竞技场-每日排名奖励表
    all_table_list.push("ArenaDailyRank_kf");
    //竞技场-赛季奖励表
    all_table_list.push("ArenaSeasonRank");
    //竞技场-赛季奖励表
    all_table_list.push("ArenaSeasonRank_kf");
    //光环表
    all_table_list.push("Aureole");
    //魔渊-成就奖励表
    all_table_list.push("DemonAbyssAchieveAward");
    //自定义商品表
    all_table_list.push("DiyShop");
    //时装
    all_table_list.push("Fashion");
    //水果表
    all_table_list.push("FruitSys");
    //锻造等级基金表
    all_table_list.push("FundEboxAward");
    //等级基金表
    all_table_list.push("FundLevelAward");
    //属性表
    all_table_list.push("GameAttr");
    //BUFF表
    all_table_list.push("GameBuff");
    //掉落表
    all_table_list.push("GameDrop");
    //装备宝箱等级表
    all_table_list.push("GameEBoxLv");
    //装备表
    all_table_list.push("GameEquip");
    //装备附加词条表
    all_table_list.push("GameEquipAdd");
    //装备部位表
    all_table_list.push("GameEquipPos");
    //部位属性
    all_table_list.push("GameEquipPosAttr");
    //部位等级
    all_table_list.push("GameEquipPosLv");
    //装备品质表
    all_table_list.push("GameEquipQuality");
    //英雄表
    all_table_list.push("GameHero");
    //道具表
    all_table_list.push("GameItem");
    //关卡表
    all_table_list.push("GameLevelSweep");
    //关卡表
    all_table_list.push("GameLevels");
    //怪物表
    all_table_list.push("GameMonster");
    //系统头像表
    all_table_list.push("GameRoleIco");
    //技能宝箱等级表
    all_table_list.push("GameSBoxLv");
    //技能表
    all_table_list.push("GameSkill");
    //技能品质表
    all_table_list.push("GameSkillQuality");
    //游戏系统配置表
    all_table_list.push("GameSys");
    //公会等级
    all_table_list.push("GuildLv");
    //游戏系统配置表
    all_table_list.push("GuildTaskAward");
    //勋章表
    all_table_list.push("MedalUplevel");
    //佣兵激活表
    all_table_list.push("MercenaryAct");
    //佣兵切磋表
    all_table_list.push("MercenaryFight");
    //佣兵游历表
    all_table_list.push("MercenaryGo");
    //佣兵升级表
    all_table_list.push("MercenaryLV");
    //表ID
    all_table_list.push("OpenBoxAttr");
    //开服福利积分奖励表
    all_table_list.push("OpenWelfareAward");
    //夺宝大作战-海盗船表
    all_table_list.push("PirateShip");
    //夺宝大作战格子表
    all_table_list.push("PirateShipCell");
    //夺宝大作战-每日排名奖励表
    all_table_list.push("PirateShipDailyRank");
    //夺宝道具表
    all_table_list.push("PirateShipItems");
    //夺宝大作战-赛季奖励表
    all_table_list.push("PirateShipSeasonRank");
    //夺宝大作战-炮弹表
    all_table_list.push("PirateShipShell");
    //夺宝大作战-宝藏福利
    all_table_list.push("PirateShipWelfare");
    //特权类型表
    all_table_list.push("PrivilegeConfig");
    //特权类型表
    all_table_list.push("PrivilegeType");
    //排名奖励表
    all_table_list.push("RankAwardGL");
    //排名奖励表
    all_table_list.push("RankAwards");
    //异兽
    all_table_list.push("RareMonster");
    //异兽园
    all_table_list.push("RareMonsterPark");
    //异兽共鸣
    all_table_list.push("RareMonsterSuit");
    //累积充值礼包
    all_table_list.push("RechargeGift");
    //机器人英雄表
    all_table_list.push("RobotHero");
    //机器人角色表
    all_table_list.push("RobotRole");
    //序号
    all_table_list.push("RoleName");
    //进阶表
    all_table_list.push("RoleUpgrade");
    //商品表
    all_table_list.push("Shop");
    //技能共鸣
    all_table_list.push("SkillSuit");
    //持续状态表
    all_table_list.push("Status");
    //任务表
    all_table_list.push("Task");
    //每日任务宝箱奖励表
    all_table_list.push("TaskDailyAward");
    //任务表目标表
    all_table_list.push("TaskTarget");
    //任务表目标类型表
    all_table_list.push("TaskTargetType");
    //提升实力
    all_table_list.push("Tisheng");
    //称号
    all_table_list.push("Title");
    //福利-每日有礼表
    all_table_list.push("WelfareDailyAward");
    //福利-等级奖励表
    all_table_list.push("WelfareLevelAward");
    //福利-积天豪礼表
    all_table_list.push("WelfarePaidDaysAward");
    //角斗属性卡表
    all_table_list.push("WrestleCard");
    //角斗关卡表
    all_table_list.push("WrestleLevel");
    //角斗关卡表
    all_table_list.push("Wrestlexians");
    //游戏系统配置表
    all_table_list.push("XunBaoAward");
    //猜拳
    all_table_list.push("caiquan");

    for (let index = 0; index < all_table_list.length; index++) {
        const table_name = all_table_list[index];
        await JsonUtil.loadJsonFile("apps/web-game/src/config/gameJson/"+table_name+".json")
            .then((jsonData) => {
                //console.log('加载 JSON 文件'+table_name+'成功');
                JsonUtil.loadData(table_name, jsonData);
            })
            .catch((error) => {
                //console.error('加载 JSON 文件'+table_name+'时出错',error);
            });
    }

    
    //加载 深渊巨龙-伤害奖励表
    TableAbyssDragonDamageAward.initTable();
    //加载 深渊巨龙-每日排行奖励表
    TableAbyssDragonRankAward.initTable();
    //加载 竞技场-每日排名奖励表
    TableArenaDailyRank.initTable();
    //加载 竞技场-每日排名奖励表
    TableArenaDailyRank_kf.initTable();
    //加载 竞技场-赛季奖励表
    TableArenaSeasonRank.initTable();
    //加载 竞技场-赛季奖励表
    TableArenaSeasonRank_kf.initTable();
    //加载 光环表
    TableAureole.initTable();
    //加载 魔渊-成就奖励表
    TableDemonAbyssAchieveAward.initTable();
    //加载 自定义商品表
    TableDiyShop.initTable();
    //加载 时装
    TableFashion.initTable();
    //加载 水果表
    TableFruitSys.initTable();
    //加载 锻造等级基金表
    TableFundEboxAward.initTable();
    //加载 等级基金表
    TableFundLevelAward.initTable();
    //加载 属性表
    TableGameAttr.initTable();
    //加载 BUFF表
    TableGameBuff.initTable();
    //加载 掉落表
    TableGameDrop.initTable();
    //加载 装备宝箱等级表
    TableGameEBoxLv.initTable();
    //加载 装备表
    TableGameEquip.initTable();
    //加载 装备附加词条表
    TableGameEquipAdd.initTable();
    //加载 装备部位表
    TableGameEquipPos.initTable();
    //加载 部位属性
    TableGameEquipPosAttr.initTable();
    //加载 部位等级
    TableGameEquipPosLv.initTable();
    //加载 装备品质表
    TableGameEquipQuality.initTable();
    //加载 英雄表
    TableGameHero.initTable();
    //加载 道具表
    TableGameItem.initTable();
    //加载 关卡表
    TableGameLevelSweep.initTable();
    //加载 关卡表
    TableGameLevels.initTable();
    //加载 怪物表
    TableGameMonster.initTable();
    //加载 系统头像表
    TableGameRoleIco.initTable();
    //加载 技能宝箱等级表
    TableGameSBoxLv.initTable();
    //加载 技能表
    TableGameSkill.initTable();
    //加载 技能品质表
    TableGameSkillQuality.initTable();
    //加载 游戏系统配置表
    TableGameSys.initTable();
    //加载 公会等级
    TableGuildLv.initTable();
    //加载 游戏系统配置表
    TableGuildTaskAward.initTable();
    //加载 勋章表
    TableMedalUplevel.initTable();
    //加载 佣兵激活表
    TableMercenaryAct.initTable();
    //加载 佣兵切磋表
    TableMercenaryFight.initTable();
    //加载 佣兵游历表
    TableMercenaryGo.initTable();
    //加载 佣兵升级表
    TableMercenaryLV.initTable();
    //加载 表ID
    TableOpenBoxAttr.initTable();
    //加载 开服福利积分奖励表
    TableOpenWelfareAward.initTable();
    //加载 夺宝大作战-海盗船表
    TablePirateShip.initTable();
    //加载 夺宝大作战格子表
    TablePirateShipCell.initTable();
    //加载 夺宝大作战-每日排名奖励表
    TablePirateShipDailyRank.initTable();
    //加载 夺宝道具表
    TablePirateShipItems.initTable();
    //加载 夺宝大作战-赛季奖励表
    TablePirateShipSeasonRank.initTable();
    //加载 夺宝大作战-炮弹表
    TablePirateShipShell.initTable();
    //加载 夺宝大作战-宝藏福利
    TablePirateShipWelfare.initTable();
    //加载 特权类型表
    TablePrivilegeConfig.initTable();
    //加载 特权类型表
    TablePrivilegeType.initTable();
    //加载 排名奖励表
    TableRankAwardGL.initTable();
    //加载 排名奖励表
    TableRankAwards.initTable();
    //加载 异兽
    TableRareMonster.initTable();
    //加载 异兽园
    TableRareMonsterPark.initTable();
    //加载 异兽共鸣
    TableRareMonsterSuit.initTable();
    //加载 累积充值礼包
    TableRechargeGift.initTable();
    //加载 机器人英雄表
    TableRobotHero.initTable();
    //加载 机器人角色表
    TableRobotRole.initTable();
    //加载 序号
    TableRoleName.initTable();
    //加载 进阶表
    TableRoleUpgrade.initTable();
    //加载 商品表
    TableShop.initTable();
    //加载 技能共鸣
    TableSkillSuit.initTable();
    //加载 持续状态表
    TableStatus.initTable();
    //加载 任务表
    TableTask.initTable();
    //加载 每日任务宝箱奖励表
    TableTaskDailyAward.initTable();
    //加载 任务表目标表
    TableTaskTarget.initTable();
    //加载 任务表目标类型表
    TableTaskTargetType.initTable();
    //加载 提升实力
    TableTisheng.initTable();
    //加载 称号
    TableTitle.initTable();
    //加载 福利-每日有礼表
    TableWelfareDailyAward.initTable();
    //加载 福利-等级奖励表
    TableWelfareLevelAward.initTable();
    //加载 福利-积天豪礼表
    TableWelfarePaidDaysAward.initTable();
    //加载 角斗属性卡表
    TableWrestleCard.initTable();
    //加载 角斗关卡表
    TableWrestleLevel.initTable();
    //加载 角斗关卡表
    TableWrestlexians.initTable();
    //加载 游戏系统配置表
    TableXunBaoAward.initTable();
    //加载 猜拳
    Tablecaiquan.initTable();

}
    