import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { BackendAuthService } from '../backend-auth/backend-auth.service';


@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly authService: BackendAuthService) {
        super();
    }

    async validate(username: string, password: string): Promise<any> {

        const user = await this.authService.validateUser({ username: username, password: password });
        if (!user) {
            throw new UnauthorizedException();
        }
        return user;
    }
}
