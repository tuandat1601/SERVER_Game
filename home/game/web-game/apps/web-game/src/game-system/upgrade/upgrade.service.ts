import { Injectable } from '@nestjs/common';
import { EActType, EFightResults, EFightType, ETaskState } from '../../config/game-enum';
import { TableGameSys } from '../../config/gameTable/TableGameSys';
import { TableRoleUpgrade } from '../../config/gameTable/TableRoleUpgrade';
import { languageConfig } from '../../config/language/language';
import { RESUpgradeMsg } from '../../game-data/entity/msg.entity';
import { RoleSubInfoEntity } from '../../game-data/entity/roleinfo.entity';
import { newTaskEntity } from '../../game-data/entity/task.entity';
import { GameDataService, GetRoleALLInfoDto } from '../../game-data/gamedata.service';
import { RoleKeyDto } from '../../game-data/role/dto/role-key.dto';
import { FightService } from '../fight/fight.service';
import { cGameCommon, RetRoleALLInfo } from '../game-common';
import { cTaskSystem } from '../task/task-sytem';
import { UpgradeDto } from './dto/upgrade.dto';

@Injectable()
export class UpgradeService {
  constructor(
    private readonly gameDataService: GameDataService,
    private readonly fightService: FightService,
  ) { }

  async goto(req: any, upgradeDto: UpgradeDto) {

    let roleKeyDto: RoleKeyDto = { id: req.user.id, serverid: req.user.serverid };

    let retMsg: RESUpgradeMsg = new RESUpgradeMsg();

    let getRoleALLInfoDto = new GetRoleALLInfoDto(roleKeyDto);
    getRoleALLInfoDto.need_roleInfo = true;
    getRoleALLInfoDto.need_roleHero = true;
    //获取角色信息
    let retRoleALLInfo: RetRoleALLInfo = await this.gameDataService.getRoleAllInfo(getRoleALLInfoDto);
    let SubInfo: RoleSubInfoEntity = retRoleALLInfo.roleInfo.info;
    let TabData = new TableRoleUpgrade(SubInfo.upgrade);
    if (!retRoleALLInfo.isHaveData()) {
      retMsg.msg = retRoleALLInfo.getRetMsg();
      return retMsg;
    }

    if (!cGameCommon.isOpenSystem(retRoleALLInfo, TableGameSys.upgrade)) {
      retMsg.msg = languageConfig.tip.not_open_system;
      return retMsg;//系统是否开放
    }

    if (!SubInfo.upgrade) {
      retMsg.msg = languageConfig.tip.error_system_data;
      return retMsg;//系统数据异常
    }

    if (SubInfo.upgrade >= Object.keys(TableRoleUpgrade.table).length) {
      retMsg.msg = '已满阶! ';
      return retMsg;
    }

    // if (TabData.open > retRoleALLInfo.roleInfo.rolelevel) {
    let taskok = cTaskSystem.taskUpgradeIsFinish(SubInfo.taskUpgrade);
    if (!taskok) {
      retMsg.msg = '进阶任务未完成';
      return retMsg;
    }
    let taskUpgrade = retRoleALLInfo.roleSubInfo.taskUpgrade
    for (let index = 0; index < taskUpgrade.length; index++) {
      const element = taskUpgrade[index];
      if(element.state != ETaskState.RECEIVED){
        retMsg.msg = '进阶任务未领取';
        return retMsg;
      }
      
    }
    languageConfig.setActTypeSuccess(EActType.UPGRADE, retMsg);
    //进行战斗
    let isok = await this.fightService.goFight(EFightType.UPGRADE, roleKeyDto, retRoleALLInfo.roleInfo, { levels: TabData.glid, pos: 0 }, retRoleALLInfo.roleHero, retMsg);
    if (!isok) { return retMsg; }

    if (retMsg.results !== EFightResults.WIN) {  //战斗输了
      retMsg.ok = true;
      retMsg.msg = '进阶失败';
      return retMsg;
    }

    SubInfo.upgrade++;
    retMsg.grade = SubInfo.upgrade;
    //进阶任务重置
    cTaskSystem.initTaskUpgrade(retRoleALLInfo);
    retMsg.newTask = new newTaskEntity();
    retMsg.newTask.newTaskUpgrade = retRoleALLInfo.roleSubInfo.taskUpgrade;
    await this.gameDataService.updateRoleInfo(roleKeyDto, retRoleALLInfo.roleInfo);


    return retMsg;

  }


}
