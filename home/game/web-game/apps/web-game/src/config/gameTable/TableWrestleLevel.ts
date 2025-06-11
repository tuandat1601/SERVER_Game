
    import { JsonUtil } from "../../game-config/JsonUtil";
            
    export class TableWrestleLevel {
        static TableName: string = "WrestleLevel";
        static table:any = null;
            
        
            
        
        static field_nextid: string = "nextid";
        static field_grade: string = "grade";
        static field_lv: string = "lv";
        static field_name: string = "name";
        static field_winexp: string = "winexp";
        static field_loseexp: string = "loseexp";
        static field_expprob: string = "expprob";
        static field_needexp: string = "needexp";
        static field_cardslot: string = "cardslot";
        static field_award: string = "award";
        static field_drop: string = "drop";
        static field_drop2: string = "drop2";
        static field_monster: string = "monster";
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
        static field_add_askill_pro: string = "add_askill_pro";
        static field_add_apskill_pro: string = "add_apskill_pro";
        static field_add_askill_dam: string = "add_askill_dam";
        static field_add_apskill_dam: string = "add_apskill_dam";
        static field_add_hp_per: string = "add_hp_per";
        static field_hp_rate: string = "hp_rate";
        static field_atk_rate: string = "atk_rate";
        static field_def_rate: string = "def_rate";
        static field_add_damage_rate: string = "add_damage_rate";
        static field_dec_damage_rate: string = "dec_damage_rate";
                
            
        private data: any;
            
            
        constructor(id: number){
            this.init(id)
        }
    
        static initTable(){
            if (!TableWrestleLevel.table) {
                TableWrestleLevel.table = JsonUtil.get(TableWrestleLevel.TableName);
            }
        }
    
        static getTable(){
            return TableWrestleLevel.table
        }
    
        private init(id: number) {
            this.data = TableWrestleLevel.table[id];
            this.id = id;
        }
            
        /** 角斗关卡表【KEY】 */
        id: number;
        
        
        static checkHave(id: number){
            if(TableWrestleLevel.table[id] == undefined){
                return false
            }
            return true
        }
    
        
        
        static getVal(id: number,key:any){
            if(TableWrestleLevel.table[id] == undefined){
                return
            }

            if(TableWrestleLevel.table[id][key] == undefined){
                return
            }

            return TableWrestleLevel.table[id][key];
        }
    
            
            
            
    /** 下一个id */
    get nextid(): number {
        return this.data.nextid;
    }
    /** 品阶 */
    get grade(): number {
        return this.data.grade;
    }
    /** 等级 */
    get lv(): number {
        return this.data.lv;
    }
    /** 名称 */
    get name(): string {
        return this.data.name;
    }
    /** 挑战赢经验值 */
    get winexp(): number {
        return this.data.winexp;
    }
    /** 挑战输经验值 */
    get loseexp(): number {
        return this.data.loseexp;
    }
    /** 连胜经验值比例 */
    get expprob(): number {
        return this.data.expprob;
    }
    /** 升级经验值 */
    get needexp(): number {
        return this.data.needexp;
    }
    /** 解锁角斗卡槽 */
    get cardslot(): number {
        return this.data.cardslot;
    }
    /** 升阶奖励 */
    get award(): any {
        return this.data.award;
    }
    /** 对战掉落 */
    get drop(): any {
        return this.data.drop;
    }
    /** 对战掉落 */
    get drop2(): any {
        return this.data.drop2;
    }
    /** 怪物 */
    get monster(): any {
        return this.data.monster;
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
    /** 伤害增加 */
    get add_damage_rate(): number {
        return this.data.add_damage_rate;
    }
    /** 伤害减免 */
    get dec_damage_rate(): number {
        return this.data.dec_damage_rate;
    }
    }
                