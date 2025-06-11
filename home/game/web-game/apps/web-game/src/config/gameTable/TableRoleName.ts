
    import { JsonUtil } from "../../game-config/JsonUtil";
            
    export class TableRoleName {
        static TableName: string = "RoleName";
        static table:any = null;
            
        
            
        
        static field_front: string = "front";
        static field_later: string = "later";
                
            
        private data: any;
            
            
        constructor(id: number){
            this.init(id)
        }
    
        static initTable(){
            if (!TableRoleName.table) {
                TableRoleName.table = JsonUtil.get(TableRoleName.TableName);
            }
        }
    
        static getTable(){
            return TableRoleName.table
        }
    
        private init(id: number) {
            this.data = TableRoleName.table[id];
            this.id = id;
        }
            
        /** 序号【KEY】 */
        id: number;
        
        
        static checkHave(id: number){
            if(TableRoleName.table[id] == undefined){
                return false
            }
            return true
        }
    
        
        
        static getVal(id: number,key:any){
            if(TableRoleName.table[id] == undefined){
                return
            }

            if(TableRoleName.table[id][key] == undefined){
                return
            }

            return TableRoleName.table[id][key];
        }
    
            
            
            
    /** 姓 */
    get front(): string {
        return this.data.front;
    }
    /** 名 */
    get later(): string {
        return this.data.later;
    }
    }
                