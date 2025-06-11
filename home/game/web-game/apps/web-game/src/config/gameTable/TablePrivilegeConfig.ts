
    import { JsonUtil } from "../../game-config/JsonUtil";
            
    export class TablePrivilegeConfig {
        static TableName: string = "PrivilegeConfig";
        static table:any = null;
            
        
            
        
        static field_name: string = "name";
        static field_type: string = "type";
        static field_systemid: string = "systemid";
        static field_param: string = "param";
        static field_val: string = "val";
                
            
        private data: any;
            
            
        constructor(id: number){
            this.init(id)
        }
    
        static initTable(){
            if (!TablePrivilegeConfig.table) {
                TablePrivilegeConfig.table = JsonUtil.get(TablePrivilegeConfig.TableName);
            }
        }
    
        static getTable(){
            return TablePrivilegeConfig.table
        }
    
        private init(id: number) {
            this.data = TablePrivilegeConfig.table[id];
            this.id = id;
        }
            
        /** 特权类型表【KEY】 */
        id: number;
        
        
        static checkHave(id: number){
            if(TablePrivilegeConfig.table[id] == undefined){
                return false
            }
            return true
        }
    
        
        
        static getVal(id: number,key:any){
            if(TablePrivilegeConfig.table[id] == undefined){
                return
            }

            if(TablePrivilegeConfig.table[id][key] == undefined){
                return
            }

            return TablePrivilegeConfig.table[id][key];
        }
    
            
            
            
    /** 名称 */
    get name(): string {
        return this.data.name;
    }
    /** 特权类型 */
    get type(): number {
        return this.data.type;
    }
    /** 有效系统类型 */
    get systemid(): number {
        return this.data.systemid;
    }
    /** 关联参数 */
    get param(): number {
        return this.data.param;
    }
    /** 参数 */
    get val(): number {
        return this.data.val;
    }
    }
                