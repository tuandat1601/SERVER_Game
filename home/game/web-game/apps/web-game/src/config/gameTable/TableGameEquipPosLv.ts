
    import { JsonUtil } from "../../game-config/JsonUtil";
            
    export class TableGameEquipPosLv {
        static TableName: string = "GameEquipPosLv";
        static table:any = null;
            
        
            
        
        static field_weapon: string = "weapon";
        static field_cloth: string = "cloth";
        static field_hat: string = "hat";
        static field_belt: string = "belt";
        static field_pants: string = "pants";
        static field_shoe: string = "shoe";
                
            
        private data: any;
            
            
        constructor(id: number){
            this.init(id)
        }
    
        static initTable(){
            if (!TableGameEquipPosLv.table) {
                TableGameEquipPosLv.table = JsonUtil.get(TableGameEquipPosLv.TableName);
            }
        }
    
        static getTable(){
            return TableGameEquipPosLv.table
        }
    
        private init(id: number) {
            this.data = TableGameEquipPosLv.table[id];
            this.id = id;
        }
            
        /** 部位等级【KEY】 */
        id: number;
        
        
        static checkHave(id: number){
            if(TableGameEquipPosLv.table[id] == undefined){
                return false
            }
            return true
        }
    
        
        
        static getVal(id: number,key:any){
            if(TableGameEquipPosLv.table[id] == undefined){
                return
            }

            if(TableGameEquipPosLv.table[id][key] == undefined){
                return
            }

            return TableGameEquipPosLv.table[id][key];
        }
    
            
            
            
    /** 武器 */
    get weapon(): number {
        return this.data.weapon;
    }
    /** 衣服 */
    get cloth(): number {
        return this.data.cloth;
    }
    /** 帽子 */
    get hat(): number {
        return this.data.hat;
    }
    /** 腰带 */
    get belt(): number {
        return this.data.belt;
    }
    /** 裤子 */
    get pants(): number {
        return this.data.pants;
    }
    /** 鞋子 */
    get shoe(): number {
        return this.data.shoe;
    }
    }
                