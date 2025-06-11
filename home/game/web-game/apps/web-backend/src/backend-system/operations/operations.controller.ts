import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiBasicAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { EUserRoleType } from '../../backend-enum';
import { JwtAuthGuard } from '../../common/auth/guards/jwt-auth.guard';
import { Roles } from '../../common/decorator/roles.decorator';
import { CodeAdminResult, GameDate2Result, GameDateResult, GenCodeResult, OutCodeResult } from '../../result/result';
import { CodeEmailDto, CodeInfoDto, DelCodeadminDto, DelCodeEmailDto, GameData2Dto, GameDataDto, GenCodeDto, GenComCodeDto, GetCodeInfoDto, OutCodeDto, UseCodeDto } from './dto/operations.dto';
import { OperationsService } from './operations.service';

@Controller('operations')
@ApiTags('operations')
@ApiBasicAuth()
export class OperationsController {
  constructor(private readonly operationsService: OperationsService) { }

  @ApiOperation({ summary: '管理激活码-增' })
  @ApiResponse({ type: CodeAdminResult })
  @UseGuards(JwtAuthGuard)
  @Roles(EUserRoleType.Admin, EUserRoleType.Operations, EUserRoleType.Service)
  @Post('/codeadmin-add')
  async addcodeadmin(@Body() codeInfoDto: CodeInfoDto) {
    return this.operationsService.addcodeadmin(codeInfoDto);
  }

  @ApiOperation({ summary: '管理激活码-删' })
  @ApiResponse({ type: CodeAdminResult })
  @UseGuards(JwtAuthGuard)
  @Roles(EUserRoleType.Admin, EUserRoleType.Operations, EUserRoleType.Service)
  @Post('/codeadmin-del')
  async delcodeadmin(@Body() delCodeadminDto: DelCodeadminDto) {
    return this.operationsService.delcodeadmin(delCodeadminDto);
  }

  @ApiOperation({ summary: '管理激活码-改' })
  @ApiResponse({ type: CodeAdminResult })
  @UseGuards(JwtAuthGuard)
  @Roles(EUserRoleType.Admin, EUserRoleType.Operations, EUserRoleType.Service)
  @Post('/codeadmin-update')
  async updatacodeadmin(@Body() codeInfoDto: CodeInfoDto) {
    return this.operationsService.updatecodeadmin(codeInfoDto);
  }

  @ApiOperation({ summary: '管理激活码-查' })
  @ApiResponse({ type: CodeAdminResult })
  @UseGuards(JwtAuthGuard)
  @Roles(EUserRoleType.Admin, EUserRoleType.Operations, EUserRoleType.Service)
  @Post('/codeadmin-get')
  async getcodeadmin(@Body() getcodeInfoDto: GetCodeInfoDto) {
    return this.operationsService.getcodeadmin(getcodeInfoDto);
  }

  @ApiOperation({ summary: '生成激活码' })
  @ApiResponse({ type: GenCodeResult })
  @UseGuards(JwtAuthGuard)
  @Roles(EUserRoleType.Admin, EUserRoleType.Operations, EUserRoleType.Service)
  @Post('/gencode')
  async gencode(@Body() genCodeDto: GenCodeDto) {
    return this.operationsService.gencode(genCodeDto);
  }
  @ApiOperation({ summary: '生成通用激活码' })
  @ApiResponse({ type: GenCodeResult })
  @UseGuards(JwtAuthGuard)
  @Roles(EUserRoleType.Admin, EUserRoleType.Operations, EUserRoleType.Service)
  @Post('/gencomcode')
  async gencomcode(@Body() genCodeDto: GenComCodeDto) {
    return this.operationsService.gencomcode(genCodeDto);
  }

  @ApiOperation({ summary: '导出激活码' })
  @ApiResponse({ type: OutCodeResult })
  @Post('/outcode')
  @UseGuards(JwtAuthGuard)
  @Roles(EUserRoleType.Admin, EUserRoleType.Operations, EUserRoleType.Service)
  async outcode(@Body() outCodeDto: OutCodeDto) {
    return this.operationsService.outcode(outCodeDto);
  }

  @ApiOperation({ summary: '导出通用激活码' })
  @ApiResponse({ type: OutCodeResult })
  @Post('/outcomcode')
  @UseGuards(JwtAuthGuard)
  @Roles(EUserRoleType.Admin, EUserRoleType.Operations, EUserRoleType.Service)
  async outcomcode(@Body() outCodeDto: OutCodeDto) {
    return this.operationsService.outcomcode(outCodeDto);
  }

  @ApiOperation({ summary: '使用激活码' })
  @ApiResponse({ type: OutCodeResult })
  @Post('/usecode')
  @Throttle(1, 1)
  async usecode(@Body() useCodeDto: UseCodeDto) {
    return this.operationsService.usecode(useCodeDto);
  }

  // @ApiOperation({ summary: '使用通用激活码' })
  // @ApiResponse({ type: OutCodeResult })
  // @Post('/usecomcode')
  // async usecomcode(@Body() useCodeDto: UseCodeDto) {
  //   return this.operationsService.usecomcode(useCodeDto);
  // }

  @ApiOperation({ summary: '激活码邮件-增' })
  @ApiResponse({ type: CodeAdminResult })
  @Post('/addcodeemail')
  @UseGuards(JwtAuthGuard)
  @Roles(EUserRoleType.Admin, EUserRoleType.Operations, EUserRoleType.Service)
  async addcodeemail(@Body() codeEmailDto: CodeEmailDto) {
    return this.operationsService.addcodeemail(codeEmailDto);
  }

  @ApiOperation({ summary: '激活码邮件-查' })
  @ApiResponse({ type: CodeAdminResult })
  @Post('/getcodeemail')
  @UseGuards(JwtAuthGuard)
  @Roles(EUserRoleType.Admin, EUserRoleType.Operations, EUserRoleType.Service)
  async getcodeemail() {
    return this.operationsService.getcodeemail();
  }

  @ApiOperation({ summary: '激活码邮件-删' })
  @ApiResponse({ type: CodeAdminResult })
  @Post('/delCodeEmail')
  @UseGuards(JwtAuthGuard)
  @Roles(EUserRoleType.Admin, EUserRoleType.Operations, EUserRoleType.Service)
  async delCodeEmail(@Body() delCodeEmailDto: DelCodeEmailDto) {
    return this.operationsService.delCodeEmail(delCodeEmailDto);
  }


  @ApiOperation({ summary: '充值统计' })
  @ApiResponse({ type: GameDateResult })
  @Post('/gameDate')
  @UseGuards(JwtAuthGuard)
  @Roles(EUserRoleType.Admin, EUserRoleType.Operations)
  async gameDate(@Body() gameDateDto: GameDataDto) {
    return this.operationsService.gameDate(gameDateDto);
  }

  @ApiOperation({ summary: '等级分布/关卡分布' })
  @ApiResponse({ type: GameDate2Result })
  @Post('/gameDate2')
  @UseGuards(JwtAuthGuard)
  @Roles(EUserRoleType.Admin, EUserRoleType.Operations, EUserRoleType.Service)
  async gameDate2(@Body() gameDate2Dto: GameData2Dto) {
    return this.operationsService.gameDate2(gameDate2Dto);
  }
}
