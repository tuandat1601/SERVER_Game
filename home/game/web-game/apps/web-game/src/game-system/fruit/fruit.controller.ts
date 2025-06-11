import { Controller, Post, UseGuards, Request, Body } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { JwtAuthGuard } from '../../common/auth/guards/jwt-auth.guard';
import { RESEatFruitMsg } from '../../game-data/entity/msg.entity';
import { AllEatFruitDto, EatFruitDto } from './dto/fruit.dto';
import { FruitService } from './fruit.service';


@ApiTags('fruit')
@Controller('fruit')
@UseGuards(JwtAuthGuard)
export class FruitController {
  constructor(private readonly fruitService: FruitService) { }


  @ApiOperation({ summary: '食用' })
  @ApiResponse({ type: RESEatFruitMsg })
  @Throttle(4, 1)
  @Post(`/eat`)
  eat(@Request() req: any, @Body() eatFruitDto: EatFruitDto) {
    return this.fruitService.eat(req, eatFruitDto);
  }

  @ApiOperation({ summary: '食用全部' })
  @ApiResponse({ type: RESEatFruitMsg })
  @Throttle(4, 1)
  @Post(`/eatall`)
  eatall(@Request() req: any, @Body() eatFruitDto: AllEatFruitDto) {
    return this.fruitService.eatall(req, eatFruitDto);
  }



}
