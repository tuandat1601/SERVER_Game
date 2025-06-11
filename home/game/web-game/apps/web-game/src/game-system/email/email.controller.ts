import { Controller, Get, Post, Body, Patch, Param, Delete, Request, UseGuards } from '@nestjs/common';
import { ApiBasicAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { JwtAuthGuard } from '../../common/auth/guards/jwt-auth.guard';
import { WebApiAuthGuard } from '../../common/auth/guards/webapi-auth.guard';
import { REMsg, RESGetEmailMsg, RESReceiveEmailMsg } from '../../game-data/entity/msg.entity';
import { AutoDeleteEmailDto, AutoReadEmailDto, AutoReceiveEmailDto, DeleteEmailDto, GetEmailDto, ReadEmailDto, ReceiveEmailDto, SendEmailDto } from './dto/email-system.dto';
import { EmailService } from './email.service';

@Controller('email')
@ApiTags('email')
@ApiBasicAuth()
export class EmailController {
  constructor(private readonly emailService: EmailService) { }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '获取邮件数据' })
  @ApiResponse({ type: RESGetEmailMsg })
  @Post(`/getData`)
  @Throttle(4, 1)
  getData(@Request() req: any, @Body() getEmailDto: GetEmailDto) {
    return this.emailService.getData(req, getEmailDto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '读邮件' })
  @ApiResponse({ type: REMsg })
  @Post(`/read`)
  read(@Request() req: any, @Body() readEmailDto: ReadEmailDto) {
    return this.emailService.read(req, readEmailDto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '一键读取邮件' })
  @ApiResponse({ type: REMsg })
  @Post(`/autoRead`)
  autoRead(@Request() req: any, @Body() autoReadEmailDto: AutoReadEmailDto) {
    return this.emailService.autoRead(req, autoReadEmailDto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '领取邮件附件' })
  @ApiResponse({ type: RESReceiveEmailMsg })
  @Post(`/receive`)
  receive(@Request() req: any, @Body() receiveEmailDto: ReceiveEmailDto) {
    return this.emailService.receive(req, receiveEmailDto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '一键领取邮件附件' })
  @ApiResponse({ type: RESReceiveEmailMsg })
  @Post(`/autoReceive`)
  autoReceive(@Request() req: any, @Body() autoReceiveEmailDto: AutoReceiveEmailDto) {
    return this.emailService.autoReceive(req, autoReceiveEmailDto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '删除邮件' })
  @ApiResponse({ type: RESReceiveEmailMsg })
  @Post(`/delete`)
  delete(@Request() req: any, @Body() deleteEmailDto: DeleteEmailDto) {
    return this.emailService.delete(req, deleteEmailDto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '一键删除邮件' })
  @ApiResponse({ type: RESReceiveEmailMsg })
  @Post(`/autoDelete`)
  autoDelete(@Request() req: any, @Body() autoDeleteEmailDto: AutoDeleteEmailDto) {
    return this.emailService.autoDelete(req, autoDeleteEmailDto);
  }

  @UseGuards(WebApiAuthGuard)
  @ApiOperation({ summary: '发送邮件 后台专用 测试服免验证' })
  @ApiResponse({ type: REMsg })
  @Post(`/sendEmail`)
  sendEmail(@Request() req: any, @Body() sendEmailDto: SendEmailDto) {
    //console.log(sendEmailDto)
    return this.emailService.sendEmail(sendEmailDto);
  }

}
