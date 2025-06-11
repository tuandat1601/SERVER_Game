import { Body, Headers, Injectable, Param, Query, Request } from '@nestjs/common';
import { Logger } from 'apps/web-game/src/game-lib/log4js';
import MD5 from 'apps/web-game/src/game-lib/md5';
import { EBActType } from '../../backend-enum';
import { BackendDataService } from '../../data/backend-data/backend-data.service';
import { channelAppEntity, GameEntity } from '../../entity/game.entity';
import { BaseResult, QiPaPayResult } from '../../result/result';
import { ChannelFun, rebate_item } from '../channel.config';
import { ChannelPaymentRet1, SDKLoginCheckDto } from '../channel/entities/channel.entity';
import { QiPaActiveDto, QiPaPaymentDto, QiPaRebateDto } from './dto/qipa.dto';
import { QiPaRet } from './entities/qipa.entity';
import * as xlsx from 'xlsx';
import { cTools } from 'apps/web-game/src/game-lib/tools';
import { languageConfig } from '../../config/language/language';
import { GamesMgrService } from '../../backend-system/games-mgr/games-mgr.service';
import { BESendEmailDto } from '../../backend-system/games-mgr/dto/games-mgr.dto';
import { CHttpOptions_urlencoded } from '../../config/common.config';

@Injectable()
export class QipaService extends ChannelFun {

  constructor(
    private readonly backendDate: BackendDataService,
    private readonly gamesMgrService: GamesMgrService,
  ) {
    super();
  }

  async verifySDKLogin(sdkLoginCheckDto: SDKLoginCheckDto) {

    let send_data = {
      token: sdkLoginCheckDto.user_token,
      super_user_id: sdkLoginCheckDto.mem_id,
    }

    // let md5 = `app_id=${send_data.app_id}&mem_id=${send_data.mem_id}&user_token=${send_data.user_token}&app_key=${sdkLoginCheckDto.app_key}`
    // send_data.sign = new MD5().hex_md5(md5).toLowerCase();

    let ret_data: QiPaRet = await this.backendDate.sendHttpPost(sdkLoginCheckDto.checkUrl, send_data, CHttpOptions_urlencoded);
    //Logger.log(`QipaService verifySDKLogin ret_data:`, ret_data);
    if (ret_data.code === 200) {
      //Logger.log(`ret_data:`, ret_data);
      return true
    }
    else {

      sdkLoginCheckDto.sdkLoginAuthResult.msg = "SDK登录验证失败";
      if (ret_data.msg) {
        sdkLoginCheckDto.sdkLoginAuthResult.msg = ret_data.msg
      }
      Logger.error(`ret_data:`, ret_data);
    }
    return false;
  }

  async payment(@Request() req: any, @Query() qipaPaymentDto: QiPaPaymentDto) {

    let baseResult = new QiPaPayResult();
    baseResult.srctype = EBActType.CPaymentRet;
    baseResult.code = ChannelPaymentRet1.FAILURE;

    let prismaBackendDB = this.backendDate.getPrismaBackendDB();

    //查找订单
    let order = await prismaBackendDB.orders.findUnique(
      {
        where: {
          id: Number(qipaPaymentDto.game_order_sn)
        },
        include: {
          games: true,
          game_backend_user: true,
        }
      }
    )

    if (!order) {
      baseResult.msg = `订单不存在 game_order_sn:${qipaPaymentDto.game_order_sn}`;
      Logger.error(baseResult.msg);
      return baseResult;
    }

    if (order.paid === 1) {
      baseResult.msg = `QipaService payment paid == 1 订单已是支付状态`;
      Logger.error(baseResult.msg);
      baseResult.code = ChannelPaymentRet1.SUCCESS;
      return baseResult;
    }

    let game_backend_user = order.game_backend_user

    if (!game_backend_user) {
      baseResult.msg = `QipaService payment game_backend_user is null gameBackendUserId:${order.gameBackendUserId}`;
      Logger.error(baseResult.msg);
      return baseResult;
    }

    let game = order.games

    if (!game) {
      baseResult.msg = `QipaService payment game is null gameId:${order.gameId}`;
      Logger.error(baseResult.msg);
      return baseResult;
    }

    if (!game.channels) {
      baseResult.msg = `QipaService payment game.channels is null gameId:${order.gameId}`;
      Logger.error(baseResult.msg);
      return baseResult;
    }

    let gameEntity = <GameEntity><unknown>game;
    let cur_channels: channelAppEntity;
    for (let index = 0; index < gameEntity.channels.length; index++) {
      const channels = gameEntity.channels[index];
      if (Number(channels.channelAppId) !== game_backend_user.channelAppId) {
        continue;
      }
      cur_channels = channels;
      break;
    }

    if (!cur_channels) {
      baseResult.msg = `QipaService payment gameId:${order.gameId}渠道(channelAppId:${game_backend_user.channelAppId})不存在`;
      Logger.error(baseResult.msg);
      return baseResult;
    }


    let md5 = `good_name=${encodeURI(qipaPaymentDto.good_name)}&uuid=${qipaPaymentDto.uuid}&order_sn=${qipaPaymentDto.order_sn}&game_order_sn=${qipaPaymentDto.game_order_sn}&game_id=${qipaPaymentDto.game_id}&service_id=${qipaPaymentDto.service_id}&service_name=${encodeURI(qipaPaymentDto.service_name)}&role_id=${qipaPaymentDto.role_id}&role_name=${encodeURI(qipaPaymentDto.role_name)}&pay_money=${qipaPaymentDto.pay_money}&pay_status=${qipaPaymentDto.pay_status}&remark=${encodeURI(qipaPaymentDto.remark)}&time=${qipaPaymentDto.time}&key=${cur_channels.appKey}`

    let cur_sign = new MD5().hex_md5(md5).toLowerCase();
    if (qipaPaymentDto.sign !== cur_sign) {
      Logger.error("md5:", md5);
      baseResult.msg = `QipaService payment  非法md5 sign:${cur_sign}`;
      Logger.error(baseResult.msg);
      return baseResult;
    }


    let shop_info: any = this.backendDate.getShopData(order.shopId, game.sku);

    if (!shop_info) {
      baseResult.msg = `获取订单信息失败,商品:(${order.shopId})不存在`;
      return baseResult;
    }

    if (Number(shop_info.price) !== Number(qipaPaymentDto.pay_money)) {
      baseResult.msg = `QipaService payment  非法商品价格 gametable price:${shop_info.price}  ret pay_money:${qipaPaymentDto.pay_money}`;
      Logger.error(baseResult.msg);
      return baseResult;
    }

    if (Number(qipaPaymentDto.pay_status) !== 1) {
      baseResult.msg = `QipaService payment  支付未成功 pay_status:${qipaPaymentDto.pay_status}`;
      Logger.error(baseResult.msg);
      return baseResult;
    }

    //通知发放充值
    let server = await prismaBackendDB.servers.findFirst(
      {
        where: {
          gameId: order.gameId,
          serverId: order.serverId
        }
      }
    )

    if (!server) {
      baseResult.msg = `QipaService payment  server is null serverId:${order.serverId}`;
      Logger.error(baseResult.msg);
      return baseResult.msg;
    }


    await prismaBackendDB.orders.update(
      {
        where: {
          id: order.id
        },
        data: {
          paid: 1,
          paidTime: cTools.newSaveLocalDate(),
          updatedAt: cTools.newSaveLocalDate()
        }
      }
    )

    languageConfig.setSuccess(EBActType.CPaymentRet, baseResult);
    baseResult.code = ChannelPaymentRet1.SUCCESS;
    return baseResult;
  }

  async rebate(@Request() req: any, @Query() qipaRebateDto: QiPaRebateDto) {


    let prismaBackendDB = this.backendDate.getPrismaBackendDB();

    let baseResult = new QiPaPayResult();
    baseResult.srctype = EBActType.CRebateRet;
    baseResult.code = ChannelPaymentRet1.FAILURE;

    if (!qipaRebateDto.gold || Number(qipaRebateDto.gold) <= 0) {
      baseResult.msg = `qipaRebateDto.gold <=0  gold:${qipaRebateDto.gold}`;
      Logger.error(baseResult.msg);
      return baseResult;
    }

    //查找订单
    let order = await prismaBackendDB.orders.findUnique(
      {
        where: {
          id: Number(qipaRebateDto.game_order_no)
        },
        include: {
          games: true,
          game_backend_user: true,
        }
      }
    )

    if (!order) {
      baseResult.msg = `订单不存在 game_order_no:${qipaRebateDto.game_order_no}`;
      Logger.error(baseResult.msg);
      return baseResult;
    }

    if (order.paid !== 1) {
      baseResult.msg = `订单没有支付`;
      Logger.error(baseResult.msg);
      return baseResult;
    }

    if (order.serverId !== Number(qipaRebateDto.service_id)) {
      baseResult.msg = `服务器ID不一致 order.serverId:${order.serverId} qipaRebateDto.service_id:${qipaRebateDto.service_id}`;
      Logger.error(baseResult.msg);
      return baseResult;
    }

    if (order.gameRoleId !== qipaRebateDto.role_id) {
      baseResult.msg = `角色ID不一致 order.gameRoleId:${order.gameRoleId} qipaRebateDto.role_id:${qipaRebateDto.role_id}`;
      Logger.error(baseResult.msg);
      return baseResult;
    }


    let game_backend_user = order.game_backend_user

    if (!game_backend_user) {
      baseResult.msg = `QipaService rebate game_backend_user is null gameBackendUserId:${order.gameBackendUserId}`;
      Logger.error(baseResult.msg);
      return baseResult;
    }

    let game = order.games

    if (!game) {
      baseResult.msg = `QipaService rebate game is null order.gameId:${order.gameId}`;
      Logger.error(baseResult.msg);
      return baseResult;
    }

    if (!game.channels) {
      baseResult.msg = `QipaService rebate game.channels is null order.gameId:${order.gameId}`;
      Logger.error(baseResult.msg);
      return baseResult;
    }

    let gameEntity = <GameEntity><unknown>game;
    let cur_channels: channelAppEntity;
    for (let index = 0; index < gameEntity.channels.length; index++) {
      const channels = gameEntity.channels[index];
      if (Number(channels.channelAppId) !== game_backend_user.channelAppId) {
        continue;
      }
      cur_channels = channels;
      break;
    }

    if (!cur_channels) {
      baseResult.msg = `QipaService rebate order.gameId:${order.gameId}渠道(channelAppId:${game_backend_user.channelAppId})不存在`;
      Logger.error(baseResult.msg);
      return baseResult;
    }

    if (!cur_channels.rebate_key) {
      baseResult.msg = `QipaService rebate rebate_key is null order.gameId:${order.gameId}渠道id${cur_channels.channelAppId}`;
      Logger.error(baseResult.msg);
      return baseResult;
    }

    let md5 = `${qipaRebateDto.rebate_type}${qipaRebateDto.rebate_no}${encodeURI(qipaRebateDto.game_order_no)}${cur_channels.rebate_key}`;

    let cur_sign = new MD5().hex_md5(md5).toLowerCase();
    if (qipaRebateDto.sign !== cur_sign) {
      baseResult.msg = `QipaService rebate  非法md5  "md5:${md5} sign:${cur_sign}`;
      Logger.error(baseResult.msg);
      return baseResult;
    }

    let ret_rebate = await prismaBackendDB.qipa_rebate.findFirst({
      where: {
        rebate_no: Number(qipaRebateDto.rebate_no)
      }
    })

    if (ret_rebate && ret_rebate.delivered == 1) {
      //已存在 并且已发放奖励
      languageConfig.setSuccess(EBActType.CRebateRet, baseResult);
      baseResult.code = ChannelPaymentRet1.SUCCESS;
      return baseResult
    }

    let dec = "自动返利"

    if (qipaRebateDto.rebate_mode) {

      switch (Number(qipaRebateDto.rebate_mode)) {
        case 1:
          dec = "日常返利";
          break;
        case 2:
          dec = "周末返利";
          break;
        case 3:
          dec = "节假日返利";
          break;
        default:
          break;
      }

    }

    //发送返利邮件
    let beSendEmailDto = {
      gameId: order.gameId,

      key: "123",

      sender: "backend",

      owner: order.gameRoleId,

      serverid: order.serverId,

      title: dec,

      content: dec,

      items: [
        { "i": rebate_item, "n": Number(qipaRebateDto.gold) }
      ]
    }

    let send_ret = await this.gamesMgrService.sendEmail(req, beSendEmailDto);


    if (!send_ret.success) {
      baseResult.msg = send_ret.msg;
      Logger.error(baseResult.msg);

      if (!ret_rebate) {
        await prismaBackendDB.qipa_rebate.create(
          {
            data: {
              cp_gameId: order.gameId,
              service_id: Number(qipaRebateDto.service_id),
              game_id: Number(qipaRebateDto.game_id),
              rebate_no: Number(qipaRebateDto.rebate_no),
              rebate_type: Number(qipaRebateDto.rebate_type),
              game_order_no: qipaRebateDto.game_order_no,
              user_id: qipaRebateDto.user_id,
              role_id: qipaRebateDto.role_id,
              role_name: qipaRebateDto.role_name,
              pay_money: qipaRebateDto.pay_money,
              gold: Number(qipaRebateDto.gold),
              delivered: 0,
              createdAt: cTools.newSaveLocalDate()
            }
          }
        )
      }
      return baseResult;
    }

    if (ret_rebate) {
      await prismaBackendDB.qipa_rebate.update(
        {
          where: {
            id: ret_rebate.id
          },
          data: {
            delivered: 1
          }
        }
      )
    }
    else {
      await prismaBackendDB.qipa_rebate.create(
        {
          data: {
            cp_gameId: order.gameId,
            service_id: Number(qipaRebateDto.service_id),
            game_id: Number(qipaRebateDto.game_id),
            rebate_no: Number(qipaRebateDto.rebate_no),
            rebate_type: Number(qipaRebateDto.rebate_type),
            game_order_no: qipaRebateDto.game_order_no,
            user_id: qipaRebateDto.user_id,
            role_id: qipaRebateDto.role_id,
            role_name: qipaRebateDto.role_name,
            pay_money: qipaRebateDto.pay_money,
            gold: Number(qipaRebateDto.gold),
            delivered: 1,
            createdAt: cTools.newSaveLocalDate()
          }
        }
      )
    }

    languageConfig.setSuccess(EBActType.CRebateRet, baseResult);
    baseResult.code = ChannelPaymentRet1.SUCCESS;
    return baseResult
  }


  async active(@Request() req: any, @Body() qipaActiveDto: QiPaActiveDto) {

    qipaActiveDto.active_id = Number(qipaActiveDto.active_id);
    qipaActiveDto.is_freee = Number(qipaActiveDto.is_freee);
    qipaActiveDto.money = Number(qipaActiveDto.money);
    qipaActiveDto.coupon_amount = Number(qipaActiveDto.coupon_amount);
    qipaActiveDto.game_id = Number(qipaActiveDto.game_id);


    let prismaBackendDB = this.backendDate.getPrismaBackendDB();

    let baseResult = new QiPaPayResult();
    baseResult.srctype = EBActType.CActiceRet;
    baseResult.code = ChannelPaymentRet1.FAILURE;
    baseResult.data = "";

    let ret_active = await prismaBackendDB.qipa_active.findFirst(
      {
        where: {
          active_id: qipaActiveDto.active_id
        }
      }
    )

    if (ret_active && ret_active.delivered == 1) {
      //已经发放过奖励
      languageConfig.setSuccess(EBActType.CActiceRet, baseResult);
      baseResult.msg = "奖励已经发放";
      baseResult.code = ChannelPaymentRet1.SUCCESS;
      return baseResult
    }

    //查找游戏
    let games = await prismaBackendDB.games.findMany();

    if (!games || games.length == 0) {
      baseResult.msg = `game 为空`;
      Logger.error(baseResult.msg);
      return baseResult;
    }

    let cur_game: GameEntity;
    let cur_channels: channelAppEntity;
    for (let index = 0; index < games.length; index++) {
      let element = games[index];
      if (element.channels) {
        cur_game = <GameEntity><unknown>element;
        for (let cidx = 0; cidx < cur_game.channels.length; cidx++) {
          const channels = cur_game.channels[cidx];
          if (Number(channels.appId) !== qipaActiveDto.game_id) {
            continue;
          }
          cur_channels = channels;
          break;
        }
      }

      if (cur_channels) {
        break;
      }
    }

    if (!cur_channels) {
      baseResult.msg = `QipaService active 根据渠道游戏ID,找不到对应的game配置 qipaActiveDto.game_id:${qipaActiveDto.game_id})`;
      Logger.error(baseResult.msg);
      return baseResult;
    }

    if (!cur_channels.serverKey) {
      baseResult.msg = `QipaService active serverKey is null gameId:${cur_game.id} sku:${cur_game.sku}`;
      Logger.error(baseResult.msg);
      return baseResult;
    }

    let cur_server = await prismaBackendDB.servers.findUnique(
      {
        where: {
          gameId_serverId: {
            gameId: cur_game.id,
            serverId: Number(qipaActiveDto.server_id)
          }
        }
      }
    )

    if (!cur_server) {
      baseResult.msg = `QipaService active 服务器不存在 gameId:${cur_game.id} serverid:${qipaActiveDto.server_id}`;
      Logger.error(baseResult.msg);
      return baseResult;
    }


    //签名验证
    let md5 = `${qipaActiveDto.active_id}${qipaActiveDto.is_freee}${qipaActiveDto.money}${qipaActiveDto.title}${qipaActiveDto.content}${qipaActiveDto.player_id}${qipaActiveDto.server_id}${cur_channels.serverKey}`;
    let cur_sign = new MD5().hex_md5(md5).toLowerCase();
    if (qipaActiveDto.sign !== cur_sign) {
      baseResult.msg = `QipaService active  非法md5  "md5:${md5} sign:${cur_sign}`;
      Logger.error(baseResult.msg);
      return baseResult;
    }

    if (!qipaActiveDto.item) {
      baseResult.msg = `QipaService active  qipaActiveDto.item is null`;
      Logger.error(baseResult.msg);
      return baseResult;
    }

    let items = JSON.parse(qipaActiveDto.item);

    let new_item = [];
    for (let index = 0; index < items.length; index++) {
      const element = items[index];
      if (element.mid && element.amount) {
        new_item.push({
          i: element.mid,
          n: element.amount
        })
      }
    }

    if (new_item.length === 0) {
      baseResult.msg = `QipaService active 没有可以发送的道具附近`;
      Logger.error(baseResult.msg);
      return baseResult;
    }

    //发送返利邮件
    let beSendEmailDto = {
      gameId: cur_game.id,

      key: "123",

      sender: "backend",

      owner: qipaActiveDto.player_id,

      serverid: Number(qipaActiveDto.server_id),

      title: qipaActiveDto.title,

      content: qipaActiveDto.content,

      items: new_item
    }
    let send_ret = await this.gamesMgrService.sendEmail(req, beSendEmailDto);

    //数据落地到数据库
    let create_date = Object.assign({}, qipaActiveDto, {
      cp_gameId: cur_game.id,
      server_id: Number(qipaActiveDto.server_id),
      delivered: 0,
      cp_gift_group: qipaActiveDto.cp_gift_group || "0",
      coupon_amount: qipaActiveDto.coupon_amount || 0,
      createdAt: cTools.newSaveLocalDate(),
      active_type: 1,
      role_name: 1
    })

    delete create_date.sign;
    delete create_date.active_type;
    delete create_date.role_name;

    //发送失败处理
    if (!send_ret.success) {
      baseResult.msg = send_ret.msg;
      Logger.error(baseResult.msg);

      await prismaBackendDB.qipa_active.create(
        {
          data: {
            active_id: create_date.active_id,
            cp_gameId: create_date.cp_gameId,
            server_id: create_date.server_id,
            game_id: create_date.game_id,
            is_freee: create_date.is_freee,
            money: create_date.money,
            coupon_amount: create_date.coupon_amount,
            title: create_date.title,
            content: create_date.content,
            player_id: create_date.player_id,
            item: create_date.item,
            order_id: create_date.order_id,
            user_id: create_date.user_id,
            cp_gift_group: create_date.cp_gift_group,
            is_test: create_date.is_test,
            delivered: 0,
            createdAt: cTools.newSaveLocalDate()
          }
        }
      )
      return baseResult;
    }


    //发送成功处理
    if (ret_active) {
      //更新
      await prismaBackendDB.qipa_active.update(
        {
          where: {
            id: ret_active.id
          },
          data: {
            delivered: 1
          }
        }
      )
    }
    else {
      //创建
      await prismaBackendDB.qipa_active.create({
        data: {
          active_id: create_date.active_id,
          cp_gameId: create_date.cp_gameId,
          server_id: create_date.server_id,
          game_id: create_date.game_id,
          is_freee: create_date.is_freee,
          money: create_date.money,
          coupon_amount: create_date.coupon_amount,
          title: create_date.title,
          content: create_date.content,
          player_id: create_date.player_id,
          item: create_date.item,
          order_id: create_date.order_id,
          user_id: create_date.user_id,
          cp_gift_group: create_date.cp_gift_group,
          is_test: create_date.is_test,
          delivered: 1,
          createdAt: cTools.newSaveLocalDate()
        }
      })
    }

    languageConfig.setSuccess(EBActType.CActiceRet, baseResult);
    baseResult.code = ChannelPaymentRet1.SUCCESS;
    return baseResult
  }
}
