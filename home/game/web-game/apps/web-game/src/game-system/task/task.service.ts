import { Body, Injectable, Request } from '@nestjs/common';
import { EActType, ETaskState, ETaskType } from '../../config/game-enum';
import { TableGameConfig } from '../../config/gameTable/TableGameConfig';
import { TableGameSys } from '../../config/gameTable/TableGameSys';
import { TableGuildTaskAward } from '../../config/gameTable/TableGuildTaskAward';
import { TableOpenWelfareAward } from '../../config/gameTable/TableOpenWelfareAward';
import { TableTask } from '../../config/gameTable/TableTask';
import { TableTaskDailyAward } from '../../config/gameTable/TableTaskDailyAward';
import { languageConfig } from '../../config/language/language';
import { RoleAddExp } from '../../game-data/entity/common.entity';
import { GuildEntity } from '../../game-data/entity/guild.entity';
import { HerosRecord } from '../../game-data/entity/hero.entity';
import { ItemsRecord } from '../../game-data/entity/item.entity';
import { RESGetOpenWelfareAwardMsg, RESGetTaskAwardMsg, RESGetTaskDailyAwardMsg, RESGetTaskDailyBoxAwardMsg, RESGetTaskGradeAwardMsg, RESGetTaskMainAwardMsg, RESGuildLivenessAwardMsg, RESGuildTaskAwardMsg } from '../../game-data/entity/msg.entity';
import { RoleInfoEntity, RoleSubInfoEntity } from '../../game-data/entity/roleinfo.entity';
import { TaskEntity } from '../../game-data/entity/task.entity';
import { GameDataService, getGuildInfoHmKey, GetRoleALLInfoDto } from '../../game-data/gamedata.service';
import { RoleKeyDto } from '../../game-data/role/dto/role-key.dto';
import { cGameCommon, RetRoleALLInfo } from '../game-common';
import { syshero } from '../hero/hero-lvup';
import { GetGuildLivenessAwardDto, GetOpenWelfareAwardDto, GetTaskAwardDto, GetTaskDailyAwardDto, GetTaskDailyBoxAwardDto, GetTaskGradeAwardDto, GetTaskMainAwardDto } from './dto/task.dto';
import { cTaskSystem } from './task-sytem';

@Injectable()
export class TaskService {

  constructor(
    private readonly gameDataService: GameDataService,
  ) {

  }

  /**
   * 获取主线任务奖励
   * @param req 
   * @param getTaskMainAwardDto 
   * @returns 
   */
  async getTaskMainAward(@Request() req: any, @Body() getTaskMainAwardDto: GetTaskMainAwardDto) {

    let roleKeyDto: RoleKeyDto = { id: req.user.id, serverid: req.user.serverid };
    let reMsg: RESGetTaskMainAwardMsg = new RESGetTaskMainAwardMsg();

    let getRoleALLInfoDto = new GetRoleALLInfoDto(roleKeyDto);
    getRoleALLInfoDto.need_roleInfo = true;
    getRoleALLInfoDto.need_roleHero = true;
    //获取角色信息
    let retRoleALLInfo: RetRoleALLInfo = await this.gameDataService.getRoleAllInfo(getRoleALLInfoDto);
    if (!retRoleALLInfo.isHaveData()) {
      reMsg.msg = retRoleALLInfo.getRetMsg();
      return reMsg;
    }


    if (!cGameCommon.isOpenSystem(retRoleALLInfo, TableGameSys.task_main)) {
      reMsg.msg = `系统暂未开放`;
      return reMsg;
    }

    let curTask = retRoleALLInfo.roleSubInfo.taskMain
    // if (getTaskMainAwardDto.type == ETaskType.LEVEL) {
    //   curTask = retRoleALLInfo.roleSubInfo.TaskLevel;
    // }
    if (!curTask) {
      reMsg.msg = `任务数据异常`;
      return reMsg;
    }

    if (!curTask.curEntity) {
      reMsg.msg = `当前没有可执行的任务`;
      return reMsg;
    }

    let cur_main_taskEntity = curTask.curEntity;
    let finish_task_id = cur_main_taskEntity.id;
    if (!TableTask.checkHave(finish_task_id)) {
      reMsg.msg = `任务表数据异常 id:${finish_task_id}`;
      return reMsg;
    }

    if (!cTaskSystem.taskIsFinish(cur_main_taskEntity)) {
      reMsg.msg = `任务没有完成`;
      return reMsg;
    }

    if (cur_main_taskEntity.state !== ETaskState.NOT_RECEIVE) {
      reMsg.msg = `奖励已领取`;
      return reMsg;
    }

    let finish_task_entity = new TableTask(finish_task_id);
    //更换已经完成的最后主线任务ID
    curTask.lastId = finish_task_id;
    //下一个任务
    delete curTask.curEntity;
    if (finish_task_entity.nextid > 0) {
      curTask.curEntity = cTaskSystem.newTaskEntity(finish_task_entity.nextid, retRoleALLInfo);
    }

    //道具奖励
    if (finish_task_entity.drop && finish_task_entity.drop.length > 0) {
      let dropDataEntity = await cGameCommon.addItemByDrop(roleKeyDto, finish_task_entity.drop, this.gameDataService);
      cGameCommon.hanleDropMsg(dropDataEntity, reMsg);
    }

    //经验奖励
    if (finish_task_entity.exp && finish_task_entity.exp > 0) {
      reMsg.roleAddExp = syshero.leadheroAddExp(retRoleALLInfo, retRoleALLInfo.roleHero, finish_task_entity.exp);

      if (reMsg.roleAddExp?.newHero || reMsg.roleAddExp?.newActiveHeros) {
        await this.gameDataService.updateRoleHero(roleKeyDto, retRoleALLInfo.roleHero);
      }
    }
    if (reMsg.roleAddExp?.newSystem === undefined) {
      reMsg.roleAddExp = reMsg.roleAddExp || new RoleAddExp()
      reMsg.roleAddExp.newSystem = cGameCommon.checkOpenNewSystem(retRoleALLInfo);
    }
    await this.gameDataService.updateRoleInfo(roleKeyDto, retRoleALLInfo.roleInfo);


    reMsg.ok = true;
    reMsg.srctype = (getTaskMainAwardDto.type == ETaskType.LEVEL) ? EActType.TASK_LEVEL_GETAWARD : EActType.TASK_MAIN_GETAWARD;
    reMsg.msg = languageConfig.actTypeSuccess(reMsg.srctype);
    reMsg.newTask = {};
    if (getTaskMainAwardDto.type == ETaskType.LEVEL) {
      reMsg.newTask.newTaskLevel = curTask;
    } else {
      reMsg.newTask.newTaskMain = curTask;
    }
    return reMsg;
  }


  /**
   * 领取每日任务奖励
   * @param req 
   * @param getTaskDailyAwardDto 
   * @returns 
   */
  async getTaskDailyAward(@Request() req: any, @Body() getTaskDailyAwardDto: GetTaskDailyAwardDto) {

    let roleKeyDto: RoleKeyDto = { id: req.user.id, serverid: req.user.serverid };

    let reMsg: RESGetTaskDailyAwardMsg = new RESGetTaskDailyAwardMsg();

    let getRoleALLInfoDto = new GetRoleALLInfoDto(roleKeyDto);
    getRoleALLInfoDto.need_roleInfo = true;
    getRoleALLInfoDto.need_roleHero = true;
    //获取角色信息
    let retRoleALLInfo: RetRoleALLInfo = await this.gameDataService.getRoleAllInfo(getRoleALLInfoDto);
    if (!retRoleALLInfo.isHaveData()) {
      reMsg.msg = retRoleALLInfo.getRetMsg();
      return reMsg;
    }

    if (!cGameCommon.isOpenSystem(retRoleALLInfo, TableGameSys.task_daily)) {
      reMsg.msg = `系统暂未开放`;
      return reMsg;
    }


    if (!retRoleALLInfo.roleSubInfo.taskDaily || !retRoleALLInfo.roleSubInfo.taskDaily.tasklist) {
      reMsg.msg = `taskDaily is null`;
      return reMsg;
    }

    if (!retRoleALLInfo.roleSubInfo.taskDaily.tasklist[getTaskDailyAwardDto.id]) {
      reMsg.msg = `该任务不存在`;
      return reMsg;
    }

    let cur_taskEntity: TaskEntity = retRoleALLInfo.roleSubInfo.taskDaily.tasklist[getTaskDailyAwardDto.id];
    if (!TableTask.checkHave(cur_taskEntity.id)) {
      reMsg.msg = `任务表数据异常 id:${cur_taskEntity.id}`;
      return reMsg;
    }

    if (!cTaskSystem.taskIsFinish(cur_taskEntity)) {
      reMsg.msg = `任务没有完成`;
      return reMsg;
    }

    if (cur_taskEntity.state !== ETaskState.NOT_RECEIVE) {
      reMsg.msg = `奖励已领取`;
      return reMsg;
    }

    let finish_task_entity = new TableTask(cur_taskEntity.id);
    //道具奖励
    if (finish_task_entity.drop && finish_task_entity.drop.length > 0) {
      let dropDataEntity = await cGameCommon.addItemByDrop(roleKeyDto, finish_task_entity.drop, this.gameDataService);
      cGameCommon.hanleDropMsg(dropDataEntity, reMsg);
    }

    //经验奖励
    if (finish_task_entity.exp && finish_task_entity.exp > 0) {
      reMsg.roleAddExp = syshero.leadheroAddExp(retRoleALLInfo, retRoleALLInfo.roleHero, finish_task_entity.exp);

      if (reMsg.roleAddExp?.newHero || reMsg.roleAddExp?.newActiveHeros) {
        await this.gameDataService.updateRoleHero(roleKeyDto, retRoleALLInfo.roleHero);
      }
    }
    cur_taskEntity.state = ETaskState.RECEIVED;
    await this.gameDataService.updateRoleInfo(roleKeyDto, retRoleALLInfo.roleInfo);

    languageConfig.setActTypeSuccess(EActType.TASK_DAILY_GETAWARD, reMsg);
    reMsg.newTask = {};
    reMsg.newTask.newTaskDaily = retRoleALLInfo.roleSubInfo.taskDaily;
    return reMsg;
  }

  async getTaskDailyBoxAward(@Request() req: any, @Body() getTaskDailyBoxAwardDto: GetTaskDailyBoxAwardDto) {
    let roleKeyDto: RoleKeyDto = { id: req.user.id, serverid: req.user.serverid };

    let reMsg: RESGetTaskDailyBoxAwardMsg = new RESGetTaskDailyBoxAwardMsg();

    let getRoleALLInfoDto = new GetRoleALLInfoDto(roleKeyDto);
    getRoleALLInfoDto.need_roleInfo = true;
    getRoleALLInfoDto.need_roleHero = true;
    getRoleALLInfoDto.need_roleItem = true;
    //获取角色信息
    let retRoleALLInfo: RetRoleALLInfo = await this.gameDataService.getRoleAllInfo(getRoleALLInfoDto);
    if (!retRoleALLInfo.isHaveData()) {
      reMsg.msg = retRoleALLInfo.getRetMsg();
      return reMsg;
    }


    if (!cGameCommon.isOpenSystem(retRoleALLInfo, TableGameSys.task_daily)) {
      reMsg.msg = `系统暂未开放`;
      return reMsg;
    }

    //获取道具数据
    let roleIemBag: ItemsRecord = retRoleALLInfo.roleItem;

    let daily_box_award = TableTaskDailyAward.getTable();
    let drops = [];
    let last_id = 0;
    let total_exp = 0;
    const cost_itemid = TableGameConfig.var_taskdaily_point;
    for (const id in daily_box_award) {
      if (Object.prototype.hasOwnProperty.call(daily_box_award, id)) {
        let cur_id = Number(id);
        let cur_tabel = new TableTaskDailyAward(cur_id);

        if (retRoleALLInfo.roleSubInfo.taskDaily.received >= cur_tabel.id) { continue; }
        const cost_num = Number(cur_tabel.cost);

        if (!roleIemBag[cost_itemid] || roleIemBag[cost_itemid] < cost_num) { continue; }

        //每日充值的时候重置为0
        //roleIemBag[cost_itemid] -= cost_num;

        drops = drops.concat(cur_tabel.drop);
        last_id = cur_id;
        total_exp += cur_tabel.exp;
      }
    }

    if (drops.length == 0) {
      reMsg.msg = `没有可领取的奖励`;
      return reMsg;
    }

    retRoleALLInfo.roleSubInfo.taskDaily.received = last_id;

    //先保存已经处理的道具
    //await this.gameDataService.updateRoleItem(roleKeyDto, roleIemBag);

    //道具奖励
    let dropDataEntity = await cGameCommon.addItemByDrop(roleKeyDto, drops, this.gameDataService);
    cGameCommon.hanleDropMsg(dropDataEntity, reMsg);

    //经验奖励
    if (total_exp > 0) {
      reMsg.roleAddExp = syshero.leadheroAddExp(retRoleALLInfo, retRoleALLInfo.roleHero, total_exp);

      if (reMsg.roleAddExp?.newHero || reMsg.roleAddExp?.newActiveHeros) {
        await this.gameDataService.updateRoleHero(roleKeyDto, retRoleALLInfo.roleHero);
      }
    }

    await this.gameDataService.updateRoleInfo(roleKeyDto, retRoleALLInfo.roleInfo);

    languageConfig.setActTypeSuccess(EActType.TASK_DAILYBOX_GETAWARD, reMsg);
    reMsg.newTask = {};
    reMsg.newTask.newTaskDaily = retRoleALLInfo.roleSubInfo.taskDaily;
    return reMsg;
  }

  /**
   * 领取进阶任务奖励
   * @param req 
   * @param getTaskGradeAwardDto 
   */
  async getTaskGradeAward(req: any, getTaskGradeAwardDto: GetTaskGradeAwardDto) {
    let roleKeyDto: RoleKeyDto = { id: req.user.id, serverid: req.user.serverid };
    let reMsg: RESGetTaskGradeAwardMsg = new RESGetTaskGradeAwardMsg();

    let getRoleALLInfoDto = new GetRoleALLInfoDto(roleKeyDto);
    getRoleALLInfoDto.need_roleInfo = true;
    getRoleALLInfoDto.need_roleHero = true;
    //获取角色信息
    let retRoleALLInfo: RetRoleALLInfo = await this.gameDataService.getRoleAllInfo(getRoleALLInfoDto);
    if (!retRoleALLInfo.isHaveData()) {
      reMsg.msg = retRoleALLInfo.getRetMsg();
      return reMsg;
    }

    if (!cGameCommon.isOpenSystem(retRoleALLInfo, TableGameSys.upgrade)) {
      reMsg.msg = `系统暂未开放`;
      return reMsg;
    }

    if (!retRoleALLInfo.roleSubInfo.taskUpgrade) {
      reMsg.msg = `taskUpgrade is null`;
      return reMsg;
    }

    let cur_taskEntity: TaskEntity;
    for (let index = 0; index < retRoleALLInfo.roleSubInfo.taskUpgrade.length; index++) {
      const element = retRoleALLInfo.roleSubInfo.taskUpgrade[index];
      if (element.id == getTaskGradeAwardDto.id) {
        cur_taskEntity = element
      }
    }
    if (!cur_taskEntity) {
      reMsg.msg = `进阶任务数据异常`;
      return reMsg;
    }
    let finish_task_id = cur_taskEntity.id;
    if (!TableTask.checkHave(finish_task_id)) {
      reMsg.msg = `任务表数据异常 id:${finish_task_id}`;
      return reMsg;
    }

    if (!cTaskSystem.taskIsFinish(cur_taskEntity)) {
      reMsg.msg = `任务没有完成`;
      return reMsg;
    }

    if (cur_taskEntity.state !== ETaskState.NOT_RECEIVE) {
      reMsg.msg = `奖励已领取`;
      return reMsg;
    }

    let finish_task_entity = new TableTask(finish_task_id);

    //道具奖励
    if (finish_task_entity.drop && finish_task_entity.drop.length > 0) {
      let dropDataEntity = await cGameCommon.addItemByDrop(roleKeyDto, finish_task_entity.drop, this.gameDataService);
      cGameCommon.hanleDropMsg(dropDataEntity, reMsg);
    }

    //经验奖励
    if (finish_task_entity.exp && finish_task_entity.exp > 0) {
      reMsg.roleAddExp = syshero.leadheroAddExp(retRoleALLInfo, retRoleALLInfo.roleHero, finish_task_entity.exp);

      if (reMsg.roleAddExp?.newHero || reMsg.roleAddExp?.newActiveHeros) {
        await this.gameDataService.updateRoleHero(roleKeyDto, retRoleALLInfo.roleHero);
      }
    }

    cur_taskEntity.state = ETaskState.RECEIVED;
    await this.gameDataService.updateRoleInfo(roleKeyDto, retRoleALLInfo.roleInfo);
    languageConfig.setActTypeSuccess(EActType.TASK_UPGRADE_GETAWARD, reMsg);
    reMsg.newTask = {};
    reMsg.newTask.newTaskUpgrade = retRoleALLInfo.roleSubInfo.taskUpgrade;
    return reMsg;
  }


  /**
   * 领取开服福利任务奖励
   * @param req 
   * @param getTaskAwardDto 
   * @returns 
   */
  async getTaskOpenWelfareAward(@Request() req: any, @Body() getTaskAwardDto: GetTaskAwardDto) {

    let roleKeyDto: RoleKeyDto = { id: req.user.id, serverid: req.user.serverid };

    let reMsg: RESGetTaskAwardMsg = new RESGetTaskAwardMsg();

    let getRoleALLInfoDto = new GetRoleALLInfoDto(roleKeyDto);
    getRoleALLInfoDto.need_roleInfo = true;
    getRoleALLInfoDto.need_roleHero = true;
    //获取角色信息
    let retRoleALLInfo: RetRoleALLInfo = await this.gameDataService.getRoleAllInfo(getRoleALLInfoDto);
    if (!retRoleALLInfo.isHaveData()) {
      reMsg.msg = retRoleALLInfo.getRetMsg();
      return reMsg;
    }

    if (!cGameCommon.isOpenSystem(retRoleALLInfo, TableGameSys.open_server_welfare)) {
      reMsg.msg = `系统暂未开放`;
      return reMsg;
    }


    if (!retRoleALLInfo.roleSubInfo.openWelfare || !retRoleALLInfo.roleSubInfo.openWelfare.tasklist) {
      reMsg.msg = `openWelfare is null`;
      return reMsg;
    }

    if (!retRoleALLInfo.roleSubInfo.openWelfare.tasklist[getTaskAwardDto.id]) {
      reMsg.msg = `该任务不存在`;
      return reMsg;
    }

    let cur_taskEntity: TaskEntity = retRoleALLInfo.roleSubInfo.openWelfare.tasklist[getTaskAwardDto.id];
    if (!TableTask.checkHave(cur_taskEntity.id)) {
      reMsg.msg = `任务表数据异常 id:${cur_taskEntity.id}`;
      return reMsg;
    }

    if (!cTaskSystem.taskIsFinish(cur_taskEntity)) {
      reMsg.msg = `任务没有完成`;
      return reMsg;
    }

    if (cur_taskEntity.state !== ETaskState.NOT_RECEIVE) {
      reMsg.msg = `奖励已领取`;
      return reMsg;
    }

    let finish_task_entity = new TableTask(cur_taskEntity.id);
    //道具奖励
    if (finish_task_entity.drop && finish_task_entity.drop.length > 0) {
      let dropDataEntity = await cGameCommon.addItemByDrop(roleKeyDto, finish_task_entity.drop, this.gameDataService);
      cGameCommon.hanleDropMsg(dropDataEntity, reMsg);
    }

    //经验奖励
    if (finish_task_entity.exp && finish_task_entity.exp > 0) {
      reMsg.roleAddExp = syshero.leadheroAddExp(retRoleALLInfo, retRoleALLInfo.roleHero, finish_task_entity.exp);

      if (reMsg.roleAddExp?.newHero || reMsg.roleAddExp?.newActiveHeros) {
        await this.gameDataService.updateRoleHero(roleKeyDto, retRoleALLInfo.roleHero);
      }
    }
    cur_taskEntity.state = ETaskState.RECEIVED;
    await this.gameDataService.updateRoleInfo(roleKeyDto, retRoleALLInfo.roleInfo);

    languageConfig.setActTypeSuccess(EActType.TASK_OPEN_WERFARE_GETAWARD, reMsg);
    reMsg.newTask = {};
    reMsg.newTask.newTaskOpenWelfare = retRoleALLInfo.roleSubInfo.openWelfare.tasklist;
    return reMsg;
  }

  /**
   * 领取开服福利积分奖励
   * @param req 
   * @param getOpenWelfareAwardDto 
   */
  async getOpenWelfarePointAward(@Request() req: any, @Body() getOpenWelfareAwardDto: GetOpenWelfareAwardDto) {
    let roleKeyDto: RoleKeyDto = { id: req.user.id, serverid: req.user.serverid };

    let reMsg: RESGetOpenWelfareAwardMsg = new RESGetOpenWelfareAwardMsg();

    let getRoleALLInfoDto = new GetRoleALLInfoDto(roleKeyDto);
    getRoleALLInfoDto.need_roleInfo = true;
    // getRoleALLInfoDto.need_roleHero = true;
    getRoleALLInfoDto.need_roleItem = true;
    //获取角色信息
    let retRoleALLInfo: RetRoleALLInfo = await this.gameDataService.getRoleAllInfo(getRoleALLInfoDto);
    if (!retRoleALLInfo.isHaveData()) {
      reMsg.msg = retRoleALLInfo.getRetMsg();
      return reMsg;
    }


    if (!cGameCommon.isOpenSystem(retRoleALLInfo, TableGameSys.open_server_welfare)) {
      reMsg.msg = `系统暂未开放`;
      return reMsg;
    }

    //获取道具数据
    let roleIemBag: ItemsRecord = retRoleALLInfo.roleItem;

    let table_award = TableOpenWelfareAward.getTable();
    let drops = [];
    let last_id = 0;
    let total_exp = 0;
    const cost_itemid = TableGameConfig.var_openWelfare_point;
    for (const id in table_award) {
      if (Object.prototype.hasOwnProperty.call(table_award, id)) {
        let cur_id = Number(id);
        let cur_tabel = new TableOpenWelfareAward(cur_id);

        if (retRoleALLInfo.roleSubInfo.openWelfare.received >= cur_tabel.id) { continue; }
        const cost_num = Number(cur_tabel.cost);

        if (!retRoleALLInfo.roleSubInfo.openWelfare.totalPoint || retRoleALLInfo.roleSubInfo.openWelfare.totalPoint < cost_num) { continue; }

        drops = drops.concat(cur_tabel.drop);
        last_id = cur_id;
        // total_exp += cur_tabel.exp;
      }
    }

    if (drops.length == 0) {
      reMsg.msg = `没有可领取的奖励`;
      return reMsg;
    }

    retRoleALLInfo.roleSubInfo.openWelfare.received = last_id;

    //先保存已经处理的道具
    //await this.gameDataService.updateRoleItem(roleKeyDto, roleIemBag);

    //道具奖励
    let dropDataEntity = await cGameCommon.addItemByDrop(roleKeyDto, drops, this.gameDataService);
    cGameCommon.hanleDropMsg(dropDataEntity, reMsg);

    // //经验奖励
    // if (total_exp > 0) {
    //   reMsg.roleAddExp = syshero.leadheroAddExp(retRoleALLInfo, retRoleALLInfo.roleHero, total_exp);

    //   if (reMsg.roleAddExp?.newHero || reMsg.roleAddExp?.newActiveHeros) {
    //     await this.gameDataService.updateRoleHero(roleKeyDto, retRoleALLInfo.roleHero);
    //   }
    // }

    await this.gameDataService.updateRoleInfo(roleKeyDto, retRoleALLInfo.roleInfo);

    languageConfig.setActTypeSuccess(EActType.GET_OPEN_WERFARE_POINT_AWARD, reMsg);
    reMsg.received = retRoleALLInfo.roleSubInfo.openWelfare.received;
    return reMsg;
  }

  async getGuildLivenessAward(@Request() req: any, @Body() dto: GetGuildLivenessAwardDto) {
    let roleKeyDto: RoleKeyDto = { id: req.user.id, serverid: req.user.serverid };
    let retMsg = new RESGuildLivenessAwardMsg();
    let getRoleALLInfoDto = new GetRoleALLInfoDto(roleKeyDto);
    getRoleALLInfoDto.need_roleInfo = true;
    let retRoleALLInfo: RetRoleALLInfo = await this.gameDataService.getRoleAllInfo(getRoleALLInfoDto);
    if (!retRoleALLInfo.isHaveData()) {
      retMsg.msg = retRoleALLInfo.getRetMsg();
      return retMsg;
    }

    let data = new TableGuildTaskAward(dto.id)
    if (!data) {
      retMsg.msg = "参数错误";
      return retMsg;
    }

    if (!data.drop || data.drop.length == 0) {
      retMsg.msg = "没有配置奖励";
      return retMsg;
    }

    if (!cGameCommon.isOpenSystem(retRoleALLInfo, TableGameSys.guild_task)) {
      retMsg.msg = languageConfig.tip.not_open_system;
      return retMsg;
    }
    if (!retRoleALLInfo.roleInfo.info.guild) {
      retMsg.msg = "没有加入公会";
      return retMsg;
    }
    let guildId = retRoleALLInfo.roleInfo.info.guild.guildid;
    if (!guildId || guildId.length == 0) {
      retMsg.msg = "没有加入公会";
      return retMsg;
    }
    let gld = await this.gameDataService.getGameCacheService().getHash(getGuildInfoHmKey(req.user.serverid), guildId);
    if (!gld) {
      retMsg.msg = "公会错误";
      return retMsg;
    }
    let guild = <GuildEntity><unknown>gld;
    if (guild.info.liveness < data.point) {
      retMsg.msg = "公会活跃度不足";
      return retMsg;
    }
    let received = retRoleALLInfo.roleInfo.info.taskGuild.received;
    if (received.indexOf(dto.id) != -1) {
      retMsg.msg = "奖励已领取";
      return retMsg;
    }
    //道具奖励
    if (data.drop && data.drop.length > 0) {
      let dropDataEntity = await cGameCommon.addItemByDrop(roleKeyDto, data.drop, this.gameDataService);
      cGameCommon.hanleDropMsg(dropDataEntity, retMsg);
    }
    received.push(dto.id);
    retMsg.received = received;
    retMsg.id = dto.id;
    await this.gameDataService.updateRoleInfo(roleKeyDto, retRoleALLInfo.roleInfo);
    languageConfig.setActTypeSuccess(EActType.GUILD_AWARD, retMsg);
    return retMsg;
  }

  /**
   * 领取每日任务奖励
   * @param req 
   * @param getTaskDailyAwardDto 
   * @returns 
   */
  async getGuildTaskAward(@Request() req: any, @Body() dto: GetTaskAwardDto) {

    let roleKeyDto: RoleKeyDto = { id: req.user.id, serverid: req.user.serverid };

    let reMsg = new RESGuildTaskAwardMsg();

    let getRoleALLInfoDto = new GetRoleALLInfoDto(roleKeyDto);
    getRoleALLInfoDto.need_roleInfo = true;
    getRoleALLInfoDto.need_roleHero = true;
    //获取角色信息
    let retRoleALLInfo: RetRoleALLInfo = await this.gameDataService.getRoleAllInfo(getRoleALLInfoDto);
    if (!retRoleALLInfo.isHaveData()) {
      reMsg.msg = retRoleALLInfo.getRetMsg();
      return reMsg;
    }

    if (!cGameCommon.isOpenSystem(retRoleALLInfo, TableGameSys.guild_task)) {
      reMsg.msg = `系统暂未开放`;
      return reMsg;
    }



    if (!retRoleALLInfo.roleSubInfo.taskGuild || !retRoleALLInfo.roleSubInfo.taskGuild.tasklist) {
      reMsg.msg = `null`;
      return reMsg;
    }
    let tasks = retRoleALLInfo.roleSubInfo.taskGuild
    if (!tasks.tasklist[dto.id]) {
      reMsg.msg = `该任务不存在`;
      return reMsg;
    }

    let cur_taskEntity: TaskEntity = tasks.tasklist[dto.id];
    if (!TableTask.checkHave(cur_taskEntity.id)) {
      reMsg.msg = `任务表数据异常 id:${cur_taskEntity.id}`;
      return reMsg;
    }

    if (!cTaskSystem.taskIsFinish(cur_taskEntity)) {
      reMsg.msg = `任务没有完成`;
      return reMsg;
    }

    if (cur_taskEntity.state !== ETaskState.NOT_RECEIVE) {
      reMsg.msg = `奖励已领取`;
      return reMsg;
    }

    let finish_task_entity = new TableTask(cur_taskEntity.id);
    //道具奖励
    if (finish_task_entity.drop && finish_task_entity.drop.length > 0) {
      let dropDataEntity = await cGameCommon.addItemByDrop(roleKeyDto, finish_task_entity.drop, this.gameDataService);
      cGameCommon.hanleDropMsg(dropDataEntity, reMsg);
      if (dropDataEntity.items && dropDataEntity.items[TableGameConfig.var_guild_liveness]) {
        let num = dropDataEntity.items[TableGameConfig.var_guild_liveness];
        if (num > 0 && retRoleALLInfo.roleInfo.info.guild) {
          let gid = retRoleALLInfo.roleInfo.info.guild.guildid;
          if (gid.length > 0) {
            let gld = await this.gameDataService.getGameCacheService().getHash(getGuildInfoHmKey(req.user.serverid), gid);
            if (gld) {
              let guild = <GuildEntity><unknown>gld;
              guild.info.liveness = (guild.info.liveness || 0) + num;
              await this.gameDataService.getGameCacheService().setHash(getGuildInfoHmKey(req.user.serverid), gid, guild);
              reMsg.liveness = guild.info.liveness;
            }
          }
        }
      }
    }

    //经验奖励
    if (finish_task_entity.exp && finish_task_entity.exp > 0) {
      reMsg.roleAddExp = syshero.leadheroAddExp(retRoleALLInfo, retRoleALLInfo.roleHero, finish_task_entity.exp);

      if (reMsg.roleAddExp?.newHero || reMsg.roleAddExp?.newActiveHeros) {
        await this.gameDataService.updateRoleHero(roleKeyDto, retRoleALLInfo.roleHero);
      }
    }
    cur_taskEntity.state = ETaskState.RECEIVED;
    await this.gameDataService.updateRoleInfo(roleKeyDto, retRoleALLInfo.roleInfo);

    languageConfig.setActTypeSuccess(EActType.TASK_GUILD_GETAWARD, reMsg);
    reMsg.newTask = {};
    reMsg.newTask.newTaskGuild = tasks;
    return reMsg;
  }

}
