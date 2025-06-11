import { Controller, Post, UseGuards, Request, Body } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { JwtAuthGuard } from '../../common/auth/guards/jwt-auth.guard';
import { RESMedalUpLevelMsg } from '../../game-data/entity/msg.entity';
import { LvUpMedalDto } from './dto/medal.dto';
import { MedalService } from './medal.service';


@ApiTags('medal')
@Controller('medal')
@UseGuards(JwtAuthGuard)
export class MedalController {
  constructor(private readonly medalService: MedalService) { }


  @ApiOperation({ summary: '勋章制作' })
  @ApiResponse({ type: RESMedalUpLevelMsg })
  @Throttle(4, 1)
  @Post(`/lvup`)
  lvup(@Request() req: any, @Body() lvUpMedalDto: LvUpMedalDto) {
    return this.medalService.lvup(req, lvUpMedalDto);
  }




}
