
    import { JsonUtil } from "../../game-config/JsonUtil";
            
    export class TableGameEquipPos {
        static TableName: string = "GameEquipPos";
        static table:any = null;
            
        
        static weapon = 1;
        static cloth = 2;
        static hat = 3;
        static belt = 4;
        static pants = 5;
        static shoe = 6;
            
        
        static field_strKey: string = "strKey";
        static field_name: string = "name";
                
            
        private data: any;
            
            
        constructor(id: number){
            this.init(id)
        }
    
        static initTable(){
            if (!TableGameEquipPos.table) {
                TableGameEquipPos.table = JsonUtil.get(TableGameEquipPos.TableName);
            }
        }
    
        static getTable(){
            return TableGameEquipPos.table
        }
    
        private init(id: number) {
            this.data = TableGameEquipPos.table[id];
            this.id = id;
        }
            
        /** 装备部位表【KEY】 */
        id: number;
        
        
        static checkHave(id: number){
            if(TableGameEquipPos.table[id] == undefined){
                return false
            }
            return true
        }
    
        
        
        static getVal(id: number,key:any){
            if(TableGameEquipPos.table[id] == undefined){
                return
            }

            if(TableGameEquipPos.table[id][key] == undefined){
                return
            }

            return TableGameEquipPos.table[id][key];
        }
    
            
            
            
    /** 字符串ID */
    get strKey(): string {
        return this.data.strKey;
    }
    /** 部位名称 */
    get name(): string {
        return this.data.name;
    }
    }
                