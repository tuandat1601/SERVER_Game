import { Body, Injectable, Request } from '@nestjs/common';
import { EBActType, EBServerStatus } from 'apps/web-backend/src/backend-enum';
import { UpdateRoleStatusDto } from 'apps/web-backend/src/backend-system/customer-service/dto/customer-service.dto';
import { CreateServerDto, DeleteServerDto, ChangeServerStatusDto, UpdateServerDto, UpdateToServerDto, MergeServerDto, AutoMaintainServerDto, AutoOpenServerDto, BEFindRolesDto, BEGetChatLogDto, BESetCrossServerIdDto } from 'apps/web-backend/src/backend-system/games-mgr/dto/games-mgr.dto';
import { EActType, EChatType, EGameRankType, EGameRoleStatus } from '../../config/game-enum';
import { TableTask } from '../../config/gameTable/TableTask';
import { TableTaskTarget } from '../../config/gameTable/TableTaskTarget';
import { languageConfig } from '../../config/language/language';
import { FindReRoles, FindRoles, RoleAddExp, SetDailyEntity } from '../../game-data/entity/common.entity';
import { ItemsRecord } from '../../game-data/entity/item.entity';
import { REMsg, RESFindRolesMsg, RESGetChatLogMsg, RESPSGoActMsg, RESSysOpenAwardMsg } from '../../game-data/entity/msg.entity';
import { newTaskEntity, TaskEntity } from '../../game-data/entity/task.entity';
import { GameMergeService } from '../../game-data/game-merge.service';
import { GameDataService, GetRoleALLInfoDto } from '../../game-data/gamedata.service';
import { RoleKeyDto } from '../../game-data/role/dto/role-key.dto';
import { cTools } from '../../game-lib/tools';
import { SendEmailDto } from '../email/dto/email-system.dto';
import { cGameCommon, RetRoleALLInfo } from '../game-common';
import { cGameServer } from '../game-server';
import { syshero } from '../hero/hero-lvup';
import { GMChangeLoginDto, GMPSStartDaysDto, GMServerStartDaysDto, GMAddRoleExpDto, GMSendEmailDto, GMArenaSeasonEndDto, GMFinishTaskDto, GetSysOpenAwardDto } from './dto/game-common.dto';
import { TableGameSys } from '../../config/gameTable/TableGameSys';
import { ArenaServerInfo } from '../../game-data/entity/arena.entity';
import { getCross_ArenaInfo_RKey, getCross_ArenaRank_RKey } from 'apps/web-cross-server/src/common/redis-key';
@Injectable()
export class GameCommonService {
  prismaCrossDBService: any;

  constructor(
    private readonly gameDataService: GameDataService,
    private readonly gameMergeService: GameMergeService,

  ) {

  }

  async gmServerStartDays(@Request() req: any, @Body() gmServerStartDaysDto: GMServerStartDaysDto) {
    let roleKeyDto: RoleKeyDto = { id: req.user.id, serverid: req.user.serverid };
    let retMsg = new REMsg();

    let getRoleALLInfoDto = new GetRoleALLInfoDto(roleKeyDto);
    getRoleALLInfoDto.need_roleInfo = true;
    getRoleALLInfoDto.need_roleHero = true;
    //获取角色信息
    let retRoleALLInfo: RetRoleALLInfo = await this.gameDataService.getRoleAllInfo(getRoleALLInfoDto);
    if (!retRoleALLInfo.isHaveData()) {
      retMsg.msg = retRoleALLInfo.getRetMsg();
      return retMsg;
    }

    let serverSubInfo = retRoleALLInfo.serverInfo.info;

    let cur_date = new Date();
    let cur_h = cur_date.getHours();
    cur_date.setHours(cur_h - ((gmServerStartDaysDto.days - 1) * 24));
    serverSubInfo.startTime = cTools.newLocalDateString(cur_date);
    cGameServer.checkOpenNewSystem(serverSubInfo);
    let new_system = cGameCommon.checkOpenNewSystem(retRoleALLInfo);
    //是否有新系统开放
    if (new_system) {
      retMsg.roleAddExp = new RoleAddExp();
      retMsg.roleAddExp.newSystem = new_system;
    }

    await this.gameDataService.resetServerDaily(roleKeyDto.serverid, serverSubInfo);

    await this.gameDataService.updateRoleInfo(roleKeyDto, { info: retRoleALLInfo.roleSubInfo });
    await this.gameDataService.updateSververSubInfo(roleKeyDto.serverid, serverSubInfo);

    languageConfig.setActTypeSuccess(EActType.GM_CMD, retMsg);
    return retMsg;

  }

  async gmChangeLogin(@Request() req: any, @Body() gmChangeLoginDto: GMChangeLoginDto) {
    let roleKeyDto: RoleKeyDto = { id: req.user.id, serverid: req.user.serverid };
    let retMsg = new REMsg();

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

    let serverSubInfo = retRoleALLInfo.serverInfo.info;

    let cur_date = new Date();
    let cur_h = cur_date.getHours();
    cur_date.setHours(cur_h - ((gmChangeLoginDto.days - 1) * 24));


    let server_start_time = new Date(serverSubInfo.startTime).getTime();

    if (cur_date.getTime() < server_start_time) {
      retMsg.msg = "登录天数不能超过开服天数"
      return retMsg;
    }
    let roleSubInfo = retRoleALLInfo.roleSubInfo;
    retRoleALLInfo.roleSubInfo.lastlogintime = cTools.newLocalDateString(cur_date);

    //前一天的登录时间 
    let last_date = new Date(cur_date);
    last_date.setHours(last_date.getHours() - 24);

    //夺宝大作战-每日奖励
    if (roleSubInfo.pirateShip) {
      retRoleALLInfo.roleSubInfo.pirateShip.rankDAT = cTools.newLocalDateString(last_date);
    }

    let new_system = cGameCommon.checkOpenNewSystem(retRoleALLInfo);
    //是否有新系统开放
    if (new_system) {
      retMsg.roleAddExp = new RoleAddExp();
      retMsg.roleAddExp.newSystem = new_system;
    }

    //强制每日重置
    // if (true) {
    //  let resetDaily = new SetDailyEntity();
    //  await this.gameDataService.resetDaily(retRoleALLInfo, resetDaily, req);
    //   if (retRoleALLInfo.roleItem) {
    //     await this.gameDataService.updateRoleItem(roleKeyDto, retRoleALLInfo.roleItem);
    //   }
    //   retMsg.daily = resetDaily;
    // }

    await this.gameDataService.updateRoleInfo(roleKeyDto, { info: retRoleALLInfo.roleSubInfo });

    languageConfig.setActTypeSuccess(EActType.GM_CMD, retMsg);
    return retMsg;
  }

  async gmPSStartDaysDto(@Request() req: any, @Body() gmPSStartDaysDto: GMPSStartDaysDto) {
    let roleKeyDto: RoleKeyDto = { id: req.user.id, serverid: req.user.serverid };
    let retMsg = new REMsg();

    let getRoleALLInfoDto = new GetRoleALLInfoDto(roleKeyDto);
    getRoleALLInfoDto.need_roleInfo = true;
    //获取角色信息
    let retRoleALLInfo: RetRoleALLInfo = await this.gameDataService.getRoleAllInfo(getRoleALLInfoDto);
    if (!retRoleALLInfo.isHaveData()) {
      retMsg.msg = retRoleALLInfo.getRetMsg();
      return retMsg;
    }

    let serverSubInfo = retRoleALLInfo.serverInfo.info;
    let cur_date = new Date();
    let cur_h = cur_date.getHours();
    cur_date.setHours(cur_h - ((gmPSStartDaysDto.days - 1) * 24));
    if (serverSubInfo.pirateShip) {
      serverSubInfo.pirateShip.sTime = cTools.newLocalDate0String(cur_date);

      if (retRoleALLInfo.roleSubInfo.pirateShip) {
        retRoleALLInfo.roleSubInfo.pirateShip.sTime = serverSubInfo.pirateShip.sTime;
      }
    }


    await this.gameDataService.resetServerDaily(roleKeyDto.serverid, serverSubInfo);

    await this.gameDataService.updateRoleInfo(roleKeyDto, { info: retRoleALLInfo.roleSubInfo });
    await this.gameDataService.updateSververSubInfo(roleKeyDto.serverid, serverSubInfo);

    languageConfig.setActTypeSuccess(EActType.GM_CMD, retMsg);
    return retMsg;
  }

  async gmAddRoleExpDto(@Request() req: any, @Body() gmSetLvDto: GMAddRoleExpDto) {

    let roleKeyDto: RoleKeyDto = { id: req.user.id, serverid: req.user.serverid };
    let retMsg = new REMsg();

    let getRoleALLInfoDto = new GetRoleALLInfoDto(roleKeyDto);
    getRoleALLInfoDto.need_roleInfo = true;
    getRoleALLInfoDto.need_roleHero = true;
    //获取角色信息
    let retRoleALLInfo: RetRoleALLInfo = await this.gameDataService.getRoleAllInfo(getRoleALLInfoDto);
    if (!retRoleALLInfo.isHaveData()) {
      retMsg.msg = retRoleALLInfo.getRetMsg();
      return retMsg;
    }

    if (gmSetLvDto.exp <= 0) {
      retMsg.msg = "exp is 0";
      return retMsg;
    }

    retMsg.roleAddExp = syshero.leadheroAddExp(retRoleALLInfo, retRoleALLInfo.roleHero, gmSetLvDto.exp);

    retRoleALLInfo.roleInfo.exp = Math.min(retRoleALLInfo.roleInfo.exp, 2000000000);
    retMsg.roleAddExp.newExp = retRoleALLInfo.roleInfo.exp;
    await this.gameDataService.updateRoleInfo(roleKeyDto, retRoleALLInfo.roleInfo);
    await this.gameDataService.updateRoleHero(roleKeyDto, retRoleALLInfo.roleHero);

    languageConfig.setActTypeSuccess(EActType.GM_CMD, retMsg);
    return retMsg;
  }

  async gmSendEmailDto(@Request() req: any, @Body() gmSendEmailDto: GMSendEmailDto) {

    let roleKeyDto: RoleKeyDto = { id: req.user.id, serverid: req.user.serverid };
    let retMsg = new REMsg();

    //SendEmailDto
    let sendEmailDto: SendEmailDto = {
      key: "123",
      serverid: roleKeyDto.serverid,
      title: "GM邮件",
      content: "GM邮件",
      sender: "GM",
      owner: roleKeyDto.id,
      items: gmSendEmailDto.items,
    }

    let email_msg = await this.gameDataService.sendEmail(sendEmailDto);
    if (email_msg.ok) {
      languageConfig.setActTypeSuccess(EActType.GM_CMD, retMsg);
    }
    else {
      languageConfig.setActTypeFail(EActType.GM_CMD, retMsg);
    }

    return retMsg
  }
  async gmArenaSeasonEndDto(@Request() req: any, @Body() gmArenaSeasonEndDto: GMArenaSeasonEndDto) {
    let roleKeyDto: RoleKeyDto = { id: req.user.id, serverid: req.user.serverid };
    let retMsg = new REMsg();
    if (!cTools.getTestModel()) {
      return retMsg
    }
    let getRoleALLInfoDto = new GetRoleALLInfoDto(roleKeyDto);
    getRoleALLInfoDto.need_roleInfo = true;
    //获取角色信息
    let retRoleALLInfo: RetRoleALLInfo = await this.gameDataService.getRoleAllInfo(getRoleALLInfoDto);
    if (!retRoleALLInfo.isHaveData()) {
      retMsg.msg = retRoleALLInfo.getRetMsg();
      return retMsg;
    }
    if (true || gmArenaSeasonEndDto.flag && gmArenaSeasonEndDto.flag === 1000) {
      let crossServerId = retRoleALLInfo.serverInfo.info.crossServerId
      let arenaData = await this.gameDataService.getCache(getCross_ArenaInfo_RKey(crossServerId));
      let SveRank = await this.gameDataService.getServerRankByType(crossServerId,EGameRankType.CROSS_ARENA)
      arenaData.sTime = cTools.newLocalDate0String();
      arenaData.season++;
      arenaData.lrank = Object.keys(SveRank);
      
      await this.gameDataService.setCache(getCross_ArenaRank_RKey(crossServerId), {});
      await this.gameDataService.setCache(getCross_ArenaInfo_RKey(crossServerId), arenaData);

    } else {
      let arenaData = retRoleALLInfo.serverInfo.info.arenaData;
      let SveRank = await this.gameDataService.getSeverArenaRank(req.user.serverid) || {}
      arenaData.sTime = cTools.newLocalDate0String();
      arenaData.season++;
      arenaData.lrank = Object.keys(SveRank);
      // arenaData.rank = {};
      await this.gameDataService.updateServerAreanRank(req.user.serverid, {})

      await this.gameDataService.initArenaPoint(req.user.serverid);
      // await this.gameDataService.updateRoleInfo(roleKeyDto, { info: retRoleALLInfo.roleSubInfo });
      await this.gameDataService.updateSververSubInfo(roleKeyDto.serverid, retRoleALLInfo.serverInfo.info);
    }
    languageConfig.setActTypeSuccess(EActType.GM_CMD, retMsg);
    return retMsg;
  }

  async gmFinishTask(@Request() req: any, @Body() gmFinishTaskDto: GMFinishTaskDto) {

    let roleKeyDto: RoleKeyDto = { id: req.user.id, serverid: req.user.serverid };
    let retMsg = new REMsg();
    if (!cTools.getTestModel()) {
      return retMsg
    }

    let getRoleALLInfoDto = new GetRoleALLInfoDto(roleKeyDto);
    getRoleALLInfoDto.need_roleInfo = true;

    //获取角色信息
    let retRoleALLInfo: RetRoleALLInfo = await this.gameDataService.getRoleAllInfo(getRoleALLInfoDto);
    if (!retRoleALLInfo.isHaveData()) {
      retMsg.msg = retRoleALLInfo.getRetMsg();
      return retMsg;
    }

    if (!retRoleALLInfo.roleSubInfo.taskMain) {
      retMsg.msg = "主线任务不存在";
      return retMsg;
    }

    let taksEntity = new TableTask(retRoleALLInfo.roleSubInfo.taskMain.curEntity.id);

    //修正错误 强制重置
    retRoleALLInfo.roleSubInfo.taskMain.curEntity.count = {};

    for (let index = 0; index < taksEntity.target.length; index++) {
      const element = taksEntity.target[index];
      let task_tg = new TableTaskTarget(element);
      retRoleALLInfo.roleSubInfo.taskMain.curEntity.count[Number(element)] = task_tg.val;
    }
    await this.gameDataService.updateRoleInfo(roleKeyDto, { info: retRoleALLInfo.roleSubInfo });

    retMsg.newTask = new newTaskEntity();
    retMsg.newTask.newTaskMain = retRoleALLInfo.roleSubInfo.taskMain;
    languageConfig.setActTypeSuccess(EActType.GM_CMD, retMsg);
    return retMsg;
  }

  async createServer(@Request() req: any, @Body() createServerDto: CreateServerDto) {

    let retMsg = new REMsg()

    let serverInfo = await this.gameDataService.getServerInfo(createServerDto.serverId, true);

    if (serverInfo) {
      retMsg.msg = "游戏服 serverInfo 已经存在";
      return retMsg;
    }

    serverInfo = await this.gameDataService.createServerInfo(createServerDto.serverId, createServerDto.status, Number(createServerDto.openTime));

    if (serverInfo) {
      retMsg.ok = true;
      retMsg.msg = "OK";
    }

    return retMsg

  }

  async updateToServer(@Request() req: any, @Body() updateToServerDto: UpdateToServerDto) {
    let retMsg = new REMsg()

    let serverInfo = await this.gameDataService.getServerInfo(updateToServerDto.serverId, true);

    if (serverInfo) {
      retMsg.msg = "游戏服 serverInfo 已经存在";
      return retMsg;
    }

    serverInfo = await this.gameDataService.createServerInfo(updateToServerDto.serverId, updateToServerDto.status, Number(updateToServerDto.openTime));
    if (serverInfo) {
      retMsg.ok = true;
      retMsg.msg = "OK";
    }

    return retMsg
  }

  async updateServer(@Request() req: any, @Body() updateServerDto: UpdateServerDto) {

    let retMsg = new REMsg()

    let serverInfo = await this.gameDataService.getServerInfo(updateServerDto.serverId, true);

    if (!serverInfo) {
      retMsg.msg = `游戏服ID:${updateServerDto.serverId} serverInfo 不存在`;
      return retMsg
    }



    if (updateServerDto.openTime !== undefined) {

      if (serverInfo.info.status !== EBServerStatus.WaitOpen) {
        retMsg.msg = `服务器${updateServerDto.serverId}:不是处于待开服`;
        return retMsg
      }

      if (serverInfo.nodeid !== cTools.getDataNodeId()) {
        retMsg.msg = `游戏服数据节点ID不一致 app nodeid:${cTools.getDataNodeId()} serverInfo.nodeid:${serverInfo.nodeid}`;
        return retMsg
      }

      let cur_stataus = updateServerDto.status || serverInfo.info.status

      //先清理再创建
      await this.gameDataService.onDestroy([updateServerDto.serverId], false);
      await this.gameDataService.onDestroyMysqlData(updateServerDto.serverId, updateServerDto.serverId);

      serverInfo = await this.gameDataService.createServerInfo(updateServerDto.serverId, cur_stataus, Number(updateServerDto.openTime));
      if (serverInfo) {
        retMsg.ok = true;
        retMsg.msg = "OK";
      }
    }
    else {
      if (updateServerDto.status !== undefined) {
        serverInfo.info.status = updateServerDto.status;
        await this.gameDataService.updateSververSubInfo(updateServerDto.serverId, serverInfo.info);
        retMsg.ok = true;
        retMsg.msg = "OK";
      }
    }

    return retMsg;

  }

  async deleteServer(@Request() req: any, @Body() deleteServerDto: DeleteServerDto) {

    let retMsg = new REMsg()

    let cur_data_nodeid = cTools.getDataNodeId();

    let serverInfo = await this.gameDataService.getServerInfo(deleteServerDto.serverId, true);

    if (!serverInfo) {
      retMsg.msg = `游戏服ID:${deleteServerDto.serverId} serverInfo 不存在`;
      return retMsg
    }

    if (serverInfo.nodeid !== cur_data_nodeid) {
      retMsg.msg = `游戏服数据节点ID不一致 app nodeid:${cur_data_nodeid} serverInfo.nodeid:${serverInfo.nodeid}`;
      return retMsg
    }

    await this.gameDataService.onDestroy([deleteServerDto.serverId], false);
    await this.gameDataService.onDestroyOnlineRole(deleteServerDto.serverId);
    await this.gameDataService.onDestroyMysqlData(deleteServerDto.serverId, deleteServerDto.serverId);

    retMsg.ok = true;
    retMsg.msg = "OK";
    return retMsg;

  }

  async changeServerStatus(@Request() req: any, @Body() changeServerStatusDto: ChangeServerStatusDto) {

    let retMsg = new REMsg()

    for (let index = 0; index < changeServerStatusDto.serverId.length; index++) {
      const cur_serverid = changeServerStatusDto.serverId[index];
      let serverInfo = await this.gameDataService.getServerInfo(cur_serverid);

      if (serverInfo) {
        serverInfo.info.status = changeServerStatusDto.status;
        await this.gameDataService.updateSververSubInfo(cur_serverid, serverInfo.info);
      }

    }

    languageConfig.setActTypeSuccess(EActType.BE_CHANGE_SERVER_STATUS, retMsg);
    return retMsg;

  }

  async updateRoleStatus(@Body() updateRoleStatusDto: UpdateRoleStatusDto) {

    let retMsg = new REMsg();
    let role = await this.gameDataService.getRole({ id: updateRoleStatusDto.roleid, serverid: updateRoleStatusDto.serverid }, true, 1, false);

    if (!role) {
      retMsg.msg = "角色不存在";
      return retMsg;
    }

    if (role.status == EGameRoleStatus.DISABLE && updateRoleStatusDto.status == EGameRoleStatus.MUTED) {
      retMsg.msg = "角色已经被封禁";
      return retMsg;
    }

    let role_Cache = await this.gameDataService.getRole({ id: updateRoleStatusDto.roleid, serverid: updateRoleStatusDto.serverid }, false, 1, false);
    if (!role_Cache) {
      //不在线 
      let prismaGameDB = this.gameDataService.getPrismaGameDB()
      await prismaGameDB.role.update({
        where: {
          id: updateRoleStatusDto.roleid
        },
        data: {
          status: updateRoleStatusDto.status,
          updatedAt: cTools.newSaveLocalDate()
        }
      })
    }
    else {
      role.status = updateRoleStatusDto.status;
      await this.gameDataService.updateRole(role);
    }

    languageConfig.setActTypeSuccess(EActType.UPDATE_ROLESTATUS, retMsg);
    return retMsg;

  }

  async mergeServer(@Request() req: any, @Body() mergeServerDto: MergeServerDto) {
    return this.gameMergeService.mergeServer(mergeServerDto)
  }

  async autoMaintainServer(@Request() req: any, @Body() autoMaintainServerDto: AutoMaintainServerDto) {
    let retMsg = new REMsg();
    let prismaGameDB = this.gameDataService.getPrismaGameDB();

    let servers = await prismaGameDB.serverInfo.findMany({
      where: {
        nodeid: Number(cTools.getDataNodeId())
      }
    })

    if (servers.length <= 0) {
      retMsg.msg = "没有找到服务器serverInfo信息";
      return retMsg
    }

    for (let index = 0; index < servers.length; index++) {
      const element = servers[index];
      let serverinfo = await this.gameDataService.getServerSubInfo(element.serverid);
      if (serverinfo && serverinfo.status && serverinfo.status === EBServerStatus.Open) {
        serverinfo.status = EBServerStatus.Maintain;
        await this.gameDataService.updateSververSubInfo(element.serverid, serverinfo);
      }
    }

    languageConfig.setActTypeSuccess(EActType.BE_AUTO_MAINTAINS_SERVER, retMsg);
    return retMsg;

  }


  async autoOpenServer(@Request() req: any, @Body() autoOpenServerDto: AutoOpenServerDto) {
    let retMsg = new REMsg();
    let prismaGameDB = this.gameDataService.getPrismaGameDB();

    let servers = await prismaGameDB.serverInfo.findMany({
      where: {
        nodeid: Number(cTools.getDataNodeId())
      }
    })

    if (servers.length <= 0) {
      retMsg.msg = "没有找到服务器serverInfo信息";
      return retMsg
    }

    for (let index = 0; index < servers.length; index++) {
      const element = servers[index];
      let serverinfo = await this.gameDataService.getServerSubInfo(element.serverid);
      if (serverinfo && serverinfo.status && serverinfo.status === EBServerStatus.Maintain) {
        serverinfo.status = EBServerStatus.Open;
        await this.gameDataService.updateSververSubInfo(element.serverid, serverinfo);
      }
    }

    languageConfig.setActTypeSuccess(EActType.BE_AUTO_OPEN_SERVER, retMsg);
    return retMsg;
  }


  /**
   * 后台专用-查找角色信息列表
   * @param req
   * @param beFindRolesDto 
   */
  async findRoles(@Request() req: any, @Body() beFindRolesDto: BEFindRolesDto) {

    let retMsg = new RESFindRolesMsg();

    if (process.env.GAME_SKU !== beFindRolesDto.sku) {
      retMsg.msg = `游戏SKU不一致 GAME_SKU:${process.env.GAME_SKU}  dto sku:${beFindRolesDto.sku}`;
      return retMsg
    }

    let prismaGameDB = this.gameDataService.getPrismaGameDB();

    let cur_serverids = await this.gameDataService.getDataServerIds();

    if (cur_serverids.length <= 0) {
      retMsg.msg = "没有找到服务器";
      return retMsg
    }

    let roles = await prismaGameDB.role.findMany({
      where: {
        serverid: {
          in: cur_serverids
        },
        userid: beFindRolesDto.userId
      },
      select: {
        id: true,
        name: true,
        originServerid: true,
      }
    })

    if (!roles || roles.length <= 0) {
      retMsg.msg = "没有找到角色";
      return retMsg
    }

    let role_ids = [];
    for (let index = 0; index < roles.length; index++) {
      const element = roles[index];
      role_ids.push(element.id);
    }

    let roleInfos = await prismaGameDB.roleInfo.findMany({
      where: {
        id: {
          in: role_ids
        }
      },
      select: {
        id: true,
        rolelevel: true
      }
    })

    let findRoles: FindReRoles = {};

    for (let index = 0; index < roles.length; index++) {
      const element = roles[index];
      let cur_data: FindRoles = {
        name: element.name,
        lv: 1
      }

      for (let idx = 0; idx < roleInfos.length; idx++) {
        const roleinfo = roleInfos[idx];
        if (roleinfo.id == element.id) {
          cur_data.lv = roleinfo.rolelevel;
        }
      }

      findRoles[element.originServerid] = cur_data;
    }

    retMsg.roles = findRoles;
    languageConfig.setActTypeSuccess(EActType.BE_FIND_ROLES, retMsg);
    return retMsg;
  }

  async getSysOpenAward(@Request() req: any, @Body() reqbody: GetSysOpenAwardDto) {

    let roleKeyDto: RoleKeyDto = { id: req.user.id, serverid: req.user.serverid };
    let retMsg: RESSysOpenAwardMsg = new RESSysOpenAwardMsg();
    let getRoleALLInfoDto = new GetRoleALLInfoDto(roleKeyDto);
    getRoleALLInfoDto.need_roleInfo = true;
    let retRoleALLInfo: RetRoleALLInfo = await this.gameDataService.getRoleAllInfo(getRoleALLInfoDto);
    if (!retRoleALLInfo.isHaveData()) {
      retMsg.msg = retRoleALLInfo.getRetMsg();
      return retMsg;
    }
    if (!cGameCommon.isOpenSystem(retRoleALLInfo, reqbody.sysId)) {
      retMsg.msg = languageConfig.tip.not_open_system;
      return retMsg;
    }
    let data = new TableGameSys(reqbody.sysId);
    if (data.is_licheng == 0) {
      retMsg.msg = "不是历程任务";
      return retMsg;
    }
    if (!data.drop || data.drop.length == 0) {
      retMsg.msg = "没有配置奖励";
      return retMsg;
    }
    let award = retRoleALLInfo.roleInfo.info.sysOpenAward;
    if (award == undefined) {
      award = [];
      retRoleALLInfo.roleInfo.info.sysOpenAward = award;
    }
    if (award.indexOf(reqbody.sysId) != -1) {
      retMsg.msg = "奖励已领取";
      return retMsg;
    }
    //道具奖励
    if (data.drop && data.drop.length > 0) {
      let dropDataEntity = await cGameCommon.addItemByDrop(roleKeyDto, data.drop, this.gameDataService);
      cGameCommon.hanleDropMsg(dropDataEntity, retMsg);
    }
    award.push(reqbody.sysId);
    retMsg.sysOpenAward = award;
    await this.gameDataService.updateRoleInfo(roleKeyDto, retRoleALLInfo.roleInfo);
    languageConfig.setActTypeSuccess(EActType.SYS_OPEN_AWARD, retMsg);
    return retMsg;
  }

  async getChatLog(@Request() req: any, @Body() beGetChatLogDto: BEGetChatLogDto) {

    let retMsg: RESGetChatLogMsg = new RESGetChatLogMsg();
    let chat = await this.gameDataService.getChatListByType(beGetChatLogDto.serverid, EChatType.Server);

    retMsg.chatlog = chat;
    languageConfig.setActTypeSuccess(EActType.BE_GET_CHAT_LOG, retMsg);
    return retMsg;
  }

  async setCrossServerId(@Request() req: any, @Body() beSetCrossServerIdDto: BESetCrossServerIdDto) {

    let retMsg = new REMsg()

    let serverInfo = await this.gameDataService.getServerInfo(beSetCrossServerIdDto.serverId);

    if (serverInfo) {
      serverInfo.info.crossServerId = beSetCrossServerIdDto.crossServerId;
      await this.gameDataService.updateSververSubInfo(beSetCrossServerIdDto.serverId, serverInfo.info);
    }
    languageConfig.setActTypeSuccess(EActType.BE_CHANGE_SERVER_STATUS, retMsg);
    return retMsg;
  }
}
