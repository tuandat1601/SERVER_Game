
    import { JsonUtil } from "../../game-config/JsonUtil";
            
    export class TableAbyssDragonDamageAward {
        static TableName: string = "AbyssDragonDamageAward";
        static table:any = null;
            
        
            
        
        static field_drop1: string = "drop1";
                
            
        private data: any;
            
            
        constructor(id: number){
            this.init(id)
        }
    
        static initTable(){
            if (!TableAbyssDragonDamageAward.table) {
                TableAbyssDragonDamageAward.table = JsonUtil.get(TableAbyssDragonDamageAward.TableName);
            }
        }
    
        static getTable(){
            return TableAbyssDragonDamageAward.table
        }
    
        private init(id: number) {
            this.data = TableAbyssDragonDamageAward.table[id];
            this.id = id;
        }
            
        /** 深渊巨龙-伤害奖励表【KEY】 */
        id: number;
        
        
        static checkHave(id: number){
            if(TableAbyssDragonDamageAward.table[id] == undefined){
                return false
            }
            return true
        }
    
        
        
        static getVal(id: number,key:any){
            if(TableAbyssDragonDamageAward.table[id] == undefined){
                return
            }

            if(TableAbyssDragonDamageAward.table[id][key] == undefined){
                return
            }

            return TableAbyssDragonDamageAward.table[id][key];
        }
    
            
            
            
    /** 道具奖励 */
    get drop1(): any {
        return this.data.drop1;
    }
    }
                