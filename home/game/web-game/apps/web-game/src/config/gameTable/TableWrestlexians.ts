
    import { JsonUtil } from "../../game-config/JsonUtil";
            
    export class TableWrestlexians {
        static TableName: string = "Wrestlexians";
        static table:any = null;
            
        
            
        
        static field_grade: string = "grade";
        static field_name: string = "name";
                
            
        private data: any;
            
            
        constructor(id: number){
            this.init(id)
        }
    
        static initTable(){
            if (!TableWrestlexians.table) {
                TableWrestlexians.table = JsonUtil.get(TableWrestlexians.TableName);
            }
        }
    
        static getTable(){
            return TableWrestlexians.table
        }
    
        private init(id: number) {
            this.data = TableWrestlexians.table[id];
            this.id = id;
        }
            
        /** 角斗关卡表【KEY】 */
        id: number;
        
        
        static checkHave(id: number){
            if(TableWrestlexians.table[id] == undefined){
                return false
            }
            return true
        }
    
        
        
        static getVal(id: number,key:any){
            if(TableWrestlexians.table[id] == undefined){
                return
            }

            if(TableWrestlexians.table[id][key] == undefined){
                return
            }

            return TableWrestlexians.table[id][key];
        }
    
            
            
            
    /** 品阶 */
    get grade(): number {
        return this.data.grade;
    }
    /** 说明 */
    get name(): string {
        return this.data.name;
    }
    }
                