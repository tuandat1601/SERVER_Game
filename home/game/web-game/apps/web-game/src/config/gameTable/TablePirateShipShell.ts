
    import { JsonUtil } from "../../game-config/JsonUtil";
            
    export class TablePirateShipShell {
        static TableName: string = "PirateShipShell";
        static table:any = null;
            
        
            
        
        static field_name: string = "name";
        static field_type: string = "type";
        static field_lv: string = "lv";
        static field_cost: string = "cost";
        static field_damage: string = "damage";
        static field_dot: string = "dot";
        static field_over: string = "over";
        static field_time: string = "time";
                
            
        private data: any;
            
            
        constructor(id: number){
            this.init(id)
        }
    
        static initTable(){
            if (!TablePirateShipShell.table) {
                TablePirateShipShell.table = JsonUtil.get(TablePirateShipShell.TableName);
            }
        }
    
        static getTable(){
            return TablePirateShipShell.table
        }
    
        private init(id: number) {
            this.data = TablePirateShipShell.table[id];
            this.id = id;
        }
            
        /** 夺宝大作战-炮弹表【KEY】 */
        id: number;
        
        
        static checkHave(id: number){
            if(TablePirateShipShell.table[id] == undefined){
                return false
            }
            return true
        }
    
        
        
        static getVal(id: number,key:any){
            if(TablePirateShipShell.table[id] == undefined){
                return
            }

            if(TablePirateShipShell.table[id][key] == undefined){
                return
            }

            return TablePirateShipShell.table[id][key];
        }
    
            
            
            
    /** 名称 */
    get name(): string {
        return this.data.name;
    }
    /** 类型 */
    get type(): number {
        return this.data.type;
    }
    /** 等级 */
    get lv(): number {
        return this.data.lv;
    }
    /** 等级所需道具 */
    get cost(): any {
        return this.data.cost;
    }
    /** 直伤 */
    get damage(): number {
        return this.data.damage;
    }
    /** 持续伤害 */
    get dot(): number {
        return this.data.dot;
    }
    /** 最终伤害 */
    get over(): number {
        return this.data.over;
    }
    /** 持续回合 */
    get time(): number {
        return this.data.time;
    }
    }
                