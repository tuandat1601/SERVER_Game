
    import { JsonUtil } from "../../game-config/JsonUtil";
            
    export class TableGameDrop {
        static TableName: string = "GameDrop";
        static table:any = null;
            
        
            
        
        static field_type: string = "type";
        static field_drop: string = "drop";
                
            
        private data: any;
            
            
        constructor(id: number){
            this.init(id)
        }
    
        static initTable(){
            if (!TableGameDrop.table) {
                TableGameDrop.table = JsonUtil.get(TableGameDrop.TableName);
            }
        }
    
        static getTable(){
            return TableGameDrop.table
        }
    
        private init(id: number) {
            this.data = TableGameDrop.table[id];
            this.id = id;
        }
            
        /** 掉落表【KEY】 */
        id: number;
        
        
        static checkHave(id: number){
            if(TableGameDrop.table[id] == undefined){
                return false
            }
            return true
        }
    
        
        
        static getVal(id: number,key:any){
            if(TableGameDrop.table[id] == undefined){
                return
            }

            if(TableGameDrop.table[id][key] == undefined){
                return
            }

            return TableGameDrop.table[id][key];
        }
    
            
            
            
    /** 掉落规则 */
    get type(): number {
        return this.data.type;
    }
    /** 掉落数据 */
    get drop(): any {
        return this.data.drop;
    }
    }
                