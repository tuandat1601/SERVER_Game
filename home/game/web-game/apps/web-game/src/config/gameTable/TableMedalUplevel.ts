
    import { JsonUtil } from "../../game-config/JsonUtil";
            
    export class TableMedalUplevel {
        static TableName: string = "MedalUplevel";
        static table:any = null;
            
        
            
        
        static field_name: string = "name";
        static field_rank: string = "rank";
        static field_lv: string = "lv";
        static field_nextid: string = "nextid";
        static field_costitem: string = "costitem";
        static field_baseexp: string = "baseexp";
        static field_critexp: string = "critexp";
        static field_critprob: string = "critprob";
        static field_costexp: string = "costexp";
        static field_hp: string = "hp";
        static field_atk: string = "atk";
        static field_def: string = "def";
        static field_dec_atkBack_pro: string = "dec_atkBack_pro";
        static field_dec_doubleAtk_pro: string = "dec_doubleAtk_pro";
        static field_dec_miss: string = "dec_miss";
        static field_dec_criticalAtk_pro: string = "dec_criticalAtk_pro";
                
            
        private data: any;
            
            
        constructor(id: number){
            this.init(id)
        }
    
        static initTable(){
            if (!TableMedalUplevel.table) {
                TableMedalUplevel.table = JsonUtil.get(TableMedalUplevel.TableName);
            }
        }
    
        static getTable(){
            return TableMedalUplevel.table
        }
    
        private init(id: number) {
            this.data = TableMedalUplevel.table[id];
            this.id = id;
        }
            
        /** 勋章表【KEY】 */
        id: number;
        
        
        static checkHave(id: number){
            if(TableMedalUplevel.table[id] == undefined){
                return false
            }
            return true
        }
    
        
        
        static getVal(id: number,key:any){
            if(TableMedalUplevel.table[id] == undefined){
                return
            }

            if(TableMedalUplevel.table[id][key] == undefined){
                return
            }

            return TableMedalUplevel.table[id][key];
        }
    
            
            
            
    /** 勋章名 */
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
    /** 下一级ID */
    get nextid(): number {
        return this.data.nextid;
    }
    /** 升级所需道具 */
    get costitem(): any {
        return this.data.costitem;
    }
    /** 基础经验 */
    get baseexp(): number {
        return this.data.baseexp;
    }
    /** 暴击经验 */
    get critexp(): number {
        return this.data.critexp;
    }
    /** 暴击概率 */
    get critprob(): number {
        return this.data.critprob;
    }
    /** 升级所需经验 */
    get costexp(): number {
        return this.data.costexp;
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
    }
                