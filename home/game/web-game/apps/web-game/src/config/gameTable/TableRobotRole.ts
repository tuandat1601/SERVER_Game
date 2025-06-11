
    import { JsonUtil } from "../../game-config/JsonUtil";
            
    export class TableRobotRole {
        static TableName: string = "RobotRole";
        static table:any = null;
            
        
            
        
        static field_name: string = "name";
        static field_icon: string = "icon";
        static field_lv: string = "lv";
        static field_fight: string = "fight";
        static field_robot: string = "robot";
        static field_medal: string = "medal";
                
            
        private data: any;
            
            
        constructor(id: number){
            this.init(id)
        }
    
        static initTable(){
            if (!TableRobotRole.table) {
                TableRobotRole.table = JsonUtil.get(TableRobotRole.TableName);
            }
        }
    
        static getTable(){
            return TableRobotRole.table
        }
    
        private init(id: number) {
            this.data = TableRobotRole.table[id];
            this.id = id;
        }
            
        /** 机器人角色表【KEY】 */
        id: number;
        
        
        static checkHave(id: number){
            if(TableRobotRole.table[id] == undefined){
                return false
            }
            return true
        }
    
        
        
        static getVal(id: number,key:any){
            if(TableRobotRole.table[id] == undefined){
                return
            }

            if(TableRobotRole.table[id][key] == undefined){
                return
            }

            return TableRobotRole.table[id][key];
        }
    
            
            
            
    /** 角色名 */
    get name(): string {
        return this.data.name;
    }
    /** 头像 */
    get icon(): string {
        return this.data.icon;
    }
    /** 等级 */
    get lv(): number {
        return this.data.lv;
    }
    /** 战力 */
    get fight(): string {
        return this.data.fight;
    }
    /** 机器人 */
    get robot(): any {
        return this.data.robot;
    }
    /** 勋章 */
    get medal(): number {
        return this.data.medal;
    }
    }
                