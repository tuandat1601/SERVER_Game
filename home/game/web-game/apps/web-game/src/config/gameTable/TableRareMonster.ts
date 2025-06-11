
    import { JsonUtil } from "../../game-config/JsonUtil";
            
    export class TableRareMonster {
        static TableName: string = "RareMonster";
        static table:any = null;
            
        
            
        
        static field_lv: string = "lv";
        static field_name: string = "name";
        static field_group: string = "group";
        static field_nextid: string = "nextid";
        static field_costitem: string = "costitem";
        static field_skill: string = "skill";
        static field_resid: string = "resid";
        static field_quality: string = "quality";
        static field_hp_rate: string = "hp_rate";
        static field_atk_rate: string = "atk_rate";
        static field_def_rate: string = "def_rate";
        static field_aktBack_pro: string = "aktBack_pro";
        static field_dec_atkBack_pro: string = "dec_atkBack_pro";
        static field_douleAtk_pro: string = "douleAtk_pro";
        static field_dec_doubleAtk_pro: string = "dec_doubleAtk_pro";
        static field_miss: string = "miss";
        static field_dec_miss: string = "dec_miss";
        static field_criticalAtk_pro: string = "criticalAtk_pro";
        static field_dec_criticalAtk_pro: string = "dec_criticalAtk_pro";
        static field_add_criticalDamage: string = "add_criticalDamage";
        static field_dec_criticalDamage: string = "dec_criticalDamage";
        static field_add_damage_rate: string = "add_damage_rate";
        static field_dec_damage_rate: string = "dec_damage_rate";
        static field_add_askill_dam: string = "add_askill_dam";
        static field_add_apskill_dam: string = "add_apskill_dam";
        static field_add_hp_per: string = "add_hp_per";
        static field_atkspeed: string = "atkspeed";
                
            
        private data: any;
            
            
        constructor(id: number){
            this.init(id)
        }
    
        static initTable(){
            if (!TableRareMonster.table) {
                TableRareMonster.table = JsonUtil.get(TableRareMonster.TableName);
            }
        }
    
        static getTable(){
            return TableRareMonster.table
        }
    
        private init(id: number) {
            this.data = TableRareMonster.table[id];
            this.id = id;
        }
            
        /** 异兽【KEY】 */
        id: number;
        
        
        static checkHave(id: number){
            if(TableRareMonster.table[id] == undefined){
                return false
            }
            return true
        }
    
        
        
        static getVal(id: number,key:any){
            if(TableRareMonster.table[id] == undefined){
                return
            }

            if(TableRareMonster.table[id][key] == undefined){
                return
            }

            return TableRareMonster.table[id][key];
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
    /** 下一级ID */
    get nextid(): number {
        return this.data.nextid;
    }
    /** 升级所需道具 */
    get costitem(): any {
        return this.data.costitem;
    }
    /** 技能 */
    get skill(): number {
        return this.data.skill;
    }
    /** 资源 */
    get resid(): number {
        return this.data.resid;
    }
    /** 品质 */
    get quality(): number {
        return this.data.quality;
    }
    /** 生命加成 */
    get hp_rate(): number {
        return this.data.hp_rate;
    }
    /** 攻击加成 */
    get atk_rate(): number {
        return this.data.atk_rate;
    }
    /** 防御加成 */
    get def_rate(): number {
        return this.data.def_rate;
    }
    /** 反击 */
    get aktBack_pro(): number {
        return this.data.aktBack_pro;
    }
    /** 忽视反击 */
    get dec_atkBack_pro(): number {
        return this.data.dec_atkBack_pro;
    }
    /** 连击 */
    get douleAtk_pro(): number {
        return this.data.douleAtk_pro;
    }
    /** 忽视连击 */
    get dec_doubleAtk_pro(): number {
        return this.data.dec_doubleAtk_pro;
    }
    /** 闪避 */
    get miss(): number {
        return this.data.miss;
    }
    /** 忽视闪避 */
    get dec_miss(): number {
        return this.data.dec_miss;
    }
    /** 暴击 */
    get criticalAtk_pro(): number {
        return this.data.criticalAtk_pro;
    }
    /** 忽视暴击 */
    get dec_criticalAtk_pro(): number {
        return this.data.dec_criticalAtk_pro;
    }
    /** 暴伤增加 */
    get add_criticalDamage(): number {
        return this.data.add_criticalDamage;
    }
    /** 暴伤减免 */
    get dec_criticalDamage(): number {
        return this.data.dec_criticalDamage;
    }
    /** 伤害增加 */
    get add_damage_rate(): number {
        return this.data.add_damage_rate;
    }
    /** 伤害减免 */
    get dec_damage_rate(): number {
        return this.data.dec_damage_rate;
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
    /** 速度 */
    get atkspeed(): number {
        return this.data.atkspeed;
    }
    }
                