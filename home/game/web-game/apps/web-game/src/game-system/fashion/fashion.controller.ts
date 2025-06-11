import { Controller, Post, UseGuards, Request, Body } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { JwtAuthGuard } from '../../common/auth/guards/jwt-auth.guard';
import {FashionService} from "./fashion.service";
import {FashionActiveDTO, FashionDressDTO, FashionUndressDTO, FashionExpiredsDTO} from './dto/fashion.dto';
import {RESFashionActiveMsg, RESFashionDressMsg, RESFashionUndressMsg, RESFashionExpiredsMsg} from '../../game-data/entity/msg.entity';

@ApiTags('fashion')
@Controller('fashion')
@UseGuards(JwtAuthGuard)
export class FashionController {
	constructor(private readonly fashionService: FashionService) {}

	@ApiOperation({ summary: '激活' })
  	@ApiResponse({ type: RESFashionActiveMsg })
  	@Throttle(5, 1)
  	@Post(`/active`)
  	active(@Request() req: any, @Body() reqbody: FashionActiveDTO) {
    	return this.fashionService.active(req, reqbody);
  	}

	@ApiOperation({ summary: '穿戴' })
  	@ApiResponse({ type: RESFashionDressMsg })
  	@Throttle(5, 1)
  	@Post(`/dress`)
  	dress(@Request() req: any, @Body() reqbody: FashionDressDTO) {
    	return this.fashionService.dress(req, reqbody);
  	}

	@ApiOperation({ summary: '卸下' })
  	@ApiResponse({ type: RESFashionUndressMsg })
  	@Throttle(5, 1)
  	@Post(`/undress`)
  	undress(@Request() req: any, @Body() reqbody: FashionUndressDTO) {
    	return this.fashionService.undress(req, reqbody);
  	}

	@ApiOperation({ summary: '过期' })
  	@ApiResponse({ type: RESFashionExpiredsMsg })
  	@Throttle(5, 1)
  	@Post(`/expired`)
  	expired(@Request() req: any, @Body() reqbody: FashionExpiredsDTO) {
		let retMsg = new RESFashionExpiredsMsg();
		retMsg.ok = true;
		retMsg.msg = "";
    	return retMsg;
  	}
}

