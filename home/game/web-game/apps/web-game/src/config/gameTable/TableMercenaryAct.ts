
    import { JsonUtil } from "../../game-config/JsonUtil";
            
    export class TableMercenaryAct {
        static TableName: string = "MercenaryAct";
        static table:any = null;
            
        
            
        
        static field_name: string = "name";
        static field_id: string = "id";
        static field_fid: string = "fid";
        static field_boxlv: string = "boxlv";
        static field_shipnum: string = "shipnum";
        static field_arena_winnum: string = "arena_winnum";
        static field_elitelv: string = "elitelv";
        static field_damage: string = "damage";
                
            
        private data: any;
            
            
        constructor(type: number){
            this.init(type)
        }
    
        static initTable(){
            if (!TableMercenaryAct.table) {
                TableMercenaryAct.table = JsonUtil.get(TableMercenaryAct.TableName);
            }
        }
    
        static getTable(){
            return TableMercenaryAct.table
        }
    
        private init(type: number) {
            this.data = TableMercenaryAct.table[type];
            this.type = type;
        }
            
        /** 佣兵激活表【KEY】 */
        type: number;
        
        
        static checkHave(type: number){
            if(TableMercenaryAct.table[type] == undefined){
                return false
            }
            return true
        }
    
        
        
        static getVal(type: number,key:any){
            if(TableMercenaryAct.table[type] == undefined){
                return
            }

            if(TableMercenaryAct.table[type][key] == undefined){
                return
            }

            return TableMercenaryAct.table[type][key];
        }
    
            
            
            
    /** 佣兵名 */
    get name(): string {
        return this.data.name;
    }
    /** 佣兵表id */
    get id(): any {
        return this.data.id;
    }
    /** 佣兵切磋 */
    get fid(): any {
        return this.data.fid;
    }
    /** 激活条件-铁匠铺等级 */
    get boxlv(): number {
        return this.data.boxlv;
    }
    /** 激活条件-击毁船 */
    get shipnum(): number {
        return this.data.shipnum;
    }
    /** 激活条件-竞技胜场 */
    get arena_winnum(): number {
        return this.data.arena_winnum;
    }
    /** 激活条件-精英lv */
    get elitelv(): number {
        return this.data.elitelv;
    }
    /** 激活条件-魔龙伤害 */
    get damage(): number {
        return this.data.damage;
    }
    }
                