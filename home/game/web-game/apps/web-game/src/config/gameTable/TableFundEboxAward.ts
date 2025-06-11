
    import { JsonUtil } from "../../game-config/JsonUtil";
            
    export class TableFundEboxAward {
        static TableName: string = "FundEboxAward";
        static table:any = null;
            
        
            
        
        static field_drop: string = "drop";
        static field_drop2: string = "drop2";
                
            
        private data: any;
            
            
        constructor(id: number){
            this.init(id)
        }
    
        static initTable(){
            if (!TableFundEboxAward.table) {
                TableFundEboxAward.table = JsonUtil.get(TableFundEboxAward.TableName);
            }
        }
    
        static getTable(){
            return TableFundEboxAward.table
        }
    
        private init(id: number) {
            this.data = TableFundEboxAward.table[id];
            this.id = id;
        }
            
        /** 锻造等级基金表【KEY】 */
        id: number;
        
        
        static checkHave(id: number){
            if(TableFundEboxAward.table[id] == undefined){
                return false
            }
            return true
        }
    
        
        
        static getVal(id: number,key:any){
            if(TableFundEboxAward.table[id] == undefined){
                return
            }

            if(TableFundEboxAward.table[id][key] == undefined){
                return
            }

            return TableFundEboxAward.table[id][key];
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
                