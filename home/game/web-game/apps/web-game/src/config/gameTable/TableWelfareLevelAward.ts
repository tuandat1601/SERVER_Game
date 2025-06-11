
    import { JsonUtil } from "../../game-config/JsonUtil";
            
    export class TableWelfareLevelAward {
        static TableName: string = "WelfareLevelAward";
        static table:any = null;
            
        
            
        
        static field_drop: string = "drop";
                
            
        private data: any;
            
            
        constructor(id: number){
            this.init(id)
        }
    
        static initTable(){
            if (!TableWelfareLevelAward.table) {
                TableWelfareLevelAward.table = JsonUtil.get(TableWelfareLevelAward.TableName);
            }
        }
    
        static getTable(){
            return TableWelfareLevelAward.table
        }
    
        private init(id: number) {
            this.data = TableWelfareLevelAward.table[id];
            this.id = id;
        }
            
        /** 福利-等级奖励表【KEY】 */
        id: number;
        
        
        static checkHave(id: number){
            if(TableWelfareLevelAward.table[id] == undefined){
                return false
            }
            return true
        }
    
        
        
        static getVal(id: number,key:any){
            if(TableWelfareLevelAward.table[id] == undefined){
                return
            }

            if(TableWelfareLevelAward.table[id][key] == undefined){
                return
            }

            return TableWelfareLevelAward.table[id][key];
        }
    
            
            
            
    /** 道具奖励 */
    get drop(): any {
        return this.data.drop;
    }
    }
                