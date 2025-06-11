
    import { JsonUtil } from "../../game-config/JsonUtil";
            
    export class TablePirateShipSeasonRank {
        static TableName: string = "PirateShipSeasonRank";
        static table:any = null;
            
        
            
        
        static field_min: string = "min";
        static field_max: string = "max";
        static field_award: string = "award";
                
            
        private data: any;
            
            
        constructor(id: number){
            this.init(id)
        }
    
        static initTable(){
            if (!TablePirateShipSeasonRank.table) {
                TablePirateShipSeasonRank.table = JsonUtil.get(TablePirateShipSeasonRank.TableName);
            }
        }
    
        static getTable(){
            return TablePirateShipSeasonRank.table
        }
    
        private init(id: number) {
            this.data = TablePirateShipSeasonRank.table[id];
            this.id = id;
        }
            
        /** 夺宝大作战-赛季奖励表【KEY】 */
        id: number;
        
        
        static checkHave(id: number){
            if(TablePirateShipSeasonRank.table[id] == undefined){
                return false
            }
            return true
        }
    
        
        
        static getVal(id: number,key:any){
            if(TablePirateShipSeasonRank.table[id] == undefined){
                return
            }

            if(TablePirateShipSeasonRank.table[id][key] == undefined){
                return
            }

            return TablePirateShipSeasonRank.table[id][key];
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
                