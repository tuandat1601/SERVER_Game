import { Module } from '@nestjs/common';
import { GamesMgrService } from './games-mgr.service';
import { GamesMgrController } from './games-mgr.controller';
import { BackendDataModule } from '../../data/backend-data/backend-data.module';
import { PrismaCrossModule } from 'apps/web-cross-server/src/datadb/prisma.cross.module';

@Module({
  imports: [BackendDataModule, PrismaCrossModule],
  controllers: [GamesMgrController],
  providers: [GamesMgrService],
  exports: [GamesMgrService],
})
export class GamesMgrModule { }
