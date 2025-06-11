import { Module } from '@nestjs/common';
import { BackendDataModule } from '../../data/backend-data/backend-data.module';
import { BackendAuthModule } from '../../common/auth/backend-auth/backend-auth.module';
import { OperationsController } from './operations.controller';
import { OperationsService } from './operations.service';
import { HttpModule } from '@nestjs/axios';
import { GamesMgrModule } from '../games-mgr/games-mgr.module';

@Module({
  imports: [BackendDataModule, BackendAuthModule, GamesMgrModule],  //, HttpModule
  controllers: [OperationsController],
  providers: [OperationsService]
})
export class OperationsModule {}
