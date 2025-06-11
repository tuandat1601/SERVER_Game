
    import { JsonUtil } from "../../game-config/JsonUtil";
            
    export class TableTisheng {
        static TableName: string = "Tisheng";
        static table:any = null;
            
        
            
        
        static field_type: string = "type";
        static field_name: string = "name";
        static field_sysId: string = "sysId";
        static field_iconRes: string = "iconRes";
                
            
        private data: any;
            
            
        constructor(id: number){
            this.init(id)
        }
    
        static initTable(){
            if (!TableTisheng.table) {
                TableTisheng.table = JsonUtil.get(TableTisheng.TableName);
            }
        }
    
        static getTable(){
            return TableTisheng.table
        }
    
        private init(id: number) {
            this.data = TableTisheng.table[id];
            this.id = id;
        }
            
        /** 提升实力【KEY】 */
        id: number;
        
        
        static checkHave(id: number){
            if(TableTisheng.table[id] == undefined){
                return false
            }
            return true
        }
    
        
        
        static getVal(id: number,key:any){
            if(TableTisheng.table[id] == undefined){
                return
            }

            if(TableTisheng.table[id][key] == undefined){
                return
            }

            return TableTisheng.table[id][key];
        }
    
            
            
            
    /** 类型 */
    get type(): number {
        return this.data.type;
    }
    /** 名称 */
    get name(): string {
        return this.data.name;
    }
    /** sysId */
    get sysId(): number {
        return this.data.sysId;
    }
    /** 图标 */
    get iconRes(): string {
        return this.data.iconRes;
    }
    }
                