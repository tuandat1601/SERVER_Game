
    import { JsonUtil } from "../../game-config/JsonUtil";
            
    export class TablePirateShip {
        static TableName: string = "PirateShip";
        static table:any = null;
            
        
            
        
        static field_hp: string = "hp";
        static field_award: string = "award";
        static field_quality: string = "quality";
        static field_weight: string = "weight";
                
            
        private data: any;
            
            
        constructor(id: number){
            this.init(id)
        }
    
        static initTable(){
            if (!TablePirateShip.table) {
                TablePirateShip.table = JsonUtil.get(TablePirateShip.TableName);
            }
        }
    
        static getTable(){
            return TablePirateShip.table
        }
    
        private init(id: number) {
            this.data = TablePirateShip.table[id];
            this.id = id;
        }
            
        /** 夺宝大作战-海盗船表【KEY】 */
        id: number;
        
        
        static checkHave(id: number){
            if(TablePirateShip.table[id] == undefined){
                return false
            }
            return true
        }
    
        
        
        static getVal(id: number,key:any){
            if(TablePirateShip.table[id] == undefined){
                return
            }

            if(TablePirateShip.table[id][key] == undefined){
                return
            }

            return TablePirateShip.table[id][key];
        }
    
            
            
            
    /** 生命 */
    get hp(): number {
        return this.data.hp;
    }
    /** 奖励 */
    get award(): any {
        return this.data.award;
    }
    /** 生命 */
    get quality(): number {
        return this.data.quality;
    }
    /** 权重 */
    get weight(): number {
        return this.data.weight;
    }
    }
                