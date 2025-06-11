
    import { JsonUtil } from "../../game-config/JsonUtil";
            
    export class TableRechargeGift {
        static TableName: string = "RechargeGift";
        static table:any = null;
            
        
            
        
        static field_drop1: string = "drop1";
                
            
        private data: any;
            
            
        constructor(id: number){
            this.init(id)
        }
    
        static initTable(){
            if (!TableRechargeGift.table) {
                TableRechargeGift.table = JsonUtil.get(TableRechargeGift.TableName);
            }
        }
    
        static getTable(){
            return TableRechargeGift.table
        }
    
        private init(id: number) {
            this.data = TableRechargeGift.table[id];
            this.id = id;
        }
            
        /** 累积充值礼包【KEY】 */
        id: number;
        
        
        static checkHave(id: number){
            if(TableRechargeGift.table[id] == undefined){
                return false
            }
            return true
        }
    
        
        
        static getVal(id: number,key:any){
            if(TableRechargeGift.table[id] == undefined){
                return
            }

            if(TableRechargeGift.table[id][key] == undefined){
                return
            }

            return TableRechargeGift.table[id][key];
        }
    
            
            
            
    /** 道具奖励 */
    get drop1(): any {
        return this.data.drop1;
    }
    }
                