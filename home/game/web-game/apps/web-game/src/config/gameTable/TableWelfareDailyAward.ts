
    import { JsonUtil } from "../../game-config/JsonUtil";
            
    export class TableWelfareDailyAward {
        static TableName: string = "WelfareDailyAward";
        static table:any = null;
            
        
            
        
        static field_drop: string = "drop";
                
            
        private data: any;
            
            
        constructor(id: number){
            this.init(id)
        }
    
        static initTable(){
            if (!TableWelfareDailyAward.table) {
                TableWelfareDailyAward.table = JsonUtil.get(TableWelfareDailyAward.TableName);
            }
        }
    
        static getTable(){
            return TableWelfareDailyAward.table
        }
    
        private init(id: number) {
            this.data = TableWelfareDailyAward.table[id];
            this.id = id;
        }
            
        /** 福利-每日有礼表【KEY】 */
        id: number;
        
        
        static checkHave(id: number){
            if(TableWelfareDailyAward.table[id] == undefined){
                return false
            }
            return true
        }
    
        
        
        static getVal(id: number,key:any){
            if(TableWelfareDailyAward.table[id] == undefined){
                return
            }

            if(TableWelfareDailyAward.table[id][key] == undefined){
                return
            }

            return TableWelfareDailyAward.table[id][key];
        }
    
            
            
            
    /** 道具奖励 */
    get drop(): any {
        return this.data.drop;
    }
    }
                