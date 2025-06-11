
    import { JsonUtil } from "../../game-config/JsonUtil";
            
    export class TableGameSBoxLv {
        static TableName: string = "GameSBoxLv";
        static table:any = null;
            
        
            
        
        static field_spe_count: string = "spe_count";
        static field_spe_quality: string = "spe_quality";
        static field_count: string = "count";
        static field_quality_1: string = "quality_1";
        static field_quality_2: string = "quality_2";
        static field_quality_3: string = "quality_3";
        static field_quality_4: string = "quality_4";
        static field_quality_5: string = "quality_5";
        static field_quality_6: string = "quality_6";
        static field_quality_7: string = "quality_7";
        static field_quality_8: string = "quality_8";
                
            
        private data: any;
            
            
        constructor(id: number){
            this.init(id)
        }
    
        static initTable(){
            if (!TableGameSBoxLv.table) {
                TableGameSBoxLv.table = JsonUtil.get(TableGameSBoxLv.TableName);
            }
        }
    
        static getTable(){
            return TableGameSBoxLv.table
        }
    
        private init(id: number) {
            this.data = TableGameSBoxLv.table[id];
            this.id = id;
        }
            
        /** 技能宝箱等级表【KEY】 */
        id: number;
        
        
        static checkHave(id: number){
            if(TableGameSBoxLv.table[id] == undefined){
                return false
            }
            return true
        }
    
        
        
        static getVal(id: number,key:any){
            if(TableGameSBoxLv.table[id] == undefined){
                return
            }

            if(TableGameSBoxLv.table[id][key] == undefined){
                return
            }

            return TableGameSBoxLv.table[id][key];
        }
    
            
            
            
    /** 保底次数 */
    get spe_count(): number {
        return this.data.spe_count;
    }
    /** 保底品质 */
    get spe_quality(): number {
        return this.data.spe_quality;
    }
    /** 获取数量 */
    get count(): number {
        return this.data.count;
    }
    /** 技能品质1 */
    get quality_1(): number {
        return this.data.quality_1;
    }
    /** 技能品质2 */
    get quality_2(): number {
        return this.data.quality_2;
    }
    /** 技能品质3 */
    get quality_3(): number {
        return this.data.quality_3;
    }
    /** 技能品质4 */
    get quality_4(): number {
        return this.data.quality_4;
    }
    /** 技能品质1(20个) */
    get quality_5(): number {
        return this.data.quality_5;
    }
    /** 技能品质2(20个) */
    get quality_6(): number {
        return this.data.quality_6;
    }
    /** 技能品质3(20个) */
    get quality_7(): number {
        return this.data.quality_7;
    }
    /** 技能品质4(20个) */
    get quality_8(): number {
        return this.data.quality_8;
    }
    }
                