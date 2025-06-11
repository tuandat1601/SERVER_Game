import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { FightService } from './fight.service';
import { AbyssDragonFightDto, ADDamageAwardDto, AllRankDto, ArenaFightDto, DemonAbyssDailyAwardsDto, DemonAbyssDailyBuyItemDto, DemonAbyssFightDto, DemonAbyssGetAwardsDto, EliteFightDto, GameLevelsFight2Dto, GameLevelsFightDto, GetADRankDto, RankDto, RoleShowDto } from './dto/game-fight.dto';
import { ApiBasicAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/auth/guards/jwt-auth.guard';
import { DemonAbyssDailyAwardsMsg, DemonAbyssDailyBuyItemMsg, DemonAbyssFightMsg, DemonAbyssGetAwardsMsg, RESAbyssDragonMsg, RESADDamageAwardMsg, RESAllRankShowMsg, RESArenaFightDataMsg, RESFightData2Msg, RESFightDataMsg, RESGetADRankMsg, RESRankShowMsg, RESRoleInfoShowMsg, RESSweepMsg } from '../../game-data/entity/msg.entity';
import { Throttle } from '@nestjs/throttler';
import { ArenaRoleinfoDto } from '../arena/dto/arena.dto';



@ApiTags('fight')
@ApiBasicAuth()
@Controller('fight')
export class FightController {
  constructor(private readonly fightService: FightService) { }

  @Throttle(6, 1)
  @ApiOperation({ summary: '关卡战斗' })
  @ApiResponse({ type: RESFightDataMsg })
  @UseGuards(JwtAuthGuard)
  @Post('/gamelevels')
  gamelevels(@Request() req: any, @Body() gameLevelsFightDto: GameLevelsFightDto) {
    return this.fightService.gamelevels(req, gameLevelsFightDto);
  }

  @Throttle(6, 1)
  @ApiOperation({ summary: '关卡战斗2' })
  @ApiResponse({ type: RESFightData2Msg })
  @UseGuards(JwtAuthGuard)
  @Post('/gamelevels2')
  gamelevels2(@Request() req: any, @Body() gameLevelsFight2Dto: GameLevelsFight2Dto) {
    return this.fightService.gamelevels2(req, gameLevelsFight2Dto);
  }

  @Throttle(3, 1)
  @ApiOperation({ summary: '精英关卡战斗' })
  @ApiResponse({ type: RESFightDataMsg })
  @UseGuards(JwtAuthGuard)
  @Post('/elite')
  elitefight(@Request() req: any, @Body() eliteFightDto: EliteFightDto) {
    return this.fightService.elitefight(req, eliteFightDto);
  }

  @Throttle(2, 1)
  @ApiOperation({ summary: '精英关卡扫荡' })
  @ApiResponse({ type: RESSweepMsg })
  @UseGuards(JwtAuthGuard)
  @Post('/elitesweep')
  elitesweep(@Request() req: any, @Body() eliteFightDto: EliteFightDto) {
    return this.fightService.elitesweep(req, eliteFightDto);
  }
  @Throttle(2, 1)
  @ApiOperation({ summary: '竞技场战斗' })
  @ApiResponse({ type: RESArenaFightDataMsg })
  @UseGuards(JwtAuthGuard)
  @Post('/arena')
  arenafight(@Request() req: any, @Body() arenaFightDto: ArenaFightDto) {
    return this.fightService.arenafight(req, arenaFightDto);
  }

  @Throttle(1, 1)
  @ApiOperation({ summary: '关卡排行' })
  @ApiResponse({ type: RESRankShowMsg })
  @UseGuards(JwtAuthGuard)
  @Post('/glrank')
  glrank(@Request() req: any, @Body() dto: RankDto) {
    return this.fightService.glrank(req, dto);
  }

  @Throttle(1, 1)
  @ApiOperation({ summary: '世界排行' })
  @ApiResponse({ type: RESAllRankShowMsg })
  @UseGuards(JwtAuthGuard)
  @Post('/allrank')
  allrank(@Request() req: any, @Body() dto: AllRankDto) {
    return this.fightService.allrank(req, dto);
  }

  @Throttle(1, 1)
  @ApiOperation({ summary: '角色信息展示' })
  @ApiResponse({ type: RESRoleInfoShowMsg })
  @UseGuards(JwtAuthGuard)
  @Post('/roleinfo')
  roleinfo(@Request() req: any, @Body() roleShowDto: RoleShowDto) {
    return this.fightService.roleinfo(req, roleShowDto);
  }

  @Throttle(1, 1)
  @ApiOperation({ summary: '深渊巨龙挑战' })
  @ApiResponse({ type: RESAbyssDragonMsg })
  @UseGuards(JwtAuthGuard)
  @Post('/abyssDragon')
  abyssDragon(@Request() req: any, @Body() abyssDragonFightDto: AbyssDragonFightDto) {
    return this.fightService.abyssDragon(req, abyssDragonFightDto);
  }

  @Throttle(1, 1)
  @ApiOperation({ summary: '领取深渊巨龙伤害奖励' })
  @ApiResponse({ type: RESADDamageAwardMsg })
  @UseGuards(JwtAuthGuard)
  @Post('/adDamageAward')
  adDamageAward(@Request() req: any, @Body() adDamageAwardDto: ADDamageAwardDto) {
    return this.fightService.adDamageAward(req, adDamageAwardDto);
  }

  @Throttle(1, 1)
  @ApiOperation({ summary: '获取深渊巨龙排行榜奖励' })
  @ApiResponse({ type: RESGetADRankMsg })
  @UseGuards(JwtAuthGuard)
  @Post('/getADRank')
  getADRank(@Request() req: any, @Body() getADRankDto: GetADRankDto) {
    return this.fightService.getADRank(req, getADRankDto);
  }

  @Throttle(1, 1)
  @ApiOperation({ summary: '魔渊挑战' })
  @ApiResponse({ type: DemonAbyssFightMsg })
  @UseGuards(JwtAuthGuard)
  @Post('/demonAbyssFight')
  demonAbyssFight(@Request() req: any, @Body() demonAbyssFightDto: DemonAbyssFightDto) {
    return this.fightService.demonAbyssFight(req, demonAbyssFightDto);
  }

  @Throttle(1, 1)
  @ApiOperation({ summary: '领取魔渊每日奖励' })
  @ApiResponse({ type: DemonAbyssDailyAwardsMsg })
  @UseGuards(JwtAuthGuard)
  @Post('/demonAbyssDailyAwards')
  demonAbyssDailyAwards(@Request() req: any, @Body() demonAbyssDailyAwardsDto: DemonAbyssDailyAwardsDto) {
    return this.fightService.demonAbyssDailyAwards(req, demonAbyssDailyAwardsDto);
  }

  @Throttle(1, 1)
  @ApiOperation({ summary: '魔渊每日付费购买道具' })
  @ApiResponse({ type: DemonAbyssDailyBuyItemMsg })
  @UseGuards(JwtAuthGuard)
  @Post('/demonAbyssDailyBuyItem')
  demonAbyssDailyBuyItem(@Request() req: any, @Body() demonAbyssDailyAwardsDto: DemonAbyssDailyBuyItemDto) {
    return this.fightService.demonAbyssDailyBuyItem(req, demonAbyssDailyAwardsDto);
  }

  @Throttle(1, 1)
  @ApiOperation({ summary: '领取魔渊成就奖励' })
  @ApiResponse({ type: DemonAbyssGetAwardsMsg })
  @UseGuards(JwtAuthGuard)
  @Post('/demonAbyssGetAwards')
  demonAbyssGetAwards(@Request() req: any, @Body() demonAbyssGetAwardsDto: DemonAbyssGetAwardsDto) {
    return this.fightService.demonAbyssGetAwards(req, demonAbyssGetAwardsDto);
  }
}
