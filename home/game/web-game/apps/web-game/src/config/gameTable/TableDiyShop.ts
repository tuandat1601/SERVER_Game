
    import { JsonUtil } from "../../game-config/JsonUtil";
            
    export class TableDiyShop {
        static TableName: string = "DiyShop";
        static table:any = null;
            
        
            
        
        static field_name: string = "name";
        static field_num: string = "num";
        static field_items: string = "items";
                
            
        private data: any;
            
            
        constructor(id: number){
            this.init(id)
        }
    
        static initTable(){
            if (!TableDiyShop.table) {
                TableDiyShop.table = JsonUtil.get(TableDiyShop.TableName);
            }
        }
    
        static getTable(){
            return TableDiyShop.table
        }
    
        private init(id: number) {
            this.data = TableDiyShop.table[id];
            this.id = id;
        }
            
        /** 自定义商品表【KEY】 */
        id: number;
        
        
        static checkHave(id: number){
            if(TableDiyShop.table[id] == undefined){
                return false
            }
            return true
        }
    
        
        
        static getVal(id: number,key:any){
            if(TableDiyShop.table[id] == undefined){
                return
            }

            if(TableDiyShop.table[id][key] == undefined){
                return
            }

            return TableDiyShop.table[id][key];
        }
    
            
            
            
    /** 名称 */
    get name(): string {
        return this.data.name;
    }
    /** 可选数量 */
    get num(): number {
        return this.data.num;
    }
    /** 商品可选范围 */
    get items(): any {
        return this.data.items;
    }
    }
                