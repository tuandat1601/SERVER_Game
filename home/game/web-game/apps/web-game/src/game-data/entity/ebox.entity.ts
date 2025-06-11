/**装备宝箱 */
export class EBoxEntity {

    /**装备宝箱等级 */
    lv:number;
    
    /**装备订单当前购买次数 */
    lvUpCount?:number;
  
    /**装备宝箱升级结束时间戳 毫秒 */
    cd?:number;

    /**当前保底次数 */
    speCount?:number;

    /**间隔时间 */
    interval?:number;
  }

/**技能宝箱 */
export class SBoxEntity {
  /**当前保底次数 */
  speCount?:number;

  /**使用钻石间隔时间戳 */
  interval?:number;
}

/**寻宝 */
export class XBoxEntity {
  /**当前保底次数 */
  speCount?:number = 0;
  total?: number = 0; //总次数
  times?: number[] = []; //每档的次数
  award?: number[] = []; //领取奖励
}
  