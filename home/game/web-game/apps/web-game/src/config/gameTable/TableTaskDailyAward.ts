
    import { JsonUtil } from "../../game-config/JsonUtil";
            
    export class TableTaskDailyAward {
        static TableName: string = "TaskDailyAward";
        static table:any = null;
            
        
            
        
        static field_cost: string = "cost";
        static field_drop: string = "drop";
        static field_exp: string = "exp";
                
            
        private data: any;
            
            
        constructor(id: number){
            this.init(id)
        }
    
        static initTable(){
            if (!TableTaskDailyAward.table) {
                TableTaskDailyAward.table = JsonUtil.get(TableTaskDailyAward.TableName);
            }
        }
    
        static getTable(){
            return TableTaskDailyAward.table
        }
    
        private init(id: number) {
            this.data = TableTaskDailyAward.table[id];
            this.id = id;
        }
            
        /** 每日任务宝箱奖励表【KEY】 */
        id: number;
        
        
        static checkHave(id: number){
            if(TableTaskDailyAward.table[id] == undefined){
                return false
            }
            return true
        }
    
        
        
        static getVal(id: number,key:any){
            if(TableTaskDailyAward.table[id] == undefined){
                return
            }

            if(TableTaskDailyAward.table[id][key] == undefined){
                return
            }

            return TableTaskDailyAward.table[id][key];
        }
    
            
            
            
    /** 档位 */
    get cost(): string {
        return this.data.cost;
    }
    /** 道具奖励 */
    get drop(): any {
        return this.data.drop;
    }
    /** 任务角色经验奖励 */
    get exp(): number {
        return this.data.exp;
    }
    }
                