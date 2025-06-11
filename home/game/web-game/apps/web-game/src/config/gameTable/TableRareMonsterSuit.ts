
    import { JsonUtil } from "../../game-config/JsonUtil";
            
    export class TableRareMonsterSuit {
        static TableName: string = "RareMonsterSuit";
        static table:any = null;
            
        
            
        
        static field_mid: string = "mid";
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
            if (!TableRareMonsterSuit.table) {
                TableRareMonsterSuit.table = JsonUtil.get(TableRareMonsterSuit.TableName);
            }
        }
    
        static getTable(){
            return TableRareMonsterSuit.table
        }
    
        private init(id: number) {
            this.data = TableRareMonsterSuit.table[id];
            this.id = id;
        }
            
        /** 异兽共鸣【KEY】 */
        id: number;
        
        
        static checkHave(id: number){
            if(TableRareMonsterSuit.table[id] == undefined){
                return false
            }
            return true
        }
    
        
        
        static getVal(id: number,key:any){
            if(TableRareMonsterSuit.table[id] == undefined){
                return
            }

            if(TableRareMonsterSuit.table[id][key] == undefined){
                return
            }

            return TableRareMonsterSuit.table[id][key];
        }
    
            
            
            
    /** 异兽 */
    get mid(): any {
        return this.data.mid;
    }
    /** 组(每组向下兼容) */
    get group(): number {
        return this.data.group;
    }
    /** 组(每组向下兼容) */
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
                