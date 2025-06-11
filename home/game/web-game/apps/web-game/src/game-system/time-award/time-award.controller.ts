import { Controller, Get, Post, Body, Patch, Param, Delete, Request, UseGuards } from '@nestjs/common';
import { ApiBasicAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { JwtAuthGuard } from '../../common/auth/guards/jwt-auth.guard';
import { RESGetQuickTimeAwardMsg, RESGetTimeAwardMsg } from '../../game-data/entity/msg.entity';
import { GetQuickTimeAwardDto, GetTimeAwardDto } from './dto/time-award.dto';
import { TimeAwardService } from './time-award.service';

@Controller('time-award')
@ApiTags('time-award')
@ApiBasicAuth()
export class TimeAwardController {
  constructor(private readonly timeAwardService: TimeAwardService) { }

  @ApiOperation({ summary: '获取挂机累计时间奖励' })
  @ApiResponse({ type: RESGetTimeAwardMsg })
  @UseGuards(JwtAuthGuard)
  @Throttle(3, 1)
  @Post(`/getTimeAward`)
  async getTimeAward(@Request() req: any, @Body() getTimeAwardDto: GetTimeAwardDto) {
    return this.timeAwardService.getTimeAward(req, getTimeAwardDto);
  }

  @ApiOperation({ summary: '获取快速挂机时间奖励' })
  @ApiResponse({ type: RESGetQuickTimeAwardMsg })
  @UseGuards(JwtAuthGuard)
  @Throttle(4, 1)
  @Post(`/getQuickTimeAward`)
  async getQuickTimeAward(@Request() req: any, @Body() getQuickTimeAwardDto: GetQuickTimeAwardDto) {
    return this.timeAwardService.getQuickTimeAward(req, getQuickTimeAwardDto);
  }

  @ApiOperation({ summary: '获取钻石快速挂机信息' })
  @ApiResponse({ type: RESGetQuickTimeAwardMsg })
  @UseGuards(JwtAuthGuard)
  @Throttle(4, 1)
  @Post(`/getDiamondAwardInfo`)
  async getDiamondAwardInfo(@Request() req: any, @Body() getQuickTimeAwardDto: GetQuickTimeAwardDto) {
    return this.timeAwardService.getDiamondAwardInfo(req, getQuickTimeAwardDto);
  }

  @ApiOperation({ summary: '获取钻石快速挂机时间奖励' })
  @ApiResponse({ type: RESGetQuickTimeAwardMsg })
  @UseGuards(JwtAuthGuard)
  @Throttle(4, 1)
  @Post(`/getDiamondAward`)
  async getDiamondAward(@Request() req: any, @Body() getQuickTimeAwardDto: GetQuickTimeAwardDto) {
    return this.timeAwardService.getDiamondAward(req, getQuickTimeAwardDto);
  }

}
