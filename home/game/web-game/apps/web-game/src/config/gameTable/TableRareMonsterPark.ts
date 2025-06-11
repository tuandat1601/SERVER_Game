
    import { JsonUtil } from "../../game-config/JsonUtil";
            
    export class TableRareMonsterPark {
        static TableName: string = "RareMonsterPark";
        static table:any = null;
            
        
            
        
        static field_weight: string = "weight";
        static field_num: string = "num";
        static field_maxCount: string = "maxCount";
        static field_quality: string = "quality";
        static field_type: string = "type";
                
            
        private data: any;
            
            
        constructor(id: number){
            this.init(id)
        }
    
        static initTable(){
            if (!TableRareMonsterPark.table) {
                TableRareMonsterPark.table = JsonUtil.get(TableRareMonsterPark.TableName);
            }
        }
    
        static getTable(){
            return TableRareMonsterPark.table
        }
    
        private init(id: number) {
            this.data = TableRareMonsterPark.table[id];
            this.id = id;
        }
            
        /** 异兽园【KEY】 */
        id: number;
        
        
        static checkHave(id: number){
            if(TableRareMonsterPark.table[id] == undefined){
                return false
            }
            return true
        }
    
        
        
        static getVal(id: number,key:any){
            if(TableRareMonsterPark.table[id] == undefined){
                return
            }

            if(TableRareMonsterPark.table[id][key] == undefined){
                return
            }

            return TableRareMonsterPark.table[id][key];
        }
    
            
            
            
    /** 权重 */
    get weight(): number {
        return this.data.weight;
    }
    /** 数量 */
    get num(): number {
        return this.data.num;
    }
    /** 保底次数 */
    get maxCount(): number {
        return this.data.maxCount;
    }
    /** 品质 */
    get quality(): number {
        return this.data.quality;
    }
    /** 类型 */
    get type(): number {
        return this.data.type;
    }
    }
                