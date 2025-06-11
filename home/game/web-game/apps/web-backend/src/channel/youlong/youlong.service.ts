import { Body, Injectable, Request } from '@nestjs/common';
import { Logger } from 'apps/web-game/src/game-lib/log4js';
import MD5 from 'apps/web-game/src/game-lib/md5';
import { EBActType } from '../../backend-enum';
import { BackendDataService } from '../../data/backend-data/backend-data.service';
import { channelAppEntity, GameEntity } from '../../entity/game.entity';
import { BaseResult } from '../../result/result';
import { ChannelFun } from '../channel.config';
import { ChannelPaymentRet, SDKLoginCheckDto } from '../channel/entities/channel.entity';
import { YouLongPaymentDto } from './dto/youlong.dto';
import { YouLongErrorCode, YouLongRet } from './entities/youlong.entity';
import * as xlsx from 'xlsx';
import { languageConfig } from '../../config/language/language';
import { PayBuyItemDto } from 'apps/web-game/src/game-system/shop/dto/shop.dto';
import { cTools } from 'apps/web-game/src/game-lib/tools';


@Injectable()
export class YouLongService extends ChannelFun {
  constructor(
    private readonly backendDate: BackendDataService,
  ) {
    super();
  }

  async verifySDKLogin(sdkLoginCheckDto: SDKLoginCheckDto) {

    let send_data = {
      app_id: sdkLoginCheckDto.app_id,
      mem_id: sdkLoginCheckDto.mem_id,
      user_token: sdkLoginCheckDto.user_token,
      sign: ""
    }

    let md5 = `app_id=${send_data.app_id}&mem_id=${send_data.mem_id}&user_token=${send_data.user_token}&app_key=${sdkLoginCheckDto.app_key}`

    send_data.sign = new MD5().hex_md5(md5).toLowerCase();


    let ret_data: YouLongRet = await this.backendDate.sendHttpPost(sdkLoginCheckDto.checkUrl, send_data);

    if (ret_data.status === "1") {
      //Logger.log(`ret_data:`, ret_data);
      return true
    }
    else {
      let cur_msg = YouLongErrorCode[Number(ret_data.status)];
      sdkLoginCheckDto.sdkLoginAuthResult.msg = cur_msg;
      Logger.error(`cur_msg:`, cur_msg);
      Logger.error(`ret_data:`, ret_data);
    }
    return false;
  }

  async payment(@Request() req: any, @Body() youlongPaymentDto: YouLongPaymentDto) {

    let baseResult = new BaseResult();
    baseResult.srctype = EBActType.CPaymentRet;

    let prismaBackendDB = this.backendDate.getPrismaBackendDB();

    //查找订单
    let order = await prismaBackendDB.orders.findUnique(
      {
        where: {
          id: Number(youlongPaymentDto.cp_order_id)
        },
        include: {
          games: true,
          game_backend_user: true,
        }
      }
    )

    if (!order) {
      Logger.error(`youlong payment order is null cp_order_id:${youlongPaymentDto.cp_order_id}`);
      baseResult.msg = ChannelPaymentRet.FAILURE;
      return baseResult.msg;
    }

    if (order.paid === 1) {
      Logger.error(`youlong payment paid == 1 订单已是支付状态`);
      baseResult.msg = ChannelPaymentRet.SUCCESS;
      return baseResult.msg;
    }

    let game_backend_user = order.game_backend_user

    if (!game_backend_user) {
      Logger.error(`youlong payment game_backend_user is null gameBackendUserId:${order.gameBackendUserId}`);
      baseResult.msg = ChannelPaymentRet.FAILURE;
      return baseResult.msg;
    }

    let game = order.games

    if (!game) {
      Logger.error(`youlong payment game is null gameId:${order.gameId}`);
      baseResult.msg = ChannelPaymentRet.FAILURE;
      return baseResult.msg;
    }

    if (!game.channels) {
      Logger.error(`youlong payment game.channels is null gameId:${order.gameId}`);
      baseResult.msg = ChannelPaymentRet.FAILURE;
      return baseResult.msg;
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
      Logger.error(`youlong payment gameId:${order.gameId}渠道(channelAppId:${game_backend_user.channelAppId})不存在`);
      baseResult.msg = ChannelPaymentRet.FAILURE;
      return baseResult.msg;
    }


    let md5 = `app_id=${youlongPaymentDto.app_id}&cp_order_id=${youlongPaymentDto.cp_order_id}&mem_id=${youlongPaymentDto.mem_id}&order_id=${youlongPaymentDto.order_id}&order_status=${youlongPaymentDto.order_status}&pay_time=${youlongPaymentDto.pay_time}&product_id=${encodeURI(youlongPaymentDto.product_id)}&product_name=${encodeURI(youlongPaymentDto.product_name)}&product_price=${youlongPaymentDto.product_price}&app_key=${cur_channels.appKey}`

    let cur_sign = new MD5().hex_md5(md5).toLowerCase();
    if (youlongPaymentDto.sign !== cur_sign) {
      Logger.error("md5:", md5);
      Logger.error(`youlong payment  非法md5 sign:${cur_sign}`);
      baseResult.msg = ChannelPaymentRet.FAILURE;
      return baseResult.msg;
    }

    let shop_info: any = this.backendDate.getShopData(Number(youlongPaymentDto.product_id), game.sku);

    if (!shop_info) {
      baseResult.msg = `获取订单信息失败,商品:(${youlongPaymentDto.product_id})不存在`;
      return baseResult;
    }

    if (Number(shop_info.price) !== Number(youlongPaymentDto.product_price)) {
      Logger.error(`youlong payment  非法商品价格 gametable price:${shop_info.price}  ret product_price:${youlongPaymentDto.product_price}`);
      baseResult.msg = ChannelPaymentRet.FAILURE;
      return baseResult.msg;
    }

    if (youlongPaymentDto.order_status !== "2") {
      Logger.error(`youlong payment  支付未成功 order_status:${youlongPaymentDto.order_status}`);
      baseResult.msg = ChannelPaymentRet.FAILURE;
      return baseResult.msg;
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
      Logger.error(`youlong payment  server is null serverId:${order.serverId}`);
      baseResult.msg = ChannelPaymentRet.FAILURE;
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
    baseResult.msg = ChannelPaymentRet.SUCCESS;
    return baseResult.msg;
  }

}
