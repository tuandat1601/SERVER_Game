
    import { JsonUtil } from "../../game-config/JsonUtil";
            
    export class TableGameSkill {
        static TableName: string = "GameSkill";
        static table:any = null;
            
        
            
        
        static field_group: string = "group";
        static field_name: string = "name";
        static field_level: string = "level";
        static field_quality: string = "quality";
        static field_type: string = "type";
        static field_probability: string = "probability";
        static field_buff: string = "buff";
        static field_cost: string = "cost";
        static field_nextId: string = "nextId";
        static field_dec: string = "dec";
        static field_hp: string = "hp";
        static field_atk: string = "atk";
        static field_def: string = "def";
                
            
        private data: any;
            
            
        constructor(id: number){
            this.init(id)
        }
    
        static initTable(){
            if (!TableGameSkill.table) {
                TableGameSkill.table = JsonUtil.get(TableGameSkill.TableName);
            }
        }
    
        static getTable(){
            return TableGameSkill.table
        }
    
        private init(id: number) {
            this.data = TableGameSkill.table[id];
            this.id = id;
        }
            
        /** 技能表【KEY】 */
        id: number;
        
        
        static checkHave(id: number){
            if(TableGameSkill.table[id] == undefined){
                return false
            }
            return true
        }
    
        
        
        static getVal(id: number,key:any){
            if(TableGameSkill.table[id] == undefined){
                return
            }

            if(TableGameSkill.table[id][key] == undefined){
                return
            }

            return TableGameSkill.table[id][key];
        }
    
            
            
            
    /** 分组 */
    get group(): number {
        return this.data.group;
    }
    /** 名称 */
    get name(): string {
        return this.data.name;
    }
    /** 等级 */
    get level(): number {
        return this.data.level;
    }
    /** 品质 */
    get quality(): number {
        return this.data.quality;
    }
    /** 类型 */
    get type(): number {
        return this.data.type;
    }
    /** 释放概率 */
    get probability(): number {
        return this.data.probability;
    }
    /** BUFF效果 */
    get buff(): any {
        return this.data.buff;
    }
    /** 升级需要道具 */
    get cost(): any {
        return this.data.cost;
    }
    /** 下一级ID */
    get nextId(): number {
        return this.data.nextId;
    }
    /** 描述 */
    get dec(): string {
        return this.data.dec;
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
    }
                