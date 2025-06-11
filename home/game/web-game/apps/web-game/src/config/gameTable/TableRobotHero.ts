
    import { JsonUtil } from "../../game-config/JsonUtil";
            
    export class TableRobotHero {
        static TableName: string = "RobotHero";
        static table:any = null;
            
        
            
        
        static field_heroid: string = "heroid";
        static field_equip: string = "equip";
        static field_poslv: string = "poslv";
        static field_skill: string = "skill";
                
            
        private data: any;
            
            
        constructor(id: number){
            this.init(id)
        }
    
        static initTable(){
            if (!TableRobotHero.table) {
                TableRobotHero.table = JsonUtil.get(TableRobotHero.TableName);
            }
        }
    
        static getTable(){
            return TableRobotHero.table
        }
    
        private init(id: number) {
            this.data = TableRobotHero.table[id];
            this.id = id;
        }
            
        /** 机器人英雄表【KEY】 */
        id: number;
        
        
        static checkHave(id: number){
            if(TableRobotHero.table[id] == undefined){
                return false
            }
            return true
        }
    
        
        
        static getVal(id: number,key:any){
            if(TableRobotHero.table[id] == undefined){
                return
            }

            if(TableRobotHero.table[id][key] == undefined){
                return
            }

            return TableRobotHero.table[id][key];
        }
    
            
            
            
    /** 英雄表id */
    get heroid(): string {
        return this.data.heroid;
    }
    /** 装备 */
    get equip(): any {
        return this.data.equip;
    }
    /** 强化 */
    get poslv(): any {
        return this.data.poslv;
    }
    /** 技能 */
    get skill(): any {
        return this.data.skill;
    }
    }
                