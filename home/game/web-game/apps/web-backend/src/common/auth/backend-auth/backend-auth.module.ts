import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { jwtBEConstants } from 'apps/web-backend/src/common/constants';
import { BackendDataModule } from 'apps/web-backend/src/data/backend-data/backend-data.module';
import { JwtStrategy } from '../strategies/jwt.strategy';
import { LocalStrategy } from '../strategies/local.strategy';
import { BackendAuthService } from './backend-auth.service';

@Module({
  imports: [
    BackendDataModule,
    JwtModule.register({
      secret: jwtBEConstants.secret,
      signOptions: { expiresIn: '7200s' },
    }),
  ],
  providers: [BackendAuthService, JwtStrategy, LocalStrategy],
  exports: [BackendAuthService],
})
export class BackendAuthModule { }
