import { Body, Injectable, Request } from '@nestjs/common';
import { EBActType } from '../../backend-enum';
import { BackendDataService } from '../../data/backend-data/backend-data.service';
import { FyWechatResult } from '../../result/result';
import { ChannelFun, fywechatSignData } from '../channel.config';
import { ChannelPaymentRet2, SDKLoginCheckDto } from '../channel/entities/channel.entity';
import { FywechatPaymenDto } from './dto/fywechat.dto';
import { Logger } from 'apps/web-game/src/game-lib/log4js';
import { channelAppEntity, GameEntity } from '../../entity/game.entity';
import MD5 from 'apps/web-game/src/game-lib/md5';
import { cTools } from 'apps/web-game/src/game-lib/tools';
import { languageConfig } from '../../config/language/language';
import { clone } from 'lodash';

@Injectable()
export class FywechatService extends ChannelFun {

    constructor(
        private readonly backendDate: BackendDataService,
    ) {
        super();
    }

    async verifySDKLogin(sdkLoginCheckDto: SDKLoginCheckDto) {
        return true;
    }

    async payment(@Request() req: any, @Body() fywechatPaymenDto: FywechatPaymenDto) {
        let baseResult = new FyWechatResult();
        baseResult.srctype = EBActType.CPaymentRet;
        baseResult.code = ChannelPaymentRet2.FAILURE;
        baseResult.msg = "失败";

        let prismaBackendDB = this.backendDate.getPrismaBackendDB();

        //查找订单
        let order = await prismaBackendDB.orders.findUnique(
            {
                where: {
                    id: Number(fywechatPaymenDto.extend)
                },
                include: {
                    games: true,
                    game_backend_user: true,
                }
            }
        )

        if (!order) {
            Logger.error(`brsdk payment order is null extend:${fywechatPaymenDto.extend}`);
            baseResult.code = ChannelPaymentRet2.FAILURE;
            return baseResult;
        }

        if (order.paid === 1) {
            Logger.error(`brsdk payment paid == 1 订单已是支付状态`);
            baseResult.code = ChannelPaymentRet2.SUCCESS;
            return baseResult;
        }

        let game_backend_user = order.game_backend_user

        if (!game_backend_user) {
            Logger.error(`brsdk payment game_backend_user is null gameBackendUserId:${order.gameBackendUserId}`);
            baseResult.code = ChannelPaymentRet2.FAILURE;
            return baseResult;
        }

        let game = order.games

        if (!game) {
            Logger.error(`brsdk payment game is null gameId:${order.gameId}`);
            baseResult.code = ChannelPaymentRet2.FAILURE;
            return baseResult;
        }

        if (!game.channels) {
            Logger.error(`brsdk payment game.channels is null gameId:${order.gameId}`);
            baseResult.code = ChannelPaymentRet2.FAILURE;
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
            Logger.error(`brsdk payment gameId:${order.gameId}渠道(channelAppId:${game_backend_user.channelAppId})不存在`);
            baseResult.code = ChannelPaymentRet2.FAILURE;
            return baseResult;
        }

        //MD5验证
        let cur_sign = fywechatSignData(clone(fywechatPaymenDto), cur_channels.serverKey);
        if (fywechatPaymenDto.sign !== cur_sign) {
            //Logger.error("md5:", md5);
            Logger.error(`brsdk payment  非法md5 sign:${cur_sign}`);
            baseResult.code = ChannelPaymentRet2.FAILURE;
            return baseResult;
        }

        let shop_info: any = this.backendDate.getShopData(Number(order.shopId), game.sku);

        if (!shop_info) {
            baseResult.msg = `获取订单信息失败,商品:(${order.shopId})不存在`;
            return baseResult;
        }

        if (Number(shop_info.price) !== Math.floor(Number(fywechatPaymenDto.amount) / 100)) {
            Logger.error(`brsdk payment  非法商品价格 gametable price:${shop_info.price}  ret amount:${fywechatPaymenDto.amount}`);
            baseResult.code = ChannelPaymentRet2.FAILURE;
            return baseResult.msg;
        }

        // if (Number(fywechatPaymenDto.status) !== 1) {
        //     Logger.error(`brsdk payment  支付未成功 status:${fywechatPaymenDto.status}`);
        //     baseResult.code = ChannelPaymentRet2.FAILURE;
        //     return baseResult.msg;
        // }

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
            baseResult.code = ChannelPaymentRet2.FAILURE;
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
        baseResult.code = ChannelPaymentRet2.SUCCESS;
        return baseResult.msg;

    }
}
