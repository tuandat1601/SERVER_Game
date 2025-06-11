import { Controller, Get, Post, Body, Patch, Param, Delete, Request } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { ChannelService } from './channel.service';
import { GetOrderDto, SDKLoginAuthDto, ServerLoginAuthDto } from './dto/channel.dto';
import { GetOrderResult, SDKLoginAuthResult, ServerLoginAuthResult } from './entities/channel.entity';

@ApiTags('channel')
@Controller('channel')
export class ChannelController {
  constructor(private readonly channelService: ChannelService) { }

  @ApiOperation({ summary: 'SDK账号登录验证' })
  @ApiResponse({ type: SDKLoginAuthResult })
  @Post(`/SDKLoginAuth`)
  SDKLoginAuth(@Request() req: any, @Body() sdkLoginAuthDto: SDKLoginAuthDto) {
    return this.channelService.SDKLoginAuth(req, sdkLoginAuthDto);
  }

  @ApiOperation({ summary: '玩家选服登录验证' })
  @ApiResponse({ type: ServerLoginAuthResult })
  @Post(`/ServerLoginAuth`)
  ServerLoginAuth(@Request() req: any, @Body() serverLoginAuthDto: ServerLoginAuthDto) {
    return this.channelService.ServerLoginAuth(req, serverLoginAuthDto);
  }

  @ApiOperation({ summary: '获取订单' })
  @ApiResponse({ type: GetOrderResult })
  @Post(`/GetOrder`)
  @Throttle(5, 1)
  GetOrder(@Request() req: any, @Body() getOrderDto: GetOrderDto) {
    return this.channelService.GetOrder(req, getOrderDto);
  }

}
