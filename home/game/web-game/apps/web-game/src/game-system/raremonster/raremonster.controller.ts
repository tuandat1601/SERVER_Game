import { Controller, Post, UseGuards, Request, Body } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { JwtAuthGuard } from '../../common/auth/guards/jwt-auth.guard';
import {RaremonsterService} from "./raremonster.service";
import {RaremonsterLevelUpDTO, 
  RaremonsterFightDTO, 
  RaremonsterChangeDTO,
  RaremonsterSuitDTO,
  RaremonsterLotteryDTO} from './dto/raremonster.dto';
import { RESRaremonsterLevelUpMsg,
  RESRaremonsterFightMsg,  
  RESRaremonsterChangeMsg,
  RESRaremonsterSuitMsg, 
  RESRaremonsterLotteryMsg} from '../../game-data/entity/msg.entity';


@ApiTags('raremonster')
@Controller('raremonster')
@UseGuards(JwtAuthGuard)
export class RaremonsterController {
  constructor(private readonly raremonsterService: RaremonsterService) {}

  @ApiOperation({ summary: '升级' })
  @ApiResponse({ type: RESRaremonsterLevelUpMsg })
  @Throttle(10, 1)
  @Post(`/levelup`)
  levelup(@Request() req: any, @Body() reqbody: RaremonsterLevelUpDTO) {
    return this.raremonsterService.levelUp(req, reqbody);
  }

  @ApiOperation({ summary: '升级' })
  @ApiResponse({ type: RESRaremonsterFightMsg })
  @Throttle(4, 1)
  @Post(`/fihgt`)
  fight(@Request() req: any, @Body() reqbody: RaremonsterFightDTO) {
    return this.raremonsterService.fight(req, reqbody);
  }

  @ApiOperation({ summary: '切换阵容' })
  @ApiResponse({ type: RESRaremonsterChangeMsg })
  @Throttle(4, 1)
  @Post(`/change`)
  change(@Request() req: any, @Body() reqbody: RaremonsterChangeDTO) {
    return this.raremonsterService.change(req, reqbody);
  }

  @ApiOperation({ summary: '捕捉异兽' })
  @ApiResponse({ type: RESRaremonsterLotteryMsg })
  @Throttle(10, 1)
  @Post(`/lottery`)
  lottery(@Request() req: any, @Body() reqbody: RaremonsterLotteryDTO) {
    return this.raremonsterService.lottery(req, reqbody);
  }

  @ApiOperation({ summary: '共鸣' })
  @ApiResponse({ type: RESRaremonsterSuitMsg })
  @Throttle(4, 1)
  @Post(`/suit`)
  suit(@Request() req: any, @Body() reqbody: RaremonsterSuitDTO) {
    return this.raremonsterService.suit(req, reqbody);
  }
}
