import { Controller, Get, Post, Body, Patch, Param, Delete, Request, Query } from '@nestjs/common';
import { CustomInterceptorIgnore } from '../../common/interceptors/transform.interceptor';
import { FywechatService } from './fywechat.service';

@Controller('fywechat')
export class FywechatController {
  constructor(private readonly fywechatService: FywechatService) { }

  @Get(`/payment`)
  @CustomInterceptorIgnore()
  payment(@Request() req: any, @Query() fywechatPaymenDto: any) {
    return this.fywechatService.payment(req, fywechatPaymenDto);
  }
}
