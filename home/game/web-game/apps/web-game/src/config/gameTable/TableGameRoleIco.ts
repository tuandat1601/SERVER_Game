
    import { JsonUtil } from "../../game-config/JsonUtil";
            
    export class TableGameRoleIco {
        static TableName: string = "GameRoleIco";
        static table:any = null;
            
        
            
        
                
            
        private data: any;
            
            
        constructor(id: string){
            this.init(id)
        }
    
        static initTable(){
            if (!TableGameRoleIco.table) {
                TableGameRoleIco.table = JsonUtil.get(TableGameRoleIco.TableName);
            }
        }
    
        static getTable(){
            return TableGameRoleIco.table
        }
    
        private init(id: string) {
            this.data = TableGameRoleIco.table[id];
            this.id = id;
        }
            
        /** 系统头像表【KEY】 */
        id: string;
        
        
        static checkHave(id: string){
            if(TableGameRoleIco.table[id] == undefined){
                return false
            }
            return true
        }
    
        
        
        static getVal(id: string,key:any){
            if(TableGameRoleIco.table[id] == undefined){
                return
            }

            if(TableGameRoleIco.table[id][key] == undefined){
                return
            }

            return TableGameRoleIco.table[id][key];
        }
    
            
            
            
    }
                