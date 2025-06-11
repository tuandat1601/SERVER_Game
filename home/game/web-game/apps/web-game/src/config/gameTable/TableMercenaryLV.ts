
    import { JsonUtil } from "../../game-config/JsonUtil";
            
    export class TableMercenaryLV {
        static TableName: string = "MercenaryLV";
        static table:any = null;
            
        
            
        
        static field_nextid: string = "nextid";
        static field_name: string = "name";
        static field_type: string = "type";
        static field_lv: string = "lv";
        static field_exp: string = "exp";
        static field_cost: string = "cost";
        static field_hp: string = "hp";
        static field_atk: string = "atk";
        static field_def: string = "def";
        static field_atkspeed: string = "atkspeed";
        static field_aktBack_pro: string = "aktBack_pro";
        static field_dec_atkBack_pro: string = "dec_atkBack_pro";
        static field_douleAtk_pro: string = "douleAtk_pro";
        static field_dec_doubleAtk_pro: string = "dec_doubleAtk_pro";
        static field_miss: string = "miss";
        static field_dec_miss: string = "dec_miss";
        static field_criticalAtk_pro: string = "criticalAtk_pro";
        static field_dec_criticalAtk_pro: string = "dec_criticalAtk_pro";
        static field_add_askill_dam: string = "add_askill_dam";
        static field_add_apskill_dam: string = "add_apskill_dam";
        static field_add_damage_rate: string = "add_damage_rate";
        static field_dec_damage_rate: string = "dec_damage_rate";
                
            
        private data: any;
            
            
        constructor(id: number){
            this.init(id)
        }
    
        static initTable(){
            if (!TableMercenaryLV.table) {
                TableMercenaryLV.table = JsonUtil.get(TableMercenaryLV.TableName);
            }
        }
    
        static getTable(){
            return TableMercenaryLV.table
        }
    
        private init(id: number) {
            this.data = TableMercenaryLV.table[id];
            this.id = id;
        }
            
        /** 佣兵升级表【KEY】 */
        id: number;
        
        
        static checkHave(id: number){
            if(TableMercenaryLV.table[id] == undefined){
                return false
            }
            return true
        }
    
        
        
        static getVal(id: number,key:any){
            if(TableMercenaryLV.table[id] == undefined){
                return
            }

            if(TableMercenaryLV.table[id][key] == undefined){
                return
            }

            return TableMercenaryLV.table[id][key];
        }
    
            
            
            
    /** 下一级ID */
    get nextid(): number {
        return this.data.nextid;
    }
    /** 称号 */
    get name(): string {
        return this.data.name;
    }
    /** 类型 */
    get type(): number {
        return this.data.type;
    }
    /** 等级 */
    get lv(): number {
        return this.data.lv;
    }
    /** 经验 */
    get exp(): number {
        return this.data.exp;
    }
    /** 消耗道具获取对应经验 */
    get cost(): any {
        return this.data.cost;
    }
    /** 生命 */
    get hp(): number {
        return this.data.hp;
    }
    /** 攻击 */
    get atk(): number {
        return this.data.atk;
    }
    /** 防御 */
    get def(): number {
        return this.data.def;
    }
    /** 速度 */
    get atkspeed(): number {
        return this.data.atkspeed;
    }
    /** 反击 */
    get aktBack_pro(): number {
        return this.data.aktBack_pro;
    }
    /** 忽视反击 */
    get dec_atkBack_pro(): number {
        return this.data.dec_atkBack_pro;
    }
    /** 连击 */
    get douleAtk_pro(): number {
        return this.data.douleAtk_pro;
    }
    /** 忽视连击 */
    get dec_doubleAtk_pro(): number {
        return this.data.dec_doubleAtk_pro;
    }
    /** 闪避 */
    get miss(): number {
        return this.data.miss;
    }
    /** 忽视闪避 */
    get dec_miss(): number {
        return this.data.dec_miss;
    }
    /** 暴击 */
    get criticalAtk_pro(): number {
        return this.data.criticalAtk_pro;
    }
    /** 忽视暴击 */
    get dec_criticalAtk_pro(): number {
        return this.data.dec_criticalAtk_pro;
    }
    /** 主动技伤害 */
    get add_askill_dam(): number {
        return this.data.add_askill_dam;
    }
    /** 追击技伤害 */
    get add_apskill_dam(): number {
        return this.data.add_apskill_dam;
    }
    /** 伤害增加 */
    get add_damage_rate(): number {
        return this.data.add_damage_rate;
    }
    /** 伤害减免 */
    get dec_damage_rate(): number {
        return this.data.dec_damage_rate;
    }
    }
                