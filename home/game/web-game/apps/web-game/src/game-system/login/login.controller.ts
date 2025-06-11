import { Controller, Body, Post, UseGuards, Request } from '@nestjs/common';
import { LoginService } from './login.service';
import { GameLoginAuthDto, GameLoginDto, NotifyLoginDto } from './dto/game-login.dto';
import { LocalAuthGuard } from '../../common/auth/guards/local-auth.guard';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { RESLoginMsg } from '../../game-data/entity/msg.entity';
import { cTools } from '../../game-lib/tools';
import { WebApiAuthGuard } from '../../common/auth/guards/webapi-auth.guard';
import { Throttle } from '@nestjs/throttler';


@ApiTags('login')
@Controller('login')
export class LoginController {
  constructor(private readonly loginService: LoginService,) { }

  // @Post()
  // create(@Body() createLoginDto: CreateLoginDto) {
  //   return this.loginService.create(createLoginDto);
  // }

  // @Get()
  // findAll() {
  //   return this.loginService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.loginService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() gameLoginDto: GameLoginDto) {
  //   return this.loginService.update(+id, gameLoginDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.loginService.remove(+id);
  // }



  @ApiOperation({ summary: '用户测试登录' })
  @UseGuards(WebApiAuthGuard)
  @ApiResponse({ type: RESLoginMsg })
  @Throttle(3, 1)
  @Post(`/`)
  async login(@Request() req: any, @Body() gameLoginDto: GameLoginDto) {
    return this.loginService.login(req, gameLoginDto);
  }

  @ApiOperation({ summary: 'SDK用户登录验证' })
  @UseGuards(WebApiAuthGuard)
  @ApiResponse({ type: RESLoginMsg })
  @Throttle(3, 1)
  @Post(`/gameLoginAuth`)
  async gameLoginAuth(@Request() req: any, @Body() GameLoginAuthDto: GameLoginAuthDto) {
    let gameLoginDto: GameLoginDto = {
      username: GameLoginAuthDto.channelType + "_" + GameLoginAuthDto.userid,
      password: GameLoginAuthDto.gameLoginToken,
      serverid: GameLoginAuthDto.serverid
    }
    return this.loginService.login(req, gameLoginDto);
  }

  @ApiOperation({ summary: '通知记录登录信息' })
  @UseGuards(WebApiAuthGuard)
  @ApiResponse({ type: RESLoginMsg })
  @Throttle(3, 1)
  @Post(`/notifyLogin`)
  async notifyLogin(@Request() req: any, @Body() notifyLoginDto: NotifyLoginDto) {
    return this.loginService.notifyLogin(req, notifyLoginDto);
  }

  // @ApiOperation({ summary: '测试创建用户' })
  // @Post('/test')
  // async logintest(@Body() gameLoginDto: GameLoginDto) {

  //   return this.loginService.logintest(gameLoginDto);
  // }
  /*
  @ApiOperation({ summary: '测试创建用户' })
  @Post('/test1')
  async logintest1(@Body() gameLoginDto: GameLoginDto) {

    let d2 = new Date("2023-07-21 08:17:01");
    // console.log(d2)
    // console.log(d2.toUTCString())
    // console.log(d2.toLocaleString())
    return d1;
  }*/
}
