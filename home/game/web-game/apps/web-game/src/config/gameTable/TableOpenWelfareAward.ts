
    import { JsonUtil } from "../../game-config/JsonUtil";
            
    export class TableOpenWelfareAward {
        static TableName: string = "OpenWelfareAward";
        static table:any = null;
            
        
            
        
        static field_cost: string = "cost";
        static field_drop: string = "drop";
                
            
        private data: any;
            
            
        constructor(id: number){
            this.init(id)
        }
    
        static initTable(){
            if (!TableOpenWelfareAward.table) {
                TableOpenWelfareAward.table = JsonUtil.get(TableOpenWelfareAward.TableName);
            }
        }
    
        static getTable(){
            return TableOpenWelfareAward.table
        }
    
        private init(id: number) {
            this.data = TableOpenWelfareAward.table[id];
            this.id = id;
        }
            
        /** 开服福利积分奖励表【KEY】 */
        id: number;
        
        
        static checkHave(id: number){
            if(TableOpenWelfareAward.table[id] == undefined){
                return false
            }
            return true
        }
    
        
        
        static getVal(id: number,key:any){
            if(TableOpenWelfareAward.table[id] == undefined){
                return
            }

            if(TableOpenWelfareAward.table[id][key] == undefined){
                return
            }

            return TableOpenWelfareAward.table[id][key];
        }
    
            
            
            
    /** 档位 */
    get cost(): string {
        return this.data.cost;
    }
    /** 道具奖励 */
    get drop(): any {
        return this.data.drop;
    }
    }
                