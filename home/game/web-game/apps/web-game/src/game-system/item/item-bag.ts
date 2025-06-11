import { gameConst } from "../../config/game-const";
import { TableGameItem } from "../../config/gameTable/TableGameItem";
import { languageConfig } from "../../config/language/language";
import { ItemsRecord } from "../../game-data/entity/item.entity";
import { RESChangeMsg } from "../../game-data/entity/msg.entity";

export const cItemBag = {

    /**
     * 所需道具是否足够 
     * 不会保存数据到缓存
     * 确定业务要执行后再保存（要在添加道具之前保存，否则会冲突丢失数据）
     */
    costItem(itemBag: ItemsRecord, costItem: ItemsRecord, retMsg: RESChangeMsg, needNum: number = 1) {

        retMsg.decitem = retMsg.decitem || {};
        for (const cidx in costItem) {
            if (Object.prototype.hasOwnProperty.call(costItem, cidx)) {
                const cost_num = costItem[cidx];
                if (!cost_num || !itemBag[cidx] || itemBag[cidx] < cost_num * needNum) {
                    let item_name = TableGameItem.getVal(Number(cidx), TableGameItem.field_name) || cidx;
                    retMsg.msg = `${item_name + languageConfig.tip.not_enough}`;
                    delete retMsg.decitem;
                    return retMsg;
                }
                cItemBag.decitem(itemBag, retMsg.decitem, Number(cidx), cost_num * needNum);
            }
        }
        retMsg.ok = true;
    },

    //添加道具
    addItem: function (itemBag: ItemsRecord, additem: ItemsRecord, itemid: number, addnum: number) {
        itemBag[itemid] = itemBag[itemid] || 0;
        itemBag[itemid] += addnum;

        additem[itemid] = additem[itemid] || 0;
        additem[itemid] += addnum;

        //日志标记处理
        additem[gameConst.log_itemNumTag + itemid] = additem[gameConst.log_itemNumTag + itemid] || 0;
        additem[gameConst.log_itemNumTag + itemid] = itemBag[itemid];
    },


    //减道具
    decitem: function (itemBag: ItemsRecord, decitem: ItemsRecord, itemid: number, decnum: number) {
        itemBag[itemid] = itemBag[itemid] || 0;
        itemBag[itemid] -= decnum;

        decitem[itemid] = decitem[itemid] || 0;
        decitem[itemid] += decnum;

        //日志标记处理
        decitem[gameConst.log_itemNumTag + itemid] = decitem[gameConst.log_itemNumTag + itemid] || 0;
        decitem[gameConst.log_itemNumTag + itemid] = itemBag[itemid];
    },


    //清理当前物品数量标记
    clearItemTag: function (items: ItemsRecord) {
        for (const key in items) {
            if (Object.prototype.hasOwnProperty.call(items, key)) {
                if (key.indexOf(gameConst.log_itemNumTag) !== -1) {
                    delete items[key];
                }
            }
        }
    },


}