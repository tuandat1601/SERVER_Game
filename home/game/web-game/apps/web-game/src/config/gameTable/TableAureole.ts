
    import { JsonUtil } from "../../game-config/JsonUtil";
            
    export class TableAureole {
        static TableName: string = "Aureole";
        static table:any = null;
            
        
            
        
        static field_nextid: string = "nextid";
        static field_name: string = "name";
        static field_rank: string = "rank";
        static field_lv: string = "lv";
        static field_type: string = "type";
        static field_actcostitem: string = "actcostitem";
        static field_costitem: string = "costitem";
        static field_hp: string = "hp";
        static field_atk: string = "atk";
        static field_def: string = "def";
        static field_add_hp_per: string = "add_hp_per";
        static field_dec_atkBack_pro: string = "dec_atkBack_pro";
        static field_dec_doubleAtk_pro: string = "dec_doubleAtk_pro";
        static field_dec_miss: string = "dec_miss";
        static field_dec_criticalAtk_pro: string = "dec_criticalAtk_pro";
        static field_dec_damage_rate: string = "dec_damage_rate";
        static field_desc: string = "desc";
                
            
        private data: any;
            
            
        constructor(id: number){
            this.init(id)
        }
    
        static initTable(){
            if (!TableAureole.table) {
                TableAureole.table = JsonUtil.get(TableAureole.TableName);
            }
        }
    
        static getTable(){
            return TableAureole.table
        }
    
        private init(id: number) {
            this.data = TableAureole.table[id];
            this.id = id;
        }
            
        /** 光环表【KEY】 */
        id: number;
        
        
        static checkHave(id: number){
            if(TableAureole.table[id] == undefined){
                return false
            }
            return true
        }
    
        
        
        static getVal(id: number,key:any){
            if(TableAureole.table[id] == undefined){
                return
            }

            if(TableAureole.table[id][key] == undefined){
                return
            }

            return TableAureole.table[id][key];
        }
    
            
            
            
    /** 下一级ID */
    get nextid(): number {
        return this.data.nextid;
    }
    /** 光环名 */
    get name(): string {
        return this.data.name;
    }
    /** 等阶 */
    get rank(): number {
        return this.data.rank;
    }
    /** 等级 */
    get lv(): number {
        return this.data.lv;
    }
    /** 类型 */
    get type(): number {
        return this.data.type;
    }
    /** 激活所需道具 */
    get actcostitem(): any {
        return this.data.actcostitem;
    }
    /** 升级所需道具 */
    get costitem(): any {
        return this.data.costitem;
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
    /** 治疗效果 */
    get add_hp_per(): number {
        return this.data.add_hp_per;
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
    /** 伤害减免 */
    get dec_damage_rate(): number {
        return this.data.dec_damage_rate;
    }
    /** 描述 */
    get desc(): string {
        return this.data.desc;
    }
    }
                