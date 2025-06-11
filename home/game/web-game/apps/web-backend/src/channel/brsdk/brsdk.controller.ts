import { Controller, Get, Post, Body, Patch, Param, Delete, Request, Query } from '@nestjs/common';
import { CustomInterceptorIgnore } from '../../common/interceptors/transform.interceptor';
import { BrsdkService } from './brsdk.service';
import { BRSdkPaymentDto } from './dto/brsdk.dto';

@Controller('brsdk')
export class BrsdkController {
  constructor(private readonly brsdkService: BrsdkService) { }

  @Post(`/payment`)
  @CustomInterceptorIgnore()
  payment(@Request() req: any, @Body() brSdkPaymentDto: any) {
    return this.brsdkService.payment(req, brSdkPaymentDto);
  }
}
