import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import MD5 from 'apps/web-game/src/game-lib/md5';
import { cTools } from 'apps/web-game/src/game-lib/tools';
import { SendEmailDto } from 'apps/web-game/src/game-system/email/dto/email-system.dto';
import { webApiConstants } from '../constants';


@Injectable()
export class GMAuthGuard extends AuthGuard('gmapi') {

    async canActivate(context: ExecutionContext) {
        const req = context.getArgByIndex(1).request;

        let is_can = false;

        if (cTools.getTestModel() && process.env.GM_OPEN === "TRUE") {
            is_can = true;
        }

        if (!is_can) {
            throw new UnauthorizedException();
        }
        return is_can;
    }


}