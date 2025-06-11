import { Injectable, Request, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { jwtBEConstants } from '../../constants';
import { BackendAuthService } from '../backend-auth/backend-auth.service';


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly backendAuthService: BackendAuthService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: jwtBEConstants.secret,
            passReqToCallback: true
        });
    }

    async validate(@Request() req, payload: any) {

        //console.log("payload:",payload)
        //{ id: id, username: username, nickname: nickname };
        let jwt = req.headers['authorization'].split(' ')[1];
        let iscan = await this.backendAuthService.validateJwtBE(payload.username, jwt)
        if (!iscan) {
            throw new UnauthorizedException();
        }

        return { username: payload.username, nickname: payload.nickname, time: payload.nickname }
    }
}
