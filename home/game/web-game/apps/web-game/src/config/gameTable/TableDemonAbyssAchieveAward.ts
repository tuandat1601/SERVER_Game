
    import { JsonUtil } from "../../game-config/JsonUtil";
            
    export class TableDemonAbyssAchieveAward {
        static TableName: string = "DemonAbyssAchieveAward";
        static table:any = null;
            
        
            
        
        static field_drop1: string = "drop1";
                
            
        private data: any;
            
            
        constructor(id: number){
            this.init(id)
        }
    
        static initTable(){
            if (!TableDemonAbyssAchieveAward.table) {
                TableDemonAbyssAchieveAward.table = JsonUtil.get(TableDemonAbyssAchieveAward.TableName);
            }
        }
    
        static getTable(){
            return TableDemonAbyssAchieveAward.table
        }
    
        private init(id: number) {
            this.data = TableDemonAbyssAchieveAward.table[id];
            this.id = id;
        }
            
        /** 魔渊-成就奖励表【KEY】 */
        id: number;
        
        
        static checkHave(id: number){
            if(TableDemonAbyssAchieveAward.table[id] == undefined){
                return false
            }
            return true
        }
    
        
        
        static getVal(id: number,key:any){
            if(TableDemonAbyssAchieveAward.table[id] == undefined){
                return
            }

            if(TableDemonAbyssAchieveAward.table[id][key] == undefined){
                return
            }

            return TableDemonAbyssAchieveAward.table[id][key];
        }
    
            
            
            
    /** 道具奖励 */
    get drop1(): any {
        return this.data.drop1;
    }
    }
                