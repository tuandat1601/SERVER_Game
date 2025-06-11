import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { ApiBasicAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { JwtAuthGuard } from '../../common/auth/guards/jwt-auth.guard';
import { RESEquipPosMsg, RESRoleIcoMsg, RESRoleNameMsg } from '../../game-data/entity/msg.entity';
import { EquipSetUpDto } from '../equip/dto/equip.dto';
import { AllEquipPosUpDto, EquipPosUpDto, HeroLvUpDto, RoleUpIcoDto, RoleUpNameDto } from './hero-dto';
import { HeroService } from './hero.service';

@Controller('hero')
@ApiTags('hero')
@ApiBasicAuth()
@UseGuards(JwtAuthGuard)
export class HeroController {
  constructor(private readonly heroService: HeroService) { }

  @ApiOperation({ summary: '装备部位升级' })
  @ApiResponse({ type: RESEquipPosMsg })
  @Throttle(4, 1)
  @Post(`/equipPosUp`)
  equipPosUp(@Request() req: any, @Body() equipPosUpDto: EquipPosUpDto) {
    return this.heroService.equipPosUp(req, equipPosUpDto);
  }

  @ApiOperation({ summary: '全身装备部位升级' })
  @ApiResponse({ type: RESEquipPosMsg })
  @Throttle(4, 1)
  @Post(`/allEquipPosUp`)
  allEquipPosUp(@Request() req: any, @Body() allEquipPosUpDto: AllEquipPosUpDto) {
    return this.heroService.allEquipPosUp(req, allEquipPosUpDto);
  }

  @ApiOperation({ summary: '非主角英雄升级' })
  @ApiResponse({ type: RESEquipPosMsg })
  @Throttle(4, 1)
  @Post(`/heroLvUp`)
  heroLvUp(@Request() req: any, @Body() heroLvUpDto: HeroLvUpDto) {
    return this.heroService.heroLvUp(req, heroLvUpDto);
  }

  @ApiOperation({ summary: '角色更换头像' })
  @ApiResponse({ type: RESRoleIcoMsg })
  @Throttle(4, 1)
  @Post(`/roleUpico`)
  roleUpico(@Request() req: any, @Body() roleUpIcoDto: RoleUpIcoDto) {
    return this.heroService.roleUpico(req, roleUpIcoDto);
  }
  @ApiOperation({ summary: '角色更换名称' })
  @ApiResponse({ type: RESRoleNameMsg })
  @Throttle(4, 1)
  @Post(`/roleUpname`)
  roleUpname(@Request() req: any, @Body() Dto: RoleUpNameDto) {
    return this.heroService.roleUpname(req, Dto);
  }
}
