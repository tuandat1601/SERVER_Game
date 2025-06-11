
    import { JsonUtil } from "../../game-config/JsonUtil";
            
    export class TableRankAwards {
        static TableName: string = "RankAwards";
        static table:any = null;
            
        
            
        
        static field_type: string = "type";
        static field_min: string = "min";
        static field_max: string = "max";
        static field_award: string = "award";
                
            
        private data: any;
            
            
        constructor(id: number){
            this.init(id)
        }
    
        static initTable(){
            if (!TableRankAwards.table) {
                TableRankAwards.table = JsonUtil.get(TableRankAwards.TableName);
            }
        }
    
        static getTable(){
            return TableRankAwards.table
        }
    
        private init(id: number) {
            this.data = TableRankAwards.table[id];
            this.id = id;
        }
            
        /** 排名奖励表【KEY】 */
        id: number;
        
        
        static checkHave(id: number){
            if(TableRankAwards.table[id] == undefined){
                return false
            }
            return true
        }
    
        
        
        static getVal(id: number,key:any){
            if(TableRankAwards.table[id] == undefined){
                return
            }

            if(TableRankAwards.table[id][key] == undefined){
                return
            }

            return TableRankAwards.table[id][key];
        }
    
            
            
            
    /** 类型 */
    get type(): number {
        return this.data.type;
    }
    /** 排名区间最小数值 */
    get min(): number {
        return this.data.min;
    }
    /** 排名区间最大数值 */
    get max(): number {
        return this.data.max;
    }
    /** 奖励 */
    get award(): any {
        return this.data.award;
    }
    }
                