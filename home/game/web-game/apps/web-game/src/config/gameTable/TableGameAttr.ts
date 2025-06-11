
    import { JsonUtil } from "../../game-config/JsonUtil";
            
    export class TableGameAttr {
        static TableName: string = "GameAttr";
        static table:any = null;
            
        
        static N = 0;
        static curhp = 1;
        static hp = 2;
        static atk = 3;
        static def = 4;
        static atkspeed = 5;
        static hp_rate = 6;
        static atk_rate = 7;
        static def_rate = 8;
        static atk_ratio = 9;
        static add_damage = 10;
        static aktBack_pro = 11;
        static dec_atkBack_pro = 12;
        static aktBack_per = 13;
        static douleAtk_pro = 14;
        static dec_doubleAtk_pro = 15;
        static doubleAtk_per = 16;
        static miss = 17;
        static dec_miss = 18;
        static criticalAtk_pro = 19;
        static dec_criticalAtk_pro = 20;
        static criticalAtk_per = 21;
        static add_criticalDamage = 22;
        static dec_criticalDamage = 23;
        static add_damage_rate = 24;
        static dec_damage_rate = 25;
        static add_askill_pro = 26;
        static add_apskill_pro = 27;
        static add_askill_dam = 28;
        static add_apskill_dam = 29;
        static add_hp_per = 30;
            
        
        static field_strKey: string = "strKey";
        static field_name: string = "name";
        static field_zhanli: string = "zhanli";
        static field_rate: string = "rate";
        static field_effect: string = "effect";
                
            
        private data: any;
            
            
        constructor(numid: number){
            this.init(numid)
        }
    
        static initTable(){
            if (!TableGameAttr.table) {
                TableGameAttr.table = JsonUtil.get(TableGameAttr.TableName);
            }
        }
    
        static getTable(){
            return TableGameAttr.table
        }
    
        private init(numid: number) {
            this.data = TableGameAttr.table[numid];
            this.numid = numid;
        }
            
        /** 属性表【KEY】 */
        numid: number;
        
        
        static checkHave(numid: number){
            if(TableGameAttr.table[numid] == undefined){
                return false
            }
            return true
        }
    
        
        
        static getVal(numid: number,key:any){
            if(TableGameAttr.table[numid] == undefined){
                return
            }

            if(TableGameAttr.table[numid][key] == undefined){
                return
            }

            return TableGameAttr.table[numid][key];
        }
    
            
            
            
    /** 字符串ID */
    get strKey(): string {
        return this.data.strKey;
    }
    /** 属性名 */
    get name(): string {
        return this.data.name;
    }
    /** 战力计算系数 */
    get zhanli(): number {
        return this.data.zhanli;
    }
    /** 加成属性(程序专用) */
    get rate(): string {
        return this.data.rate;
    }
    /** 关联属性(程序专用) */
    get effect(): string {
        return this.data.effect;
    }
    }
                