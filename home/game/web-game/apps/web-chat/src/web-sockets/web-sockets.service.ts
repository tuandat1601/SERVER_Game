import { Injectable } from '@nestjs/common';
import { ConnectedSocket, MessageBody, WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { GameDataService } from 'apps/web-game/src/game-data/gamedata.service';
import { RoleKeyDto } from 'apps/web-game/src/game-data/role/dto/role-key.dto';
import { WSRetChat, WSRetLastChatLog, WSRetMsg } from '../common/server-response-wrapper';
import { BaseDto, ChatDto, GuildDto } from '../common/client-request.dto';
import { WSEMsgType } from '../common/ws-enum';
import { ChatLogEntity } from 'apps/web-game/src/game-data/entity/common.entity';
import { EChatType, EGameRoleStatus } from 'apps/web-game/src/config/game-enum';
import { Filter } from 'apps/web-game/src/game-lib/sensitiveword/filter';
import { RoleInfoEntity } from 'apps/web-game/src/game-data/entity/roleinfo.entity';
import { TableGameConfig } from 'apps/web-game/src/config/gameTable/TableGameConfig';
import { wsLanguageConfig } from '../config/language/language';
import { cTools } from 'apps/web-game/src/game-lib/tools';
import { AuthService } from 'apps/web-game/src/common/auth/auth.service';



@Injectable()
export class WebSocketsService {

  private onlineRole: Record<number, Record<string, Socket>>
  constructor(
    private readonly gameDataService: GameDataService,
    private readonly authService: AuthService
  ) {
    this.onlineRole = {};
  }

  getGameDataService() {
    return this.gameDataService;
  }

  /**
   * 发送聊天记录
   * @param client 玩家socket
   * @param serverId 服务器ID
   * @param guildid 公会ID
   */
  async sendLastServerChatList(client: Socket, serverId: number, guildid?: string) {

    let wsRetChatConnet = new WSRetLastChatLog(WSEMsgType.Ret_LastChatlog);
    let schatlist = await this.gameDataService.getChatListByType(Number(serverId), EChatType.Server);

    if (schatlist.length > TableGameConfig.schat_last_num) {
      wsRetChatConnet.schatlist = schatlist.slice(TableGameConfig.schat_last_num * -1);
    }
    else {
      wsRetChatConnet.schatlist = schatlist;
    }

    if (guildid) {
      let gchatlist = await this.gameDataService.getChatListByType(Number(serverId), EChatType.Guild, guildid);

      if (gchatlist.length > TableGameConfig.gchat_last_num) {
        wsRetChatConnet.gchatlist = gchatlist.slice(TableGameConfig.gchat_last_num * -1);
      }
      else {
        wsRetChatConnet.gchatlist = gchatlist;
      }
    }

    wsLanguageConfig.setSuccess(wsRetChatConnet);
    client.emit("message", wsRetChatConnet);
  }

  async checkRole(roleKeyDto: RoleKeyDto, wsRetMsg: WSRetMsg, client: Socket) {

    let roleInfo = await this.gameDataService.getRoleInfo(roleKeyDto);

    if (!roleInfo) {
      wsRetMsg.msg = "非法用户";
      return;
    }

    this.onlineRole[roleKeyDto.serverid] = this.onlineRole[roleKeyDto.serverid] || {};

    //顶号
    if (this.onlineRole[roleKeyDto.serverid][roleKeyDto.id] && this.onlineRole[roleKeyDto.serverid][roleKeyDto.id].connected) {
      this.closeRole(roleKeyDto);
    }

    this.onlineRole[roleKeyDto.serverid][roleKeyDto.id] = client;
    wsRetMsg.ok = true;

    return roleInfo;
    //console.log("onlineRole", this.onlineRole);
  }

  async closeRole(roleKeyDto: RoleKeyDto) {

    this.onlineRole[roleKeyDto.serverid] = this.onlineRole[roleKeyDto.serverid] || {};

    if (this.onlineRole[roleKeyDto.serverid][roleKeyDto.id]) {
      this.onlineRole[roleKeyDto.serverid][roleKeyDto.id].disconnect();
      delete this.onlineRole[roleKeyDto.serverid][roleKeyDto.id];
    }
    //console.log("onlineRole", this.onlineRole);
  }


  async message(@MessageBody() baseDto: BaseDto, @ConnectedSocket() client: Socket) {

    let jwtEntity = this.authService.getJwtEntity(client);
    let retmsg = new WSRetMsg(baseDto.type);
    if (!jwtEntity) {
      // throw new WsException('Invalid jwt');
      retmsg.msg = "message jwt error 0"
      return retmsg;
    }
    let serverId = jwtEntity.serverid;
    let roleId = jwtEntity.id;
    let guild_Id;

    if (!roleId) {
      retmsg.msg = "roleId 不存在"
      return retmsg;
    }

    if (!serverId || !roleId) {
      retmsg.msg = "serverId 不存在"
      return retmsg;
    }

    if (cTools.getTestModel()) {
      //console.log("client.handshake.query:", client.handshake.query);
      console.log("baseDto:", baseDto);
      //console.log("countBytes:", cTools.countBytes(wsChatDto.chatMsg));
    }



    let roleinfo = await this.gameDataService.getRoleInfo({ serverid: serverId, id: roleId });

    if (!roleinfo) {
      retmsg.msg = "玩家不在线";
      client.disconnect();
      return retmsg;
    }

    let roleInfoEntity = <RoleInfoEntity><unknown>roleinfo;

    if (baseDto.type === WSEMsgType.Send_ServerChat || baseDto.type === WSEMsgType.Send_GuildChat) {

      let wsChatDto = <ChatDto>baseDto;
      wsChatDto.chatMsg = Filter.replace(wsChatDto.chatMsg);
      let role_Cache = await this.gameDataService.getRole({ id: roleId, serverid: serverId }, false, 1, false);
      if (!role_Cache) {
        retmsg.msg = "玩家不在线";
        client.disconnect();
        return retmsg;
      }

      if (role_Cache.status === EGameRoleStatus.DISABLE) {
        retmsg.msg = "你被封禁中不能发言";
        return retmsg;
      }

      if (role_Cache.status === EGameRoleStatus.MUTED) {
        retmsg.msg = "你被禁言中不能发言";
        return retmsg;
      }

      if (cTools.countBytes(wsChatDto.chatMsg) > 190) {
        retmsg.msg = "发言内容过长";
        return retmsg;
      }

      if (TableGameConfig.chat_cond) {

        if (TableGameConfig.chat_cond?.lv && roleInfoEntity.rolelevel < TableGameConfig.chat_cond.lv) {
          retmsg.msg = `${TableGameConfig.chat_cond.lv}级以上才能发言`;
          return retmsg;
        }

        if (TableGameConfig.chat_cond?.totalRecharge
          && roleInfoEntity.info
          && roleInfoEntity.info.rechargeInfo
          && roleInfoEntity.info.rechargeInfo.totalAmounts
          && roleInfoEntity.info.rechargeInfo.totalAmounts < TableGameConfig.chat_cond.totalRecharge) {
          retmsg.msg = `累充${TableGameConfig.chat_cond.totalRecharge}元以上才能发言`;
          return retmsg;
        }
      }

      let cur_chat_entity: ChatLogEntity = {
        serverid: Number(serverId),
        type: EChatType.Server,
        sender: String(roleId),
        msg: wsChatDto.chatMsg,
        info: {
          c: roleInfoEntity.info.ico,
          n: roleInfoEntity.info.name,
          lv: roleInfoEntity.rolelevel,
          title: 0,
        },
        createdAt: new Date()
      }
      if (roleInfoEntity.info.title != undefined) {
        cur_chat_entity.info.title = roleInfoEntity.info.title.show;
      }
      let ret_msg_other = new WSRetChat(wsChatDto.type);
      ret_msg_other.chatLogEntity = cur_chat_entity;
      ret_msg_other.ok = true;
      ret_msg_other.msg = "" + wsChatDto.type;

      if (wsChatDto.type === WSEMsgType.Send_ServerChat) {
        //全服群发
        ret_msg_other.type = WSEMsgType.Ret_ServerChat
        client.broadcast.to(String(serverId)).emit('message', ret_msg_other);
      }
      else if (wsChatDto.type === WSEMsgType.Send_GuildChat) {

        if (roleInfoEntity && roleInfoEntity.info && roleInfoEntity.info.guild
          && roleInfoEntity.info.guild.guildid != undefined && roleInfoEntity.info.guild.guildid != "") {
          guild_Id = roleInfoEntity.info.guild.guildid;
        }

        if (!guild_Id) {
          retmsg.msg = "公会ID不存在"
          return retmsg;
        }
        cur_chat_entity.type = EChatType.Guild;
        ret_msg_other.type = WSEMsgType.Ret_GuildChat;
        cur_chat_entity.target = guild_Id;
        //全公会群发
        client.broadcast.to(String(guild_Id)).emit('message', ret_msg_other);
      }

      await this.gameDataService.addChatData(cur_chat_entity);
    }
    else if (baseDto.type === WSEMsgType.Send_JoinGuid) {

      let guildDto = <GuildDto>baseDto;
      if (roleInfoEntity.info && roleInfoEntity.info.guild && roleInfoEntity.info.guild.guildid === guildDto.guildId) {
        client.join(guildDto.guildId);
      }
      else {
        retmsg.msg = `没有加入该公会 公会ID:${guildDto.guildId}`;
        return retmsg;
      }

    } else if (baseDto.type === WSEMsgType.Send_LeaveGuid) {
      let guildDto = <GuildDto>baseDto;

      if (roleInfoEntity.info && roleInfoEntity.info.guild && roleInfoEntity.info.guild.guildid === guildDto.guildId) {
        retmsg.msg = `没有退出公会 公会ID:${guildDto.guildId}`;
        return retmsg;
      }
      else {
        client.leave(guildDto.guildId);
      }

    }

    wsLanguageConfig.setSuccess(retmsg);
    return retmsg;
  }
}
