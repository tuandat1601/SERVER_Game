
    import { JsonUtil } from "../../game-config/JsonUtil";
            
    export class TableTitle {
        static TableName: string = "Title";
        static table:any = null;
            
        
            
        
        static field_name: string = "name";
        static field_resid: string = "resid";
        static field_quality: string = "quality";
        static field_time: string = "time";
        static field_hp_rate: string = "hp_rate";
        static field_atk_rate: string = "atk_rate";
        static field_def_rate: string = "def_rate";
                
            
        private data: any;
            
            
        constructor(id: number){
            this.init(id)
        }
    
        static initTable(){
            if (!TableTitle.table) {
                TableTitle.table = JsonUtil.get(TableTitle.TableName);
            }
        }
    
        static getTable(){
            return TableTitle.table
        }
    
        private init(id: number) {
            this.data = TableTitle.table[id];
            this.id = id;
        }
            
        /** 称号【KEY】 */
        id: number;
        
        
        static checkHave(id: number){
            if(TableTitle.table[id] == undefined){
                return false
            }
            return true
        }
    
        
        
        static getVal(id: number,key:any){
            if(TableTitle.table[id] == undefined){
                return
            }

            if(TableTitle.table[id][key] == undefined){
                return
            }

            return TableTitle.table[id][key];
        }
    
            
            
            
    /** 名称 */
    get name(): string {
        return this.data.name;
    }
    /** 资源 */
    get resid(): number {
        return this.data.resid;
    }
    /** 品质 */
    get quality(): number {
        return this.data.quality;
    }
    /** 过期时间(秒 0:永久) */
    get time(): number {
        return this.data.time;
    }
    /** 生命加成 */
    get hp_rate(): number {
        return this.data.hp_rate;
    }
    /** 攻击加成 */
    get atk_rate(): number {
        return this.data.atk_rate;
    }
    /** 防御加成 */
    get def_rate(): number {
        return this.data.def_rate;
    }
    }
                