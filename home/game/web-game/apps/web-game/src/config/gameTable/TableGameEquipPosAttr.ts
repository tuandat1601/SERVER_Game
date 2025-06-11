
    import { JsonUtil } from "../../game-config/JsonUtil";
            
    export class TableGameEquipPosAttr {
        static TableName: string = "GameEquipPosAttr";
        static table:any = null;
            
        
            
        
        static field_cost: string = "cost";
        static field_hp: string = "hp";
        static field_atk: string = "atk";
        static field_def: string = "def";
        static field_atkspeed: string = "atkspeed";
                
            
        private data: any;
            
            
        constructor(id: number){
            this.init(id)
        }
    
        static initTable(){
            if (!TableGameEquipPosAttr.table) {
                TableGameEquipPosAttr.table = JsonUtil.get(TableGameEquipPosAttr.TableName);
            }
        }
    
        static getTable(){
            return TableGameEquipPosAttr.table
        }
    
        private init(id: number) {
            this.data = TableGameEquipPosAttr.table[id];
            this.id = id;
        }
            
        /** 部位属性【KEY】 */
        id: number;
        
        
        static checkHave(id: number){
            if(TableGameEquipPosAttr.table[id] == undefined){
                return false
            }
            return true
        }
    
        
        
        static getVal(id: number,key:any){
            if(TableGameEquipPosAttr.table[id] == undefined){
                return
            }

            if(TableGameEquipPosAttr.table[id][key] == undefined){
                return
            }

            return TableGameEquipPosAttr.table[id][key];
        }
    
            
            
            
    /** 升级需要的道具 */
    get cost(): any {
        return this.data.cost;
    }
    /** 生命 */
    get hp(): number {
        return this.data.hp;
    }
    /** 攻击 */
    get atk(): number {
        return this.data.atk;
    }
    /** 防御 */
    get def(): number {
        return this.data.def;
    }
    /** 速度 */
    get atkspeed(): number {
        return this.data.atkspeed;
    }
    }
                