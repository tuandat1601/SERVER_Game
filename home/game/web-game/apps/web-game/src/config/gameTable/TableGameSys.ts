
    import { JsonUtil } from "../../game-config/JsonUtil";
            
    export class TableGameSys {
        static TableName: string = "GameSys";
        static table:any = null;
            
        
        static home = 1;
        static dock = 2;
        static gamelevels = 1001;
        static equip = 1002;
        static skill = 1003;
        static box = 1004;
        static fuben = 1005;
        static timeaward = 1006;
        static elitelevels = 1007;
        static task_main = 1008;
        static task_daily = 1009;
        static welfare = 1010;
        static welfare_daily = 1011;
        static welfare_level = 1012;
        static welfare_paid_days = 1013;
        static recharge_month_card = 1014;
        static recharge_level_fund = 1015;
        static recharge_ebox_fund = 1016;
        static diamond_shop = 1017;
        static daily_welfare = 1018;
        static recharge_daily_award = 1019;
        static pirateShip = 1020;
        static medal = 1021;
        static arena = 1022;
        static setting = 1023;
        static setCodeGift = 1024;
        static setServer = 1025;
        static setNotice = 1026;
        static yueka = 1027;
        static store = 1028;
        static GM = 1029;
        static email = 1030;
        static first_recharge = 1031;
        static rank_level = 1032;
        static recharge_gift = 1033;
        static gift_pack_limit_time = 1034;
        static abyss_dragon = 1035;
        static eat_fruit = 1036;
        static upgrade = 1037;
        static aureole = 1038;
        static demon_abyss = 1039;
        static mercenary = 1040;
        static recharge_forever_card = 1041;
        static raremonster = 1042;
        static wrestle = 1043;
        static gift_pack_super_value = 1050;
        static bazzar = 1055;
        static gameRank = 1056;
        static journey = 1057;
        static chat = 1058;
        static arenaKF = 1059;
        static title = 1060;
        static change = 1061;
        static closet = 1062;
        static open_server_welfare = 1063;
        static guild = 1064;
        static xunbao = 1065;
        static cq = 1066;
        static guild_task = 1067;
        static guide = 1070;
        static box_skill = 2001;
        static equip_hero = 2002;
        static equip_pos = 2003;
        static equip_shiguo = 2004;
        static box_equip_up = 2010;
        static box_equip_auto = 2011;
        static pirateShip_dice = 2020;
        static pirateShip_ship_award = 2021;
        static pirateShip_fire_up = 2022;
        static pirateShip_ship_award_daily = 2023;
        static recharge_level_fund_daily = 2030;
        static recharge_ebox_fund_daily = 2031;
        static gift_pack_super_value_dz = 2051;
        static gift_pack_super_value_qh = 2052;
        static gift_pack_super_value_gh = 2053;
        static gift_pack_super_value_em = 2054;
        static gift_pack_super_value_zx = 2055;
            
        
        static field_strKey: string = "strKey";
        static field_name: string = "name";
        static field_open_rolelevel: string = "open_rolelevel";
        static field_server_opendays: string = "server_opendays";
        static field_need_task: string = "need_task";
        static field_guild: string = "guild";
        static field_act_time: string = "act_time";
        static field_is_open: string = "is_open";
        static field_close_serverday: string = "close_serverday";
        static field_is_licheng: string = "is_licheng";
        static field_licheng_order: string = "licheng_order";
        static field_drop: string = "drop";
                
            
        private data: any;
            
            
        constructor(id: number){
            this.init(id)
        }
    
        static initTable(){
            if (!TableGameSys.table) {
                TableGameSys.table = JsonUtil.get(TableGameSys.TableName);
            }
        }
    
        static getTable(){
            return TableGameSys.table
        }
    
        private init(id: number) {
            this.data = TableGameSys.table[id];
            this.id = id;
        }
            
        /** 游戏系统配置表【KEY】 */
        id: number;
        
        
        static checkHave(id: number){
            if(TableGameSys.table[id] == undefined){
                return false
            }
            return true
        }
    
        
        
        static getVal(id: number,key:any){
            if(TableGameSys.table[id] == undefined){
                return
            }

            if(TableGameSys.table[id][key] == undefined){
                return
            }

            return TableGameSys.table[id][key];
        }
    
            
            
            
    /** 字符串ID */
    get strKey(): string {
        return this.data.strKey;
    }
    /** 名称 */
    get name(): string {
        return this.data.name;
    }
    /** 开放等级 */
    get open_rolelevel(): number {
        return this.data.open_rolelevel;
    }
    /** 服务器开放天数 */
    get server_opendays(): number {
        return this.data.server_opendays;
    }
    /** 完成任务 */
    get need_task(): number {
        return this.data.need_task;
    }
    /** 加入公会 */
    get guild(): number {
        return this.data.guild;
    }
    /** 每日有效时间 */
    get act_time(): string {
        return this.data.act_time;
    }
    /** 是否开放 */
    get is_open(): number {
        return this.data.is_open;
    }
    /** 开服几天后关闭 */
    get close_serverday(): number {
        return this.data.close_serverday;
    }
    /** 是否历程 */
    get is_licheng(): number {
        return this.data.is_licheng;
    }
    /** 历程排序 */
    get licheng_order(): number {
        return this.data.licheng_order;
    }
    /** 历程道具奖励 */
    get drop(): any {
        return this.data.drop;
    }
    }
                