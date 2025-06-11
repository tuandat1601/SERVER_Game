import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super();
  }

  async validate(userid: string, password: string): Promise<any> {

    // const user = await this.authService.validateUser(userid, password);
    // if (!user) {
    //   throw new UnauthorizedException();
    // }
    // return user;
    return null;
  }
}
