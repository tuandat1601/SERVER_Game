import { Body, Controller, Post, UseGuards, Request } from '@nestjs/common';
import { ApiBasicAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { JwtAuthGuard } from '../../common/auth/guards/jwt-auth.guard';
import { RESMercenaryMsg, RESMercenaryPkMsg } from '../../game-data/entity/msg.entity';
import { MercenaryActDto, MercenaryDto, MercenarygoDto } from './dto/mercenary.dto';
import { MercenaryService } from './mercenary.service';

@Controller('mercenary')
@ApiTags('mercenary')
@ApiBasicAuth()
@UseGuards(JwtAuthGuard)
export class MercenaryController {
  constructor(private readonly mercenaryService: MercenaryService) { }

  @ApiOperation({ summary: '佣兵激活' })
  @ApiResponse({ type: RESMercenaryMsg })
  @Throttle(5, 1)
  @Post(`/act`)
  act(@Request() req: any, @Body() dto: MercenaryActDto) {
    return this.mercenaryService.act(req, dto);
  }

  @ApiOperation({ summary: '佣兵升级' })
  @ApiResponse({ type: RESMercenaryMsg })
  @Throttle(5, 1)
  @Post(`/up`)
  up(@Request() req: any, @Body() dto: MercenaryDto) {
    return this.mercenaryService.up(req, dto);
  }

  @ApiOperation({ summary: '佣兵切磋' })
  @ApiResponse({ type: RESMercenaryPkMsg })
  @Throttle(5, 1)
  @Post(`/pk`)
  pk(@Request() req: any, @Body() dto: MercenaryActDto) {
    return this.mercenaryService.pk(req, dto);
  }

  @ApiOperation({ summary: '佣兵寻宝' })
  @ApiResponse({ type: RESMercenaryMsg })
  @Throttle(5, 1)
  @Post(`/go`)
  go(@Request() req: any, @Body() dto: MercenarygoDto) {
    return this.mercenaryService.go(req, dto);
  }

  @ApiOperation({ summary: '更新数据' })
  @ApiResponse({ type: RESMercenaryMsg })
  @Throttle(5, 1)
  @Post(`/upData`)
  upData(@Request() req: any) {
    return this.mercenaryService.upData(req);
  }

}
