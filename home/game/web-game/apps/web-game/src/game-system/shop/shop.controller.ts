import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { ApiBasicAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { BESendRechargeShopDto } from 'apps/web-backend/src/backend-system/games-mgr/dto/games-mgr.dto';
import { JwtAuthGuard } from '../../common/auth/guards/jwt-auth.guard';
import { WebApiAuthGuard } from '../../common/auth/guards/webapi-auth.guard';
import { RESBuyItemMsg, RESFundEboxGetAwardMsg, RESFundLevelGetAwardMsg, RESGetMonthCardAwardMsg, RESRechargeGiftMsg } from '../../game-data/entity/msg.entity';
import { BuyItemDto, FundEboxGetAwardDto, FundLevelGetAwardDto, GetMonthCardAwardDto, NotifyRechargePayShopDto, PayBuyItemDto, RechargeGiftDto } from './dto/shop.dto';
import { ShopService } from './shop.service';

@Controller('shop')
@ApiTags('shop')
@ApiBasicAuth()
export class ShopController {
  constructor(private readonly shopService: ShopService) { }

  @ApiOperation({ summary: '商品购买' })
  @ApiResponse({ type: RESBuyItemMsg })
  @UseGuards(JwtAuthGuard)
  @Post(`/buyItem`)
  async buyItem(@Request() req: any, @Body() buyItemDto: BuyItemDto) {
    return this.shopService.buyItem(req, buyItemDto);
  }

  @Throttle(2, 1)
  @ApiOperation({ summary: '商品购买 限速商品只能调用这个函数' })
  @ApiResponse({ type: RESBuyItemMsg })
  @UseGuards(JwtAuthGuard)
  @Post(`/buyItemSp`)
  async buyItemSp(@Request() req: any, @Body() buyItemDto: BuyItemDto) {
    return this.shopService.buyItemSp(req, buyItemDto);
  }

  //@ApiOperation({ summary: '通知充值购买商品' })
  //@ApiResponse({ type: RESBuyItemMsg })
  @Throttle(30, 1)
  @UseGuards(JwtAuthGuard)
  @Post(`/notifyRechargePayShop`)
  async notifyRechargePayShop(@Request() req: any, @Body() notifyRechargePayShopDto: NotifyRechargePayShopDto) {
    return this.shopService.notifyRechargePayShop(req, notifyRechargePayShopDto);
  }

  @UseGuards(WebApiAuthGuard)
  @Post(`/beSendRechargeShop`)
  async beSendRechargeShop(@Request() req: any, @Body() beSendRechargeShopDto: BESendRechargeShopDto) {
    return this.shopService.beSendRechargeShop(req, beSendRechargeShopDto);
  }


  @ApiOperation({ summary: '领取月卡奖励' })
  @ApiResponse({ type: RESGetMonthCardAwardMsg })
  @UseGuards(JwtAuthGuard)
  @Throttle(2, 1)
  @Post(`/getMonthCardAward`)
  async getMonthCardAward(@Request() req: any, @Body() getMonthCardAwardDto: GetMonthCardAwardDto) {
    return this.shopService.getMonthCardAward(req, getMonthCardAwardDto);
  }

  @ApiOperation({ summary: '领取终身卡奖励' })
  @ApiResponse({ type: RESGetMonthCardAwardMsg })
  @UseGuards(JwtAuthGuard)
  @Throttle(2, 1)
  @Post(`/getForeverCardAward`)
  async getForeverCardAward(@Request() req: any, @Body() getMonthCardAwardDto: GetMonthCardAwardDto) {
    return this.shopService.getForeverCardAward(req, getMonthCardAwardDto);
  }

  @ApiOperation({ summary: '领取等级基金奖励' })
  @ApiResponse({ type: RESFundLevelGetAwardMsg })
  @UseGuards(JwtAuthGuard)
  @Throttle(2, 1)
  @Post(`/fundLevelGetAward`)
  async fundLevelGetAward(@Request() req: any, @Body() fundLevelGetAwardDto: FundLevelGetAwardDto) {
    return this.shopService.fundLevelGetAward(req, fundLevelGetAwardDto);
  }

  @ApiOperation({ summary: '领取锻造基金奖励' })
  @ApiResponse({ type: RESFundEboxGetAwardMsg })
  @UseGuards(JwtAuthGuard)
  @Throttle(2, 1)
  @Post(`/fundEboxGetAward`)
  async fundEboxGetAward(@Request() req: any, @Body() fundEboxGetAwardDto: FundEboxGetAwardDto) {
    return this.shopService.fundEboxGetAward(req, fundEboxGetAwardDto);
  }

  @ApiOperation({ summary: '领取累充礼包奖励' })
  @ApiResponse({ type: RESRechargeGiftMsg })
  @UseGuards(JwtAuthGuard)
  @Throttle(4, 1)
  @Post(`/rechargeGift`)
  async rechargeGift(@Request() req: any, @Body() rechargeGiftDto: RechargeGiftDto) {
    return this.shopService.rechargeGift(req, rechargeGiftDto);
  }
}
