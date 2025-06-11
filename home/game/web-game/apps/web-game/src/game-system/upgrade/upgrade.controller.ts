import { Controller, Get, Post, Body, Request, UseGuards } from '@nestjs/common';
import { UpgradeService } from './upgrade.service';
import { UpgradeDto } from './dto/upgrade.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/auth/guards/jwt-auth.guard';
import { Throttle } from '@nestjs/throttler';
import { RESUpgradeMsg } from '../../game-data/entity/msg.entity';

@ApiTags('upgrade')
@Controller('upgrade')
@UseGuards(JwtAuthGuard)
export class UpgradeController {
  constructor(private readonly upgradeService: UpgradeService) {}

  @ApiOperation({ summary: '佣兵进阶' })
  @ApiResponse({ type: RESUpgradeMsg })
  @Throttle(1, 1)
  @Post(`/goto`)
  goto(@Request() req: any, @Body() upgradeDto: UpgradeDto) {
    return this.upgradeService.goto(req, upgradeDto);
  }
  
}
