import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { ApiBasicAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { JwtAuthGuard } from '../../common/auth/guards/jwt-auth.guard';
import { RESGetWelFareDailyAwardMsg, RESGetWelFareLevelAwardMsg, RESGetWelFarePaidDaysAwardMsg } from '../../game-data/entity/msg.entity';
import { GetTimeAwardDto } from '../time-award/dto/time-award.dto';
import { GetWelFareDailyAwardDto, GetWelFareLevelAwardDto, GetWelFarePaidDaysAwardDto } from './dto/welfare.dto';
import { WelfareService } from './welfare.service';

@Controller('welfare')
@ApiTags('welfare')
@ApiBasicAuth()
export class WelfareController {
  constructor(private readonly welfareService: WelfareService) { }

  @ApiOperation({ summary: '获取每日有礼奖励' })
  @ApiResponse({ type: RESGetWelFareDailyAwardMsg })
  @UseGuards(JwtAuthGuard)
  @Throttle(2, 1)
  @Post(`/getWelFareDailyAward`)
  async getWelFareDailyAward(@Request() req: any, @Body() getWelFareDailyAwardDto: GetWelFareDailyAwardDto) {
    return this.welfareService.getWelFareDailyAward(req, getWelFareDailyAwardDto);
  }

  @ApiOperation({ summary: '获取等级奖励' })
  @ApiResponse({ type: RESGetWelFareLevelAwardMsg })
  @UseGuards(JwtAuthGuard)
  @Throttle(2, 1)
  @Post(`/getWelFareLevelAward`)
  async getWelFareLevelAward(@Request() req: any, @Body() getWelFareLevelAwardDto: GetWelFareLevelAwardDto) {
    return this.welfareService.getWelFareLevelAward(req, getWelFareLevelAwardDto);
  }

  @ApiOperation({ summary: '获取积天豪礼奖励' })
  @ApiResponse({ type: RESGetWelFarePaidDaysAwardMsg })
  @UseGuards(JwtAuthGuard)
  @Throttle(2, 1)
  @Post(`/getWelFarePaidDaysAward`)
  async getWelFarePaidDaysAward(@Request() req: any, @Body() getWelFarePaidDaysAwardDto: GetWelFarePaidDaysAwardDto) {
    return this.welfareService.getWelFarePaidDaysAward(req, getWelFarePaidDaysAwardDto);
  }



}
