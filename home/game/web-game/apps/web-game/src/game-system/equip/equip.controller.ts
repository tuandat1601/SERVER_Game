import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { ApiBasicAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/auth/guards/jwt-auth.guard';
import { RESEquipAutoSetUpMsg, RESEquipMsg } from '../../game-data/entity/msg.entity';
import { EquipAutoSetUpDto, EquipSellDto, EquipSetUpDto, QuickEquipSellDto } from './dto/equip.dto';
import { EquipService } from './equip.service';

@Controller('equip')
@ApiTags('equip')
@ApiBasicAuth()
@UseGuards(JwtAuthGuard)
export class EquipController {
  constructor(private readonly equipService: EquipService) { }


  @ApiOperation({ summary: '装备/卸下 装备' })
  @ApiResponse({ type: RESEquipMsg })
  @Post(`/setup`)
  setup(@Request() req: any, @Body() equipSetUpDto: EquipSetUpDto) {
    return this.equipService.setup(req, equipSetUpDto);
  }

  @ApiOperation({ summary: '一键换装' })
  @ApiResponse({ type: RESEquipAutoSetUpMsg })
  @Post(`/autoSetup`)
  autoSetup(@Request() req: any, @Body() equipAutoSetUpDto: EquipAutoSetUpDto) {
    return this.equipService.autoSetup(req, equipAutoSetUpDto);
  }


  @ApiOperation({ summary: '出售单个装备' })
  @ApiResponse({ type: RESEquipMsg })
  @Post(`/sell`)
  sell(@Request() req: any, @Body() equipSellDto: EquipSellDto) {
    return this.equipService.sell(req, equipSellDto);
  }

  @ApiOperation({ summary: '一键出售装备' })
  @ApiResponse({ type: RESEquipMsg })
  @Post(`/quickSell`)
  quickSell(@Request() req: any, @Body() quickEquipSellDto: QuickEquipSellDto) {
    return this.equipService.quickSell(req, quickEquipSellDto);
  }
}
