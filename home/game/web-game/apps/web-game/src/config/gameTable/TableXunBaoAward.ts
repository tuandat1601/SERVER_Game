
    import { JsonUtil } from "../../game-config/JsonUtil";
            
    export class TableXunBaoAward {
        static TableName: string = "XunBaoAward";
        static table:any = null;
            
        
            
        
        static field_times: string = "times";
        static field_drop: string = "drop";
                
            
        private data: any;
            
            
        constructor(id: number){
            this.init(id)
        }
    
        static initTable(){
            if (!TableXunBaoAward.table) {
                TableXunBaoAward.table = JsonUtil.get(TableXunBaoAward.TableName);
            }
        }
    
        static getTable(){
            return TableXunBaoAward.table
        }
    
        private init(id: number) {
            this.data = TableXunBaoAward.table[id];
            this.id = id;
        }
            
        /** 游戏系统配置表【KEY】 */
        id: number;
        
        
        static checkHave(id: number){
            if(TableXunBaoAward.table[id] == undefined){
                return false
            }
            return true
        }
    
        
        
        static getVal(id: number,key:any){
            if(TableXunBaoAward.table[id] == undefined){
                return
            }

            if(TableXunBaoAward.table[id][key] == undefined){
                return
            }

            return TableXunBaoAward.table[id][key];
        }
    
            
            
            
    /** 次数 */
    get times(): number {
        return this.data.times;
    }
    /** 奖励 */
    get drop(): any {
        return this.data.drop;
    }
    }
                