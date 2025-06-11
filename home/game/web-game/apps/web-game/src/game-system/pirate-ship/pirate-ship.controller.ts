import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { ApiBasicAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { JwtAuthGuard } from '../../common/auth/guards/jwt-auth.guard';
import { RESPSGetRankMsg, RESPSGoActMsg, RESPSSellLvUpMsg, RESPSUpdateDateMsg, RESPSFreshMsg } from '../../game-data/entity/msg.entity';
import { PSGetRankDto, PSGetWelFareAwardDto, PSGoActDto, PSSellLvUpDto, PSUpdateDateDto, PSFreshDto } from './dto/pirate-ship.dto';
import { PirateShipService } from './pirate-ship.service';


@ApiTags('pirate-ship')
@ApiBasicAuth()
@Controller('pirate-ship')
@UseGuards(JwtAuthGuard)
export class PirateShipController {
  constructor(private readonly pirateShipService: PirateShipService) { }

  @ApiOperation({ summary: '夺宝大作战更新数据' })
  @ApiResponse({ type: RESPSUpdateDateMsg })
  @Throttle(3, 1)
  @Post(`/psUpdateDate`)
  async psUpdateDate(@Request() req: any, @Body() psUpdateDateDto: PSUpdateDateDto) {
    return this.pirateShipService.psUpdateDate(req, psUpdateDateDto);
  }

  @ApiOperation({ summary: '夺宝大作战行动' })
  @ApiResponse({ type: RESPSGoActMsg })
  @Throttle(2, 1)
  @Post(`/psGoAct`)
  async psGoAct(@Request() req: any, @Body() psGoActDto: PSGoActDto) {
    return this.pirateShipService.psGoAct(req, psGoActDto);
  }

  @ApiOperation({ summary: '夺宝大作战-领取宝藏福利奖励' })
  @ApiResponse({ type: RESPSGoActMsg })
  @Throttle(1, 1)
  @Post(`/psGetWelFareAward`)
  async psGetWelFareAward(@Request() req: any, @Body() psGetWelFareAwardDto: PSGetWelFareAwardDto) {
    return this.pirateShipService.psGetWelFareAward(req, psGetWelFareAwardDto);
  }

  @ApiOperation({ summary: '夺宝大作战-炮弹升级' })
  @ApiResponse({ type: RESPSSellLvUpMsg })
  @Throttle(4, 1)
  @Post(`/psSellLvUpDto`)
  async psSellLvUpDto(@Request() req: any, @Body() psSellLvUpDto: PSSellLvUpDto) {
    return this.pirateShipService.psSellLvUpDto(req, psSellLvUpDto);
  }

  @ApiOperation({ summary: '夺宝大作战-获取排行榜数据' })
  @ApiResponse({ type: RESPSGetRankMsg })
  @Throttle(1, 1)
  @Post(`/psGetRank`)
  async psGetRank(@Request() req: any, @Body() psGetRankDto: PSGetRankDto) {
    return this.pirateShipService.psGetRank(req, psGetRankDto);
  }

  @ApiOperation({ summary: '海盗船刷新' })
  @ApiResponse({ type: RESPSFreshMsg })
  @Throttle(1, 1)
  @Post(`/psFresh`)
  async psFresh(@Request() req: any, @Body() psFreshDto: PSFreshDto) {
    return this.pirateShipService.psFresh(req);
  }
}
