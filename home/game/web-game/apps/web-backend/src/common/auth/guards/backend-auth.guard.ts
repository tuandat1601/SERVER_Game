import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import MD5 from 'apps/web-game/src/game-lib/md5';
import { BackendAuthService } from '../../../../../web-backend/src/common/auth/backend-auth/backend-auth.service';



@Injectable()
export class BackendAuthGuard extends AuthGuard('beapi') {
    constructor(private readonly authService: BackendAuthService) {
        super();
    }
    async canActivate(context: ExecutionContext) {
        const req = context.getArgByIndex(1).request;

        let is_can = false;

        is_can = await this.authService.validateUser(req.body);

        if (!is_can) {
            throw new UnauthorizedException();
        }
        return is_can;
    }

}