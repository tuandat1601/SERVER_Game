
    import { JsonUtil } from "../../game-config/JsonUtil";
            
    export class TableGuildTaskAward {
        static TableName: string = "GuildTaskAward";
        static table:any = null;
            
        
            
        
        static field_point: string = "point";
        static field_drop: string = "drop";
                
            
        private data: any;
            
            
        constructor(id: number){
            this.init(id)
        }
    
        static initTable(){
            if (!TableGuildTaskAward.table) {
                TableGuildTaskAward.table = JsonUtil.get(TableGuildTaskAward.TableName);
            }
        }
    
        static getTable(){
            return TableGuildTaskAward.table
        }
    
        private init(id: number) {
            this.data = TableGuildTaskAward.table[id];
            this.id = id;
        }
            
        /** 游戏系统配置表【KEY】 */
        id: number;
        
        
        static checkHave(id: number){
            if(TableGuildTaskAward.table[id] == undefined){
                return false
            }
            return true
        }
    
        
        
        static getVal(id: number,key:any){
            if(TableGuildTaskAward.table[id] == undefined){
                return
            }

            if(TableGuildTaskAward.table[id][key] == undefined){
                return
            }

            return TableGuildTaskAward.table[id][key];
        }
    
            
            
            
    /** 活跃度 */
    get point(): number {
        return this.data.point;
    }
    /** 奖励 */
    get drop(): any {
        return this.data.drop;
    }
    }
                