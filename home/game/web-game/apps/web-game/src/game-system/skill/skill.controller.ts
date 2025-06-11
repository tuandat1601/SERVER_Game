import { Controller, Request, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiBasicAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/auth/guards/jwt-auth.guard';
import { RESSkillMsg, RESSkillSuitMsg } from '../../game-data/entity/msg.entity';
import { ActiveSkillDto, LvUpSkillDto, SetUpSkillDto, SkillSuitDTO } from './dto/skill-system.dto';
import { SkillService } from './skill.service';


@Controller('skill')
@ApiTags('skill')
@ApiBasicAuth()
export class SkillController {
  constructor(private readonly skillService: SkillService) { }

  @ApiOperation({ summary: '激活开启技能槽位' })
  @ApiResponse({ type: RESSkillMsg })
  @UseGuards(JwtAuthGuard)
  @Post(`/active`)
  active(@Request() req: any, @Body() activeSkillDto: ActiveSkillDto) {
    return this.skillService.active(req, activeSkillDto);
  }

  @ApiOperation({ summary: '技能升级' })
  @ApiResponse({ type: RESSkillMsg })
  @UseGuards(JwtAuthGuard)
  @Post(`/lvup`)
  lvup(@Request() req: any, @Body() lvUpSkillDto: LvUpSkillDto) {
    return this.skillService.lvup(req, lvUpSkillDto);
  }

  @ApiOperation({ summary: '装备/卸下 技能' })
  @ApiResponse({ type: RESSkillMsg })
  @UseGuards(JwtAuthGuard)
  @Post(`/setup`)
  setup(@Request() req: any, @Body() setUpSkillDto: SetUpSkillDto) {
    return this.skillService.setup(req, setUpSkillDto);
  }

  @ApiOperation({ summary: '技能图签' })
  @ApiResponse({ type: RESSkillSuitMsg })
  @UseGuards(JwtAuthGuard)
  @Post(`/suit`)
  suit(@Request() req: any, @Body() dto: SkillSuitDTO) {
    return this.skillService.suit(req, dto);
  }
}
