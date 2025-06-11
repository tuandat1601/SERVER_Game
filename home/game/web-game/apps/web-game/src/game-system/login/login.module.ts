import { Module } from '@nestjs/common';
import { LoginService } from './login.service';
import { LoginController } from './login.controller';
import { AuthModule } from '../../common/auth/auth.module';
import { RoleModule } from "../../game-data/role/role.module";
import { GameDataModule } from "../../game-data/gamedata.module";

@Module({
  imports:[AuthModule,RoleModule,GameDataModule],
  controllers: [LoginController],
  providers: [LoginService]
})
export class LoginModule {}
