
    import { JsonUtil } from "../../game-config/JsonUtil";
            
    export class TableShop {
        static TableName: string = "Shop";
        static table:any = null;
            
        
            
        
        static field_name: string = "name";
        static field_paytype: string = "paytype";
        static field_price: string = "price";
        static field_cost: string = "cost";
        static field_free: string = "free";
        static field_adverts: string = "adverts";
        static field_timelimit: string = "timelimit";
        static field_dailylimit: string = "dailylimit";
        static field_alwayslimit: string = "alwayslimit";
        static field_double: string = "double";
        static field_drop: string = "drop";
        static field_exp: string = "exp";
        static field_addstatus: string = "addstatus";
        static field_systemid: string = "systemid";
        static field_coststatus: string = "coststatus";
        static field_enable: string = "enable";
        static field_diyshop: string = "diyshop";
                
            
        private data: any;
            
            
        constructor(id: number){
            this.init(id)
        }
    
        static initTable(){
            if (!TableShop.table) {
                TableShop.table = JsonUtil.get(TableShop.TableName);
            }
        }
    
        static getTable(){
            return TableShop.table
        }
    
        private init(id: number) {
            this.data = TableShop.table[id];
            this.id = id;
        }
            
        /** 商品表【KEY】 */
        id: number;
        
        
        static checkHave(id: number){
            if(TableShop.table[id] == undefined){
                return false
            }
            return true
        }
    
        
        
        static getVal(id: number,key:any){
            if(TableShop.table[id] == undefined){
                return
            }

            if(TableShop.table[id][key] == undefined){
                return
            }

            return TableShop.table[id][key];
        }
    
            
            
            
    /** 商品名称 */
    get name(): string {
        return this.data.name;
    }
    /** 支付类型 */
    get paytype(): number {
        return this.data.paytype;
    }
    /** 支付金额 */
    get price(): number {
        return this.data.price;
    }
    /** 支付所需道具 */
    get cost(): any {
        return this.data.cost;
    }
    /** 是否免费 */
    get free(): number {
        return this.data.free;
    }
    /** 是否需要广告激活 */
    get adverts(): number {
        return this.data.adverts;
    }
    /** 是否限制购买时间间隔（秒） */
    get timelimit(): any {
        return this.data.timelimit;
    }
    /** 每日限制 */
    get dailylimit(): number {
        return this.data.dailylimit;
    }
    /** 永久限制 */
    get alwayslimit(): number {
        return this.data.alwayslimit;
    }
    /** 首次购买双倍 */
    get double(): number {
        return this.data.double;
    }
    /** 商品内容 */
    get drop(): any {
        return this.data.drop;
    }
    /** 经验 */
    get exp(): number {
        return this.data.exp;
    }
    /** 激活状态 */
    get addstatus(): number {
        return this.data.addstatus;
    }
    /** 关联系统ID */
    get systemid(): number {
        return this.data.systemid;
    }
    /** 购买条件-需要解锁状态 */
    get coststatus(): number {
        return this.data.coststatus;
    }
    /** 商品是否可用 */
    get enable(): number {
        return this.data.enable;
    }
    /** 自定义商品ID */
    get diyshop(): number {
        return this.data.diyshop;
    }
    }
                