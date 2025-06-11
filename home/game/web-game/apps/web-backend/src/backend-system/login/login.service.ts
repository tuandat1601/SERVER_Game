import { Body, Injectable, Request } from '@nestjs/common';
import MD5 from 'apps/web-game/src/game-lib/md5';
import { cTools } from 'apps/web-game/src/game-lib/tools';
import { clone, cloneDeep } from 'lodash';
import { EBActType, EBUserStatus } from '../../backend-enum';
import { BackendAuthService } from '../../common/auth/backend-auth/backend-auth.service';
import { languageConfig } from '../../config/language/language';
import { router_all } from '../../config/router-config/router';
import { RouteChildrenConfigsTable } from '../../config/router-config/router-type';
import { BackendDataService, rKey_User_JWT } from '../../data/backend-data/backend-data.service';
import { UserEntity } from '../../entity/user.entity';
import { BaseResult, RouterResult, UserResult } from '../../result/result';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class LoginService {

  constructor(
    private readonly backendDate: BackendDataService,
    private readonly backendAuth: BackendAuthService,
  ) {
  }

  /**
   * 登录
   * @param loginDto 
   * @returns 
   */
  async login(loginDto: LoginDto) {

    let result = new UserResult();

    //登录处理
    let userEntity = await this.backendDate.getUserData(loginDto, true);

    if (!userEntity) { return result; }

    //过期时间
    let jwt_date = new Date();
    jwt_date.setMinutes(jwt_date.getMinutes() + 110);

    //JWT
    let jwt = await this.backendAuth.jwtSignBE(userEntity.username, userEntity.nickname);
    await this.backendDate.getGameCacheService().setJSON(rKey_User_JWT(userEntity), jwt);

    result.data = Object.assign({}, clone(userEntity), {
      accessToken: jwt,
      refreshToken: jwt,
      expires: cTools.newLocalDateString(jwt_date)
    })
    delete result.data.password;

    languageConfig.setSuccess(EBActType.Login, result);
    return result;
  }

  checkRoutesChildren(children: Array<RouteChildrenConfigsTable>, userEntity: UserEntity) {
    //二级菜单
    for (let index = 0; index < children.length; index++) {
      let sub_element = children[index];
      if (!sub_element || !sub_element.meta) { continue; }
      if (!sub_element.meta.auths) { continue; }
      if (!userEntity.auths || userEntity.auths.length == 0) {
        //账号 如果没有任何角色就默认为空
        sub_element.meta.auths = [];
        continue;
      }

      let cur_auth: string[] = [];
      for (let index = 0; index < sub_element.meta.auths.length; index++) {
        let auth = sub_element.meta.auths[index];
        if (!userEntity.auths.includes(auth)) { continue; }
        cur_auth.push(auth);
      }
      sub_element.meta.auths = cur_auth;

      if (sub_element.children && sub_element.children.length > 0) {

        this.checkRoutesChildren(sub_element.children, userEntity);

      }

    }
  }

  /**
   * 刷新token
   * @param req 
   */
  async refreshToken(@Request() req: any) {
    let result = new UserResult();
    //登录处理
    let user_dto = { username: req.user.username };
    let userEntity = await this.backendDate.getUserData(user_dto);

    if (!userEntity) { return result; }

    //过期时间
    let jwt_date = new Date();
    jwt_date.setMinutes(jwt_date.getMinutes() + 110);

    //JWT
    let jwt = await this.backendAuth.jwtSignBE(userEntity.username, userEntity.nickname);
    await this.backendDate.getGameCacheService().setJSON(rKey_User_JWT(userEntity), jwt);

    result.data = {
      accessToken: jwt,
      refreshToken: jwt,
      expires: cTools.newLocalDateString(jwt_date)
    }

    languageConfig.setSuccess(EBActType.RefreshToken, result);
    return result;
  }

  /**
   * 获取动态路由
   * @param req 
   * @returns 
   */
  async getAsyncRoutes(@Request() req: any) {

    let result = new RouterResult();

    let user_dto = { username: req.user.username };
    //登录处理
    let userEntity = await this.backendDate.getUserData(user_dto, true);

    if (!userEntity) {
      return result;
    }

    let cur_router_all = cloneDeep(router_all);
    //遍历路由菜单 根据角色的权限来设置路由里的权限
    for (let index = 0; index < cur_router_all.length; index++) {
      let element = cur_router_all[index];
      if (element.children && element.children.length > 0) {
        this.checkRoutesChildren(element.children, userEntity);
      }
    }

    result.data = cur_router_all;
    languageConfig.setSuccess(EBActType.Login, result);
    return result;

  }
}
