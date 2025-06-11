
    import { JsonUtil } from "../../game-config/JsonUtil";
            
    export class TablePirateShipDailyRank {
        static TableName: string = "PirateShipDailyRank";
        static table:any = null;
            
        
            
        
        static field_min: string = "min";
        static field_max: string = "max";
        static field_award: string = "award";
                
            
        private data: any;
            
            
        constructor(id: number){
            this.init(id)
        }
    
        static initTable(){
            if (!TablePirateShipDailyRank.table) {
                TablePirateShipDailyRank.table = JsonUtil.get(TablePirateShipDailyRank.TableName);
            }
        }
    
        static getTable(){
            return TablePirateShipDailyRank.table
        }
    
        private init(id: number) {
            this.data = TablePirateShipDailyRank.table[id];
            this.id = id;
        }
            
        /** 夺宝大作战-每日排名奖励表【KEY】 */
        id: number;
        
        
        static checkHave(id: number){
            if(TablePirateShipDailyRank.table[id] == undefined){
                return false
            }
            return true
        }
    
        
        
        static getVal(id: number,key:any){
            if(TablePirateShipDailyRank.table[id] == undefined){
                return
            }

            if(TablePirateShipDailyRank.table[id][key] == undefined){
                return
            }

            return TablePirateShipDailyRank.table[id][key];
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
                