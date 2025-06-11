
    import { JsonUtil } from "../../game-config/JsonUtil";
            
    export class TableArenaRankAward {
        static TableName: string = "ArenaRankAward";
        static table:any = null;
            
        
            
        
        static field_dayaward: string = "dayaward";
        static field_award: string = "award";
                
            
        private data: any;
            
            
        constructor(rank: number){
            this.init(rank)
        }
    
        static initTable(){
            if (!TableArenaRankAward.table) {
                TableArenaRankAward.table = JsonUtil.get(TableArenaRankAward.TableName);
            }
        }
    
        static getTable(){
            return TableArenaRankAward.table
        }
    
        private init(rank: number) {
            this.data = TableArenaRankAward.table[rank];
            this.rank = rank;
        }
            
        /** 竞技排行奖励表【KEY】 */
        rank: number;
        
        
        static checkHave(rank: number){
            if(!TableArenaRankAward.table[rank]){
                return false
            }
            return true
        }
    
        
        
        static getVal(rank: number,key:any){
            if(!TableArenaRankAward.table[rank]){
                return
            }

            if(!TableArenaRankAward.table[rank][key]){
                return
            }

            return TableArenaRankAward.table[rank][key];
        }
    
            
            
            
    /** 每日奖励 */
    get dayaward(): any {
        return this.data.dayaward;
    }
    /** 赛季奖励 */
    get award(): any {
        return this.data.award;
    }
    }
                