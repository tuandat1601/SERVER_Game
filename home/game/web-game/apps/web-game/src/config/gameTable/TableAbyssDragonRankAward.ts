
    import { JsonUtil } from "../../game-config/JsonUtil";
            
    export class TableAbyssDragonRankAward {
        static TableName: string = "AbyssDragonRankAward";
        static table:any = null;
            
        
            
        
        static field_min: string = "min";
        static field_max: string = "max";
        static field_award: string = "award";
                
            
        private data: any;
            
            
        constructor(id: number){
            this.init(id)
        }
    
        static initTable(){
            if (!TableAbyssDragonRankAward.table) {
                TableAbyssDragonRankAward.table = JsonUtil.get(TableAbyssDragonRankAward.TableName);
            }
        }
    
        static getTable(){
            return TableAbyssDragonRankAward.table
        }
    
        private init(id: number) {
            this.data = TableAbyssDragonRankAward.table[id];
            this.id = id;
        }
            
        /** 深渊巨龙-每日排行奖励表【KEY】 */
        id: number;
        
        
        static checkHave(id: number){
            if(TableAbyssDragonRankAward.table[id] == undefined){
                return false
            }
            return true
        }
    
        
        
        static getVal(id: number,key:any){
            if(TableAbyssDragonRankAward.table[id] == undefined){
                return
            }

            if(TableAbyssDragonRankAward.table[id][key] == undefined){
                return
            }

            return TableAbyssDragonRankAward.table[id][key];
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
                