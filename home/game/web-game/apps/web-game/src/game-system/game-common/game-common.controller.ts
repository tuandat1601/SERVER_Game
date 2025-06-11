import { Controller, Get, Post, Body, Patch, Param, Delete, Request, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UpdateRoleStatusDto } from 'apps/web-backend/src/backend-system/customer-service/dto/customer-service.dto';
import { CreateServerDto, DeleteServerDto, ChangeServerStatusDto, UpdateServerDto, UpdateToServerDto, MergeServerDto, AutoMaintainServerDto, AutoOpenServerDto, BEFindRolesDto, BEGetChatLogDto, BESetCrossServerIdDto } from 'apps/web-backend/src/backend-system/games-mgr/dto/games-mgr.dto';
import { GMAuthGuard } from '../../common/auth/guards/gm-auth.guard';
import { JwtAuthGuard } from '../../common/auth/guards/jwt-auth.guard';
import { WebApiAuthGuard } from '../../common/auth/guards/webapi-auth.guard';
import { REMsg, RESFindRolesMsg, RESGetChatLogMsg, RESSysOpenAwardMsg } from '../../game-data/entity/msg.entity';
import { GMChangeLoginDto, GMPSStartDaysDto, GMServerStartDaysDto, GMAddRoleExpDto, GMSendEmailDto, GMArenaSeasonEndDto, GMFinishTaskDto, GetSysOpenAwardDto } from './dto/game-common.dto';
import { GameCommonService } from './game-common.service';


@Controller('game-common')
@ApiTags('game-common')
export class GameCommonController {
  constructor(private readonly gameCommonService: GameCommonService) { }

  @ApiOperation({ summary: '修改开服天数' })
  @ApiResponse({ type: REMsg })
  @Post(`gmServerStartDays`)
  @UseGuards(JwtAuthGuard, GMAuthGuard)
  gmServerStartDays(@Request() req: any, @Body() gmServerStartDaysDto: GMServerStartDaysDto) {
    return this.gameCommonService.gmServerStartDays(req, gmServerStartDaysDto);
  }

  @ApiOperation({ summary: '修改夺宝大作战-赛季已开始天数' })
  @ApiResponse({ type: REMsg })
  @Post(`gmPSStartDaysDto`)
  @UseGuards(JwtAuthGuard, GMAuthGuard)
  gmPSStartDaysDto(@Request() req: any, @Body() gmPSStartDaysDto: GMPSStartDaysDto) {
    return this.gameCommonService.gmPSStartDaysDto(req, gmPSStartDaysDto);
  }

  @ApiOperation({ summary: '修改登录天数' })
  @ApiResponse({ type: REMsg })
  @Post(`gmChangeLogin`)
  @UseGuards(JwtAuthGuard, GMAuthGuard)
  gmChangeLogin(@Request() req: any, @Body() gmChangeLoginDto: GMChangeLoginDto) {
    return this.gameCommonService.gmChangeLogin(req, gmChangeLoginDto);
  }

  @ApiOperation({ summary: '添加角色经验' })
  @ApiResponse({ type: REMsg })
  @Post(`gmAddRoleExpDto`)
  @UseGuards(JwtAuthGuard, GMAuthGuard)
  gmAddRoleExpDto(@Request() req: any, @Body() gmAddRoleExpDto: GMAddRoleExpDto) {
    return this.gameCommonService.gmAddRoleExpDto(req, gmAddRoleExpDto);
  }

  @ApiOperation({ summary: 'GM发邮件' })
  @ApiResponse({ type: REMsg })
  @Post(`gmSendEmailDto`)
  @UseGuards(JwtAuthGuard, GMAuthGuard)
  gmSendEmailDto(@Request() req: any, @Body() gmSendEmailDto: GMSendEmailDto) {
    return this.gameCommonService.gmSendEmailDto(req, gmSendEmailDto);
  }

  @ApiOperation({ summary: '竞技场赛季结束' })
  @ApiResponse({ type: REMsg })
  @Post(`gmArenaSeasonEndDto`)
  @UseGuards(JwtAuthGuard, GMAuthGuard)
  gmArenaSeasonEndDto(@Request() req: any, @Body() gmArenaSeasonEndDto: GMArenaSeasonEndDto) {
    return this.gameCommonService.gmArenaSeasonEndDto(req, gmArenaSeasonEndDto);
  }

  @ApiOperation({ summary: 'GM完成当前主线任务' })
  @ApiResponse({ type: REMsg })
  @Post(`gmFinishTask`)
  @UseGuards(JwtAuthGuard, GMAuthGuard)
  gmFinishTask(@Request() req: any, @Body() gmFinishTaskDto: GMFinishTaskDto) {
    return this.gameCommonService.gmFinishTask(req, gmFinishTaskDto);
  }


  @ApiOperation({ summary: '后台专用-创建服务器' })
  @ApiResponse({ type: REMsg })
  @Post(`createServer`)
  @UseGuards(WebApiAuthGuard)
  createServer(@Request() req: any, @Body() createServerDto: CreateServerDto) {
    return this.gameCommonService.createServer(req, createServerDto);
  }

  @ApiOperation({ summary: '后台专用-同步数据' })
  @ApiResponse({ type: REMsg })
  @Post(`updateToServer`)
  @UseGuards(WebApiAuthGuard)
  updateToServer(@Request() req: any, @Body() updateToServerDto: UpdateToServerDto) {
    return this.gameCommonService.updateToServer(req, updateToServerDto);
  }

  @ApiOperation({ summary: '后台专用-修改服务器' })
  @ApiResponse({ type: REMsg })
  @Post(`updateServer`)
  @UseGuards(WebApiAuthGuard)
  updateServer(@Request() req: any, @Body() updateServerDto: UpdateServerDto) {
    return this.gameCommonService.updateServer(req, updateServerDto);
  }

  @ApiOperation({ summary: '后台专用-删除服务器' })
  @ApiResponse({ type: REMsg })
  @Post(`deleteServer`)
  @UseGuards(WebApiAuthGuard)
  deleteServer(@Request() req: any, @Body() deleteServerDto: DeleteServerDto) {
    return this.gameCommonService.deleteServer(req, deleteServerDto);
  }

  @ApiOperation({ summary: '后台专用-修改角色封禁状态' })
  @ApiResponse({ type: REMsg })
  @UseGuards(WebApiAuthGuard)
  @Post('/updateRoleStatus')
  updateRoleStatus(@Body() updateRoleStatusDto: UpdateRoleStatusDto) {
    return this.gameCommonService.updateRoleStatus(updateRoleStatusDto);
  }

  @ApiOperation({ summary: '后台专用-开启服务器通知' })
  @ApiResponse({ type: REMsg })
  @Post(`changeServerStatus`)
  @UseGuards(WebApiAuthGuard)
  changeServerStatus(@Request() req: any, @Body() changeServerStatusDto: ChangeServerStatusDto) {
    return this.gameCommonService.changeServerStatus(req, changeServerStatusDto);
  }

  @ApiOperation({ summary: '后台专用-合服通知' })
  @ApiResponse({ type: REMsg })
  @Post(`mergeServer`)
  @UseGuards(WebApiAuthGuard)
  mergeServer(@Request() req: any, @Body() mergeServerDto: MergeServerDto) {
    return this.gameCommonService.mergeServer(req, mergeServerDto);
  }

  @ApiOperation({ summary: '后台专用-一键开启改维护' })
  @ApiResponse({ type: REMsg })
  @Post(`autoMaintainServer`)
  @UseGuards(WebApiAuthGuard)
  autoMaintainServer(@Request() req: any, @Body() autoMaintainServerDto: AutoMaintainServerDto) {
    return this.gameCommonService.autoMaintainServer(req, autoMaintainServerDto);
  }


  @ApiOperation({ summary: '后台专用-一键维护改开启' })
  @ApiResponse({ type: REMsg })
  @Post(`autoOpenServer`)
  @UseGuards(WebApiAuthGuard)
  autoOpenServer(@Request() req: any, @Body() autoOpenServerDto: AutoOpenServerDto) {
    return this.gameCommonService.autoOpenServer(req, autoOpenServerDto);
  }

  @ApiOperation({ summary: '后台专用-查找角色信息列表' })
  @ApiResponse({ type: RESFindRolesMsg })
  @Post(`findRoles`)
  @UseGuards(WebApiAuthGuard)
  findRoles(@Request() req: any, @Body() beFindRolesDto: BEFindRolesDto) {
    return this.gameCommonService.findRoles(req, beFindRolesDto);
  }

  @ApiOperation({ summary: '后台专用-获取服务器聊天记录' })
  @ApiResponse({ type: RESGetChatLogMsg })
  @Post(`getChatLog`)
  @UseGuards(WebApiAuthGuard)
  getChatLog(@Request() req: any, @Body() beGetChatLogDto: BEGetChatLogDto) {
    return this.gameCommonService.getChatLog(req, beGetChatLogDto);
  }

  @ApiOperation({ summary: '后台专用-设置服务器跨服ID' })
  @ApiResponse({ type: REMsg })
  @Post(`setCrossServerId`)
  @UseGuards(WebApiAuthGuard)
  setCrossServerId(@Request() req: any, @Body() beSetCrossServerIdDto: BESetCrossServerIdDto) {
    return this.gameCommonService.setCrossServerId(req, beSetCrossServerIdDto);
  }

  @ApiOperation({ summary: '领取系统开放(历程)奖励' })
  @ApiResponse({ type: RESSysOpenAwardMsg })
  @UseGuards(JwtAuthGuard)
  @Post(`getSysOpenAward`)
  async getSysOpenAward(@Request() req: any, @Body() reqbody: GetSysOpenAwardDto) {
    return this.gameCommonService.getSysOpenAward(req, reqbody);
  }
}


