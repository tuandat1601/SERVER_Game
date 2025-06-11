import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { ApiBasicAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/auth/guards/jwt-auth.guard';
import { LocalAuthGuard } from '../../common/auth/guards/local-auth.guard';
import { RouterResult, UserResult } from '../../result/result';
import { LoginDto, RefreshTokenDto } from './dto/login.dto';
import { LoginService } from './login.service';

@ApiTags('login')
@ApiBasicAuth()
@Controller('login')
export class LoginController {
  constructor(private readonly loginService: LoginService) { }

  @ApiOperation({ summary: '登录' })
  @ApiResponse({ type: UserResult })
  @UseGuards(LocalAuthGuard)
  @Post()
  login(@Body() loginDto: LoginDto) {
    return this.loginService.login(loginDto);
  }

  @ApiOperation({ summary: '刷新token' })
  @ApiResponse({ type: UserResult })
  @UseGuards(JwtAuthGuard)
  @Post(`/refreshToken`)
  refreshToken(@Request() req: any, @Body() refreshTokenDto: RefreshTokenDto) {
    return this.loginService.refreshToken(req);
  }

  @ApiOperation({ summary: '获取动态路由' })
  @ApiResponse({ type: RouterResult })
  @UseGuards(JwtAuthGuard)
  @Post(`/getAsyncRoutes`)
  getAsyncRoutes(@Request() req: any) {
    return this.loginService.getAsyncRoutes(req);
  }



}
