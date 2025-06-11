
    import { JsonUtil } from "../../game-config/JsonUtil";
            
    export class Tablecaiquan {
        static TableName: string = "caiquan";
        static table:any = null;
            
        
            
        
        static field_costitem: string = "costitem";
        static field_skill: string = "skill";
                
            
        private data: any;
            
            
        constructor(id: number, level: number){
            this.init(id, level)
        }
    
        static initTable(){
            if (!Tablecaiquan.table) {
                Tablecaiquan.table = JsonUtil.get(Tablecaiquan.TableName);
            }
        }
    
        static getTable(){
            return Tablecaiquan.table
        }
    
        private init(id: number, level: number) {
            this.data = Tablecaiquan.table[id][level];
            this.id = id;        this.level = level;
        }
            
        /** 猜拳【KEY】 */
        id: number;    /** 等级【KEY】 */
        level: number;
        
        
        static checkHave(id: number, level: number){
            if(Tablecaiquan.table[id][level] == undefined){
                return false
            }
            return true
        }
    
        
        
        static getVal(id: number, level: number,key:any){
            if(Tablecaiquan.table[id][level] == undefined){
                return
            }

            if(Tablecaiquan.table[id][level][key] == undefined){
                return
            }

            return Tablecaiquan.table[id][level][key];
        }
    

static getVal2(id: number, level: number,key:any){
    if(Tablecaiquan.table[id] == undefined){
        return
    }

    if(Tablecaiquan.table[id][level] == undefined){
        return
    }

    if(Tablecaiquan.table[id][level][key] == undefined){
        return
    }

    return Tablecaiquan.table[id][level][key];
}
    
            
            
            
    /** 升级所需道具 */
    get costitem(): any {
        return this.data.costitem;
    }
    /** 被动技能 */
    get skill(): number {
        return this.data.skill;
    }
    }
                