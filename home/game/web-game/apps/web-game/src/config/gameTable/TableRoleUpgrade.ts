
    import { JsonUtil } from "../../game-config/JsonUtil";
            
    export class TableRoleUpgrade {
        static TableName: string = "RoleUpgrade";
        static table:any = null;
            
        
            
        
        static field_name: string = "name";
        static field_open: string = "open";
        static field_glid: string = "glid";
        static field_hp: string = "hp";
        static field_atk: string = "atk";
        static field_def: string = "def";
        static field_atkspeed: string = "atkspeed";
        static field_task: string = "task";
        static field_maxLevel: string = "maxLevel";
                
            
        private data: any;
            
            
        constructor(id: number){
            this.init(id)
        }
    
        static initTable(){
            if (!TableRoleUpgrade.table) {
                TableRoleUpgrade.table = JsonUtil.get(TableRoleUpgrade.TableName);
            }
        }
    
        static getTable(){
            return TableRoleUpgrade.table
        }
    
        private init(id: number) {
            this.data = TableRoleUpgrade.table[id];
            this.id = id;
        }
            
        /** 进阶表【KEY】 */
        id: number;
        
        
        static checkHave(id: number){
            if(TableRoleUpgrade.table[id] == undefined){
                return false
            }
            return true
        }
    
        
        
        static getVal(id: number,key:any){
            if(TableRoleUpgrade.table[id] == undefined){
                return
            }

            if(TableRoleUpgrade.table[id][key] == undefined){
                return
            }

            return TableRoleUpgrade.table[id][key];
        }
    
            
            
            
    /** 进阶名 */
    get name(): string {
        return this.data.name;
    }
    /** 开放条件 */
    get open(): number {
        return this.data.open;
    }
    /** 挑战关卡表id */
    get glid(): number {
        return this.data.glid;
    }
    /** 生命 */
    get hp(): number {
        return this.data.hp;
    }
    /** 攻击 */
    get atk(): number {
        return this.data.atk;
    }
    /** 防御 */
    get def(): number {
        return this.data.def;
    }
    /** 速度 */
    get atkspeed(): number {
        return this.data.atkspeed;
    }
    /** 进阶任务 */
    get task(): any {
        return this.data.task;
    }
    /** 等级上限 */
    get maxLevel(): number {
        return this.data.maxLevel;
    }
    }
                