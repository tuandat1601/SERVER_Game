import { Body, Injectable, Request } from '@nestjs/common';
import { GameLoginDto, NotifyLoginDto } from './dto/game-login.dto';
import { AuthService } from '../../common/auth/auth.service';
import { GameDataService, getRoleGameLoginKey } from "../../game-data/gamedata.service";
import { RoleKeyDto } from '../../game-data/role/dto/role-key.dto';
import { EGameRunState } from '../../config/game-enum';
import { REMsg } from '../../game-data/entity/msg.entity';
import { RoleInfoEntity, RoleSubInfoEntity } from '../../game-data/entity/roleinfo.entity';
import { cTools } from '../../game-lib/tools';

@Injectable()
export class LoginService {

  constructor(
    private readonly authService: AuthService,
    private readonly gameDataService: GameDataService,
  ) {

  }

  //测试
  // async logintest(gameLoginDto: GameLoginDto) {

  //   // let dmode = new RoleInfo()
  //   // let new_role :Role = {  id: "100",
  //   //     userid: gameLoginDto.username,
  //   //     name: dmode.name,
  //   //     serverid: gameLoginDto.serverid,
  //   //     rolelevel: dmode.rolelevel,
  //   //     gameLevels: dmode.gameLevels 
  //   //   }
  //   //   return this.roleService.create(new_role);
  //   //return  await this.gameDataService.test();

  //   let spirateShip = [{ d: 100, t: 10 }, { d: 200, t: 101 }, { d: 300, t: 102 }];

  //   //排序
  //   spirateShip.sort(function (a, b) {

  //     if (!a || !a.d || !a.t) { return 1; }

  //     if (!b || !b.d || !b.t) { return -1; }

  //     if (a.d !== b.d) {
  //       return Number(b.d) - Number(a.d);
  //     }

  //     let atime = new Date(a.t).getTime();
  //     let btime = new Date(b.t).getTime();

  //     return atime - btime;

  //   });

  //   console.log(spirateShip);

  //   return spirateShip;

  // }

  //测试
  // async logintest1(gameLoginDto: GameLoginDto) {

  //   // let dmode = new RoleInfo()
  //   // let new_role :Role = {  id: "100",
  //   //     userid: gameLoginDto.username,
  //   //     name: dmode.name,
  //   //     serverid: gameLoginDto.serverid,
  //   //     rolelevel: dmode.rolelevel,
  //   //     gameLevels: dmode.gameLevels 
  //   //   }
  //   //   return this.roleService.create(new_role);
  //   //return await this.gameDataService.test1();

  //   }

  async login(req: any, gameLoginDto: GameLoginDto) {

    //console.log('gameLoginDto', gameLoginDto);

    let data = await this.gameDataService.loginRole(req, gameLoginDto);

    //console.log('data', data);
    let game_token = "";

    if (data && data.ok) {

      game_token = await this.authService.jwtSign(data.role);
      let roleKeyDto: RoleKeyDto = {
        id: data.role.id,
        serverid: data.role.serverid
      };

      await this.gameDataService.saveRoleJWT(roleKeyDto, game_token);
    }
    else {
      return data;
    }


    if (cTools.getTestModel() && process.env.GM_OPEN === "TRUE") {
      data.info.info.gameRunState = EGameRunState.TEST;
    }
    else {
      data.info.info.gameRunState = EGameRunState.NORMAL;
    }

    if (data.info.info) {
      let roleinfo: RoleInfoEntity = data.info;
      delete roleinfo.info.roleid;
      delete roleinfo.info.name;
      delete roleinfo.merge;
    }

    return Object.assign(data, { gt: game_token });

  }

  async notifyLogin(@Request() req: any, @Body() notifyLoginDto: NotifyLoginDto) {

    // console.log(`notifyLogin:`);
    // console.log(notifyLoginDto);

    let gameCacheService = this.gameDataService.getGameCacheService();

    let ret = await gameCacheService.set(getRoleGameLoginKey(notifyLoginDto), notifyLoginDto.gameLoginToken, 60 * 5);

    //console.log(ret);

    return { ok: true };

  }

}
