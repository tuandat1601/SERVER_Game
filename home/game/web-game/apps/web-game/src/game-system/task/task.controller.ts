import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { ApiBasicAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { JwtAuthGuard } from '../../common/auth/guards/jwt-auth.guard';
import { RESGetOpenWelfareAwardMsg, RESGetTaskAwardMsg, RESGetTaskDailyAwardMsg, RESGetTaskDailyBoxAwardMsg, RESGetTaskGradeAwardMsg, RESGetTaskMainAwardMsg, RESGuildLivenessAwardMsg, RESGuildTaskAwardMsg } from '../../game-data/entity/msg.entity';
import { GetGuildLivenessAwardDto, GetOpenWelfareAwardDto, GetTaskAwardDto, GetTaskDailyAwardDto, GetTaskDailyBoxAwardDto, GetTaskGradeAwardDto, GetTaskMainAwardDto } from './dto/task.dto';
import { TaskService } from './task.service';

@Controller('task')
@ApiTags('task')
@ApiBasicAuth()
export class TaskController {
  constructor(private readonly taskService: TaskService) { }

  @ApiOperation({ summary: '获取主线任务奖励' })
  @ApiResponse({ type: RESGetTaskMainAwardMsg })
  @UseGuards(JwtAuthGuard)
  @Throttle(2, 1)
  @Post(`/getTaskMainAward`)
  async getTaskMainAward(@Request() req: any, @Body() getTaskMainAwardDto: GetTaskMainAwardDto) {
    return this.taskService.getTaskMainAward(req, getTaskMainAwardDto);
  }

  @ApiOperation({ summary: '获取每日任务奖励' })
  @ApiResponse({ type: RESGetTaskDailyAwardMsg })
  @UseGuards(JwtAuthGuard)
  @Throttle(4, 1)
  @Post(`/getTaskDailyAward`)
  async getTaskDailyAward(@Request() req: any, @Body() getTaskDailyAwardDto: GetTaskDailyAwardDto) {
    return this.taskService.getTaskDailyAward(req, getTaskDailyAwardDto);
  }

  @ApiOperation({ summary: '获取每日任务活跃奖励' })
  @ApiResponse({ type: RESGetTaskDailyBoxAwardMsg })
  @UseGuards(JwtAuthGuard)
  @Throttle(4, 1)
  @Post(`/getTaskDailyBoxAward`)
  async getTaskDailyBoxAward(@Request() req: any, @Body() getTaskDailyBoxAwardDto: GetTaskDailyBoxAwardDto) {
    return this.taskService.getTaskDailyBoxAward(req, getTaskDailyBoxAwardDto);
  }

  @ApiOperation({ summary: '获取进阶任务奖励' })
  @ApiResponse({ type: RESGetTaskGradeAwardMsg })
  @UseGuards(JwtAuthGuard)
  @Throttle(2, 1)
  @Post(`/getTaskGradeAward`)
  async getTaskGradeAward(@Request() req: any, @Body() getTaskGradeAwardDto: GetTaskGradeAwardDto) {
    return this.taskService.getTaskGradeAward(req, getTaskGradeAwardDto);
  }

  @ApiOperation({ summary: '领取开服福利任务奖励' })
  @ApiResponse({ type: RESGetTaskAwardMsg })
  @UseGuards(JwtAuthGuard)
  @Throttle(4, 1)
  @Post(`/getTaskOpenWelfareAward`)
  async getTaskOpenWelfareAward(@Request() req: any, @Body() getTaskAwardDto: GetTaskAwardDto) {
    return this.taskService.getTaskOpenWelfareAward(req, getTaskAwardDto);
  }

  @ApiOperation({ summary: '领取开服福利积分奖励' })
  @ApiResponse({ type: RESGetOpenWelfareAwardMsg })
  @UseGuards(JwtAuthGuard)
  @Throttle(4, 1)
  @Post(`/getOpenWelfarePointAward`)
  async getOpenWelfarePointAward(@Request() req: any, @Body() getOpenWelfareAwardDto: GetOpenWelfareAwardDto) {
    return this.taskService.getOpenWelfarePointAward(req, getOpenWelfareAwardDto);
  }

  @ApiOperation({ summary: '领取公会活跃度奖励' })
  @ApiResponse({ type: RESGuildLivenessAwardMsg })
  @UseGuards(JwtAuthGuard)
  @Throttle(4, 1)
  @Post(`/getGuildLivenessAward`)
  async getGuildLivenessAward(@Request() req: any, @Body() dto: GetGuildLivenessAwardDto) {
    return this.taskService.getGuildLivenessAward(req, dto);
  }

  @ApiOperation({ summary: '领取公会任务奖励' })
  @ApiResponse({ type: RESGuildTaskAwardMsg })
  @UseGuards(JwtAuthGuard)
  @Throttle(4, 1)
  @Post(`/getGuildTaskAward`)
  async getGuildTaskAward(@Request() req: any, @Body() dto: GetTaskAwardDto) {
    return this.taskService.getGuildTaskAward(req, dto);
  }

}
