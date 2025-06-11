
    import { JsonUtil } from "../../game-config/JsonUtil";
            
    export class TablePirateShipCell {
        static TableName: string = "PirateShipCell";
        static table:any = null;
            
        
            
        
        static field_itemtype: string = "itemtype";
                
            
        private data: any;
            
            
        constructor(id: number){
            this.init(id)
        }
    
        static initTable(){
            if (!TablePirateShipCell.table) {
                TablePirateShipCell.table = JsonUtil.get(TablePirateShipCell.TableName);
            }
        }
    
        static getTable(){
            return TablePirateShipCell.table
        }
    
        private init(id: number) {
            this.data = TablePirateShipCell.table[id];
            this.id = id;
        }
            
        /** 夺宝大作战格子表【KEY】 */
        id: number;
        
        
        static checkHave(id: number){
            if(TablePirateShipCell.table[id] == undefined){
                return false
            }
            return true
        }
    
        
        
        static getVal(id: number,key:any){
            if(TablePirateShipCell.table[id] == undefined){
                return
            }

            if(TablePirateShipCell.table[id][key] == undefined){
                return
            }

            return TablePirateShipCell.table[id][key];
        }
    
            
            
            
    /** 格子初始道具 */
    get itemtype(): number {
        return this.data.itemtype;
    }
    }
                