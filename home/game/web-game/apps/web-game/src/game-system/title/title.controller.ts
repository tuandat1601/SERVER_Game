import { Controller, Post, UseGuards, Request, Body } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { JwtAuthGuard } from '../../common/auth/guards/jwt-auth.guard';
import {TitleService} from "./title.service";
import {TitleActiveDTO, TitleDressDTO, TitleUndressDTO, TitleExpiredsDTO} from './dto/title.dto';
import {RESTitleActiveMsg, RESTitleDressMsg, RESTitleUndressMsg, RESTitleExpiredsMsg} from '../../game-data/entity/msg.entity';

@ApiTags('title')
@Controller('title')
@UseGuards(JwtAuthGuard)
export class TitleController {
	constructor(private readonly titleService: TitleService) {}

	@ApiOperation({ summary: '激活' })
  	@ApiResponse({ type: RESTitleActiveMsg })
  	@Throttle(5, 1)
  	@Post(`/active`)
  	active(@Request() req: any, @Body() reqbody: TitleActiveDTO) {
    	return this.titleService.active(req, reqbody);
  	}

	@ApiOperation({ summary: '穿戴' })
  	@ApiResponse({ type: RESTitleDressMsg })
  	@Throttle(5, 1)
  	@Post(`/dress`)
  	dress(@Request() req: any, @Body() reqbody: TitleDressDTO) {
    	return this.titleService.dress(req, reqbody);
  	}

	@ApiOperation({ summary: '卸下' })
  	@ApiResponse({ type: RESTitleUndressMsg })
  	@Throttle(5, 1)
  	@Post(`/undress`)
  	undress(@Request() req: any, @Body() reqbody: TitleUndressDTO) {
    	return this.titleService.undress(req, reqbody);
  	}

	@ApiOperation({ summary: '过期' })
  	@ApiResponse({ type: RESTitleExpiredsMsg })
  	@Throttle(5, 1)
  	@Post(`/expired`)
  	expired(@Request() req: any, @Body() reqbody: TitleExpiredsDTO) {
		let retMsg = new RESTitleExpiredsMsg();
		retMsg.ok = true;
		retMsg.msg = "";
    	return retMsg;
  	}

}

