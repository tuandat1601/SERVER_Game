import { Module } from '@nestjs/common';
import { QipaService } from './qipa.service';
import { QipaController } from './qipa.controller';
import { BackendDataModule } from '../../data/backend-data/backend-data.module';
import { GamesMgrModule } from '../../backend-system/games-mgr/games-mgr.module';

@Module({
  imports: [BackendDataModule, GamesMgrModule],
  controllers: [QipaController],
  providers: [QipaService],
  exports: [QipaService]
})
export class QipaModule { }
