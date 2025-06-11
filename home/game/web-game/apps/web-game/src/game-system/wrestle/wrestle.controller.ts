import { Controller, Get, Post, Body, Request, UseGuards } from '@nestjs/common';
import { WrestleService } from './wrestle.service';
import { WrestleCardDto, WrestleChgDto, WrestleDto, WrestleGetDto } from './dto/wrestle.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/auth/guards/jwt-auth.guard';
import { Throttle } from '@nestjs/throttler';
import { RESWrestlePKMsg, RESWrestleChgMsg, RESWrestleGetMsg, RESWrestleCardMsg } from '../../game-data/entity/msg.entity';

@ApiTags('wrestle')
@Controller('wrestle')
@UseGuards(JwtAuthGuard)
export class WrestleController {
  constructor(private readonly wrestleService: WrestleService) {}

  @ApiOperation({ summary: '更换对手' })
  @ApiResponse({ type: RESWrestleChgMsg })
  @Throttle(1, 1)
  @Post(`/change`)
  change(@Request() req: any, @Body() dto: WrestleChgDto) {
    return this.wrestleService.change(req, dto);
  }
  
  @ApiOperation({ summary: '角斗PK' })
  @ApiResponse({ type: RESWrestlePKMsg })
  @Throttle(1, 1)
  @Post(`/pk`)
  pk(@Request() req: any, @Body() dto: WrestleDto) {
    return this.wrestleService.pk(req, dto);
  }

  @ApiOperation({ summary: '获取升阶奖励' })
  @ApiResponse({ type: RESWrestleGetMsg })
  @Throttle(1, 1)
  @Post(`/getaward`)
  getaward(@Request() req: any, @Body() dto: WrestleGetDto) {
    return this.wrestleService.getaward(req, dto);
  }

  @ApiOperation({ summary: '角斗卡' })
  @ApiResponse({ type: RESWrestleCardMsg })
  @Throttle(1, 1)
  @Post(`/card`)
  card(@Request() req: any, @Body() dto: WrestleCardDto) {
    return this.wrestleService.card(req, dto);
  }
}
