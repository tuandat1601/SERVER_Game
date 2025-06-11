
    import { JsonUtil } from "../../game-config/JsonUtil";
            
    export class TableGameEquip {
        static TableName: string = "GameEquip";
        static table:any = null;
            
        
            
        
        static field_name: string = "name";
        static field_level: string = "level";
        static field_pos: string = "pos";
        static field_hp: string = "hp";
        static field_atk: string = "atk";
        static field_def: string = "def";
        static field_atkspeed: string = "atkspeed";
        static field_add1: string = "add1";
        static field_add2: string = "add2";
        static field_sell: string = "sell";
        static field_exp: string = "exp";
                
            
        private data: any;
            
            
        constructor(id: number){
            this.init(id)
        }
    
        static initTable(){
            if (!TableGameEquip.table) {
                TableGameEquip.table = JsonUtil.get(TableGameEquip.TableName);
            }
        }
    
        static getTable(){
            return TableGameEquip.table
        }
    
        private init(id: number) {
            this.data = TableGameEquip.table[id];
            this.id = id;
        }
            
        /** 装备表【KEY】 */
        id: number;
        
        
        static checkHave(id: number){
            if(TableGameEquip.table[id] == undefined){
                return false
            }
            return true
        }
    
        
        
        static getVal(id: number,key:any){
            if(TableGameEquip.table[id] == undefined){
                return
            }

            if(TableGameEquip.table[id][key] == undefined){
                return
            }

            return TableGameEquip.table[id][key];
        }
    
            
            
            
    /** 名称 */
    get name(): string {
        return this.data.name;
    }
    /** 等级 */
    get level(): number {
        return this.data.level;
    }
    /** 部位 */
    get pos(): number {
        return this.data.pos;
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
    /** 附加1 */
    get add1(): number {
        return this.data.add1;
    }
    /** 附加2 */
    get add2(): number {
        return this.data.add2;
    }
    /** 卖出 */
    get sell(): any {
        return this.data.sell;
    }
    /** 卖出加经验 */
    get exp(): number {
        return this.data.exp;
    }
    }
                