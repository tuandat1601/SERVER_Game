
    import { JsonUtil } from "../../game-config/JsonUtil";
            
    export class TableWrestleCard {
        static TableName: string = "WrestleCard";
        static table:any = null;
            
        
            
        
        static field_itemid: string = "itemid";
        static field_itemnum: string = "itemnum";
        static field_aktBack_pro: string = "aktBack_pro";
        static field_douleAtk_pro: string = "douleAtk_pro";
        static field_miss: string = "miss";
        static field_criticalAtk_pro: string = "criticalAtk_pro";
        static field_dec_atkBack_pro: string = "dec_atkBack_pro";
        static field_dec_doubleAtk_pro: string = "dec_doubleAtk_pro";
        static field_dec_miss: string = "dec_miss";
        static field_dec_criticalAtk_pro: string = "dec_criticalAtk_pro";
        static field_add_damage_rate: string = "add_damage_rate";
        static field_dec_damage_rate: string = "dec_damage_rate";
        static field_add_askill_pro: string = "add_askill_pro";
        static field_add_apskill_pro: string = "add_apskill_pro";
        static field_add_askill_dam: string = "add_askill_dam";
        static field_add_apskill_dam: string = "add_apskill_dam";
        static field_add_hp_per: string = "add_hp_per";
                
            
        private data: any;
            
            
        constructor(id: number){
            this.init(id)
        }
    
        static initTable(){
            if (!TableWrestleCard.table) {
                TableWrestleCard.table = JsonUtil.get(TableWrestleCard.TableName);
            }
        }
    
        static getTable(){
            return TableWrestleCard.table
        }
    
        private init(id: number) {
            this.data = TableWrestleCard.table[id];
            this.id = id;
        }
            
        /** 角斗属性卡表【KEY】 */
        id: number;
        
        
        static checkHave(id: number){
            if(TableWrestleCard.table[id] == undefined){
                return false
            }
            return true
        }
    
        
        
        static getVal(id: number,key:any){
            if(TableWrestleCard.table[id] == undefined){
                return
            }

            if(TableWrestleCard.table[id][key] == undefined){
                return
            }

            return TableWrestleCard.table[id][key];
        }
    
            
            
            
    /** 道具id */
    get itemid(): number {
        return this.data.itemid;
    }
    /** 道具数量 */
    get itemnum(): number {
        return this.data.itemnum;
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
    /** 忽视反击 */
    get dec_atkBack_pro(): number {
        return this.data.dec_atkBack_pro;
    }
    /** 忽视连击 */
    get dec_doubleAtk_pro(): number {
        return this.data.dec_doubleAtk_pro;
    }
    /** 忽视闪避 */
    get dec_miss(): number {
        return this.data.dec_miss;
    }
    /** 忽视暴击 */
    get dec_criticalAtk_pro(): number {
        return this.data.dec_criticalAtk_pro;
    }
    /** 伤害增加 */
    get add_damage_rate(): number {
        return this.data.add_damage_rate;
    }
    /** 伤害减免 */
    get dec_damage_rate(): number {
        return this.data.dec_damage_rate;
    }
    /** 主动技概率 */
    get add_askill_pro(): number {
        return this.data.add_askill_pro;
    }
    /** 追击技概率 */
    get add_apskill_pro(): number {
        return this.data.add_apskill_pro;
    }
    /** 主动技伤害 */
    get add_askill_dam(): number {
        return this.data.add_askill_dam;
    }
    /** 追击技伤害 */
    get add_apskill_dam(): number {
        return this.data.add_apskill_dam;
    }
    /** 治疗效果 */
    get add_hp_per(): number {
        return this.data.add_hp_per;
    }
    }
                