import { Body, Injectable, Request } from '@nestjs/common';
import { EActType } from '../../config/game-enum';
import { TableGameConfig } from '../../config/gameTable/TableGameConfig';
import { TableGameSys } from '../../config/gameTable/TableGameSys';
import { cGameCommon, RetRoleALLInfo } from '../game-common';
import { RoleKeyDto } from '../../game-data/role/dto/role-key.dto';
import { cItemBag } from '../item/item-bag';
import { languageConfig } from '../../config/language/language';
import { clone, cloneDeep } from 'lodash';
import { cTools } from '../../game-lib/tools';
import { GameDataService, GetRoleALLInfoDto } from '../../game-data/gamedata.service';
import { CQEntity, RoleInfoEntity } from '../../game-data/entity/roleinfo.entity';

import {CQLevelUpDTO} from './dto/cq.dto';
import {RESCQLevelUpMsg} from '../../game-data/entity/msg.entity';
import { Tablecaiquan } from '../../config/gameTable/Tablecaiquan';

@Injectable()
export class CQService {
    constructor(private readonly gameDataService: GameDataService,) {}

    async levelup(@Request() req: any, @Body() dto: CQLevelUpDTO) {
        let roleKeyDto: RoleKeyDto = { id: req.user.id, serverid: req.user.serverid };
        let retMsg = new RESCQLevelUpMsg();
        let getRoleALLInfoDto = new GetRoleALLInfoDto(roleKeyDto);
        getRoleALLInfoDto.need_roleInfo = true;
        getRoleALLInfoDto.need_roleItem = true;
        let retRoleALLInfo: RetRoleALLInfo = await this.gameDataService.getRoleAllInfo(getRoleALLInfoDto);
        if (!retRoleALLInfo.isHaveData()) {
            retMsg.msg = retRoleALLInfo.getRetMsg();
            return retMsg;
        }
        //系统是否开放
        if (!cGameCommon.isOpenSystem(retRoleALLInfo, TableGameSys.cq)) {
            retMsg.msg = languageConfig.tip.not_open_system;
            return retMsg;
        }
        let cq = retRoleALLInfo.roleInfo.info.cq;
        let lv = cq.lv[dto.id] + 1;
        if(!Tablecaiquan.checkHave(dto.id, lv)){
            retMsg.msg = "已经升到最高等级了";
            return retMsg;
        }
        let data = new Tablecaiquan(dto.id, lv);
        let roleItem = retRoleALLInfo.roleItem;
        cItemBag.costItem(roleItem, data.costitem, retMsg);
        if (!retMsg.ok) {return retMsg;}
        cq.lv[dto.id] = lv;
        retMsg.id = dto.id;
        retMsg.cq = cq;
        await this.gameDataService.updateRoleItem(roleKeyDto, roleItem);
        await this.gameDataService.updateRoleInfo(roleKeyDto, retRoleALLInfo.roleInfo);
        languageConfig.setActTypeSuccess(EActType.CQ_UP, retMsg);
        return retMsg;
  	}
}
