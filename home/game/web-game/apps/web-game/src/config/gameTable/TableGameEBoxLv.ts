
    import { JsonUtil } from "../../game-config/JsonUtil";
            
    export class TableGameEBoxLv {
        static TableName: string = "GameEBoxLv";
        static table:any = null;
            
        
            
        
        static field_up_item: string = "up_item";
        static field_up_price: string = "up_price";
        static field_up_num: string = "up_num";
        static field_up_cd: string = "up_cd";
        static field_spe_count: string = "spe_count";
        static field_spe_quality: string = "spe_quality";
        static field_quality_1: string = "quality_1";
        static field_quality_2: string = "quality_2";
        static field_quality_3: string = "quality_3";
        static field_quality_4: string = "quality_4";
        static field_quality_5: string = "quality_5";
        static field_quality_6: string = "quality_6";
        static field_quality_7: string = "quality_7";
        static field_quality_8: string = "quality_8";
        static field_quality_9: string = "quality_9";
                
            
        private data: any;
            
            
        constructor(id: number){
            this.init(id)
        }
    
        static initTable(){
            if (!TableGameEBoxLv.table) {
                TableGameEBoxLv.table = JsonUtil.get(TableGameEBoxLv.TableName);
            }
        }
    
        static getTable(){
            return TableGameEBoxLv.table
        }
    
        private init(id: number) {
            this.data = TableGameEBoxLv.table[id];
            this.id = id;
        }
            
        /** 装备宝箱等级表【KEY】 */
        id: number;
        
        
        static checkHave(id: number){
            if(TableGameEBoxLv.table[id] == undefined){
                return false
            }
            return true
        }
    
        
        
        static getVal(id: number,key:any){
            if(TableGameEBoxLv.table[id] == undefined){
                return
            }

            if(TableGameEBoxLv.table[id][key] == undefined){
                return
            }

            return TableGameEBoxLv.table[id][key];
        }
    
            
            
            
    /** 升级道具 */
    get up_item(): number {
        return this.data.up_item;
    }
    /** 升级订单单价 */
    get up_price(): number {
        return this.data.up_price;
    }
    /** 升级所需订单次数 */
    get up_num(): number {
        return this.data.up_num;
    }
    /** 升级所需时间（秒） */
    get up_cd(): number {
        return this.data.up_cd;
    }
    /** 保底次数 */
    get spe_count(): number {
        return this.data.spe_count;
    }
    /** 保底品质 */
    get spe_quality(): number {
        return this.data.spe_quality;
    }
    /** 装备品质1 */
    get quality_1(): number {
        return this.data.quality_1;
    }
    /** 装备品质2 */
    get quality_2(): number {
        return this.data.quality_2;
    }
    /** 装备品质3 */
    get quality_3(): number {
        return this.data.quality_3;
    }
    /** 装备品质4 */
    get quality_4(): number {
        return this.data.quality_4;
    }
    /** 装备品质5 */
    get quality_5(): number {
        return this.data.quality_5;
    }
    /** 装备品质6 */
    get quality_6(): number {
        return this.data.quality_6;
    }
    /** 装备品质7 */
    get quality_7(): number {
        return this.data.quality_7;
    }
    /** 装备品质8 */
    get quality_8(): number {
        return this.data.quality_8;
    }
    /** 装备品质9 */
    get quality_9(): number {
        return this.data.quality_9;
    }
    }
                