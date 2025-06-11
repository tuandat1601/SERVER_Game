
    import { JsonUtil } from "../../game-config/JsonUtil";
            
    export class TableGameSkillQuality {
        static TableName: string = "GameSkillQuality";
        static table:any = null;
            
        
            
        
        static field_name: string = "name";
                
            
        private data: any;
            
            
        constructor(id: number){
            this.init(id)
        }
    
        static initTable(){
            if (!TableGameSkillQuality.table) {
                TableGameSkillQuality.table = JsonUtil.get(TableGameSkillQuality.TableName);
            }
        }
    
        static getTable(){
            return TableGameSkillQuality.table
        }
    
        private init(id: number) {
            this.data = TableGameSkillQuality.table[id];
            this.id = id;
        }
            
        /** 技能品质表【KEY】 */
        id: number;
        
        
        static checkHave(id: number){
            if(TableGameSkillQuality.table[id] == undefined){
                return false
            }
            return true
        }
    
        
        
        static getVal(id: number,key:any){
            if(TableGameSkillQuality.table[id] == undefined){
                return
            }

            if(TableGameSkillQuality.table[id][key] == undefined){
                return
            }

            return TableGameSkillQuality.table[id][key];
        }
    
            
            
            
    /** 名称 */
    get name(): string {
        return this.data.name;
    }
    }
                