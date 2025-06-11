import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from 'apps/web-backend/src/backend-system/login/dto/login.dto';
import { BackendDataService, rKey_User_JWT } from 'apps/web-backend/src/data/backend-data/backend-data.service';
import { UserEntity } from 'apps/web-backend/src/entity/user.entity';
import MD5 from 'apps/web-game/src/game-lib/md5';
import { cTools } from 'apps/web-game/src/game-lib/tools';



@Injectable()
export class BackendAuthService {

    constructor(
        private readonly jwtService: JwtService,
        private readonly backendDate: BackendDataService,
    ) {
    }

    async validateUser(data: LoginDto): Promise<any> {
        //data.username data.password
        // console.log("validateUser");
        // console.log(data);
        let userEntity = await this.backendDate.getUserData(data, true);

        if (!userEntity) { return false }

        let cur_md5 = new MD5().hex_md5(data.password).toLowerCase();
        if (userEntity.username === data.username && cur_md5 === userEntity.password) {
            return true
        }

        return false;
    }

    async validateJwtBE(username: string, jwt: string) {

        let cur_jwt = await this.backendDate.getGameCacheService().getJSON(rKey_User_JWT({ username: username }));

        if (cur_jwt !== jwt) {
            return false;
        }

        return true;
    }

    async jwtSignBE(username: string, nickname: string): Promise<string> {
        //console.log("role:",role);
        const payload = { username: username, nickname: nickname, time: cTools.newLocalDateString() };
        return this.jwtService.sign(payload);
    }
}
