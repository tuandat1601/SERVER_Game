
    import { JsonUtil } from "../../game-config/JsonUtil";
            
    export class TableGameItem {
        static TableName: string = "GameItem";
        static table:any = null;
            
        
            
        
        static field_name: string = "name";
        static field_level: string = "level";
        static field_quality: string = "quality";
        static field_type: string = "type";
        static field_sell: string = "sell";
                
            
        private data: any;
            
            
        constructor(id: number){
            this.init(id)
        }
    
        static initTable(){
            if (!TableGameItem.table) {
                TableGameItem.table = JsonUtil.get(TableGameItem.TableName);
            }
        }
    
        static getTable(){
            return TableGameItem.table
        }
    
        private init(id: number) {
            this.data = TableGameItem.table[id];
            this.id = id;
        }
            
        /** 道具表【KEY】 */
        id: number;
        
        
        static checkHave(id: number){
            if(TableGameItem.table[id] == undefined){
                return false
            }
            return true
        }
    
        
        
        static getVal(id: number,key:any){
            if(TableGameItem.table[id] == undefined){
                return
            }

            if(TableGameItem.table[id][key] == undefined){
                return
            }

            return TableGameItem.table[id][key];
        }
    
            
            
            
    /** 名称 */
    get name(): string {
        return this.data.name;
    }
    /** 等级 */
    get level(): number {
        return this.data.level;
    }
    /** 品质 */
    get quality(): number {
        return this.data.quality;
    }
    /** 类型 */
    get type(): number {
        return this.data.type;
    }
    /** 卖出 */
    get sell(): any {
        return this.data.sell;
    }
    }
                