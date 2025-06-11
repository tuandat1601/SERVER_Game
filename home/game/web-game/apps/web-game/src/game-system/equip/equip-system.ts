import { TableGameAttr } from "../../config/gameTable/TableGameAttr";
import { TableGameEquip } from "../../config/gameTable/TableGameEquip";
import { TableGameEquipQuality } from "../../config/gameTable/TableGameEquipQuality";
import { EquipEntity } from "../../game-data/entity/equip.entity";
import { cGameCommon } from "../game-common";

export const cEquipSystem = {

    cpEquipAttr(equipEntity: EquipEntity) {

        var equip_attr = {}
        if (!equipEntity || !TableGameEquip.table[equipEntity.id]) {
            return equip_attr;
        }
        var cur_equip_table = new TableGameEquip(equipEntity.id);
        const attr_arry = TableGameAttr.getTable()
        //基础属性计算
        for (const numkey in attr_arry) {
            var str_key = attr_arry[numkey][TableGameAttr.field_strKey];
            if (!cur_equip_table[str_key]) { continue; }
            equip_attr[numkey] = equip_attr[numkey] || 0;
            equip_attr[numkey] += cur_equip_table[str_key] + Math.floor(cur_equip_table[str_key] * equipEntity.bper / 10000);
        }

        //追加词条属性计算
        if (equipEntity.add) {
            for (const idx in equipEntity.add) {
                var data = equipEntity.add[idx];
                for (const numkey in data) {
                    const attr_var = data[numkey];
                    equip_attr[numkey] = equip_attr[numkey] || 0;
                    equip_attr[numkey] += attr_var;
                }
            }
        }

        //品质加成
        if (TableGameEquipQuality.checkHave(equipEntity.qid)) {
            let cur_quality_table = new TableGameEquipQuality(equipEntity.qid);
            for (const attrkey in equip_attr) {
                if (Object.prototype.hasOwnProperty.call(equip_attr, attrkey)) {
                    equip_attr[attrkey] = equip_attr[attrkey] + Math.floor(equip_attr[attrkey] * cur_quality_table.rate / 10000);
                }
            }
        }

        return equip_attr;
    },

    cpEquipFightPoint(equipEntity: EquipEntity) {

        var equip_attr = cEquipSystem.cpEquipAttr(equipEntity);
        let fight_point = cGameCommon.cpFightPoint(equip_attr);

        return fight_point;
    },

}