import { Body, Injectable, Request } from '@nestjs/common';
import { Logger } from 'apps/web-game/src/game-lib/log4js';
import MD5 from 'apps/web-game/src/game-lib/md5';
import { cTools } from 'apps/web-game/src/game-lib/tools';
import { EBActType } from '../../backend-enum';
import { CHttpOptions_multipart_form_data } from '../../config/common.config';
import { languageConfig } from '../../config/language/language';
import { BackendDataService } from '../../data/backend-data/backend-data.service';
import { channelAppEntity, GameEntity } from '../../entity/game.entity';
import { BaseResult } from '../../result/result';
import { ChannelFun } from '../channel.config';
import { ChannelPaymentRet, SDKLoginCheckDto } from '../channel/entities/channel.entity';
import { BRSdkPaymentDto } from './dto/brsdk.dto';
import { BRSdkErrorCode, BRSdkRet } from './entities/brsdk.entity';

@Injectable()
export class BrsdkService extends ChannelFun {

    constructor(
        private readonly backendDate: BackendDataService,
    ) {
        super();
    }

    async verifySDKLogin(sdkLoginCheckDto: SDKLoginCheckDto) {

        let send_data = {
            appId: sdkLoginCheckDto.app_id,
            token: sdkLoginCheckDto.user_token,
            sign: ""
        }

        let md5 = `${send_data.appId}${send_data.token}${sdkLoginCheckDto.server_key}`

        send_data.sign = new MD5().hex_md5(md5).toLowerCase();


        let ret_data: BRSdkRet = await this.backendDate.sendHttpPost(sdkLoginCheckDto.checkUrl, send_data, CHttpOptions_multipart_form_data);

        if (Number(ret_data.code) === 1) {
            //Logger.log(`ret_data:`, ret_data);
            return true
        }
        else {
            let cur_msg = "code:" + ret_data.code + "msg:" + BRSdkErrorCode[Number(ret_data.code)];
            sdkLoginCheckDto.sdkLoginAuthResult.msg = cur_msg;
            Logger.error(`cur_msg:`, cur_msg);
            Logger.error(`ret_data:`, ret_data);
        }
        return false;
    }

    async payment(@Request() req: any, @Body() brSdkPaymentDto: BRSdkPaymentDto) {

        let baseResult = new BaseResult();
        baseResult.srctype = EBActType.CPaymentRet;

        let prismaBackendDB = this.backendDate.getPrismaBackendDB();

        //查找订单
        let order = await prismaBackendDB.orders.findUnique(
            {
                where: {
                    id: Number(brSdkPaymentDto.extInfo)
                },
                include: {
                    games: true,
                    game_backend_user: true,
                }
            }
        )

        if (!order) {
            Logger.error(`brsdk payment order is null extInfo:${brSdkPaymentDto.extInfo}`);
            baseResult.msg = ChannelPaymentRet.FAILURE;
            return baseResult.msg;
        }

        if (order.paid === 1) {
            Logger.error(`brsdk payment paid == 1 订单已是支付状态`);
            baseResult.msg = ChannelPaymentRet.SUCCESS;
            return baseResult.msg;
        }

        let game_backend_user = order.game_backend_user

        if (!game_backend_user) {
            Logger.error(`brsdk payment game_backend_user is null gameBackendUserId:${order.gameBackendUserId}`);
            baseResult.msg = ChannelPaymentRet.FAILURE;
            return baseResult.msg;
        }

        let game = order.games

        if (!game) {
            Logger.error(`brsdk payment game is null gameId:${order.gameId}`);
            baseResult.msg = ChannelPaymentRet.FAILURE;
            return baseResult.msg;
        }

        if (!game.channels) {
            Logger.error(`brsdk payment game.channels is null gameId:${order.gameId}`);
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
            Logger.error(`brsdk payment gameId:${order.gameId}渠道(channelAppId:${game_backend_user.channelAppId})不存在`);
            baseResult.msg = ChannelPaymentRet.FAILURE;
            return baseResult.msg;
        }


        //let md5 = `${brSdkPaymentDto.appId}${encodeURI(brSdkPaymentDto.userId)}${encodeURI(brSdkPaymentDto.serverId)}${encodeURI(brSdkPaymentDto.roleId)}${encodeURI(brSdkPaymentDto.orderNum)}${brSdkPaymentDto.orderMoneyFen}${encodeURI(brSdkPaymentDto.extInfo)}${brSdkPaymentDto.status}${cur_channels.serverKey}`
        let md5 = `${brSdkPaymentDto.appId}${brSdkPaymentDto.userId}${brSdkPaymentDto.serverId}${brSdkPaymentDto.roleId}${brSdkPaymentDto.orderNum}${brSdkPaymentDto.orderMoneyFen}${(brSdkPaymentDto.extInfo)}${brSdkPaymentDto.status}${cur_channels.serverKey}`
        let cur_sign = new MD5().hex_md5(md5).toLowerCase();
        if (brSdkPaymentDto.sign !== cur_sign) {
            Logger.error("md5:", md5);
            Logger.error(`brsdk payment  非法md5 sign:${cur_sign}`);
            baseResult.msg = ChannelPaymentRet.FAILURE;
            return baseResult.msg;
        }

        let shop_info: any = this.backendDate.getShopData(Number(order.shopId), game.sku);

        if (!shop_info) {
            baseResult.msg = `获取订单信息失败,商品:(${order.shopId})不存在`;
            return baseResult;
        }

        if (Number(shop_info.price) !== Math.floor(Number(brSdkPaymentDto.orderMoneyFen) / 100)) {
            Logger.error(`brsdk payment  非法商品价格 gametable price:${shop_info.price}  ret orderMoneyFen:${brSdkPaymentDto.orderMoneyFen}`);
            baseResult.msg = ChannelPaymentRet.FAILURE;
            return baseResult.msg;
        }

        if (Number(brSdkPaymentDto.status) !== 1) {
            Logger.error(`brsdk payment  支付未成功 status:${brSdkPaymentDto.status}`);
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
            Logger.error(`brsdk payment  server is null serverId:${order.serverId}`);
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
