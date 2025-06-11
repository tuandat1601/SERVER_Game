import { Controller, Get, Post, ParseIntPipe, Param, UseGuards, Req, Request, Body } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from './common/auth/guards/jwt-auth.guard';
import { REMsg, RESChangeMsg } from './game-data/entity/msg.entity';
import { GetresetDailyDto } from './app.dto';
import { Throttle } from '@nestjs/throttler';


@ApiTags()
@ApiBearerAuth()//需要认证的API
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }
  @ApiOperation({ summary: '客户端根据登录时间来判断 隔天后 请求每日重置数据' })
  @ApiResponse({ type: RESChangeMsg })
  @UseGuards(JwtAuthGuard)
  @Throttle(1, 5)
  @Post(`/getResetDaily`)
  async getResetDaily(@Request() req: any, @Body() getresetDailyDto: GetresetDailyDto) {
    return this.appService.getResetDaily(req, getresetDailyDto);
  }

  // @Post()
  // async text(@Request() req: any, @Body() data: any) {
  //   console.log("data:")
  //   console.log(data)
  //   return { ok: true }
  // }
}
