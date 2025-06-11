
    import { JsonUtil } from "../../game-config/JsonUtil";
            
    export class TableTaskTargetType {
        static TableName: string = "TaskTargetType";
        static table:any = null;
            
        
        static finish_game_leves = 1;
        static ebox_count = 2;
        static total_ebox_count = 3;
        static sbox_count = 4;
        static total_sbox_count = 5;
        static equip_posup = 6;
        static total_equip_posup = 7;
        static finish_elite_leves = 8;
        static time_award_count = 9;
        static time_award_qcount = 10;
        static hero_lvup_count = 11;
        static fight_game_leves = 12;
        static skill_lvup_conut = 13;
        static reached_ebox_lv = 14;
        static add_item = 15;
        static fight_arena = 16;
        static medal_uplevel = 17;
        static hero_lv = 18;
        static shop_buy = 19;
        static ps_act_count = 20;
        static ps_shell_up = 21;
        static ps_damage = 22;
        static skill_open_pos = 23;
        static skill_setup = 24;
        static fight_elite_leves = 25;
        static sell_equip_num = 26;
        static upgrade_lv = 27;
        static aureole_uplv = 28;
        static fight_demon_abyss = 29;
        static eat_fruit = 30;
        static fight_aemon_abyss = 31;
        static wrestle_pk = 32;
        static mercenary_go = 33;
        static rare_monster_park = 34;
        static change_total = 35;
        static ps_kill_ship = 36;
        static demon_abyss_lv = 37;
        static mercenary_act = 38;
        static dam_aemon_abyss = 39;
        static finish_aureole_lv = 40;
        static rare_monster_num = 41;
        static skill_trench = 42;
            
        
        static field_strKey: string = "strKey";
        static field_name: string = "name";
        static field_datatype: string = "datatype";
        static field_triggertype: string = "triggertype";
        static field_isfinish: string = "isfinish";
        static field_act: string = "act";
                
            
        private data: any;
            
            
        constructor(id: number){
            this.init(id)
        }
    
        static initTable(){
            if (!TableTaskTargetType.table) {
                TableTaskTargetType.table = JsonUtil.get(TableTaskTargetType.TableName);
            }
        }
    
        static getTable(){
            return TableTaskTargetType.table
        }
    
        private init(id: number) {
            this.data = TableTaskTargetType.table[id];
            this.id = id;
        }
            
        /** 任务表目标类型表【KEY】 */
        id: number;
        
        
        static checkHave(id: number){
            if(TableTaskTargetType.table[id] == undefined){
                return false
            }
            return true
        }
    
        
        
        static getVal(id: number,key:any){
            if(TableTaskTargetType.table[id] == undefined){
                return
            }

            if(TableTaskTargetType.table[id][key] == undefined){
                return
            }

            return TableTaskTargetType.table[id][key];
        }
    
            
            
            
    /** 字符串ID */
    get strKey(): string {
        return this.data.strKey;
    }
    /** 名称 */
    get name(): string {
        return this.data.name;
    }
    /** 关联角色数据字段类型 */
    get datatype(): number {
        return this.data.datatype;
    }
    /** 触发计数类型 */
    get triggertype(): number {
        return this.data.triggertype;
    }
    /** 是否需要执行完成 */
    get isfinish(): number {
        return this.data.isfinish;
    }
    /** 任务触发计数类型 */
    get act(): any {
        return this.data.act;
    }
    }
                