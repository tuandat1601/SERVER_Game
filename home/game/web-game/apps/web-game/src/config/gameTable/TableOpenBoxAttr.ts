
    import { JsonUtil } from "../../game-config/JsonUtil";
            
    export class TableOpenBoxAttr {
        static TableName: string = "OpenBoxAttr";
        static table:any = null;
            
        
            
        
        static field_type: string = "type";
        static field_numid: string = "numid";
        static field_name: string = "name";
                
            
        private data: any;
            
            
        constructor(id: number){
            this.init(id)
        }
    
        static initTable(){
            if (!TableOpenBoxAttr.table) {
                TableOpenBoxAttr.table = JsonUtil.get(TableOpenBoxAttr.TableName);
            }
        }
    
        static getTable(){
            return TableOpenBoxAttr.table
        }
    
        private init(id: number) {
            this.data = TableOpenBoxAttr.table[id];
            this.id = id;
        }
            
        /** 表ID【KEY】 */
        id: number;
        
        
        static checkHave(id: number){
            if(TableOpenBoxAttr.table[id] == undefined){
                return false
            }
            return true
        }
    
        
        
        static getVal(id: number,key:any){
            if(TableOpenBoxAttr.table[id] == undefined){
                return
            }

            if(TableOpenBoxAttr.table[id][key] == undefined){
                return
            }

            return TableOpenBoxAttr.table[id][key];
        }
    
            
            
            
    /** 类型 */
    get type(): number {
        return this.data.type;
    }
    /** 属性ID */
    get numid(): number {
        return this.data.numid;
    }
    /** 属性名 */
    get name(): string {
        return this.data.name;
    }
    }
                