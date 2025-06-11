import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { BackendDataModule } from '../../data/backend-data/backend-data.module';

@Module({
  imports: [BackendDataModule],
  controllers: [UserController],
  providers: [UserService]
})
export class UserModule { }
