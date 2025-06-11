
    import { JsonUtil } from "../../game-config/JsonUtil";
            
    export class TableMercenaryFight {
        static TableName: string = "MercenaryFight";
        static table:any = null;
            
        
            
        
        static field_mlv: string = "mlv";
        static field_rlv: string = "rlv";
                
            
        private data: any;
            
            
        constructor(id: number){
            this.init(id)
        }
    
        static initTable(){
            if (!TableMercenaryFight.table) {
                TableMercenaryFight.table = JsonUtil.get(TableMercenaryFight.TableName);
            }
        }
    
        static getTable(){
            return TableMercenaryFight.table
        }
    
        private init(id: number) {
            this.data = TableMercenaryFight.table[id];
            this.id = id;
        }
            
        /** 佣兵切磋表【KEY】 */
        id: number;
        
        
        static checkHave(id: number){
            if(TableMercenaryFight.table[id] == undefined){
                return false
            }
            return true
        }
    
        
        
        static getVal(id: number,key:any){
            if(TableMercenaryFight.table[id] == undefined){
                return
            }

            if(TableMercenaryFight.table[id][key] == undefined){
                return
            }

            return TableMercenaryFight.table[id][key];
        }
    
            
            
            
    /** 需要佣兵等级 */
    get mlv(): number {
        return this.data.mlv;
    }
    /** 需要角色等级 */
    get rlv(): number {
        return this.data.rlv;
    }
    }
                