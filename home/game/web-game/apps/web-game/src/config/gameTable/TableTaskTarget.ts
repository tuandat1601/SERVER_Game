
    import { JsonUtil } from "../../game-config/JsonUtil";
            
    export class TableTaskTarget {
        static TableName: string = "TaskTarget";
        static table:any = null;
            
        
            
        
        static field_name: string = "name";
        static field_type: string = "type";
        static field_val: string = "val";
        static field_val2: string = "val2";
                
            
        private data: any;
            
            
        constructor(id: number){
            this.init(id)
        }
    
        static initTable(){
            if (!TableTaskTarget.table) {
                TableTaskTarget.table = JsonUtil.get(TableTaskTarget.TableName);
            }
        }
    
        static getTable(){
            return TableTaskTarget.table
        }
    
        private init(id: number) {
            this.data = TableTaskTarget.table[id];
            this.id = id;
        }
            
        /** 任务表目标表【KEY】 */
        id: number;
        
        
        static checkHave(id: number){
            if(TableTaskTarget.table[id] == undefined){
                return false
            }
            return true
        }
    
        
        
        static getVal(id: number,key:any){
            if(TableTaskTarget.table[id] == undefined){
                return
            }

            if(TableTaskTarget.table[id][key] == undefined){
                return
            }

            return TableTaskTarget.table[id][key];
        }
    
            
            
            
    /** 名称 */
    get name(): string {
        return this.data.name;
    }
    /** 类型 */
    get type(): number {
        return this.data.type;
    }
    /** 类型参数 */
    get val(): number {
        return this.data.val;
    }
    /** 扩展参数 */
    get val2(): any {
        return this.data.val2;
    }
    }
                