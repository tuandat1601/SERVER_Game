import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { ApiBasicAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { EUserRoleType } from '../../backend-enum';
import { JwtAuthGuard } from '../../common/auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/auth/guards/roles.guard';
import { Roles } from '../../common/decorator/roles.decorator';
import { UserResult, BaseResult, GetUserListResult } from '../../result/result';
import { CreateUserDto, DeleteUserDto, UpdateUserDto } from './dto/user.dto';
import { UserService } from './user.service';

@ApiTags('user')
@ApiBasicAuth()
@Controller('user')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) { }

  @ApiOperation({ summary: '获取用户列表' })
  @ApiResponse({ type: GetUserListResult })
  @Post(`/getUserList`)
  @Roles(EUserRoleType.Admin)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  getUserList(@Request() req: any) {
    return this.userService.getUserList(req);
  }

  @ApiOperation({ summary: '创建后台账号' })
  @ApiResponse({ type: UserResult })
  @Post(`/createUser`)
  @Roles(EUserRoleType.Admin)
  @UseGuards(RolesGuard)
  createUser(@Request() req: any, @Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(req, createUserDto);
  }

  @ApiOperation({ summary: '修改后台账号' })
  @ApiResponse({ type: BaseResult })
  @Post(`/updateUser`)
  @Roles(EUserRoleType.Admin)
  @UseGuards(RolesGuard)
  updateUser(@Request() req: any, @Body() updateUser: UpdateUserDto) {
    return this.userService.updateUser(req, updateUser);
  }

  @ApiOperation({ summary: '删除后台账号' })
  @ApiResponse({ type: BaseResult })
  @Post(`/deleteUser`)
  @Roles(EUserRoleType.Admin)
  @UseGuards(RolesGuard)
  deleteUser(@Request() req: any, @Body() deleteUser: DeleteUserDto) {
    return this.userService.deleteUser(req, deleteUser);
  }
}
