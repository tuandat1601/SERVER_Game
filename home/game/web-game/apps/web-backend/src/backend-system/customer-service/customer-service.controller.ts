import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiBasicAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { EUserRoleType } from '../../backend-enum';
import { JwtAuthGuard } from '../../common/auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/auth/guards/roles.guard';
import { Roles } from '../../common/decorator/roles.decorator';
import { BaseResult, RechargeInfoResult } from '../../result/result';
import { CustomerServiceService } from './customer-service.service';
import { RechargeInfoDto, RechargeRankDto, UpdateRoleStatusDto } from './dto/customer-service.dto';

@ApiTags('customerservice')
@ApiBasicAuth()
@Controller('customerservice')
@Roles(EUserRoleType.Admin, EUserRoleType.Operations, EUserRoleType.Service)
@UseGuards(RolesGuard)
@UseGuards(JwtAuthGuard)
export class CustomerServiceController {
  constructor(private readonly customerServiceService: CustomerServiceService) { }

  @ApiOperation({ summary: '获取订单列表' })
  @ApiResponse({ type: RechargeInfoResult })
  @Post('/getRechargeInfo')
  getRechargeInfo(@Body() rechargeInfoDto: RechargeInfoDto) {
    return this.customerServiceService.getRechargeInfo(rechargeInfoDto);
  }

  @ApiOperation({ summary: '修改用户状态 封禁/解禁' })
  @ApiResponse({ type: BaseResult })
  @Post('/updateRoleStatus')
  updateRoleStatus(@Body() updateRoleStatusDto: UpdateRoleStatusDto) {
    return this.customerServiceService.updateRoleStatus(updateRoleStatusDto);
  }

  @ApiOperation({ summary: '获取订单排行榜' })
  @ApiResponse({ type: RechargeInfoResult })
  @Post('/getRechargeRank')
  getRechargeRank(@Body() dto: RechargeRankDto) {
    return this.customerServiceService.getRechargeRank(dto);
  }

}
