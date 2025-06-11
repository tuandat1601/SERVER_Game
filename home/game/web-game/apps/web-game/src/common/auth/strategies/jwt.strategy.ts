import { HttpException, HttpStatus, Injectable, Request, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { languageConfig } from 'apps/web-game/src/config/language/language';
import { RoleKeyDto } from 'apps/web-game/src/game-data/role/dto/role-key.dto';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../auth.service';
import { jwtConstants } from '../constants';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
      passReqToCallback: true
    });
  }

  async validate(@Request() req, payload: any) {

    //console.log("payload:",payload)

    let roleKeyDto: RoleKeyDto = { id: payload.id, serverid: payload.serverid };

    //服务器状态校验
    await this.authService.validateServerStataus(roleKeyDto);
    //角色状态校验
    await this.authService.validateRole(roleKeyDto);

    let jwt = req.headers['authorization'].split(' ')[1];
    let iscan = await this.authService.validateJwt({ id: payload.id, serverid: payload.serverid }, jwt)
    if (!iscan) {
      throw new UnauthorizedException();
    }

    return { id: payload.id, userid: payload.userid, serverid: payload.serverid, name: payload.name }
  }
}
