import { Controller, Post, UseGuards, Request, Body } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { JwtAuthGuard } from '../../common/auth/guards/jwt-auth.guard';
import { RESCreateGuildMsg, RESGuildMsg, RESGuildRankMsg,  } from '../../game-data/entity/msg.entity';
import { changeDto, createDto, guildDto, joinDto, listDto, setLeaderDto } from './dto/guild.dto';
import { GuildService } from './guild.service';


@ApiTags('guild')
@Controller('guild')
@UseGuards(JwtAuthGuard)
export class GuildController {
  constructor(private readonly guildService: GuildService) { }


  @ApiOperation({ summary: '创建公会' })
  @ApiResponse({ type: RESCreateGuildMsg })
  @Throttle(1, 1)
  @Post(`/create`)
  create(@Request() req: any, @Body() dto: createDto) {
    return this.guildService.create(req, dto);
  }

  @ApiOperation({ summary: '加入公会' })
  @ApiResponse({ type: RESGuildMsg })
  @Throttle(1, 1)
  @Post(`/join`)
  join(@Request() req: any, @Body() dto: joinDto) {
    return this.guildService.join(req, dto);
  }

  @ApiOperation({ summary: '离开公会' })
  @ApiResponse({ type: RESGuildMsg })
  @Throttle(1, 1)
  @Post(`/leave`)
  leave(@Request() req: any, @Body() dto: guildDto) {
    return this.guildService.leave(req, dto);
  }

  @ApiOperation({ summary: '公会主界面信息' })
  @ApiResponse({ type: RESGuildMsg })
  @Throttle(1, 1)
  @Post(`/info`)
  info(@Request() req: any, @Body() dto: guildDto) {
    return this.guildService.info(req, dto);
  }

  @ApiOperation({ summary: '更改信息' })
  @ApiResponse({ type: RESGuildMsg })
  @Throttle(1, 1)
  @Post(`/change`)
  change(@Request() req: any, @Body() dto: changeDto) {
    return this.guildService.change(req, dto);
  }

  @ApiOperation({ summary: '解散公会' })
  @ApiResponse({ type: RESGuildMsg })
  @Throttle(1, 1)
  @Post(`/dissolve`)
  dissolve(@Request() req: any, @Body() dto: guildDto) {
    return this.guildService.dissolve(req, dto);
  }

  @ApiOperation({ summary: '公会排行' })
  @ApiResponse({ type: RESGuildRankMsg })
  @Throttle(1, 1)
  @Post(`/rank`)
  rank(@Request() req: any, @Body() dto: guildDto) {
    return this.guildService.rank(req, dto);
  }

  @ApiOperation({ summary: '申请入会列表-确认界面' })
  @ApiResponse({ type: RESGuildMsg })
  @Throttle(1, 1)
  @Post(`/applyList`)
  applyList(@Request() req: any, @Body() dto: listDto) {
    return this.guildService.applyList(req, dto);
  }

  @ApiOperation({ summary: '获取公会信息' })
  @ApiResponse({ type: RESGuildMsg })
  @Throttle(1, 1)
  @Post(`/getGuild`)
  getGuild(@Request() req: any, @Body() dto: joinDto) {
    return this.guildService.getGuild(req, dto);
  }

  @ApiOperation({ summary: '搜索公会' })
  @ApiResponse({ type: RESGuildRankMsg })
  @Throttle(1, 1)
  @Post(`/search`)
  search(@Request() req: any, @Body() dto: joinDto) {
    return this.guildService.search(req, dto);
  }

  @ApiOperation({ summary: '转移公会-会长职位' })
  @ApiResponse({ type: RESGuildMsg })
  @Throttle(1, 1)
  @Post(`/setLeader`)
  setLeader(@Request() req: any, @Body() dto: setLeaderDto) {
    return this.guildService.setLeader(req, dto);
  }




}
