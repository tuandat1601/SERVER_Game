import { Controller, Post, UseGuards, Request, Body } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { JwtAuthGuard } from '../../common/auth/guards/jwt-auth.guard';
import {CQService} from "./cq.service";
import {CQLevelUpDTO} from './dto/cq.dto';
import {RESCQLevelUpMsg} from '../../game-data/entity/msg.entity';

@ApiTags('cq')
@Controller('cq')
@UseGuards(JwtAuthGuard)
export class CQController {
	constructor(private readonly cqService: CQService) {}

	@ApiOperation({ summary: '升级' })
  	@ApiResponse({ type: RESCQLevelUpMsg })
  	@Throttle(5, 1)
  	@Post(`/levelup`)
  	levelup(@Request() req: any, @Body() reqbody: CQLevelUpDTO) {
    	return this.cqService.levelup(req, reqbody);
  	}

}

