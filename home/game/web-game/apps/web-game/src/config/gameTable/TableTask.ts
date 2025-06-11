
    import { JsonUtil } from "../../game-config/JsonUtil";
            
    export class TableTask {
        static TableName: string = "Task";
        static table:any = null;
            
        
            
        
        static field_name: string = "name";
        static field_type: string = "type";
        static field_target: string = "target";
        static field_perid: string = "perid";
        static field_nextid: string = "nextid";
        static field_drop: string = "drop";
        static field_exp: string = "exp";
                
            
        private data: any;
            
            
        constructor(id: number){
            this.init(id)
        }
    
        static initTable(){
            if (!TableTask.table) {
                TableTask.table = JsonUtil.get(TableTask.TableName);
            }
        }
    
        static getTable(){
            return TableTask.table
        }
    
        private init(id: number) {
            this.data = TableTask.table[id];
            this.id = id;
        }
            
        /** 任务表【KEY】 */
        id: number;
        
        
        static checkHave(id: number){
            if(TableTask.table[id] == undefined){
                return false
            }
            return true
        }
    
        
        
        static getVal(id: number,key:any){
            if(TableTask.table[id] == undefined){
                return
            }

            if(TableTask.table[id][key] == undefined){
                return
            }

            return TableTask.table[id][key];
        }
    
            
            
            
    /** 名称 */
    get name(): string {
        return this.data.name;
    }
    /** 类型 */
    get type(): string {
        return this.data.type;
    }
    /** 目标 */
    get target(): any {
        return this.data.target;
    }
    /** 前置任务ID */
    get perid(): any {
        return this.data.perid;
    }
    /** 后续任务ID */
    get nextid(): any {
        return this.data.nextid;
    }
    /** 任务道具奖励 */
    get drop(): any {
        return this.data.drop;
    }
    /** 任务角色经验奖励 */
    get exp(): number {
        return this.data.exp;
    }
    }
                