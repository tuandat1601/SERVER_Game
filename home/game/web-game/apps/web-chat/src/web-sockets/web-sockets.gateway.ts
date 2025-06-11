import { WebSocketGateway, SubscribeMessage, MessageBody, OnGatewayConnection, OnGatewayDisconnect, ConnectedSocket, WebSocketServer } from '@nestjs/websockets';
import { WebSocketsService } from './web-sockets.service';
import { Socket, Server } from 'socket.io';
import { WSRetLastChatLog, WSRetMsg } from '../common/server-response-wrapper';
import { UseFilters, UseGuards, UseInterceptors, UsePipes } from '@nestjs/common';
import { WsServiceExceptionFilter } from '../common/ws-ExceptionFilter';
import { WsServiceResponseInterceptor } from '../common/ws-Interceptor';
import { WSEMsgType } from '../common/ws-enum';
import { BaseDto, ChatDto } from '../common/client-request.dto';
import { EChatType } from 'apps/web-game/src/config/game-enum';
import { wsLanguageConfig } from '../config/language/language';
import { Throttle } from '@nestjs/throttler';
import { WsThrottlerGuard } from '../common/ws-throttler-guard';
import { WSAuthGuard } from 'apps/web-game/src/common/auth/guards/ws-auth.guard';
import { AuthService } from 'apps/web-game/src/common/auth/auth.service';
import { ValidationPipe } from 'apps/web-game/src/common/pipes/validation.pipe';
import { JwtEntity } from 'apps/web-game/src/game-data/entity/common.entity';
import { RoleInfoEntity } from 'apps/web-game/src/game-data/entity/roleinfo.entity';

@WebSocketGateway({
  transports: ['websocket'],
  cors: {
    origin: '*',
  },
})
export class WebSocketsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private readonly webSocketsService: WebSocketsService,
    private readonly authService: AuthService
  ) {

  }

  @WebSocketServer()
  server: Server;

  // socket连接钩子
  @UseFilters(new WsServiceExceptionFilter)
  @UseInterceptors(new WsServiceResponseInterceptor)
  async handleConnection(client: Socket) {

    let wsRetMsg = new WSRetMsg(WSEMsgType.Connect);
    let wsAuthGuard = new WSAuthGuard(this.authService);
    if (!await wsAuthGuard.canActivateEx(client)) {
      wsRetMsg.msg = `jwt date error1`;
      client.emit("message", wsRetMsg);
      client.disconnect();
      return wsRetMsg;
    }

    let jwtEntity: JwtEntity = this.authService.getJwtEntity(client);
    if (!jwtEntity) {
      wsRetMsg.msg = `jwt date error2`;
      client.emit("message", wsRetMsg);
      client.disconnect();
      return wsRetMsg;
    }
    let serverId = jwtEntity.serverid;
    let roleId = jwtEntity.id;
    let guild_Id;


    if (!serverId) {
      wsRetMsg.msg = "serverId is null";
      client.emit("message", wsRetMsg);
      client.disconnect();
      return wsRetMsg;
    }

    serverId = await this.webSocketsService.getGameDataService().getMainServerIds(Number(serverId));

    if (!roleId) {
      wsRetMsg.msg = "roleId is null"
      client.emit("message", wsRetMsg);
      client.disconnect();
      return wsRetMsg;
    }

    let roleInfo: RoleInfoEntity = await this.webSocketsService.checkRole({ serverid: Number(serverId), id: String(roleId) }, wsRetMsg, client);
    if (!wsRetMsg.ok) {
      client.emit("message", wsRetMsg);
      client.disconnect();
      return wsRetMsg;
    }


    if (roleInfo && roleInfo.info && roleInfo.info.guild
      && roleInfo.info.guild.guildid != undefined && roleInfo.info.guild.guildid != "") {
      guild_Id = roleInfo.info.guild.guildid;
    }

    let roomids = [];
    roomids.push(String(serverId))
    if (guild_Id) {
      roomids.push(String(guild_Id));
    }
    client.join(roomids);

    await this.webSocketsService.sendLastServerChatList(client, Number(serverId), guild_Id);
    wsLanguageConfig.setSuccess(wsRetMsg);

    return wsRetMsg;
  }

  //断开连接
  handleDisconnect(client: Socket) {
    // Handle disconnection event
    let serverId = client.handshake.query.serverId;
    let roleId = client.handshake.query.roleId;

    if (serverId && roleId) {
      this.webSocketsService.closeRole({ serverid: Number(serverId), id: String(roleId) })
    }

  }


  @UseFilters(new WsServiceExceptionFilter)
  @UseInterceptors(new WsServiceResponseInterceptor)
  @SubscribeMessage('message')
  @Throttle(1, 1)
  @UseGuards(WSAuthGuard)
  @UseGuards(WsThrottlerGuard)
  async message(@MessageBody() baseDto: BaseDto, @ConnectedSocket() client: Socket) {
    return this.webSocketsService.message(baseDto, client);
  }
}
