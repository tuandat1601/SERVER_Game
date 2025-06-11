
    import { JsonUtil } from "../../game-config/JsonUtil";
            
    export class TableArenaDailyRank {
        static TableName: string = "ArenaDailyRank";
        static table:any = null;
            
        
            
        
        static field_min: string = "min";
        static field_max: string = "max";
        static field_award: string = "award";
                
            
        private data: any;
            
            
        constructor(id: number){
            this.init(id)
        }
    
        static initTable(){
            if (!TableArenaDailyRank.table) {
                TableArenaDailyRank.table = JsonUtil.get(TableArenaDailyRank.TableName);
            }
        }
    
        static getTable(){
            return TableArenaDailyRank.table
        }
    
        private init(id: number) {
            this.data = TableArenaDailyRank.table[id];
            this.id = id;
        }
            
        /** 竞技场-每日排名奖励表【KEY】 */
        id: number;
        
        
        static checkHave(id: number){
            if(TableArenaDailyRank.table[id] == undefined){
                return false
            }
            return true
        }
    
        
        
        static getVal(id: number,key:any){
            if(TableArenaDailyRank.table[id] == undefined){
                return
            }

            if(TableArenaDailyRank.table[id][key] == undefined){
                return
            }

            return TableArenaDailyRank.table[id][key];
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
                