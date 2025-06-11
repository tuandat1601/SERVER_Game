import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { ApiBasicAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BECreateCrossServerDto, BEDeleteCrossServerDto } from 'apps/web-backend/src/backend-system/games-mgr/dto/games-mgr.dto';
import { CrossAuthGuard } from 'apps/web-game/src/common/auth/guards/cross-auth.guard';
import { REMsg } from 'apps/web-game/src/game-data/entity/msg.entity';
import { WebCrossServerService } from './web-cross-server.service';

@Controller("cross")
@ApiTags('cross')
@ApiBasicAuth()
export class WebCrossServerController {
  constructor(private readonly webCrossServerService: WebCrossServerService) { }

  // @Get()
  // getHello(): string {
  //   return "getHello";
  // }

  @ApiOperation({ summary: '后台-创建跨服服务器' })
  @ApiResponse({ type: REMsg })
  @Post(`/createCrossServer`)
  @UseGuards(CrossAuthGuard)
  createCrossServer(@Request() req: any, @Body() beCreateCrossServerDto: BECreateCrossServerDto) {
    return this.webCrossServerService.createCrossServer(req, beCreateCrossServerDto);
  }

  @ApiOperation({ summary: '后台-删除跨服服务器' })
  @ApiResponse({ type: REMsg })
  @Post(`/deleteCrossServer`)
  @UseGuards(CrossAuthGuard)
  deleteCrossServer(@Request() req: any, @Body() beDeleteCrossServerDto: BEDeleteCrossServerDto) {
    return this.webCrossServerService.deleteCrossServer(req, beDeleteCrossServerDto);
  }
}

