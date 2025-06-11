import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { ApiBasicAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SendEmailDto } from 'apps/web-game/src/game-system/email/dto/email-system.dto';
import { EUserRoleType } from '../../backend-enum';
import { JwtAuthGuard } from '../../common/auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/auth/guards/roles.guard';
import { Roles } from '../../common/decorator/roles.decorator';
import { BaseResult, BEGetChatLogResult, CreateServerResult, CreateZoneResult, GameResult, GetChannelResult, GetGameListResult, GetNoticeResult, GetServerResult, GetZoneResult, SetSetAutoOpenServerResult, UpdateServerResult, UpdateZoneResult } from '../../result/result';
import { AutoMaintainServerDto, AutoOpenServerDto, BEGetChatLogDto, BESendEmailDto, BESendRechargeShopDto, BECreateCrossServerDto, CreateGameDto, CreateServerDto, CreateZoneDto, BEDeleteCrossServerDto, DeleteGameDto, DeleteServerDto, DeleteZoneDto, GetNoticeDto, GetServerListDto, GetZoneListDto, MergeServerDto, BESetCrossServerIdDto, BESetServerChatIPDto, UpdateGameDto, UpdateNoticeDto, UpdateServerDto, UpdateToServerDto, UpdateZoneDto, BESetAutoOpenServerDto } from './dto/games-mgr.dto';
import { GamesMgrService } from './games-mgr.service';
@Controller('games-mgr')
@ApiTags('games-mgr')
@ApiBasicAuth()
export class GamesMgrController {
  constructor(private readonly gamesMgrService: GamesMgrService) { }

  @ApiOperation({ summary: '获取游戏列表' })
  @ApiResponse({ type: GetGameListResult })
  @Post(`/getGameList`)
  @Roles(EUserRoleType.Admin, EUserRoleType.Operations)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  getGameList(@Request() req: any) {
    return this.gamesMgrService.getGameList(req);
  }

  @ApiOperation({ summary: '创建游戏' })
  @ApiResponse({ type: GameResult })
  @Post(`/createGame`)
  @Roles(EUserRoleType.Admin)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  createGame(@Request() req: any, @Body() createGameDto: CreateGameDto) {
    return this.gamesMgrService.createGame(req, createGameDto);
  }

  @ApiOperation({ summary: '修改游戏' })
  @ApiResponse({ type: BaseResult })
  @Post(`/updateGame`)
  @Roles(EUserRoleType.Admin)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  updateGame(@Request() req: any, @Body() updateGameDto: UpdateGameDto) {
    return this.gamesMgrService.updateGame(req, updateGameDto);
  }

  @ApiOperation({ summary: '修改公告' })
  @ApiResponse({ type: BaseResult })
  @Post(`/updateNotice`)
  @Roles(EUserRoleType.Admin, EUserRoleType.Operations)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  updateNotice(@Request() req: any, @Body() updateNoticeDto: UpdateNoticeDto) {
    return this.gamesMgrService.updateNotice(req, updateNoticeDto);
  }


  @ApiOperation({ summary: '删除游戏' })
  @ApiResponse({ type: BaseResult })
  @Post(`/deleteGame`)
  @Roles(EUserRoleType.Admin)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  deleteGame(@Request() req: any, @Body() deleteGameDto: DeleteGameDto) {
    return this.gamesMgrService.deleteGame(req, deleteGameDto);
  }

  @ApiOperation({ summary: '创建跨服' })
  @ApiResponse({ type: BaseResult })
  @Post(`/createCrossServer`)
  @Roles(EUserRoleType.Admin)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  createCrossServer(@Request() req: any, @Body() createCrossServerDto: BECreateCrossServerDto) {
    return this.gamesMgrService.createCrossServer(req, createCrossServerDto);
  }

  @ApiOperation({ summary: '删除跨服' })
  @ApiResponse({ type: BaseResult })
  @Post(`/deleteCrossServer`)
  @Roles(EUserRoleType.Admin)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  deleteCrossServer(@Request() req: any, @Body() deleteCrossServerDto: BEDeleteCrossServerDto) {
    return this.gamesMgrService.deleteCrossServer(req, deleteCrossServerDto);
  }

  /**----------------------------------渠道------------------------------------- */
  @ApiOperation({ summary: '获取渠道列表' })
  @ApiResponse({ type: GetChannelResult })
  @Post(`/getChannelList`)
  @Roles(EUserRoleType.Admin, EUserRoleType.Operations)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  getChannelList(@Request() req: any) {
    return this.gamesMgrService.getChannelList(req);
  }

  // @ApiOperation({ summary: '创建渠道' })
  // @ApiResponse({ type: CreateChannelResult })
  // @Post(`/createChannel`)
  // @Roles(EUserRoleType.Admin)
  // @UseGuards(RolesGuard)
  // @UseGuards(JwtAuthGuard)
  // createChannel(@Request() req: any, @Body() createChannelDto: CreateChannelDto) {
  //   return this.gamesMgrService.createChannel(req, createChannelDto);
  // }

  // @ApiOperation({ summary: '修改渠道' })
  // @ApiResponse({ type: UpdateChannelResult })
  // @Post(`/updateChannel`)
  // @Roles(EUserRoleType.Admin)
  // @UseGuards(RolesGuard)
  // @UseGuards(JwtAuthGuard)
  // updateChannel(@Request() req: any, @Body() updateChannelDto: UpdateChannelDto) {
  //   return this.gamesMgrService.updateChannel(req, updateChannelDto);
  // }


  // @ApiOperation({ summary: '删除渠道' })
  // @ApiResponse({ type: BaseResult })
  // @Post(`/deleteChannel`)
  // @Roles(EUserRoleType.Admin)
  // @UseGuards(RolesGuard)
  // @UseGuards(JwtAuthGuard)
  // deleteChannel(@Request() req: any, @Body() deleteChannelDto: DeleteChannelDto) {
  //   return this.gamesMgrService.deleteChannel(req, deleteChannelDto);
  // }

  /**--------------------服务器列表--------------------------- */
  @ApiOperation({ summary: '获取服务器列表' })
  @ApiResponse({ type: GetServerResult })
  @Post(`/getServerList`)
  @Roles(EUserRoleType.Admin, EUserRoleType.Operations)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  getServerList(@Request() req: any, @Body() getServerListDto: GetServerListDto) {
    return this.gamesMgrService.getServerList(req, getServerListDto);
  }

  @ApiOperation({ summary: '创建服务器' })
  @ApiResponse({ type: CreateServerResult })
  @Post(`/createServer`)
  @Roles(EUserRoleType.Admin)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  createServer(@Request() req: any, @Body() createServerDto: CreateServerDto) {
    return this.gamesMgrService.createServer(req, createServerDto);
  }

  @ApiOperation({ summary: '同步服务器信息到游戏服' })
  @ApiResponse({ type: UpdateServerResult })
  @Post(`/updateToServer`)
  @Roles(EUserRoleType.Admin)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  updateToServer(@Request() req: any, @Body() updateToServerDto: UpdateToServerDto) {
    return this.gamesMgrService.updateToServer(req, updateToServerDto);
  }

  @ApiOperation({ summary: '修改服务器' })
  @ApiResponse({ type: UpdateServerResult })
  @Post(`/updateServer`)
  @Roles(EUserRoleType.Admin)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  updateServer(@Request() req: any, @Body() updateServerDto: UpdateServerDto) {
    return this.gamesMgrService.updateServer(req, updateServerDto);
  }

  @ApiOperation({ summary: '修改服务器状态 只能修改状态' })
  @ApiResponse({ type: UpdateServerResult })
  @Post(`/updateServerStatus`)
  @Roles(EUserRoleType.Admin)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  updateServerStatus(@Request() req: any, @Body() updateServerDto: UpdateServerDto) {
    return this.gamesMgrService.updateServerStatus(req, updateServerDto);
  }


  @ApiOperation({ summary: '删除服务器' })
  @ApiResponse({ type: BaseResult })
  @Post(`/deleteServer`)
  @Roles(EUserRoleType.Admin)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  deleteServer(@Request() req: any, @Body() deleteServerDto: DeleteServerDto) {
    return this.gamesMgrService.deleteServer(req, deleteServerDto);
  }

  @ApiOperation({ summary: '合服' })
  @ApiResponse({ type: BaseResult })
  @Post(`/mergeServer`)
  @Roles(EUserRoleType.Admin)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  mergeServer(@Request() req: any, @Body() mergeServerDto: MergeServerDto) {
    return this.gamesMgrService.mergeServer(req, mergeServerDto);
  }

  @ApiOperation({ summary: '一键开启改维护' })
  @ApiResponse({ type: BaseResult })
  @Post(`/autoMaintainServer`)
  @Roles(EUserRoleType.Admin)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  autoMaintainServer(@Request() req: any, @Body() autoMaintainServerDto: AutoMaintainServerDto) {
    return this.gamesMgrService.autoMaintainServer(req, autoMaintainServerDto);
  }

  @ApiOperation({ summary: '一键维护改开启' })
  @ApiResponse({ type: BaseResult })
  @Post(`/autoOpenServer`)
  @Roles(EUserRoleType.Admin)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  autoOpenServer(@Request() req: any, @Body() autoOpenServerDto: AutoOpenServerDto) {
    return this.gamesMgrService.autoOpenServer(req, autoOpenServerDto);
  }

  @ApiOperation({ summary: '单独设置聊天节点地址' })
  @ApiResponse({ type: BaseResult })
  @Post(`/setServerChatIP`)
  @Roles(EUserRoleType.Admin)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  setServerChatIP(@Request() req: any, @Body() beSetServerChatIPDto: BESetServerChatIPDto) {
    return this.gamesMgrService.setServerChatIP(req, beSetServerChatIPDto);
  }

  @ApiOperation({ summary: '设置服务器跨服ID' })
  @ApiResponse({ type: BaseResult })
  @Post(`/setCrossServerId`)
  @Roles(EUserRoleType.Admin)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  setCrossServerId(@Request() req: any, @Body() beSetCrossServerIdDto: BESetCrossServerIdDto) {
    return this.gamesMgrService.setCrossServerId(req, beSetCrossServerIdDto);
  }


  @ApiOperation({ summary: '单独设置自动开服配置' })
  @ApiResponse({ type: SetSetAutoOpenServerResult })
  @Post(`/setAutoOpenServer`)
  @Roles(EUserRoleType.Admin)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  setAutoOpenServer(@Request() req: any, @Body() bebeSetAutoOpenServerDto: BESetAutoOpenServerDto) {
    return this.gamesMgrService.setAutoOpenServer(req, bebeSetAutoOpenServerDto);
  }
  /**-------------------------------------------------------- */

  /**----------------------------------战区------------------------------------- */
  @ApiOperation({ summary: '获取战区列表' })
  @ApiResponse({ type: GetZoneResult })
  @Post(`/getZoneList`)
  @Roles(EUserRoleType.Admin, EUserRoleType.Operations)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  getZoneList(@Request() req: any, @Body() getZoneListDto: GetZoneListDto) {
    return this.gamesMgrService.getZoneList(req, getZoneListDto);
  }

  @ApiOperation({ summary: '创建战区' })
  @ApiResponse({ type: CreateZoneResult })
  @Post(`/createZone`)
  @Roles(EUserRoleType.Admin)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  createZone(@Request() req: any, @Body() createZoneDto: CreateZoneDto) {
    return this.gamesMgrService.createZone(req, createZoneDto);
  }

  @ApiOperation({ summary: '修改战区' })
  @ApiResponse({ type: UpdateZoneResult })
  @Post(`/updateZone`)
  @Roles(EUserRoleType.Admin)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  updateZone(@Request() req: any, @Body() updateZoneDto: UpdateZoneDto) {
    return this.gamesMgrService.updateZone(req, updateZoneDto);
  }


  @ApiOperation({ summary: '删除战区' })
  @ApiResponse({ type: BaseResult })
  @Post(`/deleteZone`)
  @Roles(EUserRoleType.Admin)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  deleteZone(@Request() req: any, @Body() deleteZoneDto: DeleteZoneDto) {
    return this.gamesMgrService.deleteZone(req, deleteZoneDto);
  }


  @ApiOperation({ summary: '获取公告' })
  @ApiResponse({ type: GetNoticeResult })
  @Post(`/getNotice`)
  getNotice(@Request() req: any, @Body() getNoticeDto: GetNoticeDto) {
    return this.gamesMgrService.getNotice(req, getNoticeDto);
  }


  @ApiOperation({ summary: '发送邮件 后台专用 测试服免验证' })
  @Post(`/sendEmail`)
  @Roles(EUserRoleType.Admin, EUserRoleType.Operations)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  sendEmail(@Request() req: any, @Body() beSendEmailDto: BESendEmailDto) {
    //console.log(sendEmailDto)
    return this.gamesMgrService.sendEmail(req, beSendEmailDto);
  }

  @ApiOperation({ summary: '发充值商品 成功后玩家需要重新登录' })
  @Post(`/beSendRechargeShop`)
  @Roles(EUserRoleType.Admin, EUserRoleType.Operations)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  beSendRechargeShop(@Request() req: any, @Body() beSendRechargeShopDto: BESendRechargeShopDto) {
    //console.log(sendEmailDto)
    return this.gamesMgrService.beSendRechargeShop(req, beSendRechargeShopDto);
  }

  @ApiOperation({ summary: '获取聊天记录' })
  @ApiResponse({ type: BEGetChatLogResult })
  @Post(`/beGetChatLog`)
  @Roles(EUserRoleType.Admin, EUserRoleType.Operations, EUserRoleType.Service)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  beGetChatLog(@Request() req: any, @Body() beGetChatLogDto: BEGetChatLogDto) {
    return this.gamesMgrService.beGetChatLog(req, beGetChatLogDto);
  }

}
