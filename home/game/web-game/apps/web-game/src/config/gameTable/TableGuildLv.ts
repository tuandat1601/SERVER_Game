
    import { JsonUtil } from "../../game-config/JsonUtil";
            
    export class TableGuildLv {
        static TableName: string = "GuildLv";
        static table:any = null;
            
        
            
        
        static field_limit: string = "limit";
        static field_needexp: string = "needexp";
                
            
        private data: any;
            
            
        constructor(lv: number){
            this.init(lv)
        }
    
        static initTable(){
            if (!TableGuildLv.table) {
                TableGuildLv.table = JsonUtil.get(TableGuildLv.TableName);
            }
        }
    
        static getTable(){
            return TableGuildLv.table
        }
    
        private init(lv: number) {
            this.data = TableGuildLv.table[lv];
            this.lv = lv;
        }
            
        /** 公会等级【KEY】 */
        lv: number;
        
        
        static checkHave(lv: number){
            if(TableGuildLv.table[lv] == undefined){
                return false
            }
            return true
        }
    
        
        
        static getVal(lv: number,key:any){
            if(TableGuildLv.table[lv] == undefined){
                return
            }

            if(TableGuildLv.table[lv][key] == undefined){
                return
            }

            return TableGuildLv.table[lv][key];
        }
    
            
            
            
    /** 人数上限 */
    get limit(): number {
        return this.data.limit;
    }
    /** 升级需要经验 */
    get needexp(): number {
        return this.data.needexp;
    }
    }
                