import { Body, Injectable, Request } from '@nestjs/common';
import { webApiConstants } from 'apps/web-game/src/common/auth/constants';
import { EShopPayType } from 'apps/web-game/src/config/game-enum';
import { Logger } from 'apps/web-game/src/game-lib/log4js';
import MD5 from 'apps/web-game/src/game-lib/md5';
import { cTools } from 'apps/web-game/src/game-lib/tools';
import { NotifyLoginDto } from 'apps/web-game/src/game-system/login/dto/game-login.dto';
import { EBActType, EBServerStatus, EBServerWorkload } from '../../backend-enum';
import { languageConfig } from '../../config/language/language';
import { BackendDataService } from '../../data/backend-data/backend-data.service';
import { channelAppEntity, GameEntity } from '../../entity/game.entity';
import { BEServerInfoEntity, ServerEntity } from '../../entity/server.entity';
import { EChannelType, ChannelFun, ChannelConfigs, SecretKey_UserLoginKey, getGameUserID } from '../channel.config';
import { YltaptapService } from '../yltaptap/yltaptap.service';
import { YouLongService } from '../youlong/youlong.service';
import { GetOrderDto, SDKLoginAuthDto, ServerLoginAuthDto } from './dto/channel.dto';
import { GetOrderResult, SDKLoginAuthResult, SDKLoginCheckDto, ServerLoginAuthResult } from './entities/channel.entity';
import * as xlsx from 'xlsx';
import { QipaService } from '../qipa/qipa.service';
import { BrsdkService } from '../brsdk/brsdk.service';
import { FindReRoles } from 'apps/web-game/src/game-data/entity/common.entity';
import { BEFindRolesDto } from '../../backend-system/games-mgr/dto/games-mgr.dto';
import { FywechatService } from '../fywechat/fywechat.service';
@Injectable()
export class ChannelService extends ChannelFun {

  private channelService: any;

  constructor(
    private readonly backendDate: BackendDataService,
    private readonly yltaptapService: YltaptapService,
    private readonly YouLongService: YouLongService,
    private readonly qipaService: QipaService,
    private readonly brsdkService: BrsdkService,
    private readonly fywechatService: FywechatService,
  ) {
    super();
    this.channelService = {
      [EChannelType.Test]: this,
      [EChannelType.YL_TapTap]: yltaptapService,
      [EChannelType.YouLong]: YouLongService,
      [EChannelType.QiPa]: qipaService,
      [EChannelType.BR_SDK]: brsdkService,
      [EChannelType.FY_WeChat]: fywechatService,
    }
  }


  /**
   * 玩家账号登录验证
   * @param req 
   * @param sdkLoginAuthDto 
   * @returns 
   */
  async SDKLoginAuth(@Request() req: any, @Body() sdkLoginAuthDto: SDKLoginAuthDto) {

    let sdkLoginAuthResult = new SDKLoginAuthResult()

    let prismaBackendDB = this.backendDate.getPrismaBackendDB();

    let game = await prismaBackendDB.games.findFirst(
      {
        where: {
          sku: sdkLoginAuthDto.sku
        }
      }
    )

    if (!game) {
      sdkLoginAuthResult.msg = `该游戏(sku:${sdkLoginAuthDto.sku})不存在`;
      return sdkLoginAuthResult;
    }

    let gameEntity = <GameEntity><unknown>game;
    let client_ip = req.headers["x-real-ip"];
    if (gameEntity.blacklist && gameEntity.blacklist.length > 0) {
      if (gameEntity.blacklist.includes(client_ip)) {
        sdkLoginAuthResult.msg = `您的IP已被封,请联系客服！`;
        return sdkLoginAuthResult;
      }
    }

    let is_white_ip = false;
    if (gameEntity.whitelist && gameEntity.whitelist.length > 0) {
      if (gameEntity.whitelist.includes(client_ip)) {
        is_white_ip = true;
      }
    }

    if (!gameEntity.channels) {
      sdkLoginAuthResult.msg = `该游戏没有渠道数据`;
      return sdkLoginAuthResult;
    }

    let cur_channels: channelAppEntity;
    for (let index = 0; index < gameEntity.channels.length; index++) {
      const channels = gameEntity.channels[index];
      if (Number(channels.channelAppId) !== sdkLoginAuthDto.channelAppId) {
        continue;
      }
      cur_channels = channels;
      break;
    }

    if (!cur_channels) {
      sdkLoginAuthResult.msg = `该渠道(channelAppId:${sdkLoginAuthDto.channelAppId})不存在`;
      return sdkLoginAuthResult;
    }

    //分渠道验证
    let channelFun: ChannelFun = this.channelService[cur_channels.channelType]

    let cur_channel_config = ChannelConfigs[cur_channels.channelType];

    let sdkLoginCheckDto: SDKLoginCheckDto = {
      app_id: cur_channels.appId,
      app_key: cur_channels.appKey,
      server_key: cur_channels.serverKey,
      mem_id: sdkLoginAuthDto.channelUserId,
      user_token: sdkLoginAuthDto.channelToken,
      checkUrl: cur_channel_config.checkUrl,
      sdkLoginAuthResult: sdkLoginAuthResult
    }

    let is_can = await channelFun.verifySDKLogin(sdkLoginCheckDto);
    if (!is_can) {
      sdkLoginAuthResult.msg = sdkLoginCheckDto.sdkLoginAuthResult.msg || `身份验证失败，无效的登录信息!`;
      return sdkLoginAuthResult;
    }

    let time = Date.now();
    let sgin = `${sdkLoginAuthDto.channelUserId}${time}${SecretKey_UserLoginKey}`;
    let sgin_md5 = new MD5().hex_md5(sgin).toLowerCase();

    //let getGameCacheService = this.backendDate.getGameCacheService();
    //await getGameCacheService.setJSON(rKey_serverloginkey(gameEntity.id, cur_channel_config.remark, sdkLoginAuthDto.channelUserId), sgin_md5, 60 * 2);

    let game_backend_user = await prismaBackendDB.game_backend_user.findFirst(
      {
        where: {
          gameId: gameEntity.id,
          channelUserId: sdkLoginAuthDto.channelUserId,
          channelAppId: sdkLoginAuthDto.channelAppId
        }
      }
    );

    let save_date = cTools.newSaveLocalDate();
    if (!game_backend_user) {
      game_backend_user = await prismaBackendDB.game_backend_user.create(
        {
          data: {
            gameId: gameEntity.id,
            channelAppId: sdkLoginAuthDto.channelAppId,
            channelUserId: sdkLoginAuthDto.channelUserId,
            channelType: cur_channels.channelType,
            createdAt: save_date,
            updatedAt: save_date
          }
        }
      )

      if (!game_backend_user) {
        Logger.error(`game_backend_user create error gameId:${gameEntity.id} channelUserId: ${sdkLoginAuthDto.channelUserId}`);
      }
    }

    let login_info = await prismaBackendDB.logins.findFirst(
      {
        where: {
          gameBackendUserId: game_backend_user.id
        }
      }
    );

    let cur_gameUserId = getGameUserID(cur_channel_config, sdkLoginAuthDto.channelUserId);
    let cur_serverLoginToken = `${cur_gameUserId}|${time}|${sgin_md5}`;

    let login_data = {
      gameId: gameEntity.id,
      channelType: cur_channels.channelType,
      channelAppId: cur_channels.channelAppId,
      gameBackendUserId: game_backend_user.id,
      gameUserId: cur_gameUserId,
      ipAddress: client_ip,
      deviceOs: sdkLoginAuthDto.deviceOs,
      deviceVender: sdkLoginAuthDto.deviceVender,
      deviceId: sdkLoginAuthDto.deviceId,
      deviceType: sdkLoginAuthDto.deviceType,
      channelToken: sdkLoginAuthDto.channelToken,
      serverLoginToken: cur_serverLoginToken,
      updatedAt: save_date
    }

    //保存登录信息
    if (login_info) {
      await prismaBackendDB.logins.updateMany(
        {
          where: {
            gameBackendUserId: game_backend_user.id
          },
          data: login_data
        }
      )
    }
    else {
      await prismaBackendDB.logins.create(
        {
          data: login_data
        }
      )
    }

    //把时间已到的待开服修改为开启状态
    await this.backendDate.checkServerIsOpen(gameEntity.id);

    let find_arry = [];
    if (is_white_ip) {
      find_arry = [EBServerStatus.Open, EBServerStatus.Maintain, EBServerStatus.WaitOpen];
    }
    else {
      find_arry = [EBServerStatus.Open, EBServerStatus.Maintain];
    }

    //查找服务器列表
    let server_list = await prismaBackendDB.servers.findMany(
      {
        where: {
          gameId: gameEntity.id,
          status: { in: find_arry },
          // openTime: {
          //   lte: cTools.newTransformToUTC8Date()
          // }

        },
        select: {
          gameId: true,
          zoneId: true,
          serverId: true,
          name: true,
          status: true,
          workload: true,
          isNew: true,
          openTime: true,
          gameUrl: true,
        }
      }
    )

    let gameUrls = {}
    let serverEntityList: ServerEntity[] = <ServerEntity[]><unknown>server_list
    if (serverEntityList) {
      for (let index = 0; index < serverEntityList.length; index++) {
        let element = serverEntityList[index];
        element.openTime = cTools.newLocalDateString(cTools.newTransformToUTCZDate(element.openTime));
        if (is_white_ip && element.status === EBServerStatus.WaitOpen) {
          element.status = EBServerStatus.Open;
        }
        if (!gameUrls[element.gameUrl]) {
          gameUrls[element.gameUrl] = true
        }
        delete element.gameUrl;
      }
    }

    //获取战区
    let zones = await prismaBackendDB.zones.findMany(
      {
        where: {
          gameId: gameEntity.id
        },
        select: {
          id: true,
          name: true
        }
      }
    )

    let roles: FindReRoles = {};
    for (const key in gameUrls) {
      if (Object.prototype.hasOwnProperty.call(gameUrls, key)) {
        let cur_gameUrl = key;
        let url = cur_gameUrl + `/game-common/findRoles`;
        let beFindRolesDto: BEFindRolesDto = {
          sku: sdkLoginAuthDto.sku,
          userId: cur_channels.channelType + "_" + sdkLoginAuthDto.channelUserId,
          time: new Date().getTime()
        }
        let sgin = `${beFindRolesDto.sku}${beFindRolesDto.userId}${webApiConstants.secret}${beFindRolesDto.time}`;
        let sgin_md5 = new MD5().hex_md5(sgin).toLowerCase();
        beFindRolesDto.key = sgin_md5;

        let ret = await this.backendDate.sendHttpPost(url, beFindRolesDto);
        if (ret.data && ret.data.ok) {
          if (ret.data.roles) {
            roles = Object.assign({}, roles, ret.data.roles);
          }
        }
      }
    }

    //爆满的服务器不显示 不能注册
    let new_serverList: ServerEntity[] = [];
    for (let index = 0; index < serverEntityList.length; index++) {
      const serverEntity = serverEntityList[index];

      if (serverEntity.workload === EBServerWorkload.Packed) {
        if (!roles[serverEntity.serverId]) {
          continue;
        }
      }
      new_serverList.push(serverEntity);
    }

    sdkLoginAuthResult.data = {
      serverLoginToken: cur_serverLoginToken,
      serverNF: gameEntity.serverNF,
      server: new_serverList || [],
      user_policy_url: cur_channels.user_policy_url,
      privacy_policy_url: cur_channels.privacy_policy_url,
      zones: zones,
      roles: roles
    }

    languageConfig.setSuccess(EBActType.SDKLoginAuth, sdkLoginAuthResult);
    return sdkLoginAuthResult;
  }

  async verifySDKLogin(sdkLoginCheckDto: SDKLoginCheckDto) {

    return true;
  }

  /**
   * 选服登录验证
   * @param req 
   * @param serverLoginAuthDto 
   * @returns 
   */
  async ServerLoginAuth(@Request() req: any, @Body() serverLoginAuthDto: ServerLoginAuthDto) {

    let serverLoginAuthResult = new ServerLoginAuthResult()

    let prismaBackendDB = this.backendDate.getPrismaBackendDB();

    let login_info = await prismaBackendDB.logins.findFirst(
      {
        where: {
          serverLoginToken: serverLoginAuthDto.serverLoginToken
        },
        include: {
          games: true,
          game_backend_user: true
        }
      }
    );

    if (!login_info) {
      serverLoginAuthResult.msg = `无效的serverLoginToken`;
      return serverLoginAuthResult;
    }

    let last_time = cTools.newTransformToUTCZDate(login_info.updatedAt).getTime()
    let cur_time = new Date().getTime()
    let dif_time = (cur_time - last_time) / 1000
    if (dif_time > 60 * 60 * 1) {
      serverLoginAuthResult.msg = `后台登录验证超时`;
      return serverLoginAuthResult;
    }

    let game = login_info.games;

    if (!game) {
      serverLoginAuthResult.msg = `游戏不存在`;
      return serverLoginAuthResult;
    }

    let gameEntity = <GameEntity><unknown>game;

    if (!gameEntity.secretkey) {
      serverLoginAuthResult.msg = `游戏参数错误`;
      return serverLoginAuthResult;
    }

    let server = await prismaBackendDB.servers.findFirst(
      {
        where: {
          gameId: gameEntity.id,
          serverId: serverLoginAuthDto.serverId
        }
      }
    )

    if (!server) {
      serverLoginAuthResult.msg = `服务器不存在`;
      return serverLoginAuthResult;
    }

    if (server.status !== EBServerStatus.Open) {

      let client_ip = req.headers["x-real-ip"];
      if (gameEntity.whitelist && gameEntity.whitelist.includes(client_ip)) {
        //白名单进入
      }
      else {
        serverLoginAuthResult.msg = `服务器暂未开启`;
        return serverLoginAuthResult;
      }

    }


    if (!server.gameUrl) {
      serverLoginAuthResult.msg = `获取服务器地址失败`;
      return serverLoginAuthResult;
    }


    let game_backend_user = login_info.game_backend_user

    if (!game_backend_user) {
      serverLoginAuthResult.msg = `无效的账号ID`;
      return serverLoginAuthResult;
    }


    if (server.workload === EBServerWorkload.Packed) {
      let roles: FindReRoles = {};
      let cur_gameUrl = server.gameUrl + `/game-common/findRoles`;
      let beFindRolesDto: BEFindRolesDto = {
        sku: gameEntity.sku,
        userId: game_backend_user.channelType + "_" + game_backend_user.channelUserId,
        time: new Date().getTime()
      }
      let sgin1 = `${beFindRolesDto.sku}${beFindRolesDto.userId}${webApiConstants.secret}${beFindRolesDto.time}`;
      let sgin_md51 = new MD5().hex_md5(sgin1).toLowerCase();
      beFindRolesDto.key = sgin_md51;

      let findeRoles_ret = await this.backendDate.sendHttpPost(cur_gameUrl, beFindRolesDto);
      if (findeRoles_ret.data && findeRoles_ret.data.ok) {
        if (findeRoles_ret.data.roles) {
          roles = Object.assign({}, roles, findeRoles_ret.data.roles);
        }
      }

      if (!roles[server.serverId]) {
        serverLoginAuthResult.msg = `服务器已经爆满,已禁止注册新号,请更换其他服务器进入`;
        return serverLoginAuthResult;
      }
    }



    let cur_server_id = serverLoginAuthDto.serverId;

    //let serverEntity: ServerEntity = <ServerEntity><unknown>server;
    // if (serverEntity.info && serverEntity.info.mainId) {

    // }

    let url = server.gameUrl + `/login/notifyLogin`;


    let time = last_time;
    let time2 = new Date().getTime()
    let sgin = `${login_info.channelType}${game_backend_user.channelUserId}${cur_server_id}${time}${webApiConstants.secret}${time2}`;
    let sgin_md5 = new MD5().hex_md5(sgin).toLowerCase();

    let notifyLoginDto: NotifyLoginDto = {
      gameLoginToken: sgin_md5,
      userid: game_backend_user.channelUserId,
      channelType: login_info.channelType,
      serverid: cur_server_id,
      time1: time,
      time2: time2
    }

    let ret = await this.backendDate.sendHttpPost(url, notifyLoginDto);
    serverLoginAuthResult.data = {
      gameLoginToken: sgin_md5,
      gameUrl: server.gameUrl,
      chatIP: server.chatIP
    }

    let login_serverlog = await prismaBackendDB.loginServerLog.findFirst({
      where: {
        gameId: server.gameId,
        serverId: server.serverId,
        gameUserId: login_info.gameUserId
      }
    })

    if (!login_serverlog) {
      await prismaBackendDB.loginServerLog.create({
        data: {
          gameId: server.gameId,
          serverId: server.serverId,
          gameUserId: login_info.gameUserId,
          gameBackendUserId: login_info.gameBackendUserId,
          createdAt: cTools.newSaveLocalDate()
        }
      })
    }

    languageConfig.setSuccess(EBActType.ServerLoginAuth, serverLoginAuthResult);
    return serverLoginAuthResult;
  }

  async GetOrder(@Request() req: any, @Body() getOrderDto: GetOrderDto) {

    //游戏是否存在
    let getOrderResult = new GetOrderResult()

    let shop_info: any = this.backendDate.getShopData(getOrderDto.shopId, getOrderDto.sku);

    if (!shop_info) {
      getOrderResult.msg = `获取订单信息失败,商品:(${getOrderDto.shopId})不存在`;
      return getOrderResult;
    }


    if (Number(shop_info.id) !== getOrderDto.shopId) {
      getOrderResult.msg = `获取订单信息失败,商品ID不匹配。客户端ID:(${getOrderDto.shopId}) 服务器ID:(${shop_info.id})`;
      return getOrderResult;
    }

    let diyshop_data;
    if (getOrderDto.info) {

      if (getOrderDto.info.diyShopIndex && getOrderDto.info.diyShopIndex.length > 0) {

        if (!shop_info.diyshop || shop_info.diyshop < 1) {
          getOrderResult.msg = `获取订单信息失败 商品配置没有自定义商品ID信息`;
          return getOrderResult;
        }

        diyshop_data = this.backendDate.getDiyShopData(Number(shop_info.diyshop), getOrderDto.sku);

        if (!diyshop_data) {
          getOrderResult.msg = `获取订单信息失败 获取自定义商品信息失败1(diyshop:${shop_info.diyshop})`;
          return getOrderResult;
        }

        if (!diyshop_data.items) {
          getOrderResult.msg = `获取订单信息失败 获取自定义商品信息失败2(diyshop:${shop_info.diyshop})`;
          return getOrderResult;
        }
        diyshop_data.items = JSON.parse(diyshop_data.items);
        if (!Array.isArray(diyshop_data.items)) {
          getOrderResult.msg = `获取订单信息失败 获取自定义商品信息失败3(diyshop:${shop_info.diyshop})`;
          return getOrderResult;
        }

        if (!diyshop_data.num) {
          getOrderResult.msg = `获取订单信息失败 获取自定义商品信息失败4(diyshop:${shop_info.diyshop})`;
          return getOrderResult;
        }

        if (getOrderDto.info.diyShopIndex.length > Number(diyshop_data.num)) {
          getOrderResult.msg = `获取订单信息失败 自定义商品数量超过可选数量`;
          return getOrderResult;
        }

        let cur_dataAry: any[] = diyshop_data.items;
        for (let index = 0; index < getOrderDto.info.diyShopIndex.length; index++) {
          const cur_index = getOrderDto.info.diyShopIndex[index];
          if (cur_index >= cur_dataAry.length) {
            getOrderResult.msg = `获取订单信息失败 自定义商品信息异常1(diyshop:${shop_info.diyshop})`;
            return getOrderResult;
          }
        }

      }
    }

    if (Number(shop_info.paytype) !== EShopPayType.RECHARGE) {
      getOrderResult.msg = `获取订单信息失败,商品ID:(${getOrderDto.shopId})不是充值商品`;
      return getOrderResult;
    }

    if (Number(shop_info.price) !== getOrderDto.price) {
      getOrderResult.msg = `获取订单信息失败,商品价格不一致`;
      return getOrderResult;
    }

    if (Number(shop_info.price) <= 0) {
      getOrderResult.msg = `获取订单信息失败,支付商品价格不能小于0`;
      return getOrderResult;
    }

    if (Number(shop_info.free) == 1) {
      getOrderResult.msg = `获取订单信息失败,支付商品不能配置为免费商品`;
      return getOrderResult;
    }

    let prismaBackendDB = this.backendDate.getPrismaBackendDB();

    let game = await prismaBackendDB.games.findFirst(
      {
        where: {
          sku: getOrderDto.sku
        }
      }
    )

    if (!game) {
      getOrderResult.msg = `获取订单信息失败,游戏(sku:${getOrderDto.sku})不存在`;
      return getOrderResult;
    }

    let gameEntity = <GameEntity><unknown>game;
    if (!gameEntity.channels) {
      getOrderResult.msg = `获取订单信息失败,该游戏没有配置渠道数据`;
      return getOrderResult;
    }

    let cur_channels: channelAppEntity;
    for (let index = 0; index < gameEntity.channels.length; index++) {
      const channels = gameEntity.channels[index];
      if (Number(channels.channelAppId) !== getOrderDto.channelAppId) {
        continue;
      }
      cur_channels = channels;
      break;
    }

    if (!cur_channels) {
      getOrderResult.msg = `获取订单信息失败,渠道(channelAppId:${getOrderDto.channelAppId})不存在`;
      return getOrderResult;
    }

    //游戏充值是否开启
    if (!cur_channels.payMentSwitch) {
      getOrderResult.msg = `获取订单信息失败,该渠道充值已经关闭`;
      return getOrderResult;
    }

    //服务器状态
    let server = await prismaBackendDB.servers.findFirst(
      {
        where: {
          gameId: gameEntity.id,
          serverId: getOrderDto.serverId,
        }
      }
    )

    if (!server) {
      getOrderResult.msg = `获取订单信息失败,服务器不存在`;
      return getOrderResult;
    }

    if (server.status !== EBServerStatus.Open) {
      getOrderResult.msg = `获取订单信息失败,服务器没有开启`;
      return getOrderResult;
    }

    let game_backend_user = await prismaBackendDB.game_backend_user.findFirst(
      {
        where: {
          gameId: gameEntity.id,
          channelType: cur_channels.channelType,
          channelUserId: getOrderDto.userId
        }
      }
    )

    if (!game_backend_user) {
      getOrderResult.msg = `获取订单信息失败,无效的userId`;
      return getOrderResult;
    }

    let cur_channel_config = ChannelConfigs[cur_channels.channelType];
    let cur_gameUserId = getGameUserID(cur_channel_config, getOrderDto.userId);

    let save_time = cTools.newTransformToUTC8Date();
    let info = getOrderDto.info || {};
    let order = await prismaBackendDB.orders.create(
      {
        data: {
          gameId: gameEntity.id,
          serverId: getOrderDto.serverId,
          gameBackendUserId: game_backend_user.id,
          gameUserId: cur_gameUserId,
          gameRoleId: getOrderDto.roleId,
          gameRoleName: getOrderDto.roleName,
          shopId: getOrderDto.shopId,
          paidAmount: Number(shop_info.price),
          paid: 0,
          delivered: 0,
          info: <any>info,
          createdAt: save_time,
          updatedAt: save_time
        }
      }
    )

    if (!order) {
      getOrderResult.msg = `获取订单信息失败,创建订单失败`;
      return getOrderResult;
    }

    getOrderResult.data = {
      orderId: order.id
    }

    languageConfig.setSuccess(EBActType.GetOrder, getOrderResult);
    return getOrderResult;
  }
}
