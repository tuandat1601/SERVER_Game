
    import { JsonUtil } from "../../game-config/JsonUtil";
            
    export class TableRankAwardGL {
        static TableName: string = "RankAwardGL";
        static table:any = null;
            
        
            
        
        static field_min: string = "min";
        static field_max: string = "max";
        static field_award: string = "award";
                
            
        private data: any;
            
            
        constructor(id: number){
            this.init(id)
        }
    
        static initTable(){
            if (!TableRankAwardGL.table) {
                TableRankAwardGL.table = JsonUtil.get(TableRankAwardGL.TableName);
            }
        }
    
        static getTable(){
            return TableRankAwardGL.table
        }
    
        private init(id: number) {
            this.data = TableRankAwardGL.table[id];
            this.id = id;
        }
            
        /** 排名奖励表【KEY】 */
        id: number;
        
        
        static checkHave(id: number){
            if(TableRankAwardGL.table[id] == undefined){
                return false
            }
            return true
        }
    
        
        
        static getVal(id: number,key:any){
            if(TableRankAwardGL.table[id] == undefined){
                return
            }

            if(TableRankAwardGL.table[id][key] == undefined){
                return
            }

            return TableRankAwardGL.table[id][key];
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
                