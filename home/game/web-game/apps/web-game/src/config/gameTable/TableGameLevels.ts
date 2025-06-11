
    import { JsonUtil } from "../../game-config/JsonUtil";
            
    export class TableGameLevels {
        static TableName: string = "GameLevels";
        static table:any = null;
            
        
            
        
        static field_nextid: string = "nextid";
        static field_chapter_id: string = "chapter_id";
        static field_type: string = "type";
        static field_name: string = "name";
        static field_monster: string = "monster";
        static field_drop: string = "drop";
        static field_exp: string = "exp";
        static field_timedrop1: string = "timedrop1";
        static field_timedrop2: string = "timedrop2";
        static field_timedrop3: string = "timedrop3";
        static field_time_exp: string = "time_exp";
        static field_need_grade: string = "need_grade";
        static field_drop2: string = "drop2";
                
            
        private data: any;
            
            
        constructor(id: number){
            this.init(id)
        }
    
        static initTable(){
            if (!TableGameLevels.table) {
                TableGameLevels.table = JsonUtil.get(TableGameLevels.TableName);
            }
        }
    
        static getTable(){
            return TableGameLevels.table
        }
    
        private init(id: number) {
            this.data = TableGameLevels.table[id];
            this.id = id;
        }
            
        /** 关卡表【KEY】 */
        id: number;
        
        
        static checkHave(id: number){
            if(TableGameLevels.table[id] == undefined){
                return false
            }
            return true
        }
    
        
        
        static getVal(id: number,key:any){
            if(TableGameLevels.table[id] == undefined){
                return
            }

            if(TableGameLevels.table[id][key] == undefined){
                return
            }

            return TableGameLevels.table[id][key];
        }
    
            
            
            
    /** 下一关 */
    get nextid(): number {
        return this.data.nextid;
    }
    /** 章节 */
    get chapter_id(): number {
        return this.data.chapter_id;
    }
    /** 类型 */
    get type(): number {
        return this.data.type;
    }
    /** 名称 */
    get name(): string {
        return this.data.name;
    }
    /** 怪物 */
    get monster(): any {
        return this.data.monster;
    }
    /** 掉落 */
    get drop(): any {
        return this.data.drop;
    }
    /** 通关经验 */
    get exp(): number {
        return this.data.exp;
    }
    /** 60秒挂机奖励 */
    get timedrop1(): any {
        return this.data.timedrop1;
    }
    /** 600秒挂机奖励 */
    get timedrop2(): any {
        return this.data.timedrop2;
    }
    /** 3600秒挂机奖励 */
    get timedrop3(): any {
        return this.data.timedrop3;
    }
    /** 60秒挂机经验 */
    get time_exp(): number {
        return this.data.time_exp;
    }
    /** 佣兵进阶 */
    get need_grade(): number {
        return this.data.need_grade;
    }
    /** 掉落2 */
    get drop2(): any {
        return this.data.drop2;
    }
    }
                