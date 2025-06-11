import { Controller, Get, Post, Body, Patch, Param, Delete, Request } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CustomInterceptorIgnore } from '../../common/interceptors/transform.interceptor';
import { BaseResult } from '../../result/result';
import { YouLongPaymentDto } from './dto/youlong.dto';
import { YouLongService } from './youlong.service';


@Controller('youlong')
// @ApiTags('youlong')
export class YoulongController {
  constructor(private readonly YouLongService: YouLongService) { }

  // @ApiOperation({ summary: '游龙支付回调' })
  // @ApiResponse({ type: BaseResult })
  @Post(`/payment`)
  @CustomInterceptorIgnore()
  payment(@Request() req: any, @Body() youlongPaymentDto: YouLongPaymentDto) {
    return this.YouLongService.payment(req, youlongPaymentDto);
  }

}
