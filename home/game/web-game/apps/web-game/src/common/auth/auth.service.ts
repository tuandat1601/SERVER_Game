import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RoleEntity } from '../../game-data/entity/role.entity';
import { RoleKeyDto } from '../../game-data/role/dto/role-key.dto';
import { GameDataService, getRoleGameLoginKey } from '../../game-data/gamedata.service';
import { languageConfig } from '../../config/language/language';
import { EGameRoleStatus } from '../../config/game-enum';
import { GameEntity } from 'apps/web-backend/src/entity/game.entity';
import { EBServerStatus } from 'apps/web-backend/src/backend-enum';
import { gameConst } from '../../config/game-const';
import { cTools } from '../../game-lib/tools';
import { JwtEntity } from '../../game-data/entity/common.entity';
import { WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';
@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly gameDataService: GameDataService,
  ) { }

  async validateUser(req: any): Promise<any> {

    // /userid: string, httoken: string
    let userid = req.body.username;
    let httoken = req.body.password;

    if (cTools.getTestModel() || process.env.TEST_LOGIN_OPEN === "TRUE") {
      return { userid, httoken };
    }

    //线上测试登录
    let prismaBackendDB = this.gameDataService.getPrismaBackendDB();

    let ret_data = await prismaBackendDB.game_backend_user.findFirst({
      where: {
        channelUserId: userid
      },
      include: {
        games: true
      }
    })

    if (!ret_data || !ret_data.games) {
      return null;
    }

    let gameEntity: GameEntity = <unknown>ret_data.games;

    let ip = req.headers["x-real-ip"];

    if (!gameEntity.whitelist || gameEntity.whitelist.length <= 0) {
      return null;
    }



    if (gameEntity.whitelist.includes(ip)) {
      userid = `${ret_data.channelType}_${userid}`;
      req.body.username = userid;
      return { userid, httoken };
    }

    return null;
  }

  async validateGameLogin(data: any): Promise<any> {

    //data.userid 
    //data.gameLoginToken
    //data.serverid
    //console.log("AuthService validateGameLogin data:", data);
    let gameCacheService = this.gameDataService.getGameCacheService();

    let gameLoginToken = await gameCacheService.get(getRoleGameLoginKey(data));
    //console.log("gameLoginToken:", gameLoginToken);
    if (!gameLoginToken) {
      return false;
    }

    if (gameLoginToken !== data.gameLoginToken) {
      return false;
    }

    return true;
  }

  async validateRole(roleKeyDto: RoleKeyDto, isWS: boolean = false) {

    let role = await this.gameDataService.getRole(roleKeyDto);

    if (!role) {
      if (isWS) {
        //throw new WsException(languageConfig.tip.not_find_role);
        return false
      }
      else {
        throw new HttpException(languageConfig.tip.not_find_role, HttpStatus.FORBIDDEN);
      }
    }

    if (role.status === EGameRoleStatus.DISABLE) {
      if (isWS) {
        //throw new WsException(languageConfig.tip.role_forbidden);
        return false
      }
      else {
        throw new HttpException(languageConfig.tip.role_forbidden, HttpStatus.FORBIDDEN);
      }
    }

    return true;
  }

  async validateJwt(roleKeyDto: RoleKeyDto, jwt: string) {

    let cur_jwt = await this.gameDataService.getRoleJWT(roleKeyDto);

    if (cur_jwt !== jwt) {
      return false;
    }

    return true;
  }


  async validateServerStataus(roleKeyDto: RoleKeyDto, isWS: boolean = false) {

    let serverInfo = await this.gameDataService.getServerSubInfo(roleKeyDto.serverid);

    if (!serverInfo) {
      if (isWS) {
        //throw new WsException(languageConfig.tip.server_info_nil);
        return false;
      }
      else {
        throw new HttpException(languageConfig.tip.server_info_nil, HttpStatus.FORBIDDEN);
      }
    }

    if (serverInfo.status === EBServerStatus.Maintain) {

      if (isWS) {
        //throw new WsException(languageConfig.tip.server_maintain);
        return false;
      }
      else {
        throw new HttpException(languageConfig.tip.server_maintain, HttpStatus.FORBIDDEN);
      }
    }

    if (serverInfo.status === EBServerStatus.Close) {

      if (isWS) {
        //throw new WsException(languageConfig.tip.server_close);
        return false;
      }
      else {
        throw new HttpException(languageConfig.tip.server_close, HttpStatus.FORBIDDEN);
      }
    }
    return true;
  }

  async jwtSign(role: RoleEntity): Promise<string> {
    //console.log("role:",role);
    const payload: JwtEntity = { id: role.id, userid: role.userid, serverid: role.serverid, name: role.name };
    return this.jwtService.sign(payload);
  }

  getJwtService() {
    return this.jwtService;
  }

  getJwtEntity(client: Socket) {
    if (!client || !client.handshake.auth || !client.handshake.auth["token"]) {
      return;
    }

    let jwt = client.handshake.auth["token"];
    let jwt_info = <JwtEntity>this.jwtService.decode(jwt);
    return jwt_info;
  }

}
