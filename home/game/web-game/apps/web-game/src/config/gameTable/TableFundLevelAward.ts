
    import { JsonUtil } from "../../game-config/JsonUtil";
            
    export class TableFundLevelAward {
        static TableName: string = "FundLevelAward";
        static table:any = null;
            
        
            
        
        static field_drop: string = "drop";
        static field_drop2: string = "drop2";
                
            
        private data: any;
            
            
        constructor(id: number){
            this.init(id)
        }
    
        static initTable(){
            if (!TableFundLevelAward.table) {
                TableFundLevelAward.table = JsonUtil.get(TableFundLevelAward.TableName);
            }
        }
    
        static getTable(){
            return TableFundLevelAward.table
        }
    
        private init(id: number) {
            this.data = TableFundLevelAward.table[id];
            this.id = id;
        }
            
        /** 等级基金表【KEY】 */
        id: number;
        
        
        static checkHave(id: number){
            if(TableFundLevelAward.table[id] == undefined){
                return false
            }
            return true
        }
    
        
        
        static getVal(id: number,key:any){
            if(TableFundLevelAward.table[id] == undefined){
                return
            }

            if(TableFundLevelAward.table[id][key] == undefined){
                return
            }

            return TableFundLevelAward.table[id][key];
        }
    
            
            
            
    /** 道具奖励 */
    get drop(): any {
        return this.data.drop;
    }
    /** 高级奖励 */
    get drop2(): any {
        return this.data.drop2;
    }
    }
                