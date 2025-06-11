
    import { JsonUtil } from "../../game-config/JsonUtil";
            
    export class TableGameLevelSweep {
        static TableName: string = "GameLevelSweep";
        static table:any = null;
            
        
            
        
        static field_name: string = "name";
        static field_drop: string = "drop";
        static field_costitem_1: string = "costitem_1";
        static field_costitem_2: string = "costitem_2";
        static field_costitem_3: string = "costitem_3";
        static field_costitem_4: string = "costitem_4";
        static field_costitem_5: string = "costitem_5";
                
            
        private data: any;
            
            
        constructor(id: number){
            this.init(id)
        }
    
        static initTable(){
            if (!TableGameLevelSweep.table) {
                TableGameLevelSweep.table = JsonUtil.get(TableGameLevelSweep.TableName);
            }
        }
    
        static getTable(){
            return TableGameLevelSweep.table
        }
    
        private init(id: number) {
            this.data = TableGameLevelSweep.table[id];
            this.id = id;
        }
            
        /** 关卡表【KEY】 */
        id: number;
        
        
        static checkHave(id: number){
            if(TableGameLevelSweep.table[id] == undefined){
                return false
            }
            return true
        }
    
        
        
        static getVal(id: number,key:any){
            if(TableGameLevelSweep.table[id] == undefined){
                return
            }

            if(TableGameLevelSweep.table[id][key] == undefined){
                return
            }

            return TableGameLevelSweep.table[id][key];
        }
    
            
            
            
    /** 名称 */
    get name(): string {
        return this.data.name;
    }
    /** 扫荡奖励 */
    get drop(): any {
        return this.data.drop;
    }
    /** 消耗道具1 */
    get costitem_1(): any {
        return this.data.costitem_1;
    }
    /** 消耗道具2 */
    get costitem_2(): any {
        return this.data.costitem_2;
    }
    /** 消耗道具3 */
    get costitem_3(): any {
        return this.data.costitem_3;
    }
    /** 消耗道具4 */
    get costitem_4(): any {
        return this.data.costitem_4;
    }
    /** 消耗道具5 */
    get costitem_5(): any {
        return this.data.costitem_5;
    }
    }
                