
    import { JsonUtil } from "../../game-config/JsonUtil";
            
    export class TableMercenaryGo {
        static TableName: string = "MercenaryGo";
        static table:any = null;
            
        
            
        
        static field_name: string = "name";
        static field_drop: string = "drop";
        static field_prob: string = "prob";
                
            
        private data: any;
            
            
        constructor(id: number){
            this.init(id)
        }
    
        static initTable(){
            if (!TableMercenaryGo.table) {
                TableMercenaryGo.table = JsonUtil.get(TableMercenaryGo.TableName);
            }
        }
    
        static getTable(){
            return TableMercenaryGo.table
        }
    
        private init(id: number) {
            this.data = TableMercenaryGo.table[id];
            this.id = id;
        }
            
        /** 佣兵游历表【KEY】 */
        id: number;
        
        
        static checkHave(id: number){
            if(TableMercenaryGo.table[id] == undefined){
                return false
            }
            return true
        }
    
        
        
        static getVal(id: number,key:any){
            if(TableMercenaryGo.table[id] == undefined){
                return
            }

            if(TableMercenaryGo.table[id][key] == undefined){
                return
            }

            return TableMercenaryGo.table[id][key];
        }
    
            
            
            
    /** 名称 */
    get name(): string {
        return this.data.name;
    }
    /** 掉落 */
    get drop(): any {
        return this.data.drop;
    }
    /** 偶见仙友概率(t类型，p概率，e经验） */
    get prob(): any {
        return this.data.prob;
    }
    }
                