import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { cTools } from 'apps/web-game/src/game-lib/tools';
import { AuthService } from '../auth.service';
import { Socket } from 'socket.io';
import { JwtEntity } from 'apps/web-game/src/game-data/entity/common.entity';
import { RoleKeyDto } from 'apps/web-game/src/game-data/role/dto/role-key.dto';
import { WsException } from '@nestjs/websockets';


@Injectable()
export class WSAuthGuard extends AuthGuard('wsapi') {

    constructor(private readonly authService: AuthService) {
        super();
    }

    async canActivate(context: ExecutionContext) {

        const client: Socket = context.switchToWs().getClient();
        let is_can = false;
        let jwt = client.handshake.auth["token"];
        let jwt_info = this.authService.getJwtEntity(client);
        if (!jwt_info) {
            // throw new WsException('Invalid jwt');
            return is_can;
        }
        let roleKeyDto: RoleKeyDto = { id: jwt_info.id, serverid: jwt_info.serverid };
        //服务器状态校验
        is_can = await this.authService.validateServerStataus(roleKeyDto, true);
        if (!is_can) { return is_can; }
        //角色状态校验
        is_can = await this.authService.validateRole(roleKeyDto, true);
        if (!is_can) { return is_can; }

        is_can = await this.authService.validateJwt(roleKeyDto, jwt)
        return is_can;
    }

    async canActivateEx(client: Socket) {
        let is_can = false;
        let jwt = client.handshake.auth["token"];
        let jwt_info = this.authService.getJwtEntity(client);
        if (!jwt_info || !jwt_info.id || !jwt_info.name || !jwt_info.serverid) {
            //throw new WsException('Invalid jwt');
            return is_can;
        }
        let roleKeyDto: RoleKeyDto = { id: jwt_info.id, serverid: jwt_info.serverid };
        //服务器状态校验
        is_can = await this.authService.validateServerStataus(roleKeyDto, true);
        if (!is_can) { return is_can; }
        //角色状态校验
        is_can = await this.authService.validateRole(roleKeyDto, true);
        if (!is_can) { return is_can; }

        is_can = await this.authService.validateJwt(roleKeyDto, jwt)
        // if (!is_can) { throw new WsException('Invalid jwt'); }
        return is_can;
    }


}