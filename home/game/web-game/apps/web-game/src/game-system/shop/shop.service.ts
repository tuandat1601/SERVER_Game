import { Body, Injectable, Request } from '@nestjs/common';
import { BESendRechargeShopDto } from 'apps/web-backend/src/backend-system/games-mgr/dto/games-mgr.dto';
import { EActType, EShopPayType } from '../../config/game-enum';
import { TableDiyShop } from '../../config/gameTable/TableDiyShop';
import { TableFundEboxAward } from '../../config/gameTable/TableFundEboxAward';
import { TableFundLevelAward } from '../../config/gameTable/TableFundLevelAward';
import { TableGameConfig } from '../../config/gameTable/TableGameConfig';
import { TableGameSys } from '../../config/gameTable/TableGameSys';
import { TablePrivilegeType } from '../../config/gameTable/TablePrivilegeType';
import { TableRechargeGift } from '../../config/gameTable/TableRechargeGift';
import { TableShop } from '../../config/gameTable/TableShop';
import { TableStatus } from '../../config/gameTable/TableStatus';
import { languageConfig } from '../../config/language/language';
import { ItemsRecord } from '../../game-data/entity/item.entity';
import { REMsg, RESBuyItemMsg, RESFundEboxGetAwardMsg, RESFundLevelGetAwardMsg, RESGetMonthCardAwardMsg, RESRechargeGiftMsg } from '../../game-data/entity/msg.entity';
import { RoleSubInfoEntity } from '../../game-data/entity/roleinfo.entity';
import { BuyItemTag } from '../../game-data/entity/shop.entity';
import { GameDataService, GetRoleALLInfoDto } from '../../game-data/gamedata.service';
import { RoleKeyDto } from '../../game-data/role/dto/role-key.dto';
import { cTools } from '../../game-lib/tools';
import { EquipService } from '../equip/equip.service';
import { cGameCommon, RetRoleALLInfo } from '../game-common';
import { syshero } from '../hero/hero-lvup';
import { cItemBag } from '../item/item-bag';
import { BuyItemDto, FundEboxGetAwardDto, FundLevelGetAwardDto, GetMonthCardAwardDto, NotifyRechargePayShopDto, PayBuyItemDto, RechargeGiftDto } from './dto/shop.dto';

@Injectable()
export class ShopService {
    constructor(
        private readonly gameDataService: GameDataService,
    ) {
    }

    /**
     * 添加购买限制标记
     * @param roleSubInfo 
     * @param shopData 
     * @param buynum 
     * @returns 
     */
    addBuyItemtag(roleSubInfo: RoleSubInfoEntity, shopData: TableShop, buynum: number) {

        if (!roleSubInfo) { return false; }

        // if (shopData.dailylimit <= 0 && shopData.alwayslimit <= 0) { return false; }

        roleSubInfo.buyItemTag = roleSubInfo.buyItemTag || new BuyItemTag();
        let buyItemTag = roleSubInfo.buyItemTag;
        let isadd = false;
        if (shopData.dailylimit > 0) {
            buyItemTag.dailyTag = buyItemTag.dailyTag || {};
            buyItemTag.dailyTag[shopData.id] = buyItemTag.dailyTag[shopData.id] || 0;
            buyItemTag.dailyTag[shopData.id] += buynum;
            isadd = true;
        }

        if (shopData.alwayslimit > 0) {
            buyItemTag.alwayTag = buyItemTag.alwayTag || {};
            buyItemTag.alwayTag[shopData.id] = buyItemTag.alwayTag[shopData.id] || 0;
            buyItemTag.alwayTag[shopData.id] += buynum;
            isadd = true;
        }

        if (shopData.double > 0) {
            buyItemTag.doubleTag = buyItemTag.doubleTag || {};
            buyItemTag.doubleTag[shopData.id] = buyItemTag.doubleTag[shopData.id] || 0;
            buyItemTag.doubleTag[shopData.id] += buynum;
            isadd = true;
        }
        if (shopData.timelimit) {
            buyItemTag.timeTag = buyItemTag.timeTag || {};
            buyItemTag.timeTag[shopData.id] = buyItemTag.timeTag[shopData.id] || 0;
            buyItemTag.timeTag[shopData.id] = Math.floor((new Date).getTime() / 1000);
            isadd = true;
        }

        return isadd;
    }

    /**
     * 检测购买商品是否受限制
     * @param roleSubInfo 
     * @param shopData 
     * @param buynum 
     * @param retMsg 
     * @returns 
     */
    checkBuyItemByTag(roleSubInfo: RoleSubInfoEntity, shopData: TableShop, buynum: number, retMsg: REMsg) {

        if (!roleSubInfo) { return false }

        if (shopData.dailylimit <= 0 && shopData.alwayslimit <= 0) { return true }

        if (shopData.dailylimit > 0) {
            roleSubInfo.buyItemTag.dailyTag = roleSubInfo.buyItemTag.dailyTag || {};
            let cur_num = roleSubInfo.buyItemTag.dailyTag[shopData.id] || 0;
            let puls_limit = cGameCommon.getPrivilegeVal(roleSubInfo, shopData.systemid, TablePrivilegeType.shop_add_daily_num, shopData.id);

            if (cur_num + buynum <= shopData.dailylimit + puls_limit) {
            }
            else {
                retMsg.msg = "超过每日购买限制";
                return false;
            }

            //时间限制
            if (shopData.timelimit) {
                for (let index = 1; index <= shopData.timelimit.length; index++) {
                    if (cur_num == index) {
                        const element = shopData.timelimit[index - 1] || 0;
                        let last_time = roleSubInfo.buyItemTag.timeTag[shopData.id] || 0;
                        let cur_time = Math.floor((new Date).getTime() / 1000);
                        if (cur_time < last_time + element) {
                            retMsg.msg = "未到购买时间"
                            return false;
                        }
                    }
                }
            }
        }

        if (shopData.alwayslimit > 0) {
            roleSubInfo.buyItemTag.alwayTag = roleSubInfo.buyItemTag.alwayTag || {};
            let cur_num = roleSubInfo.buyItemTag.alwayTag[shopData.id] || 0;

            if (cur_num + buynum <= shopData.alwayslimit) {

            }
            else {
                retMsg.msg = "超过购买限制";
                return false;
            }
        }

        return true;

    }



    /**
     * 购买限速商品
     * @param req 
     * @param buyItemDto 
     * @returns 
     */
    async buyItemSp(@Request() req: any, @Body() buyItemDto: BuyItemDto) {

        let retMsg: RESBuyItemMsg = new RESBuyItemMsg();
        if (!TableShop.checkHave(buyItemDto.shopid)) {
            retMsg.msg = "此商品不存在";
            return retMsg;
        }

        let shop_table = new TableShop(buyItemDto.shopid);
        if (!shop_table.timelimit) {
            retMsg.msg = "非法调用1";
            return retMsg;
        }

        return this.buyItem(req, buyItemDto, true);

    }

    /**
     * 购买商品
     * @param req 
     * @param buyItemDto 
     * @returns 
     */
    async buyItem(@Request() req: any, @Body() buyItemDto: BuyItemDto, isLocal: boolean = false) {

        let roleKeyDto: RoleKeyDto = { id: req.user.id, serverid: req.user.serverid };

        let retMsg: RESBuyItemMsg = new RESBuyItemMsg();

        if (!TableShop.checkHave(buyItemDto.shopid)) {
            retMsg.msg = "此商品不存在";
            return retMsg;
        }

        let shop_table = new TableShop(buyItemDto.shopid);

        if (shop_table.paytype === EShopPayType.RECHARGE) {
            if (cTools.getTestModel()) {
                return this.rechargePayShop({ roleid: roleKeyDto.id, serverid: roleKeyDto.serverid, shopid: buyItemDto.shopid });
            }
            else {
                retMsg.msg = "非法购买1";
                return retMsg;
            }
        }

        let getRoleALLInfoDto = new GetRoleALLInfoDto(roleKeyDto);
        getRoleALLInfoDto.need_roleInfo = true;
        getRoleALLInfoDto.need_roleItem = true;
        getRoleALLInfoDto.need_roleHero = true;
        //获取角色信息
        let retRoleALLInfo: RetRoleALLInfo = await this.gameDataService.getRoleAllInfo(getRoleALLInfoDto);
        if (!retRoleALLInfo.isHaveData()) {
            retMsg.msg = retRoleALLInfo.getRetMsg();
            return retMsg;
        }
        //系统是否开放
        if (!cGameCommon.isOpenSystem(retRoleALLInfo, shop_table.systemid)) {
            retMsg.msg = languageConfig.tip.not_open_system;
            return retMsg;
        }

        const buynum = shop_table.free ? 1 : buyItemDto.num;

        //是否限制购买
        if (!this.checkBuyItemByTag(retRoleALLInfo.roleSubInfo, shop_table, buynum, retMsg)) {
            return retMsg;
        }

        //是否需要广告
        if (shop_table.adverts) {
            if (!cGameCommon.getIsHavePrivilege(retRoleALLInfo.roleInfo, TablePrivilegeType.free_advertising)) {
                if (!retRoleALLInfo.roleSubInfo.adverts) {
                    retMsg.msg = "需要观看广告后领取";
                    return retMsg;
                }
            }
        }

        //是否免费
        if (!shop_table.free) {
            //道具是否足够
            if (shop_table.cost && Object.keys(shop_table.cost).length > 0) {
                cItemBag.costItem(retRoleALLInfo.roleItem, shop_table.cost, retMsg, buynum);
            }
            else {
                retMsg.msg = `非免费商品cost为空`;
            }

            if (!retMsg.ok) {
                return retMsg;
            }
        }

        //是否需要解锁状态
        if (shop_table.coststatus && shop_table.coststatus !== 0) {
            if (!cGameCommon.isHaveStatus(retRoleALLInfo.roleInfo, shop_table.coststatus)) {

                if (!TableStatus.checkHave(shop_table.coststatus)) {
                    retMsg.msg = "非法状态：" + shop_table.coststatus;
                }
                else {
                    let table = new TableStatus(shop_table.coststatus)
                    retMsg.msg = "没有购买" + table.name;
                }

                return retMsg;
            }
        }

        await this.gameDataService.updateRoleItem(roleKeyDto, retRoleALLInfo.roleItem);

        //添加每日购买限制
        let is_newtag = this.addBuyItemtag(retRoleALLInfo.roleSubInfo, shop_table, buynum);

        //发放道具奖励
        if (shop_table.drop && shop_table.drop.length > 0) {
            let dropDataEntity = await cGameCommon.addItemByDrop(roleKeyDto, shop_table.drop, this.gameDataService, buynum);
            cGameCommon.hanleDropMsg(dropDataEntity, retMsg);
        }

        //添加经验
        if (shop_table.exp && shop_table.exp > 0) {
            retMsg.roleAddExp = syshero.leadheroAddExp(retRoleALLInfo, retRoleALLInfo.roleHero, shop_table.exp);

            if (retMsg.roleAddExp?.newHero || retMsg.roleAddExp?.newActiveHeros) {
                await this.gameDataService.updateRoleHero(roleKeyDto, retRoleALLInfo.roleHero);
            }
        }

        //添加状态
        if (shop_table.addstatus > 0) {
            cGameCommon.addStatus(retRoleALLInfo.roleInfo, shop_table.addstatus);
            retMsg.status = retRoleALLInfo.roleSubInfo.status;
            if (TableStatus.checkHave(shop_table.addstatus)) {
                let tableStatus = new TableStatus(shop_table.addstatus);
                if (tableStatus.privilege && tableStatus.privilege.length > 0) {
                    retMsg.privilege = retRoleALLInfo.roleSubInfo.privilege;
                }
            }
        }

        await this.gameDataService.updateRoleInfo(roleKeyDto, retRoleALLInfo.roleInfo);

        if (is_newtag) {
            retMsg.buyItemTag = retRoleALLInfo.roleSubInfo.buyItemTag;
        }
        retMsg.ts_buy_shopid = buyItemDto.shopid;
        languageConfig.setActTypeSuccess(EActType.SHOP_BUY_ITEM, retMsg);
        return retMsg;

    }

    async notifyRechargePayShop(@Request() req: any, notifyRechargePayShopDto: NotifyRechargePayShopDto) {

        let retMsg: RESBuyItemMsg = new RESBuyItemMsg();

        let roleKeyDto: RoleKeyDto = { id: req.user.id, serverid: req.user.serverid };

        let prismaBackendDB = this.gameDataService.getPrismaBackendDB();

        let order = await prismaBackendDB.orders.findUnique(
            {
                where: {
                    id: notifyRechargePayShopDto.orderId
                }
            }
        )

        if (!order) {
            retMsg.msg = "订单不存在";
            return retMsg
        }

        if (order.gameRoleId !== roleKeyDto.id) {
            retMsg.msg = "角色ID不一致";
            return retMsg
        }

        if (Number(order.paid) !== 1) {
            retMsg.msg = "订单未支付成功";
            return retMsg
        }

        if (Number(order.delivered) === 1) {
            retMsg.msg = "已经发放奖励";
            return retMsg
        }

        let mains_serverid = await this.gameDataService.getMainServerIds(roleKeyDto.serverid);
        let payBuyItemDto: PayBuyItemDto = {
            roleid: roleKeyDto.id,
            serverid: mains_serverid,
            shopid: order.shopId,
            info: <unknown>order.info
        }

        retMsg = await this.rechargePayShop(payBuyItemDto);

        if (retMsg.ok) {
            await prismaBackendDB.orders.update(
                {
                    where: {
                        id: notifyRechargePayShopDto.orderId
                    },
                    data: {
                        delivered: 1
                    }
                }
            )
        }


        return retMsg;
    }

    async beSendRechargeShop(@Request() req: any, @Body() beSendRechargeShopDto: BESendRechargeShopDto) {

        let prismaGameDB = this.gameDataService.getPrismaGameDB()

        let retMsg = new RESBuyItemMsg();
        let role = await this.gameDataService.getRole({ id: beSendRechargeShopDto.roleid, serverid: beSendRechargeShopDto.serverid }, false, 1, false);

        if (!role) {
            retMsg.msg = "玩家不在线";
            return retMsg;
        }

        retMsg = await this.rechargePayShop(beSendRechargeShopDto)
        if (retMsg.ok) {
            languageConfig.setActTypeSuccess(EActType.BE_SEND_CSHOP, retMsg);
        }

        return retMsg;
    }

    /**
     * 购买充值商品
     * @param payBuyItemDto 
     * @returns 
     */
    async rechargePayShop(payBuyItemDto: PayBuyItemDto) {

        let roleKeyDto: RoleKeyDto = { id: payBuyItemDto.roleid, serverid: payBuyItemDto.serverid };

        let retMsg: RESBuyItemMsg = new RESBuyItemMsg();

        if (!TableShop.checkHave(payBuyItemDto.shopid)) {
            retMsg.msg = "此商品不存在";
            return retMsg;
        }

        let shop_table = new TableShop(payBuyItemDto.shopid);

        if (shop_table.paytype === EShopPayType.GAME_MONEY_ITEM) {
            retMsg.msg = "非法购买2";
            return retMsg;
        }

        //自定义商品
        let diyshop_data: TableDiyShop
        let select_item: ItemsRecord = {};
        let is_diy = false;
        if (payBuyItemDto.info) {
            if (payBuyItemDto.info.diyShopIndex) {
                if (!TableDiyShop.checkHave(Number(shop_table.diyshop))) {
                    retMsg.msg = `自定义商品数据为空 id:${shop_table.diyshop}`;
                    return retMsg;
                }
                diyshop_data = new TableDiyShop(Number(shop_table.diyshop));
                let cur_items: any[] = diyshop_data.items;
                for (let index = 0; index < payBuyItemDto.info.diyShopIndex.length; index++) {
                    const cur_index = payBuyItemDto.info.diyShopIndex[index];
                    if (cur_index >= cur_items.length) {
                        retMsg.msg = `自选商品数据异常GN1 cur_index:${cur_index} cur_items:${cur_items.length}`;
                        return retMsg;
                    }

                    for (const key in cur_items[cur_index]) {
                        if (Object.prototype.hasOwnProperty.call(cur_items[cur_index], key)) {
                            let new_num = cur_items[cur_index][key];
                            select_item[key] = new_num;
                        }
                    }
                }
                is_diy = true;
            }
        }

        let getRoleALLInfoDto = new GetRoleALLInfoDto(roleKeyDto);
        getRoleALLInfoDto.need_roleInfo = true;

        //获取角色信息
        let retRoleALLInfo: RetRoleALLInfo = await this.gameDataService.getRoleAllInfo(getRoleALLInfoDto);
        if (!retRoleALLInfo.isHaveData()) {
            retMsg.msg = retRoleALLInfo.getRetMsg();
            return retMsg;
        }

        //系统是否开放
        if (!cGameCommon.isOpenSystem(retRoleALLInfo, shop_table.systemid)) {
            retMsg.msg = languageConfig.tip.not_open_system;
            return retMsg;
        }

        //是否限制购买
        if (!this.checkBuyItemByTag(retRoleALLInfo.roleSubInfo, shop_table, 1, retMsg)) {
            return retMsg;
        }

        //充值相关处理
        let rechargeInfo = retRoleALLInfo.roleSubInfo.rechargeInfo;
        if (shop_table.price >= 6 && !rechargeInfo.today6IsPaid) {
            retRoleALLInfo.roleSubInfo.rechargeInfo.total6Days += 1;
            retRoleALLInfo.roleSubInfo.rechargeInfo.today6IsPaid = true;
            retMsg.roleRechargeInfo = retRoleALLInfo.roleSubInfo.rechargeInfo;
        }

        if (shop_table.price > 0) {
            retRoleALLInfo.roleSubInfo.rechargeInfo.dailyAmounts += shop_table.price;
            retRoleALLInfo.roleSubInfo.rechargeInfo.totalAmounts += shop_table.price;
            retMsg.roleRechargeInfo = retRoleALLInfo.roleSubInfo.rechargeInfo;
        }

        //首次双倍
        let buyItemTag = retRoleALLInfo.roleSubInfo.buyItemTag;
        let is_double = 1;
        if (shop_table.double) {
            if (!buyItemTag.doubleTag || !buyItemTag.doubleTag[shop_table.id] || buyItemTag.doubleTag[shop_table.id] <= 0) {
                is_double = 2;
            }
        }


        //添加每日购买限制
        let is_newtag = this.addBuyItemtag(retRoleALLInfo.roleSubInfo, shop_table, 1);

        //发放道具奖励
        if (shop_table.drop && shop_table.drop.length > 0) {
            let dropDataEntity = await cGameCommon.addItemByDrop(roleKeyDto, shop_table.drop, this.gameDataService, is_double);
            cGameCommon.hanleDropMsg(dropDataEntity, retMsg);
        }

        if (is_diy) {
            let dropDataEntity2 = await cGameCommon.addItem(roleKeyDto, select_item, this.gameDataService, 1);
            cGameCommon.hanleDropMsg(dropDataEntity2, retMsg);
        }

        //添加状态
        if (shop_table.addstatus > 0) {
            cGameCommon.addStatus(retRoleALLInfo.roleInfo, shop_table.addstatus);
            retMsg.status = retRoleALLInfo.roleSubInfo.status;
            if (TableStatus.checkHave(shop_table.addstatus)) {
                let tableStatus = new TableStatus(shop_table.addstatus);
                if (tableStatus.privilege && tableStatus.privilege.length > 0) {
                    retMsg.privilege = retRoleALLInfo.roleSubInfo.privilege;
                }
            }
        }

        await this.gameDataService.updateRoleInfo(roleKeyDto, retRoleALLInfo.roleInfo);

        if (is_newtag || is_double > 1) {
            retMsg.buyItemTag = retRoleALLInfo.roleSubInfo.buyItemTag;
        }
        retMsg.ts_buy_shopid = payBuyItemDto.shopid;
        languageConfig.setActTypeSuccess(EActType.SHOP_PAY_BUY_ITEM, retMsg);
        return retMsg;
    }

    /**
     * 获取月卡每日奖励
     * @param req 
     * @param getMonthCardAwardDto 
     * @returns 
     */
    async getMonthCardAward(@Request() req: any, @Body() getMonthCardAwardDto: GetMonthCardAwardDto) {

        let roleKeyDto: RoleKeyDto = { id: req.user.id, serverid: req.user.serverid };

        let retMsg: RESGetMonthCardAwardMsg = new RESGetMonthCardAwardMsg();


        let getRoleALLInfoDto = new GetRoleALLInfoDto(roleKeyDto);
        getRoleALLInfoDto.need_roleInfo = true;

        //获取角色信息
        let retRoleALLInfo: RetRoleALLInfo = await this.gameDataService.getRoleAllInfo(getRoleALLInfoDto);
        if (!retRoleALLInfo.isHaveData()) {
            retMsg.msg = retRoleALLInfo.getRetMsg();
            return retMsg;
        }

        //系统是否开放
        if (!cGameCommon.isOpenSystem(retRoleALLInfo, TableGameSys.recharge_month_card)) {
            retMsg.msg = languageConfig.tip.not_open_system;
            return retMsg;
        }

        //是否已经购买月卡
        if (!cGameCommon.isHaveStatus(retRoleALLInfo.roleInfo, TableStatus.month_card)) {
            retMsg.msg = "没有购买" + TableGameSys.getVal(TableGameSys.recharge_month_card, TableGameSys.field_name);;
            return retMsg;
        }

        //今日是否已领取
        if (retRoleALLInfo.roleSubInfo.rechargeShop?.monsthCard_daily) {
            retMsg.msg = "今日奖励已领取";
            return retMsg;
        }

        //添加奖励道具
        let add_items = cGameCommon.getPrivilegeAddItem(retRoleALLInfo.roleInfo, TableGameSys.recharge_month_card);
        let dropDataEntity = await cGameCommon.addItem(roleKeyDto, add_items, this.gameDataService);
        cGameCommon.hanleDropMsg(dropDataEntity, retMsg);

        retRoleALLInfo.roleSubInfo.rechargeShop.monsthCard_daily = true;

        await this.gameDataService.updateRoleInfo(roleKeyDto, { info: retRoleALLInfo.roleSubInfo });

        languageConfig.setActTypeSuccess(EActType.MONTHCARD_GET_AWARD, retMsg);
        return retMsg;
    }

    /**
     * 领取等级基金奖励
     * @param req 
     * @param fundLevelGetAwardDto 
     */
    async fundLevelGetAward(@Request() req: any, @Body() fundLevelGetAwardDto: FundLevelGetAwardDto) {

        let roleKeyDto: RoleKeyDto = { id: req.user.id, serverid: req.user.serverid };
        let retMsg: RESFundLevelGetAwardMsg = new RESFundLevelGetAwardMsg();

        let getRoleALLInfoDto = new GetRoleALLInfoDto(roleKeyDto);
        getRoleALLInfoDto.need_roleInfo = true;

        //获取角色信息
        let retRoleALLInfo: RetRoleALLInfo = await this.gameDataService.getRoleAllInfo(getRoleALLInfoDto);
        if (!retRoleALLInfo.isHaveData()) {
            retMsg.msg = retRoleALLInfo.getRetMsg();
            return retMsg;
        }

        //系统是否开放
        if (!cGameCommon.isOpenSystem(retRoleALLInfo, TableGameSys.recharge_level_fund)) {
            retMsg.msg = languageConfig.tip.not_open_system;
            return retMsg;
        }

        //是否已购买等级基金
        let is_h_awards = false;
        if (cGameCommon.isHaveStatus(retRoleALLInfo.roleInfo, TableStatus.fund_level)) {
            // retMsg.msg = "没有购买" + TableGameSys.getVal(TableGameSys.recharge_level_fund, TableGameSys.field_name);
            // return retMsg;
            is_h_awards = true;
        }

        let rechargeShop = retRoleALLInfo.roleSubInfo.rechargeShop;
        let fundLevel_Lv = rechargeShop.fundLevel_Lv || 0;
        let fundLevel_HLv = rechargeShop.fundLevel_HLv || 0;

        let table_data = TableFundLevelAward.getTable();
        let last_needlv = fundLevel_Lv;
        let last_needHlv = fundLevel_HLv;
        let drops = [];
        for (const lvid in table_data) {
            if (Object.prototype.hasOwnProperty.call(table_data, lvid)) {
                const need_lv = Number(lvid)
                if (retRoleALLInfo.roleInfo.rolelevel < need_lv) { continue; }

                let cur_table_data = new TableFundLevelAward(Number(lvid));

                if (fundLevel_Lv < need_lv) {
                    last_needlv = need_lv;
                    drops = drops.concat(cur_table_data.drop);
                }

                if (is_h_awards && fundLevel_HLv < need_lv) {
                    last_needHlv = need_lv;
                    drops = drops.concat(cur_table_data.drop2);
                }

            }
        }

        retMsg.msg = "没有奖励可领取";
        if (drops.length === 0) {
            return retMsg;
        }

        //修改数据
        rechargeShop.fundLevel_Lv = last_needlv;
        retMsg.fundLevel_Lv = last_needlv;

        rechargeShop.fundLevel_HLv = last_needHlv;
        retMsg.fundLevel_HLv = last_needHlv;

        //发放道具奖励
        let dropDataEntity = await cGameCommon.addItemByDrop(roleKeyDto, drops, this.gameDataService);
        cGameCommon.hanleDropMsg(dropDataEntity, retMsg);

        //保存数据
        await this.gameDataService.updateRoleInfo(roleKeyDto, { info: retRoleALLInfo.roleSubInfo });

        languageConfig.setActTypeSuccess(EActType.FUND_LEVEL_GET_AWARD, retMsg);
        return retMsg;

    }

    /**
     * 领取锻造基金奖励
     * @param req 
     * @param fundEboxGetAwardDto 
     */
    async fundEboxGetAward(@Request() req: any, @Body() fundEboxGetAwardDto: FundEboxGetAwardDto) {

        let roleKeyDto: RoleKeyDto = { id: req.user.id, serverid: req.user.serverid };
        let retMsg: RESFundEboxGetAwardMsg = new RESFundEboxGetAwardMsg();

        let getRoleALLInfoDto = new GetRoleALLInfoDto(roleKeyDto);
        getRoleALLInfoDto.need_roleInfo = true;

        //获取角色信息
        let retRoleALLInfo: RetRoleALLInfo = await this.gameDataService.getRoleAllInfo(getRoleALLInfoDto);
        if (!retRoleALLInfo.isHaveData()) {
            retMsg.msg = retRoleALLInfo.getRetMsg();
            return retMsg;
        }

        //系统是否开放
        if (!cGameCommon.isOpenSystem(retRoleALLInfo, TableGameSys.recharge_ebox_fund)) {
            retMsg.msg = languageConfig.tip.not_open_system;
            return retMsg;
        }

        //是否已购买锻造基金
        let is_h_awards = false;
        if (cGameCommon.isHaveStatus(retRoleALLInfo.roleInfo, TableStatus.fund_ebox)) {
            // retMsg.msg = "没有购买" + TableGameSys.getVal(TableGameSys.recharge_ebox_fund, TableGameSys.field_name);
            // return retMsg;
            is_h_awards = true;
        }

        let rechargeShop = retRoleALLInfo.roleSubInfo.rechargeShop;
        let fundEbox_Lv = rechargeShop.fundEbox_Lv || 0;
        let fundEbox_HLv = rechargeShop.fundEbox_HLv || 0;

        let table_data = TableFundEboxAward.getTable();
        let last_needlv = fundEbox_Lv;
        let last_needHlv = fundEbox_HLv;
        let drops = [];
        for (const lvid in table_data) {
            if (Object.prototype.hasOwnProperty.call(table_data, lvid)) {
                const need_lv = Number(lvid)
                if (retRoleALLInfo.roleSubInfo.ebox.lv < need_lv) { continue; }

                let cur_table_data = new TableFundEboxAward(Number(lvid));
                if (fundEbox_Lv < need_lv) {
                    last_needlv = need_lv;
                    drops = drops.concat(cur_table_data.drop);
                }

                if (is_h_awards && fundEbox_HLv < need_lv) {
                    last_needHlv = need_lv;
                    drops = drops.concat(cur_table_data.drop2);
                }
            }
        }

        if (drops.length === 0) {
            retMsg.msg = "没有奖励可领取";
            return retMsg;
        }

        //修改数据
        rechargeShop.fundEbox_Lv = last_needlv;
        retMsg.fundEbox_Lv = last_needlv;

        rechargeShop.fundEbox_HLv = last_needHlv;
        retMsg.fundEbox_HLv = last_needHlv;

        //发放道具奖励
        let dropDataEntity = await cGameCommon.addItemByDrop(roleKeyDto, drops, this.gameDataService);
        cGameCommon.hanleDropMsg(dropDataEntity, retMsg);

        //保存数据
        await this.gameDataService.updateRoleInfo(roleKeyDto, { info: retRoleALLInfo.roleSubInfo });

        languageConfig.setActTypeSuccess(EActType.FUND_EBOX_GET_AWARD, retMsg);
        return retMsg;
    }

    /**
     * 
     * @param req 
     * @param rechargeGiftDto 
     */
    async rechargeGift(@Request() req: any, @Body() rechargeGiftDto: RechargeGiftDto) {

        let roleKeyDto: RoleKeyDto = { id: req.user.id, serverid: req.user.serverid };
        let retMsg: RESRechargeGiftMsg = new RESRechargeGiftMsg();

        let getRoleALLInfoDto = new GetRoleALLInfoDto(roleKeyDto);
        getRoleALLInfoDto.need_roleInfo = true;

        //获取角色信息
        let retRoleALLInfo: RetRoleALLInfo = await this.gameDataService.getRoleAllInfo(getRoleALLInfoDto);
        if (!retRoleALLInfo.isHaveData()) {
            retMsg.msg = retRoleALLInfo.getRetMsg();
            return retMsg;
        }

        //系统是否开放
        if (!cGameCommon.isOpenSystem(retRoleALLInfo, TableGameSys.recharge_gift)) {
            retMsg.msg = languageConfig.tip.not_open_system;
            return retMsg;
        }

        let table_data = TableRechargeGift.getTable();

        let drops = [];
        let totalAmounts = 0;

        //临时方案 以后改成走商品表 商品表加累充字段判断
        if (TableGameConfig.recharge_gift_rest === 1) {
            totalAmounts = retRoleALLInfo.roleSubInfo.rechargeInfo.dailyAmounts || 0;
        }
        else {
            totalAmounts = retRoleALLInfo.roleSubInfo.rechargeInfo.totalAmounts || 0;
        }

        for (const amountsId in table_data) {
            if (Object.prototype.hasOwnProperty.call(table_data, amountsId)) {
                const need_amounts = Number(amountsId)
                if (totalAmounts < need_amounts) { continue; }

                if (retRoleALLInfo.roleSubInfo.rechargeGift && retRoleALLInfo.roleSubInfo.rechargeGift[need_amounts]) {
                    continue;
                }

                let cur_table_data = new TableRechargeGift(need_amounts);
                drops = drops.concat(cur_table_data.drop1);
                retRoleALLInfo.roleSubInfo.rechargeGift = retRoleALLInfo.roleSubInfo.rechargeGift || {}
                retRoleALLInfo.roleSubInfo.rechargeGift[need_amounts] = 1;
            }
        }

        if (drops.length === 0) {
            retMsg.msg = "没有奖励可领取";
            return retMsg;
        }

        //发放道具奖励
        let dropDataEntity = await cGameCommon.addItemByDrop(roleKeyDto, drops, this.gameDataService);
        cGameCommon.hanleDropMsg(dropDataEntity, retMsg);

        retMsg.rechargeGift = retRoleALLInfo.roleSubInfo.rechargeGift;
        //保存数据
        await this.gameDataService.updateRoleInfo(roleKeyDto, { info: retRoleALLInfo.roleSubInfo });

        languageConfig.setActTypeSuccess(EActType.RECHARGE_GIFT, retMsg);
        return retMsg;

    }

    /**
     * 获取终身卡每日奖励
     * @param req 
     * @param getMonthCardAwardDto 
     * @returns 
     */
    async getForeverCardAward(@Request() req: any, @Body() getMonthCardAwardDto: GetMonthCardAwardDto) {

        let roleKeyDto: RoleKeyDto = { id: req.user.id, serverid: req.user.serverid };

        let retMsg: RESGetMonthCardAwardMsg = new RESGetMonthCardAwardMsg();


        let getRoleALLInfoDto = new GetRoleALLInfoDto(roleKeyDto);
        getRoleALLInfoDto.need_roleInfo = true;

        //获取角色信息
        let retRoleALLInfo: RetRoleALLInfo = await this.gameDataService.getRoleAllInfo(getRoleALLInfoDto);
        if (!retRoleALLInfo.isHaveData()) {
            retMsg.msg = retRoleALLInfo.getRetMsg();
            return retMsg;
        }

        //系统是否开放
        if (!cGameCommon.isOpenSystem(retRoleALLInfo, TableGameSys.recharge_forever_card)) {
            retMsg.msg = languageConfig.tip.not_open_system;
            return retMsg;
        }

        //是否已经购买月卡
        if (!cGameCommon.isHaveStatus(retRoleALLInfo.roleInfo, TableStatus.forever_card)) {
            retMsg.msg = "没有购买" + TableGameSys.getVal(TableGameSys.recharge_forever_card, TableGameSys.field_name);;
            return retMsg;
        }

        //今日是否已领取
        if (retRoleALLInfo.roleSubInfo.rechargeShop?.foreverCard_daily) {
            retMsg.msg = "今日奖励已领取";
            return retMsg;
        }

        //添加奖励道具
        let add_items = cGameCommon.getPrivilegeAddItem(retRoleALLInfo.roleInfo, TableGameSys.recharge_forever_card);
        let dropDataEntity = await cGameCommon.addItem(roleKeyDto, add_items, this.gameDataService);
        cGameCommon.hanleDropMsg(dropDataEntity, retMsg);

        retRoleALLInfo.roleSubInfo.rechargeShop.foreverCard_daily = true;

        await this.gameDataService.updateRoleInfo(roleKeyDto, { info: retRoleALLInfo.roleSubInfo });

        languageConfig.setActTypeSuccess(EActType.FOREVERCARD_GET_AWARD, retMsg);
        return retMsg;
    }

}
