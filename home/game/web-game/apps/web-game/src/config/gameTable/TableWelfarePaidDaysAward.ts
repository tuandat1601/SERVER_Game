
    import { JsonUtil } from "../../game-config/JsonUtil";
            
    export class TableWelfarePaidDaysAward {
        static TableName: string = "WelfarePaidDaysAward";
        static table:any = null;
            
        
            
        
        static field_drop: string = "drop";
                
            
        private data: any;
            
            
        constructor(id: number){
            this.init(id)
        }
    
        static initTable(){
            if (!TableWelfarePaidDaysAward.table) {
                TableWelfarePaidDaysAward.table = JsonUtil.get(TableWelfarePaidDaysAward.TableName);
            }
        }
    
        static getTable(){
            return TableWelfarePaidDaysAward.table
        }
    
        private init(id: number) {
            this.data = TableWelfarePaidDaysAward.table[id];
            this.id = id;
        }
            
        /** 福利-积天豪礼表【KEY】 */
        id: number;
        
        
        static checkHave(id: number){
            if(TableWelfarePaidDaysAward.table[id] == undefined){
                return false
            }
            return true
        }
    
        
        
        static getVal(id: number,key:any){
            if(TableWelfarePaidDaysAward.table[id] == undefined){
                return
            }

            if(TableWelfarePaidDaysAward.table[id][key] == undefined){
                return
            }

            return TableWelfarePaidDaysAward.table[id][key];
        }
    
            
            
            
    /** 道具奖励 */
    get drop(): any {
        return this.data.drop;
    }
    }
                