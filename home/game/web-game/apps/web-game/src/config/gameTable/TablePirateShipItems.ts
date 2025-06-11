
    import { JsonUtil } from "../../game-config/JsonUtil";
            
    export class TablePirateShipItems {
        static TableName: string = "PirateShipItems";
        static table:any = null;
            
        
            
        
        static field_min: string = "min";
        static field_max: string = "max";
        static field_desc: string = "desc";
                
            
        private data: any;
            
            
        constructor(id: number){
            this.init(id)
        }
    
        static initTable(){
            if (!TablePirateShipItems.table) {
                TablePirateShipItems.table = JsonUtil.get(TablePirateShipItems.TableName);
            }
        }
    
        static getTable(){
            return TablePirateShipItems.table
        }
    
        private init(id: number) {
            this.data = TablePirateShipItems.table[id];
            this.id = id;
        }
            
        /** 夺宝道具表【KEY】 */
        id: number;
        
        
        static checkHave(id: number){
            if(TablePirateShipItems.table[id] == undefined){
                return false
            }
            return true
        }
    
        
        
        static getVal(id: number,key:any){
            if(TablePirateShipItems.table[id] == undefined){
                return
            }

            if(TablePirateShipItems.table[id][key] == undefined){
                return
            }

            return TablePirateShipItems.table[id][key];
        }
    
            
            
            
    /** 最小 */
    get min(): number {
        return this.data.min;
    }
    /** 最大 */
    get max(): number {
        return this.data.max;
    }
    /** 描述 */
    get desc(): string {
        return this.data.desc;
    }
    }
                