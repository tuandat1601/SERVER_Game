
    import { JsonUtil } from "../../game-config/JsonUtil";
            
    export class TableGameEquipAdd {
        static TableName: string = "GameEquipAdd";
        static table:any = null;
            
        
            
        
        static field_rolltype: string = "rolltype";
        static field_attr: string = "attr";
                
            
        private data: any;
            
            
        constructor(id: number){
            this.init(id)
        }
    
        static initTable(){
            if (!TableGameEquipAdd.table) {
                TableGameEquipAdd.table = JsonUtil.get(TableGameEquipAdd.TableName);
            }
        }
    
        static getTable(){
            return TableGameEquipAdd.table
        }
    
        private init(id: number) {
            this.data = TableGameEquipAdd.table[id];
            this.id = id;
        }
            
        /** 装备附加词条表【KEY】 */
        id: number;
        
        
        static checkHave(id: number){
            if(TableGameEquipAdd.table[id] == undefined){
                return false
            }
            return true
        }
    
        
        
        static getVal(id: number,key:any){
            if(TableGameEquipAdd.table[id] == undefined){
                return
            }

            if(TableGameEquipAdd.table[id][key] == undefined){
                return
            }

            return TableGameEquipAdd.table[id][key];
        }
    
            
            
            
    /** 随机规则 */
    get rolltype(): number {
        return this.data.rolltype;
    }
    /** 属性 */
    get attr(): any {
        return this.data.attr;
    }
    }
                