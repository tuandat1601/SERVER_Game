import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { BECreateCrossServerDto, BEDeleteCrossServerDto } from 'apps/web-backend/src/backend-system/games-mgr/dto/games-mgr.dto';
import MD5 from 'apps/web-game/src/game-lib/md5';
import { AuthService } from '../auth.service';
import { webApiConstants } from '../constants';


@Injectable()
export class CrossAuthGuard extends AuthGuard('webapi') {

    constructor(private readonly authService: AuthService) {
        super();
    }

    async canActivate(context: ExecutionContext) {
        const req = context.getArgByIndex(1).request;

        let is_can = false;

        if (req && req.url) {

            if (req.url.indexOf("/cross/createCrossServer") !== -1) {
                is_can = await this.validateCreateCrossServer(req.body);
            }
            else if (req.url.indexOf("/cross/deleteCrossServer") !== -1) {
                is_can = await this.validateDeleteCrossServer(req.body);
            }

        }

        if (!is_can) {
            throw new UnauthorizedException();
        }
        return is_can;
    }

    async validateDeleteCrossServer(payload: any) {

        // console.log("validate---DeleteCrossServer:");
        // console.log(payload);

        let beDeleteCrossServerDto: BEDeleteCrossServerDto = payload;
        let sgin = `${beDeleteCrossServerDto.gameId}${beDeleteCrossServerDto.crossServerId}${webApiConstants.secret}${beDeleteCrossServerDto.time}`;
        let sgin_md5 = new MD5().hex_md5(sgin).toLowerCase();
        //console.log("sgin_md5:", sgin_md5);
        if (beDeleteCrossServerDto.key !== sgin_md5) {
            return false;
        }

        return true;
    }

    async validateCreateCrossServer(payload: any) {

        //console.log("validate---CreateCrossServer:");
        //console.log(payload);

        let beCreateCrossServerDto: BECreateCrossServerDto = payload;
        let sgin = `${beCreateCrossServerDto.gameId}${beCreateCrossServerDto.crossServerId}${webApiConstants.secret}${beCreateCrossServerDto.time}`;
        let sgin_md5 = new MD5().hex_md5(sgin).toLowerCase();
        //console.log("sgin_md5:", sgin_md5);
        if (beCreateCrossServerDto.key !== sgin_md5) {
            return false;
        }

        return true;
    }
}