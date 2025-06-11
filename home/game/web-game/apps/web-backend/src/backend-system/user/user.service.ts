import { Body, Injectable, Request } from '@nestjs/common';
import MD5 from 'apps/web-game/src/game-lib/md5';
import { cTools } from 'apps/web-game/src/game-lib/tools';
import { EBActType, EBUserStatus } from '../../backend-enum';
import { languageConfig } from '../../config/language/language';
import { BackendDataService } from '../../data/backend-data/backend-data.service';
import { BaseResult, GetUserListResult, UserResult } from '../../result/result';
import { CreateUserDto, DeleteUserDto, UpdateUserDto } from './dto/user.dto';


@Injectable()
export class UserService {
  constructor(
    private readonly backendDate: BackendDataService,
  ) {

  }

  async getUserList(@Request() req: any) {

    let getUserListResult = new GetUserListResult();
    let prismaBackendDB = this.backendDate.getPrismaBackendDB();

    let ret = await prismaBackendDB.user.findMany();

    if (ret) {

      for (let index = 0; index < ret.length; index++) {
        let element = ret[index];
        element.createdAt = cTools.newTransformToUTCZDate(element.createdAt);
        element.updatedAt = cTools.newTransformToUTCZDate(element.updatedAt)
      }


      getUserListResult.data = ret;
      languageConfig.setSuccess(EBActType.GetUserList, getUserListResult);
    }

    return getUserListResult;
  }
  /**
   * 创建后台账号
   * @param req 
   * @param createUser 
   * @returns 
   */
  async createUser(@Request() req: any, @Body() createUser: CreateUserDto) {
    let result = new UserResult();

    let userEntity = await this.backendDate.getUserData(createUser, true);

    if (userEntity) {
      result.msg = "账号已存在";
      return result;
    }

    let new_user = Object.assign({}, createUser, {
      password: new MD5().hex_md5(createUser.password).toLowerCase(),
      status: EBUserStatus.Normal,
      createdAt: cTools.newLocalDateString(),
    })

    await this.backendDate.updateUserData(new_user);
    await this.backendDate.createUserData(new_user);

    result.data = new_user;
    delete result.data.password;

    languageConfig.setSuccess(EBActType.CreateUser, result);
    return result;
  }

  /**
   * 修改后台账号
   * @param req 
   * @param updateUser 
   * @returns 
   */
  async updateUser(@Request() req: any, @Body() updateUser: UpdateUserDto) {

    let result = new BaseResult();

    let userEntity = await this.backendDate.getUserData(updateUser, true);

    if (!userEntity) {
      result.msg = "账号不存在";
      return result;
    }

    userEntity = Object.assign(userEntity, updateUser);

    if (updateUser.password) {
      userEntity.password = new MD5().hex_md5(updateUser.password).toLowerCase();
    }

    await this.backendDate.updateUserData(userEntity);
    await this.backendDate.saveUserData(userEntity);

    languageConfig.setSuccess(EBActType.UpdateUser, result);
    return result;
  }

  /**
   * 删除后台账号
   * @param req 
   * @param deleteUser 
   */
  async deleteUser(@Request() req: any, @Body() deleteUser: DeleteUserDto) {

    let result = new BaseResult();

    let userEntity = await this.backendDate.getUserData(deleteUser, true);

    if (!userEntity) {
      result.msg = "账号不存在";
      return result;
    }

    await this.backendDate.deleteUserData(userEntity);

    languageConfig.setSuccess(EBActType.DeleteUser, result);
    return result;
  }
}
