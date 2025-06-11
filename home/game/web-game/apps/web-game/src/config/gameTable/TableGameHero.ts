
    import { JsonUtil } from "../../game-config/JsonUtil";
            
    export class TableGameHero {
        static TableName: string = "GameHero";
        static table:any = null;
            
        
            
        
        static field_lv: string = "lv";
        static field_name: string = "name";
        static field_group: string = "group";
        static field_type: string = "type";
        static field_nextid: string = "nextid";
        static field_costexp: string = "costexp";
        static field_skill: string = "skill";
        static field_hp: string = "hp";
        static field_atk: string = "atk";
        static field_def: string = "def";
        static field_atkspeed: string = "atkspeed";
        static field_costitem: string = "costitem";
                
            
        private data: any;
            
            
        constructor(id: number){
            this.init(id)
        }
    
        static initTable(){
            if (!TableGameHero.table) {
                TableGameHero.table = JsonUtil.get(TableGameHero.TableName);
            }
        }
    
        static getTable(){
            return TableGameHero.table
        }
    
        private init(id: number) {
            this.data = TableGameHero.table[id];
            this.id = id;
        }
            
        /** 英雄表【KEY】 */
        id: number;
        
        
        static checkHave(id: number){
            if(TableGameHero.table[id] == undefined){
                return false
            }
            return true
        }
    
        
        
        static getVal(id: number,key:any){
            if(TableGameHero.table[id] == undefined){
                return
            }

            if(TableGameHero.table[id][key] == undefined){
                return
            }

            return TableGameHero.table[id][key];
        }
    
            
            
            
    /** 等级 */
    get lv(): number {
        return this.data.lv;
    }
    /** 名称 */
    get name(): string {
        return this.data.name;
    }
    /** 组别 */
    get group(): number {
        return this.data.group;
    }
    /** 类型 */
    get type(): number {
        return this.data.type;
    }
    /** 下一级ID */
    get nextid(): number {
        return this.data.nextid;
    }
    /** 升级所需经验 */
    get costexp(): number {
        return this.data.costexp;
    }
    /** 天赋技能 */
    get skill(): number {
        return this.data.skill;
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
    /** 升级所需道具 */
    get costitem(): any {
        return this.data.costitem;
    }
    }
                