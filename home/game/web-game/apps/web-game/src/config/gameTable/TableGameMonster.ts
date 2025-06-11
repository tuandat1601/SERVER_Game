
    import { JsonUtil } from "../../game-config/JsonUtil";
            
    export class TableGameMonster {
        static TableName: string = "GameMonster";
        static table:any = null;
            
        
            
        
        static field_name: string = "name";
        static field_level: string = "level";
        static field_type: string = "type";
        static field_skills: string = "skills";
        static field_hp: string = "hp";
        static field_atk: string = "atk";
        static field_def: string = "def";
        static field_atkspeed: string = "atkspeed";
        static field_aktBack_pro: string = "aktBack_pro";
        static field_douleAtk_pro: string = "douleAtk_pro";
        static field_miss: string = "miss";
        static field_criticalAtk_pro: string = "criticalAtk_pro";
        static field_dec_atkBack_pro: string = "dec_atkBack_pro";
        static field_dec_doubleAtk_pro: string = "dec_doubleAtk_pro";
        static field_dec_miss: string = "dec_miss";
        static field_dec_criticalAtk_pro: string = "dec_criticalAtk_pro";
        static field_add_damage_rate: string = "add_damage_rate";
        static field_dec_damage_rate: string = "dec_damage_rate";
        static field_add_askill_pro: string = "add_askill_pro";
        static field_add_apskill_pro: string = "add_apskill_pro";
        static field_add_askill_dam: string = "add_askill_dam";
        static field_add_apskill_dam: string = "add_apskill_dam";
        static field_add_hp_per: string = "add_hp_per";
                
            
        private data: any;
            
            
        constructor(id: number){
            this.init(id)
        }
    
        static initTable(){
            if (!TableGameMonster.table) {
                TableGameMonster.table = JsonUtil.get(TableGameMonster.TableName);
            }
        }
    
        static getTable(){
            return TableGameMonster.table
        }
    
        private init(id: number) {
            this.data = TableGameMonster.table[id];
            this.id = id;
        }
            
        /** 怪物表【KEY】 */
        id: number;
        
        
        static checkHave(id: number){
            if(TableGameMonster.table[id] == undefined){
                return false
            }
            return true
        }
    
        
        
        static getVal(id: number,key:any){
            if(TableGameMonster.table[id] == undefined){
                return
            }

            if(TableGameMonster.table[id][key] == undefined){
                return
            }

            return TableGameMonster.table[id][key];
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
    /** 技能 */
    get skills(): any {
        return this.data.skills;
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
    /** 反击 */
    get aktBack_pro(): number {
        return this.data.aktBack_pro;
    }
    /** 连击 */
    get douleAtk_pro(): number {
        return this.data.douleAtk_pro;
    }
    /** 闪避 */
    get miss(): number {
        return this.data.miss;
    }
    /** 暴击 */
    get criticalAtk_pro(): number {
        return this.data.criticalAtk_pro;
    }
    /** 忽视反击 */
    get dec_atkBack_pro(): number {
        return this.data.dec_atkBack_pro;
    }
    /** 忽视连击 */
    get dec_doubleAtk_pro(): number {
        return this.data.dec_doubleAtk_pro;
    }
    /** 忽视闪避 */
    get dec_miss(): number {
        return this.data.dec_miss;
    }
    /** 忽视暴击 */
    get dec_criticalAtk_pro(): number {
        return this.data.dec_criticalAtk_pro;
    }
    /** 伤害增加 */
    get add_damage_rate(): number {
        return this.data.add_damage_rate;
    }
    /** 伤害减免 */
    get dec_damage_rate(): number {
        return this.data.dec_damage_rate;
    }
    /** 主动技概率 */
    get add_askill_pro(): number {
        return this.data.add_askill_pro;
    }
    /** 追击技概率 */
    get add_apskill_pro(): number {
        return this.data.add_apskill_pro;
    }
    /** 主动技伤害 */
    get add_askill_dam(): number {
        return this.data.add_askill_dam;
    }
    /** 追击技伤害 */
    get add_apskill_dam(): number {
        return this.data.add_apskill_dam;
    }
    /** 治疗效果 */
    get add_hp_per(): number {
        return this.data.add_hp_per;
    }
    }
                