
    import { JsonUtil } from "../../game-config/JsonUtil";
            
    export class TablePirateShipWelfare {
        static TableName: string = "PirateShipWelfare";
        static table:any = null;
            
        
            
        
        static field_drop1: string = "drop1";
        static field_drop2: string = "drop2";
                
            
        private data: any;
            
            
        constructor(id: number){
            this.init(id)
        }
    
        static initTable(){
            if (!TablePirateShipWelfare.table) {
                TablePirateShipWelfare.table = JsonUtil.get(TablePirateShipWelfare.TableName);
            }
        }
    
        static getTable(){
            return TablePirateShipWelfare.table
        }
    
        private init(id: number) {
            this.data = TablePirateShipWelfare.table[id];
            this.id = id;
        }
            
        /** 夺宝大作战-宝藏福利【KEY】 */
        id: number;
        
        
        static checkHave(id: number){
            if(TablePirateShipWelfare.table[id] == undefined){
                return false
            }
            return true
        }
    
        
        
        static getVal(id: number,key:any){
            if(TablePirateShipWelfare.table[id] == undefined){
                return
            }

            if(TablePirateShipWelfare.table[id][key] == undefined){
                return
            }

            return TablePirateShipWelfare.table[id][key];
        }
    
            
            
            
    /** 道具奖励 */
    get drop1(): any {
        return this.data.drop1;
    }
    /** 高级道具奖励 */
    get drop2(): any {
        return this.data.drop2;
    }
    }
                