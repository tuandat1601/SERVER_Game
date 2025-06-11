import { Module } from '@nestjs/common';
import { LoginService } from './login.service';
import { LoginController } from './login.controller';
import { BackendDataModule } from '../../data/backend-data/backend-data.module';
import { BackendAuthModule } from '../../common/auth/backend-auth/backend-auth.module';

@Module({
  imports: [BackendDataModule, BackendAuthModule],
  controllers: [LoginController],
  providers: [LoginService]
})
export class LoginModule { }
