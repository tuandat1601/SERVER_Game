
    import { JsonUtil } from "../../game-config/JsonUtil";
            
    export class TableFruitSys {
        static TableName: string = "FruitSys";
        static table:any = null;
            
        
            
        
        static field_name: string = "name";
        static field_itemid: string = "itemid";
        static field_openlv: string = "openlv";
        static field_base: string = "base";
        static field_amend: string = "amend";
        static field_hp: string = "hp";
        static field_atk: string = "atk";
        static field_def: string = "def";
        static field_atkspeed: string = "atkspeed";
                
            
        private data: any;
            
            
        constructor(id: number){
            this.init(id)
        }
    
        static initTable(){
            if (!TableFruitSys.table) {
                TableFruitSys.table = JsonUtil.get(TableFruitSys.TableName);
            }
        }
    
        static getTable(){
            return TableFruitSys.table
        }
    
        private init(id: number) {
            this.data = TableFruitSys.table[id];
            this.id = id;
        }
            
        /** 水果表【KEY】 */
        id: number;
        
        
        static checkHave(id: number){
            if(TableFruitSys.table[id] == undefined){
                return false
            }
            return true
        }
    
        
        
        static getVal(id: number,key:any){
            if(TableFruitSys.table[id] == undefined){
                return
            }

            if(TableFruitSys.table[id][key] == undefined){
                return
            }

            return TableFruitSys.table[id][key];
        }
    
            
            
            
    /** 水果名 */
    get name(): string {
        return this.data.name;
    }
    /** 道具ID */
    get itemid(): number {
        return this.data.itemid;
    }
    /** 开放等级 */
    get openlv(): number {
        return this.data.openlv;
    }
    /** 上限倍数 */
    get base(): number {
        return this.data.base;
    }
    /** 上限修正值 */
    get amend(): number {
        return this.data.amend;
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
                