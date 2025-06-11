import { Controller, Get, Post, Body, Patch, Param, Delete, Request, Headers, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { CustomInterceptorIgnore } from '../../common/interceptors/transform.interceptor';
import { QiPaActiveDto, QiPaPaymentDto, QiPaRebateDto } from './dto/qipa.dto';
import { QipaService } from './qipa.service';

@Controller('qipa')
export class QipaController {
  constructor(private readonly qipaService: QipaService) { }

  @Get(`/payment`)
  @CustomInterceptorIgnore()
  payment(@Request() req: any, @Query() qipaPaymentDto: any) {
    return this.qipaService.payment(req, qipaPaymentDto);
  }

  @Get(`/rebate`)
  @CustomInterceptorIgnore()
  rebate(@Request() req: any, @Query() qipaRebateDto: any) {
    return this.qipaService.rebate(req, qipaRebateDto);
  }

  @Post(`/active`)
  @CustomInterceptorIgnore()
  @HttpCode(HttpStatus.OK)
  active(@Request() req: any, @Body() qipaActiveDto: any) {
    return this.qipaService.active(req, qipaActiveDto);
  }

}
