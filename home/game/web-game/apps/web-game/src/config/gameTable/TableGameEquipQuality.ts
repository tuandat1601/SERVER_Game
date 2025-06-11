
    import { JsonUtil } from "../../game-config/JsonUtil";
            
    export class TableGameEquipQuality {
        static TableName: string = "GameEquipQuality";
        static table:any = null;
            
        
            
        
        static field_name: string = "name";
        static field_range1: string = "range1";
        static field_range2: string = "range2";
        static field_range3: string = "range3";
        static field_rate: string = "rate";
                
            
        private data: any;
            
            
        constructor(id: number){
            this.init(id)
        }
    
        static initTable(){
            if (!TableGameEquipQuality.table) {
                TableGameEquipQuality.table = JsonUtil.get(TableGameEquipQuality.TableName);
            }
        }
    
        static getTable(){
            return TableGameEquipQuality.table
        }
    
        private init(id: number) {
            this.data = TableGameEquipQuality.table[id];
            this.id = id;
        }
            
        /** 装备品质表【KEY】 */
        id: number;
        
        
        static checkHave(id: number){
            if(TableGameEquipQuality.table[id] == undefined){
                return false
            }
            return true
        }
    
        
        
        static getVal(id: number,key:any){
            if(TableGameEquipQuality.table[id] == undefined){
                return
            }

            if(TableGameEquipQuality.table[id][key] == undefined){
                return
            }

            return TableGameEquipQuality.table[id][key];
        }
    
            
            
            
    /** 名称 */
    get name(): string {
        return this.data.name;
    }
    /** 基础属性-随机范围 */
    get range1(): number {
        return this.data.range1;
    }
    /** 词条1-随机范围 */
    get range2(): number {
        return this.data.range2;
    }
    /** 词条2-随机范围 */
    get range3(): number {
        return this.data.range3;
    }
    /** 品质属性加成 */
    get rate(): number {
        return this.data.rate;
    }
    }
                