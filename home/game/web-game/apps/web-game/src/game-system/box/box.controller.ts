import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { ApiBasicAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/auth/guards/jwt-auth.guard';
import { RESCheckLvUpEBoxMsg, RESLvUpEBoxMsg, RESOpenEBoxMsg, RESOpenSBoxMsg, RESQuickenEBoxCDMsg, RESSaveTmpEquipMsg, RESSellTmpEquipMsg, RESSetUpTmpEquipMsg, RESXBAwardMsg } from '../../game-data/entity/msg.entity';
import { BoxService } from './box.service';
import { OpenEBoxDto, OpenSBoxDto, QuickenEBoxCDDto, SaveTmpEquipDto, SellTmpEquipDto, SetUpTmpEquipDto, XBAwardDto } from './dto/box.dto';

@Controller('box')
@ApiTags('box')
@ApiBasicAuth()
@UseGuards(JwtAuthGuard)
export class BoxController {
  constructor(private readonly boxService: BoxService) {}

  @Post('/openEBox')
  @ApiOperation({ summary: '开启装备箱子/锻造' })
  @ApiResponse({ type:RESOpenEBoxMsg })
  openEBox(@Request() req: any,@Body() openEBoxDto: OpenEBoxDto) {
    return this.boxService.openEBox(req,openEBoxDto);
  }

  @Post('/sellTmpEquip')
  @ApiOperation({ summary: '出售临时对比装备' })
  @ApiResponse({ type:RESSellTmpEquipMsg })
  sellTmpEquip(@Request() req: any,@Body() sellTmpEquipDto: SellTmpEquipDto) {
    return this.boxService.sellTmpEquip(req,sellTmpEquipDto);
  }

  @Post('/saveTmpEquip')
  @ApiOperation({ summary: '存储临时对比装备' })
  @ApiResponse({ type:RESSaveTmpEquipMsg })
  saveTmpEquip(@Request() req: any,@Body() saveTmpEquipDto: SaveTmpEquipDto) {
    return this.boxService.saveTmpEquip(req,saveTmpEquipDto);
  }

  @Post('/setUpTmpEquip')
  @ApiOperation({ summary: '替换临时对比装备' })
  @ApiResponse({ type:RESSetUpTmpEquipMsg })
  setUpTmpEquip(@Request() req: any,@Body() setUpTmpEquipDto: SetUpTmpEquipDto) {
    return this.boxService.setUpTmpEquip(req,setUpTmpEquipDto);
  }


  @Post('/lvUpEBox')
  @ApiOperation({ summary: '升级装备宝箱' })
  @ApiResponse({ type:RESLvUpEBoxMsg })
  lvUpEBox(@Request() req: any) {
    return this.boxService.lvUpEBox(req);
  }

  @Post('/quickenEBoxCD')
  @ApiOperation({ summary: '加速装备宝箱升级CD' })
  @ApiResponse({ type:RESQuickenEBoxCDMsg })
  quickenEBoxCD(@Request() req: any,@Body() quickenEBoxCDDto: QuickenEBoxCDDto) {
    return this.boxService.quickenEBoxCD(req,quickenEBoxCDDto);
  }

  @Post('/checkLvUpEBox')
  @ApiOperation({ summary: '检测升级装备宝箱是否CD时间结束' })
  @ApiResponse({ type:RESCheckLvUpEBoxMsg })
  checkLvUpEBox(@Request() req: any) {
    return this.boxService.checkLvUpEBox(req);
  }

  @Post('/openSBox')
  @ApiOperation({ summary: '开启技能宝箱' })
  @ApiResponse({ type:RESOpenSBoxMsg })
  openSBox(@Request() req: any,@Body() openSBoxDto: OpenSBoxDto) {
    return this.boxService.openSBox(req,openSBoxDto);
  }

  @Post('/xbaward')
  @ApiOperation({ summary: '寻宝奖励' })
  @ApiResponse({ type:RESXBAwardMsg })
  xunbaoAward(@Request() req: any,@Body() dto: XBAwardDto) {
    return this.boxService.xunbaoAward(req,dto);
  }
}
