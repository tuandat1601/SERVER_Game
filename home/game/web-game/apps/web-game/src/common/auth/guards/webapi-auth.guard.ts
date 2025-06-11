import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UpdateRoleStatusDto } from 'apps/web-backend/src/backend-system/customer-service/dto/customer-service.dto';
import { AutoMaintainServerDto, AutoOpenServerDto, BEFindRolesDto, BEGetChatLogDto, BESendEmailDto, BESendRechargeShopDto, BESetCrossServerIdDto, ChangeServerStatusDto, CreateServerDto, DeleteServerDto, MergeServerDto, UpdateServerDto, UpdateToServerDto } from 'apps/web-backend/src/backend-system/games-mgr/dto/games-mgr.dto';
import MD5 from 'apps/web-game/src/game-lib/md5';
import { SendEmailDto } from 'apps/web-game/src/game-system/email/dto/email-system.dto';
import { NotifyLoginDto } from 'apps/web-game/src/game-system/login/dto/game-login.dto';
import { PayBuyItemDto } from 'apps/web-game/src/game-system/shop/dto/shop.dto';
import { AuthService } from '../auth.service';
import { webApiConstants } from '../constants';


@Injectable()
export class WebApiAuthGuard extends AuthGuard('webapi') {

  constructor(private readonly authService: AuthService) {
    super();
  }

  async canActivate(context: ExecutionContext) {
    const req = context.getArgByIndex(1).request;

    let is_can = false;

    if (req && req.url) {

      if (req.url.indexOf("/email/sendEmail") !== -1) {
        is_can = await this.validateEmailWebApi(req.body);
      }
      else if (req.url.indexOf("/login/gameLoginAuth") !== -1) {
        is_can = await this.authService.validateGameLogin(req.body);
      }
      else if (req.url.indexOf("/login/notifyLogin") !== -1) {
        is_can = await this.validateNotifyLogin(req.body);
      }
      else if (req.url.indexOf("/game-common/createServer") !== -1) {
        is_can = await this.validateCreateServer(req.body);
      }
      else if (req.url.indexOf("/game-common/updateToServer") !== -1) {
        is_can = await this.validateUpdateToServer(req.body);
      }
      else if (req.url.indexOf("/game-common/updateServer") !== -1) {
        is_can = await this.validateUpdateServer(req.body);
      }
      else if (req.url.indexOf("/game-common/deleteServer") !== -1) {
        is_can = await this.validateDeleteServer(req.body);
      }
      else if (req.url.indexOf("/shop/beSendRechargeShop") !== -1) {
        is_can = await this.validatebeSendRechargeShop(req.body);
      }
      else if (req.url.indexOf("/game-common/updateRoleStatus") !== -1) {
        is_can = await this.validateUpdateRoleStatus(req.body);
      }
      else if (req.url.indexOf("/game-common/changeServerStatus") !== -1) {
        is_can = await this.validateChangeServerStatus(req.body);
      }
      else if (req.url.indexOf("/game-common/mergeServer") !== -1) {
        is_can = await this.validateMergeServer(req.body);
      }
      else if (req.url.indexOf("/game-common/autoMaintainServer") !== -1) {
        is_can = await this.validateAutoMaintainServer(req.body);
      }
      else if (req.url.indexOf("/game-common/autoOpenServer") !== -1) {
        is_can = await this.validateAutoOpenServer(req.body);
      }
      else if (req.url.indexOf("/game-common/findRoles") !== -1) {
        is_can = await this.validateFindRoles(req.body);
      }
      else if (req.url.indexOf("/game-common/getChatLog") !== -1) {
        is_can = await this.validateGetChatLog(req.body);
      }
      else if (req.url.indexOf("/game-common/setCrossServerId") !== -1) {
        is_can = await this.validateSetCrossServerId(req.body);
      }
      else if (req.url === "/login") {
        is_can = await this.authService.validateUser(req)
      }
    }

    if (!is_can) {
      throw new UnauthorizedException();
    }
    return is_can;
  }

  async validateSetCrossServerId(payload: any) {

    // console.log("validate---SetCrossServerId:");
    // console.log(payload);

    let beSetCrossServerIdDto: BESetCrossServerIdDto = payload;
    let sgin = `${beSetCrossServerIdDto.gameId}${beSetCrossServerIdDto.serverId}${beSetCrossServerIdDto.crossServerId}${webApiConstants.secret}${beSetCrossServerIdDto.time}`;
    let sgin_md5 = new MD5().hex_md5(sgin).toLowerCase();
    // console.log("sgin:", sgin);
    // console.log("sgin_md5:", sgin_md5);
    if (beSetCrossServerIdDto.key !== sgin_md5) {
      return false;
    }

    return true;
  }

  async validateGetChatLog(payload: any) {

    //console.log("validate---validateGetChatLog:");
    //console.log(payload);

    let beGetChatLogDto: BEGetChatLogDto = payload;
    let sgin = `${beGetChatLogDto.gameId}${beGetChatLogDto.serverid}${beGetChatLogDto.serverid}${webApiConstants.secret}${beGetChatLogDto.time}`;
    let sgin_md5 = new MD5().hex_md5(sgin).toLowerCase();
    //console.log("sgin_md5:", sgin_md5);
    if (beGetChatLogDto.key !== sgin_md5) {
      return false;
    }

    return true;
  }

  async validateFindRoles(payload: any) {

    //console.log("validate---validateFindRoles:");
    //console.log(payload);

    let beFindRolesDto: BEFindRolesDto = payload;
    let sgin = `${beFindRolesDto.sku}${beFindRolesDto.userId}${webApiConstants.secret}${beFindRolesDto.time}`;
    let sgin_md5 = new MD5().hex_md5(sgin).toLowerCase();
    //console.log("sgin_md5:", sgin_md5);
    if (beFindRolesDto.key !== sgin_md5) {
      return false;
    }

    return true;
  }


  async validateAutoMaintainServer(payload: any) {

    // console.log("validate---validateAutoMaintainServer:");
    // console.log(payload);

    let autoMaintainServer: AutoMaintainServerDto = payload;
    let sgin = `${autoMaintainServer.gameId}${webApiConstants.secret}${autoMaintainServer.time}`;
    let sgin_md5 = new MD5().hex_md5(sgin).toLowerCase();
    //console.log("sgin_md5:", sgin_md5);
    if (autoMaintainServer.key !== sgin_md5) {
      return false;
    }

    return true;
  }

  async validateAutoOpenServer(payload: any) {
    // console.log("validate---validateAutoOpenServer:");
    // console.log(payload);

    let autoOpenServerDto: AutoOpenServerDto = payload;
    let sgin = `${autoOpenServerDto.gameId}${webApiConstants.secret}${autoOpenServerDto.time}`;
    let sgin_md5 = new MD5().hex_md5(sgin).toLowerCase();
    //console.log("sgin_md5:", sgin_md5);
    if (autoOpenServerDto.key !== sgin_md5) {
      return false;
    }

    return true;
  }

  async validateMergeServer(payload: any) {
    console.log("validate---validateMergeServer:");
    console.log(payload);

    let mergeServerDto: MergeServerDto = payload;
    let sgin = `${mergeServerDto.gameId}${mergeServerDto.targetId}${webApiConstants.secret}${mergeServerDto.sourceId}${mergeServerDto.time}`;
    let sgin_md5 = new MD5().hex_md5(sgin).toLowerCase();
    //console.log("sgin_md5:", sgin_md5);
    if (mergeServerDto.key !== sgin_md5) {
      return false;
    }

    return true;
  }


  async validateChangeServerStatus(payload: any) {
    // console.log("validate---ChangeServerStatus:");
    // console.log(payload);

    let changeServerStatusDto: ChangeServerStatusDto = payload;
    let sgin = `${changeServerStatusDto.gameId}${changeServerStatusDto.serverId}${webApiConstants.secret}${changeServerStatusDto.status}${changeServerStatusDto.time}`;
    let sgin_md5 = new MD5().hex_md5(sgin).toLowerCase();
    //console.log("sgin_md5:", sgin_md5);
    if (changeServerStatusDto.key !== sgin_md5) {
      return false;
    }

    return true;
  }

  async validateUpdateRoleStatus(payload: any) {
    // console.log("validate---UpdateRoleStatus:");
    // console.log(payload);

    let updateRoleStatusDto: UpdateRoleStatusDto = payload;
    let sgin = `${updateRoleStatusDto.gameid}${updateRoleStatusDto.serverid}${updateRoleStatusDto.roleid}${webApiConstants.secret}${updateRoleStatusDto.status}${updateRoleStatusDto.time}`;
    let sgin_md5 = new MD5().hex_md5(sgin).toLowerCase();
    //console.log("sgin_md5:", sgin_md5);
    if (updateRoleStatusDto.key !== sgin_md5) {
      return false;
    }

    return true;
  }

  async validatebeSendRechargeShop(payload: any) {
    //console.log("validate---CreateServer:");
    //console.log(payload);

    let beSendRechargeShopDto: BESendRechargeShopDto = payload;
    let sgin = `${beSendRechargeShopDto.gameId}${beSendRechargeShopDto.serverid}${beSendRechargeShopDto.shopid}${beSendRechargeShopDto.roleid}${webApiConstants.secret}${beSendRechargeShopDto.time}`;
    let sgin_md5 = new MD5().hex_md5(sgin).toLowerCase();
    //console.log("sgin_md5:", sgin_md5);
    if (beSendRechargeShopDto.key !== sgin_md5) {
      return false;
    }

    return true;
  }

  async validateCreateServer(payload: any) {
    //console.log("validate---CreateServer:");
    //console.log(payload);

    let createServerDto: CreateServerDto = payload;
    let sgin = `${createServerDto.gameId}${createServerDto.serverId}${createServerDto.openTime}${createServerDto.status}${webApiConstants.secret}${createServerDto.time}`;
    let sgin_md5 = new MD5().hex_md5(sgin).toLowerCase();
    //console.log("sgin_md5:", sgin_md5);
    if (createServerDto.key !== sgin_md5) {
      return false;
    }

    return true;
  }

  async validateUpdateToServer(payload: any) {
    //console.log("validate--UpdateToServer:");
    //console.log(payload);

    let updateToServerDto: UpdateToServerDto = payload;
    let sgin = `${updateToServerDto.gameId}${updateToServerDto.serverId}${updateToServerDto.openTime}${updateToServerDto.status}${webApiConstants.secret}${updateToServerDto.time}`;
    let sgin_md5 = new MD5().hex_md5(sgin).toLowerCase();
    //console.log("sgin_md5:", sgin_md5);
    if (updateToServerDto.key !== sgin_md5) {
      return false;
    }

    return true;
  }


  async validateUpdateServer(payload: any) {
    //console.log("validate---UpdateServer:");
    //console.log(payload);

    let updateServerDto: UpdateServerDto = payload;
    let sgin = `${updateServerDto.gameId}${updateServerDto.serverId}${updateServerDto.openTime}${updateServerDto.status}${webApiConstants.secret}${updateServerDto.time}`;
    let sgin_md5 = new MD5().hex_md5(sgin).toLowerCase();
    //console.log("sgin_md5:", sgin_md5);
    if (updateServerDto.key !== sgin_md5) {
      return false;
    }

    return true;
  }

  async validateDeleteServer(payload: any) {
    //console.log("validate---DeleteServer:");
    //console.log(payload);

    let deleteServerDto: DeleteServerDto = payload;
    let sgin = `${deleteServerDto.gameId}${deleteServerDto.serverId}${webApiConstants.secret}${deleteServerDto.time}`;
    let sgin_md5 = new MD5().hex_md5(sgin).toLowerCase();
    //console.log("sgin_md5:", sgin_md5);
    if (deleteServerDto.key !== sgin_md5) {
      return false;
    }

    return true;
  }

  async validateNotifyLogin(payload: any) {
    // console.log("validateNotifyLogin:");
    //console.log(payload);

    let notifyLoginDto: NotifyLoginDto = payload;
    let sgin = `${notifyLoginDto.channelType}${notifyLoginDto.userid}${notifyLoginDto.serverid}${notifyLoginDto.time1}${webApiConstants.secret}${notifyLoginDto.time2}`;
    let sgin_md5 = new MD5().hex_md5(sgin).toLowerCase();
    //console.log("sgin_md5:", sgin_md5);
    if (notifyLoginDto.gameLoginToken !== sgin_md5) {
      return false;
    }

    return true;
  }

  async validateEmailWebApi(payload: any): Promise<any> {

    // console.log("validateEmailWebApi:");
    // console.log(payload);

    // if (cTools.getTestModel();) {
    //   return true;
    // }

    let new_data: SendEmailDto = payload;
    let new_str = `${webApiConstants.secret}|${new_data.sender}|${new_data.owner}|${new_data.title}|${new_data.serverid}|${JSON.stringify(new_data.items)}|`;
    let new_md5key = new MD5().hex_md5(new_str).toLowerCase()
    //console.log("sgin_md5:", new_md5key);
    if (new_md5key === payload.key) {
      return true;
    }

    return false;
  }
}