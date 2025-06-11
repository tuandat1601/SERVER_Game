
    import { JsonUtil } from "../../game-config/JsonUtil";
            
    export class TablePrivilegeType {
        static TableName: string = "PrivilegeType";
        static table:any = null;
            
        
        static free_advertising = 1;
        static shop_add_daily_num = 2;
        static timeaward_quickcount = 3;
        static add_item_bonus = 4;
        static add_exp_bonus = 5;
        static add_item = 6;
        static add_medal_exp = 7;
        static quick_fight = 8;
        static quick_ebox = 9;
            
        
        static field_strKey: string = "strKey";
        static field_name: string = "name";
        static field_cptype: string = "cptype";
                
            
        private data: any;
            
            
        constructor(id: number){
            this.init(id)
        }
    
        static initTable(){
            if (!TablePrivilegeType.table) {
                TablePrivilegeType.table = JsonUtil.get(TablePrivilegeType.TableName);
            }
        }
    
        static getTable(){
            return TablePrivilegeType.table
        }
    
        private init(id: number) {
            this.data = TablePrivilegeType.table[id];
            this.id = id;
        }
            
        /** 特权类型表【KEY】 */
        id: number;
        
        
        static checkHave(id: number){
            if(TablePrivilegeType.table[id] == undefined){
                return false
            }
            return true
        }
    
        
        
        static getVal(id: number,key:any){
            if(TablePrivilegeType.table[id] == undefined){
                return
            }

            if(TablePrivilegeType.table[id][key] == undefined){
                return
            }

            return TablePrivilegeType.table[id][key];
        }
    
            
            
            
    /** 字符串ID */
    get strKey(): string {
        return this.data.strKey;
    }
    /** 名称 */
    get name(): string {
        return this.data.name;
    }
    /** 计算叠加类型 */
    get cptype(): number {
        return this.data.cptype;
    }
    }
                