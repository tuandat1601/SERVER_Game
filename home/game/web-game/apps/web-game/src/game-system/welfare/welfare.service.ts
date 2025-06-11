import { Body, Injectable, Request } from '@nestjs/common';
import { EActType } from '../../config/game-enum';
import { TableGameConfig } from '../../config/gameTable/TableGameConfig';
import { TableGameSys } from '../../config/gameTable/TableGameSys';
import { TableWelfareDailyAward } from '../../config/gameTable/TableWelfareDailyAward';
import { TableWelfareLevelAward } from '../../config/gameTable/TableWelfareLevelAward';
import { TableWelfarePaidDaysAward } from '../../config/gameTable/TableWelfarePaidDaysAward';
import { languageConfig } from '../../config/language/language';
import { RESGetWelFareDailyAwardMsg, RESGetWelFareLevelAwardMsg, RESGetWelFarePaidDaysAwardMsg } from '../../game-data/entity/msg.entity';
import { GameDataService, GetRoleALLInfoDto } from '../../game-data/gamedata.service';
import { RoleKeyDto } from '../../game-data/role/dto/role-key.dto';
import { EquipService } from '../equip/equip.service';
import { cGameCommon, RetRoleALLInfo } from '../game-common';
import { GetWelFareDailyAwardDto, GetWelFareLevelAwardDto, GetWelFarePaidDaysAwardDto } from './dto/welfare.dto';

@Injectable()
export class WelfareService {

    constructor(
        private readonly gameDataService: GameDataService,
    ) {
    }

    async getWelFareDailyAward(@Request() req: any, @Body() getWelFareDailyAwardDto: GetWelFareDailyAwardDto) {

        let roleKeyDto: RoleKeyDto = { id: req.user.id, serverid: req.user.serverid };

        let retMsg: RESGetWelFareDailyAwardMsg = new RESGetWelFareDailyAwardMsg();

        let getRoleALLInfoDto = new GetRoleALLInfoDto(roleKeyDto);
        getRoleALLInfoDto.need_roleInfo = true;
        //获取角色信息
        let retRoleALLInfo: RetRoleALLInfo = await this.gameDataService.getRoleAllInfo(getRoleALLInfoDto);
        if (!retRoleALLInfo.isHaveData()) {
            retMsg.msg = retRoleALLInfo.getRetMsg();
            return retMsg;
        }
        //系统是否开放
        if (!cGameCommon.isOpenSystem(retRoleALLInfo, TableGameSys.welfare_daily)) {
            retMsg.msg = languageConfig.tip.not_open_system;
            return retMsg;
        }

        let roleSubInfo = retRoleALLInfo.roleSubInfo;
        if (!roleSubInfo.welfareDaily) {
            retMsg.msg = languageConfig.tip.error_system_data;
            return retMsg;
        }

        let welfareDaily = retRoleALLInfo.roleSubInfo.welfareDaily;
        if (welfareDaily.todayReceived) {
            retMsg.msg = "今日已领取";
            return retMsg;
        }

        let table_data = TableWelfareDailyAward.getTable()
        if (welfareDaily.receivedDays >= Object.keys(table_data).length) {
            retMsg.msg = "领取天数已超过活动上限";
            return retMsg;
        }

        //修改数据
        welfareDaily.todayReceived = true;
        welfareDaily.receivedDays += 1;
        retMsg.welfareDaily = welfareDaily;
        let cur_data = new TableWelfareDailyAward(welfareDaily.receivedDays);
        //发放道具奖励
        let dropDataEntity = await cGameCommon.addItemByDrop(roleKeyDto, cur_data.drop, this.gameDataService);
        cGameCommon.hanleDropMsg(dropDataEntity, retMsg);

        //保存数据
        await this.gameDataService.updateRoleInfo(roleKeyDto, retRoleALLInfo.roleInfo);

        languageConfig.setActTypeSuccess(EActType.WELFARE_DAILY_AWARD, retMsg);
        return retMsg;
    }

    async getWelFareLevelAward(@Request() req: any, @Body() getWelFareLevelAwardDto: GetWelFareLevelAwardDto) {

        let roleKeyDto: RoleKeyDto = { id: req.user.id, serverid: req.user.serverid };

        let retMsg: RESGetWelFareLevelAwardMsg = new RESGetWelFareLevelAwardMsg();

        let getRoleALLInfoDto = new GetRoleALLInfoDto(roleKeyDto);
        getRoleALLInfoDto.need_roleInfo = true;

        //获取角色信息
        let retRoleALLInfo: RetRoleALLInfo = await this.gameDataService.getRoleAllInfo(getRoleALLInfoDto);
        if (!retRoleALLInfo.isHaveData()) {
            retMsg.msg = retRoleALLInfo.getRetMsg();
            return retMsg;
        }
        //系统是否开放
        if (!cGameCommon.isOpenSystem(retRoleALLInfo, TableGameSys.welfare_level)) {
            retMsg.msg = languageConfig.tip.not_open_system;
            return retMsg;
        }

        let roleSubInfo = retRoleALLInfo.roleSubInfo;
        if (roleSubInfo.welfareLevel === undefined) {
            retMsg.msg = languageConfig.tip.error_system_data;
            return retMsg;
        }

        let welfareLevel = retRoleALLInfo.roleSubInfo.welfareLevel;

        let table_data = TableWelfareLevelAward.getTable();
        let last_needlv = welfareLevel;
        let drops = [];
        for (const lvid in table_data) {
            if (Object.prototype.hasOwnProperty.call(table_data, lvid)) {
                const need_lv = Number(lvid)
                if (welfareLevel >= need_lv) { continue; }
                if (retRoleALLInfo.roleInfo.rolelevel < need_lv) { continue; }
                last_needlv = need_lv;
                drops = drops.concat(table_data[lvid].drop);
            }
        }

        if (drops.length === 0) {
            retMsg.msg = "没有奖励可领取";
            return retMsg;
        }

        //修改数据
        retRoleALLInfo.roleSubInfo.welfareLevel = last_needlv;
        retMsg.welfareLevel = last_needlv;

        //发放道具奖励
        let dropDataEntity = await cGameCommon.addItemByDrop(roleKeyDto, drops, this.gameDataService);
        cGameCommon.hanleDropMsg(dropDataEntity, retMsg);

        //保存数据
        await this.gameDataService.updateRoleInfo(roleKeyDto, retRoleALLInfo.roleInfo);

        languageConfig.setActTypeSuccess(EActType.WELFARE_LEVEL_AWARD, retMsg);
        return retMsg;
    }

    async getWelFarePaidDaysAward(@Request() req: any, @Body() getWelFarePaidDaysAwardDto: GetWelFarePaidDaysAwardDto) {

        let roleKeyDto: RoleKeyDto = { id: req.user.id, serverid: req.user.serverid };

        let retMsg: RESGetWelFarePaidDaysAwardMsg = new RESGetWelFarePaidDaysAwardMsg();

        let getRoleALLInfoDto = new GetRoleALLInfoDto(roleKeyDto);
        getRoleALLInfoDto.need_roleInfo = true;

        //获取角色信息
        let retRoleALLInfo: RetRoleALLInfo = await this.gameDataService.getRoleAllInfo(getRoleALLInfoDto);
        if (!retRoleALLInfo.isHaveData()) {
            retMsg.msg = retRoleALLInfo.getRetMsg();
            return retMsg;
        }
        //系统是否开放
        if (!cGameCommon.isOpenSystem(retRoleALLInfo, TableGameSys.welfare_paid_days)) {
            retMsg.msg = languageConfig.tip.not_open_system;
            return retMsg;
        }

        let roleSubInfo = retRoleALLInfo.roleSubInfo;
        if (roleSubInfo.welfarePaidDaily === undefined) {
            retMsg.msg = languageConfig.tip.error_system_data;
            return retMsg;
        }

        let welfarePaidDaily = retRoleALLInfo.roleSubInfo.welfarePaidDaily;
        if (getWelFarePaidDaysAwardDto.isDaily && welfarePaidDaily.dailyReceived) {
            retMsg.msg = "奖励已经领取过了";
            return retMsg;
        }

        let drops = [];
        let cur_act_type = EActType.WELFARE_PAID_DAYS_AWARD;
        if (getWelFarePaidDaysAwardDto.isDaily) {
            cur_act_type = EActType.WELFARE_PD_DAILY_AWARD;
            drops.push(TableGameConfig.init_welfare_paiddays);
            welfarePaidDaily.dailyReceived = true;
        }
        else {

            let receivedPaidDays = welfarePaidDaily.receivedPaidDays;
            let table_data = TableWelfarePaidDaysAward.getTable();
            let last_needDays = receivedPaidDays;

            for (const days in table_data) {
                if (Object.prototype.hasOwnProperty.call(table_data, days)) {
                    const need_days = Number(days)
                    if (receivedPaidDays >= need_days) { continue; }
                    if (retRoleALLInfo.roleSubInfo.rechargeInfo.total6Days < need_days) { continue; }
                    last_needDays = need_days;
                    drops = drops.concat(table_data[days].drop);
                }
            }

            retRoleALLInfo.roleSubInfo.welfarePaidDaily.receivedPaidDays = last_needDays;
        }


        if (drops.length === 0) {
            retMsg.msg = "没有奖励可领取";
            return retMsg;
        }

        //修改数据     
        retMsg.welfarePaidDays = retRoleALLInfo.roleSubInfo.welfarePaidDaily;

        //发放道具奖励
        let dropDataEntity = await cGameCommon.addItemByDrop(roleKeyDto, drops, this.gameDataService);
        cGameCommon.hanleDropMsg(dropDataEntity, retMsg);

        //保存数据
        await this.gameDataService.updateRoleInfo(roleKeyDto, retRoleALLInfo.roleInfo);

        languageConfig.setActTypeSuccess(cur_act_type, retMsg);
        return retMsg;
    }

}
