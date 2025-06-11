
    import { JsonUtil } from "../../game-config/JsonUtil";
            
    export class TableGameBuff {
        static TableName: string = "GameBuff";
        static table:any = null;
            
        
            
        
        static field_name: string = "name";
        static field_level: string = "level";
        static field_type: string = "type";
        static field_group: string = "group";
        static field_utype: string = "utype";
        static field_rdType: string = "rdType";
        static field_rounds: string = "rounds";
        static field_addpro: string = "addpro";
        static field_target: string = "target";
        static field_tNum: string = "tNum";
        static field_trigger: string = "trigger";
        static field_cpType: string = "cpType";
        static field_cpAttr: string = "cpAttr";
        static field_cpMul: string = "cpMul";
        static field_cpVal: string = "cpVal";
        static field_caType: string = "caType";
        static field_formula: string = "formula";
        static field_caAttr: string = "caAttr";
        static field_caState: string = "caState";
        static field_stateNum: string = "stateNum";
        static field_buffs: string = "buffs";
                
            
        private data: any;
            
            
        constructor(id: number){
            this.init(id)
        }
    
        static initTable(){
            if (!TableGameBuff.table) {
                TableGameBuff.table = JsonUtil.get(TableGameBuff.TableName);
            }
        }
    
        static getTable(){
            return TableGameBuff.table
        }
    
        private init(id: number) {
            this.data = TableGameBuff.table[id];
            this.id = id;
        }
            
        /** BUFF表【KEY】 */
        id: number;
        
        
        static checkHave(id: number){
            if(TableGameBuff.table[id] == undefined){
                return false
            }
            return true
        }
    
        
        
        static getVal(id: number,key:any){
            if(TableGameBuff.table[id] == undefined){
                return
            }

            if(TableGameBuff.table[id][key] == undefined){
                return
            }

            return TableGameBuff.table[id][key];
        }
    
            
            
            
    /** 名称 */
    get name(): string {
        return this.data.name;
    }
    /** 等级 */
    get level(): number {
        return this.data.level;
    }
    /** 类型 */
    get type(): number {
        return this.data.type;
    }
    /** BUFF组 */
    get group(): number {
        return this.data.group;
    }
    /** BUFF组覆盖逻辑类型 */
    get utype(): number {
        return this.data.utype;
    }
    /** 持续类型 */
    get rdType(): number {
        return this.data.rdType;
    }
    /** 持续回合 */
    get rounds(): number {
        return this.data.rounds;
    }
    /** 添加概率 */
    get addpro(): number {
        return this.data.addpro;
    }
    /** 释放目标类型 */
    get target(): number {
        return this.data.target;
    }
    /** 释放目标数量 */
    get tNum(): number {
        return this.data.tNum;
    }
    /** 触发生效类型 */
    get trigger(): number {
        return this.data.trigger;
    }
    /** 计算目标类型 */
    get cpType(): number {
        return this.data.cpType;
    }
    /** 计算属性 */
    get cpAttr(): number {
        return this.data.cpAttr;
    }
    /** 计算倍率 */
    get cpMul(): number {
        return this.data.cpMul;
    }
    /** 计算固定附加值 */
    get cpVal(): number {
        return this.data.cpVal;
    }
    /** 改变的目标对象 */
    get caType(): number {
        return this.data.caType;
    }
    /** 计算后改变的公式 */
    get formula(): number {
        return this.data.formula;
    }
    /** 计算后改变的属性 */
    get caAttr(): number {
        return this.data.caAttr;
    }
    /** 生效后改变的状态 */
    get caState(): any {
        return this.data.caState;
    }
    /** 生效状态的次数 */
    get stateNum(): any {
        return this.data.stateNum;
    }
    /** 生效后添加BUFF */
    get buffs(): any {
        return this.data.buffs;
    }
    }
                