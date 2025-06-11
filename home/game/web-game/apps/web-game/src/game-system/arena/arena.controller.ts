import { Controller, Post, UseGuards, Request, Body } from '@nestjs/common';
import { ApiBasicAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { JwtAuthGuard } from '../../common/auth/guards/jwt-auth.guard';
import { RESArenaFightDataMsg, RESArenaShowMsg, RESRoleInfoShowMsg } from '../../game-data/entity/msg.entity';
import { ArenaFight2Dto, ArenaFightDto } from '../fight/dto/game-fight.dto';
import { ArenaService } from './arena.service';
import { ArenaDto, ArenaRoleinfoDto } from './dto/arena.dto';

@ApiTags('arena')
@ApiBasicAuth()
@Controller('arena')
@UseGuards(JwtAuthGuard)
export class ArenaController {
  constructor(private readonly arenaService: ArenaService) { }


  @Throttle(2, 1)
  @ApiOperation({ summary: '竞技场-挑战界面' })
  @ApiResponse({ type: RESArenaShowMsg })
  @Post('/show')
  async arenafightshow(@Request() req: any, @Body() arenaDto: ArenaDto) {
    return this.arenaService.show(req, arenaDto);
  }

  @Throttle(2, 1)
  @ApiOperation({ summary: '竞技场-排行界面' })
  @ApiResponse({ type: RESArenaShowMsg })
  @Post('/rank')
  async arenarank(@Request() req: any, @Body() arenaDto: ArenaDto) {
    return this.arenaService.rank(req, arenaDto);
  }

  @Throttle(2, 1)
  @ApiOperation({ summary: '竞技场-日志界面' })
  @ApiResponse({ type: RESArenaShowMsg })
  @Post('/log')
  async arenalog(@Request() req: any, @Body() arenaDto: ArenaDto) {
    return this.arenaService.arenalog(req, arenaDto);
  }

  @Throttle(2, 1)
  @ApiOperation({ summary: '竞技场-角色界面' })
  @ApiResponse({ type: RESRoleInfoShowMsg })
  @Post('/roleinfo')
  async roleinfo(@Request() req: any, @Body() arenaDto: ArenaRoleinfoDto) {
    return this.arenaService.roleinfo(req, arenaDto);
  }

  @Throttle(2, 1)
  @ApiOperation({ summary: '竞技场跨服战斗' })
  @ApiResponse({ type: RESArenaFightDataMsg })
  // @UseGuards(JwtAuthGuard)
  @Post('/fight')
  fight(@Request() req: any, @Body() arenaFightDto: ArenaFightDto) {
    return this.arenaService.fight(req, arenaFightDto);
  }

  @Throttle(2, 1)
  @ApiOperation({ summary: '竞技场战斗' })
  @ApiResponse({ type: RESArenaFightDataMsg })
  // @UseGuards(JwtAuthGuard)
  @Post('/fight2')
  fight2(@Request() req: any, @Body() arenaFightDto: ArenaFight2Dto) {
    return this.arenaService.fight2(req, arenaFightDto);
  }

}
