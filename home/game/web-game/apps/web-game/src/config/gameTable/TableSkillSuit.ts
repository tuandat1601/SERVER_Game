
    import { JsonUtil } from "../../game-config/JsonUtil";
            
    export class TableSkillSuit {
        static TableName: string = "SkillSuit";
        static table:any = null;
            
        
            
        
        static field_skillid: string = "skillid";
        static field_group: string = "group";
        static field_level: string = "level";
        static field_name: string = "name";
        static field_hp_rate: string = "hp_rate";
        static field_atk_rate: string = "atk_rate";
        static field_def_rate: string = "def_rate";
        static field_aktBack_pro: string = "aktBack_pro";
        static field_douleAtk_pro: string = "douleAtk_pro";
        static field_miss: string = "miss";
        static field_criticalAtk_pro: string = "criticalAtk_pro";
        static field_add_damage_rate: string = "add_damage_rate";
                
            
        private data: any;
            
            
        constructor(id: number){
            this.init(id)
        }
    
        static initTable(){
            if (!TableSkillSuit.table) {
                TableSkillSuit.table = JsonUtil.get(TableSkillSuit.TableName);
            }
        }
    
        static getTable(){
            return TableSkillSuit.table
        }
    
        private init(id: number) {
            this.data = TableSkillSuit.table[id];
            this.id = id;
        }
            
        /** 技能共鸣【KEY】 */
        id: number;
        
        
        static checkHave(id: number){
            if(TableSkillSuit.table[id] == undefined){
                return false
            }
            return true
        }
    
        
        
        static getVal(id: number,key:any){
            if(TableSkillSuit.table[id] == undefined){
                return
            }

            if(TableSkillSuit.table[id][key] == undefined){
                return
            }

            return TableSkillSuit.table[id][key];
        }
    
            
            
            
    /** 技能 */
    get skillid(): any {
        return this.data.skillid;
    }
    /** 组(每组向下兼容) */
    get group(): number {
        return this.data.group;
    }
    /** 等级(每组向下兼容) */
    get level(): number {
        return this.data.level;
    }
    /** 名字 */
    get name(): string {
        return this.data.name;
    }
    /** 生命加成 */
    get hp_rate(): number {
        return this.data.hp_rate;
    }
    /** 攻击加成 */
    get atk_rate(): number {
        return this.data.atk_rate;
    }
    /** 防御加成 */
    get def_rate(): number {
        return this.data.def_rate;
    }
    /** 反击 */
    get aktBack_pro(): number {
        return this.data.aktBack_pro;
    }
    /** 连击 */
    get douleAtk_pro(): number {
        return this.data.douleAtk_pro;
    }
    /** 闪避 */
    get miss(): number {
        return this.data.miss;
    }
    /** 暴击 */
    get criticalAtk_pro(): number {
        return this.data.criticalAtk_pro;
    }
    /** 伤害增加 */
    get add_damage_rate(): number {
        return this.data.add_damage_rate;
    }
    }
                