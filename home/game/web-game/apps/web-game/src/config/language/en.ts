import { REMsg } from "../../game-data/entity/msg.entity";
import { EActType } from "../game-enum";

export const enconfig = {

   act_type: {
      [EActType.LOGIN]: "登录",
      [EActType.FIGHT_GAMELEVELS]: "关卡战斗",

      [EActType.SKILL_ACTIVE_POS]: "激活英雄技能槽位",
      [EActType.SKILL_ACTIVE]: "技能激活成功",
      [EActType.SKILL_LEVEL_UP]: "技能升级",
      [EActType.SKILL_SETUP]: "技能穿戴",
      [EActType.SKILL_SETDOWN]: "技能卸下",

      [EActType.EQUIP_SETUP]: "装备穿戴",
      [EActType.EQUIP_SETDOWN]: "装备卸下",
      [EActType.EQUIP_AUTOSETUP]: "装备一键换装",
      [EActType.EQUIP_SELL]: "装备出售",
      [EActType.EQUIP_QUICKSELL]: "装备一键出售",

      [EActType.HERO_EQUIP_POSUP]: "装备部位强化",
      [EActType.HERO_ALL_EQUIP_POSUP]: "装备全身部位强化",
      [EActType.HERO_LVUP]: "英雄升级",

      [EActType.BOX_OPEN_EBOX]: "锻造",
      [EActType.BOX_LVUP_EBOX]: "锻造升级",
      [EActType.BOX_QUICKEN_EBOXCD]: "使用道具加速锻造CD时间",
      [EActType.BOX_ADV_QUICKEN_EBOXCD]: "观看广告减少锻造升级CD时间",
      [EActType.BOX_CHECK_LVUP_EBOX]: "检测锻造是否cd时间结束",
      [EActType.BOX_OPEN_SBOX]: "开启技能宝箱",

      [EActType.EMAIL_GETDATA]: "获取邮件列表",
      [EActType.EMAIL_READ]: "已读邮件",
      [EActType.EMAIL_AUTOREAD]: "一键已读邮件",
      [EActType.EMAIL_RECEIVE]: "领取邮件附件",
      [EActType.EMAIL_AUTORECEIVE]: "一键领取邮件附件",
      [EActType.EMAIL_DELETE]: "删除邮件",
      [EActType.EMAIL_AUTODELETE]: "一键删除邮件",
      [EActType.EMAIL_SEND]: "发送邮件",

      [EActType.TIME_AWARD_GET]: "获取挂机累计时间奖励",
      [EActType.TIME_AWARD_GET_QUICK]: "获取快速挂机时间奖励",

      [EActType.FIGHT_ELITE_LEVELS]: "精英关卡",

      [EActType.TASK_MAIN_GETAWARD]: "领取主线任务奖励",
      [EActType.TASK_DAILY_GETAWARD]: "领取每日任务奖励",
      [EActType.TASK_DAILYBOX_GETAWARD]: "领取每日任务宝箱奖励",

      [EActType.EBOX_SELL_TMPEQUIP]: "出售临时对比装备",
      [EActType.EBOX_SAVE_TMPEQUIP]: "存储临时对比装备",
      [EActType.EBOX_SETUP_TMPEQUIP]: "替换临时对比装备",

      [EActType.WELFARE_DAILY_AWARD]: "获取每日有礼奖励",
      [EActType.WELFARE_LEVEL_AWARD]: "获取等级奖励",
      [EActType.WELFARE_PAID_DAYS_AWARD]: "获取积天豪礼累充奖励",
      [EActType.WELFARE_PD_DAILY_AWARD]: "获取积天豪礼每日奖励",

      [EActType.SHOP_BUY_ITEM]: "购买商品",
      [EActType.SHOP_PAY_BUY_ITEM]: "付费购买商品",

      [EActType.MONTHCARD_GET_AWARD]: "领取月卡每日奖励",
      [EActType.FOREVERCARD_GET_AWARD]: "领取终身卡每日奖励",
      [EActType.FUND_LEVEL_GET_AWARD]: "领取等级基金奖励",
      [EActType.FUND_EBOX_GET_AWARD]: "领取锻造基金奖励",

      [EActType.MEDAL_UPLEVEL]: "勋章升级",
      [EActType.ARENA_FIGHT]: "竞技场挑战",

      [EActType.PS_INIT]: "夺宝大作战初始化",
      [EActType.PS_UPDATE]: "夺宝大作战更新数据",
      [EActType.PS_GO_ACT]: "夺宝大作战行动",
      [EActType.PS_GET_WELFARE_AWARD]: "夺宝大作战-领取宝藏福利奖励",
      [EActType.PS_SELL_LVUP]: "夺宝大作战-炮弹升级",
      [EActType.PS_DAILY_AWARD]: "每日奖励",
      [EActType.PS_S_AWARD]: "赛季奖励",
      [EActType.PS_GET_RANK]: "夺宝大作战获取排行榜数据",

      [EActType.ARENA_SHOW]: "竞技挑战界面数据",

      [EActType.GET_RESET_DAILY]: "每日重置请求",
      [EActType.DAILY_RESET]: "每日重置",

      [EActType.GM_CMD]: "GM命令",
      [EActType.HERO_MAIN_LVUP]: "主角英雄升级",
      [EActType.FIGHT_SWEEP]: "精英关卡扫荡",


      [EActType.BE_SEND_CSHOP]: "后台发放充值商品",
      [EActType.UPDATE_ROLESTATUS]: "后台修改角色封禁状态",

      [EActType.RANK_LIST]: "排行榜",
      [EActType.RECHARGE_GIFT]: "累充礼包",

      [EActType.ROLE_UPICO]: "角色更新头像",
      [EActType.EAT_FRUIT]: "食果",

      [EActType.FIGHT_ABYSS_DRAGON]: "深渊巨龙挑战",
      [EActType.DAILY_AWARD]: "每日奖励",
      [EActType.GET_ADRANK]: "获取深渊巨龙排行榜",

      [EActType.UPGRADE]: "佣兵进阶",
      [EActType.TASK_UPGRADE_GETAWARD]: "领取进阶任务奖励",

      [EActType.BE_CHANGE_SERVER_STATUS]: "后台修改服务器状态",
      [EActType.BE_MERGE_SERVER]: "合服",

      [EActType.AUREOLEUP]: "光环升级",
      [EActType.AUREOLEACT]: "光环激活",
      [EActType.AUREOLEUSE]: "光环使用",

      [EActType.DEMON_ABYSS_FIGHT]: "魔渊挑战",
      [EActType.DEMON_ABYSS_DAILY_AWARDS]: "魔渊每日奖励",
      [EActType.DEMON_ABYSS_GET_AWARDS]: "魔渊领取成就奖励",

      [EActType.MERCENARY_ACT]: "佣兵激活",
      [EActType.MERCENARY_Up]: "佣兵赠送",
      [EActType.MERCENARY_FIGHT]: "佣兵切磋",
      [EActType.MERCENARY_GO]: "佣兵寻宝",
      [EActType.MERCENARY_UPDATA]: "佣兵更新数据",

      [EActType.BE_AUTO_MAINTAINS_SERVER]: "一键开启改维护",
      [EActType.BE_AUTO_OPEN_SERVER]: "一键维护改开启",
      [EActType.RARE_MONSTER]: "异兽升级",
      [EActType.RARE_MONSTER_FIGHT]: "异兽上阵",
      [EActType.RARE_MONSTER_CHANGE]: "异兽切换上阵阵容",
      [EActType.RARE_MONSTER_PARK]: "异兽园捕捉",
      [EActType.RARE_MONSTER_SUIT]: "异兽共鸣",

      [EActType.DEMON_ABYSS_DAILY_BUYITEM]: "魔渊每日付费购买",

      [EActType.WRESTLE_PK]: "角斗挑战",
      [EActType.WRESTLE_CHANGE]: "角斗更换对手",
      [EActType.WRESTLE_CARD]: "装备角斗卡",

      /**查找角色 */
      [EActType.BE_FIND_ROLES]: "查找角色信息列表",
      [EActType.SYS_OPEN_AWARD]: "历程领取奖励",

      [EActType.BE_GET_CHAT_LOG]: "后台获取聊天日志",

      [EActType.TITLE_ACTIVE]: "称号激活",
      [EActType.TITLE_DRESS]: "称号穿戴",
      [EActType.TITLE_UNDRESS]: "称号卸下",

      [EActType.FASHION_ACTIVE]: "时装激活",
      [EActType.FASHION_DRESS]: "时装穿戴",
      [EActType.FASHION_UNDRESS]: "时装卸下",
      [EActType.BE_SET_CROSSSERVER_ID]: "后台设置跨服ID",

      [EActType.BE_CREATE_CROSS_SERVER]: "后台创建跨服服务器",
      [EActType.BE_DELETE_CROSS_SERVER]: "后台删除跨服服务器",

      [EActType.TASK_OPEN_WERFARE_GETAWARD]: "获取开服福利任务奖励",
      [EActType.GET_OPEN_WERFARE_POINT_AWARD]: "获取开服福利积分奖励",
      [EActType.BOX_OPEN_XUNBAO]: "寻宝",
      [EActType.XUNBAO_AWARD]: "寻宝领取奖励",
      [EActType.GUILD]: "公会",
      [EActType.GUILD_CREATE]: "创建公会",
      [EActType.GUILD_JOIN]: "加入公会",
      [EActType.GUILD_LEAVE]: "离开公会",
      [EActType.GUILD_CHANGE]: "修改公会信息",
      [EActType.GUILD_CHANGE_LEADER]: "会长已变更",

      [EActType.CQ_UP]: "猜拳升级",
      
      [EActType.SKILL_SUIT]: "技能图鉴激活",

      [EActType.GUILD_AWARD]: "公会活跃领取奖励",
      [EActType.TASK_GUILD_GETAWARD]: "公会任务领取奖励",
   },

   skill: {
      not_have: "没有该技能",
      pos_actived: "该技能部位已激活",
      pos_no_actived: "该技能部位未激活",
      max_level: "技能已经满级",
      haved_by_group: "已经拥有该组别的技能了",
      active_fail: "技能非法激活",
      tianfu_skill_no: "天赋技能无法装备或卸下",
      pos_haved_skill: "该技能槽位上已装备了技能",
      pos_not_haved_skill: "该技能槽位上没有技能",
      setdown_error_id: "卸下技能ID不符",
      already_setup: "该技能已装备",
   },

   equip: {
      not_have: "没有该装备",
      emptybag: "背包为空",
      no_change: "背包没有更强装备可以更换",
   },

   hero: {
      not_have: "没有该英雄",
   },

   tip: {
      not_enough: "不够",
      level_not_enough: "等级不够",
      not_open_system: "系统暂未开放",
      error_system_data: "系统数据异常",
      errortime_system: "未到开放时间",
      error_system_serverdata: "系统服务器数据异常",
      nowar_cd: "免战期间",
      role_forbidden: "角色已被封禁",
      not_find_role: "角色不在线",
      received_rewards: "奖励已领取过",
      server_info_nil: "服务器全局数据异常",
      server_maintain: "服务器维护中",
      server_close: "服务器关闭中",
      up_fail: "升级失败",
   },

   rank_daily_award: "排行榜每日奖励",
   rank_season_award: "赛季奖励",

   success: "成功",
   fail: "失败",

   /**
    * 操作成功
    * @param eActType 
    * @returns 
    */
   actTypeSuccess(eActType: EActType) {
      let str = enconfig.act_type[eActType] || eActType
      return str + enconfig.success;
   },

   /**
    * 操作失败
    * @param eActType 
    * @returns 
    */
   actTypeFail(eActType: EActType) {
      let str = enconfig.act_type[eActType] || eActType
      return str + enconfig.fail;
   },

   setActTypeSuccess(eActType: EActType, retMsg: REMsg) {
      retMsg.ok = true;
      retMsg.srctype = eActType;
      retMsg.msg = enconfig.actTypeSuccess(eActType);
   },

   setActTypeFail(eActType: EActType, retMsg: REMsg) {
      retMsg.ok = false;
      retMsg.srctype = eActType;
      retMsg.msg = enconfig.actTypeFail(eActType);
   },



}