import { Body, Injectable, Request } from '@nestjs/common';
import { PrismaCrossDBService } from 'apps/web-cross-server/src/datadb/prisma.cross.service';
import { webApiConstants } from 'apps/web-game/src/common/auth/constants';
import { gameConst } from 'apps/web-game/src/config/game-const';
import MD5 from 'apps/web-game/src/game-lib/md5';
import { cTools } from 'apps/web-game/src/game-lib/tools';
import { cloneDeep } from 'lodash';
import { EBActType, EBServerStatus } from '../../backend-enum';
import { ChannelConfigs } from '../../channel/channel.config';
import { languageConfig } from '../../config/language/language';
import { BackendDataService } from '../../data/backend-data/backend-data.service';
import { BECrossServerInfo, BEGameInfoEntity, channelAppEntity, GameEntity } from '../../entity/game.entity';
import { BEServerInfoEntity, ServerEntity } from '../../entity/server.entity';
import { BaseResult, BEGetChatLogResult, CreateServerResult, CreateZoneResult, DeleteServerResult, DeleteZoneResult, GameResult, GetChannelResult, GetGameListResult, GetNoticeResult, GetServerResult, GetZoneResult, MergeServerResult, SetServerChatIPResult, SetSetAutoOpenServerResult, UpdateServerResult, UpdateZoneResult } from '../../result/result';
import { AutoMaintainServerDto, AutoOpenServerDto, BEGetChatLogDto, BESendEmailDto, BESendRechargeShopDto, BECreateCrossServerDto, CreateGameDto, CreateServerDto, CreateZoneDto, BEDeleteCrossServerDto, DeleteGameDto, DeleteServerDto, DeleteZoneDto, GetNoticeDto, GetServerListDto, GetZoneListDto, MergeServerDto, BESetCrossServerIdDto, BESetServerChatIPDto, UpdateGameDto, UpdateNoticeDto, UpdateServerDto, UpdateToServerDto, UpdateZoneDto, BESetAutoOpenServerDto } from './dto/games-mgr.dto';
@Injectable()
export class GamesMgrService {
  constructor(
    private readonly backendDate: BackendDataService,
    private readonly prismaCrossDBService: PrismaCrossDBService,
  ) {
  }

  async getGameList(@Request() req: any) {

    let gameResult = new GetGameListResult();

    let ret = await this.backendDate.getGamesList();

    if (!ret) {
      return gameResult;
    }

    for (let index = 0; index < ret.length; index++) {
      let element = ret[index];
      element.createdAt = cTools.newTransformToUTCZDate(element.createdAt);
      element.updatedAt = cTools.newTransformToUTCZDate(element.updatedAt);
    }

    gameResult.data = ret;
    languageConfig.setSuccess(EBActType.GetGameList, gameResult);
    return gameResult;
  }

  async createGame(@Request() req: any, @Body() createGameDto: CreateGameDto) {

    let gameResult: GameResult = new GameResult();

    let cur_game = await this.backendDate.getGameDataBySku(createGameDto.sku);

    if (cur_game) {
      gameResult.msg = "已经存在该SKU的游戏";
      return gameResult;
    }

    let gameEntity: GameEntity = Object.assign(
      { whitelist: [], blacklist: [], info: {}, createdAt: cTools.newLocalDateString() },
      createGameDto);

    let ret = await this.backendDate.createGame(gameEntity);

    if (ret) {
      gameResult.data = Object.assign({}, ret,
        {
          gameUrl: <any>ret.gameUrl,
          channels: <any>ret.channels,
          whitelist: <any>ret.whitelist,
          blacklist: <any>ret.blacklist,
          createdAt: cTools.newLocalDateString(new Date(ret.createdAt)),
          info: <any>ret.info || undefined,
        }
      );
      languageConfig.setSuccess(EBActType.CreateGame, gameResult);
    }

    return gameResult
  }

  async updateGame(@Request() req: any, @Body() updateGameDto: UpdateGameDto) {

    let baseResult = new BaseResult()
    let cur_game = await this.backendDate.getGameDataById(updateGameDto.id);

    if (!cur_game) {
      baseResult.msg = "游戏不存在";
      return baseResult;
    }

    let gameEntity: GameEntity = Object.assign({}, updateGameDto);

    let ret = await this.backendDate.updateGame(gameEntity);

    if (ret) {
      languageConfig.setSuccess(EBActType.UpdateGame, baseResult);
    }
    return baseResult
  }

  async updateNotice(@Request() req: any, @Body() updateNoticeDto: UpdateNoticeDto) {
    let baseResult = new BaseResult()
    let cur_game = await this.backendDate.getGameDataById(updateNoticeDto.gameId);

    if (!cur_game) {
      baseResult.msg = "游戏不存在";
      return baseResult;
    }


    let prismaBackendDB = this.backendDate.getPrismaBackendDB();

    let game: GameEntity = <any>cur_game;

    let is_ok = false;

    for (let index = 0; index < game.channels.length; index++) {
      let element = game.channels[index];

      if (element.channelAppId === updateNoticeDto.channelAppId) {
        element.notice = updateNoticeDto.notice;
        is_ok = true;
      }

    }

    if (!is_ok) {
      baseResult.msg = "渠道不存在";
      return baseResult;
    }

    let ret = await prismaBackendDB.games.update(
      {
        where: {
          id: updateNoticeDto.gameId
        },
        data: {
          channels: cur_game.channels
        }
      }
    )

    if (ret) {
      languageConfig.setSuccess(EBActType.UpdateGame, baseResult);
    }

    return baseResult
  }


  async deleteGame(@Request() req: any, @Body() deleteGameDto: DeleteGameDto) {

    let baseResult = new BaseResult()
    let cur_game = await this.backendDate.getGameDataById(deleteGameDto.id);

    if (!cur_game) {
      baseResult.msg = languageConfig.tips.no_find_game;
      return baseResult;
    }

    let prismaBackendDB = this.backendDate.getPrismaBackendDB();
    let server = await prismaBackendDB.servers.findMany({
      where: {
        gameId: deleteGameDto.id
      }
    });

    if (server && server.length > 0) {
      baseResult.msg = "该游戏还有服务器存在，无法删除";
      return baseResult;
    }

    let gameEntity: GameEntity = Object.assign({}, deleteGameDto);

    let ret = await this.backendDate.deleteGame(gameEntity);

    if (ret) {
      languageConfig.setSuccess(EBActType.DeleteGame, baseResult);
    }
    return baseResult
  }

  /**
   * 创建跨服
   * @param req 
   * @param beCreateCrossServerDto 
   * @returns 
   */
  async createCrossServer(@Request() req: any, @Body() beCreateCrossServerDto: BECreateCrossServerDto) {

    let baseResult = new BaseResult()
    let prismaBackendDB = this.backendDate.getPrismaBackendDB();
    let cur_game = await prismaBackendDB.games.findUnique(
      {
        where: {
          id: beCreateCrossServerDto.gameId
        }
      }
    )

    if (!cur_game) {
      baseResult.msg = languageConfig.tips.no_find_game;
      return baseResult;
    }

    let gameEntity: GameEntity = <unknown>cur_game;

    gameEntity.info = gameEntity.info || {};
    gameEntity.info.crossServer = gameEntity.info.crossServer || [];



    for (const key in gameEntity.info.crossServer) {
      if (Object.prototype.hasOwnProperty.call(gameEntity.info.crossServer, key)) {
        const element = gameEntity.info.crossServer[key];
        if (element.id === beCreateCrossServerDto.crossServerId) {
          baseResult.msg = "BE跨服已存在,ID重复";
          return baseResult;
        }
      }
    }

    let new_crossServerInfo = { id: beCreateCrossServerDto.crossServerId, url: beCreateCrossServerDto.crossUrl }

    //通知跨服节点创建跨服
    let beCreateCrossServerDto1: BECreateCrossServerDto = Object.assign({}, beCreateCrossServerDto, {
      crossServerId: new_crossServerInfo.id,
      time: new Date().getTime()
    })
    let sgin = `${beCreateCrossServerDto1.gameId}${beCreateCrossServerDto1.crossServerId}${webApiConstants.secret}${beCreateCrossServerDto1.time}`;
    let sgin_md5 = new MD5().hex_md5(sgin).toLowerCase();
    beCreateCrossServerDto1.key = sgin_md5;
    let url = beCreateCrossServerDto.crossUrl + "/cross/createCrossServer";
    let send_ret = await this.backendDate.sendHttpPost(url, beCreateCrossServerDto1);

    if (!send_ret.data.ok) {
      if (baseResult.msg) {
        baseResult.msg = send_ret.data.msg;
      }
      else {
        languageConfig.setFail(EBActType.createCrossServer, baseResult);
      }
      return baseResult;
    }

    gameEntity.info.crossServer.push(new_crossServerInfo);

    let ret = await prismaBackendDB.games.update(
      {
        where: {
          id: beCreateCrossServerDto.gameId
        },
        data: {
          info: <any>gameEntity.info
        }
      }
    )

    if (ret) {
      languageConfig.setSuccess(EBActType.createCrossServer, baseResult);
    }
    return baseResult;

  }

  /**
   * 删除跨服
   * @param req 
   * @param deleteCrossServerDto 
   */
  async deleteCrossServer(@Request() req: any, @Body() deleteCrossServerDto: BEDeleteCrossServerDto) {

    let baseResult = new BaseResult()
    let prismaBackendDB = this.backendDate.getPrismaBackendDB();
    let cur_game = await prismaBackendDB.games.findUnique(
      {
        where: {
          id: deleteCrossServerDto.gameId
        }
      }
    )

    if (!cur_game) {
      baseResult.msg = languageConfig.tips.no_find_game;
      return baseResult;
    }

    let gameEntity: GameEntity = <unknown>cur_game;

    gameEntity.info = gameEntity.info || {};
    gameEntity.info.crossServer = gameEntity.info.crossServer || [];

    let delete_crossServer: BECrossServerInfo;
    let delete_index = -1;
    for (let index = 0; index < gameEntity.info.crossServer.length; index++) {
      const element = gameEntity.info.crossServer[index];
      if (element.id === deleteCrossServerDto.crossServerId) {
        delete_crossServer = element;
        delete_index = index;
        break;
      }
    }

    if (!delete_crossServer || delete_index == -1) {
      baseResult.msg = "BE该跨服不存在";
      return baseResult;
    }

    gameEntity.info.crossServer.splice(delete_index, 1);

    //通知跨服节点删除跨服
    let deleteCrossServerDto1: BEDeleteCrossServerDto = Object.assign({}, deleteCrossServerDto, {
      crossServerId: delete_crossServer.id,
      time: new Date().getTime()
    })

    let sgin = `${deleteCrossServerDto1.gameId}${deleteCrossServerDto1.crossServerId}${webApiConstants.secret}${deleteCrossServerDto1.time}`;
    let sgin_md5 = new MD5().hex_md5(sgin).toLowerCase();
    deleteCrossServerDto1.key = sgin_md5;
    let url = delete_crossServer.url + "/cross/deleteCrossServer";
    let send_ret = await this.backendDate.sendHttpPost(url, deleteCrossServerDto1);

    if (!send_ret.data.ok) {
      if (baseResult.msg) {
        baseResult.msg = send_ret.data.msg;
      }
      else {
        languageConfig.setFail(EBActType.deleteCrossServer, baseResult);
      }
      return baseResult;
    }


    let ret = await prismaBackendDB.games.update(
      {
        where: {
          id: deleteCrossServerDto.gameId
        },
        data: {
          info: <any>gameEntity.info
        }
      }
    )

    if (ret) {
      languageConfig.setSuccess(EBActType.deleteCrossServer, baseResult);
    }
    return baseResult;
  }

  /**
   * 获取渠道列表
   * @param req 
   * @returns 
   */
  async getChannelList(@Request() req: any) {

    let getChannelResult = new GetChannelResult();

    getChannelResult.data = ChannelConfigs;
    languageConfig.setSuccess(EBActType.GetChannelList, getChannelResult);

    // let prismaBackendDB = this.backendDate.getPrismaBackendDB();
    // let ret = await prismaBackendDB.channel.findMany();
    // if (ret) {
    //   getChannelResult.data = ChannelConfigs;
    //   languageConfig.setSuccess(EBActType.GetChannelList, getChannelResult);
    // }

    return getChannelResult;

  }

  /**
   * 创建渠道
   * @param req 
   * @param createChannelDto 
   * @returns 
   */
  // async createChannel(@Request() req: any, @Body() createChannelDto: CreateChannelDto) {

  //   let createChannelResult = new CreateChannelResult();

  //   let prismaBackendDB = this.backendDate.getPrismaBackendDB();
  //   let old_ret = await prismaBackendDB.channel.findFirst(
  //     {
  //       where: {
  //         name: createChannelDto.name
  //       }
  //     }
  //   )

  //   if (old_ret) {
  //     createChannelResult.msg = "渠道name " + createChannelDto.name + "已存在";
  //     return createChannelResult;
  //   }

  //   let old_ret1 = await prismaBackendDB.channel.findFirst(
  //     {
  //       where: {
  //         remark: createChannelDto.remark
  //       }
  //     }
  //   )

  //   if (old_ret1) {
  //     createChannelResult.msg = "渠道remark " + createChannelDto.remark + "已存在";
  //     return createChannelResult;
  //   }

  //   let cur_time = cTools.newLocalDateString();
  //   let save_date = cTools.newSaveLocalDate(new Date(cur_time));
  //   let new_ret = await prismaBackendDB.channel.create(
  //     {
  //       data: {
  //         name: createChannelDto.name,
  //         remark: createChannelDto.remark,
  //         createdAt: save_date,
  //         updatedAt: save_date
  //       }
  //     }
  //   )

  //   if (new_ret) {
  //     createChannelResult.data = Object.assign({}, new_ret, {
  //       createdAt: cur_time,
  //       updatedAt: cur_time
  //     });
  //     languageConfig.setSuccess(EBActType.CreateChannel, createChannelResult);
  //   }

  //   return createChannelResult;

  // }

  // /**
  //  * 修改渠道
  //  * @param req 
  //  * @param updateChannelDto 
  //  */
  // async updateChannel(@Request() req: any, @Body() updateChannelDto: UpdateChannelDto) {

  //   let updateChannelResult = new UpdateChannelResult();

  //   let prismaBackendDB = this.backendDate.getPrismaBackendDB();
  //   let old_ret = await prismaBackendDB.channel.findUnique(
  //     {
  //       where: {
  //         id: updateChannelDto.id
  //       }
  //     }
  //   )

  //   if (!old_ret) {
  //     updateChannelResult.msg = updateChannelDto.name + "不存在";
  //     return updateChannelResult;
  //   }

  //   if (updateChannelDto.name) {
  //     let old_ret1 = await prismaBackendDB.channel.findFirst(
  //       {
  //         where: {
  //           name: updateChannelDto.name
  //         }
  //       }
  //     )

  //     if (old_ret1) {
  //       updateChannelResult.msg = "渠道name " + updateChannelDto.name + "已存在";
  //       return updateChannelResult;
  //     }
  //   }

  //   if (updateChannelDto.remark) {
  //     let old_ret2 = await prismaBackendDB.channel.findFirst(
  //       {
  //         where: {
  //           remark: updateChannelDto.remark
  //         }
  //       }
  //     )

  //     if (old_ret2) {
  //       updateChannelResult.msg = "渠道remark " + updateChannelDto.remark + "已存在";
  //       return updateChannelResult;
  //     }
  //   }

  //   let cur_time = cTools.newLocalDateString();
  //   let save_date = cTools.newSaveLocalDate(new Date(cur_time));

  //   old_ret = Object.assign(old_ret, updateChannelDto, {
  //     updatedAt: save_date
  //   });

  //   let new_ret = await prismaBackendDB.channel.update(
  //     {
  //       where: {
  //         id: old_ret.id
  //       },
  //       data: old_ret
  //     }
  //   )

  //   if (new_ret) {
  //     updateChannelResult.data = Object.assign({}, new_ret, {
  //       updatedAt: cur_time,
  //       createdAt: cTools.newLocalDateString(new_ret.createdAt),
  //     });
  //     languageConfig.setSuccess(EBActType.UpdateChannel, updateChannelResult);
  //   }
  //   return updateChannelResult;

  // }

  // /**
  //  * 删除渠道
  //  * @param req 
  //  * @param deleteChannelDto 
  //  */
  // async deleteChannel(@Request() req: any, @Body() deleteChannelDto: DeleteChannelDto) {

  //   let deleteChannelResult = new DeleteChannelResult()

  //   let prismaBackendDB = this.backendDate.getPrismaBackendDB();
  //   let old_ret = await prismaBackendDB.channel.findUnique(
  //     {
  //       where: {
  //         id: deleteChannelDto.id
  //       }
  //     }
  //   )

  //   if (!old_ret) {
  //     deleteChannelResult.msg = "渠道 " + deleteChannelDto.id + "不存在";
  //     return deleteChannelResult;
  //   }

  //   let new_ret = await prismaBackendDB.channel.delete(
  //     {
  //       where: {
  //         id: deleteChannelDto.id
  //       }
  //     }
  //   )

  //   if (new_ret) {
  //     languageConfig.setSuccess(EBActType.DeleteChannel, deleteChannelResult);
  //   }

  //   return deleteChannelResult;
  // }

  /**--------------------服务器列表--------------------------- */
  /**
   * 获取服务器列表
   * @param req 
   */
  async getServerList(@Request() req: any, @Body() getServerListDto: GetServerListDto) {

    let getServerResult = new GetServerResult()

    let prismaBackendDB = this.backendDate.getPrismaBackendDB();

    await this.backendDate.checkServerIsOpen(getServerListDto.gameId);

    let ret = await prismaBackendDB.servers.findMany(
      {
        where: {
          gameId: getServerListDto.gameId,
        }
      }
    )

    let serverEntityList: ServerEntity[] = <ServerEntity[]><unknown>ret
    if (serverEntityList) {

      for (let index = 0; index < serverEntityList.length; index++) {
        let element = serverEntityList[index];
        element.openTime = cTools.newLocalDateString(cTools.newTransformToUTCZDate(element.openTime));
        element.createdAt = cTools.newLocalDateString(cTools.newTransformToUTCZDate(element.createdAt));
        element.updatedAt = cTools.newLocalDateString(cTools.newTransformToUTCZDate(element.updatedAt));
        if (element.mergeTime) {
          element.mergeTime = cTools.newLocalDateString(cTools.newTransformToUTCZDate(element.mergeTime));
        }
      }

      getServerResult.data = serverEntityList;
      languageConfig.setSuccess(EBActType.GetServerList, getServerResult);
    }


    return getServerResult;
  }

  /**
   * 创建服务器
   * @param req 
   * @param createServerDto 
   * @returns 
   */
  async createServer(@Request() req: any, @Body() createServerDto: CreateServerDto) {

    return this.backendDate.createServer(req, createServerDto);
  }

  async updateToServer(@Request() req: any, @Body() updateToServerDto: UpdateToServerDto) {

    let updateServerResult = new UpdateServerResult();

    let prismaBackendDB = this.backendDate.getPrismaBackendDB();
    let old_ret = await prismaBackendDB.servers.findFirst(
      {
        where: {
          gameId: updateToServerDto.gameId,
          serverId: updateToServerDto.serverId
        }
      }
    )

    if (!old_ret) {
      updateServerResult.msg = "该游戏服务器不存在";
      return updateServerResult
    }

    //通知游戏服验证

    let openTime_str = String(cTools.newTransformToUTCZDate(old_ret.openTime).getTime());
    let updateServerDto1 = Object.assign(cloneDeep(updateToServerDto), {
      openTime: openTime_str,
      status: old_ret.status
    })
    updateServerDto1.time = new Date().getTime();

    let sgin = `${updateServerDto1.gameId}${updateServerDto1.serverId}${updateServerDto1.openTime}${updateServerDto1.status}${webApiConstants.secret}${updateServerDto1.time}`;
    let sgin_md5 = new MD5().hex_md5(sgin).toLowerCase();
    updateServerDto1.key = sgin_md5;

    let url = old_ret.gameUrl + "/game-common/updateToServer";
    let ret_pos = await this.backendDate.sendHttpPost(url, updateServerDto1)

    if (!ret_pos.data.ok) {
      updateServerResult.msg = ret_pos.data.msg || "游戏服同步失败";
      return updateServerResult
    }

    languageConfig.setSuccess(EBActType.UpdateServer, updateServerResult);
    return updateServerResult;

  }
  /**
   * 修改服务器
   * @param req 
   * @param updateServerDto 
   * @returns 
   */
  async updateServer(@Request() req: any, @Body() updateServerDto: UpdateServerDto) {

    let updateServerResult = new UpdateServerResult();

    let prismaBackendDB = this.backendDate.getPrismaBackendDB();
    let old_ret = await prismaBackendDB.servers.findFirst(
      {
        where: {
          gameId: updateServerDto.gameId,
          serverId: updateServerDto.serverId
        }
      }
    )

    if (!old_ret) {
      updateServerResult.msg = "该游戏服务器不存在";
      return updateServerResult
    }

    if (updateServerDto.openTime !== undefined) {
      if (old_ret.status !== EBServerStatus.WaitOpen) {
        updateServerResult.msg = "游戏服务器不在待开始状态";
        return updateServerResult
      }

      let cur_time = new Date(old_ret.openTime).getTime();
      let now_time = new Date().getTime();
      if (cur_time <= now_time) {
        updateServerResult.msg = "开服时间已经过";
        return updateServerResult
      }
    }

    //通知游戏服验证
    if (updateServerDto.openTime !== undefined || updateServerDto.status !== undefined) {
      let updateServerDto1 = Object.assign({}, cloneDeep(updateServerDto), {
        openTime: updateServerDto.openTime ? String(new Date(updateServerDto.openTime).getTime()) : undefined
      })

      updateServerDto1.time = new Date().getTime();
      let sgin = `${updateServerDto1.gameId}${updateServerDto1.serverId}${updateServerDto1.openTime}${updateServerDto1.status}${webApiConstants.secret}${updateServerDto1.time}`;
      let sgin_md5 = new MD5().hex_md5(sgin).toLowerCase();
      updateServerDto1.key = sgin_md5;
      let url = old_ret.gameUrl + "/game-common/updateServer";
      let ret_pos = await this.backendDate.sendHttpPost(url, updateServerDto1)

      if (!ret_pos.data.ok) {
        updateServerResult.msg = ret_pos.data.msg || "游戏服修改失败";
        return updateServerResult
      }

    }

    let cur_time = cTools.newLocalDateString();
    let save_obj = Object.assign({}, updateServerDto, {
      channels: updateServerDto.channels ? <any>updateServerDto.channels : undefined,
      openTime: updateServerDto.openTime ? cTools.newTransformToUTC8Date(updateServerDto.openTime) : undefined,
      mergeTime: updateServerDto.mergeTime ? cTools.newTransformToUTC8Date(updateServerDto.mergeTime) : undefined,
      updatedAt: cTools.newTransformToUTC8Date(cur_time)
    })

    let new_ret = await prismaBackendDB.servers.update(
      {
        where: {
          gameId_serverId: {
            gameId: old_ret.gameId,
            serverId: old_ret.serverId
          }
        },
        data: save_obj
      }
    )

    if (new_ret) {
      updateServerResult.data = Object.assign({}, updateServerDto, {
        updatedAt: cur_time,
        openTime: updateServerDto.openTime ? cTools.newLocalDateString(new Date(updateServerDto.openTime)) : undefined
      })
      languageConfig.setSuccess(EBActType.UpdateServer, updateServerResult);
    }

    return updateServerResult;
  }


  async updateServerStatus(@Request() req: any, @Body() updateServerDto: UpdateServerDto) {

    let updateServerResult = new UpdateServerResult();

    let prismaBackendDB = this.backendDate.getPrismaBackendDB();
    let old_ret = await prismaBackendDB.servers.findFirst(
      {
        where: {
          gameId: updateServerDto.gameId,
          serverId: updateServerDto.serverId
        }
      }
    )

    if (!old_ret) {
      updateServerResult.msg = "该游戏服务器不存在";
      return updateServerResult
    }

    if (updateServerDto.status == undefined) {
      updateServerResult.msg = "status 状态为空";
      return updateServerResult
    }

    if (updateServerDto.openTime != undefined) {
      updateServerResult.msg = "只能修改状态";
      return updateServerResult
    }

    let game_serverid = updateServerDto.serverId;
    let update_serverid = [updateServerDto.serverId];
    //只能修改状态
    //是否合服
    if (old_ret.info) {

      let beServerInfoEntity: BEServerInfoEntity = <unknown>old_ret.info;
      if (beServerInfoEntity.mergeIds && beServerInfoEntity.mergeIds.length > 0) {
        //主服务器
        update_serverid = update_serverid.concat(beServerInfoEntity.mergeIds);
      }
      else if (beServerInfoEntity.mainsId) {
        //被合服
        game_serverid = beServerInfoEntity.mainsId;

        let main_server_ret = await prismaBackendDB.servers.findFirst(
          {
            where: {
              gameId: updateServerDto.gameId,
              serverId: beServerInfoEntity.mainsId
            }
          }
        )

        if (!main_server_ret) {
          updateServerResult.msg = `主服务器ID${beServerInfoEntity.mainsId}不存在`;
          return updateServerResult
        }

        if (!main_server_ret.info) {
          updateServerResult.msg = `主服务器 id:${beServerInfoEntity.mainsId} info 不存在`;
          return updateServerResult
        }

        let main_serverinfo = <BEServerInfoEntity><unknown>main_server_ret.info;

        if (!main_serverinfo.mergeIds) {
          updateServerResult.msg = `主服务器 id:${beServerInfoEntity.mainsId} mergeIds 不存在`;
          return updateServerResult
        }


        update_serverid = [];
        update_serverid.push(beServerInfoEntity.mainsId);
        update_serverid = update_serverid.concat(main_serverinfo.mergeIds);

      }
    }

    let updateServerDto1 = Object.assign({}, cloneDeep(updateServerDto), {
      openTime: undefined,
      serverId: game_serverid
    })

    updateServerDto1.time = new Date().getTime();
    let sgin = `${updateServerDto1.gameId}${updateServerDto1.serverId}${updateServerDto1.openTime}${updateServerDto1.status}${webApiConstants.secret}${updateServerDto1.time}`;
    let sgin_md5 = new MD5().hex_md5(sgin).toLowerCase();
    updateServerDto1.key = sgin_md5;
    let url = old_ret.gameUrl + "/game-common/updateServer";
    let ret_pos = await this.backendDate.sendHttpPost(url, updateServerDto1)

    if (!ret_pos.data.ok) {
      updateServerResult.msg = ret_pos.data.msg || "游戏状态修改失败";
      return updateServerResult
    }

    let new_ret = await prismaBackendDB.servers.updateMany(
      {
        where: {
          gameId: old_ret.gameId,
          serverId: {
            in: update_serverid
          }
        },
        data: {
          status: updateServerDto.status,
          updatedAt: cTools.newLocalDateString()
        }
      }
    )

    if (new_ret) {
      old_ret.status = updateServerDto.status
      updateServerResult.data = <unknown>old_ret;
      languageConfig.setSuccess(EBActType.UpdateServer, updateServerResult);
    }

    return updateServerResult;
  }

  /**
   * 删除服务器
   * @param req 
   * @param deleteServerDto 
   * @returns 
   */
  async deleteServer(@Request() req: any, @Body() deleteServerDto: DeleteServerDto) {

    let deleteServerResult = new DeleteServerResult();
    let prismaBackendDB = this.backendDate.getPrismaBackendDB();
    let old_ret = await prismaBackendDB.servers.findFirst(
      {
        where: {
          gameId: deleteServerDto.gameId,
          serverId: deleteServerDto.serverId
        }
      }
    )

    if (!old_ret) {
      deleteServerResult.msg = "该游戏服务器不存在";
      return deleteServerResult;
    }

    if (old_ret.status !== EBServerStatus.Close) {
      deleteServerResult.msg = "游戏服务器不在关服状态";
      return deleteServerResult
    }


    //通知游戏服验证
    let deleteServerDto1 = cloneDeep(deleteServerDto)
    deleteServerDto1.time = new Date().getTime();
    let sgin = `${deleteServerDto1.gameId}${deleteServerDto1.serverId}${webApiConstants.secret}${deleteServerDto1.time}`;
    let sgin_md5 = new MD5().hex_md5(sgin).toLowerCase();
    deleteServerDto1.key = sgin_md5;
    let url = old_ret.gameUrl + "/game-common/deleteServer";
    let ret_pos = await this.backendDate.sendHttpPost(url, deleteServerDto1)

    if (!ret_pos.data.ok) {
      deleteServerResult.msg = ret_pos.data.msg || "游戏服删除失败";
      return deleteServerResult
    }

    let new_ret = await prismaBackendDB.servers.delete(
      {
        where: {
          gameId_serverId: {
            gameId: deleteServerDto.gameId,
            serverId: deleteServerDto.serverId
          }
        }
      }
    )

    if (new_ret) {
      languageConfig.setSuccess(EBActType.DeleteServer, deleteServerResult);
    }

    return deleteServerResult;

  }

  /**
   * 后台-合服处理
   * @param req 
   * @param mergeServerDto 
   */
  async mergeServer(@Request() req: any, @Body() mergeServerDto: MergeServerDto) {

    let mergeServerResult = new MergeServerResult();
    let prismaBackendDB = this.backendDate.getPrismaBackendDB();
    let game = await prismaBackendDB.games.findFirst(
      {
        where: {
          id: mergeServerDto.gameId
        }
      }
    )

    if (!game) {
      mergeServerResult.msg = `该游戏不存在 gameid:${mergeServerDto.gameId}`;
      return mergeServerResult;
    }

    let all_server_ids = mergeServerDto.sourceId.concat(mergeServerDto.targetId);
    let all_sourceId_ids = mergeServerDto.sourceId;
    let servers = await prismaBackendDB.servers.findMany(
      {
        where: {
          gameId: mergeServerDto.gameId,
          serverId: {
            in: all_server_ids
          }
        }
      }
    )

    if (!servers || servers.length == 0) {
      mergeServerResult.msg = "该游戏服务器不存在";
      return mergeServerResult;
    }

    /**目标服务器 */
    let target_serverEntity: ServerEntity;
    for (let index = 0; index < servers.length; index++) {
      let element = servers[index];
      if (element.status !== EBServerStatus.Maintain) {
        mergeServerResult.msg = `服务器:[${element.serverId}]不在维护状态`;
        return mergeServerResult
      }

      if (element.info) {
        let beServerInfoEntity: BEServerInfoEntity = <BEServerInfoEntity><unknown>element.info;
        if (beServerInfoEntity.mainsId) {
          mergeServerResult.msg = `服务器:[${element.serverId}]已被合服过`;
          return mergeServerResult
        }
      }

      if (element.serverId === mergeServerDto.targetId) {
        target_serverEntity = <ServerEntity><unknown>element
      }
    }

    if (!target_serverEntity) {
      mergeServerResult.msg = "目标服务器不存在";
      return mergeServerResult;
    }

    target_serverEntity.info = target_serverEntity.info || {};
    target_serverEntity.info.mergeIds = target_serverEntity.info.mergeIds || [];

    let mergeTime = cTools.newSaveLocalDate();

    for (let index = 0; index < servers.length; index++) {
      let element = servers[index];
      if (element.serverId !== mergeServerDto.targetId) {
        //合服ID
        if (target_serverEntity.info.mergeIds.indexOf(element.serverId) == -1) {
          target_serverEntity.info.mergeIds.push(element.serverId);
        }
        //合并被合服的服务器 之前合过服的ID
        if (element.info) {
          let beServerInfoEntity: BEServerInfoEntity = <BEServerInfoEntity><unknown>element.info;
          if (beServerInfoEntity.mergeIds && beServerInfoEntity.mergeIds.length > 0) {
            target_serverEntity.info.mergeIds = target_serverEntity.info.mergeIds.concat(beServerInfoEntity.mergeIds);
            //一起处理之前合服的ID
            all_sourceId_ids = all_sourceId_ids.concat(beServerInfoEntity.mergeIds);
          }
        }

      }

    }

    //通知游戏服务器-合服
    let mergeServerDto1 = cloneDeep(mergeServerDto)
    mergeServerDto1.time = new Date().getTime();
    let sgin = `${mergeServerDto.gameId}${mergeServerDto.targetId}${webApiConstants.secret}${mergeServerDto.sourceId}${mergeServerDto1.time}`;
    let sgin_md5 = new MD5().hex_md5(sgin).toLowerCase();
    mergeServerDto1.key = sgin_md5;

    mergeServerDto1.targetCrossId = target_serverEntity.info?.crossServerId;

    let url = target_serverEntity.gameUrl + "/game-common/mergeServer";
    let ret_pos = await this.backendDate.sendHttpPost(url, mergeServerDto1)
    if (!ret_pos.data.ok) {
      mergeServerResult.msg = ret_pos.data.msg || "通知游戏服合服失败";
      return mergeServerResult;
    }

    //跨服处理
    await this.prismaCrossDBService.gameRank.updateMany({
      where: {
        serverid: {
          in: all_sourceId_ids
        }
      },
      data: {
        serverid: target_serverEntity.serverId
      }
    })

    //被合服的服务器
    //待优化 设置跨服
    let source_info: BEServerInfoEntity = {
      mainsId: target_serverEntity.serverId,
      crossServerId: target_serverEntity.info?.crossServerId
    }
    await prismaBackendDB.servers.updateMany(
      {
        where: {
          gameId: target_serverEntity.gameId,
          serverId: {
            in: all_sourceId_ids
          }
        },
        data: {
          gameUrl: target_serverEntity.gameUrl,
          info: <any>source_info,
          mergeTime: mergeTime,
          updatedAt: mergeTime,
          chatIP: target_serverEntity.chatIP
        }
      }
    )

    //目标服务器
    await prismaBackendDB.servers.update(
      {
        where: {
          gameId_serverId: {
            gameId: target_serverEntity.gameId,
            serverId: target_serverEntity.serverId,
          }
        },
        data: {
          info: <any>target_serverEntity.info,
          mergeTime: mergeTime,
          updatedAt: mergeTime
        }
      }
    )

    languageConfig.setSuccess(EBActType.MergeServer, mergeServerResult);
    return mergeServerResult
  }




  async autoMaintainServer(@Request() req: any, @Body() autoMaintainServerDto: AutoMaintainServerDto) {

    let baseResult = new BaseResult();
    let prismaBackendDB = this.backendDate.getPrismaBackendDB();
    let game = await prismaBackendDB.games.findFirst(
      {
        where: {
          id: autoMaintainServerDto.gameId
        }
      }
    )

    if (!game) {
      baseResult.msg = `该游戏不存在 gameid:${autoMaintainServerDto.gameId}`;
      return baseResult;
    }

    //查找可以修改的服务器
    let cur_server = await prismaBackendDB.servers.findMany(
      {
        where: {
          gameId: autoMaintainServerDto.gameId,
          status: EBServerStatus.Open
        }
      }
    )

    if (cur_server.length <= 0) {
      //失败
      baseResult.msg = "没有可以修改的服务器";
      return baseResult;
    }

    //通知游戏服
    let all_gameUrl = {};
    for (let index = 0; index < cur_server.length; index++) {
      const element = cur_server[index];
      if (!all_gameUrl[element.gameUrl]) {
        all_gameUrl[element.gameUrl] = 1;
      }
    }


    let autoMaintainServerDto1 = cloneDeep(autoMaintainServerDto)
    autoMaintainServerDto1.time = new Date().getTime();
    let sgin = `${autoMaintainServerDto1.gameId}${webApiConstants.secret}${autoMaintainServerDto1.time}`;
    let sgin_md5 = new MD5().hex_md5(sgin).toLowerCase();
    autoMaintainServerDto1.key = sgin_md5;

    for (const key in all_gameUrl) {
      if (Object.prototype.hasOwnProperty.call(all_gameUrl, key)) {
        let cur_gameUrl = key;
        let url = cur_gameUrl + "/game-common/autoMaintainServer";
        let ret_pos = await this.backendDate.sendHttpPost(url, autoMaintainServerDto1);

        if (!ret_pos?.data?.ok) {
          //失败
          baseResult.msg = "游戏服通知失败 cur_gameUrl:" + cur_gameUrl;
          return baseResult;
        }
      }
    }


    //开启改维护
    let ret_count = await prismaBackendDB.servers.updateMany(
      {
        where: {
          gameId: autoMaintainServerDto.gameId,
          status: EBServerStatus.Open
        },
        data: {
          status: EBServerStatus.Maintain
        }
      }
    )

    languageConfig.setSuccess(EBActType.AutoMaintainServer, baseResult);
    return baseResult;
  }

  async autoOpenServer(@Request() req: any, @Body() autoOpenServerDto: AutoOpenServerDto) {
    let baseResult = new BaseResult();
    let prismaBackendDB = this.backendDate.getPrismaBackendDB();
    let game = await prismaBackendDB.games.findFirst(
      {
        where: {
          id: autoOpenServerDto.gameId
        }
      }
    )

    if (!game) {
      baseResult.msg = `该游戏不存在 gameid:${autoOpenServerDto.gameId}`;
      return baseResult;
    }

    //查找可以修改的服务器
    let cur_server = await prismaBackendDB.servers.findMany(
      {
        where: {
          gameId: autoOpenServerDto.gameId,
          status: EBServerStatus.Maintain
        }
      }
    )

    if (cur_server.length <= 0) {
      //失败
      baseResult.msg = "没有可以修改的服务器";
      return baseResult;
    }

    //通知游戏服
    let all_gameUrl = {};
    for (let index = 0; index < cur_server.length; index++) {
      const element = cur_server[index];
      if (!all_gameUrl[element.gameUrl]) {
        all_gameUrl[element.gameUrl] = 1;
      }
    }


    let autoOpenServerDto1 = cloneDeep(autoOpenServerDto)
    autoOpenServerDto1.time = new Date().getTime();
    let sgin = `${autoOpenServerDto1.gameId}${webApiConstants.secret}${autoOpenServerDto1.time}`;
    let sgin_md5 = new MD5().hex_md5(sgin).toLowerCase();
    autoOpenServerDto1.key = sgin_md5;

    for (const key in all_gameUrl) {
      if (Object.prototype.hasOwnProperty.call(all_gameUrl, key)) {
        let cur_gameUrl = key;
        let url = cur_gameUrl + "/game-common/autoOpenServer";
        let ret_pos = await this.backendDate.sendHttpPost(url, autoOpenServerDto1);

        if (!ret_pos?.data?.ok) {
          //失败
          baseResult.msg = "游戏服通知失败 cur_gameUrl:" + cur_gameUrl;
          return baseResult;
        }
      }
    }


    //开启改维护
    let ret_count = await prismaBackendDB.servers.updateMany(
      {
        where: {
          gameId: autoOpenServerDto1.gameId,
          status: EBServerStatus.Maintain
        },
        data: {
          status: EBServerStatus.Open
        }
      }
    )

    languageConfig.setSuccess(EBActType.AutoOpenServer, baseResult);
    return baseResult;
  }

  async setServerChatIP(@Request() req: any, @Body() BESetServerChatIPDto: BESetServerChatIPDto) {

    let setServerChatIPResult = new SetServerChatIPResult();

    let prismaBackendDB = this.backendDate.getPrismaBackendDB();
    let old_ret = await prismaBackendDB.servers.findFirst(
      {
        where: {
          gameId: BESetServerChatIPDto.gameId,
          serverId: BESetServerChatIPDto.serverId
        }
      }
    )

    if (!old_ret) {
      setServerChatIPResult.msg = "该游戏服务器不存在";
      return setServerChatIPResult;
    }

    let ret = await prismaBackendDB.servers.update({
      where: {
        gameId_serverId: {
          gameId: BESetServerChatIPDto.gameId,
          serverId: BESetServerChatIPDto.serverId
        }
      },
      data: {
        chatIP: BESetServerChatIPDto.chatIP
      }
    })

    setServerChatIPResult.data = <unknown>ret;
    languageConfig.setSuccess(EBActType.setServerChatIP, setServerChatIPResult);
    return setServerChatIPResult;

  }


  async setAutoOpenServer(@Request() req: any, @Body() bebeSetAutoOpenServerDto: BESetAutoOpenServerDto) {
    let setSetAutoOpenServerResult = new SetSetAutoOpenServerResult();

    let prismaBackendDB = this.backendDate.getPrismaBackendDB();
    let old_ret = await prismaBackendDB.games.findFirst(
      {
        where: {
          id: bebeSetAutoOpenServerDto.gameId,
        }
      }
    )

    if (!old_ret) {
      setSetAutoOpenServerResult.msg = "该游戏不存在";
      return setSetAutoOpenServerResult;
    }

    let cur_info: BEGameInfoEntity;
    if (!old_ret.info) {
      cur_info = {};
    }
    else {
      cur_info = <unknown>old_ret.info;
    }

    cur_info.autoOpenModel = bebeSetAutoOpenServerDto.autoOpenModel;
    cur_info.autoVal = bebeSetAutoOpenServerDto.autoVal;
    cur_info.autoTime = bebeSetAutoOpenServerDto.autoTime;

    let ret = await prismaBackendDB.games.update({
      where: {
        id: bebeSetAutoOpenServerDto.gameId,
      },
      data: {
        info: <any>cur_info
      }
    })

    this.backendDate.setAutoOpenGame(<unknown>ret);
    setSetAutoOpenServerResult.data = <unknown>ret;
    languageConfig.setSuccess(EBActType.SetAutoOpenServer, setSetAutoOpenServerResult);
    return setSetAutoOpenServerResult;
  }

  /**
   * 设置服务器跨服ID
   * @param req 
   * @param BESetCrossServerIdDto 
   */
  async setCrossServerId(@Request() req: any, @Body() beSetCrossServerIdDto: BESetCrossServerIdDto) {
    let baseResult = new BaseResult();

    let prismaBackendDB = this.backendDate.getPrismaBackendDB();
    let old_ret = await prismaBackendDB.servers.findFirst(
      {
        where: {
          gameId: beSetCrossServerIdDto.gameId,
          serverId: beSetCrossServerIdDto.serverId
        }
      }
    )

    if (!old_ret) {
      baseResult.msg = languageConfig.tips.no_find_server;
      return baseResult;
    }

    old_ret.info = old_ret.info || {};
    let old_ServerInfoEntity: BEServerInfoEntity = <unknown>old_ret.info;

    if (old_ServerInfoEntity?.crossServerId && Number(old_ServerInfoEntity.crossServerId) === beSetCrossServerIdDto.crossServerId) {
      baseResult.msg = "无法重复设置相同跨服ID";
      return baseResult;
    }

    let mains_serverid = this.backendDate.getBEMainServerId(old_ret, beSetCrossServerIdDto.serverId);
    //通知跨服节点和游戏服节点 设置关联
    let beSetCrossServerIdDt1 = Object.assign({}, cloneDeep(beSetCrossServerIdDto), {
      serverId: mains_serverid,
      time: new Date().getTime()
    })

    let sgin = `${beSetCrossServerIdDt1.gameId}${beSetCrossServerIdDt1.serverId}${beSetCrossServerIdDt1.crossServerId}${webApiConstants.secret}${beSetCrossServerIdDt1.time}`;
    let sgin_md5 = new MD5().hex_md5(sgin).toLowerCase();
    beSetCrossServerIdDt1.key = sgin_md5;
    //console.log("sgin:", sgin);
    let url = old_ret.gameUrl + "/game-common/setCrossServerId";
    let ret_pos = await this.backendDate.sendHttpPost(url, beSetCrossServerIdDt1)
    if (!ret_pos.data.ok) {
      if (ret_pos.data.msg) {
        baseResult.msg = ret_pos.data.msg;
      }
      else {
        languageConfig.setFail(EBActType.setCrossServerId, baseResult);
      }
      return baseResult;
    }

    //修改主服务器跨服设置
    let main_ServerInfoEntity: BEServerInfoEntity = <unknown>old_ret.info;
    if (mains_serverid != beSetCrossServerIdDto.serverId) {
      let main_server_ret = await prismaBackendDB.servers.findFirst(
        {
          where: {
            gameId: beSetCrossServerIdDto.gameId,
            serverId: mains_serverid
          }
        }
      )

      if (!main_server_ret) {
        baseResult.msg = languageConfig.tips.no_find_server + " 主服务器:" + mains_serverid;
        return baseResult;
      }

      main_ServerInfoEntity = <unknown>main_server_ret.info;
    }

    main_ServerInfoEntity.crossServerId = beSetCrossServerIdDto.crossServerId;

    let ret = await prismaBackendDB.servers.update({
      where: {
        gameId_serverId: {
          gameId: beSetCrossServerIdDto.gameId,
          serverId: mains_serverid
        }
      },
      data: {
        info: <any>main_ServerInfoEntity
      }
    })

    if (ret) {
      languageConfig.setSuccess(EBActType.setCrossServerId, baseResult);
    }

    //修改被合服配置
    if (main_ServerInfoEntity.mergeIds && main_ServerInfoEntity.mergeIds.length > 0) {
      let serverQueries: string | any[] = [];
      let be_merge_servers = await prismaBackendDB.servers.findMany(
        {
          where: {
            gameId: beSetCrossServerIdDto.gameId,
            serverId: {
              in: main_ServerInfoEntity.mergeIds
            }
          }
        }
      )

      for (let index = 0; index < be_merge_servers.length; index++) {
        const element = be_merge_servers[index];
        element.info = element.info || {};
        let cur_entity: BEServerInfoEntity = <unknown>element.info
        cur_entity.crossServerId = beSetCrossServerIdDto.crossServerId;
        let cur_ret = prismaBackendDB.servers.update({
          where: {
            gameId_serverId: {
              gameId: beSetCrossServerIdDto.gameId,
              serverId: element.serverId
            }
          },
          data: {
            info: <any>cur_entity
          }
        })

        serverQueries.push(cur_ret);
      }

      if (serverQueries.length > 0) {
        await prismaBackendDB.$transaction(serverQueries);
      }
    }

    return baseResult;
  }

  /**------------------------------------------------------------------ */

  /**-------------------------战区-------------------------------------- */

  /**
   * 获取战区列表
   * @param req 
   * @returns 
   */
  async getZoneList(@Request() req: any, @Body() getZoneListDto: GetZoneListDto) {

    let getZoneResult = new GetZoneResult();

    let prismaBackendDB = this.backendDate.getPrismaBackendDB();

    let ret = await prismaBackendDB.zones.findMany(
      {
        where: {
          gameId: getZoneListDto.gameId
        }
      }
    );

    if (ret) {
      for (let index = 0; index < ret.length; index++) {
        let element = ret[index];
        element.createdAt = cTools.newTransformToUTCZDate(element.createdAt);
        element.updatedAt = cTools.newTransformToUTCZDate(element.updatedAt)
      }
      getZoneResult.data = ret;
      languageConfig.setSuccess(EBActType.GetZoneList, getZoneResult);
    }

    return getZoneResult;

  }

  /**
   * 创建战区
   * @param req 
   * @param createZoneDto 
   * @returns 
   */
  async createZone(@Request() req: any, @Body() createZoneDto: CreateZoneDto) {

    let createZoneResult = new CreateZoneResult();

    let prismaBackendDB = this.backendDate.getPrismaBackendDB();
    let old_ret = await prismaBackendDB.zones.findFirst(
      {
        where: {
          name: createZoneDto.name
        }
      }
    )

    if (old_ret) {
      createZoneResult.msg = "战区name: " + createZoneDto.name + "已存在";
      return createZoneResult;
    }

    let old_ret1 = await prismaBackendDB.games.findFirst(
      {
        where: {
          id: createZoneDto.gameId
        }
      }
    )

    if (!old_ret1) {
      createZoneResult.msg = "游戏id: " + createZoneDto.gameId + "不存在";
      return createZoneResult;
    }

    let cur_time = cTools.newLocalDateString();
    let save_date = cTools.newSaveLocalDate(new Date(cur_time));
    let new_ret = await prismaBackendDB.zones.create(
      {
        data: {
          name: createZoneDto.name,
          gameId: createZoneDto.gameId,
          createdAt: save_date,
          updatedAt: save_date
        }
      }
    )

    if (new_ret) {
      createZoneResult.data = Object.assign({}, new_ret, {
        createdAt: cur_time,
        updatedAt: cur_time
      });
      languageConfig.setSuccess(EBActType.CreateZone, createZoneResult);
    }

    return createZoneResult;

  }

  /**
   * 修改战区
   * @param req 
   * @param updateChannelDto 
   */
  async updateZone(@Request() req: any, @Body() updateZoneDto: UpdateZoneDto) {

    let updateZoneResult = new UpdateZoneResult();

    let prismaBackendDB = this.backendDate.getPrismaBackendDB();
    let old_ret = await prismaBackendDB.zones.findUnique(
      {
        where: {
          id: updateZoneDto.id
        }
      }
    )

    if (!old_ret) {
      updateZoneResult.msg = "战区ID: " + updateZoneDto.id + "不存在";
      return updateZoneResult;
    }

    if (updateZoneDto.name) {
      let old_ret1 = await prismaBackendDB.zones.findFirst(
        {
          where: {
            name: updateZoneDto.name
          }
        }
      )

      if (old_ret1) {
        updateZoneResult.msg = "战区name: " + updateZoneDto.name + "已存在";
        return updateZoneResult;
      }
    }

    if (updateZoneDto.gameId) {
      let old_ret2 = await prismaBackendDB.zones.findFirst(
        {
          where: {
            gameId: updateZoneDto.gameId
          }
        }
      )

      if (!old_ret2) {
        updateZoneResult.msg = "游戏ID" + updateZoneDto.gameId + "不存在";
        return updateZoneResult;
      }
    }

    let cur_time = cTools.newLocalDateString();
    let save_date = cTools.newSaveLocalDate(new Date(cur_time));

    old_ret = Object.assign(old_ret, updateZoneDto, {
      updatedAt: save_date
    });

    delete old_ret.id;

    let new_ret = await prismaBackendDB.zones.update(
      {
        where: {
          id: updateZoneDto.id
        },
        data: old_ret
      }
    )

    if (new_ret) {
      updateZoneResult.data = Object.assign({}, new_ret, {
        updatedAt: cur_time,
        createdAt: cTools.newLocalDateString(new_ret.createdAt),
      });
      languageConfig.setSuccess(EBActType.UpdateZone, updateZoneResult);
    }
    return updateZoneResult;

  }

  /**
   * 删除战区
   * @param req 
   * @param deleteZoneDto 
   */
  async deleteZone(@Request() req: any, @Body() deleteZoneDto: DeleteZoneDto) {

    let deleteZoneResult = new DeleteZoneResult()

    let prismaBackendDB = this.backendDate.getPrismaBackendDB();
    let old_ret = await prismaBackendDB.zones.findUnique(
      {
        where: {
          id: deleteZoneDto.id
        }
      }
    )

    if (!old_ret) {
      deleteZoneResult.msg = "战区ID:" + deleteZoneDto.id + " 不存在";
      return deleteZoneResult;
    }

    let new_ret = await prismaBackendDB.zones.delete(
      {
        where: {
          id: deleteZoneDto.id
        }
      }
    )

    if (new_ret) {
      languageConfig.setSuccess(EBActType.DeleteZone, deleteZoneResult);
    }

    return deleteZoneResult;
  }
  /**-------------------------------------------------------------------------------- */

  /**
   * 获取公告
   * @param req 
   * @param getNoticeDto 
   */
  async getNotice(@Request() req: any, @Body() getNoticeDto: GetNoticeDto) {

    let getNoticeResult = new GetNoticeResult();

    let prismaBackendDB = this.backendDate.getPrismaBackendDB();
    let game_ret = await prismaBackendDB.games.findFirst(
      {
        where: {
          sku: getNoticeDto.sku
        }
      }
    )

    if (!game_ret) {
      getNoticeResult.msg = `该游戏不存在`;
      return getNoticeResult;
    }

    if (!game_ret.channels) {
      getNoticeResult.msg = `该渠道不存在`;
      return getNoticeResult;
    }

    let channels: channelAppEntity[] = <any>game_ret.channels;

    for (let index = 0; index < channels.length; index++) {
      const element = channels[index];
      if (Number(element.channelAppId) !== getNoticeDto.channelAppId) {
        continue;
      }
      getNoticeResult.data = element.notice;
      languageConfig.setSuccess(EBActType.GetNotice, getNoticeResult);
      break;
    }

    if (!getNoticeResult.data) {
      getNoticeResult.msg = `该渠道不存在`;
      return getNoticeResult;
    }

    return getNoticeResult;

  }

  async sendEmail(@Request() req: any, @Body() beSendEmailDto: BESendEmailDto) {

    let baseResult = new BaseResult();

    let prismaBackendDB = this.backendDate.getPrismaBackendDB();

    let game_ret = await prismaBackendDB.games.findUnique(
      {
        where: {
          id: beSendEmailDto.gameId
        }
      }
    )

    if (!game_ret) {
      baseResult.msg = `该游戏不存在`;
      return baseResult;
    }


    let server_ret = await prismaBackendDB.servers.findFirst(
      {
        where: {
          gameId: beSendEmailDto.gameId,
          serverId: beSendEmailDto.serverid
        }
      }
    )

    if (!server_ret) {
      baseResult.msg = `该游戏服不存在`;
      return baseResult;
    }

    let mains_serverid = this.backendDate.getBEMainServerId(server_ret, beSendEmailDto.serverid);

    if (beSendEmailDto.owner === gameConst.email_globalTag && beSendEmailDto.serverid !== mains_serverid) {
      baseResult.msg = `被合服服务器不能发全服邮件`;
      return baseResult;
    }

    let new_str = `${webApiConstants.secret}|backend|${beSendEmailDto.owner}|${beSendEmailDto.title}|${mains_serverid}|${JSON.stringify(beSendEmailDto.items)}|`;
    let new_md5key = new MD5().hex_md5(new_str).toLowerCase()

    let send_data = Object.assign({}, cloneDeep(beSendEmailDto), {
      key: new_md5key,
      serverid: mains_serverid,
      sender: "backend"
    })

    delete send_data.gameId
    let url = server_ret.gameUrl + "/email/sendEmail";
    let send_ret = await this.backendDate.sendHttpPost(url, send_data)

    languageConfig.setFail(EBActType.SendEmail, baseResult);
    if (send_ret && send_ret.data) {

      if (send_ret.data.ok) {
        languageConfig.setSuccess(EBActType.SendEmail, baseResult);
      }
      else {
        baseResult.msg = send_ret.data.msg || "发送失败";
      }
    }
    return baseResult;
  }

  async beSendRechargeShop(@Request() req: any, @Body() beSendRechargeShopDto: BESendRechargeShopDto) {
    let baseResult = new BaseResult();

    let prismaBackendDB = this.backendDate.getPrismaBackendDB();

    let game_ret = await prismaBackendDB.games.findUnique(
      {
        where: {
          id: beSendRechargeShopDto.gameId
        }
      }
    )

    if (!game_ret) {
      baseResult.msg = `该游戏不存在`;
      return baseResult;
    }

    let server_ret = await prismaBackendDB.servers.findFirst(
      {
        where: {
          gameId: beSendRechargeShopDto.gameId,
          serverId: beSendRechargeShopDto.serverid
        }
      }
    )

    if (!server_ret) {
      baseResult.msg = `该游戏服不存在`;
      return baseResult;
    }

    let mains_serverid = this.backendDate.getBEMainServerId(server_ret, beSendRechargeShopDto.serverid);

    beSendRechargeShopDto.time = new Date().getTime();
    let sgin = `${beSendRechargeShopDto.gameId}${mains_serverid}${beSendRechargeShopDto.shopid}${beSendRechargeShopDto.roleid}${webApiConstants.secret}${beSendRechargeShopDto.time}`;
    let sgin_md5 = new MD5().hex_md5(sgin).toLowerCase();

    let send_data = Object.assign({}, cloneDeep(beSendRechargeShopDto), {
      key: sgin_md5,
      serverid: mains_serverid,
      num: 1
    })

    let url = server_ret.gameUrl + "/shop/beSendRechargeShop";
    let send_ret = await this.backendDate.sendHttpPost(url, send_data)

    if (send_ret && send_ret.data) {

      if (send_ret.data.ok) {
        languageConfig.setSuccess(EBActType.SendCShop, baseResult);
      }
      else {
        baseResult.msg = send_ret.data.msg || "发送失败";
      }
    }
    return baseResult;
  }

  /**
   * 获取聊天记录
   * @param req 
   * @param beGetChatLogDto 
   * @returns 
   */
  async beGetChatLog(@Request() req: any, @Body() beGetChatLogDto: BEGetChatLogDto) {

    let baseResult = new BEGetChatLogResult();
    let prismaBackendDB = this.backendDate.getPrismaBackendDB();
    let game_ret = await prismaBackendDB.games.findUnique(
      {
        where: {
          id: beGetChatLogDto.gameId
        }
      }
    )

    if (!game_ret) {
      baseResult.msg = `该游戏不存在`;
      return baseResult;
    }

    let server_ret = await prismaBackendDB.servers.findFirst(
      {
        where: {
          gameId: beGetChatLogDto.gameId,
          serverId: beGetChatLogDto.serverid
        }
      }
    )

    if (!server_ret) {
      baseResult.msg = `该游戏服不存在`;
      return baseResult;
    }

    let mains_serverid = this.backendDate.getBEMainServerId(server_ret, beGetChatLogDto.serverid);

    beGetChatLogDto.time = new Date().getTime();
    let sgin = `${beGetChatLogDto.gameId}${beGetChatLogDto.serverid}${mains_serverid}${webApiConstants.secret}${beGetChatLogDto.time}`;
    let sgin_md5 = new MD5().hex_md5(sgin).toLowerCase();

    let send_data = Object.assign({}, cloneDeep(beGetChatLogDto), {
      key: sgin_md5,
      serverid: mains_serverid,
    })

    let url = server_ret.gameUrl + "/game-common/getChatLog";
    let send_ret = await this.backendDate.sendHttpPost(url, send_data);

    if (send_ret && send_ret.data) {
      if (send_ret.data.ok) {
        languageConfig.setSuccess(EBActType.getChatLog, baseResult);
        if (send_ret.data.chatlog) {
          baseResult.data = send_ret.data.chatlog;
        }
      }
      else {
        baseResult.msg = send_ret.data.msg || "获取失败";
      }
    }

    return baseResult;
  }

}
