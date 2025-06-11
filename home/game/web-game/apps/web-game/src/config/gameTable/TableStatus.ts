
    import { JsonUtil } from "../../game-config/JsonUtil";
            
    export class TableStatus {
        static TableName: string = "Status";
        static table:any = null;
            
        
        static month_card = 101;
        static fund_level = 102;
        static fund_ebox = 103;
        static ps_welfare = 104;
        static forever_card = 105;
            
        
        static field_strKey: string = "strKey";
        static field_name: string = "name";
        static field_timetype: string = "timetype";
        static field_time: string = "time";
        static field_privilege: string = "privilege";
                
            
        private data: any;
            
            
        constructor(id: number){
            this.init(id)
        }
    
        static initTable(){
            if (!TableStatus.table) {
                TableStatus.table = JsonUtil.get(TableStatus.TableName);
            }
        }
    
        static getTable(){
            return TableStatus.table
        }
    
        private init(id: number) {
            this.data = TableStatus.table[id];
            this.id = id;
        }
            
        /** 持续状态表【KEY】 */
        id: number;
        
        
        static checkHave(id: number){
            if(TableStatus.table[id] == undefined){
                return false
            }
            return true
        }
    
        
        
        static getVal(id: number,key:any){
            if(TableStatus.table[id] == undefined){
                return
            }

            if(TableStatus.table[id][key] == undefined){
                return
            }

            return TableStatus.table[id][key];
        }
    
            
            
            
    /** 字符串ID */
    get strKey(): string {
        return this.data.strKey;
    }
    /** 名称 */
    get name(): string {
        return this.data.name;
    }
    /** 持有类型 */
    get timetype(): number {
        return this.data.timetype;
    }
    /** 持有时间(天) */
    get time(): number {
        return this.data.time;
    }
    /** 附加特权 */
    get privilege(): any {
        return this.data.privilege;
    }
    }
                