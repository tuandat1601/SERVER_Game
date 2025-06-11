import { Controller, Post, UseGuards, Request, Body } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { JwtAuthGuard } from '../../common/auth/guards/jwt-auth.guard';
import { RESAureoleUpMsg } from '../../game-data/entity/msg.entity';
import { AureoleService } from './aureole.service';
import { AureoleDto } from './dto/aureole.dto';


@ApiTags('aureole')
@Controller('aureole')
@UseGuards(JwtAuthGuard)
export class AureoleController {
  constructor(private readonly aureoleService: AureoleService) { }


  @ApiOperation({ summary: '光环升级' })
  @ApiResponse({ type: RESAureoleUpMsg })
  @Throttle(5, 1)
  @Post(`/up`)
  up(@Request() req: any) {
    return this.aureoleService.up(req);
  }

  @ApiOperation({ summary: '光环激活' })
  @ApiResponse({ type: RESAureoleUpMsg })
  @Throttle(5, 1)
  @Post(`/act`)
  act(@Request() req: any, @Body() aureoleDto: AureoleDto) {
    return this.aureoleService.act(req, aureoleDto);
  }

  @ApiOperation({ summary: '光环使用' })
  @ApiResponse({ type: RESAureoleUpMsg })
  @Throttle(5, 1)
  @Post(`/use`)
  use(@Request() req: any, @Body() aureoleDto: AureoleDto) {
    return this.aureoleService.use(req, aureoleDto);
  }




}
